# Design

## Context

See `proposal.md` for motivation and `specs/form-respondent-experience/spec.md` for respondent-facing requirements. The public route already owns form loading, password verification, email or anonymous entry, page routing, validation, answer state, review, and submission. Keep those mechanics in place and improve their presentation in the ChaiUI design system. Conditional connections can produce journeys with different lengths, so a fixed total-page label would be misleading.

## Goals / Non-Goals

**Goals:**

- Make each configured page read as one guided step with a strong title, grouped questions, and clear navigation.
- Give the entry gates, questionnaire, review, loading, error, and success states a consistent visual hierarchy.
- Keep keyboard focus and validation feedback aligned with the visible question controls.
- Support narrow phone widths without horizontal scrolling.

**Non-Goals:**

- Change the form flow model, branch matching, access checks, submission payload, or persistence.
- Add a fixed total-step promise for branched flows.
- Add new answer field types, autosave, or a respondent account system.

## Decisions

### Keep configured page groups as the navigation unit

Render the questions belonging to the current configured page together, with the page title above them and Back plus the primary forward action in a distinct footer. This matches the existing flow and avoids turning a branched journey into a long sequence of individual question screens.

**Alternative considered:** Show one question per screen. That can reduce the initial visual load, but it adds extra navigation for every field and conflicts with the agreed grouped-page direction.

### Use branch-safe progress feedback

Show the current visited step and a visual progress cue without claiming the total number of configured pages as the respondent's guaranteed journey length. Treat the last reached step as completion when the respondent enters review. Do not estimate or pre-compute the remaining route because future branch choices are unknown.

**Alternative considered:** Display “Step N of M” using all pages in the graph. That is inaccurate when a branch skips pages or ends early.

### Share a consistent respondent shell across states

Use one responsive content width and form identity header for access gates and the questionnaire. Place password and identity prompts in focused panels, keep loading and unavailable states readable, and make review and completion states visually distinct. Use existing semantic tokens, `card-chai`, shared button/input components, and sentence-case copy.

**Alternative considered:** Create a separate visual shell for every state. That makes transitions feel like unrelated pages and increases styling drift.

### Preserve the controller and improve field semantics at the view boundary

Keep the current route's query and mutation state, answer map, visited-page path, and submit logic. Improve focus targets, labels, error association, progress semantics, and responsive layout in the rendered controls. Required-answer validation remains page-scoped and focuses the first unanswered control, including the radio group used by Yes/No fields.

**Alternative considered:** Extract a new form runtime or move state into a new abstraction. The redesign does not require that architectural change and would increase regression risk.

## Risks / Trade-offs

- [A visual progress bar can imply a known remaining length] → Pair it with a current-step label and avoid showing a fixed total for conditional flows; complete it at the review state.
- [Existing page state branches may become visually inconsistent during restyling] → Apply the shared shell and component tokens to all respondent states in the route.
- [Radio answers currently lack a dedicated focus target] → Add a stable focusable group target while preserving native radio keyboard behavior.
- [Long titles, labels, and descriptions can overflow on phones] → Allow wrapping, constrain content width, and use min-width-safe layouts for the card and action row.

## Migration Plan

No data or API migration is required. Replace the respondent route's presentation in place. Rollback by restoring the previous presentation while retaining the existing respondent flow controller and server contracts.
