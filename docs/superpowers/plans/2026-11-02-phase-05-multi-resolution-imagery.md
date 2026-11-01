# Phase 05: Multi-Resolution Imagery and Map Layers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the multi-resolution Mars imagery and scientific layer-management subsystem, providing dynamic layer synchronization between Zustand and `@arcgis/core` views, NASA Trek WMTS & USGS WMS support, opacity controls, scale-dependent progressive disclosure, and honest coverage feedback.

**Architecture:** A reusable layer coordinator hook (`useMarsLayerSync`) diffs and applies atomic updates (visibility, opacity, addition, removal) to live `@arcgis/core` `SceneView` and `MapView` instances. A dedicated `layerResolutionService` evaluates real-time view scale and geographic extent against layer capabilities to display honest coverage status in the HUD and viewport.

**Tech Stack:** React 19, TypeScript, `@arcgis/core` (SceneView, MapView, TileLayer, WebTileLayer, WMSLayer, GeoJSONLayer, ElevationLayer), Zustand, Tailwind CSS, Lucide React, Vitest.

**Spec:** [`docs/superpowers/specs/2026-11-02-phase-05-multi-resolution-imagery-design.md`](file:///home/laksh/Hackathons/Space-App/docs/superpowers/specs/2026-11-02-phase-05-multi-resolution-imagery-design.md)

## Global Constraints
- Strictly `GCS_Mars_2000` datum (`WKID 104971` / `104905`) with mean equatorial radius $a = 3,396,190\text{ m}$.
- Earth coordinate reference systems (EPSG:3857, WGS84) are strictly prohibited.
- Scientific data integrity: use real, traceable Mars datasets; distinguish `OBSERVED`, `DERIVED`, `MODELED`, and `SIMULATED`.
- No broken states or simulated imagery: if a region lacks high-resolution data or current zoom is outside scale bounds, display an honest "Data unavailable for this extent or scale" indicator.
- WebGL canvas context must be guarded safely during headless jsdom test runs.

---

### Task 1: Layer Resolution & Scale Evaluation Engine

**Files:**
- Create: `src/services/data/layerResolutionService.ts`
- Test: `src/services/data/layerResolutionService.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export type LayerScaleStatus = 'ACTIVE' | 'SCALE_INACTIVE' | 'OUT_OF_EXTENT' | 'OFFLINE';

  export interface BoundingBox {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  }

  export function evaluateLayerStatus(
    layer: {
      minScale?: number;
      maxScale?: number;
      extent?: BoundingBox;
      healthStatus?: string;
    },
    currentScale: number,
    currentCenter?: { longitude: number; latitude: number }
  ): LayerScaleStatus;
  ```

- [ ] **Step 1: Write the failing test**
  Create `src/services/data/layerResolutionService.test.ts` covering:
  - Returns `ACTIVE` when within `minScale` and `maxScale`.
  - Returns `SCALE_INACTIVE` when zoomed out past `minScale` or zoomed in past `maxScale`.
  - Returns `OUT_OF_EXTENT` when outside layer bounding box.
  - Returns `OFFLINE` when health status is `OFFLINE`.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/services/data/layerResolutionService.test.ts` and verify it fails.
- [ ] **Step 3: Implement `layerResolutionService.ts`**
  Write pure evaluation logic handling scale ranges, planetary longitude normalization ($[-180, 180]$ vs $[0, 360]$), and extent checks.
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/services/data/layerResolutionService.test.ts` and ensure all assertions pass.
- [ ] **Step 5: Commit changes**
  Commit Task 1 deliverables.

---

### Task 2: Dataset Registry & Layer Factory Upgrades

**Files:**
- Modify: `src/services/data/datasetRegistry.ts`
- Modify: `src/services/data/layerService.ts`
- Modify: `src/types/hud.ts`
- Test: `src/services/data/datasetRegistry.test.ts`
- Test: `src/services/data/layerService.test.ts`

**Interfaces:**
- Consumes: `LayerDeliveryFormat`
- Produces: Enhanced `DatasetEntry` with `minScale`, `maxScale`, `extent`, and `nasaTrekId`. `resolveLayerConfig()` and `createArcGISLayerInstance()` supporting `WebTileLayer` for NASA Trek WMTS tiles (`https://trek.nasa.gov/tiles/Mars/EQ/...`).

- [ ] **Step 1: Write the failing test**
  Update `layerService.test.ts` to assert that WMTS / NASA Trek datasets create a `WebTileLayer` or `TileLayer` with valid url template and subdomains, and that scale constraints (`minScale`, `maxScale`) are assigned to the resolved configuration.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/services/data/layerService.test.ts` and verify it fails on new requirements.
- [ ] **Step 3: Implement Dataset Registry & Layer Factory upgrades**
  - Update `datasetRegistry.ts` entries (Viking MDIM, CTX Mosaic, HiRISE Jezero DTM, MOLA Shaded Relief, USGS Geologic Quads) with realistic `minScale`, `maxScale`, and localized extents.
  - In `layerService.ts`, handle `WMTS` via `@arcgis/core/layers/WebTileLayer` with fallback to `TileLayer`, passing through `minScale` and `maxScale`.
- [ ] **Step 4: Run tests to verify success**
  Run `npx vitest run src/services/data/layerService.test.ts src/services/data/datasetRegistry.test.ts` and verify 100% pass.
- [ ] **Step 5: Commit changes**
  Commit Task 2 deliverables.

---

### Task 3: Dual-Viewport Reactive Layer Coordinator Hook

**Files:**
- Create: `src/hooks/useMarsLayerSync.ts`
- Test: `src/hooks/useMarsLayerSync.test.ts`

**Interfaces:**
- Consumes: `useAppStore` layers array, `@arcgis/core` `view` instance (`SceneView` or `MapView`), `isViewReady` boolean.
- Produces:
  ```typescript
  export function useMarsLayerSync(
    view: any,
    isViewReady: boolean
  ): {
    syncError: string | null;
    syncedLayerCount: number;
  };
  ```

- [ ] **Step 1: Write the failing test**
  Create `src/hooks/useMarsLayerSync.test.ts` testing:
  - Dynamically adds new visible layers from store to `view.map.layers`.
  - Mutates `.visible` and `.opacity` on existing layer instances when store updates without removing/re-adding them.
  - Removes or hides layers when marked invisible in store.
  - Cleans up layer listeners on unmount.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/hooks/useMarsLayerSync.test.ts` and verify failure.
- [ ] **Step 3: Implement `useMarsLayerSync.ts`**
  Implement the differential reconciliation hook using a `useRef<Map<string, any>>` cache of instantiated layers.
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/hooks/useMarsLayerSync.test.ts` and confirm passing assertions.
- [ ] **Step 5: Commit changes**
  Commit Task 3 deliverables.

---

### Task 4: Viewport Integration for 3D Globe & 2D Map

**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Test: `src/components/map/MarsGlobeView.test.tsx`
- Test: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Consumes: `useMarsLayerSync` hook, `useAppStore` telemetry state.
- Produces: Seamless multi-layer rendering in both 3D SceneView and 2D MapView without WebGL context thrashing.

- [ ] **Step 1: Write the failing test**
  Update `MarsGlobeView.test.tsx` and `MarsMapView.test.tsx` to assert that `useMarsLayerSync` is wired into both viewports and that scale changes update live telemetry scale in `useAppStore`.
- [ ] **Step 2: Run tests to verify failure**
  Run `npx vitest run src/components/map/MarsGlobeView.test.tsx src/components/map/MarsMapView.test.tsx` and observe test output.
- [ ] **Step 3: Update `MarsGlobeView.tsx` and `MarsMapView.tsx`**
  - Integrate `useMarsLayerSync(viewRef.current, isGlobeReady)` in `MarsGlobeView.tsx`.
  - Integrate `useMarsLayerSync(viewRef.current, isMapReady)` in `MarsMapView.tsx`.
  - Ensure baseline basemap (`mars-mdim-basemap`) and landing sites remain smoothly positioned as layers synchronize.
- [ ] **Step 4: Run tests to verify success**
  Run `npx vitest run src/components/map/MarsGlobeView.test.tsx src/components/map/MarsMapView.test.tsx` to verify all pass.
- [ ] **Step 5: Commit changes**
  Commit Task 4 deliverables.

---

### Task 5: HUD Layers Drawer with Scale Status & Opacity Feedback

**Files:**
- Modify: `src/components/hud/LayersDrawer.tsx`
- Test: `src/components/hud/LayersAndProvenance.test.tsx`

**Interfaces:**
- Consumes: `evaluateLayerStatus` from `layerResolutionService.ts`, `telemetry.scale` and `regionalCenter` from `useAppStore`.
- Produces: Dynamic status pills on layer cards (🟢 Active, 🟡 Scale Inactive, ⚪ Out of Extent), smooth debounced opacity sliders, and quick soloing.

- [ ] **Step 1: Write the failing test**
  Update `LayersAndProvenance.test.tsx` asserting:
  - Layer cards display real-time status pills reflecting current scale/extent.
  - Hovering/inspecting a scale-inactive layer provides helpful guidance (e.g. "Zoom in below 1:2,500,000 to resolve").
  - Opacity changes trigger `setLayerOpacity`.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/components/hud/LayersAndProvenance.test.tsx` and verify failure.
- [ ] **Step 3: Enhance `LayersDrawer.tsx`**
  - Integrate `evaluateLayerStatus` on each layer entry against the current scale.
  - Render status pills with accessible tooltip explanations.
  - Add quick action: "Solo Layer" (toggles off all other surface overlays) and "Reset Opacity".
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/components/hud/LayersAndProvenance.test.tsx` and confirm all tests pass.
- [ ] **Step 5: Commit changes**
  Commit Task 5 deliverables.

---

### Task 6: Viewport Attribution & Honest Extent Coverage Banner

**Files:**
- Create: `src/components/hud/MapAttributionOverlay.tsx`
- Create: `src/components/hud/ExtentCoverageBanner.tsx`
- Modify: `src/components/map/ViewportCoordinator.tsx`
- Test: `src/components/hud/MapAttributionOverlay.test.tsx`

**Interfaces:**
- Consumes: Active visible layers from `useAppStore`, current scale and center coordinates.
- Produces:
  - Floating bottom-left attribution chip displaying active imagery source, mission, and dataset classification badge.
  - Floating top-center warning banner when an active localized layer is out of current extent or scale bounds ("HiRISE DTM coverage active at Jezero Crater Delta; zoom in to resolve").

- [ ] **Step 1: Write the failing test**
  Create `src/components/hud/MapAttributionOverlay.test.tsx` verifying:
  - Renders attribution for the topmost visible surface layer.
  - Clicking attribution opens the scientific provenance modal.
  - Displays extent banner when active layer is outside current coordinates or scale.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/components/hud/MapAttributionOverlay.test.tsx` and verify failure.
- [ ] **Step 3: Implement `MapAttributionOverlay.tsx` and `ExtentCoverageBanner.tsx`**
  Build the floating HUD components following the ARES dark planetary design tokens (`ares-space`, `ares-panel`, `ares-cyan`, `ares-rust`). Mount inside `ViewportCoordinator.tsx`.
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/components/hud/MapAttributionOverlay.test.tsx` and verify green status.
- [ ] **Step 5: Commit changes**
  Commit Task 6 deliverables.

---

### Task 7: Full Regression Suite Verification & Production Build

**Files:**
- Verify all existing test files + new test suites
- Run Vite production build check

- [ ] **Step 1: Execute full test suite**
  Run `npm test` and verify that all test suites pass with 100% green status.
- [ ] **Step 2: Execute production build**
  Run `npm run build` to verify zero TypeScript or bundling errors.
- [ ] **Step 3: Update Progress & Roadmap**
  Update `PROGRESS.md` with Phase 05 checklist items.
- [ ] **Step 4: Commit and present Phase 05 completion report**
  Final commit and phase documentation.

