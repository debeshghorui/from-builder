# Design

## Context

See `proposal.md` for motivation and `specs/form-flow/spec.md` and `specs/form-responses/spec.md` for externally visible behavior. The app uses Next.js App Router, tRPC, service modules, PostgreSQL with Drizzle, and form fields currently have a single numeric order per form. Existing form records include password and participant-limit columns, but there is no respondent route or submission model.

## Goals / Non-Goals

**Goals:**

- Represent pages, page contents, and conditional or ordinary transitions in a way that supports both a node canvas and a public respondent flow.
- Keep owner-only editing separate from public, published-form access.
- Enforce password access, response limits, and answer validation on the server.
- Preserve answers while navigating backward and through branches.

**Non-Goals:**

- Real-time multi-user editing of the flow canvas.
- A general-purpose workflow automation engine or arbitrary actions beyond routing to form pages.
- Anonymous per-person enforcement based on unreliable browser fingerprints.
- Editing already submitted responses.

## Decisions

### Model the flow as persisted pages and directed connections

Add page records owned by a form and connection records from one page to another. A page holds its title and position for initial canvas placement; connections hold the source, destination, and optional answer condition (question, operator, and matching value). Associate each field with a page while retaining its order within that page. Store graph relationships explicitly instead of embedding the entire graph in one form JSON value, so ownership, referential integrity, and targeted updates remain manageable.

The canvas can render pages as nodes and connections as edges. Its inspector edits the selected page, connection, or routing condition. Use the existing drag-and-drop interaction dependencies where suitable; do not add a graph library until the current canvas interaction needs are evaluated.

**Alternative considered:** Store the complete flow as one JSON document. That simplifies initial persistence, but makes field association, referential checks, and partial edits harder to validate.

### Resolve transitions deterministically

On Next, match conditional connections for the respondent's answers on the current page. When one condition matches, follow that destination. When no condition matches, use the page's ordinary next connection if present; when none exists, end the flow and offer submission. Publishing validates the start page and all connection targets. Routing conditions must refer to a question on their source page and a supported answer value. Prevent ambiguous multiple matching destinations for the same answer outcome during save or publish.

**Alternative considered:** Require a default connection from every non-terminal page. That adds clarity but makes branching pages harder to configure and adds no useful destination when a route is intentionally terminal.

### Keep the respondent runtime separate from the owner builder

Create public form procedures and a respondent route that expose only published form content and public settings. Password verification and answer submission happen server-side; protected form data is not returned before successful password validation. Password entry creates a short-lived signed access token scoped to the form, and subsequent runtime requests validate that token. Never return stored password material in owner or public form responses.

**Alternative considered:** Return the password to the client and compare there. This exposes the password to every visitor and cannot protect the form.

### Persist submissions and use email as the respondent key when collected

Create submission records for form, email when collected, status/timestamps, and answer data; answer payloads should retain stable field identifiers so edits to labels do not rewrite historical submissions. Enforce both total and per-email limits in a transaction that locks the form row and counts applicable responses before inserting. Email comparison should be normalized consistently (trimmed and case-folded). Anonymous responses have no stable identity; if the owner configures a per-respondent cap, require email collection or reject the conflicting settings.

Map existing participant-limit settings to the total response cap only after confirming their current UI meaning during implementation; add an explicit per-respondent cap and email-collection mode. Do not treat IP address or a browser cookie as a trustworthy identity for a per-person cap.

**Alternative considered:** Store a client-generated respondent identifier. It can be cleared or changed and does not meet the owner's expectation of limiting one person.

### Preserve respondent progress through the active journey

Keep answers keyed by stable field ID and track the visited page path in runtime state. Back returns to the previous visited page, including when the journey branched. Server-side submission validation checks that answers belong to the form and satisfy required questions on visited pages; hidden, unvisited branch questions are not required.

**Alternative considered:** Recompute Back from graph edges. Branching graphs can have multiple predecessors, so this would not reliably return to the respondent's actual prior page.

## Risks / Trade-offs

- **A form owner changes the graph after respondents start →** Version published flows or snapshot the flow version on response start so in-progress responses remain coherent.
- **Two requests race at the total or per-email limit →** Lock the form row and perform the count and insert in one database transaction.
- **A malicious client submits answers for hidden questions →** Validate submitted field IDs and visited page path against the published flow on the server.
- **Password access tokens leak →** Scope tokens to one form, expire them, and avoid logging them; rate-limit password attempts.
- **Email is personal data →** Restrict access to response owners and provide response deletion/export behavior consistent with product policy.
- **Graph editing produces cycles or unreachable pages →** Validate graph structure and show actionable canvas errors before publishing; allow intentional cycles only if respondent progress and termination behavior are defined.
- **Owner changes a published form while a respondent is answering →** Store a published flow version and bind the respondent session to that version.

## Migration Plan

1. Add page, connection, and submission tables plus field-to-page association and email/response-limit settings through additive migrations.
2. Backfill each existing form's fields into a generated first page while preserving field order; provide a single terminal page flow for existing forms.
3. Deploy owner builder and flow-management APIs, keeping existing forms editable during migration.
4. Deploy published respondent access, password verification, and submission handling.
5. Rollback by disabling new public flow routes and builder entry points; retain additive tables and backfilled page records until a later migration can safely remove them.
