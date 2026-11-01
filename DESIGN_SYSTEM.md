# ARES — Design System & Visual Specification

Inspired by high-agency aerospace interfaces and the immersive scientific feel of Esri Explore Mars, built with an original, proprietary ARES visual identity.

---

## 1. Aesthetic Direction: Tactical Aerospace Dark Mode
- **Canvas / Background:** Deep Space Obsidian (`#05070D`).
- **Surface / Cards:** Cold Carbon Slate (`#0B0F19`, `rgba(15, 23, 42, 0.85)`).
- **Glassmorphism Panels:** `backdrop-blur-xl bg-slate-900/90 border border-slate-700/60 shadow-2xl`.
- **Primary Accent:** Martian Rust & Sub-solar Amber (`#EA580C` / `#F97316` / `#F59E0B`).
- **Telemetry & Science Data:** Phosphor Cyan / Ice Blue (`#06B6D4` / `#22D3EE`).
- **Surface Elevation Gradient:** MOLA Hypsometric ramp (Deep Purple $\rightarrow$ Teal $\rightarrow$ Green $\rightarrow$ Ochre $\rightarrow$ White).

---

## 2. Typography Hierarchy
- **Primary Interface Font:** Inter / sans-serif (clean readability for labels and narrative descriptions).
- **Telemetry & Numbers:** JetBrains Mono / monospace (`font-mono tabular-nums tracking-wider uppercase`).
- **Scale:**
  - Headers: `text-sm font-bold font-mono tracking-widest`
  - Body: `text-xs text-slate-300 font-sans`
  - Micro-data: `text-[10px]` / `text-[11px] font-mono`

---

## 3. UI Component Inventory (`src/components/`)

### Primitives (`src/components/ui/`)
| Component | Variants / States | Use Case |
|---|---|---|
| `Button` | `primary`, `secondary`, `tactical`, `danger`, `ghost` | Action triggers, command buttons |
| `Badge` | `OBSERVED`, `DERIVED`, `MODELED`, `SIMULATED`, `ACTIVE` | Scientific data classification labels |
| `Slider` | Continuous `min`, `max`, `step` with `%` readout | Layer opacity and blend adjustments |
| `Tabs` | Horizontal segmented pills with active highlight | Category filters, tool selector |
| `Drawer` | `left` (Layers) or `right` (Tools), collapsible, ESC dismiss | Primary lateral HUD control drawers |
| `Modal` | Centered backdrop-blur dialog, accessible ARIA roles | In-depth scientific catalogs and dossiers |

### HUD Panels (`src/components/hud/`)
| Component | Placement | Content |
|---|---|---|
| `TopCommandBar` | `fixed top-4 left-4 right-4` | Brand logo, Mode Switcher (`GLOBAL 3D`, `REGIONAL 2D`, `LOCAL`), Drawer buttons |
| `TelemetryStrip` | `fixed bottom-4 left-4 right-4` | Live Mars Coordinates, Elevation, Subsolar point, CRS (`WKID 104905`) |
| `ViewportPlaceholder`| `absolute inset-0` | Tactical orbital graticule rings, target reticle, readiness indicator |
| `LayersDrawer` | `left-4 top-16 bottom-14` | Viking, MOLA, THEMIS, USGS Geologic layers, opacity sliders |
| `ToolsDrawer` | `right-4 top-16 bottom-14` | Perseverance, Curiosity, InSight landing site selector, tool tabs |
| `ProvenanceModal` | Centered modal | Full provenance metadata table for all planetary layers |

### Feedback States (`src/components/feedback/`)
| Component | Function |
|---|---|
| `EmptyState` | Rendered when no waypoints, layers, or targets are active |
| `LoadingOverlay` | Full-screen translucent blur with spinner during heavy data stream |
| `ErrorBanner` | Alert for network timeouts or missing WMTS tiles with retry action |
