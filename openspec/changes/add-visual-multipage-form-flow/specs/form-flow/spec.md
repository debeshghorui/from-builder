# Spec Delta

## Purpose

Enables form owners to build connected, multi-step respondent journeys and enables respondents to complete those journeys with access controls and clear navigation.

## ADDED Requirements

### Requirement: Owners can create and connect form pages visually

The system SHALL let form owners create, name, arrange, connect, and remove pages on a visual canvas.

#### Scenario: Create and connect pages

- **WHEN** an owner adds pages and connects an output from one page to another on the canvas
- **THEN** the flow saves those pages and connections as the form's respondent journey

#### Scenario: Configure a starting page

- **WHEN** an owner marks a page as the start page
- **THEN** respondents begin the form on that page

#### Scenario: Remove a connected page

- **WHEN** an owner removes a page that has incoming or outgoing connections
- **THEN** the page and its connections are removed and the owner can save a valid flow

### Requirement: Owners can route respondents based on answers

The system SHALL allow an owner to connect answer outcomes to different pages.

#### Scenario: Route by answer

- **WHEN** a respondent selects an answer with a configured destination
- **THEN** continuing from that page opens the connected destination

#### Scenario: Follow the default page connection

- **WHEN** a page has one ordinary next-page connection and no matching conditional route
- **THEN** continuing opens the ordinary next page

#### Scenario: No matching route exists

- **WHEN** a respondent's answer has no matching conditional route and no ordinary next-page connection
- **THEN** the form ends at that page and offers submission

#### Scenario: Prevent publishing an invalid flow

- **WHEN** an owner publishes a flow with no start page or a connection to a missing page
- **THEN** the system rejects publishing and identifies the flow issue

### Requirement: Respondents can navigate form pages

The system SHALL present the current page's questions and let respondents move through the configured flow.

#### Scenario: Continue to the next page

- **WHEN** a respondent completes required questions and selects Next
- **THEN** the system validates the page and opens the destination determined by the flow

#### Scenario: Required answer is missing

- **WHEN** a respondent selects Next while a required question on the page is unanswered
- **THEN** the system keeps the respondent on that page and identifies the unanswered question

#### Scenario: Go back to an earlier page

- **WHEN** a respondent selects Back
- **THEN** the previous page in their visited journey is shown with their answers preserved

### Requirement: Password-protected forms gate the respondent flow

The system SHALL require a correct form password before showing any form page or question.

#### Scenario: Correct password

- **WHEN** a respondent enters the correct password
- **THEN** the system grants access to the form flow and opens its start page

#### Scenario: Incorrect password

- **WHEN** a respondent enters an incorrect password
- **THEN** the system does not reveal form questions and explains that the password is incorrect

### Requirement: Owners can configure form password protection

The system SHALL let a form owner enable protection with a password, replace the password, or disable protection.

#### Scenario: Enable password protection

- **WHEN** an owner enables password protection and supplies a password
- **THEN** the published form requires that password before showing questions

#### Scenario: Enable protection without a password

- **WHEN** an owner enables password protection without supplying a password
- **THEN** the system rejects the setting and explains that a password is required

#### Scenario: Disable password protection

- **WHEN** an owner disables password protection
- **THEN** respondents can open the published flow without entering a password

### Requirement: Owners configure respondent email collection

The system SHALL let owners require email collection or allow anonymous responses for a form.

#### Scenario: Email collection is required

- **WHEN** an owner requires email collection and a respondent opens the form
- **THEN** the form requests a valid email and associates the response with it

#### Scenario: Anonymous responses are enabled

- **WHEN** an owner allows anonymous responses
- **THEN** a respondent can submit without providing an email

#### Scenario: Email is required for a per-respondent limit

- **WHEN** anonymous responses are enabled and the owner configures a per-respondent submission limit
- **THEN** the system requires email identification or rejects that incompatible configuration
