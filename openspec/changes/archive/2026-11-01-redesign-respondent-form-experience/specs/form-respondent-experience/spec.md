# Spec Delta

## Purpose

Gives respondents a clear, responsive guided experience for completing public multi-page forms, including access, progress, validation, review, and submission states.

## ADDED Requirements

### Requirement: Respondents can understand their place in the form

The public form SHALL present each configured page as a focused step with its title, grouped questions, and a progress cue that does not claim a fixed total when conditional routes can change the journey length.

#### Scenario: Respondent opens a form step

- **WHEN** a respondent enters the question flow or continues to another page
- **THEN** the current page title, its questions, and the respondent's current step are easy to identify

#### Scenario: Form has conditional routes

- **WHEN** different answers can lead to journeys with different lengths
- **THEN** progress feedback does not present the total number of all configured pages as the respondent's guaranteed number of steps

### Requirement: Respondents receive clear access and status screens

The public form SHALL present password, identity, loading, unavailable, review, submission, and success states with clear instructions and a clear next action where one is available.

#### Scenario: Form requires a password

- **WHEN** a respondent opens a password-protected form
- **THEN** the password screen explains how to continue and reports an incorrect password without revealing form questions

#### Scenario: Form collects identity

- **WHEN** a form requires email or allows anonymous responses
- **THEN** the entry screen clearly explains whether email is required or optional and provides the configured anonymous choice

#### Scenario: Form completes or cannot load

- **WHEN** a form is submitted, unavailable, or still loading
- **THEN** the respondent sees a distinct status message and any applicable next action

### Requirement: Respondents can navigate and correct answers accessibly

The question flow SHALL provide clear Back and forward actions, explain required-answer errors beside the affected question, and preserve answers while respondents move through their visited route.

#### Scenario: Required answer is missing

- **WHEN** a respondent continues with a required question unanswered
- **THEN** the flow identifies the question that needs an answer and moves keyboard focus to that question

#### Scenario: Respondent returns to a previous step

- **WHEN** a respondent chooses Back
- **THEN** the prior visited page appears with its answers preserved and navigation remains usable by keyboard and assistive technology

#### Scenario: Respondent uses a narrow screen

- **WHEN** a respondent completes the form on a phone-sized viewport
- **THEN** question controls and navigation fit the viewport without horizontal scrolling and remain operable

### Requirement: Respondents can review before final submission

The public form SHALL distinguish the final review action from page navigation and make submission progress, failure, and success clear.

#### Scenario: Respondent reaches the end of the configured route

- **WHEN** the respondent finishes the last page on their selected route
- **THEN** the flow offers a review step before the final submission action

#### Scenario: Submission fails or succeeds

- **WHEN** the respondent submits a response
- **THEN** the flow communicates whether submission is pending, failed with a recoverable message, or completed successfully
