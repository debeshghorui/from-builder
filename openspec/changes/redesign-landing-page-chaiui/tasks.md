# Tasks

## 1. Setup

- [x] 1.1 Install @chaiui/chaiui theme using `npx shadcn@latest add @chaiui/chaiui` and verify the theme component is installed in components/ui
- [x] 1.2 Add ChaiUI tokens to app/globals.css from references/tokens.css and verify the CSS file includes the token definitions
- [x] 1.3 Check references/components.md in the chaiui skill for shipped components and identify which ones to install

## 2. Navbar Refactor

- [x] 2.1 Refactor components/landing-page/navbar.tsx to use ChaiUI navigation patterns (sticky transparent header, blur on scroll) and verify the header remains sticky and transparent initially
- [x] 2.2 Update navbar to use Manrope font and verify text rendering matches ChaiUI typography
- [x] 2.3 Remove orange fills from navbar buttons and replace with ChaiUI button styling and verify no orange fills remain
- [x] 2.4 Run chaiui-review skill on navbar.tsx and verify no ChaiUI rule violations are reported

## 3. Hero Section Refactor

- [x] 3.1 Simplify hero section to single central element (remove rotating marks, floating badges, complex dashboard preview) and verify only one central element remains
- [x] 3.2 Update hero h1 to use text-[42px] md:text-6xl lg:text-7xl font-semibold tracking-tight and verify typography matches ChaiUI hierarchy
- [x] 3.3 Update hero lead text to use text-base md:text-xl text-neutral-400 and verify text styling matches ChaiUI
- [x] 3.4 Remove all-caps eyebrow text and convert to sentence case and verify no uppercase appears except for data labels
- [x] 3.5 Replace orange-filled badge with highlight cream accent (orange-100 in dark, yellow-800 in light) and verify exactly one highlight phrase appears per paragraph
- [x] 3.6 Update hero buttons to use ChaiUI button styling (white on dark with asymmetric corners for solid, mirrored corners for outline) and verify button styling matches ChaiUI patterns
- [x] 3.7 Run chaiui-review skill on hero section and verify no ChaiUI rule violations are reported

## 4. Feature Cards Refactor

- [x] 4.1 Update all card components to use ChaiUI card styling (rounded-xl border-orange-50/15 bg-black/10 backdrop-blur-sm in dark, border-amber-900/15 bg-white/70 in light) and verify card styling matches ChaiUI
- [x] 4.2 Remove all shadows from cards and verify no shadow property is applied to any card
- [x] 4.3 Add hover states to cards (sm:opacity-90 to opacity-100, border opacity /30) and verify hover transitions work smoothly
- [x] 4.4 Update card titles to use Montserrat font and verify typography matches ChaiUI
- [x] 4.5 Remove orange fills from card icons and progress bars and verify no orange fills remain in cards
- [x] 4.6 Update card buttons to use shadcn default styling (bg-primary, light grey on dark, font-semibold) and verify button styling matches ChaiUI
- [x] 4.7 Run chaiui-review skill on feature cards and verify no ChaiUI rule violations are reported

## 5. Testimonial Section Refactor

- [x] 5.1 Update testimonial section to use ChaiUI typography (Manrope for body, proper heading hierarchy) and verify text styling matches ChaiUI
- [x] 5.2 Remove any orange fills from testimonial section and verify no orange fills remain
- [x] 5.3 Apply ChaiUI motion patterns (subtle hovers, scroll reveal) and verify animations respect prefers-reduced-motion
- [x] 5.4 Run chaiui-review skill on testimonial section and verify no ChaiUI rule violations are reported

## 6. Pricing Section Refactor

- [x] 6.1 Update pricing cards to use ChaiUI card styling and verify card styling matches ChaiUI
- [x] 6.2 Update pricing card titles and prices to use Montserrat font and verify typography matches ChaiUI
- [x] 6.3 Remove orange fills from pricing cards and pricing buttons and verify no orange fills remain
- [x] 6.4 Update pricing buttons to use ChaiUI button styling and verify button styling matches ChaiUI
- [x] 6.5 Run chaiui-review skill on pricing section and verify no ChaiUI rule violations are reported

## 7. Footer Refactor

- [x] 7.1 Refactor components/landing-page/footer.tsx to use ChaiUI footer styling and verify footer matches ChaiUI patterns
- [x] 7.2 Add 10% orange hairline to footer and verify the hairline is present
- [x] 7.3 Update footer typography to use Manrope and verify text rendering matches ChaiUI
- [x] 7.4 Remove orange fills from footer social icons and verify no orange fills remain
- [x] 7.5 Run chaiui-review skill on footer.tsx and verify no ChaiUI rule violations are reported

## 8. Background SVG and Motion Patterns

- [x] 8.1 Add ChaiUI background SVG centered at the top of the landing page and verify the SVG is present and centered
- [x] 8.2 Apply mask to SVG bottom to fade out and verify the fade effect works
- [x] 8.3 Add invert(1) hue-rotate(180deg) transformation to SVG in light mode and verify the transformation applies correctly in light mode
- [x] 8.4 Audit all framer-motion animations and update to ChaiUI motion patterns (200-300ms hovers, scale 1.03 on images, scroll reveal once) and verify all animations respect prefers-reduced-motion
- [x] 8.5 Remove radial gradients that are not part of ChaiUI design and verify no non-ChaiUI gradients remain

## 9. Final Validation

- [x] 9.1 Run chaiui-review skill on the entire landing page and verify no ChaiUI rule violations are reported
- [x] 9.2 Test landing page in dark mode and verify all colors, typography, and components render correctly
- [x] 9.3 Test landing page in light mode and verify all colors, typography, and components render correctly with proper theme switching
- [x] 9.4 Test landing page on mobile viewport and verify no horizontal scroll occurs
- [x] 9.5 Search entire landing page for em dashes and verify no em dashes are present in copy
- [x] 9.6 Verify all text uses sentence case except for proper nouns and data labels
- [x] 9.7 Verify exactly one highlight phrase appears per paragraph in lead text
- [x] 9.8 Verify orange appears only in: logo, hover text links, 1px badge glint, 10% footer hairline, segmented control active fill
