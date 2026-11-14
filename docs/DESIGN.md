---
version: 1.1.0
name: ARES Mars Aerospace Glassy Design System
archetype: aerospace-dashboard
description: "Ultra-premium obsidian glass canvas, translucent floating HUD panels, hairline borders (rgba(255,255,255,0.1)), and disciplined high-contrast monochrome typography with precision Mars rust and cyan accents."

colors:
  primary: "#FFFFFF"
  on-primary: "#000000"
  primary-hover: "#F4F4F5"
  canvas: "#000000"
  surface-glass: "rgba(8, 10, 15, 0.80)"
  surface-elevated: "rgba(16, 20, 28, 0.90)"
  surface-card: "rgba(255, 255, 255, 0.03)"
  hairline: "rgba(255, 255, 255, 0.10)"
  hairline-strong: "rgba(255, 255, 255, 0.18)"
  hairline-subtle: "rgba(255, 255, 255, 0.06)"
  ink: "#FFFFFF"
  ink-muted: "rgba(255, 255, 255, 0.65)"
  ink-tertiary: "rgba(255, 255, 255, 0.40)"
  accent-mars: "#EA580C"
  accent-mars-hover: "#F97316"
  accent-cyan: "#06B6D4"
  accent-cyan-hover: "#22D3EE"
  semantic-success: "#10B981"
  semantic-warning: "#F59E0B"
  semantic-error: "#EF4444"

typography:
  display: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  mono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace"

radii:
  button: "10px"
  card: "16px"
  drawer: "24px"
  badge: "6px"
  pill: "9999px"

shadows:
  glass: "0 16px 40px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)"
  glass-elevated: "0 24px 64px rgba(0, 0, 0, 0.92), inset 0 1px 0 0 rgba(255, 255, 255, 0.16)"
  glow-white: "0 0 20px rgba(255, 255, 255, 0.18)"
  glow-cyan: "0 0 20px rgba(6, 182, 212, 0.25)"
  glow-mars: "0 0 20px rgba(234, 88, 12, 0.25)"
---

# ARES Design System: Obsidian Glass Aerospace HUD

> **Visual Source of Truth.** All generated frontend components, layouts, HUD drawers, and overlays must strictly conform to these tokens and directives.

---

## 1. Visual Philosophy & Core Invariants
- **Map-First Viewport**: The 3D Mars globe and 2D map dominate the screen edge-to-edge. All UI elements float above as aerodynamic glass capsules and collapsible drawers.
- **Obsidian Glassmorphism**: Translucent black glass surfaces (`bg-black/80 backdrop-blur-2xl`) layered with ultra-thin hairline borders (`border border-white/10`) and specular top inset highlights (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`).
- **Disciplined Monochrome Baseline**: Backgrounds, borders, and typography stay in a refined black/white/silver spectrum. Color is never decorative — it is strictly semantic:
  - Mars Rust (`#EA580C`): Rover mission trails, landing sites, core ARES identity.
  - Precision Cyan (`#06B6D4`): Coordinates, elevation metrics, distance tools, geodesy badges.
  - Emerald / Amber / Crimson: Surface status, slope risk, warnings.

---

## 2. Interaction & Usability Mandates
- **Top Command Bar**: Cleanly partitioned into Brand, Viewport Switcher, and Grouped Action Docks so controls never collide or wrap clumsily.
- **Telemetry Strip**: Anchored flight-deck capsule with monospace `tabular-nums` for rock-solid numerical stability without jitter.
- **Drawers & Floating HUD**: Standardized padding, consistent 24px corner radiuses, dedicated close triggers (`X` button and `Escape` key listener), and accessible `aria` attributes.
- **Semantic HTML & Focus Rings**: Every interactive element uses `<button>` or `<a>` with explicit accessible labels and `focus-visible:ring-2 focus-visible:ring-white/40`.
