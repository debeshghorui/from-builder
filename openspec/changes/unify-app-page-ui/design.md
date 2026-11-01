# Design

## Context

See `proposal.md` for motivation and `specs/app-page-design/spec.md` for required behavior. The app already loads Manrope, Montserrat, and Onest and defines light and dark theme variables plus ChaiUI-specific tokens in `apps/web/app/globals.css`. The landing page uses a public-site shell, while dashboard pages use a sidebar shell and independently assembled content. Auth routes currently duplicate their presentation and use placeholder Acme branding.

## Goals / Non-Goals

**Goals:**

- Reuse the existing brand variables and UI primitives so route styling stays aligned across themes.
- Make auth pages share one recognizable layout and product identity.
- Make dashboard content pages follow common heading, spacing, card, form, and state patterns within the existing sidebar shell.
- Preserve route-specific information architecture and current user workflows.

**Non-Goals:**

- Redesigning the landing page or changing its content.
- Replacing the dashboard navigation model or the public-site shell.
- Changing authentication, form, billing, or account data behavior.
- Adding a new component library or backend dependency.

## Decisions

### Reuse theme tokens and existing UI primitives

Build page styling on the existing CSS variables, Tailwind theme mappings, and `components/ui` controls. Where a visual token is missing, add or adjust a shared token instead of introducing route-specific hard-coded brand colors. This keeps light and dark themes coordinated and avoids parallel design systems.

**Alternative considered:** Define separate auth and dashboard palettes. This would preserve more local styling freedom but make the cross-route inconsistency harder to prevent.

### Separate shared page patterns from route-specific content

Use a small set of shared patterns for page headings, content width and gutters, cards, status labels, and loading/error/empty states. Keep each route's content and hierarchy local to that route, and preserve the dashboard sidebar and inset layout.

**Alternative considered:** Put every route into one generic page template. That would make dashboards uniform at the cost of obscuring differences between analytics, billing, account, and form editing tasks.

### Give auth routes one shared branded frame

Align sign-in and sign-up around a shared brand header, form column, and supporting visual treatment, while leaving each form's fields, messages, submit behavior, and route links intact. Use the real product wordmark or logo component rather than the current placeholder identity.

**Alternative considered:** Keep separate layouts and tune them independently. This would allow small route-specific differences but risks repeated drift.

### Preserve existing behavior and theme support

Treat this as a presentation change. Keep existing auth state handling, API hooks, form creation and editing flows, and dashboard data displays intact. Verify component styling against both themes and narrow layouts as changes are made.

**Alternative considered:** Combine visual work with workflow changes. That would increase scope and make regressions harder to isolate.

## Risks / Trade-offs

- **Shared patterns can become overly generic** → Limit shared components to repeated presentation needs and keep route content compositions explicit.
- **Existing colors may not meet contrast needs in both themes** → Review semantic tokens and state colors in light and dark modes; adjust shared values where needed.
- **Dashboard overview uses components outside the route page files** → Include the overview's cards, chart, table, and shell in the visual audit so the shared styling reaches the full route.
- **Auth illustration may not fit the refined brand treatment** → Reuse it only if it remains visually coherent; keep the form usable without the illustration at smaller widths.

## Migration Plan

1. Establish shared page heading, spacing, status, and state patterns using current tokens and primitives.
2. Align sign-in and sign-up presentation and product branding.
3. Apply the shared patterns across dashboard overview, account, billing, forms, and form builder while retaining their behavior.
4. Review every affected route in light and dark themes and at narrow and wide viewport sizes; adjust shared tokens or patterns based on observed inconsistencies.

Rollback is limited to reverting the page presentation and shared style changes; no data or API migration is involved.
