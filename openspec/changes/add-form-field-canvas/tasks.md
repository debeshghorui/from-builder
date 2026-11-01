# Tasks

## 1. Support insertion-position field creation

- [x] 1.1 Extend the field creation service and input schemas with an optional zero-based position; create the field and normalize the complete ordered index set in one transaction, rejecting invalid positions and the 100-field limit; verify inserts at the start, middle, and end, plus append behavior for callers that omit position.
- [x] 1.2 Expose position-aware creation through the protected TRPC route and client hook while preserving current callers; verify form ownership checks, returned field ID, and existing append behavior.

## 2. Build the palette and canvas layout

- [x] 2.1 Replace the modal-first builder layout with a responsive left field palette, central canvas, and selected-field inspector; verify the canvas remains visible and palette/settings are reachable at narrow viewport widths.
- [x] 2.2 Render the supported field types as named palette controls and canvas fields as selectable cards; verify empty, loading, error, at-limit, and selected states remain clear and the field limit disables additions.

## 3. Add and arrange fields on the canvas

- [x] 3.1 Add palette-to-canvas drag-and-drop that creates a default-labeled field at the drop position, selects it, and opens its settings; verify drops at the beginning, between fields, and end preserve the resulting order after reload.
- [x] 3.2 Add click-to-add and keyboard-accessible canvas selection/reordering with clear focus and live announcements; verify users can add and arrange fields without pointer input and touch users can activate palette controls.

## 4. Configure fields in the inspector

- [x] 4.1 Move existing create/edit inputs and validation into the selected-field inspector with explicit save/cancel actions; verify labels, descriptions, placeholders, type, required state, and options JSON round-trip without changing other fields.
- [x] 4.2 Guard selection changes and inspector close when edits are unsaved, and retain delete confirmation in the inspector workflow; verify save, discard, continue-editing, and delete paths.

## 5. Verify the complete builder flow

- [ ] 5.1 Verify creating by drop and click, editing, deleting, reordering, reloading, and narrow-screen operation together, and confirm no new dependency or database migration is required.
