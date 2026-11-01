# Design

## Context

See `proposal.md` for motivation and `specs/form-management/spec.md` for user-visible behavior. The builder currently renders an ordered list with a modal for creating and editing fields. The existing create operation appends fields and requires a nonempty label; the reorder operation accepts the complete ordered field ID list. dnd-kit is already installed and used for sortable lists.

## Goals / Non-Goals

**Goals:**

- Make the canvas the main working area, with a field palette on the left and selected-field settings on the right on wide screens.
- Reuse current field types, validation, and create/update/delete behavior.
- Preserve requested drop placement when the new field is saved.
- Keep all builder actions available on narrow screens and without drag input.

**Non-Goals:**

- Adding new field types, question-specific option editors, or a respondent preview.
- Adding a new drag-and-drop dependency or database column.
- Changing the form field persistence model away from the existing `index` values.

## Decisions

### Use a three-area builder with a persistent canvas

Use a responsive CSS grid: palette, canvas, and selected-field inspector at desktop widths. Keep the canvas central and primary. On narrow screens, expose palette and inspector through existing drawer/sheet UI patterns while leaving the canvas visible. Avoid the `react-resizable-panels` package because its current installed API does not match the components in the repo's resizable wrapper.

**Alternative considered:** Put both palette and settings in a single sidebar. This reduces horizontal space use, but forces users to switch modes and hides the selected field's settings while browsing field types.

### Create a valid default field at the requested position

Palette entries are draggable and also have a click-to-add action. A drop onto the canvas creates the selected type with label “Untitled question” and opens it in the inspector. Clicking a palette entry appends a field and opens the same inspector. Extend the create input with an optional zero-based insertion position. In the service, read the current ordered IDs, insert the new field ID at the requested position, and assign consecutive two-decimal indices in one transaction. When position is omitted, append. Enforce the existing 100-field maximum server-side as well as in the UI.

**Rationale:** The create operation currently requires a label and appends at the end. A valid default satisfies validation, while one transaction preserves the drop target position without a partially reordered field list.

**Alternative considered:** Create at the end, then call reorder as a second request. If the second request fails, the newly added field remains at the wrong position.

### Share the sortable canvas with selected-field editing

Use one dnd-kit context for palette items and sortable canvas fields. Palette drags create at the corresponding canvas insertion point; canvas handles keep the existing reorder behavior. Clicking or keyboard-activating a canvas field selects it and loads its saved values in the inspector. Keep edit and delete actions available there.

**Rationale:** A single canvas interaction model makes adding and arranging fields feel consistent and reuses the existing ordering support.

**Alternative considered:** Keep the old list drag context and add a separate palette drag context. Nested or adjacent contexts make cross-area drop targets and keyboard behavior harder to reason about.

### Keep explicit save semantics in the inspector

Use a controlled inspector form with Save and Cancel actions, preserving the current explicit-save behavior. When the selected field has unsaved edits and the user selects another field or closes the inspector, prompt to save, discard, or continue editing. Newly created default fields are already persisted before the inspector opens.

**Rationale:** The existing modal saves changes only after submission. Preserving this avoids sending partially edited configuration to the server and gives selection changes a clear unsaved-state outcome.

**Alternative considered:** Save every input on change. This creates frequent mutations and can persist half-entered values or invalid options JSON.

### Provide non-drag and assistive-technology paths

Palette entries are focusable buttons with accessible names and click-to-add behavior. Canvas cards are selectable buttons with a visible selected state. Retain keyboard sorting handles and announce creation, selection, save, and failure through a polite live region. On touch screens, palette items remain tappable even if dragging is unavailable or difficult.

**Rationale:** Dragging cannot be the only way to add or select fields; the existing builder already supports keyboard reordering.

**Alternative considered:** Require drag-and-drop for adding. This excludes keyboard users and makes touch interaction less dependable.

## Risks / Trade-offs

- **Insertion transaction encounters stale fields or hits the maximum** → Validate the current field count and position inside the transaction; return a clear error without writing partial indices.
- **A new field cannot be saved at the requested position** → Create the field and assign all positions in one transaction so there is no intermediate appended state.
- **Inspector changes are lost during selection changes** → Track dirty state and require an explicit save, discard, or continue choice.
- **Three areas feel cramped on smaller screens** → Keep the canvas visible and move the palette and inspector into independently opened responsive drawers.
- **Palette and sortable items have conflicting drag targets** → Use distinct sortable IDs and test drag start/over/end for palette-to-canvas and canvas-to-canvas interactions.

## Migration Plan

1. Extend field creation input and service to support optional transactional insertion while preserving append behavior for existing callers.
2. Build the responsive palette/canvas/inspector layout and combined drag/drop interactions.
3. Move add/edit controls into the inspector, retaining existing validation and save/delete operations.
4. Verify click-to-add, palette drops at different positions, canvas reorder, field settings persistence, and narrow-screen operation.

No data migration is required. The change can be rolled back by restoring the modal and the existing append-only field creation path; persisted indices remain compatible.
