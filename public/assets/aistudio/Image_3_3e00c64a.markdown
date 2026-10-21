---
name: Sovereign Slate
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
  headline-lg:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '500'
    lineHeight: 1.75rem
  body-lg:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a posture of absolute operational trust, architectural precision, and uncompromising digital security. Designed for critical administrative access, system gateways, and privileged identity workflows, the aesthetic eliminates decorative noise in favor of clarity, intent, and high-legibility feedback loops.

The visual style merges modern technical minimalism with deliberate tactile cues. It avoids casual consumer warmth, projecting institutional authority through crisp geometry, deep architectural slate tones, and razor-sharp input focus states. Interacting with the interface should evoke the sensation of engaging an impenetrable, expertly engineered vault: silent, immediate, and structurally robust.

## Colors

The palette is engineered around dark-mode operational resilience to reduce cognitive strain in low-light secure command centers while providing rigorous visual hierarchy.

- **Surface Neutral Canvas (`#090d16`)**: An obsidian slate base that acts as the absolute dark background. Higher surface levels shift slightly into cool blue-tinted slates (`#0f172a` for cards, `#1e293b` for elevated overlays).
- **Primary Cobalt (`#3b82f6`)**: Pure, high-luminance cobalt used exclusively for primary action pathways, definitive focus perimeters, and active credential confirmation.
- **Secondary Indigo (`#6366f1`)**: A restrained, luminous indigo allocated for secondary verification methods, SSO providers, and telemetry status anchors.
- **Tertiary Emerald (`#10b981`)**: Dedicated to security verification tokens, cryptographic handshake confirmations, and hardware MFA success flags.
- **Alert & Border Tiers**: Neutral borders use translucent white overlays (`rgba(255, 255, 255, 0.08)` to `rgba(255, 255, 255, 0.16)`), while critical threats and lockouts resolve in a stark crimson (`#ef4444`).

## Typography

The typography system pairs **Geist** for crisp structural readability with **JetBrains Mono** for technical precision and code/key representations.

- **Hierarchy**: Headlines are compact and low-contrast in scale, prioritizing functional balance over dramatic scale. 
- **Monospace Integration**: All input values, security keys, two-factor code fields, IP logs, and system audit notes mandate `JetBrains Mono` to eliminate glyph ambiguity (e.g., separating `0` from `O`, and `1` from `l`).
- **Letter Spacing**: Body text carries a neutral tracking (`0`), while uppercase mono labels apply a slight positive tracking (`+0.05em`) to maximize scanning speed in high-pressure login scenarios.

## Layout & Spacing

The layout is anchored by a centered authentication chassis on a constrained container grid, prioritizing hyper-focused viewports over sprawling content distribution.

- **Desktop (1024px+)**: The core authentication shell is strictly bounded to a max-width of `440px` (or `768px` for multi-column split views with active audit telemetry). Surrounding margins absorb the excess canvas with `margin: 2rem`.
- **Tablet (768px - 1023px)**: Single-column centered lockup with `1.5rem` gutters and minimum `1.5rem` outer canvas padding.
- **Mobile (< 768px)**: The card edge relaxes to a full-width viewport envelope, retaining `margin-sm: 1rem` safe side-inset paddings to prevent touch targeting errors at screen boundaries.
- **Internal Vertical Rhythm**: Input groups maintain strict `space-md` gaps. Sub-elements (labels to inputs, help-text to borders) stay rigidly locked at `space-xs` to `space-sm`.

## Elevation & Depth

Visual depth is achieved through layered tonal surfaces and calibrated, multi-stage dark-ambient drop shadows rather than dramatic lighting or bright gradients.

- **Base Canvas (Level 0)**: Background `#090d16`. Completely flat, non-reflective.
- **Card Chassis (Level 1)**: Surface `#0f172a` wrapped in a micro-border of `1px solid rgba(255, 255, 255, 0.08)`. Shadow: `0 1px 2px rgba(0, 0, 0, 0.4), 0 16px 32px -8px rgba(0, 0, 0, 0.5)`.
- **Interactive Layers & Overlays (Level 2)**: Dropdowns, MFA modals, and tooltip badges use surface `#1e293b` with a crisp `1px solid rgba(255, 255, 255, 0.12)` outline and an ambient perimeter shadow: `0 20px 40px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(59, 130, 246, 0.15)`.
- **Focus Glows**: Focus states suppress muddy blur radiuses, utilizing a sharp 2-stop ring: `0 0 0 2px #090d16, 0 0 0 4px #3b82f6`.

## Shapes

The geometric framework is categorized as **Soft** (`roundedness: 1`), conveying engineering rigor and structural precision.

- Standard inputs, buttons, chips, and alerts utilize `0.25rem` (`4px`) corner radii.
- Outer authentication containment cards utilize `rounded-lg` (`0.5rem` / `8px`).
- Modal sheets and security flyouts use `rounded-xl` (`0.75rem` / `12px`).
- Circular geometry is explicitly avoided for actionable components, reserved only for terminal user avatars, live security status pulses, and radio indicators.

## Components

### Buttons
- **Primary Action**: Solid `#3b82f6` with `#ffffff` text, font weight 500, padding `0.625rem 1rem`. Subtly transitions to `#2563eb` on hover. Active state scales to `0.99`.
- **Secondary / SSO**: `#1e293b` background with `1px solid rgba(255, 255, 255, 0.1)`. Neutral text `#f8fafc`. Hover introduces border tone `#3b82f6`.
- **Destructive**: Bare slate with crimson text `#ef4444` and border `rgba(239, 68, 68, 0.2)`; fills with red on confirmation.

### Input Fields & MFA Blocks
- **Field Structure**: Dark slate container (`#0b1120`), height `42px`, border `1px solid rgba(255, 255, 255, 0.12)`. Text renders in `JetBrains Mono` for password, hardware token, and username inputs.
- **Focus Behavior**: Immediate transition to border-color `#3b82f6` reinforced by a dual-ring focus outline (`2px` dark offset, `2px` cobalt stroke).
- **MFA Digit Cells**: Isolated square blocks (`48px x 48px`), centered monospace glyphs, displaying a subtle bottom highlight line when active.

### Checkboxes & Radios
- Size: `16px x 16px`. Default state is `#0b1120` with a subtle outline (`rgba(255, 255, 255, 0.2)`).
- Checked state transitions to `#3b82f6` with a crisp white tick mark. Focus displays the standard cobalt dual-ring.

### Cards & Security Containers
- Main authorization modules use `#0f172a` backing, internal padding of `2rem`, capped with a top security border (`2px solid #3b82f6` or neutral-subtle gradient).

### Chips & Security Badges
- Compact inline badges (`0.6875rem` mono uppercase). Green status (`#10b981`) indicates TLS/Hardware token active; amber indicates degraded connection security. Uses translucent backings (`rgba(16, 185, 129, 0.1)`).

### Additional Specialized Components
- **Hardware Key Prompt (WebAuthn / FIDO2)**: Pulsing radar-line state indicator using tertiary emerald tones to indicate biometric or physical YubiKey awaiting interaction.
- **Session Timeout Bar**: Minimalist `2px` linear progress tracker docked to the topmost perimeter of the card, executing an exact real-time countdown to credential invalidation.