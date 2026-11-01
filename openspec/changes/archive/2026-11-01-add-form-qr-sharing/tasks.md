# Tasks

## 1. QR sharing UI

- [x] 1.1 Add browser-side QR generation and implement a reusable sharing card with the absolute public form URL, accessible copy feedback, and PNG download; verify the copied link and downloaded QR encode the same `/form/{id}` URL.
- [x] 1.2 Show the sharing card in the form builder only while the form is published, matching publish and unpublish state; verify it appears and disappears with those states and remains usable at mobile width.
- [x] 1.3 Render the QR with round data modules, square finder patterns, and a quiet zone; verify a downloaded dotted PNG decodes to the public form URL.

## 2. Access behavior

- [x] 2.1 Scan a downloaded QR for a published form and verify it opens the existing respondent route with its configured password, email or anonymous flow, and response limits still enforced.
