# ARES — Design System & Visual Specification

Inspired by high-agency aerospace interfaces and the immersive scientific feel of Esri Explore Mars, but developed with an original, proprietary ARES visual identity.

---

## 1. Aesthetic Direction: Tactical Aerospace Dark Mode
- **Atmosphere:** Deep Space Obsidian & Carbon Black (`#090D16` / `#0F172A`).
- **Accent Highlighting:** Mars Rust & Sub-solar Amber (`#F97316` / `#EA580C` / `#F59E0B`).
- **Telemetry & Science:** Phosphor Cyan / Ice Blue (`#06B6D4` / `#38BDF8` / `#22D3EE`).
- **Surface Elevation Gradient:** MOLA Hypsometric ramp (Deep Purple $\rightarrow$ Indigo $\rightarrow$ Teal $\rightarrow$ Green $\rightarrow$ Ochre $\rightarrow$ White).

---

## 2. Color Palette & Semantic Tokens

```css
:root {
  /* Surface & Background */
  --ares-space-deep: #05070D;
  --ares-space-surface: #0B0F19;
  --ares-space-card: rgba(15, 23, 42, 0.75);
  --ares-space-border: rgba(51, 65, 85, 0.6);

  /* Tactical Accents */
  --ares-rust: #EA580C;
  --ares-amber: #F59E0B;
  --ares-cyan: #06B6D4;
  --ares-emerald: #10B981;
  --ares-crimson: #EF4444;

  /* Typography */
  --ares-text-primary: #F8FAFC;
  --ares-text-secondary: #94A3B8;
  --ares-text-muted: #64748B;
}
```

---

## 3. Typography
- **Primary Interface Font:** Inter / sans-serif (clean, readable at small scales).
- **Telemetry & Coordinates:** JetBrains Mono / monospace (aligned figures, tabular numbers `font-mono tracking-wider`).

---

## 4. Layout & Viewport Hierarchy
- **Primary Rule:** The map viewport is 100% full-screen (`inset-0 absolute`).
- **HUD Panels:** All UI containers float over the map with glassmorphism (`backdrop-blur-md bg-slate-900/80 border border-slate-700/60 shadow-2xl`).
- **Collapsibility:** All floating drawers (layers, elevation profiles, mission lists) can be minimized with a single click or keyboard shortcut.

---

## 5. Reusable UI Primitives
1. `TelemetryPill`: Displays live coordinate readouts (`24.52° N, 77.41° E | Elev: -2,450 m`).
2. `ModeToggle`: Seamless segmented switch between `GLOBAL 3D` and `REGIONAL 2D`.
3. `LayerCard`: Displays layer thumbnail, title, data type badge (Observed / Derived), opacity slider, and visibility toggle.
4. `MissionBadge`: Visual indicator for rover landing sites with sol counters and mission icons.
