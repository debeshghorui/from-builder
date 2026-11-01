# Proposal

## Why

The current landing page does not follow the ChaiUI design system, making it feel like a generic dark SaaS template rather than a cohesive part of the ChaiCode brand. Inconsistent design erodes brand trust and fails to communicate the premium, restrained aesthetic that ChaiUI represents.

## What Changes

- Remove all orange fills from buttons, badges, icons, progress bars, and status indicators
- Replace orange branding with ChaiUI's highlight cream accent (orange-100 in dark, yellow-800 in light)
- Update typography to use Manrope for body text, Montserrat for card titles/prices/buttons, and Onest for the wordmark
- Remove all-caps eyebrow text; use sentence case with caps only for data labels
- Eliminate shadows from cards and the dashboard preview
- Update card styling to match ChaiUI specifications (rounded-xl, specific border and background colors)
- Simplify the hero section to one central element (remove floating elements, rotating marks, complex dashboard preview)
- Implement the ChaiUI background SVG with proper masking
- Update button styles: solid buttons white on dark with asymmetric corners, outline buttons with mirrored corners
- Ensure the landing page follows ChaiUI motion patterns (subtle 200-300ms hovers, scale on images, scroll reveal)

## Capabilities

### New Capabilities

- `landing-page-design`: Defines the visual design system and component structure for the product landing page, ensuring alignment with ChaiUI design standards for typography, color, surfaces, buttons, and motion patterns.

### Modified Capabilities

None

## Impact

- `apps/web/components/landing-page/index.tsx` - Complete redesign of the landing page component
- `apps/web/components/landing-page/navbar.tsx` - Update to match ChaiUI navigation patterns
- `apps/web/components/landing-page/footer.tsx` - Update to match ChaiUI footer styling
- `apps/web/app/globals.css` - May need updates for ChaiUI tokens and background SVG
- No API or backend changes - this is purely a frontend design update
