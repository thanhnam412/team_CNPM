---
name: Enterprise Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#41485e'
  on-tertiary: '#ffffff'
  tertiary-container: '#586076'
  on-tertiary-container: '#d4dbf5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  h3:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.75'
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1'
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  h1-mobile:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: '1.2'
  h2-mobile:
    fontFamily: Inter
    fontSize: 1.875rem
    fontWeight: '600'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 0.25rem
  '1': 0.25rem
  '2': 0.5rem
  '3': 0.75rem
  '4': 1rem
  '6': 1.5rem
  '8': 2rem
  '12': 3rem
  '16': 4rem
  container-max: 1280px
  gutter: 1rem
  margin-mobile: 1rem
  margin-desktop: 2rem
---

## Brand & Style
This design system is built upon the principles of functional minimalism and systematic clarity. It is designed for enterprise-grade applications where information density must be balanced with visual breathing room. The aesthetic is heavily influenced by modern utility-first frameworks, prioritizing accessibility, speed, and a "mechanical" refinement.

The target audience consists of professional users who require a reliable, predictable interface. The UI evokes a sense of stability and institutional trust through a restricted color palette, rigorous alignment, and the intentional use of whitespace to reduce cognitive load. This is a **Modern / Corporate** style that leverages subtle borders and tonal layering rather than heavy shadows or decorative elements.

## Colors
The palette is anchored by a sophisticated **Slate** neutral scale and a high-energy **Indigo** primary. The Indigo is reserved strictly for primary actions and critical focus states, ensuring that user intent is never ambiguous. 

Neutrals are divided into functional layers: `background` for the base canvas, `muted` for secondary surfaces or inactive states, and `foreground` for high-contrast text. In light mode, borders are soft and low-contrast to define structure without clutter. In dark mode, the palette shifts to deep navy-slates to maintain depth while preserving readability.

## Typography
**Inter** is the sole typeface for this design system, chosen for its exceptional legibility and neutral, systematic character. The hierarchy relies on weight and tight letter-spacing at larger sizes to create a sense of premium "designed" structure.

Headlines use semi-bold and bold weights with slight negative letter-spacing for a modern, compact appearance. Body text is optimized for long-form reading with a generous line height (1.5x - 1.75x). Labels use a medium weight to differentiate themselves from body copy, with a specialized small label variant using uppercase tracking for utility-based UI elements like table headers or overlines.

## Layout & Spacing
The system utilizes a **12-column fluid grid** with a fixed maximum width for desktop screens. Layouts are built on a strict 4px (0.25rem) baseline grid, ensuring that all components align rhythmically. 

Padding and margins should follow the defined spacing increments. Use `8 (2rem)` for major section spacing and `4 (1rem)` for internal component layout. On mobile devices, margins compress to 1rem, and complex multi-column grids must reflow into a single-column vertical stack. Content should be grouped within "Cards" or clear logical sections to maintain visual order in high-density data environments.

## Elevation & Depth
Depth in this design system is primarily achieved through **low-contrast outlines** and tonal shifts rather than dramatic shadows. This creates a "flat-plus" appearance that feels integrated into the screen.

- **Level 0 (Base):** The main background surface.
- **Level 1 (Cards/Inputs):** Defined by a 1px solid border (`border` token). No shadow.
- **Level 2 (Popovers/Dropdowns):** Utilizes a very subtle, diffused ambient shadow (Alpha 5-10%) to indicate temporary overlay status.
- **Level 3 (Modals):** High-priority overlays that use a backdrop blur (8px) and a slightly more pronounced shadow to isolate the element from the background application state.

Interactive elements (like buttons) do not move in Z-space on hover; instead, they utilize background color shifts to indicate state.

## Shapes
The shape language is defined by a consistent **0.5rem (8px)** corner radius. This "Rounded" setting provides a professional yet approachable feel, softening the clinical nature of the slate color palette.

Consistency is mandatory: all buttons, input fields, cards, and modal containers must share this radius. Smaller components like Chips or Tags may use a fully rounded "Pill" shape to distinguish them as metadata, but all structural containers remain strictly at the 0.5rem standard.

## Components
### Buttons
Primary buttons use the Indigo background with white text. Secondary buttons use a white/slate background with a clear border. All buttons have a height of 40px (large) or 32px (small) and include 1rem of horizontal padding.

### Input Fields
Inputs are defined by a 1px border and a subtle background tint when focused. Use the `ring` token for a 2px outer glow on focus to ensure high accessibility.

### Cards
Cards are the primary container. They should have a 1px border, no shadow, and internal padding of `spacing.6`. Headers within cards should be separated by a subtle horizontal rule or a tonal background shift.

### Lists & Data Tables
Tables should be minimalist with horizontal lines only. Use `label-sm` for headers and `body-sm` for cell content. Row hover states should use the `muted` color token to provide a clear visual anchor.

### Chips & Badges
Small, non-interactive indicators used for status. They should have a slightly lower roundedness or be fully pill-shaped, using low-saturation background tints of the primary or semantic colors (success, warning, error).