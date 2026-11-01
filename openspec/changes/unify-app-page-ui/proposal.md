# Proposal

## Why

The landing page now establishes a distinct ChaiUI brand, but sign-in, sign-up, and workspace pages still use unrelated starter styling. This inconsistency makes the product feel fragmented as people move between the public site and the app.

## What Changes

- Extend the established ChaiUI color, typography, surface, and interaction language to the sign-in and sign-up pages and all dashboard routes.
- Standardize page headers, content spacing, cards, forms, status treatments, and loading, error, and empty states across dashboard pages.
- Preserve each route's content, information architecture, responsive behavior, and existing authentication and form workflows.
- Keep dashboard layouts optimized for workspace tasks while sharing the same brand styling as the landing page.

## Capabilities

### New Capabilities

- `app-page-design`: Defines consistent branded visual behavior for authentication and dashboard pages while preserving route-specific structure and functionality.

### Modified Capabilities

None.

## Impact

- Auth routes: `apps/web/app/(auth)/signin/page.tsx` and `apps/web/app/(auth)/signup/page.tsx`.
- Dashboard routes: overview, account, billing, forms, and form builder under `apps/web/app/dashboard/`.
- Shared shell and design primitives: `apps/web/app/globals.css`, `apps/web/app/dashboard/layout.tsx`, and related `apps/web/components/` and UI components.
- No API or backend changes are expected.

Scope assumption: “other pages” includes both authentication routes and every dashboard route, excluding the already redesigned landing page.
