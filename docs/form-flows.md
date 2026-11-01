# Building multi-page forms

## Create a page flow

Open a form in the dashboard and choose **Page flow**. Add one page for each stage of the respondent journey. Drag page cards to arrange the canvas, rename them, and choose one start page. Connect pages with the page controls or the canvas connection mode. Use the **Connections** section to choose each destination and, when needed, a question and answer that route respondents to that page. A connection without a question is the default next page. If no route matches and there is no default connection, the respondent can submit from that page.

Questions belong to one page. Use the **Questions** tab to select a page, add and arrange its questions, or move a selected question to another page. Save page and connection changes with **Save flow**. Forms with invalid start pages or routes cannot be published.

## Collect responses

In **Response settings**, choose one email mode:

- **Require an email** associates every response with a normalized email address.
- **Collect email, allow anonymous** lets respondents provide an email or continue without one.
- **Allow anonymous, do not collect email** stores no respondent email.

Set a maximum total response count to close the form after that many submissions. A per-email response limit requires **Require an email**, because anonymous responses cannot be reliably matched to a person. A respondent who reaches the configured limit cannot submit again.

When a form is password protected, the published link asks for the password before it loads questions. Enable protection in **Response settings** and provide a password; you can replace it later or turn protection off. Publishing validates the page flow. The public form link is `/form/<form-id>`; owners can open it from the form builder after publishing.

## Review responses

Choose **Responses** in the form builder to see submitted responses. Open a response to view its recorded answers and the email address when one was collected. Only the form owner can access these views.
