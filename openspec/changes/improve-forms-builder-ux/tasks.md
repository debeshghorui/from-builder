# Tasks

## 1. Persist field ordering

- [x] 1.1 Add a validated form-field reorder input and transaction-backed service operation using the existing `index` values; verify duplicate, missing, foreign, and incomplete field ID lists are rejected and valid lists sort in the submitted order.
- [x] 1.2 Expose the reorder operation through the protected form route and add a client hook that refreshes field queries after success; verify ownership checks and that the refreshed query returns the saved order.

## 2. Add the reorder interaction

- [x] 2.1 Add dedicated drag handles and pointer, touch, and keyboard sorting to the builder field list; verify keyboard and pointer moves update the visible sequence and position numbers, with accessible control names and announcements.
- [x] 2.2 Save each completed drop with pending feedback, prevent concurrent reorder requests, and restore the last saved order with an error if saving fails; verify a successful order survives reload and a failed save restores the server order.

## 3. Clarify field management

- [x] 3.1 Refine field rows and group the existing create/edit dialog inputs while preserving the options JSON shape and all saved field values; verify create, edit, and delete remain available and reordering leaves each field's configuration unchanged.

## 4. Verify the complete flow

- [ ] 4.1 Verify the saved order is the order returned to respondents after reopening the builder, and confirm the implementation uses the current index column without a database migration or added dependency.
