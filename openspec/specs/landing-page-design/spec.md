# landing-page-design Specification

## Purpose

Defines the visual design system and component structure for the product landing page, ensuring alignment with ChaiUI design standards for typography, color, surfaces, buttons, and motion patterns.

## Requirements

### Requirement: Landing page uses ChaiUI color system

The landing page SHALL use the ChaiUI color system with near-black background, near-white text, and highlight cream accent only for highlighted phrases and specific active states.

#### Scenario: Orange fills are absent

- **WHEN** user views the landing page
- **THEN** no element uses orange as a fill color (buttons, badges, icons, progress bars, status indicators)
- **AND** orange appears only in: logo, hover text links, 1px badge glint, 10% footer hairline, segmented control active fill

#### Scenario: Highlight cream accent usage

- **WHEN** user views highlighted phrases
- **THEN** highlighted phrases use orange-100 in dark mode and yellow-800 in light mode
- **AND** exactly one highlight phrase appears per paragraph

### Requirement: Landing page uses ChaiUI typography

The landing page SHALL use Manrope for body text, Montserrat for card titles/prices/buttons, and Onest for the wordmark.

#### Scenario: Hero heading follows ChaiUI hierarchy

- **WHEN** user views the hero section
- **THEN** the h1 uses text-[42px] md:text-6xl lg:text-7xl font-semibold tracking-tight

#### Scenario: Page titles follow ChaiUI hierarchy

- **WHEN** user views section headings
- **THEN** page titles use text-2xl sm:text-3xl font-medium and are centered
- **AND** section h2 uses text-2xl sm:text-[30px] font-medium

#### Scenario: Lead text follows ChaiUI style

- **WHEN** user views lead paragraphs
- **THEN** lead text uses text-base md:text-xl text-neutral-400 in dark mode

#### Scenario: No all-caps eyebrows

- **WHEN** user views eyebrow/kicker text
- **THEN** eyebrow text uses sentence case
- **AND** uppercase appears only for data labels

### Requirement: Landing page uses ChaiUI surface styling

The landing page SHALL use ChaiUI card styling with no shadows, specific border and background colors, and the ChaiUI background SVG.

#### Scenario: Cards have no shadows

- **WHEN** user views any card component
- **THEN** cards have no shadow property applied

#### Scenario: Card styling matches ChaiUI

- **WHEN** user views cards in dark mode
- **THEN** cards use rounded-xl border-orange-50/15 bg-black/10 backdrop-blur-sm
- **AND** cards use border-amber-900/15 bg-white/70 in light mode

#### Scenario: Hover state on cards

- **WHEN** user hovers over a card
- **THEN** card opacity transitions from sm:opacity-90 to opacity-100
- **AND** border opacity increases to /30

#### Scenario: Background SVG is present

- **WHEN** user views the landing page
- **THEN** the ChaiUI background SVG is centered at the top
- **AND** the SVG bottom is masked to fade out
- **AND** the SVG uses invert(1) hue-rotate(180deg) in light mode

### Requirement: Landing page uses ChaiUI button styling

The landing page SHALL use ChaiUI button patterns with asymmetric corners and specific color schemes.

#### Scenario: Solid button styling

- **WHEN** user views a primary solid button
- **THEN** button uses white on dark background
- **AND** button has rounded-none rounded-tr-lg rounded-bl-lg corners
- **AND** button includes ArrowUpRight icon

#### Scenario: Outline button styling

- **WHEN** user views a secondary outline button
- **THEN** button has mirrored asymmetric corners
- **AND** button uses outline style

#### Scenario: Card button styling

- **WHEN** user views buttons on cards
- **THEN** buttons use shadcn default styling (bg-primary, light grey on dark)
- **AND** buttons use font-semibold

### Requirement: Landing page uses ChaiUI navigation patterns

The landing page SHALL use ChaiUI navigation with sticky transparent header that blurs after scrolling.

#### Scenario: Header is sticky and transparent

- **WHEN** user scrolls the page
- **THEN** header remains sticky at the top
- **AND** header is transparent initially
- **AND** header applies backdrop-blur after scrolling begins

#### Scenario: Theme switcher half-circle

- **WHEN** user views the theme switcher
- **THEN** theme switcher uses half-circle design
- **AND** switcher has one label for both themes to avoid SSR mismatches

### Requirement: Landing page uses ChaiUI motion patterns

The landing page SHALL use ChaiUI motion patterns with subtle hovers, image scaling, and scroll reveals.

#### Scenario: Hover animations are subtle

- **WHEN** user hovers over interactive elements
- **THEN** hover transitions complete in 200-300ms
- **AND** animations respect prefers-reduced-motion

#### Scenario: Image scale on hover

- **WHEN** user hovers over images
- **THEN** images scale to 1.03

#### Scenario: Scroll reveal animation

- **WHEN** user scrolls to reveal content
- **THEN** reveal animation triggers once per element
- **AND** animation respects prefers-reduced-motion

### Requirement: Landing page hero has single central element

The landing page hero section SHALL have exactly one central element with no floating decorations.

#### Scenario: Hero has no floating elements

- **WHEN** user views the hero section
- **THEN** hero contains exactly one central element
- **AND** no floating tilted cards appear around the hero
- **AND** no floating badges appear around the hero

### Requirement: Landing page copy follows ChaiUI style

The landing page copy SHALL follow ChaiUI copy rules with no em dashes, sentence case, and professional tone.

#### Scenario: No em dashes in copy

- **WHEN** user reads any text on the landing page
- **THEN** no em dashes appear in the copy

#### Scenario: Sentence case in copy

- **WHEN** user reads body text and headings
- **THEN** text uses sentence case except for proper nouns

#### Scenario: Professional and friendly tone

- **WHEN** user reads the landing page copy
- **THEN** tone is professional and friendly
