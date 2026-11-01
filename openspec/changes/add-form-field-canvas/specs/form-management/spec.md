# Spec Delta

## Purpose

Defines a visual form-building workflow where users add question types from a palette, arrange them on a canvas, and configure the selected field in contextual settings.

## ADDED Requirements

### Requirement: Users can add field types from a component palette

The form builder SHALL let users add supported field types from a visible palette to the form canvas.

#### Scenario: Add a component by dragging

- **WHEN** a user drags a field type from the palette and drops it on the canvas
- **THEN** the builder creates a field with the default label “Untitled question” and the selected type
- **AND** the new field appears at the drop position, becomes selected, and its settings are shown

#### Scenario: Add a component without dragging

- **WHEN** a keyboard or assistive-technology user activates a palette item
- **THEN** the builder adds that field type to the end of the canvas and selects it for configuration

#### Scenario: Field limit reached

- **WHEN** the form already contains the maximum supported number of fields
- **THEN** palette items cannot add another field and the builder explains the limit

### Requirement: Users can configure a selected canvas field

The form builder SHALL show settings for the selected field and save its supported configuration without changing other fields.

#### Scenario: Edit selected field settings

- **WHEN** a user selects a field on the canvas and changes its label, description, placeholder, type, required state, or options
- **THEN** the selected field is updated with those values
- **AND** other canvas fields keep their saved configuration and order

#### Scenario: Select a different field

- **WHEN** a user selects another canvas field
- **THEN** the settings panel shows that field’s saved values
- **AND** unsaved changes to the previous field are not silently discarded

### Requirement: The canvas builder remains usable on small screens

The form builder SHALL keep field addition, selection, and configuration available at narrow viewport widths.

#### Scenario: Use the builder on a narrow screen

- **WHEN** the viewport cannot show the palette, canvas, and settings side by side
- **THEN** the canvas remains the primary visible area
- **AND** the user can open the palette and selected-field settings in responsive panels

### Requirement: Palette and canvas controls are accessible

The form builder SHALL provide keyboard-accessible field addition and selection with clear names and focus states.

#### Scenario: Navigate palette and canvas by keyboard

- **WHEN** a user navigates the builder without a pointer
- **THEN** each palette item and canvas field can be focused and activated
- **AND** selection and field creation are communicated to assistive technology
