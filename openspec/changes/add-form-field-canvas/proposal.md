# Proposal

## Why

Adding a form field currently requires opening a modal, completing its details, and then returning to the field list. A canvas-based builder with a visible component palette will make it easier to build and understand a form as its questions take shape.

## What Changes

- Replace the modal-first field addition flow with a responsive builder layout containing a field palette and a central form canvas.
- Let users drag a field type from the palette onto the canvas; dropping creates an “Untitled question” and opens its settings for editing.
- Keep click-to-add available for keyboard users and provide an accessible way to reorder existing canvas fields.
- Show settings for the selected field in a side panel, preserving all supported field types, labels, descriptions, placeholders, required state, and options data.
- Adapt the palette and settings panel for narrow screens without losing access to the canvas or field controls.

## Capabilities

### New Capabilities

- `form-management`: Defines canvas-based creation and editing of fields through a component palette, central canvas, and selected-field settings.

### Modified Capabilities

None

## Impact

- Form builder route at `apps/web/app/dashboard/forms/[id]/page.tsx` and supporting components.
- Existing create, update, delete, and reorder form-field hooks and protected TRPC operations.
- Existing field creation service, which requires a nonempty label and assigns ordering indices.
- Existing dnd-kit dependencies; no new dependency or database migration is expected.

Scope assumption: dropping or clicking a palette item creates a field with the default label “Untitled question” and selects it for configuration. The existing modal will be replaced by the side settings panel for adding and editing fields.
