# Design

## Context

The form builder already shows an “Open form” link for published forms. Respondents use `/form/{id}`, where password checks, identity collection, anonymity, and response limits are enforced. No QR-generation package is currently listed in `apps/web/package.json`.

## Goals / Non-Goals

**Goals:**

- Show the QR and sharing actions directly in the builder after publication.
- Encode the absolute public respondent URL for the current application origin.
- Let the owner copy the link and download a PNG of the QR.
- Keep existing public-form access behavior unchanged.

**Non-Goals:**

- QR access tokens or password bypasses.
- QR sharing for drafts or unpublished forms.
- Backend endpoints, database changes, analytics, or custom QR styling.

## Decisions

- Generate the QR in the browser with the `qrcode` package. This avoids sending respondent URLs to an external QR service and supports exporting the same QR as a PNG.
- Render the encoder's QR matrix to a canvas with round data modules; keep the three finder patterns square and preserve a four-module quiet zone so the dotted style remains easy to scan. Download the canvas itself so the preview and PNG match.
- Place a compact sharing card beside the published-form controls in the builder. Render it only when `form.published` is true; existing publish state updates determine when it appears or disappears.
- Build the URL from `window.location.origin` and `/form/{id}` so the QR and copy action use the same public route on the active deployment domain.
- Use browser clipboard support for copy and show success or failure feedback. Download the PNG from the generated QR data URL with a form-specific filename.
- Keep the QR high contrast with a quiet margin so it scans across themes and remains printable.

## Risks / Trade-offs

- [Clipboard API unavailable or denied] → Show a clear failure message and keep the public URL visible for manual selection.
- [QR generation or rendering fails] → Keep the link available and show an accessible error in place of the QR.
- [Current origin differs from the public canonical domain] → The active deployment origin is assumed to be the correct respondent host; no separate domain configuration exists in the current builder.

## Migration Plan

No data migration or backend rollout is required. Add the client-side package, deploy the builder UI, and revert the package and sharing component to roll back.
