# form-sharing Specification

## Purpose

Allows form owners to share published forms by copying a public link or downloading a QR code that opens the same respondent experience.

## Requirements

### Requirement: Published forms expose QR sharing

The form builder SHALL show a QR code for the public respondent URL only while the form is published. The QR code SHALL use round data modules and retain clear finder markers and a quiet zone for scanning.

#### Scenario: Published form sharing

- **WHEN** an owner views a published form in the builder
- **THEN** the builder shows a QR code that resolves to that form's public respondent URL

#### Scenario: Draft or unpublished form

- **WHEN** an owner views a draft or unpublished form in the builder
- **THEN** the builder does not show a usable QR code

### Requirement: Owners can copy and download form sharing details

The form builder SHALL let an owner copy the public respondent URL and download the displayed QR code as a PNG image.

#### Scenario: Copy public URL

- **WHEN** an owner chooses the copy-link action for a published form
- **THEN** the public respondent URL is copied and the builder reports whether the action succeeded

#### Scenario: Download QR image

- **WHEN** an owner chooses the QR download action for a published form
- **THEN** the builder downloads a PNG image encoding the same public respondent URL

### Requirement: QR access follows published form access rules

Opening a published form through its QR code SHALL use the existing public respondent route and SHALL enforce the form's configured password, identity collection, anonymity, and response limits.

#### Scenario: Password-protected form

- **WHEN** a respondent scans the QR code for a password-protected form
- **THEN** the public route requires the configured password before showing form questions

#### Scenario: Email or anonymous response settings

- **WHEN** a respondent scans a form QR code and opens the public form
- **THEN** the public route applies the form's configured email collection and anonymous response behavior

#### Scenario: Response limits

- **WHEN** a respondent scans a QR code for a form with response limits
- **THEN** submissions through that URL remain subject to the configured limits
