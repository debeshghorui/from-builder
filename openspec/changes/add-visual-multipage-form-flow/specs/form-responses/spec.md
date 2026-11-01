# Spec Delta

## Purpose

Stores completed form responses and applies owner-configured limits to the total number of responses and the number associated with an identified respondent.

## ADDED Requirements

### Requirement: The system records completed form responses

The system SHALL save a respondent's answers as one response associated with the form and its respondent identity when available.

#### Scenario: Submit a completed form

- **WHEN** a respondent completes the form and submits valid answers
- **THEN** the system stores the answers and confirms successful submission

#### Scenario: Reject invalid submission

- **WHEN** a respondent submits answers that do not satisfy required fields or configured page routing
- **THEN** the system rejects the response and identifies what must be corrected

### Requirement: Owners configure response count limits

The system SHALL let owners set the maximum total number of responses and the maximum number of responses per identified respondent.

#### Scenario: Enforce total response limit

- **WHEN** the form has reached its configured total response limit
- **THEN** the system prevents another response from being submitted

#### Scenario: Enforce per-respondent response limit

- **WHEN** an identified respondent has reached the configured per-respondent limit
- **THEN** the system prevents that respondent from submitting another response

#### Scenario: Multiple responses are allowed

- **WHEN** an owner sets the per-respondent limit above one
- **THEN** the system accepts responses from that respondent until the configured limit is reached

### Requirement: The system consistently identifies respondents when email collection is enabled

The system SHALL associate responses with the collected email address when the owner requires email collection.

#### Scenario: Same email submits again

- **WHEN** a respondent submits using an email address already associated with prior responses
- **THEN** the per-respondent limit is evaluated against that email address

### Requirement: Anonymous responses can be stored without respondent identity

The system SHALL store responses without an email when the owner allows anonymous responses.

#### Scenario: Anonymous submission

- **WHEN** an owner allows anonymous responses and a respondent submits without an email
- **THEN** the system stores the response without respondent identity

#### Scenario: Per-respondent limit with anonymous responses

- **WHEN** anonymous responses are allowed and a per-respondent limit is configured
- **THEN** the system requires an email for that form or disallows the per-respondent limit configuration

### Requirement: Owners can review submitted responses

The system SHALL let the form owner view the responses submitted to their form.

#### Scenario: View response list

- **WHEN** the owner opens the form's responses
- **THEN** the system shows the saved responses and their submission times

#### Scenario: View response answers

- **WHEN** the owner opens a response
- **THEN** the system shows its recorded answers and collected email when present
