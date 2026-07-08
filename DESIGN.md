---
name: Kinetic Ledger Design System
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
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
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
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
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-xl:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption-xs:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is a premium, enterprise-grade framework tailored for high-scale inventory and logistics management. It prioritizes clarity, speed, and precision, drawing heavy inspiration from the aesthetic of modern developer tools and high-performance fintech platforms.

The visual direction follows a **Corporate / Modern** approach with a "Developer-First" polish. It utilizes high-contrast typography, generous whitespace, and a refined RTL (Right-to-Left) structural flow. The atmosphere is professional and trustworthy, designed to reduce cognitive load during complex ERP operations while maintaining a sleek, sophisticated interface that feels both powerful and easy to navigate.

## Colors

The palette is rooted in a crisp Indigo primary that conveys authority and reliability. The background remains light and airy using Slate-tinted whites to prevent eye fatigue during long sessions.

- **Primary (Indigo 600):** Used for primary actions, active navigation states, and key brand moments.
- **Secondary (Slate 500):** Supporting elements, secondary icons, and metadata.
- **Surface & Background:** A multi-layered approach starting from `#F8FAFC` for the base layer, moving to pure white `#FFFFFF` for interactive cards and containers.
- **Functional (Semantic):** Emerald for growth/stock-in, Amber for low-stock alerts, and Rose for critical stock-out or error states.

## Typography

The system utilizes **IBM Plex Sans Arabic** to provide a technical, neutral, and highly legible experience. The typeface offers excellent clarity for numeric data—a critical requirement for ERP systems.

- **Scale:** A mathematical hierarchy ensures that headlines dominate the view while data labels remain compact yet readable.
- **Weight Strategy:** Use **Bold (700)** for page headers, **SemiBold (600)** for card titles and table headers, and **Medium (500)** for navigation items and buttons.
- **RTL Considerations:** Line heights are slightly increased compared to Latin counterparts to accommodate the specific vertical height of Arabic glyphs, ensuring no descenders or ascenders are clipped.

## Layout & Spacing

This design system uses a strict **8px linear grid system**. This rhythm applies to all padding, margins, and component dimensions, ensuring a cohesive and predictable layout.

- **Grid Model:** A 12-column fluid grid for the main content area.
- **Sidebar:** A fixed-width RTL sidebar (280px) sits on the right, housing the primary navigation.
- **Safe Areas:** Main content containers should have a minimum horizontal padding of `lg` (24px) on mobile and `2xl` (48px) on desktop to maintain a premium, airy feel.
- **Responsive Behavior:** On tablet, the sidebar collapses into an icon-only rail. On mobile, the sidebar moves to a hidden drawer menu accessed via a top-bar hamburger icon.

## Elevation & Depth

To achieve a "Linear-style" depth, the system relies on a combination of **Tonal Layers** and **Subtle Soft Shadows**.

1. **The Canvas:** `#F8FAFC` (Background)
2. **The Container:** Pure white `#FFFFFF` with a 1px border of `Gray 200`.
3. **The Elevation:** Instead of heavy shadows, use a "Low-Contrast Outline" strategy. For floating elements like dropdowns or modals, use a multi-layered shadow:
   - *Shadow 1:* `0 1px 2px rgba(0,0,0,0.05)`
   - *Shadow 2:* `0 4px 12px rgba(0,0,0,0.05)`
4. **Interaction:** Upon hover, interactive cards should increase their shadow slightly or show a subtle Indigo-tinted border to provide instant feedback.

## Shapes

The shape language is characterized by "Rounded XL" containers, giving the enterprise environment a modern, friendly, yet professional edge.

- **Small Components:** Checkboxes and small tags use `4px` (Soft).
- **Standard Components:** Buttons and Input fields use `8px` (Rounded).
- **Large Containers:** Dashboard cards and Modals use `12px` to `16px` (Rounded-lg to XL) to create a distinct, high-end SaaS feel.

## Components

### Buttons
- **Primary:** Solid Indigo background, White text. 8px border radius. Subtle inner-top-border highlight.
- **Secondary:** White background, 1px Gray-200 border, Slate-700 text.
- **Tertiary/Ghost:** No border, transparent background, Indigo text. Used for less prominent actions like "Cancel".

### Input Fields
- White background with a 1px Gray-200 border. 
- **Focus State:** 1px Indigo-600 border with a 3px Indigo-100 outer glow (ring).
- **Labels:** Always placed above the field, aligned to the right (RTL), in `label-sm` weight.

### Dashboard Cards
- Pure white background, 1px Gray-200 border.
- Padding should be a minimum of `lg` (24px).
- Incorporate a subtle vertical accent bar on the right side of the card (RTL) using the semantic colors (Indigo, Emerald, etc.) to categorize card types.

### Chips & Badges
- Used for stock status (e.g., "In Stock", "Low Stock"). 
- Small border-radius (pill-shaped) with a light background tint and dark text of the same hue (e.g., Emerald-50 background with Emerald-700 text).

### Lists & Tables
- **Table Headers:** Slate-50 background, uppercase-style bold text, 1px bottom border.
- **Rows:** White background, 1px bottom border, hover state with a very light Slate-50 background.