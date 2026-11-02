# Phase 7.5 — Local Analysis 3D POV Mode & Planetary Layer Diagnostics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the 2D local analysis view into a Google Earth-style 3D Point-Of-View (POV) ground-level inspection experience for Martian landmarks and landing sites, and diagnose/restore the planetary scientific data layers (especially derived layers and vector features) so they render reliably.

**Architecture:** 
- In `ViewportCoordinator.tsx`, route `LOCAL_ANALYSIS` to the 3D `MarsGlobeView` with specialized ground-level camera constraints and floating `LocalPovControls.tsx`.
- In `MarsGlobeView.tsx`, eliminate the artificial 400 km orbital altitude restriction, enable pitch up to $85^\circ$, implement low-altitude terrain fly-to targeting landmark coordinates and elevations, and provide a 360° orbital rotation loop.
- In `ToolsDrawer.tsx`, add one-click "3D POV VIEW" actions to landing sites and geological landmarks.
- In `datasetRegistry.ts` and `layerService.ts`, configure explicit 3D/2D symbology for GeoJSON layers (IAU nomenclature and HiRISE footprints), configure verified MapServer endpoints for derived shaded relief and elevation, fix CTX mosaic delivery, and gracefully handle offline local tile paths.

**Tech Stack:** React 19, TypeScript, `@arcgis/core` (SceneView, MapView, GeoJSONLayer, TileLayer, ElevationLayer), Tailwind CSS, Lucide React, Vitest.

**Spec:** In-chat approved design from Phase 7.5 brainstorming session.

## Global Constraints
- Strictly Mars 2000 geodetic datum (`D_Mars_2000`, `WKID 104971` / `104905`). Mean equatorial radius $a = 3,396,190\text{ m}$.
- Earth coordinate reference systems (WGS84, Web Mercator EPSG:3857) are strictly banned from Mars scene viewports.
- Non-negotiable scientific data integrity: clearly label all data (OBSERVED, DERIVED, MODELED, SIMULATED).
- Maintain 100% passing test suite across all Vitest files and clean TypeScript build.

---

### Task 1: Planetary Layer Diagnostics & Restoration
**Files:**
- Modify: `src/services/data/datasetRegistry.ts`
- Modify: `src/services/data/layerService.ts`
- Test: `src/services/data/layerService.test.ts`

**Interfaces:**
- Consumes: `DATASET_REGISTRY` entries
- Produces: `createArcGISLayerInstance` with styled GeoJSON layers and verified MapServer/TileLayer instances

- [ ] **Step 1: Write failing tests in `src/services/data/layerService.test.ts`**
  - Test that `resolveLayerConfig` produces valid configs for all 10 catalog datasets.
  - Test that `createArcGISLayerInstance` attaches explicit symbol renderers and popup templates for GeoJSON vector layers (`mars-nomenclature` and `mars-hirise-footprints`).
  - Test that derived layers (`mars-mcolordem-shaded-relief`) resolve as operational tile layers.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/services/data/layerService.test.ts`.
- [ ] **Step 3: Update `datasetRegistry.ts` and `layerService.ts`**
  - Update `datasetRegistry.ts`: correct endpoint URLs, ensure valid categories, relax restrictive min/max scale barriers on CTX mosaic and geological quads.
  - Update `layerService.ts`: add styled ArcGIS SimpleRenderer/UniqueValueRenderer for GeoJSON points (cyan markers with labels) and polygons (translucent fill with bright border), configure WebTileLayer with resilient fallback.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/services/data/layerService.test.ts`.

---

### Task 2: 3D Local POV Camera Engine & Viewport Routing
**Files:**
- Modify: `src/types/hud.ts`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/components/map/ViewportCoordinator.tsx`
- Modify: `src/components/map/MarsGlobeView.tsx`
- Test: `src/components/map/ViewportCoordinator.test.tsx`
- Test: `src/components/map/MarsGlobeView.test.tsx`

**Interfaces:**
- Consumes: `ViewMode = 'GLOBAL_3D' | 'REGIONAL_2D' | 'LOCAL_ANALYSIS'`
- Produces: 3D SceneView active during both `GLOBAL_3D` and `LOCAL_ANALYSIS`, low-altitude camera navigation ($1,000\text{ m} - 15,000\text{ m}$), $85^\circ$ pitch support, and landmark fly-to.

- [ ] **Step 1: Write failing tests for ViewportCoordinator and GlobeView POV routing**
  - Test that `ViewportCoordinator` renders the 3D globe container when `viewMode === 'LOCAL_ANALYSIS'`.
  - Test that `MarsGlobeView` does not trigger auto-transition to 2D when in `LOCAL_ANALYSIS`.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/map/ViewportCoordinator.test.tsx`.
- [ ] **Step 3: Implement 3D SceneView POV support in `MarsGlobeView.tsx` & `ViewportCoordinator.tsx`**
  - Update `ViewportCoordinator.tsx`: set `isGlobeVisible = viewMode === 'GLOBAL_3D' || viewMode === 'LOCAL_ANALYSIS'`; `isMapVisible = viewMode === 'REGIONAL_2D'`.
  - In `MarsGlobeView.tsx`: relax camera altitude constraints (`min: 1000`, `tilt.max: 85`), guard the 550 km reactive watcher so it only triggers when `viewMode === 'GLOBAL_3D'`, and add listener for landmark fly-to with low-altitude ground perspective.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/map/ViewportCoordinator.test.tsx` and `src/components/map/MarsGlobeView.test.tsx`.

---

### Task 3: Floating Black-Glass `LocalPovControls.tsx` HUD Component
**Files:**
- Create: `src/components/hud/LocalPovControls.tsx`
- Create: `src/components/hud/LocalPovControls.test.tsx`
- Modify: `src/components/map/ViewportCoordinator.tsx`

**Interfaces:**
- Consumes: `useAppStore` (`viewMode`, `setViewMode`, `selectedLandingSiteId`, `selectedRegionId`, `telemetry`)
- Produces: Interactive HUD panel with 360° Orbit toggle, Pitch presets ($0^\circ, 45^\circ, 75^\circ, 85^\circ$), Eye Altitude presets ("Summit", "Drone", "Surface"), Compass heading indicator, and landmark jump menu.

- [ ] **Step 1: Write failing tests in `src/components/hud/LocalPovControls.test.tsx`**
  - Test rendering of POV controls when `viewMode === 'LOCAL_ANALYSIS'`.
  - Test pitch preset button clicks.
  - Test 360° orbit toggle state.
  - Test landmark selection triggers.
  - Test Exit POV button returning to `GLOBAL_3D`.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/hud/LocalPovControls.test.tsx`.
- [ ] **Step 3: Implement `src/components/hud/LocalPovControls.tsx`**
  - High-contrast black-glass styling (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
  - Wire actions: Orbit toggle, Pitch presets ($0^\circ, 45^\circ, 75^\circ, 85^\circ$), Eye Altitude presets, Landmark jump selector, Exit button.
  - Mount inside `ViewportCoordinator.tsx` conditionally when `viewMode === 'LOCAL_ANALYSIS'`.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/hud/LocalPovControls.test.tsx`.

---

### Task 4: Catalog Navigation & 1-Click "3D POV View" in `ToolsDrawer.tsx`
**Files:**
- Modify: `src/components/hud/ToolsDrawer.tsx`
- Modify: `src/components/hud/ToolsDrawer.test.tsx`

**Interfaces:**
- Consumes: `MARS_LANDMARKS`, `MARS_LANDING_SITES`
- Produces: "3D POV VIEW" action button alongside existing "EXPLORE IN 2D", activating `LOCAL_ANALYSIS` and targeting landmark coordinates.

- [ ] **Step 1: Write failing tests in `src/components/hud/ToolsDrawer.test.tsx`**
  - Test that clicking "3D POV VIEW" on a landing site sets `viewMode` to `LOCAL_ANALYSIS` and sets `selectedLandingSiteId`.
  - Test that clicking "3D POV VIEW" on a landmark sets `viewMode` to `LOCAL_ANALYSIS` and updates telemetry/inspection.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/hud/ToolsDrawer.test.tsx`.
- [ ] **Step 3: Implement "3D POV VIEW" actions in `ToolsDrawer.tsx`**
  - Add primary tactical "3D POV VIEW" button with Compass/Sparkles icon on each landmark and landing site card.
  - Ensure it transitions smoothly to `LOCAL_ANALYSIS`.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/hud/ToolsDrawer.test.tsx`.

---

### Task 5: End-to-End Verification, Documentation & Roadmap Ledger Update
**Files:**
- Modify: `PROGRESS.md`
- Modify: `ROADMAP.md`
- Modify: `PROMPTS.MD`

- [ ] **Step 1: Run complete test suite & build check**
  - Run `npm test` across all 30+ Vitest test files.
  - Run `npm run build` for full TypeScript compilation and Vite bundle verification.
- [ ] **Step 2: Update documentation ledgers**
  - Update `PROGRESS.md`: Record Phase 7.5 completion and verification results.
  - Update `ROADMAP.md`: Insert Phase 7.5 between Phase 07 and Phase 08.
  - Update `PROMPTS.MD`: Document Phase 7.5 prompt specification.
- [ ] **Step 3: Verify clean git status and report completion**

