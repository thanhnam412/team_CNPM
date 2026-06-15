---
name: Deep Sea Professional
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#3e484c'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#6e797c'
  outline-variant: '#bdc8cc'
  surface-tint: '#006879'
  primary: '#006475'
  on-primary: '#ffffff'
  primary-container: '#007f94'
  on-primary-container: '#f5fcff'
  inverse-primary: '#77d3ea'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#4d5c72'
  on-tertiary: '#ffffff'
  tertiary-container: '#65758c'
  on-tertiary-container: '#fcfbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaedff'
  primary-fixed-dim: '#77d3ea'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 24px
  gutter: 16px
---

## Brand & Style

This design system embodies a **Modern Corporate** aesthetic that prioritizes clarity, efficiency, and high-trust interactions. It is designed for SaaS, developer tools, and data-heavy enterprise platforms where cognitive load must be minimized. 

The visual language is rooted in "Soft Minimalism"—utilizing generous whitespace and subtle tonal separation rather than aggressive borders or heavy shadows. The emotional response is one of calm reliability and technical precision. The interface feels lightweight and breathable, yet structured enough to handle complex data visualizations and multi-step workflows.

## Colors

The palette is centered around a sophisticated **Deep Teal** primary color, chosen for its balance between the authority of navy and the modern energy of cyan. 

- **Primary (#007f94):** Used for primary actions, active states, and key brand identifiers.
- **Surface & Background:** The system utilizes a multi-layered white strategy. The base background is pure white (#FFFFFF), while container surfaces and secondary regions use a very light slate tint (#f8fafc) to create subtle contrast.
- **Accents:** A range of cool grays are used for borders (#e2e8f0) and secondary text (#64748b), ensuring that the primary teal remains the focal point for interaction.
- **Success/Warning/Error:** Standard semantic colors are desaturated to match the professional tone of the primary palette.

## Typography

The system exclusively uses **Inter**, leveraging its exceptional legibility and neutral character. 

Hierarchy is established through tight control of font weight and vertical rhythm. Headlines use semi-bold (600) weights with slightly tighter letter spacing to appear more cohesive. Body text defaults to 14px for standard UI and 16px for long-form content, ensuring a balance between information density and readability. Captions and labels use 12px or 13px sizes to handle metadata without cluttering the interface.

## Layout & Spacing

The design system employs a **Fluid-Fixed hybrid grid**. On desktop, content is typically housed within a 12-column grid with a maximum container width of 1280px. On mobile, the system collapses to a single column with 16px side margins.

Spacing follows a strict 4px base unit (the "Linear Scale"). 
- **Card Padding:** Use 24px (xl) for large data displays and 16px (lg) for smaller utility cards.
- **Component Spacing:** Use 8px (sm) for internal element grouping (e.g., label to input) and 16px (md) for spacing between unrelated adjacent components.

## Elevation & Depth

This system avoids traditional drop shadows in favor of **Tonal Layering** and **Subtle Outlines**.

Depth is communicated through three primary layers:
1.  **Level 0 (Background):** Pure white or ultra-light gray (#f8fafc).
2.  **Level 1 (Cards/Containers):** Pure white background with a 1px solid border (#e2e8f0).
3.  **Level 2 (Dropdowns/Modals):** Pure white background with a very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) and a 1px border.

Interactive elements like buttons do not use elevation on hover; instead, they use subtle background color shifts (lightening or darkening by 5-10%).

## Shapes

The shape language is defined by **Moderate Rounding**, striking a balance between the clinical feel of sharp corners and the playfulness of pill shapes.

- **Primary Components:** Buttons, inputs, and cards use a base radius of 8px (0.5rem).
- **Nested Elements:** Smaller elements inside cards (like tags or badges) use a 4px radius to maintain visual harmony with the larger containers.
- **Large Containers:** Modals or main content areas may scale up to 12px or 16px radius depending on the layout scale.

## Components

### Buttons
- **Primary:** Solid Teal (#007f94) with white text. 8px border radius.
- **Secondary:** Light gray background (#f1f5f9) with dark text.
- **Outline:** 1px border (#e2e8f0) with dark text; border color changes to Teal on hover.
- **Ghost:** No background or border; text color only. Used for tertiary actions.

### Cards
Cards are the primary organizational unit. They feature a white background, 1px #e2e8f0 border, 8px-12px corner radius, and 24px internal padding. Card headers should use Headline-MD typography with a subtle bottom divider if the content is complex.

### Form Elements
- **Inputs:** 1px border (#e2e8f0), 8px radius, and 12px horizontal padding. The active state uses a 1px Teal border and a very subtle Teal outer glow.
- **Labels:** 13px Medium weight (500), positioned 8px above the input field.
- **Selects:** Feature a custom chevron icon and the same styling as text inputs.

### Data Visualization
Charts should use a palette derived from the primary Teal, supplemented by slate grays and muted secondary tones to ensure data clarity without overwhelming the professional aesthetic. Use thin line weights and minimal grid lines.