# Published form QR sharing

## Intent

Let form owners share a published form by showing its QR code on the form builder page, so respondents can open it by scanning.

## Scope and constraints

- Show the QR sharing panel only while the form is published; hide it again after unpublishing.
- Encode the same public URL used by the existing “Open form” action (`/form/{id}`), using the current application origin.
- Provide copy-link and PNG download actions beside the QR code.
- Scanning must preserve existing password, email/anonymous, and response-limit behavior. Do not encode credentials or a password bypass.
- Keep the feature within the existing form builder UI and ChaiUI styling.
- Use a small QR-generation dependency in the browser; no third-party QR image service.

## Approaches

1. Put a QR directly in the builder: selected. It keeps the scan target and share actions with the published form controls and avoids an extra dialog.
2. Put QR and sharing controls in a dialog: not selected. It saves builder space, but adds an extra step to a simple sharing task.

## Implementation decisions

- Add a compact “Share form” card near the builder’s publish controls when published.
- Render a high-contrast QR for the public form URL; provide accessible labels and feedback after copy/download.
- The copy action copies the public URL. The download action saves a PNG QR image.
- Draft forms show no QR card. No backend changes are needed.

## Approval

Proposed from the user’s request; awaiting approval before implementation.
