# Phase 04: 2D Regional Exploration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the regional 2D map experience using `@arcgis/core/views/MapView`, implementing seamless transition from the 3D globe to top-down regional exploration while preserving geographic center coordinates, scale, and scientific context.

**Architecture:** Implement Approach A (Dual-Viewport Coordinator with Seamless Crossfade & State Mirroring). Build `MarsMapView` for 2D cartography on `GCS_Mars_2000` (`WKID 104971`), `ViewportCoordinator` to orchestrate 3D/2D views, `marsRegions.ts` defining verified scientific exploration bookmarks, and integrate regional navigation into `ToolsDrawer` and `TopCommandBar`.

**Tech Stack:** React 19, TypeScript, `@arcgis/core` 4.31, Tailwind CSS, Lucide React, Zustand, Vitest.

**Spec:** [`docs/superpowers/specs/2026-11-02-phase-04-2d-regional-exploration-design.md`](file:///home/laksh/Hackathons/Space-App/docs/superpowers/specs/2026-11-02-phase-04-2d-regional-exploration-design.md), [`PROMPTS.MD` (Phase 04)](file:///home/laksh/Hackathons/Space-App/PROMPTS.MD#L150-L180)

## Global Constraints
- Spatial Reference: strictly `GCS_Mars_2000` (`WKID 104971` / `104905`), Mars radius $a = 3,396,190\text{ m}$.
- Earth coordinate reference systems (WGS84, Web Mercator) are strictly banned.
- Continuous geographic context: switching from 3D to 2D must preserve exact latitude, longitude, and appropriate scale without jarring reloads.
- Graceful degradation: Guard WebGL/canvas in headless test environments (jsdom) and handle network timeouts.
- All components and state reducers must have unit tests.

---

### Task 1: Regional Exploration Bookmarks & Configuration

**Files:**
- Create: `src/config/marsRegions.ts`
- Create: `src/config/marsRegions.test.ts`

**Interfaces:**
- Produces: `MARS_REGIONS`, `MarsRegion` interface, helper `getRegionById(id: string)`.

- [ ] **Step 1: Write failing test in src/config/marsRegions.test.ts**
  Test region IDs (jezero, gale, olympus-mons, valles-marineris, elysium), coordinate ranges, bounding extents, and helper functions.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/config/marsRegions.test.ts`.
- [ ] **Step 3: Implement src/config/marsRegions.ts**
  Define `MarsRegion` type, verified regional entries with coordinates, bounding boxes, target scales, and descriptions.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/config/marsRegions.test.ts`.
- [ ] **Step 5: Commit Task 1**
  Commit regional config and tests.

---

### Task 2: AppStore State Enhancements for Regional Navigation

**Files:**
- Modify: `src/store/useAppStore.ts`
- Modify: `src/store/useAppStore.test.ts`

**Interfaces:**
- Consumes: `marsRegions.ts`
- Produces: `regionalCenter`, `selectedRegionId`, `setRegionalCenter`, `setSelectedRegionId`.

- [ ] **Step 1: Write failing test in src/store/useAppStore.test.ts**
  Test setting regional center coordinates, selecting a region, and verifying state transitions.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/store/useAppStore.test.ts`.
- [ ] **Step 3: Update src/store/useAppStore.ts**
  Add `regionalCenter: { longitude: number; latitude: number; zoom?: number; scale?: number }`, `selectedRegionId: string | null`, and corresponding actions.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/store/useAppStore.test.ts`.
- [ ] **Step 5: Commit Task 2**
  Commit store additions.

---

### Task 3: 2D Regional Map Component & Controls

**Files:**
- Create: `src/components/map/MapControls.tsx`
- Create: `src/components/map/MarsMapView.tsx`
- Create: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Consumes: `@arcgis/core`, `marsLayers.ts`, `marsRegions.ts`, `useAppStore`
- Produces: 2D cartographic Mars view with pan, zoom, north reset, extent reset, and return to 3D globe.

- [ ] **Step 1: Write failing test in src/components/map/MarsMapView.test.tsx**
  Test container rendering, headless WebGL fallback, controls rendering, and interaction callbacks.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/map/MarsMapView.test.tsx`.
- [ ] **Step 3: Implement MapControls.tsx and MarsMapView.tsx**
  Build 2D `MapView` on `WKID 104971`, MDIM 2.1 color basemap, MColorDEM hillshade, landing site graphics, and live telemetry tracking.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/map/MarsMapView.test.tsx`.
- [ ] **Step 5: Commit Task 3**
  Commit 2D map component and controls.

---

### Task 4: Continuous Viewport Coordinator

**Files:**
- Create: `src/components/map/ViewportCoordinator.tsx`
- Create: `src/components/map/ViewportCoordinator.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `MarsGlobeView.tsx`, `MarsMapView.tsx`, `useAppStore`
- Produces: Synchronized dual-viewport with smooth crossfade and coordinate preservation.

- [ ] **Step 1: Write failing test in src/components/map/ViewportCoordinator.test.tsx**
  Test switching between `GLOBAL_3D` and `REGIONAL_2D`, verifying container visibility classes and coordinate forwarding.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/map/ViewportCoordinator.test.tsx`.
- [ ] **Step 3: Implement ViewportCoordinator.tsx and update App.tsx**
  Wire `ViewportCoordinator` into `App.tsx` replacing standalone `MarsGlobeView`.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/map/ViewportCoordinator.test.tsx` and `src/App.test.tsx`.
- [ ] **Step 5: Commit Task 4**
  Commit viewport coordinator.

---

### Task 5: HUD Regional Navigation & Tools Integration

**Files:**
- Modify: `src/components/hud/ToolsDrawer.tsx`
- Modify: `src/components/hud/ToolsDrawer.test.tsx`
- Modify: `src/components/map/MarsGlobeView.tsx`

**Interfaces:**
- Consumes: `marsRegions.ts`, `useAppStore`
- Produces: "Regions" tab in `ToolsDrawer`, "Explore in 2D" buttons on landing sites and regions.

- [ ] **Step 1: Update ToolsDrawer.test.tsx with regional tab assertions**
  Verify Regions tab, region list rendering, clicking a region triggers `setSelectedRegionId` and switches to `REGIONAL_2D`.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/hud/ToolsDrawer.test.tsx`.
- [ ] **Step 3: Implement Regions tab in ToolsDrawer and quick-dive action**
  Add regional bookmarks with crater details, target geological features, and "Explore 2D Region" CTA.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/hud/ToolsDrawer.test.tsx`.
- [ ] **Step 5: Commit Task 5**
  Commit HUD regional navigation integration.

---

### Task 6: Full Verification, Documentation & Completion Report

**Files:**
- Modify: `PROGRESS.md`
- Modify: `ROADMAP.md`
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Run full Vitest test suite**
  Run `npm test` and verify 100% pass rate.
- [ ] **Step 2: Run production build**
  Run `npm run build` and ensure clean Vite bundle.
- [ ] **Step 3: Update documentation**
  Document Phase 04 completion in `PROGRESS.md`, `ROADMAP.md`, and `ARCHITECTURE.md`.
- [ ] **Step 4: Run postflight persistence**
  Execute `ship_postflight.py` to record lessons, timeline observation, and update knowledge graph.
- [ ] **Step 5: Commit Task 6 & Present Phase 04 Completion Report**
  Commit phase completion and wait for user sign-off.
