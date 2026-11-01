# Spec Delta

## Purpose

Defines how users organize and maintain their form fields, including accessible ordering, persistent changes, and clear recovery when an update cannot be saved.

## ADDED Requirements

### Requirement: Users can reorder form fields accessibly

The form builder SHALL let users change field order with a clear drag handle that supports pointer, touch, and keyboard interaction.

#### Scenario: Move a field to a new position

- **WHEN** a user drags or keyboard-moves a field to another position
- **THEN** the field list immediately shows the new order and updated position numbers
- **AND** the field's label, type, description, required state, and options remain attached to that field

#### Scenario: Discover drag controls with assistive technology

- **WHEN** a user navigates the field list with a keyboard or screen reader
- **THEN** each reorder control has an accessible name and communicates that the field can be moved
- **AND** the user can move the field without pointer input

### Requirement: Reordered fields persist in respondent order

The form builder SHALL save a completed reorder using the existing field ordering model and preserve that order when the form is reopened or loaded for respondents.

#### Scenario: Save a reordered field list

- **WHEN** a user completes a reorder
- **THEN** the new order is persisted and remains the same after the builder is reloaded
- **AND** respondents receive the fields in that same order

#### Scenario: Reorder persistence fails

- **WHEN** the builder cannot save a completed reorder
- **THEN** it restores the last saved order and shows a clear error message
- **AND** it does not present an unsaved order as though it were persisted

### Requirement: Reordering does not change field content

Changing a field's position SHALL not alter its configuration or the existing create, edit, and delete workflows.

#### Scenario: Move a configured field

- **WHEN** a user reorders a field that has saved configuration
- **THEN** its field type, label, description, placeholder, required state, options, and identifier remain unchanged
- **AND** the user can still edit or delete that field using the existing controls
