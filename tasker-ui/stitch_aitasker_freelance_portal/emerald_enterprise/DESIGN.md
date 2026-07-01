---
name: Emerald Enterprise
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3f4943'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6f7a73'
  outline-variant: '#bec9c1'
  surface-tint: '#026c4e'
  primary: '#005039'
  on-primary: '#ffffff'
  primary-container: '#006b4d'
  on-primary-container: '#93e8c2'
  inverse-primary: '#82d7b2'
  secondary: '#5b5e66'
  on-secondary: '#ffffff'
  secondary-container: '#dfe2eb'
  on-secondary-container: '#61646c'
  tertiary: '#3e4750'
  on-tertiary: '#ffffff'
  tertiary-container: '#555e68'
  on-tertiary-container: '#cfd8e3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef4cd'
  primary-fixed-dim: '#82d7b2'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#dfe2eb'
  secondary-fixed-dim: '#c3c6cf'
  on-secondary-fixed: '#181c22'
  on-secondary-fixed-variant: '#43474e'
  tertiary-fixed: '#dae3ef'
  tertiary-fixed-dim: '#bec7d2'
  on-tertiary-fixed: '#141c25'
  on-tertiary-fixed-variant: '#3f4851'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 20px
---

## Brand & Style

This design system embodies a **Modern Corporate** aesthetic defined by precision, clarity, and an expansive sense of white space. It is designed for high-trust environments like finance, enterprise resource planning, and data analytics where cognitive load must be minimized.

The visual language is rooted in **Minimalism** with a focus on functional elegance. It avoids unnecessary decoration, relying instead on a strict monochromatic scale punctuated by a singular, authoritative emerald green. The emotional response is one of calm control, professionalism, and systematic reliability. Key characteristics include razor-thin strokes, high-contrast typography, and a "flat-plus" depth model that uses light and air rather than heavy shadows to organize information.

## Colors

The palette is anchored by a deep **Emerald Green** (#006B4D) used strictly for primary actions and success states. This is balanced against a sophisticated grayscale that ranges from a dense, near-black for primary text to a cool, light gray for subtle surface differentiation.

- **Primary:** Emerald Green. Used for main CTA buttons, progress bars, and active states.
- **Secondary:** Ink Black. Reserved for headlines and critical text to ensure maximum legibility.
- **Neutral/Background:** A multi-tiered gray system. The page background is #F6F8FA, while cards and containers use pure #FFFFFF to pop against the base.
- **Border/Stroke:** A consistent, light silver (#E1E4E8) is used for all card boundaries and input fields to maintain structural integrity without visual noise.

## Typography

This design system utilizes **Hanken Grotesk** across all roles to achieve a sharp, contemporary, and engineered feel. The typographic hierarchy is strict:

- **Headlines:** Use high weight (600-700). Small headlines are often all-caps with increased letter spacing to denote section headers or metadata categories.
- **Body:** Focused on readability. A 14px base is the standard for data-dense environments, providing a balance between information density and clarity.
- **Numeric Data:** Numbers should always feel prominent. In financial widgets, font weights are increased to 600 to ensure key metrics are the first thing a user sees.
- **Mobile Scaling:** For mobile devices, `headline-lg` should scale down to 22px to prevent excessive line wrapping in card titles.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. Content is housed in a centered container on large screens (max-width 1440px) while adapting to a fluid 12-column system on smaller resolutions.

- **Grid:** 12 columns with a fixed 16px gutter.
- **Margins:** 24px safe area on mobile; 48px+ on desktop.
- **Rhythm:** An 8px linear scale governs all padding and margins. Vertical stacking within cards follows a strict progression: 4px for related label/value pairs, 12px for distinct elements, and 20px to separate major card sections.
- **Density:** The system prioritizes "breathing room." Even in data-dense views, padding inside components (like tables or list items) never drops below 12px.

## Elevation & Depth

This design system uses a **Tonal Layering** approach instead of traditional shadows. Depth is communicated through color contrast and subtle outlines:

- **Level 0 (Base):** Light gray background (#F6F8FA).
- **Level 1 (Surface):** Pure white (#FFFFFF) containers with a 1px border (#E1E4E8). No shadow is used at this level to keep the UI feeling "flat" and integrated.
- **Level 2 (Popovers/Modals):** These use a very soft, diffused ambient shadow (`0 8px 24px rgba(0,0,0,0.04)`) to indicate they are floating above the main interface.
- **Interactions:** Hover states on interactive cards are indicated by a slight darkening of the border color or a subtle change in the background tint, rather than an "unlifting" shadow.

## Shapes

The shape language is disciplined and geometric. A consistent **8px (0.5rem) corner radius** is applied to almost all UI elements including cards, buttons, and input fields.

- **Standard (rounded-md):** 8px. Used for cards, buttons, and modals.
- **Large (rounded-lg):** 16px. Occasionally used for large hero sections or parent containers.
- **Small (rounded-sm):** 4px. Used for internal elements like checkbox markers or status tags.
- **Interactive Elements:** Buttons maintain the 8px radius to feel substantial and clickable without becoming overly "bubbly."

## Components

- **Buttons:** Primary buttons are solid Emerald Green with white text. Secondary buttons use a white background with a gray border and black text. For tertiary actions, use ghost buttons (text-only) with the Emerald Green color.
- **Cards:** The foundation of the system. Every card must have a 1px #E1E4E8 border and an 8px radius. Titles within cards use `headline-sm` (uppercase) or `headline-md`.
- **Input Fields:** Use a 1px border. The focus state is a 1px Emerald Green border with a soft green outer glow (2px). Labels sit above the field in `label-md` weight.
- **Chips/Badges:** Small, rounded-sm containers. Use very light tints of the status color (e.g., light green background for positive trends) with high-contrast text.
- **Lists:** Clean, horizontal rows separated by a 1px silver divider. Action icons (like "more" or "edit") should be #6E7781 and appear only on hover or stay low-opacity to reduce visual noise.
- **Progress Bars:** Thin, 4px height tracks in light gray with the active portion in solid Emerald Green.