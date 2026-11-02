# Phase 06: Terrain Intelligence and Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the ARES scientific terrain intelligence system, providing authentic elevation visualization, Martian latitude-corrected slope modeling, geological chronostratigraphy legends, coordinate-based spot elevation inspection, and floating HUD inspection tools.

**Architecture:** A client-side planetary geodesy math engine (`marsGeodesyService`) calculates true ground distances and slope angles on the Mars 2000 ellipsoid ($a = 3,396,190\text{ m}$). An elevation sampling service (`terrainElevationService`) queries real elevations and feeds live telemetry and a floating `TerrainInspectorCard`. A floating `TerrainLegendPanel` delivers scientific color ramps and unit definitions.

**Tech Stack:** React 19, TypeScript, `@arcgis/core` (ElevationLayer, SceneView, MapView), Zustand, Tailwind CSS, Lucide React, Vitest, Python 3 (GDAL/NumPy mathematical models).

**Spec:** [`docs/superpowers/specs/2026-11-02-phase-06-terrain-intelligence-design.md`](file:///home/laksh/Hackathons/Space-App/docs/superpowers/specs/2026-11-02-phase-06-terrain-intelligence-design.md)

## Global Constraints
- Strictly `GCS_Mars_2000` datum (`WKID 104971` / `104905`) with mean equatorial radius $a = 3,396,190\text{ m}$.
- Earth coordinate reference systems (EPSG:3857, WGS84) are strictly prohibited.
- Scientific data integrity: use real, traceable Mars datasets (HRSC-MOLA blended DEM, MColorDEM, USGS Geologic Quads, HiRISE).
- Slope classification rule: Regional elevation-derived slope must be described as **Regional Terrain Slope (Derived)**, NEVER rover-scale obstacle detection.
- WebGL canvas context must be guarded safely during headless jsdom test runs.

---

### Task 1: Planetary Geodesy & Slope Math Engine

**Files:**
- Create: `src/services/data/marsGeodesyService.ts`
- Test: `src/services/data/marsGeodesyService.test.ts`

**Interfaces:**
- Produces:
  ```typescript
  export interface TerrainSlopeClassification {
    angleDegrees: number;
    category: 'FLAT' | 'GENTLE' | 'MODERATE' | 'STEEP' | 'PRECIPITOUS';
    description: string;
    disclaimer: string;
  }

  export function calculateMarsGroundDistance(
    lon1: number, lat1: number,
    lon2: number, lat2: number
  ): number;

  export function calculateSlopeAngle(
    elevationChangeMeters: number,
    horizontalDistanceMeters: number
  ): number;

  export function classifyRegionalSlope(
    angleDegrees: number
  ): TerrainSlopeClassification;

  export function estimateMarsElevationProfileSlope(
    points: Array<{ elevation: number; distanceMeters: number }>
  ): { averageSlopeDegrees: number; maxSlopeDegrees: number };
  ```

- [ ] **Step 1: Write the failing test**
  Create `src/services/data/marsGeodesyService.test.ts` testing:
  - Mars equatorial ground distance for $1^\circ$ longitude ($\approx 59.27\text{ km}$).
  - Latitude-dependent ground distance scaling at $60^\circ\text{N}$ ($\cos(60^\circ) = 0.5$, $\approx 29.64\text{ km}$).
  - Great-circle distance calculations using Haversine with $R = 3,396,190\text{ m}$.
  - Slope angle calculation from rise over run.
  - Classification into `FLAT`, `GENTLE`, `MODERATE`, `STEEP`, and `PRECIPITOUS` with mandatory disclaimer text.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/services/data/marsGeodesyService.test.ts` and verify failure.
- [ ] **Step 3: Implement `marsGeodesyService.ts`**
  Write pure geodesy math using Mars mean equatorial radius $a = 3,396,190\text{ m}$.
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/services/data/marsGeodesyService.test.ts` and verify 100% pass.
- [ ] **Step 5: Commit changes**
  Commit Task 1 deliverables.

---

### Task 2: Offline Planetary Terrain Pipeline Script

**Files:**
- Create: `scripts/data_pipeline/process_terrain_slope.py`
- Test: `scripts/data_pipeline/test_terrain_slope.py`

**Interfaces:**
- Produces: Standalone Python 3 pipeline demonstrating:
  - Calculation of Martian ground resolution $\Delta x$ and $\Delta y$ from cell size and latitude.
  - Horn's method gradient derivation for slope ($\theta = \arctan(\sqrt{p^2 + q^2})$).
  - Analytical hillshade calculation with configurable illumination azimuth ($315^\circ$) and solar altitude ($45^\circ$).
  - Generation of reproducible GDAL / DEM processing commands.

- [ ] **Step 1: Write the failing test**
  Create `scripts/data_pipeline/test_terrain_slope.py` testing slope and hillshade math with synthetic elevation arrays.
- [ ] **Step 2: Run test to verify failure**
  Run `python3 scripts/data_pipeline/test_terrain_slope.py` and confirm failure.
- [ ] **Step 3: Implement `process_terrain_slope.py`**
  Implement the script with command-line arguments, latitude correction factors, and documentation.
- [ ] **Step 4: Run test to verify success**
  Run `python3 scripts/data_pipeline/test_terrain_slope.py` and verify all assertions pass.
- [ ] **Step 5: Commit changes**
  Commit Task 2 deliverables.

---

### Task 3: Spot Elevation & Terrain Sampling Service

**Files:**
- Create: `src/services/data/terrainElevationService.ts`
- Test: `src/services/data/terrainElevationService.test.ts`

**Interfaces:**
- Consumes: Coordinates $(lon, lat)$, `marsGeodesyService.ts`, dataset registry.
- Produces:
  ```typescript
  export interface TerrainInspectionData {
    longitude: number;
    latitude: number;
    elevationMeters: number;
    regionalSlopeDegrees?: number;
    slopeCategory?: string;
    quadrangleName?: string;
    geologicalPeriod?: 'Amazonian' | 'Hesperian' | 'Noachian' | 'Undivided';
    classification: 'OBSERVED' | 'DERIVED' | 'INTERPRETED';
  }

  export async function queryPointElevation(
    longitude: number,
    latitude: number,
    elevationLayerInstance?: any
  ): Promise<number>;

  export function getQuadrangleForCoordinates(
    longitude: number,
    latitude: number
  ): { code: string; name: string };
  ```

- [ ] **Step 1: Write the failing test**
  Create `src/services/data/terrainElevationService.test.ts` testing:
  - Queries elevation from ArcGIS elevation layer with coordinate clamping.
  - Falls back gracefully to calibrated regional elevation model when offline or testing.
  - Accurately maps Martian coordinates to the 30 standard USGS Martian quadrangles (MC-01 Mare Boreum through MC-30 Mare Australe).
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/services/data/terrainElevationService.test.ts` and verify failure.
- [ ] **Step 3: Implement `terrainElevationService.ts`**
  Implement elevation querying, caching, quadrangle lookup table, and geological unit resolution.
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/services/data/terrainElevationService.test.ts` and confirm passing tests.
- [ ] **Step 5: Commit changes**
  Commit Task 3 deliverables.

---

### Task 4: Dataset Registry & Terrain Layer Additions

**Files:**
- Modify: `src/services/data/datasetRegistry.ts`
- Modify: `src/services/data/datasetRegistry.test.ts`
- Modify: `src/store/useAppStore.ts`

**Interfaces:**
- Consumes: `DatasetEntry`
- Produces: Registered terrain layers:
  - `mars-mcolordem-shaded-relief` (MColorDEM shaded relief MapServer)
  - `mars-hrsc-mola-blend` (MDEM200M ImageServer)
  - `mars-geologic-quads` (USGS Geologic WMS)

- [ ] **Step 1: Write the failing test**
  Add assertions in `datasetRegistry.test.ts` for shaded relief and topography layers.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/services/data/datasetRegistry.test.ts` and verify failure.
- [ ] **Step 3: Update `datasetRegistry.ts` and `useAppStore.ts`**
  Add entries with descriptions, citations, and appropriate categories (`topography`, `geology`).
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/services/data/datasetRegistry.test.ts` and verify 100% green.
- [ ] **Step 5: Commit changes**
  Commit Task 4 deliverables.

---

### Task 5: Floating HUD Terrain Legend Panel

**Files:**
- Create: `src/components/hud/TerrainLegendPanel.tsx`
- Test: `src/components/hud/TerrainLegendPanel.test.tsx`
- Modify: `src/components/hud/TopCommandBar.tsx`

**Interfaces:**
- Consumes: `useAppStore` layers state, `isLegendOpen` boolean.
- Produces: Collapsible floating HUD panel with:
  - Hypsometric elevation color ramp ($-8,200\text{ m}$ to $+21,229\text{ m}$)
  - Regional slope scale brackets ($0^\circ\text{–}5^\circ$, $5^\circ\text{–}15^\circ$, $15^\circ\text{–}25^\circ$, $>25^\circ$)
  - Martian chronostratigraphy (Amazonian, Hesperian, Noachian)
  - Toggle button in command bar / toolbar.

- [ ] **Step 1: Write the failing test**
  Create `src/components/hud/TerrainLegendPanel.test.tsx` verifying:
  - Renders all three legend tabs (Elevation, Slope, Geology).
  - Displays elevation range $-8,200\text{ m}$ to $+21,229\text{ m}$ with datum $0\text{ m}$ indicator.
  - Displays regional slope brackets with scientific disclaimer.
  - Toggles open/close cleanly.
- [ ] **Step 2: Run test to verify failure**
  Run `npx vitest run src/components/hud/TerrainLegendPanel.test.tsx` and confirm failure.
- [ ] **Step 3: Implement `TerrainLegendPanel.tsx`**
  Build with glassmorphism design tokens (`ares-space`, `ares-panel`, `ares-cyan`, `ares-rust`).
- [ ] **Step 4: Run test to verify success**
  Run `npx vitest run src/components/hud/TerrainLegendPanel.test.tsx` and verify 100% pass.
- [ ] **Step 5: Commit changes**
  Commit Task 5 deliverables.

---

### Task 6: Contextual Terrain Inspection Card

**Files:**
- Create: `src/components/hud/TerrainInspectorCard.tsx`
- Test: `src/components/hud/TerrainInspectorCard.test.tsx`
- Modify: `src/types/hud.ts`
- Modify: `src/store/useAppStore.ts`

**Interfaces:**
- Consumes: `activeTerrainInspection: TerrainInspectionData | null` from `useAppStore`.
- Produces: Floating card showing spot elevation, coordinates, slope classification with warning caveat, quadrangle name, and scientific classification badge (**DERIVED**).

- [x] **Step 1: Write the failing test**
  Create `src/components/hud/TerrainInspectorCard.test.tsx` verifying:
  - Renders coordinates, elevation in meters, and slope category.
  - Displays mandatory disclaimer: *"Regional terrain gradient derived from 200m DEM. Not suitable for rover-scale obstacle navigation."*
  - Close button resets `activeTerrainInspection` to null.
- [x] **Step 2: Run test to verify failure**
  Run `npx vitest run src/components/hud/TerrainInspectorCard.test.tsx` and verify failure.
- [x] **Step 3: Implement `TerrainInspectorCard.tsx`**
  Build card with accessible controls and dismiss action.
- [x] **Step 4: Run test to verify success**
  Run `npx vitest run src/components/hud/TerrainInspectorCard.test.tsx` and verify 100% pass.
- [ ] **Step 5: Commit changes**
  Commit Task 6 deliverables.

---

### Task 7: Dual-Viewport Click Inspection, Telemetry Elevation & Production Release

**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Modify: `src/components/map/ViewportCoordinator.tsx`
- Test: `src/components/map/MarsGlobeView.test.tsx`
- Test: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Consumes: `queryPointElevation`, `calculateSlopeAngle`, `classifyRegionalSlope`.
- Produces:
  - Clicking on the Martian surface samples elevation and opens `TerrainInspectorCard`.
  - Pointer movements continuously update `telemetry.elevation` in the bottom Telemetry Strip.
  - Mounts `TerrainInspectorCard` and `TerrainLegendPanel` inside `ViewportCoordinator.tsx`.

- [ ] **Step 1: Write the failing test**
  Add test assertions in `MarsGlobeView.test.tsx` and `MarsMapView.test.tsx` asserting surface click triggers terrain inspection.
- [ ] **Step 2: Run tests to verify failure**
  Run `npx vitest run src/components/map/MarsGlobeView.test.tsx src/components/map/MarsMapView.test.tsx` and verify failure.
- [ ] **Step 3: Update `MarsGlobeView.tsx`, `MarsMapView.tsx`, and `ViewportCoordinator.tsx`**
  Integrate elevation sampling and mount HUD panels.
- [ ] **Step 4: Run tests to verify success**
  Run full regression test suite `npm test` and `npm run build` to verify clean compilation.
- [ ] **Step 5: Update documentation & commit**
  Update `PROGRESS.md`, `ROADMAP.md`, and execute postflight persistence.

