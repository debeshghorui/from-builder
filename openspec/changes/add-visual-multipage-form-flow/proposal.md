# Proposal

## Why

Forms are currently modeled as a single ordered list of questions, which cannot support longer surveys with distinct stages or routes based on answers. A visual page-flow builder would let form owners organize respondent journeys, branch to relevant questions, and control how responses are identified and limited.

## What Changes

- Add a visual flow canvas where form owners create pages and connect them to define respondent navigation.
- Support answer-based conditional routes as well as ordinary page-to-page progression.
- Add a respondent experience with next/back navigation, validation, and a final submission step.
- Support an optional password gate before the respondent enters the form.
- Let owners configure email collection, anonymous responses, and a maximum number of submissions per respondent.
- Add submission storage and owner-facing response access needed to support the respondent flow.

## Capabilities

### New Capabilities

- `form-flow`: Create and manage connected form pages, route respondents through them, and configure respondent access and response limits.
- `form-responses`: Collect, identify, limit, and store respondent submissions.

### Modified Capabilities

None.

## Impact

- Form builder UI in `apps/web/app/dashboard/forms/[id]/page.tsx` and related components.
- New public respondent form routes and UI in `apps/web/app`.
- Form and field persistence models and migrations in `packages/database`.
- Form services and protected/public tRPC procedures in `packages/services` and `packages/trpc`.
- Existing form settings for passwords and participant limits need clear total-limit and per-respondent semantics.
