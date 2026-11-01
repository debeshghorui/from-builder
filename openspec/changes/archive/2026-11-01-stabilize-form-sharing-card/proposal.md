# Proposal

## Why

Publishing currently mounts the share card below the form builder heading, while unpublishing removes it. This shifts the builder content, and the current QR tile and finder styling feels visually detached from the app.

## What Changes

- Reserve a stable share-card slot in the top-right area of the form builder.
- Keep the card visible but disabled while the form is unpublished, with a clear prompt to publish before sharing.
- Show the QR, copy link, and download actions in the same card when published, without changing the surrounding layout.
- Refine the QR card styling to match the app while retaining the dotted pattern and reliable scanning.
- On narrow screens, place the same stable card in the normal stacked layout.

## Capabilities

### New Capabilities

- `form-sharing-presentation`: Stable placement and published/unpublished presentation of the form-sharing card.

### Modified Capabilities

- None. The repository has no archived specs yet; the existing `form-sharing` behavior is tracked in the completed `add-form-qr-sharing` change.

## Impact

- Builder page layout in `apps/web/app/dashboard/forms/[id]/page.tsx`.
- QR card presentation in `apps/web/components/form-builder/form-sharing-card.tsx`.
- No API, database, route, or package changes are expected.
