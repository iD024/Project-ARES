# Phase 07: Location Intelligence, Measurement & Black-Glass UI Rehaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform ARES into a sleek, high-contrast black-glass planetary exploration laboratory with larger readable typography, simplified modern controls, rich Martian landmark datasets, robust working layers, and full Phase 07 geodesic distance, polygon area, and elevation profile transect analysis tools.

**Architecture:** 
1. Build a high-precision Martian geodesy measurement service (`measurementService.ts`) for great-circle distance, spherical polygon area, and elevation transects ($R = 3,396,190\text{ m}$).
2. Create floating black-glass measurement toolbar (`MeasurementToolbar.tsx`) and an interactive elevation cross-section tray (`ElevationProfileTray.tsx`).
3. Rehaul the entire application HUD into a spacious, readable black-and-white glassmorphic design system (`bg-black/90 backdrop-blur-2xl border-white/10 text-slate-100` with enlarged `text-sm`/`text-base` typography).
4. Restructure `LayersDrawer.tsx` so each layer has explicit, human-friendly "What it is" and "How it looks" explanations, visual swatches, and rock-solid endpoints with graceful fallbacks.
5. Expand the landmark and landing site catalogs (`marsLandmarks.ts` and `mars.ts`) with 12+ historical missions and 10+ famous Martian geological wonders (Olympus Mons, Valles Marineris, Hellas Basin, Cydonia).

**Tech Stack:** React 19, TypeScript, Tailwind CSS, `@arcgis/core`, Lucide React, Vitest, React Testing Library.

**Spec / Requirements:**
- Invariants: Mars 2000 Geodetic Datum (`WKID 104971` / `104905`, $a = 3,396,190\text{ m}$). Earth CRS strictly banned.
- Theme: Black & white glassmorphism (`bg-black/90`, `border-white/10`, white text, `backdrop-blur-2xl`), large readable font sizes (minimum 13-14px for body text, 16-18px for headers).
- Simplified controls: Minimalist top command bar with fewer, cleaner glass pills.
- Scientific accuracy: Every measurement accurately references the Martian spheroid and elevation datum.

---

## File Structure

```
src/
├── config/
│   ├── mars.ts                      # Expand landing sites to 12+ verified missions
│   └── marsLandmarks.ts             # NEW: 10+ famous Martian geological wonders with coordinates & science
├── services/
│   ├── data/
│   │   ├── datasetRegistry.ts       # Fix broken endpoints, configure sublayers & descriptions
│   │   ├── layerService.ts          # WMS sublayer support, WebTileLayer resilient URL handling
│   │   └── measurementService.ts    # NEW: Mars 2000 geodesic distance, polygon area, transect elevation profiler
│   │   └── measurementService.test.ts # Test suite for geodesy math, area, and elevation sampling
├── components/
│   ├── hud/
│   │   ├── TopCommandBar.tsx        # Rehaul: Black-glass minimalist styling, larger text, consolidated pills
│   │   ├── MeasurementToolbar.tsx   # NEW: Floating measurement tool strip (Distance, Area, Profile, Clear)
│   │   ├── ElevationProfileTray.tsx # NEW: Collapsible black-glass elevation transect chart tray
│   │   ├── LayersDrawer.tsx         # Rehaul: Enlarged text, "What it is" & "How it looks" previews, status
│   │   ├── ToolsDrawer.tsx          # Rehaul: Integrated landmarks list, black-glass styling
│   │   ├── TerrainInspectorCard.tsx # Rehaul: Larger font, black glass, clear labels
│   │   ├── TerrainLegendPanel.tsx   # Rehaul: Larger font, black glass, high-contrast ramps
│   │   └── TelemetryStrip.tsx       # Rehaul: Always-visible signed elevation, black glass styling
│   └── map/
│       ├── MarsGlobeView.tsx        # Measurement graphics sync, click routing, crosshair pins
│       ├── MarsMapView.tsx          # 2D measurement graphics sync, click routing
│       └── ViewportCoordinator.tsx  # Mount MeasurementToolbar and ElevationProfileTray
└── store/
    └── useAppStore.ts               # Add measurement state (activeTool, activePoints, transectProfile)
```

---

## Task Decomposition

### Task 1: Mars 2000 Geodesic Measurement Service (`measurementService.ts`)
**Files:**
- Create: `src/services/data/measurementService.ts`
- Create: `src/services/data/measurementService.test.ts`

**Interfaces:**
- Produces:
  - `calculateMarsGeodesicDistance(points: Array<{ lon: number, lat: number }>): { totalMeters: number, totalKm: number, segments: number[] }`
  - `calculateMarsPolygonArea(vertices: Array<{ lon: number, lat: number }>): { areaSquareMeters: number, areaSquareKm: number, areaHectares: number }`
  - `generateElevationTransect(start: { lon: number, lat: number }, end: { lon: number, lat: number }, sampleCount?: number): Promise<ElevationTransectResult>`
- Consumes:
  - `queryPointElevation` from `terrainElevationService.ts`
  - `MARS_RADIUS_METERS = 3396190` from `marsGeodesyService.ts`

- [ ] **Step 1:** Write unit tests for distance calculation between known landmarks (e.g. Olympus Mons to Jezero Crater), polygon area calculation for a standard square on the Martian equator, and transect profile generation.
- [ ] **Step 2:** Run tests to verify failures.
- [ ] **Step 3:** Implement Haversine/great-circle multi-point distance on Mars sphere ($a = 3,396,190\text{ m}$).
- [ ] **Step 4:** Implement spherical polygon surface area using spherical excess on Mars datum.
- [ ] **Step 5:** Implement linear geodesic interpolation between start and end coordinates with elevation sampling via `queryPointElevation`.
- [ ] **Step 6:** Run tests and verify 100% pass.

---

### Task 2: Rich Mars Landmarks & Landing Sites Expansion
**Files:**
- Modify: `src/config/mars.ts`
- Create: `src/config/marsLandmarks.ts`
- Create: `src/config/marsLandmarks.test.ts`

**Interfaces:**
- Produces:
  - `MARS_LANDMARKS`: Array of 10+ landmarks (Olympus Mons, Valles Marineris, Hellas Basin, Gale Crater, Cydonia Mensae, Tharsis Montes, Jezero Delta, etc.) with coordinates, elevation, feature description, geological period, and scientific highlights.
  - Expanded `MARS_LANDING_SITES`: 12 verified landing sites (including InSight, Zhurong, Spirit, Opportunity, Phoenix, Viking 1 & 2, Pathfinder).

- [ ] **Step 1:** Write test asserting all 12 landing sites and 10 landmarks have verified Martian coordinates, valid elevations, and non-empty scientific metadata.
- [ ] **Step 2:** Implement `src/config/marsLandmarks.ts` with accurate Martian geodetic data.
- [ ] **Step 3:** Expand `src/config/mars.ts` with missing rovers/landers.
- [ ] **Step 4:** Run tests and verify 100% pass.

---

### Task 3: Layer Catalog Fixes, Plain-English Explanations & Resilient Fallbacks
**Files:**
- Modify: `src/services/data/datasetRegistry.ts`
- Modify: `src/services/data/layerService.ts`
- Modify: `src/components/hud/LayersDrawer.tsx`

**Features:**
- Add `visualAppearance` ("How it looks") and `scientificPurpose` ("What it is") in plain, engaging English to all datasets in `DATASET_REGISTRY`.
- Configure USGS WMS `Mars5M_Quads` sublayer correctly so it loads without error.
- Add client-side visual fallback for `mars-regional-slope` and offline indicators for unavailable extents.
- Redesign `LayersDrawer.tsx` into a spacious, black-glass modal/drawer with:
  - Large, readable typography (`text-sm` body, `text-base` title).
  - Clear visual color swatch indicating layer style (true-color photo, rainbow elevation tint, gray hillshade, cyan vector).
  - "What it is" and "How it looks" side-by-side callouts.
  - Smooth opacity sliders and active toggle badges.

- [ ] **Step 1:** Write component test verifying layer cards render "What it is" and "How it looks" text, and that toggles update store state.
- [ ] **Step 2:** Update `datasetRegistry.ts` with the rich descriptions and verified endpoints.
- [ ] **Step 3:** Update `layerService.ts` to configure WMS sublayers and handle offline tiles gracefully.
- [ ] **Step 4:** Rebuild `LayersDrawer.tsx` with the new black-glass aesthetic and enlarged text.
- [ ] **Step 5:** Run tests and verify 100% pass.

---

### Task 4: Black-Glass Minimalist Application Shell & Unified HUD
**Files:**
- Modify: `src/components/hud/TopCommandBar.tsx`
- Modify: `src/components/hud/TelemetryStrip.tsx`
- Modify: `src/components/hud/TerrainLegendPanel.tsx`
- Modify: `src/components/hud/TerrainInspectorCard.tsx`
- Modify: `src/components/hud/ToolsDrawer.tsx`

**Design Principles:**
- **Black-Glass Theme:** `bg-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] text-slate-100`.
- **Enlarged Typography:** Replace `text-[10px]` and `text-[11px]` with `text-xs` (12px), `text-sm` (14px), and `text-base` (16px).
- **Consolidated Controls:**
  - TopCommandBar: Brand identity + 3D/2D segmented switch + 4 primary glass buttons: `[Layers]`, `[Measure]`, `[Explorer]`, `[Legend]`.
  - TelemetryStrip: Full-width black glass bar with always-visible coordinates, signed elevation, and mode.
  - ToolsDrawer: Integrated landing sites + new planetary landmarks catalog.

- [ ] **Step 1:** Write component tests for `TopCommandBar`, `TelemetryStrip`, and `ToolsDrawer` verifying new button triggers and layout.
- [ ] **Step 2:** Apply black-glass design tokens and enlarged typography across `TopCommandBar.tsx` and `TelemetryStrip.tsx`.
- [ ] **Step 3:** Update `TerrainLegendPanel.tsx` and `TerrainInspectorCard.tsx` with larger high-contrast glass styling.
- [ ] **Step 4:** Update `ToolsDrawer.tsx` with black glass and the new Landmarks exploration section.
- [ ] **Step 5:** Run tests and verify 100% pass.

---

### Task 5: Phase 07 Measurement Toolbar & Elevation Profile Transect Tray
**Files:**
- Create: `src/components/hud/MeasurementToolbar.tsx`
- Create: `src/components/hud/ElevationProfileTray.tsx`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Modify: `src/components/map/ViewportCoordinator.tsx`

**Features:**
- `useAppStore.ts`: Add `activeMeasurementTool: 'distance' | 'area' | 'profile' | null`, `measurementPoints: Array<{ lon: number, lat: number }>`, `elevationTransect: ElevationTransectResult | null`.
- `MeasurementToolbar.tsx`: Floating black-glass toolbar with Distance (Ruler), Area (Polygon), Elevation Profile (Chart), and Clear buttons.
- `ElevationProfileTray.tsx`: Bottom collapsible black-glass drawer showing:
  - Interactive SVG elevation curve with gradient fill.
  - Min/Max elevation callouts, net elevation change, total distance, and average slope.
  - Mouse hover scrubbing: moving mouse along chart shows distance, elevation, and drops a crosshair on the map.
- Map integration:
  - Plot points and lines on 3D globe and 2D map using ArcGIS GraphicsLayers (`measurement-graphics-layer`).
  - Click to add points; double-click or button to complete measurement.

- [ ] **Step 1:** Write tests for `MeasurementToolbar` and `ElevationProfileTray`.
- [ ] **Step 2:** Add measurement state and actions to `useAppStore.ts`.
- [ ] **Step 3:** Implement `MeasurementToolbar.tsx` with tool toggles and live measurement readout.
- [ ] **Step 4:** Implement `ElevationProfileTray.tsx` with interactive SVG profile chart and stats.
- [ ] **Step 5:** Wire map click handlers in `MarsGlobeView.tsx` and `MarsMapView.tsx` to handle measurement drawing and graphics rendering.
- [ ] **Step 6:** Mount components in `ViewportCoordinator.tsx`.
- [ ] **Step 7:** Run tests and verify 100% pass.

---

### Task 6: Full Verification & Browser Integration Check
**Files:**
- Run: Vitest suite (all 28+ test files)
- Run: Python terrain pipeline tests
- Run: Vite production build (`npm run build`)

- [ ] **Step 1:** Verify all automated tests pass (`npm test`).
- [ ] **Step 2:** Verify Python slope pipeline passes (`pytest`).
- [ ] **Step 3:** Verify production build succeeds (`npm run build`).
- [ ] **Step 4:** Update `PROGRESS.md` and `ROADMAP.md` documenting Phase 07 milestones.

