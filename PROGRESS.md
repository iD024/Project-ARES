# ARES — Engineering Progress & Verification Log

## Overall Status: Phase 10 (COMPLETED & VERIFIED)

---

## Phase Ledger

| Phase | Title | Started | Completed | Verification Gate |
|---|---|---|---|---|
| **Phase 00** | Foundation & Reconnaissance | 2026-11-02 | 2026-11-02 | **PASSED** (8/8 tests pass, clean production build, 7 core docs). |
| **Phase 01** | Design System & App Shell | 2026-11-02 | 2026-11-02 | **PASSED** (34/34 tests pass, full HUD shell, TasteSkill design tokens, clean build). |
| **Phase 02** | Global 3D Mars Environment | 2026-11-02 | 2026-11-02 | **PASSED** (40/40 tests pass, 3D Mars globe running on GCS_Mars_2000, MDEM200M elevation, landing graphics, clean build). |
| **Phase 03** | Mars Data Infrastructure | 2026-11-02 | 2026-11-02 | **PASSED** (50/50 tests pass, Python ETL pipelines, HiRISE footprints & IAU nomenclature GeoJSON, layer factory, health monitor, clean build). |
| **Phase 04** | 2D Regional Exploration | 2026-11-02 | 2026-11-02 | **PASSED** (62/62 tests pass, 2D MapView on GCS_Mars_2000, continuous ViewportCoordinator, verified regional bookmarks, HUD navigation, clean build). |
| **Phase 05** | Multi-Resolution Imagery & Layers | 2026-11-02 | 2026-11-02 | **PASSED** (114/114 tests pass, dual-viewport useMarsLayerSync coordinator, NASA Trek WMTS & WebTileLayer, scale/extent evaluation, honest coverage indicators, clean build). |
| **Phase 06** | Terrain Intelligence & Analysis | 2026-11-02 | 2026-11-02 | **PASSED** (176 Vitest tests + 20 Python pipeline tests pass, planetary geodesy math, offline slope/hillshade pipeline, USGS 30-quad locator, TerrainLegendPanel, TerrainInspectorCard, live elevation telemetry). |
| **Phase 07** | Location Intelligence & Measurement| 2026-11-02 | 2026-11-02 | **PASSED** (206 Vitest tests + 20 Python tests pass, Mars 2000 geodesic distance, spherical polygon area, elevation transects, black-glass UI rehaul, 10 wonders + 12 landing sites, layer explanations). |
| **Phase 07.5** | Local Analysis 3D POV & Layer Diagnostics | 2026-11-02 | 2026-11-02 | **PASSED** (219 Vitest tests + 20 Python tests pass, Google Earth-style ground POV, 360° orbit, LocalPovControls flight deck, styled GeoJSON renderers, clean production build in 45.7s). |
| **Phase 08** | Mission & Rover Intelligence | 2026-11-02 | 2026-11-02 | **PASSED** (238 Vitest tests + 24 Python pipeline tests pass, Perseverance & Curiosity GeoJSON traverses in Mars 2000 WKID 104971, Sol milestone timeline scrubber, 1-click ground POV fly-tos, MissionControlDrawer, 3D/2D traverse GraphicsLayers, clean build). |
| **Phase 08.5** | Planetary Data Expansion (Rovers, Marsquakes, Resources & Base Sites) | 2026-11-02 | 2026-11-02 | **PASSED** (259 Vitest tests + 38 Python pipeline tests = 297 tests pass, complete 5-rover mobile fleet + InSight, MQS seismic catalog, CRISM minerals, SWIM subsurface ice sheets, settlement zones catalog, ArcGIS renderers, multi-rover viewport integration, clean build). |
| **Phase 09** | Terrain-Aware Route Planning | 2026-11-02 | 2026-11-02 | **PASSED** (274 Vitest tests + 38 Python pipeline tests = 312 tests pass, discrete geodetic lattice A* pathfinding on Mars 2000 datum, 3 candidate routes: Safest, Balanced, Direct, RoutePlannerDrawer, TopCommandBar Routes trigger, dual-viewport graphics layers, clean build in 24.96s). |
| **Phase 10** | Scientific Intelligence Interface | 2026-11-02 | 2026-11-02 | **PASSED** (296 Vitest tests + 38 Python pipeline tests = 334 tests pass, full scientific dossiers for all 14 datasets, chronostratigraphy, altimetry physics, A* traversal science, ScientificIntelDrawer, contextual deep-links, clean build in 24.98s). |
| **Phase 11** | Integration, Optimization & Release | — | — | Ready for Final Integration & Release. |

---

## Phase 10 Checklist
- [x] **Scientific Intelligence Core Domain Engine (`scientificIntelligenceService.ts`)**:
  - Implemented complete provenance and sensor dossiers for all 14 datasets in `DATASET_REGISTRY` (Viking, MColorDEM, MOLA, HRSC-MOLA, CTX, Geologic Quads, IAU Nomenclature, Regional Slope, HiRISE footprints, HiRISE Jezero DTM, InSight MQS, CRISM minerals, SWIM ice sheets, Settlement sites).
  - Explicitly classified each dataset into **OBSERVED**, **DERIVED**, **MODELED**, or **SIMULATED** with PDS citations, operating wavelengths, spatial resolutions, and coverage limits.
  - Formulated chronostratigraphic dossiers for all 3 Martian epochs: Noachian (4.1–3.7 Ga, phyllosilicates), Hesperian (3.7–3.0 Ga, sulfates, volcanism), Amazonian (3.0 Ga–present, ferric oxides, ice).
  - Defined laser altimetry and Horn's slope derivation physics with the mandatory regional DEM caveat.
  - Documented mathematical A* route cost equation ($C = d \cdot [1 + w_{\text{slope}} \cdot (\theta/\theta_{\text{max}})^2]$) and 3 vehicle mobility profiles.
  - Verified with 9 unit tests in `scientificIntelligenceService.test.ts`.
- [x] **Application Store & Types Integration (`useAppStore.ts` & `src/types/hud.ts`)**:
  - Added `'intel'` to `DrawerId` union.
  - Defined `ScientificIntelTab`: `'layers' | 'geology' | 'terrain' | 'routes'`.
  - Added store slices: `activeIntelTab`, `intelFocusedDatasetId`, `intelFocusedGeologyPeriod`, `intelFocusedQuadCode`.
  - Added atomic actions: `setActiveIntelTab`, `openIntelForDataset`, `openIntelForGeology`, `openIntelForRouteEvaluation`.
  - Verified with 11 unit tests in `useAppStore.test.ts`.
- [x] **Black-Glass Scientific Intelligence Drawer (`ScientificIntelDrawer.tsx`)**:
  - Built aerospace black-glass drawer (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`) with search filter.
  - 4 specialized interactive tabs:
    1. 📡 **Layers & Provenance**: Live dataset list, sensor breakdown, and 1-click PDS citation clipboard copying with feedback.
    2. 🌋 **Geology & Epochs**: Chronostratigraphic epoch cards, age ranges, diagnostic minerals, and USGS quadrangle locator.
    3. 📐 **Terrain & DEM Physics**: MOLA 1064nm altimetry, Horn's algorithm, slope gradient matrix with mobility risk, and regional scale warnings.
    4. 🧭 **Route Traversal Science**: A* edge cost equation, vehicle constraints, and candidate comparison rationales.
  - Verified with 7 unit tests in `ScientificIntelDrawer.test.tsx`.
- [x] **Top Command Bar & In-Situ Contextual Deep-Links**:
  - Added `[Intel]` trigger button with violet Atom icon to `TopCommandBar.tsx`.
  - Added `[SCIENTIFIC DOSSIER]` button to `TerrainInspectorCard.tsx` that deep-links into the `geology` tab with the active coordinate's epoch and quadrangle.
  - Added `[Why this route?]` button to `RoutePlannerDrawer.tsx` that deep-links into the `routes` tab with A* cost physics.
  - Added `[View Scientific Dossier]` info button to each layer item in `LayersDrawer.tsx` opening the `layers` tab with that dataset highlighted.
  - Mounted `ScientificIntelDrawer` inside `App.tsx`.
  - Verified with 38 unit/integration tests across `HudPanels.test.tsx`, `TerrainInspectorCard.test.tsx`, `RoutePlannerDrawer.test.tsx`, `LayersAndProvenance.test.tsx`, and `App.test.tsx`.
- [x] **Automated Verification Gate**:
  - Vitest Unit/Integration Tests: **296 passed (100%)** across 38 test files.
  - Python Data Pipeline Tests: **38 passed (100%)**.
  - Total Passing Tests: **334 passed**.
  - Production Build: Clean Vite bundle output in 24.98s with zero TypeScript compilation errors.

---

## Phase 09 Checklist
- [x] **Mars 2000 Geodetic Lattice & A* Routing Engine (`routePlanningService.ts`)**:
  - Implemented geodetic lattice grid construction on Mars 2000 datum ($R = 3,396,190\text{ m}$) with 25% safety expansion margin and latitude-dependent parallel scaling.
  - Implemented 8-neighbor spatial connectivity with continuous slope cost calculation $\theta(u, v) = \arctan(|\Delta z| / \text{dist}(u, v)) \cdot 180^\circ / \pi$.
  - Built A* pathfinder with geodetic Euclidean heuristic and simultaneous 3-candidate generation:
    1. 🟢 **Safest Route** (Green `#10B981`): High slope penalty ($w_{\text{slope}}=5.0$, cutoff $15^\circ$), weaves through valleys and flat plains.
    2. 🌐 **Balanced Route** (Cyan `#06B6D4`): Moderate slope penalty ($w_{\text{slope}}=2.0$, cutoff $20^\circ$), optimal compromise between distance and safety.
    3. 🟡 **Direct Distance Route** (Amber `#F59E0B`): Minimal slope penalty ($w_{\text{slope}}=0.5$, cutoff $35^\circ$), highlights raw direct distance and terrain warning hot-spots.
  - Configured 4 verified preset mission scenarios: Jezero Delta Fan Margin, Gale Mount Sharp Ascent, Valles Marineris Candor Crossing, and Arcadia Base Alpha $\to$ SWIM Ice Corridor.
  - Defined 3 vehicle profiles: Heavy Rover (100 m/sol, max $15^\circ$), Light Scout Rover (50 m/sol, max $12^\circ$), and Aerial Drone (1,000 m/hop).
  - Integrated `ElevationTransectResult` compilation for instant cross-section profiling.
  - Verified with 6 unit tests in `routePlanningService.test.ts`.
- [x] **Store Slice & Types Integration (`useAppStore.ts` & `src/types/hud.ts`)**:
  - Added `'routes'` to `DrawerId` union.
  - Added route planner state slices: `routeOrigin`, `routeDestination`, `activeVehicleProfile`, `candidateRoutes`, `selectedRouteIndex`, `isRoutePlannerOpen`, `isPickingRoutePoint`.
  - Added atomic actions (`setRouteOrigin`, `setRouteDestination`, `setActiveVehicleProfile`, `setCandidateRoutes`, `setSelectedRouteIndex`, `setIsPickingRoutePoint`, `clearRoutePlanning`).
  - Bridge to `elevationTransect`: selecting a candidate route auto-updates `elevationTransect` so `ElevationProfileTray.tsx` displays the route's elevation cross section.
  - Verified with 10 unit tests in `useAppStore.test.ts`.
- [x] **Black-Glass Route Planner Drawer (`RoutePlannerDrawer.tsx`) & Command Bar**:
  - Built aerospace black-glass drawer (`RoutePlannerDrawer.tsx`) with coordinate inputs and 1-click crosshair "Pick on Map" toggles.
  - Added Preset Mission Scenarios dropdown, Vehicle Profile selector tabs, and "Calculate Optimal Routes" action button.
  - Added candidate comparison cards displaying distance, max slope, average slope, relief ($\Delta z$), estimated sols, and PASSABLE / CLIPPED HAZARD badges.
  - Rendered mandatory scientific disclaimer: *"Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles."*
  - Added `[Routes]` trigger button with `Navigation` icon to `TopCommandBar.tsx` and mounted drawer in `App.tsx`.
  - Verified with 4 unit tests in `RoutePlannerDrawer.test.tsx` and 15 tests across `App.test.tsx` and `HudPanels.test.tsx`.
- [x] **Dual-Viewport 3D Globe & 2D Map Routes Graphics Layer (`MarsGlobeView.tsx` & `MarsMapView.tsx`)**:
  - Added dedicated `mars-routes-layer` to SceneView and `mars-routes-layer-2d` to MapView.
  - Rendered start diamond pin (Emerald `#10B981`) and destination diamond pin (Red `#EF4444`).
  - Rendered all 3 candidate paths with active route highlighted at width 4.5 vs background routes at width 2.0 with translucent styling.
  - Connected interactive map click handler: clicking anywhere in "Pick on Map" mode sets origin or destination coordinates without triggering spot inspection.
  - Verified with 12 tests in `MarsGlobeView.test.tsx` and 11 tests in `MarsMapView.test.tsx`.
- [x] **Automated Verification Gate**:
  - Vitest Unit/Integration Tests: **274 passed (100%)** across 37 test files.
  - Python Data Pipeline Tests: **38 passed (100%)**.
  - Total Passing Tests: **312 passed**.
  - Production Build: Clean Vite bundle output in 24.96s with zero TypeScript compilation errors.

---

## Phase 08.5 Checklist
- [x] **Complete Historical Mobile Rover Traverse Coverage (Opportunity, Spirit, Zhurong)**:
  - Extended `scripts/data_pipeline/generate_rover_traverses.py` with Opportunity MER-B (Meridiani Planum, 22 milestones, 45.16 km, Sol 5111), Spirit MER-A (Gusev Crater, 16 milestones, 7.73 km, Sol 2210), and Zhurong (Utopia Planitia, 12 milestones, 1.92 km, Sol 347).
  - All coordinates in exact Mars 2000 datum (`WKID 104971`), labeled `OBSERVED`, with monotonic distance and Sol progressions.
  - Generated `public/data/opportunity_traverse.geojson` (23 features), `public/data/spirit_traverse.geojson` (17 features), and `public/data/zhurong_traverse.geojson` (13 features).
  - Expanded `scripts/data_pipeline/test_rover_traverses.py` to 10 automated unit tests (100% passing).
- [x] **InSight Marsquake Seismic Catalog ETL (MQS Data Release 14)**:
  - Implemented `scripts/data_pipeline/generate_marsquakes.py` compiling 45 verified Mars seismic events from InSight MQS Data Release 14 (S0173a, S0235b, S1222a monster quake Mw 4.7, Cerberus Fossae low/high frequency events).
  - Derived epicenters via spherical forward geodesy from InSight station ($4.5023^\circ\text{N}, 135.6234^\circ\text{E}, R=3,396,190\text{ m}$).
  - Produced `public/data/mars_seismic_events.geojson` with magnitude, eventType, quality, and PDS citation.
  - Tested in `scripts/data_pipeline/test_marsquakes.py` (4 unit tests passing).
- [x] **Planetary Resources ETL (CRISM Minerals & SWIM Subsurface Glacial Ice)**:
  - Implemented `scripts/data_pipeline/generate_planetary_resources.py` synthesizing 10 CRISM hydrated mineral polygon deposits (smectites, carbonates, sulfates at Mawrth, Nili Fossae, Jezero, Melas) and 7 SWIM subsurface water ice polygon sheets (Arcadia, Deuteronilus, Utopia Planitia).
  - Verified closed polygon rings, anti-meridian safety, and coordinates in Mars 2000 datum.
  - Produced `public/data/mars_hydrated_minerals.geojson` and `public/data/mars_subsurface_ice.geojson`.
  - Tested in `scripts/data_pipeline/test_planetary_resources.py` (4 unit tests passing).
- [x] **Candidate Human Settlement & Base Zones Catalog**:
  - Implemented `src/config/marsSettlementSites.ts` structuring 8 prime Martian habitat candidates (Arcadia Base Alpha, Deuteronilus Outpost, Mawrth Oasis, Erebus Ridge, Melas Deep Haven, Utopia Colony One, Jezero Science Habitat, Gale Mount Sharp Hub).
  - Exported to `public/data/mars_settlement_sites.geojson` via `scripts/data_pipeline/export_settlement_sites.py`.
  - Tested in `src/config/marsSettlementSites.test.ts` (8 unit tests passing).
- [x] **Rover Mission Service & Mission Control Drawer Upgrade**:
  - Upgraded `src/services/data/roverMissionService.ts` and `roverMilestonesExtended.ts` with complete scientific instrument payloads and milestone dossiers for all 6 missions (Perseverance, Curiosity, Opportunity, Spirit, Zhurong, InSight).
  - Implemented dynamic traverse URL routing `getTraverseGeoJsonUrl()` and color palette helpers (`getRoverColorRgba`, `getRoverHexColor`).
  - Upgraded `MissionControlDrawer.tsx` to display all 6 missions with active tabs and 1-click tracking.
  - Verified in `roverMissionService.test.ts` (10 tests) and `MissionControlDrawer.test.tsx` (6 tests).
- [x] **Dataset Registry & ArcGIS Layer Factory Integration**:
  - Registered all 4 new datasets (`mars-seismic-catalog`, `mars-crism-minerals`, `mars-swim-subsurface-ice`, `mars-settlement-sites`) in `datasetRegistry.ts`.
  - Configured custom ArcGIS renderers and popup templates in `layerService.ts`:
    - Marsquakes: Glowing crimson circle markers with event metadata.
    - CRISM Minerals: Translucent emerald polygonal beds with mineralogy field infos.
    - SWIM Subsurface Ice: Glacial cyan hatched polygon sheets with depth and purity metrics.
    - Settlement Sites: Tactical amber diamond base markers with ISRU and safety attributes.
  - Verified in `datasetRegistry.test.ts` and `layerService.test.ts` (21 tests passing).
- [x] **3D Globe & 2D Map Multi-Rover Viewport & Ground POV**:
  - Integrated `getRoverColorRgba` in `MarsGlobeView.tsx` (3D SceneView) and `MarsMapView.tsx` (2D MapView) for all 5 rovers: Perseverance (Orange `#EA580C`), Curiosity (Cyan `#06B6D4`), Opportunity (Emerald `#10B981`), Spirit (Amber `#F59E0B`), Zhurong (Rose `#F43F5E`).
  - Added smooth camera fly-to / Ground POV navigation on rover selection and sol scrubber events.
  - Verified in `MarsGlobeView.test.tsx` (10 tests) and `MarsMapView.test.tsx` (9 tests).
- [x] **Automated Verification Gate**:
  - Vitest Unit/Integration Tests: **259 passed (100%)** across 35 test files.
  - Python Data Pipeline Tests: **38 passed (100%)**.
  - Total Passing Tests: **297 passed**.
  - Production Build: Clean Vite bundle output in 25.72s with zero TypeScript or packaging errors.

---

## Phase 08 Checklist
- [x] **Python ETL Pipeline & Mars 2000 GeoJSON Traverse Datasets**:
  - Implemented `scripts/data_pipeline/generate_rover_traverses.py` generating strictly Mars 2000 (`WKID 104971`) coordinate features for Perseverance (Jezero Crater delta) and Curiosity (Gale Crater / Mount Sharp).
  - Produced `public/data/perseverance_traverse.geojson` (23 features) and `public/data/curiosity_traverse.geojson` (21 features) featuring verified Sol milestones, earth dates, elevations, odometer distances, site names, formations, instrument targets, and PDS citations.
  - Implemented `scripts/data_pipeline/test_rover_traverses.py` with 4 comprehensive unit tests verifying coordinate bounds, monotonic distance and Sol progression, and property completeness.
- [x] **Rover Mission & Intelligence Service (`roverMissionService.ts`)**:
  - Implemented `src/services/data/roverMissionService.ts` governing dossiers for Perseverance (Mars 2020), Curiosity (MSL), Opportunity (MER-B), and Spirit (MER-A).
  - Structured detailed instrument payloads (PIXL, SHERLOC, SuperCam, Mastcam-Z, RIMFAX, MEDA, MOXIE, SAM, ChemCam, CheMin, APXS, DAN, REMS).
  - Added milestone retrieval utilities (`getRoverMilestones`, `getMilestoneBySol`, `getNextMilestone`, `getPrevMilestone`).
  - Added unit test suite in `src/services/data/roverMissionService.test.ts` (5 tests passing).
- [x] **Application Store Integration (`useAppStore.ts`)**:
  - Added `selectedRoverId`, `activeSol`, `isRoverTraverseVisible`, and `isMissionControlOpen` state slices with atomic setters.
  - Verified state transitions with unit tests in `src/store/useAppStore.test.ts` (9 tests passing).
- [x] **Interactive Sol Milestone Timeline Scrubber (`RoverMilestoneSlider.tsx`)**:
  - Built floating black-glass bottom HUD panel (`RoverMilestoneSlider.tsx`) activated whenever a rover is tracked.
  - Provided Sol milestone scrubber slider, Prev/Next milestone stepper buttons, live odometer (km), and elevation (m) telemetry chips.
  - Integrated 1-click **"3D GROUND POV AT SOL"** button that auto-transitions viewMode into `LOCAL_ANALYSIS` and positions the 3D camera at the rover's mast coordinates ($1,500\text{ m}$ altitude, $75^\circ$ tilt).
  - Mounted within `ViewportCoordinator.tsx` with dedicated unit tests in `RoverMilestoneSlider.test.tsx` (5 tests passing).
- [x] **Mission Control Drawer (`MissionControlDrawer.tsx`) & Command Bar**:
  - Built high-contrast black-glass drawer (`MissionControlDrawer.tsx`) supporting tabs for Perseverance, Curiosity, Opportunity, and Spirit.
  - Features status pills (ACTIVE / COMPLETED), mission dossiers, key specs grid (odometer, total sols, power source, landing date/site), primary science objectives list, scientific instrument breakdown cards, and direct NASA Planetary Data System (PDS) archive links.
  - Added "Track Rover on Mars" action that activates rover traverse visibility, centers the map, and sets the active Sol to the latest milestone.
  - Added `[Missions]` trigger button to `TopCommandBar.tsx` and mounted drawer in `App.tsx`.
  - Verified with tests in `MissionControlDrawer.test.tsx` (5 tests) and `HudPanels.test.tsx`.
- [x] **3D Globe & 2D Map Traverse Graphics Layers**:
  - Added dedicated `mars-rover-traverse-layer` to `MarsGlobeView.tsx` (SceneView) and `mars-rover-traverse-layer-2d` to `MarsMapView.tsx` (MapView).
  - Rendered high-contrast neon Polylines (Rust `#EA580C` for Perseverance, Cyan `#06B6D4` for Curiosity) and milestone circle Points.
  - Highlighted active Sol milestone with expanded orange reticle and glowing white halo.
  - Added interactive hitTest click handlers on both viewports allowing users to click any milestone marker to scrub the timeline and inspect attributes.
  - Verified with unit tests in `MarsGlobeView.test.tsx` (9 tests) and `MarsMapView.test.tsx` (8 tests).
- [x] **Automated Test Suite**: 34 Vitest test files (238 unit/integration tests) + 24 Python unit tests = 262 tests passing with 100% green status.
- [x] **Production Build**: Clean Vite production build with zero TypeScript or bundling errors.

---

## Phase 07.5 Checklist
- [x] **Google Earth-Style 3D Ground-Level Point-Of-View (POV)**:
  - Transformed `LOCAL_ANALYSIS` view mode from 2D MapView into full 3D SceneView with ground-level camera navigation.
  - Removed the artificial 400 km orbital altitude constraint (relaxed `altitude.min` to $1,000\text{ m}$), enabled dramatic pitch up to $85^\circ$ for ground horizon views.
  - Implemented elevation-aware landmark and landing site fly-tos in `MarsGlobeView.tsx` with horizontal setback and low eye-altitude ($1,500\text{ m} - 5,000\text{ m}$ above local terrain).
  - Guarded the 550 km low-orbit watcher so user zooming in `LOCAL_ANALYSIS` remains in 3D POV and never forcibly drops to 2D.
- [x] **Floating Tactical Black-Glass HUD Component (`LocalPovControls.tsx`)**:
  - Implemented `src/components/hud/LocalPovControls.tsx` with high-contrast aerospace black-glass styling (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
  - Added 360° Orbit Mode button for automated smooth rotation around landmarks.
  - Added discrete Pitch Angle presets: $0^\circ$ Top-Down, $45^\circ$ Oblique, $75^\circ$ Ground POV, $85^\circ$ Horizon.
  - Added Compass North orientation reset and live surface elevation telemetry chip.
  - Integrated Landmark Jumper dropdown allowing instant switching between the 10 Martian Wonders and 12 Landing Sites.
  - Added clean "Exit POV" action to return to `GLOBAL_3D`.
  - Mounted `LocalPovControls` within `src/components/map/ViewportCoordinator.tsx`.
- [x] **Catalog Navigation & 1-Click "3D POV VIEW" in `ToolsDrawer.tsx`**:
  - Added prominent tactical "3D POV VIEW" action buttons with Compass/Sparkles icons on each landing site and geological landmark card.
  - Connected `selectedLandmarkId` to global Zustand store (`useAppStore.ts`) so selecting landmarks anywhere updates the camera immediately.
- [x] **Planetary Layer Diagnostics & Restoration**:
  - Configured explicit styled ArcGIS renderers and popup templates for GeoJSON vector layers in `src/services/data/layerService.ts`:
    - `mars-nomenclature`: Glowing cyan diamond markers ($9\text{ px}$) with white borders and feature gazetteer popups.
    - `mars-hirise-footprints`: Translucent cyan fill with high-contrast orange ($2\text{ px}$) perimeter outlines and DTM metadata popups.
  - Verified derived layers (`mars-mcolordem-shaded-relief` TileLayer, `mars-hrsc-mola-blend` ElevationLayer) composite cleanly with opacity controls.
  - Corrected CTX mosaic and NASA Trek scale ranges in `datasetRegistry.ts`.
- [x] **Automated Test Suite**: 31 Vitest test files (219 unit/integration tests) + 20 Python unit tests = 239 tests passing with 100% green status.
- [x] **Production Build**: Clean Vite production build in 45.71s with zero TypeScript compilation errors.

---

## Phase 07 Checklist
- [x] Implemented `src/services/data/measurementService.ts` planetary geodesy measurement engine with high-precision great-circle distance ($R = 3,396,190\text{ m}$), spherical polygon surface area via spherical excess, and elevation cross-section transect sampling via MOLA elevation queries.
- [x] Expanded Martian scientific datasets:
  - Added 12 verified historical Mars landing sites in `src/config/mars.ts` (added Zhurong, Phoenix, Viking 1 & 2, Pathfinder/Sojourner, Beagle 2, Mars 3).
  - Created `src/config/marsLandmarks.ts` featuring 10 prominent Martian geological wonders (Olympus Mons, Valles Marineris, Hellas Basin, Gale Crater, Jezero Crater Delta, Tharsis Montes, Cydonia Mensae, Argyre Planitia, Noctis Labyrinthus, Medusae Fossae).
- [x] Upgraded Layer Catalog in `src/services/data/datasetRegistry.ts` with plain-English "What it is" and "How it looks" explanations and visual palette color swatches across all 10 datasets. Configured USGS WMS `Mars5M_Quads` sublayer and resilient layer handling in `layerService.ts`.
- [x] Complete Black-Glass UI Rehaul:
  - Transformed application theme into high-contrast black-glass aesthetic (`bg-black/90 backdrop-blur-2xl border-white/10 text-white shadow-[0_8px_32px_rgba(0,0,0,0.85)]`).
  - Increased typography to large, legible sizes (`text-sm` body, `text-base` headers, `text-xs` badges).
  - Consolidated and simplified HUD command bar: Brand identity + 3D/2D switch + fewer high-contrast glass buttons (`[Layers]`, `[Measure]`, `[Explorer]`, `[Legend]`, `[Data]`).
  - Redesigned `LayersDrawer.tsx`, `ToolsDrawer.tsx`, `Drawer.tsx`, `Tabs.tsx`, `TelemetryStrip.tsx`, `TerrainInspectorCard.tsx`, and `TerrainLegendPanel.tsx`.
- [x] Implemented Phase 07 Measurement Tools:
  - `MeasurementToolbar.tsx`: Floating black-glass toolbar with Distance (Ruler), Area (Polygon), Elevation Profile (Activity), Clear, and live readout chips.
  - `ElevationProfileTray.tsx`: Collapsible bottom black-glass tray rendering interactive SVG elevation cross-sections with gradient fill, zero datum line, hover scrubbing, relief change, and average slope.
  - Connected 3D globe (`MarsGlobeView.tsx`) and 2D map (`MarsMapView.tsx`) click handlers to plot measurement points, polylines, and polygons onto dedicated GraphicsLayers.
- [x] Automated test suite: 30 Vitest test files (206 unit/integration tests) + 20 Python unit tests = 226 tests passing with 100% green status.
- [x] Production build: Clean Vite compilation with zero TypeScript or bundling errors.

---

## Phase 06 Checklist
- [x] Implemented `src/services/data/marsGeodesyService.ts` planetary geodesy math engine with Mars 2000 ellipsoid radius $a = 3,396,190\text{ m}$, latitude cos-scaling for ground distances, slope angle derivation, regional slope classification (`FLAT`, `GENTLE`, `MODERATE`, `STEEP`, `PRECIPITOUS`), and mandatory non-negotiable DEM gradient disclaimer.
- [x] Implemented `scripts/data_pipeline/process_terrain_slope.py` offline planetary terrain pipeline with Horn's 8-neighbor finite differences, Lambertian hillshade ($315^\circ$ azimuth, $45^\circ$ altitude), and synthetic crater generator with 20 passing unit tests in `scripts/data_pipeline/test_terrain_slope.py`.
- [x] Registered official terrain layers (`mars-mcolordem-shaded-relief`, `mars-mola-elevation-tint`, `mars-regional-slope`) in `src/services/data/datasetRegistry.ts`.
- [x] Implemented `src/services/data/terrainElevationService.ts` spot elevation sampling service with complete USGS 30-quadrangle division locator (MC-01 through MC-30), calibrated landmark elevation model, Amazonian/Hesperian/Noachian epoch estimator, and in-memory query caching.
- [x] Implemented `src/components/hud/TerrainLegendPanel.tsx` collapsible HUD legend panel with hypsometric colormap ($-8,200\text{ m} \to +21,229\text{ m}$), regional slope scale, and chronostratigraphy badges; integrated toggle button in `TopCommandBar.tsx`.
- [x] Implemented `src/components/hud/TerrainInspectorCard.tsx` floating contextual inspection card displaying coordinates, signed elevation in meters, quadrangle name/code, regional slope category with mandatory disclaimer, and scientific classification tag (**DERIVED**).
- [x] Integrated surface click inspection and live pointer elevation into both `MarsGlobeView.tsx` (3D SceneView) and `MarsMapView.tsx` (2D MapView), mounted floating HUD panels inside `ViewportCoordinator.tsx`.
- [x] Automated test suite: 25 Vitest files (176 unit tests) + Python unittest suite (20 tests) = 196 tests passing with 100% green status.
- [x] Production build: Clean Vite compilation with zero TypeScript or bundling errors.

---

## Phase 05 Checklist
- [x] Implemented `src/services/data/layerResolutionService.ts` pure scale and extent evaluator distinguishing `ACTIVE`, `SCALE_INACTIVE`, `OUT_OF_EXTENT`, and `OFFLINE` with circular Martian longitude arithmetic.
- [x] Upgraded `src/services/data/datasetRegistry.ts` with explicit `minScale`, `maxScale`, and localized extents for CTX Mosaic, HiRISE Targeted Jezero DTM, Geologic Quads, and IAU nomenclature.
- [x] Upgraded `src/services/data/layerService.ts` to support NASA Trek WMTS (`WebTileLayer`/`TileLayer`) and forward scale constraints to ArcGIS layers.
- [x] Implemented `src/hooks/useMarsLayerSync.ts` dual-viewport reactive coordinator hook, dynamically applying atomic visibility and opacity mutations without WebGL context recreation.
- [x] Integrated `useMarsLayerSync` into both `src/components/map/MarsGlobeView.tsx` (3D SceneView) and `src/components/map/MarsMapView.tsx` (2D MapView) with reactive telemetry scale tracking.
- [x] Upgraded `src/components/hud/LayersDrawer.tsx` with real-time status pills (🟢 Active, 🟡 Scale Inactive, ⚪ Out of Extent), formatted scale range chips, live numeric opacity percentages, and one-click "Solo Layer" isolation.
- [x] Implemented floating viewport HUD components: `src/components/hud/MapAttributionOverlay.tsx` (active layer attribution + provenance shortcut) and `src/components/hud/ExtentCoverageBanner.tsx` (honest coverage/scale bounds guidance).
- [x] Automated test suite: 21 test files, 114 unit/integration tests passing with 100% green status.
- [x] Production build: Clean compilation in 26.06s with zero TypeScript or bundling errors.

---

## Phase 04 Checklist
- [x] Defined verified Martian scientific exploration bookmarks in `src/config/marsRegions.ts` (Jezero Crater Delta, Gale Crater & Mount Sharp, Olympus Mons Caldera, Valles Marineris Candor Chasma, Elysium Planitia) with bounding extents and target scales.
- [x] Enhanced `useAppStore.ts` with `regionalCenter` coordinates, `selectedRegionId`, and state setters ensuring coordinate persistence across modes.
- [x] Implemented `src/components/map/MarsMapView.tsx` powered by `@arcgis/core/views/MapView` on `GCS_Mars_2000` (`WKID 104971`), featuring Viking MDIM 2.1 color basemap, regional center markers, landing site graphics, and live pointer telemetry tracking.
- [x] Implemented `src/components/map/MapControls.tsx` for 2D cartographic operations (Zoom in/out, North 0° orientation, Extent reset, and prominent "Return to 3D Globe" action).
- [x] Implemented `src/components/map/ViewportCoordinator.tsx` with smooth CSS crossfade between 3D `SceneView` and 2D `MapView` containers, preserving planetary coordinates without jarring page reloads.
- [x] Integrated "Regions" exploration tab in `src/components/hud/ToolsDrawer.tsx`, displaying quadrangle, geological features, elevation, and 1-click regional diving.
- [x] Added "Explore in 2D Map" quick-dive action buttons on selected landing site cards and floating 3D globe callouts.
- [x] Automated test suite: 18 test files, 62 unit tests passing with 100% green status.
- [x] Production build: Clean compilation in 34.5s with zero TypeScript or bundling errors.
