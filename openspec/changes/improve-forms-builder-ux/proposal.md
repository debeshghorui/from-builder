# Proposal

## Why

The form builder supports creating, editing, and deleting fields, and the backend already stores field order, but users cannot rearrange questions in the builder. Adding an accessible reorder interaction will let users control the sequence respondents see while making field management easier to scan and recover from errors.

## What Changes

- Add drag-and-drop field reordering in the form builder, with keyboard and touch support.
- Persist each completed reorder using the existing field index model and restore the prior order with clear feedback if saving fails.
- Improve field-list and field-editor interaction clarity while preserving existing field types, data, and create/edit/delete workflows.
- Keep the forms index and existing form creation behavior available alongside the improved builder.

## Capabilities

### New Capabilities

- `form-management`: Defines how users manage form fields, including accessible ordering, persistence, and reliable feedback during field editing.

### Modified Capabilities

None.

## Impact

- Form routes: `apps/web/app/dashboard/forms/page.tsx` and `apps/web/app/dashboard/forms/[id]/page.tsx`.
- Form field client hooks and TRPC schemas/routes under `apps/web/hooks/api/form/` and `packages/trpc/server/routes/form/`.
- Form field service under `packages/services/form-fields/` to persist an ordered set using the existing `index` values.
- No database schema migration or new dependency is expected.

Scope assumption: reordering saves automatically when the user drops a field; no separate “Save order” step is added.
