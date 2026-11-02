# Phase 09 — Terrain-Aware Route Planning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive, terrain-aware surface route planning engine for Mars that calculates multi-candidate traversability paths (Safest, Balanced, Direct Distance) using geodetic A* pathfinding on Mars 2000 DEM grids, with black-glass HUD controls (`RoutePlannerDrawer.tsx`), elevation profile integration, and dual-viewport (3D SceneView & 2D MapView) graphics synchronization.

**Architecture:** A client-side geodetic lattice pathfinding service (`routePlanningService.ts`) samples elevations via `queryPointElevation`, evaluates 8-neighbor slope cost surfaces on Mars 2000 datum ($R = 3,396,190\text{ m}$), applies Catmull-Rom geodetic smoothing, and generates 3 candidate routes with vehicle profile telemetry. Zustand store (`useAppStore.ts`) coordinates inputs and bridges directly to `ElevationProfileTray.tsx`. High-contrast black-glass HUD components (`RoutePlannerDrawer.tsx`, `TopCommandBar.tsx`) and viewport graphics layers (`MarsGlobeView.tsx`, `MarsMapView.tsx`) render routes and allow 1-click map coordinate picking.

**Tech Stack:** TypeScript, React 19, `@arcgis/core` (SceneView, MapView, GraphicsLayer, Polyline, Point), Zustand, Tailwind CSS, Lucide React, Vitest.

**Spec:** [`docs/superpowers/specs/phase_09_route_planning_spec.md`](file:///home/laksh/Hackathons/Space-App/docs/superpowers/specs/phase_09_route_planning_spec.md)

## Global Constraints
- Strictly Mars 2000 geodetic datum (`D_Mars_2000`, `WKID 104971` / `104905`, $R = 3,396,190\text{ m}$). Earth coordinates (EPSG:3857, WGS84) are strictly banned.
- All derived paths labeled `MODELED / SIMULATED`.
- Mandatory non-negotiable disclaimer: *"Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles."*
- Slope threshold: nominal max safe slope $\le 15^\circ$; impassable cliff threshold $\ge 25^\circ$.
- High-contrast aerospace black-glass HUD styling (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).

---

## File Structure & Responsibilities

| File | Purpose |
|---|---|
| `src/services/data/routePlanningService.ts` | Geodetic lattice generation, A* search, slope cost formulation, Catmull-Rom smoothing, candidate route generation, preset scenarios, vehicle profiles. |
| `src/services/data/routePlanningService.test.ts` | Unit tests for lattice grid math, A* pathfinding, slope avoidance, candidate variations, presets, and smoothing. |
| `src/types/hud.ts` | Update `DrawerId` to include `'routes'`. |
| `src/store/useAppStore.ts` | Route planner state slices (`routeOrigin`, `routeDestination`, `activeVehicleProfile`, `candidateRoutes`, `selectedRouteIndex`, `isRoutePlannerOpen`, `isPickingRoutePoint`), atomic setters, and elevation transect bridge. |
| `src/store/useAppStore.test.ts` | Unit tests for route planning store actions. |
| `src/components/hud/RoutePlannerDrawer.tsx` | Black-glass HUD drawer with coordinate inputs, map-pick toggles, preset selector, vehicle selector, candidate comparison cards, and elevation profile loader. |
| `src/components/hud/RoutePlannerDrawer.test.tsx` | Unit tests for RoutePlannerDrawer rendering, interactions, presets, and candidate selection. |
| `src/components/hud/TopCommandBar.tsx` | Add `[Routes]` trigger button with Route/Navigation icon. |
| `src/App.tsx` | Mount `RoutePlannerDrawer.tsx` within app drawer stack. |
| `src/components/map/MarsGlobeView.tsx` | Synchronize 3D SceneView `mars-routes-layer` with candidate route polylines and start/finish pins; handle click-to-pick coordinate mode. |
| `src/components/map/MarsMapView.tsx` | Synchronize 2D MapView `mars-routes-layer-2d` with candidate route polylines and start/finish pins; handle click-to-pick coordinate mode. |
| `src/components/map/MarsGlobeView.test.tsx` | Unit tests for 3D route graphics rendering and map-pick integration. |
| `src/components/map/MarsMapView.test.tsx` | Unit tests for 2D route graphics rendering and map-pick integration. |
| `PROGRESS.md` | Verification ledger and Phase 09 checklist. |

---

## Tasks

### Task 1: Planetary Route Planning Core Engine (`routePlanningService.ts`)

**Files:**
- Create: `src/services/data/routePlanningService.ts`
- Test: `src/services/data/routePlanningService.test.ts`

**Interfaces:**
- Consumes:
  - `calculateMarsGroundDistance` from `./marsGeodesyService.ts`
  - `queryPointElevation` from `./terrainElevationService.ts`
  - `GeodesicCoordinate`, `ElevationTransectResult` from `./measurementService.ts`
- Produces:
  - `VehicleProfileType`: `'HEAVY_ROVER' | 'SCOUT_ROVER' | 'AERIAL_DRONE'`
  - `VehicleProfile`: `{ id, name, maxSlopeDegrees, speedMetersPerSol, description }`
  - `RoutePlanningPreset`: `{ id, name, description, origin, destination, recommendedVehicle }`
  - `RouteWaypoint`: `{ longitude, latitude, elevationMeters, distanceFromStartKm, segmentSlopeDegrees }`
  - `CandidateRouteResult`: `{ id: 'SAFEST' | 'BALANCED' | 'DIRECT', name: string, colorHex: string, colorRgba: [number,number,number,number], waypoints: RouteWaypoint[], totalDistanceKm: number, maxSlopeDegrees: number, averageSlopeDegrees: number, elevationChangeMeters: number, totalAscentMeters: number, totalDescentMeters: number, estimatedSols: number, isTraversable: boolean, warningMessage?: string, elevationTransect: ElevationTransectResult }`
  - `planMarsRoutes(origin: GeodesicCoordinate, destination: GeodesicCoordinate, vehicle: VehicleProfileType): Promise<CandidateRouteResult[]>`
  - `ROUTE_PLANNING_PRESETS`: `RoutePlanningPreset[]`
  - `VEHICLE_PROFILES`: `Record<VehicleProfileType, VehicleProfile>`

- [ ] **Step 1: Write the failing unit tests for routePlanningService**
  - Test lattice grid generation between arbitrary points.
  - Test A* obstacle avoidance: when a steep cliff ($>25^\circ$) is placed between start and destination, Safest route detours around it while Direct route incurs high penalty.
  - Test all 3 candidate routes (Safest, Balanced, Direct) have distinct properties.
  - Test Catmull-Rom geodetic smoothing produces contiguous, monotonic waypoints.
  - Test conversion to `ElevationTransectResult` with valid min/max elevation.
  - Test preset mission scenarios load valid coordinates.
  - Test vehicle profile speeds and sol estimations.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement routePlanningService.ts**
  - Implement geodetic bounding box with 25% safety margin.
  - Implement adaptive lattice grid resolution (e.g. $25 \times 25$ to $40 \times 40$ nodes).
  - Implement 8-neighbor spatial connectivity with great-circle ground distance.
  - Implement edge slope calculation $\theta(u, v) = \arctan(|\Delta z| / \text{dist}(u, v)) \cdot 180^\circ / \pi$.
  - Implement cost functions for Safest ($w_{\text{slope}}=5.0, \theta_{\text{cutoff}}=15^\circ$), Balanced ($w_{\text{slope}}=2.0, \theta_{\text{cutoff}}=20^\circ$), and Direct ($w_{\text{slope}}=0.5, \theta_{\text{cutoff}}=25^\circ$).
  - Implement A* search with geodetic Euclidean heuristic.
  - Implement Catmull-Rom waypoint smoothing.
  - Implement metric derivations and `ElevationTransectResult` compilation.
  - Define `ROUTE_PLANNING_PRESETS` (Jezero Delta, Gale Ascent, Valles Marineris, Arcadia Base Alpha $\to$ SWIM Ice).
  - Define `VEHICLE_PROFILES` (Heavy Rover, Scout Rover, Aerial Drone).
- [ ] **Step 4: Run tests to confirm all pass cleanly**

---

### Task 2: Store Slice & Types Integration (`useAppStore.ts` & `src/types/hud.ts`)

**Files:**
- Modify: `src/types/hud.ts:7`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/store/useAppStore.test.ts`

**Interfaces:**
- Consumes:
  - `GeodesicCoordinate` from `../services/data/measurementService.ts`
  - `CandidateRouteResult`, `VehicleProfileType` from `../services/data/routePlanningService.ts`
- Produces:
  - `DrawerId`: `'layers' | 'tools' | 'sites' | 'routes' | null`
  - `routeOrigin`: `GeodesicCoordinate | null`
  - `routeDestination`: `GeodesicCoordinate | null`
  - `activeVehicleProfile`: `VehicleProfileType`
  - `candidateRoutes`: `CandidateRouteResult[]`
  - `selectedRouteIndex`: `number`
  - `isRoutePlannerOpen`: `boolean`
  - `isPickingRoutePoint`: `'origin' | 'destination' | null`
  - `setRouteOrigin(coord: GeodesicCoordinate | null): void`
  - `setRouteDestination(coord: GeodesicCoordinate | null): void`
  - `setActiveVehicleProfile(profile: VehicleProfileType): void`
  - `setCandidateRoutes(routes: CandidateRouteResult[]): void`
  - `setSelectedRouteIndex(index: number): void`
  - `setIsRoutePlannerOpen(open: boolean): void`
  - `setIsPickingRoutePoint(point: 'origin' | 'destination' | null): void`
  - `clearRoutePlanning(): void`

- [ ] **Step 1: Write failing tests in useAppStore.test.ts**
  - Test setting origin, destination, vehicle profile, candidate routes, and selected candidate index.
  - Test selecting candidate index updates `elevationTransect` in store.
  - Test picking point mode toggling.
  - Test `clearRoutePlanning()` resets routes and coordinates.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement store slices and actions in useAppStore.ts**
  - Update `DrawerId` in `src/types/hud.ts`.
  - Add state slices and atomic actions.
  - Connect `setSelectedRouteIndex` to auto-populate `elevationTransect` with `candidateRoutes[index].elevationTransect`.
- [ ] **Step 4: Run tests to confirm all pass**

---

### Task 3: Black-Glass Route Planner Drawer & HUD Controls

**Files:**
- Create: `src/components/hud/RoutePlannerDrawer.tsx`
- Create: `src/components/hud/RoutePlannerDrawer.test.tsx`
- Modify: `src/components/hud/TopCommandBar.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/hud/HudPanels.test.tsx`

**Interfaces:**
- Consumes:
  - `useAppStore` hooks
  - `planMarsRoutes`, `ROUTE_PLANNING_PRESETS`, `VEHICLE_PROFILES` from `../../services/data/routePlanningService.ts`
- Produces:
  - `RoutePlannerDrawer`: Complete interactive drawer with coordinate inputs, map picker triggers, preset scenario selection, vehicle configuration, candidate route cards, and elevation profile launcher.
  - `TopCommandBar`: `[Routes]` button toggling `activeDrawer === 'routes'`.

- [ ] **Step 1: Write failing tests in RoutePlannerDrawer.test.tsx**
  - Test drawer renders when `activeDrawer === 'routes'`.
  - Test preset scenario selection sets origin and destination coordinates.
  - Test vehicle profile selection.
  - Test clicking "Calculate Routes" triggers `planMarsRoutes` and renders candidate comparison cards (Safest, Balanced, Direct).
  - Test clicking "Inspect Elevation Profile" loads route into `elevationTransect` and opens elevation tray.
  - Test disclaimer text is present.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement RoutePlannerDrawer.tsx**
  - Follow ARES high-contrast black-glass theme (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
  - Add coordinate input fields for Lat/Lon with "Click Map to Set" crosshair toggle buttons.
  - Add Preset Mission Scenarios dropdown menu.
  - Add Vehicle Profile tabs (Heavy Rover, Scout Rover, Aerial Drone).
  - Add "Calculate Optimal Routes" action button with loading spinner.
  - Add 3 candidate comparison cards (Safest, Balanced, Direct Distance) displaying distance, max slope, average slope, elevation relief ($\Delta z$), and estimated sols.
  - Add "Inspect Elevation Profile" button that loads route into `ElevationProfileTray.tsx`.
  - Render non-negotiable scientific disclaimer at bottom.
- [ ] **Step 4: Update TopCommandBar.tsx & App.tsx**
  - Add `[Routes]` button to `TopCommandBar.tsx` with Route icon.
  - Mount `RoutePlannerDrawer` in `App.tsx` conditionally when `activeDrawer === 'routes'`.
- [ ] **Step 5: Run tests and verify all pass cleanly**

---

### Task 4: Dual-Viewport 3D Globe & 2D Map Routes Graphics Layer

**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Modify: `src/components/map/MarsGlobeView.test.tsx`
- Modify: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Consumes:
  - `candidateRoutes`, `selectedRouteIndex`, `routeOrigin`, `routeDestination`, `isPickingRoutePoint` from `useAppStore`
- Produces:
  - `mars-routes-layer` on SceneView (`MarsGlobeView.tsx`)
  - `mars-routes-layer-2d` on MapView (`MarsMapView.tsx`)
  - Click-to-pick coordinate handler on both viewports.

- [ ] **Step 1: Write failing tests in MarsGlobeView.test.tsx & MarsMapView.test.tsx**
  - Test that when `candidateRoutes` is populated, route polylines are added to graphics layer with designated color tokens (Safest: Emerald, Balanced: Cyan, Direct: Amber).
  - Test that selected route has expanded width.
  - Test start pin (Emerald) and finish pin (Crimson) are rendered when origin/destination exist.
  - Test clicking on map in `isPickingRoutePoint: 'origin'` sets `routeOrigin` and resets picking state without triggering spot inspection.
- [ ] **Step 2: Run tests to verify failure**
- [ ] **Step 3: Implement route graphics & map-picking in MarsGlobeView.tsx & MarsMapView.tsx**
  - Add `mars-routes-layer` to SceneView and `mars-routes-layer-2d` to MapView.
  - Add effect listening to `[candidateRoutes, selectedRouteIndex, routeOrigin, routeDestination]`.
  - Draw polylines for all 3 candidate routes (Safest, Balanced, Direct) with active route highlighted.
  - Draw start and destination marker pins.
  - Intercept map click: if `isPickingRoutePoint` is active, record clicked coordinates into `routeOrigin` or `routeDestination` and clear `isPickingRoutePoint`.
- [ ] **Step 4: Run tests and verify all pass cleanly**

---

### Task 5: End-to-End Verification Gate, Documentation & Release

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: Run full Python data pipeline test suite**
  - Command: `python3 -m unittest discover -s scripts/data_pipeline` (Assert 38/38 pass).
- [ ] **Step 2: Run full Vitest test suite**
  - Command: `npm test -- --run` (Assert all test files pass with 0 failures).
- [ ] **Step 3: Run Vite production build**
  - Command: `npm run build` (Assert exit code 0).
- [ ] **Step 4: Update PROGRESS.md**
  - Mark Phase 09 as COMPLETED & VERIFIED.
  - Document all test counts, deliverables, and declare readiness for Phase 10.
- [ ] **Step 5: Run AgentMemory postflight persistence**

