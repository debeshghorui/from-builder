# Proposal

## Why

The public respondent route supports access gates, grouped form pages, branching, and final submission, but its current presentation gives respondents little orientation and makes the steps feel visually plain. A more focused guided experience should make it easier to understand where to start, what is expected on each page, and how to continue or review answers across phone and desktop sizes.

## What Changes

- Redesign the public respondent page around a clear form introduction and a focused question panel.
- Make step progress, page title, required fields, validation feedback, and Back/Next actions easier to scan.
- Give password and email or anonymous entry states the same visual hierarchy as the question flow.
- Improve loading, unavailable, review, submission, and success states so each gives respondents a clear next step.
- Preserve existing access rules, branching behavior, answer retention, submission semantics, and grouped questions per configured page.

## Capabilities

### New Capabilities

- `form-respondent-experience`: A clear, responsive guided presentation for public respondents completing multi-page forms.

### Modified Capabilities

None.

## Impact

- Public respondent UI in `apps/web/app/form/[id]/page.tsx` and any focused components extracted from it.
- Existing design tokens and shared UI components in `apps/web/components`.
- No API, database, route, or dependency changes are expected.
