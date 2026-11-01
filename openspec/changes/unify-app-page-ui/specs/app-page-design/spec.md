# Spec Delta

## Purpose

Defines a cohesive branded experience across authentication and workspace pages while keeping each page's content and task flow clear, accessible, and responsive.

## ADDED Requirements

### Requirement: App pages share the product visual language

Authentication and dashboard pages SHALL use the product's established typography, color, surface, and control styling consistently with the landing page.

#### Scenario: Shared brand styling across routes

- **WHEN** a user navigates between the landing page, authentication pages, and dashboard pages
- **THEN** typography, palette, buttons, borders, and surfaces read as one product identity
- **AND** each page retains visual hierarchy suited to its purpose

#### Scenario: Theme changes remain coherent

- **WHEN** a user views authentication or dashboard pages in either supported theme
- **THEN** text, controls, cards, status indicators, and decorative elements remain legible and use the corresponding theme colors

### Requirement: Authentication pages use product branding

Sign-in and sign-up pages SHALL present consistent product branding and a shared visual structure without changing their authentication behavior.

#### Scenario: Sign-in and sign-up presentation

- **WHEN** a user opens either authentication page
- **THEN** the product wordmark, page framing, form controls, and supporting content use a consistent brand treatment
- **AND** the correct form, validation messages, and navigation remain available

### Requirement: Dashboard pages use consistent page structure

Dashboard routes SHALL use a consistent content frame, page heading hierarchy, spacing, and surface treatment while retaining route-specific workspace layouts.

#### Scenario: Workspace route navigation

- **WHEN** a user navigates among dashboard overview, account, billing, forms, and form builder
- **THEN** page titles, descriptions, content gutters, cards, and actions follow shared visual conventions
- **AND** the dashboard navigation and route-specific content remain clear

### Requirement: Dashboard states use consistent presentation

Dashboard loading, error, empty, and status states SHALL use consistent visual treatments and communicate their meaning clearly.

#### Scenario: Loading, errors, and empty content

- **WHEN** dashboard data is loading, unavailable, or empty
- **THEN** the page shows a consistent loading, error, or empty-state treatment with readable guidance and available recovery actions

#### Scenario: Form publication status

- **WHEN** a form's published or draft state is shown in a dashboard route
- **THEN** its label and visual treatment are consistent wherever that state appears

### Requirement: App page layouts adapt to viewport and accessibility settings

Authentication and dashboard pages SHALL remain usable across supported viewport sizes and respect user accessibility preferences.

#### Scenario: Narrow viewport layout

- **WHEN** a user opens an authentication or dashboard page on a narrow viewport
- **THEN** content, forms, navigation, cards, and primary actions fit the available width without unintended horizontal scrolling

#### Scenario: Reduced motion preference

- **WHEN** a user enables reduced motion
- **THEN** decorative and interactive page transitions avoid nonessential motion
