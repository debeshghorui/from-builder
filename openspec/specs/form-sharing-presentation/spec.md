# form-sharing-presentation Specification

## Purpose

Keeps form-sharing controls in a predictable location through publish state changes and presents the QR code in a visual style that fits the form builder.

## Requirements

### Requirement: Form sharing keeps a stable builder position

The builder SHALL reserve the form-sharing card in the top-right area on desktop and keep its layout position stable whether the form is published or unpublished.

#### Scenario: Unpublished form

- **WHEN** an owner views an unpublished form
- **THEN** the reserved share card is visible but disabled, explains that publishing enables sharing, and does not display a usable QR or copy/download actions

#### Scenario: Publish or unpublish

- **WHEN** an owner publishes or unpublishes the form
- **THEN** the share card content changes between disabled and enabled states without moving the surrounding builder content

#### Scenario: Narrow viewport

- **WHEN** an owner views the builder on a narrow viewport
- **THEN** the share card follows the builder's responsive layout without horizontal overflow and retains the same published-state behavior

### Requirement: Published form QR styling matches the builder

The published form-sharing card SHALL use a high-contrast dotted QR style with a clear quiet zone, and the QR preview and downloaded PNG SHALL match.

#### Scenario: QR remains scannable

- **WHEN** an owner downloads the published form QR code
- **THEN** scanning the image resolves to the form's public respondent URL
