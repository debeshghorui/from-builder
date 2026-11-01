# Design

## Context

The current landing page (`apps/web/components/landing-page/index.tsx`) uses a generic dark SaaS template with orange branding that conflicts with the ChaiUI design system. The project has the chaiui skill configured and `@chaiui` registry available in `components.json`, but existing components are not being used. The page structure includes hero, product overview, testimonial, features, stats, pricing, and CTA sections, all of which need to align with ChaiUI design standards.

## Goals / Non-Goals

**Goals:**

- Align landing page visual design with ChaiUI design system (color, typography, surfaces, buttons, motion)
- Ensure the landing page feels cohesive with the ChaiCode brand
- Maintain all existing content and sections (no copy changes beyond style compliance)
- Support both dark and light modes with proper ChaiUI theming

**Non-Goals:**

- Changing the content or messaging of the landing page
- Adding new sections or removing existing ones
- Changing the overall information architecture
- Backend or API changes

## Decisions

### Decision 1: Use existing @chaiui components where available

**Rationale:** The @chaiui registry provides pre-built components (navbar, hero, cards, section heads, footer) that already implement ChaiUI design patterns. Using these reduces implementation effort and ensures consistency with the ChaiUI system.

**Alternatives considered:**

- Build all components from scratch using ChaiUI rules - would require more effort and risk of inconsistency
- Mix of existing and custom - could lead to inconsistent implementation

**Implementation:** Check `references/components.md` in the chaiui skill for shipped components. Install @chaiui/chaiui theme first, then install any shipped components that match our needs (navbar, hero, cards, footer). Build any missing sections from `references/recipes.md`.

### Decision 2: Incremental component-by-component refactor

**Rationale:** Refactoring component-by-component allows for easier testing and rollback. Each component can be validated against ChaiUI rules before moving to the next. This approach also makes it easier to track progress and isolate issues.

**Alternatives considered:**

- Complete rewrite in one change - higher risk, harder to validate incrementally
- Parallel refactoring of all components - more complex merge conflicts

**Implementation order:**

1. Install @chaiui theme and tokens
2. Refactor navbar.tsx
3. Refactor hero section (simplify to single central element)
4. Refactor feature cards
5. Refactor testimonial section
6. Refactor pricing section
7. Refactor footer.tsx
8. Add ChaiUI background SVG
9. Review and adjust motion patterns

### Decision 3: Visual validation against chaiui-review skill

**Rationale:** The chaiui-review skill provides automated checking against ChaiUI rules. Using this after each component refactor ensures compliance before moving forward.

**Alternatives considered:**

- Manual visual review only - slower and more error-prone
- No validation - risks missing rule violations

**Implementation:** Run chaiui-review skill after each major component change. Fix any reported violations before proceeding.

## Risks / Trade-offs

**Risk:** ChaiUI components may not perfectly match current landing page layout **Mitigation:** Use ChaiUI components as a foundation and extend them with custom props or wrappers to achieve the required layout. Document any deviations from pure ChaiUI patterns.

**Risk:** Existing animations may conflict with ChaiUI motion patterns **Mitigation:** Audit all framer-motion animations in the current landing page. Replace or adjust to match ChaiUI motion rules (200-300ms hovers, scale 1.03 on images, scroll reveal once, respect prefers-reduced-motion).

**Risk:** Light mode may have rendering issues due to lack of current testing **Mitigation:** Test both dark and light modes thoroughly after each component change. Pay special attention to the background SVG invert/hue-rotate transformation in light mode.

**Trade-off:** Simplifying the hero to a single central element may reduce visual impact **Mitigation:** Focus the single element on high-impact content (product value proposition or key feature) and use subtle motion to maintain engagement.

## Migration Plan

1. **Preparation:** Install @chaiui/chaiui theme and add ChaiUI tokens to `app/globals.css`
2. **Component refactoring:** Refactor components in the order specified in Decision 2
3. **Validation:** Run chaiui-review after each component change
4. **Integration testing:** Test the full landing page in both dark and light modes
5. **Responsiveness check:** Verify mobile layout has no horizontal scroll
6. **Copy review:** Search for em dashes and verify sentence case compliance

**Rollback strategy:** Each component refactor is a discrete change. If issues arise, revert the specific component file and continue with the next component. Git commits should be made per component to enable granular rollback.

## Open Questions

None - all design decisions are clear based on the ChaiUI skill documentation and existing landing page structure.
