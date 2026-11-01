# Design

## Context

See `proposal.md` for motivation and `specs/form-management/spec.md` for user-visible behavior. The form builder currently renders fields in the order returned by the API and offers edit and delete actions, but no reorder control. The database already stores a two-decimal `index`; reads sort by it, and the existing update input accepts an index for one field. The dashboard data table demonstrates pointer, touch, and keyboard sorting, but only reorders local sample data.

## Goals / Non-Goals

**Goals:**

- Let users reorder real form fields directly in the form builder.
- Persist the ordered list atomically using the existing index column.
- Keep field data and existing create, edit, and delete behavior intact.
- Make the field list and editor understandable with pointer, touch, keyboard, and screen-reader interaction.

**Non-Goals:**

- Adding a database column or changing respondent-facing field types.
- Persisting the dashboard data-table sample reorder.
- Replacing the forms index or its create flow.
- Adding a separate save-order mode.

## Decisions

### Save an ordered ID list through one protected operation

Add a form-field reorder input that carries the form ID and the complete ordered field ID list. The protected route verifies form ownership. The service verifies the list contains each current field exactly once, then writes normalized two-decimal indices in one database transaction. The existing index column and sorted read path remain the source of truth; no migration is needed.

**Rationale:** Updating each field through the existing single-field endpoint would require multiple requests and could leave a partially applied order if one request failed. A single transactional operation gives the UI a clear success or failure result.

**Alternative considered:** Call the current update endpoint for each moved field. This needs no API addition but adds multiple invalidations and cannot guarantee the list is saved as a unit.

### Reuse the existing sortable interaction pattern in the field list

Add a dedicated drag handle to each field row and use pointer, touch, and keyboard sensors with vertical sorting. Keep the existing list and row actions; do not turn the form fields into a data table. Update the displayed position numbers as the user moves a field.

**Rationale:** The project already includes the drag-and-drop package and a working sensor pattern. A handle keeps edit/delete controls separate from dragging and makes the interaction discoverable.

**Alternative considered:** Drag from anywhere on the row. This is harder to discover and risks starting a drag when users intend to edit or select field text.

### Save immediately after a drop with recoverable optimistic feedback

Show the tentative order immediately, disable additional reorder actions while saving, and announce the saving state accessibly. On success, keep the new order. On failure, restore the last saved order and show an error. Re-fetch or invalidate the form-field query after the operation so the server remains authoritative.

**Rationale:** Immediate save matches the user's expectation that moving a field changes its respondent order without an extra commit step. Rollback prevents the UI from showing an order that was not persisted.

**Alternative considered:** Add an explicit Save order button. This adds a separate unsaved state and a second decision after every reorder.

### Clarify the existing field editor without changing its data format

Keep the current create/edit dialog and supported fields. Group core field details, type/required settings, and optional advanced JSON configuration so users can identify the common inputs first. Preserve the JSON options shape and validation behavior.

**Rationale:** The current editor already supports the needed field data; a clearer hierarchy improves use without changing stored content or field compatibility.

**Alternative considered:** Replace JSON options with type-specific controls. That needs product rules for each options shape, which the current code does not define.

## Risks / Trade-offs

- **Stale or incomplete field IDs reach the reorder operation** → Validate ownership and require the submitted ID set to match the current fields for the form before writing.
- **Index precision or field limits are exceeded** → Keep the existing 100-field limit and assign ordered two-decimal positions within the supported range.
- **A save fails after optimistic movement** → Restore the last server order, announce the failure, and allow the user to retry.
- **Another editor changes the form during a reorder** → Reject stale ID sets and refresh the field query rather than silently dropping a newly added field.

## Migration Plan

1. Add the validated, transactional reorder operation using the existing `index` field.
2. Add a client hook for reorder success/error invalidation.
3. Add accessible drag handles, keyboard/touch sorting, optimistic movement, and rollback to the builder.
4. Refine the field editor's grouping while preserving its existing saved values.
5. Verify order after reload and through the respondent field query; no data migration or rollout sequencing is required.

Rollback can remove the reorder operation and controls; the existing field index values and CRUD endpoints remain compatible.
