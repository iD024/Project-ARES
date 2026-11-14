# ARES Mars Platform: UI Declutter & Ergonomic Redesign Specification

## 1. Overview & Objective
ARES (Advanced Reconnaissance and Exploration System) is a map-first Mars exploration platform. The current UI has grown cluttered due to multiple overlapping floating widgets, colliding coordinates (top-center, bottom-left, top-right), and 8 uncoordinated action buttons across 5 distinct drawers.

This specification prescribes an ergonomic, unified HUD architecture that eliminates visual clutter, eliminates component collisions, guarantees a map-first viewport, and complies with `DESIGN.md` (Obsidian Glass Aerospace) and Vercel Web Interface Guidelines.

---

## 2. Component Inventory & Audit Findings

| Component | Current Placement | Collision / Clutter Issue | Redesign Remediation |
|---|---|---|---|
| **TopCommandBar** | `top-4 left-4 right-4` | 8 action buttons crowded together; wraps on laptops; confusing drawer mappings. | Group into 3 clean clusters: **Explore** (Layers & Sites), **Missions** (Rovers & Routes), **Analysis** (Measure & Intel), plus a **Zen / HUD Hide** toggle. |
| **GlobeControls / MapControls** | `top-20 right-4` | Overlapped directly by `TerrainInspectorCard` (`top-20 right-4`). | Relocate to `top-24 right-4` with dynamic offset, or bottom-right tactical cluster above telemetry. |
| **TerrainInspectorCard** | `top-20 right-4` | Blocks camera zoom & tilt controls. | Dock on top-right with clean margin; collapses neatly when drawers open. |
| **ExtentCoverageBanner** | `top-16 center` | Overlaps `MeasurementToolbar` (`top-20 center`) and 2D Cartography Badge (`top-20 center`). | Integrate into a unified Top Status Stack that coordinates visibility and prevents overlapping. |
| **MeasurementToolbar** | `top-20 center` | Sits on top of coverage banner and 2D mode indicator. | Positioned cleanly below mode switcher with explicit z-index hierarchy and unified dismiss. |
| **ElevationProfileTray** | `bottom-14 left-4 right-4` | Completely covers `TelemetryStrip` (`bottom-4`) and `MapAttributionOverlay` (`bottom-16`). | Dock into a dedicated **Bottom Activity Shelf** anchored directly above `TelemetryStrip` (`bottom-16 left-4 right-4`) with smooth collapse. |
| **RoverMilestoneSlider** | `bottom-24 center` | Competes with `ElevationProfileTray`, `LocalPovControls`, and `TelemetryStrip`. | Part of mutually exclusive Bottom Activity Shelf. Only one active bottom analysis tray at any time. |
| **LocalPovControls** | `bottom-24 center` | Overlaps rover slider if both active. | Part of mutually exclusive Bottom Activity Shelf with clear exit button. |
| **TerrainLegendPanel** | `bottom-20 left-4` | Overlaps `MapAttributionOverlay` (`bottom-16 left-4`) and target site banner (`bottom-20 left-4`). | Move Legend into a flyout tab inside the unified Layers Drawer or position at bottom-left above attribution with coordinated stacking. |
| **Drawers (5 separate)** | Mixed Left & Right | Inconsistent open states (`isMissionControlOpen` vs `activeDrawer`); can open simultaneously on both sides. | Single unified drawer system: only one active drawer at a time, docked cleanly on the right (or left for layers), with unified state. |

---

## 3. Ergonomic Architecture & Spatial Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│  [ARES Mars 2000]         [ 3D Globe | 2D Map | POV ]      [Actions] [👁]│ <-- TopCommandBar
│                                                                        │
│                    [ Top Notification / Measure Hub ]                  │ <-- Top Center Stack
│                                                                        │
│                                                                        │
│                                                     [Cam Controls]     │ <-- Camera Dock
│                                                     [Inspector Card]   │
│                                                     [Unified Drawer]   │ <-- Docked Drawer
│                                                                        │
│                                                                        │
│             [ Bottom Shelf: Rover Slider / Elevation Transect ]        │ <-- Bottom Activity Shelf
│  [Attribution]                                                         │
│────────────────────────────────────────────────────────────────────────│
│  ● TELEMETRY | POS: 77.5°E, 18.4°N | ELEV: -2,560m | GCS_Mars_2000    │ <-- TelemetryStrip
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Key Improvements & UX Principles
1. **Map-First Viewport Invariant**: Mars is always the hero. Clutter is minimized to floating glass capsules with consistent `backdrop-blur-2xl` and hairline borders (`border-white/10`).
2. **Zen / Clean View Toggle (`isHudVisible`)**: One-click button in the command bar (or press `H` key) to hide all HUD chrome for a completely unobstructed cinematic Mars experience.
3. **Mutual Exclusivity for Complex Panels**:
   - Only one drawer open at a time (`activeDrawer`: `layers` | `tools` | `missions` | `routes` | `intel` | null).
   - Bottom activity shelf seamlessly switches between Elevation Profile, Rover Timeline, and POV Controls without collision.
4. **Zero Overlapping Rectangles**: Fixed spatial coordinates so no two floating cards ever occupy the same anchor.
5. **Accessibility & Vercel Guidelines**:
   - `min-h-[100dvh]` across containers.
   - Visible focus indicator rings (`focus-visible:ring-2 focus-visible:ring-white/40`).
   - Standardized `aria-expanded`, `aria-label`, and `role` attributes.
