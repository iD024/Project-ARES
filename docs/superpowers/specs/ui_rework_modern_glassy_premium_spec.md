# UI Rework Specification: Modern Black-White Glassy Premium Experience

## 1. Executive Summary & Aesthetic Stance
The goal is to elevate ARES from an early prototype HUD into a **high-precision, ultra-premium aerospace exploration interface**. 
- **Aesthetic Direction**: **Obsidian Glass / Dark Luxury Aerospace** (inspired by Linear, Apple VisionOS, and advanced aerospace mission control systems).
- **Core Palette**: Deepest black canvas (`#000000` / `#05070D`), translucent obsidian glass surfaces (`rgba(8, 10, 15, 0.75)` to `rgba(12, 16, 24, 0.85)`), hairline borders (`rgba(255, 255, 255, 0.1)`), and specular inset highlights (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`).
- **Typography & Usability**: Crisp monochrome typography (`#FFFFFF` primary, `rgba(255,255,255,0.65)` secondary, `rgba(255,255,255,0.4)` metadata) with `tabular-nums` alignment for technical metrics.
- **Accents**: Strictly disciplined. Mars rust (`#EA580C` / `#F97316`) is reserved for Mars identity & mission waypoints; precision cyan (`#06B6D4` / `#22D3EE`) is reserved for coordinates, geodesy, and active measurements. No rainbow clutter.

---

## 2. Usability & Layout Architecture

### A. Top Command Bar (`TopCommandBar.tsx`)
**Problem**: Currently has 8 disparate buttons packed into the right side with conflicting rainbow colors, causing horizontal crowding, visual noise, and awkward wrapping on laptop screens.
**Solution**:
1. **Brand Capsule (Left)**: Compact obsidian glass pill with glowing ARES Mars 2000 mark and telemetry pulse.
2. **View Mode Segmented Controller (Center)**: Seamless sliding glass pill with `GLOBAL 3D`, `REGIONAL 2D`, and `LOCAL ANALYSIS`. Crisp white active state with soft ambient glow.
3. **Action Dock (Right)**: Grouped into structured pods with clean monochromatic glass default states and unified active indicators:
   - **Exploration Group**: `Layers`, `Explorer` (Tools & Sites), `Missions` (Rover Traverses).
   - **Analysis Group**: `Measure`, `Routes` (Surface Route Planner), `Intel` (Scientific Intelligence).
   - **Quick Utility Group**: `Legend` (Hypsometry/Slope), `Data` (Provenance).
   - Responsive collapse: On narrower screens, labels collapse to high-signal icons with descriptive tooltips.

### B. Floating Telemetry Strip (`TelemetryStrip.tsx`)
**Problem**: Dense text with mismatched colors and borders.
**Solution**:
- Aerodynamic floating glass pill at bottom-center.
- High-contrast tabular pods:
  - Live Sol & System Status (subtle pulsing amber dot).
  - Mars 2000 Cursor Position (`Lat / Lon` in high-contrast cyan tabular font).
  - Datum Elevation (`+m` / `-m` with positive/negative dynamic color).
  - Geodetic CRS badge (`GCS_Mars_2000 (WKID 104905)`).
  - Active Viewport indicator.

### C. Floating HUD Panels & Drawers (`Drawer.tsx`, `Modal.tsx`, `TerrainInspectorCard.tsx`, etc.)
**Problem**: Inconsistent blur, heavy borders, dark blue/slate backgrounds that clash with pure black glass.
**Solution**:
- Standardized Glass Panel tokens:
  - Background: `bg-black/80 backdrop-blur-2xl`
  - Border: `border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.1)]`
  - Corner Radius: `rounded-2xl`
- Standardized Drawer Header:
  - Monospace uppercase title + clean subtitle.
  - Dedicated tactile close button with `Escape` keyboard shortcut.
- Standardized Card & Metric components:
  - Hairline glass card containers (`bg-white/[0.03] border border-white/[0.08] rounded-xl`).
  - High-density telemetry displays with clear label / value hierarchy.

---

## 3. Design Tokens & Styling System

| Token | Class / Value | Purpose |
|---|---|---|
| Canvas Base | `#000000` / `#05070D` | Unobtrusive viewport backdrop |
| Glass Surface | `rgba(10, 12, 18, 0.8)` | Floating HUD panels and drawers |
| Glass Elev | `rgba(16, 20, 28, 0.9)` | Active cards, menus, and inspector popovers |
| Glass Border | `rgba(255, 255, 255, 0.1)` | Hairline outer boundary |
| Glass Inset | `inset 0 1px 0 0 rgba(255,255,255,0.12)` | Specular top reflection |
| Text Primary | `#FFFFFF` (100%) | Headings, active values, coordinates |
| Text Secondary | `rgba(255, 255, 255, 0.65)` | Labels, descriptions, secondary metrics |
| Text Tertiary | `rgba(255, 255, 255, 0.40)` | Units, metadata, timestamps |
| Accent Mars | `#EA580C` / `#F97316` | Mars branding, rover active paths |
| Accent Cyan | `#06B6D4` / `#22D3EE` | Geodesy, measurements, coordinates |

---

## 4. Verification Plan

1. **Unit & Integration Tests**:
   - Run `npm test -- --run` to ensure all 296 tests pass without regression.
   - Verify `TopCommandBar.test.tsx`, `TelemetryStrip.tsx`, `TerrainInspectorCard.test.tsx`, `HudPanels.test.tsx`, and `Primitives.test.tsx`.
2. **Visual Inspection & Auditing**:
   - Spin up dev server and inspect desktop (`1280x800`) and mobile viewports (`375x667`).
   - Run Vercel Web Design Guidelines audit (`audit_ui.py`) to verify accessibility, focus rings, and contrast.

