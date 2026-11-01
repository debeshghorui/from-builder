# Tasks

## 1. Persist form flow and response data

- [x] 1.1 Add Drizzle models and migrations for form pages, page connections and route conditions, page association for fields, and submissions; verify generated SQL applies and existing fields are backfilled in order onto a start page.
- [x] 1.2 Add owner settings for email collection, anonymous responses, total response cap, and per-respondent cap; verify schema validation accepts valid combinations and rejects anonymous per-respondent limits.
- [x] 1.3 Implement flow persistence and validation services for ownership, start page, connection targets, route conditions, and field-to-page consistency; verify invalid flow saves or publish attempts return actionable errors.
- [x] 1.4 Implement submission creation and owner response queries with transactionally enforced total and normalized-email limits; verify concurrent submissions cannot exceed configured limits.

## 2. Build the visual owner flow editor

- [x] 2.1 Add owner-only tRPC procedures for listing, creating, updating, connecting, and deleting pages and routes; verify every mutation checks form ownership.
- [x] 2.2 Build the node-canvas editor for page nodes and directed connections, with page and connection settings; verify create, connect, edit, delete, and save interactions persist after reload.
- [x] 2.3 Move or adapt existing field editing so questions are assigned to a page and ordered within it; verify existing forms display their backfilled fields and can be edited.
- [x] 2.4 Add password protection, email collection, anonymous response, total limit, and per-respondent limit controls to form settings; verify incompatible settings are explained and cannot be saved.
- [x] 2.5 Add publish-time flow validation and actionable canvas errors; verify forms with no start page or invalid route targets cannot be published.

## 3. Implement the respondent experience

- [x] 3.1 Add public published-form read and password verification procedures that return no question content before access is granted; verify draft forms and protected content cannot be read without valid access.
- [x] 3.2 Build the public respondent route with email collection or anonymous entry, password gate, current-page rendering, and progress navigation; verify password-protected forms show questions only after successful verification.
- [x] 3.3 Implement required-answer validation, answer-based routing, default next connections, terminal submission, and Back navigation with preserved answers; verify branched paths route correctly and unvisited pages are not required.
- [x] 3.4 Implement final submission and confirmation using server-side flow validation and response-limit checks; verify invalid answers, exceeded limits, and successful submissions produce the expected outcomes.

## 4. Owner response review and integration

- [x] 4.1 Add owner response list and individual response views; verify owners can view their form's answers and email while other users cannot access them.
- [ ] 4.2 Verify the end-to-end flow for sequential pages, conditional branches, protected forms, anonymous and email-identified responses, and total and per-respondent limits.
- [x] 4.3 Document the flow editor, email/anonymous settings, and submission-limit behavior in the relevant project documentation; verify instructions match the shipped UI.
