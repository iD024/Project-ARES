# Phase 02: Global 3D Mars Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the interactive global 3D Mars environment using `@arcgis/core` configured with `GCS_Mars_2000` (WKID `104971`/`104905`), real Mars MDIM surface imagery, 3D Martian MDEM200M elevation terrain, verified 3D landing site markers, and live telemetry synchronization.

**Architecture:** Replace the Phase 01 viewport placeholder with `MarsGlobeView`, a full-bleed 3D `SceneView` running on the Martian spheroid. Terrain elevation is supplied via the high-resolution Martian DEM image server (`astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer`), basemap imagery is supplied via Viking MDIM (`astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer`), and landing sites are plotted as 3D graphics with camera fly-to choreography.

**Tech Stack:** React 19, TypeScript, `@arcgis/core`, Tailwind CSS, Lucide React, Zustand, Vitest.

**Spec:** [`PROMPTS.MD` (Phase 02)](file:///home/laksh/Hackathons/Space-App/PROMPTS.MD#L81-L110), [`ARCHITECTURE.md`](file:///home/laksh/Hackathons/Space-App/ARCHITECTURE.md), [`DATA_CATALOG.md`](file:///home/laksh/Hackathons/Space-App/DATA_CATALOG.md)

## Global Constraints
- Spatial Reference: strictly `GCS_Mars_2000` (`wkid: 104971` / `104905`), Mars radius $a = 3,396,190\text{ m}$.
- Real elevation mesh: MOLA/HRSC blended elevation (`MDEM200M`). Do not use flat textured spheres.
- Verified landing locations: Perseverance ($18.38^\circ\text{ N}, 77.45^\circ\text{ E}$), Curiosity ($-4.59^\circ\text{ N}, 137.44^\circ\text{ E}$), InSight ($4.50^\circ\text{ N}, 135.62^\circ\text{ E}$).
- Graceful degradation: Guard WebGL/canvas in headless test environments (jsdom) and handle network timeouts.

---

### Task 1: Planetary Layers & Elevation Service Configuration

**Files:**
- Create: `src/config/marsLayers.ts`
- Test: `src/config/marsLayers.test.ts`

**Interfaces:**
- Consumes: `src/config/mars.ts`
- Produces: Service URLs, layer factories, and spatial reference definitions for Mars MDIM, MDEM200M elevation, and MColorDEM shaded relief.

- [ ] **Step 1: Write failing test in src/config/marsLayers.test.ts**
  Verify service endpoints, spatial reference WKID 104971, elevation surface configuration, and layer IDs.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/config/marsLayers.test.ts`.
- [ ] **Step 3: Implement src/config/marsLayers.ts**
  Define `MARS_SERVICE_ENDPOINTS`, `createMarsElevationLayer()`, `createMarsBasemap()`, and feature definitions.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/config/marsLayers.test.ts`.
- [ ] **Step 5: Commit Task 1**
  Commit layers config.

---

### Task 2: 3D Mars Globe View Component & Navigation Controls

**Files:**
- Create: `src/components/map/MarsGlobeView.tsx`
- Create: `src/components/map/GlobeControls.tsx`
- Test: `src/components/map/MarsGlobeView.test.tsx`

**Interfaces:**
- Consumes: `@arcgis/core`, `marsLayers.ts`, `useAppStore`
- Produces: Interactive 3D globe viewport with zoom, pitch, north orientation, and reset controls.

- [ ] **Step 1: Write failing test in src/components/map/MarsGlobeView.test.tsx**
  Test container rendering, headless WebGL fallback, and navigation control triggers.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/map/MarsGlobeView.test.tsx`.
- [ ] **Step 3: Implement GlobeControls.tsx and MarsGlobeView.tsx**
  Build camera controls (Reset, North, Tilt, Zoom) and ArcGIS `SceneView` initialization with elevation ground and dark space background.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/map/MarsGlobeView.test.tsx`.
- [ ] **Step 5: Commit Task 2**
  Commit 3D globe component and controls.

---

### Task 3: 3D Landing Sites Graphics & Camera Fly-To

**Files:**
- Create: `src/components/map/landingSitesLayer.ts`
- Modify: `src/components/map/MarsGlobeView.tsx`
- Test: `src/components/map/landingSitesLayer.test.ts`

**Interfaces:**
- Consumes: `MARS_LANDING_SITES`, `@arcgis/core/Graphic`, `@arcgis/core/layers/GraphicsLayer`
- Produces: 3D point markers and camera fly-to function for Perseverance, Curiosity, InSight, etc.

- [ ] **Step 1: Write failing test in src/components/map/landingSitesLayer.test.ts**
  Verify graphic generation for landing sites with Mars spatial reference, labels, and coordinates.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/map/landingSitesLayer.test.ts`.
- [ ] **Step 3: Implement landingSitesLayer.ts**
  Create graphics with 3D callout points, attributes, and popup templates. Connect site selection in `ToolsDrawer` to fly-to camera choreography.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/map/landingSitesLayer.test.ts`.
- [ ] **Step 5: Commit Task 3**
  Commit landing sites layer.

---

### Task 4: Live Telemetry & Pointer Coordinate Sync

**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/store/useAppStore.ts`

- [ ] **Step 1: Implement live pointer and camera event listeners**
  Add `pointer-move` and `camera` watchers on `SceneView` that calculate sub-solar longitude, map scale, and current pointer coordinates, updating `useAppStore.telemetry`.
- [ ] **Step 2: Verify telemetry update in tests**
  Update `src/components/map/MarsGlobeView.test.tsx` to verify telemetry synchronization.
- [ ] **Step 3: Commit Task 4**
  Commit telemetry integration.

---

### Task 5: Integrate Globe into Application Shell & End-to-End Build

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Replace ViewportPlaceholder with MarsGlobeView in src/App.tsx**
  Render the 3D globe as the primary viewport while preserving the floating HUD overlays.
- [ ] **Step 2: Update and run test suite**
  Verify all test suites pass with the 3D globe integrated.
- [ ] **Step 3: Verify production build**
  Execute `npm run build` to confirm zero compilation errors.
- [ ] **Step 4: Commit Task 5**
  Commit application integration.

---

### Task 6: Phase 02 Verification, Documentation & Completion Report

**Files:**
- Modify: `PROGRESS.md`
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Update documentation**
  Document the verified 3D Mars globe architecture, elevation service endpoints, and layer configurations.
- [ ] **Step 2: Present Phase 02 Completion Report**
  Deliver the formal completion report for user sign-off.

