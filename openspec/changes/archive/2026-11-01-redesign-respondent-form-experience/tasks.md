# Tasks

## 1. Establish a consistent respondent shell and entry states

- [x] 1.1 Refine the public form shell and identity header using existing design tokens and shared components; verify long titles and descriptions wrap cleanly at phone and desktop widths.
- [x] 1.2 Redesign password and email/anonymous entry panels with clear instructions, labeled inputs, pending states, and errors; verify each configured access path still reaches the form only when allowed.
- [x] 1.3 Improve loading, unavailable, and not-ready states with readable status messaging and applicable next actions; verify no question content appears before password access is granted.

## 2. Build the guided question experience

- [x] 2.1 Redesign the grouped page header, question spacing, controls, and navigation footer; verify each page's configured questions remain together and Back/Next remain clear on narrow screens.
- [x] 2.2 Add branch-safe step orientation and progress feedback without a fixed total-page claim; verify alternate branch paths do not display a misleading guaranteed step count.
- [x] 2.3 Improve required-answer feedback, field error association, and focus targets including Yes/No radio groups; verify continuing with a missing answer identifies and focuses the first unanswered control.
- [x] 2.4 Verify Back navigation preserves answers on the visited route and conditional routing still selects the configured destination.

## 3. Clarify review, submission, and completion

- [x] 3.1 Redesign the final review and submission controls with pending and recoverable error feedback; verify a failed submission keeps the respondent able to retry.
- [x] 3.2 Redesign the submitted confirmation and verify successful submission shows a distinct completion state.
- [x] 3.3 Review the full respondent flow at phone and desktop widths and by keyboard navigation; verify no horizontal overflow and all actions and states remain accessible.
