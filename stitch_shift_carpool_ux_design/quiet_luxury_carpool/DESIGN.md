---
name: Quiet Luxury Carpool
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c5c7c9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8f9194'
  outline-variant: '#44474a'
  surface-tint: '#c6c6c8'
  primary: '#ffffff'
  on-primary: '#2f3132'
  primary-container: '#e2e2e4'
  on-primary-container: '#636466'
  inverse-primary: '#5d5e60'
  secondary: '#c8c6c8'
  on-secondary: '#303032'
  secondary-container: '#474649'
  on-secondary-container: '#b6b4b7'
  tertiary: '#ffffff'
  on-tertiary: '#352f2c'
  tertiary-container: '#ebe0db'
  on-tertiary-container: '#6a635e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e4'
  primary-fixed-dim: '#c6c6c8'
  on-primary-fixed: '#1a1c1d'
  on-primary-fixed-variant: '#454749'
  secondary-fixed: '#e4e2e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#ebe0db'
  tertiary-fixed-dim: '#cec5bf'
  on-tertiary-fixed: '#1f1b17'
  on-tertiary-fixed-variant: '#4c4641'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 20px
  gutter: 16px
---

## Brand & Style
The design system is rooted in the "Quiet Luxury" aesthetic—a philosophy of restraint, high-fidelity execution, and understated elegance. It is designed for a premium carpooling experience that feels like a private concierge service rather than a utility. 

The visual direction follows a **Minimalist / Modern** approach with a heavy emphasis on **Tonal Layering**. By utilizing a sophisticated dark mode, the interface recedes to let content and photography shine, creating a focused, high-end environment. The emotional response should be one of calm, reliability, and exclusivity. 

Key attributes:
- **Stealth Wealth:** No unnecessary flourishes; quality is expressed through perfect alignment and subtle transitions.
- **High-Fidelity Dark Mode:** A deep charcoal foundation that avoids pure black to maintain depth and reduce eye strain.
- **Bento-Box Geometry:** Information is organized into clean, rounded modules that create a sense of order and structural integrity.

## Colors
The palette is monochromatic and high-contrast, designed specifically for a premium dark-mode environment. 

- **Background (#121212):** The base canvas. It is a deep charcoal that provides a softer, more luxurious feel than pure hex black.
- **Surface & Containers (#1C1C1E / #2C2C2E):** Progressive steps in elevation. Use `#1C1C1E` for primary cards and `#2C2C2E` for interactive elements or secondary nested containers.
- **Primary Typography (#F5F5F7):** An off-white that provides maximum legibility without the harshness of pure white.
- **Muted Accents (#8E8E93):** Used for secondary labels, line-art icons, and borders to maintain a hierarchical "quiet" feel.

## Typography
This design system utilizes **Inter** for its systematic, utilitarian, yet modern appearance. The typeface provides the precision required for a high-fidelity tech product while remaining approachable.

- **Scale:** High contrast between display titles and body text to guide the eye.
- **Letter Spacing:** Headlines utilize tight tracking (-0.01em to -0.02em) to feel "tucked in" and premium. Functional labels utilize wide tracking (+0.05em) and uppercase styling for a sophisticated, architectural feel.
- **Hierarchy:** Use FontWeight 600 for primary actions and titles, and 400 for all long-form reading and descriptions.

## Layout & Spacing
The layout follows a strict **Bento-box** philosophy where content is grouped into distinct, modular cards. 

- **Grid:** A 12-column grid for desktop, a 6-column grid for tablet, and a 4-column grid for mobile.
- **Padding:** A uniform internal card padding of 20px is preferred, though 16px may be used for tighter information densities.
- **Rhythm:** All spacing must be a multiple of 4px. Use 24px (lg) between distinct sections and 16px (md) between cards within a section.
- **Adaptive Behavior:** On mobile, cards should span the full width of the screen minus the 20px container margins. On desktop, cards should reflow into a multi-column masonry or grid layout depending on content type.

## Elevation & Depth
In this design system, depth is communicated through **Tonal Layers** rather than heavy shadows. 

1. **Base:** The background (#121212) is the lowest level.
2. **Elevated:** Primary cards use #1C1C1E. They should have a subtle 1px inner border (stroke) using #2C2C2E to define their edges against the dark background.
3. **Interactive:** Hover states or active buttons use #2C2C2E or the Off-White primary.
4. **Overlays:** Modals and bottom sheets use a "Glassmorphism" approach with a backdrop blur of 20px and a 70% opacity on the surface color to maintain context of the underlying screen.

## Shapes
The shape language is defined by **uniformity and smoothness**. 

- **Cards:** All container modules must use a 16px (1rem) corner radius. This creates the "Bento" look.
- **Interactive Elements:** Buttons and small input fields follow the same 16px radius for consistency.
- **Toggles & Tags:** Pills are the only exception, using a fully rounded (999px) radius to distinguish them as highly interactive or status-based elements.

## Components
Consistent implementation of components is vital to maintaining the "Quiet Luxury" feel.

- **Buttons:** Primary buttons are high-contrast (Off-White background with Deep Charcoal text). Secondary buttons are ghost-style with a 1px slate border.
- **Pill Toggles:** Switches must be pill-shaped. The "off" state is a muted slate; the "on" state is the primary Off-White.
- **Input Fields:** Minimalist design with a #1C1C1E background and a subtle bottom border or 1px stroke. Labels should use the `label-caps` typography style.
- **Bottom-Sheet Modals:** The primary method for mobile interactions. These should feature a 4px thick "grabber" handle at the top and 24px top-corner radii.
- **Line-Art Icons:** Use ultra-thin (1pt to 1.5pt) stroke weights. Avoid filled icons unless indicating an "active" state in the navigation bar.
- **Cards:** The "Bento" style cards should have no external shadows. Use internal padding (20px) to give content breathing room.