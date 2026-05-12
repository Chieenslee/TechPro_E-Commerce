---
name: The Design System
colors:
  surface: '#111415'
  surface-dim: '#111415'
  surface-bright: '#373a3b'
  surface-container-lowest: '#0c0f10'
  surface-container-low: '#191c1d'
  surface-container: '#1d2021'
  surface-container-high: '#282a2b'
  surface-container-highest: '#323536'
  on-surface: '#e1e3e4'
  on-surface-variant: '#c5c6cd'
  inverse-surface: '#e1e3e4'
  inverse-on-surface: '#2e3132'
  outline: '#8f9097'
  outline-variant: '#44474d'
  surface-tint: '#b9c7e4'
  primary: '#b9c7e4'
  on-primary: '#233148'
  primary-container: '#0a192f'
  on-primary-container: '#74829d'
  inverse-primary: '#515f78'
  secondary: '#bdc7d8'
  on-secondary: '#27313e'
  secondary-container: '#404a57'
  on-secondary-container: '#afb9c9'
  tertiary: '#e7bf99'
  on-tertiary: '#432b10'
  tertiary-container: '#281400'
  on-tertiary-container: '#9d7b5a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#d9e3f4'
  secondary-fixed-dim: '#bdc7d8'
  on-secondary-fixed: '#121c28'
  on-secondary-fixed-variant: '#3e4755'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#e7bf99'
  on-tertiary-fixed: '#2b1701'
  on-tertiary-fixed-variant: '#5d4124'
  background: '#111415'
  on-background: '#e1e3e4'
  surface-variant: '#323536'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The brand personality of this design system is rooted in **Precision, Reliability, and Engineering Excellence**. It targets tech-savvy consumers and professionals who value performance and cutting-edge aesthetics. The UI should evoke the feeling of interacting with a high-performance instrument—responsive, transparent, and sophisticated.

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes a dark-themed foundation to establish a "Deep Tech" environment, where information is prioritized through clear hierarchy and crisp execution. Glassmorphic layers are used sparingly to create depth and a sense of physical layering, simulating the sleek glass and metal components of the premium electronics sold within the platform.

## Colors
The palette is engineered for high-contrast legibility and a futuristic feel. 
- **Deep Tech Blue (#0A192F):** Used for primary surfaces, navigation bars, and structural foundations. It provides a more sophisticated depth than pure black.
- **Slate Grey (#4B5563):** Used for secondary text, borders, and inactive states. It bridges the gap between the dark background and bright accents.
- **Vibrant Cyan (#06B6D4):** The high-energy accent reserved for Calls to Action (CTAs), progress indicators, and active selection states. It mimics the glow of technological interfaces.
- **Functional Neutrals:** White and off-white are used strictly for primary content and data to ensure maximum readability against the dark backgrounds.

## Typography
This design system utilizes **Inter** exclusively to leverage its geometric precision and exceptional legibility at small sizes. 

**Hierarchy & Tracking:** 
- Headlines feature slightly wider tracking (+0.01em to +0.02em) to create an airy, premium feel. 
- Labels and "Tech Specs" use a more aggressive letter-spacing (+0.05em) and uppercase styling to mimic technical data sheets.
- Body text remains standard to prioritize reading speed for product descriptions.
- Vertical rhythm is maintained through a strictly enforced 4px baseline grid.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. For desktop, content is constrained to a 1440px max-width container using a 12-column grid. 

- **Desktop:** 12 columns, 24px gutters, 64px outside margins.
- **Tablet:** 8 columns, 20px gutters, 32px outside margins.
- **Mobile:** 4 columns, 16px gutters, 16px outside margins.

Spacing follows an 8px rhythmic scale. Generous whitespace (Large and XL units) is applied between major sections (e.g., Hero to Product Grid) to reinforce the minimalist, premium aesthetic. "Precision Spacing" (XS and SM units) is used within components like product cards and technical spec lists to keep data compact and organized.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional heavy shadows.

- **Background:** The base level is the darkest (#050B14).
- **Surface Level:** Cards and navigation containers use a slightly lighter "Surface" tint (#0F1F39).
- **Glassmorphic Overlays:** Floating elements (modals, dropdowns, sticky headers) utilize a semi-transparent background (White @ 5% - 10%) with a 20px backdrop blur and a crisp 1px border (White @ 15%).
- **Shadows:** Use "Professional Shadows"—highly diffused, low-opacity (10-15%), and tinted with the primary Deep Tech Blue to avoid a "dirty" look on dark backgrounds. Shadows should feel like ambient occlusion rather than a direct light source.

## Shapes
This design system employs **Soft (0.25rem)** roundedness to maintain a technical, architectural feel. 

- **Standard Elements:** Buttons, input fields, and small cards use a 4px radius.
- **Large Containers:** Hero sections or main product cards use **rounded-lg (8px)** to subtly soften the interface without losing the "clean-cut" precision.
- **Strict Adherence:** Avoid pill-shapes for primary UI elements; rounded corners are used only to prevent the UI from feeling "aggressive," not to make it feel "playful."

## Components
- **Buttons:** Primary CTAs use a solid Cyan background with white text and a subtle outer glow (Cyan @ 20% blur). Secondary buttons use a crisp 1px border in Slate Grey with no fill.
- **Glass Cards:** Product cards feature a 1px border and a subtle gradient transition on hover to indicate interactivity.
- **Inputs:** Text fields use the Surface color with a 1px border that glows Cyan upon focus. Tracking inside inputs is slightly wider for clarity of technical strings (e.g., serial numbers).
- **High-Quality Iconography:** Use thin-stroke (1.5px) linear icons. Icons should be geometric and devoid of rounded terminals to match the typography's precision.
- **Tech Spec Tags:** Small, low-contrast chips with uppercase labels used for displaying technical attributes like "8K," "5G," or "OLED."
- **Status Indicators:** Use small, pulsing dots (Cyan for active, Slate for standby) to reinforce the "live technology" metaphor.