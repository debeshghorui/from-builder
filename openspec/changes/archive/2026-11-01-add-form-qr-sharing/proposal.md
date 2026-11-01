# Proposal

## Why

Form owners need a quick way to let people open a published form from a phone or printed material. A QR code beside the published form controls makes the public form easy to scan, copy, and distribute.

## What Changes

- Add a QR sharing panel to the form builder for published forms.
- Let owners copy the public form URL and download the QR code as a PNG.
- Keep QR access subject to the form’s existing password, email collection, anonymous response, and response limit settings.

## Capabilities

### New Capabilities

- `form-sharing`: Share a published form through its public URL and a downloadable QR code.

### Modified Capabilities

- None.

## Impact

- Form builder UI in `apps/web/app/dashboard/forms/[id]/page.tsx` and related sharing components.
- Public respondent route at `/form/[id]`, which remains the QR destination.
- A browser-side QR generation dependency may be added. No API or database changes are expected.
