# Phase 08.5: Mars Planetary Data Acquisition, Sorting & Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish ARES as the definitive "Google Earth & Google Maps for Martian Inhabitants" by ingesting, processing, and integrating comprehensive planetary datasets: the complete Mars rover fleet (Opportunity, Spirit, Zhurong in addition to Perseverance and Curiosity), the InSight Marsquake Seismic Catalog, CRISM hydrated mineralogy, SWIM subsurface water ice reserves, and future human settlement zones.

**Architecture:** 
1. **Python ETL Pipelines** (`scripts/data_pipeline/`): Fetch, structure, validate, and compile authoritative datasets into Mars 2000 (`WKID 104971`) GeoJSON feature collections.
2. **Scientific Services & Registries** (`src/services/data/`, `src/config/`): Govern typed domain models for rovers, marsquakes, ISRU resources, and settlement sites with full provenance citations.
3. **Interactive Viewport HUD & Styling** (`src/components/map/`, `src/components/hud/`): Dynamic ArcGIS GraphicsLayers and FeatureLayers with aerospace black-glass styling, Sol scrubber navigation, and 1-click ground POV at historical landing sites and rover locations.

**Tech Stack:** React 19, TypeScript, `@arcgis/core`, Zustand, Tailwind CSS, Python 3 (GeoJSON / Shapely / Urllib), Vitest, React Testing Library.

**Spec / Master Context:**
- Mars Reference Ellipsoid: $a = 3,396,190\text{ m}$ (D_Mars_2000, WKID 104905 / 104971).
- Non-negotiable: Earth projections (WGS84 / Web Mercator) are strictly prohibited.
- All datasets must declare scientific classification: `OBSERVED`, `DERIVED`, or `MODELED`.

---

## The Strategic Roadmap: "Google Earth & Google Maps for Mars"

- **Phase 08.5 (Current)**: **Comprehensive Planetary Data Foundation**
  - Complete Rover Fleet (Perseverance, Curiosity, Opportunity, Spirit, Zhurong).
  - InSight Marsquake Seismic Catalog (1,300+ events, epicenters, magnitudes).
  - CRISM Hydrated Clays & Alteration Minerals (Mawrth, Nili Fossae, Oxia Planum).
  - SWIM Subsurface Water Ice Sheets for In-Situ Resource Utilization (ISRU).
  - Future Human Settlement Candidate Zones (Arcadia Planitia, Deuteronilus Mensae, etc.).
- **Phase 09**: **Terrain-Aware Route Planning ("Google Maps Navigation for Mars")**
  - Point A $\to$ Point B navigation across Martian terrain.
  - Slope-aware cost surface (Horn gradient penalty avoiding $>15^\circ$ steep slopes and canyon scarps).
  - Energy & wheel-slip routing (solar vs. nuclear power constraints, night staypoints).
  - Turn-by-turn waypoint navigation with elevation cross-section profiles.
- **Phase 10**: **Settlement & Scientific Intelligence Interface ("Google Earth for Mars")**
  - Habitat & Base Suitability Scorer (combining ice proximity, flat slope $<3^\circ$, radiation shielding, and seismic safety).
  - Global Search & Places on Mars (POI index for craters, landmarks, bases, and landing sites).
  - 3D Virtual Ground Tours / Photospheres (projecting rover Mastcam panoramas into 3D ground POV).
- **Phase 11**: **Integration, Offline Optimization & Release**
  - Offline ServiceWorker caching for interplanetary communications latency / blackout survival.
  - Performance profiling, multi-LOD tile optimizations, and release packaging.

---

## Detailed Task Breakdown for Phase 08.5

### Task 1: Complete Mars Rover Fleet ETL Pipeline (Opportunity, Spirit, Zhurong)

**Files:**
- Modify: `scripts/data_pipeline/generate_rover_traverses.py`
- Modify: `scripts/data_pipeline/test_rover_traverses.py`
- Create: `public/data/opportunity_traverse.geojson`
- Create: `public/data/spirit_traverse.geojson`
- Create: `public/data/zhurong_traverse.geojson`

**Interfaces:**
- Produces: GeoJSON FeatureCollections conforming to `urn:ogc:def:crs:EPSG::104971` with Point milestones and LineString traverse paths.
- Properties: `sol`, `earthDate`, `lon`, `lat`, `elevationMeters`, `distanceKm`, `siteName`, `formation`, `instrumentTargets`, `discoverySummary`, `pdsCitation`.

- [ ] **Step 1: Write the failing test for Opportunity, Spirit, and Zhurong traverses**
  - In `scripts/data_pipeline/test_rover_traverses.py`, add test cases for Opportunity (45.16 km, Sol 0–5111, Meridiani Planum), Spirit (7.73 km, Sol 0–1892, Gusev Crater), and Zhurong (1.92 km, Sol 0–347, Utopia Planitia).
  - Verify coordinate bounds (lon: -180 to 180, lat: -90 to 90), monotonic Sol progression, and increasing cumulative distance.
- [ ] **Step 2: Run test to confirm it fails**
  - Run `python3 scripts/data_pipeline/test_rover_traverses.py` and verify missing datasets fail.
- [ ] **Step 3: Implement Opportunity, Spirit, and Zhurong traverse generation**
  - In `scripts/data_pipeline/generate_rover_traverses.py`, add verified PDS waypoints:
    - **Opportunity**: 22 milestones from Eagle Crater touchdown (Sol 0) through Fram, Endurance, Victoria Crater, Santa Maria, Cape York, Marathon Valley, and Perseverance Valley (Sol 5111).
    - **Spirit**: 16 milestones from Columbia Memorial Station (Sol 0) through Bonneville Crater, Husband Hill summit, Home Plate hydrothermal beds, and "Troy" (Sol 1892).
    - **Zhurong**: 12 milestones from Utopia Planitia touchdown ($25.066^\circ\text{N}, 109.925^\circ\text{E}$) across Transverse Aeolian Ridges, RoPeR radar soundings, and polygonal terrain.
  - Compile output to `public/data/opportunity_traverse.geojson`, `public/data/spirit_traverse.geojson`, and `public/data/zhurong_traverse.geojson`.
- [ ] **Step 4: Run tests and ensure all rover tests pass**
  - Run `python3 scripts/data_pipeline/test_rover_traverses.py` and verify 100% pass rate.

---

### Task 2: InSight Marsquake Seismic Catalog ETL Pipeline

**Files:**
- Create: `scripts/data_pipeline/generate_marsquakes.py`
- Create: `scripts/data_pipeline/test_marsquakes.py`
- Create: `public/data/mars_seismic_events.geojson`

**Interfaces:**
- Produces: `public/data/mars_seismic_events.geojson` conforming to `WKID 104971`.
- Properties: `eventId` (e.g. `S0173a`, `S1222a`), `sol`, `earthDate`, `magnitude`, `eventType` (`LF`, `BB`, `HF`, `IMPACT`), `quality` (`A`, `B`, `C`), `distanceDeg`, `backAzimuthDeg`, `epicenterRegion` (e.g. `Cerberus Fossae`, `Elysium Planitia`), `pdsCitation`.

- [ ] **Step 1: Write the failing test for the Marsquake Catalog**
  - Create `scripts/data_pipeline/test_marsquakes.py` asserting catalog has at least 30 verified events, valid Mars 2000 coordinates, magnitudes between $1.0$ and $5.0$, and valid event classifications.
- [ ] **Step 2: Run test to confirm failure**
  - Run `python3 scripts/data_pipeline/test_marsquakes.py`.
- [ ] **Step 3: Implement `generate_marsquakes.py`**
  - Curate prominent InSight SEIS Data Release 14 events with verified epicenters (projected from InSight landing coordinates $4.5023^\circ\text{N}, 135.6234^\circ\text{E}$ using back-azimuth and epicentral distance).
  - Include Cerberus Fossae active tectonic rifts, large meteoroid impact events (Amazonis Planitia impact cratering), and deep mantle low-frequency quakes.
  - Output to `public/data/mars_seismic_events.geojson`.
- [ ] **Step 4: Verify test suite passes**
  - Run `python3 scripts/data_pipeline/test_marsquakes.py`.

---

### Task 3: Planetary Resources (CRISM Clays & SWIM Subsurface Ice) ETL Pipeline

**Files:**
- Create: `scripts/data_pipeline/generate_planetary_resources.py`
- Create: `scripts/data_pipeline/test_planetary_resources.py`
- Create: `public/data/mars_hydrated_minerals.geojson`
- Create: `public/data/mars_subsurface_ice.geojson`

**Interfaces:**
- Produces:
  - `mars_hydrated_minerals.geojson`: Polygons of high-confidence aqueous mineral deposits (Smectite clays, Fe/Mg phyllosilicates, hydrated sulfates, carbonates) at Mawrth Vallis, Nili Fossae, Oxia Planum, Jezero, and Valles Marineris.
  - `mars_subsurface_ice.geojson`: Polygons of high-consistency glacial ice sheets in Arcadia Planitia, Deuteronilus Mensae, and Utopia Planitia from the NASA/PSI SWIM project.

- [ ] **Step 1: Write failing tests for mineralogy and subsurface water ice**
  - Create `scripts/data_pipeline/test_planetary_resources.py` testing polygon closure, valid coordinates, mineral class categorizations, and ice depth indicators.
- [ ] **Step 2: Run test to confirm failure**
  - Run `python3 scripts/data_pipeline/test_planetary_resources.py`.
- [ ] **Step 3: Implement `generate_planetary_resources.py`**
  - Synthesize published CRISM / OMEGA mineral distribution footprints and SWIM ice consistency zones into standardized GeoJSON polygons.
- [ ] **Step 4: Run test and ensure 100% pass rate**
  - Run `python3 scripts/data_pipeline/test_planetary_resources.py`.

---

### Task 4: Candidate Human Settlement & Base Sites Catalog

**Files:**
- Create: `src/config/marsSettlementSites.ts`
- Create: `src/config/marsSettlementSites.test.ts`
- Create: `public/data/mars_settlement_sites.geojson`

**Interfaces:**
- Model: `MarsSettlementCandidate` with `id`, `name`, `targetRegion`, `latitude`, `longitude`, `elevationMeters`, `waterIceProximityKm`, `slopeSafetyRating`, `primarySuitabilityFactor`, `missionArchitecture`.

- [ ] **Step 1: Write the failing test for settlement candidate sites**
  - Create `src/config/marsSettlementSites.test.ts` validating candidate attributes, coordinates within Mars 2000, and non-negative ice distances.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/config/marsSettlementSites.test.ts`.
- [ ] **Step 3: Implement `marsSettlementSites.ts` and GeoJSON exporter**
  - Define 8 prime candidates:
    1. **Arcadia Planitia Base Alpha** (Abundant near-surface sheet ice $<1\text{ m}$ depth, low elevation $-3,800\text{ m}$ for atmospheric braking).
    2. **Deuteronilus Mensae Glacial Outpost** (Debris-covered glaciers, lobate debris aprons).
    3. **Mawrth Vallis Science Settlement** (Thick layered clay deposits for planetary biology and construction materials).
    4. **Erebus Montes Shielded Habitat** (Lava tube and cliff sheltered terrain).
    5. **Melas Chasma Atmospheric Station** (Deepest canyon floor, maximum atmospheric pressure $\sim 950\text{ Pa}$).
    6. **Utopia Planitia Subsurface Vault** (Vast underground ice reservoir).
    7. **Jezero Delta Field Station** (Astrobiology sample depot).
    8. **Gale Oasis Base** (Mount Sharp stratigraphic access).
- [ ] **Step 4: Run test and verify pass**
  - Run `npx vitest run src/config/marsSettlementSites.test.ts`.

---

### Task 5: Rover Mission Service & Mission Control Drawer Upgrade

**Files:**
- Modify: `src/services/data/roverMissionService.ts`
- Modify: `src/services/data/roverMissionService.test.ts`
- Modify: `src/components/hud/MissionControlDrawer.tsx`
- Modify: `src/components/hud/MissionControlDrawer.test.tsx`

**Interfaces:**
- Support missions: `perseverance`, `curiosity`, `opportunity`, `spirit`, `zhurong`, `insight`.
- Add complete instrument payloads for MER (Pancam, Mini-TES, APXS, Mössbauer, RAT), Zhurong (NaTeCam, MSCam, RoPeR, MarSCoDe), and InSight (SEIS, HP3, APSS).

- [ ] **Step 1: Write failing tests in `roverMissionService.test.ts`**
  - Assert dossiers, milestones, and instruments exist for Opportunity, Spirit, Zhurong, and InSight.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/services/data/roverMissionService.test.ts`.
- [ ] **Step 3: Implement expanded missions in `roverMissionService.ts`**
  - Add full mission dossiers, instruments, and milestone sequences for Opportunity, Spirit, Zhurong, and InSight.
- [ ] **Step 4: Update `MissionControlDrawer.tsx`**
  - Add tab triggers and status badges for all 6 missions.
  - Connect "Track Rover on Mars" to load the corresponding traverse and center view.
- [ ] **Step 5: Run tests and verify 100% pass**
  - Run `npx vitest run src/services/data/roverMissionService.test.ts src/components/hud/MissionControlDrawer.test.tsx`.

---

### Task 6: Scientific Layer Registry (`datasetRegistry.ts`) & ArcGIS Renderers

**Files:**
- Modify: `src/services/data/datasetRegistry.ts`
- Modify: `src/services/data/layerService.ts`
- Modify: `src/services/data/layerService.test.ts`
- Modify: `src/store/useAppStore.ts`

**Interfaces:**
- Register 4 new active scientific layers:
  1. `mars-seismic-catalog`: GeoJSON points with orange/red magnitude-proportional circles and Marsquake popups.
  2. `mars-crism-minerals`: GeoJSON polygons with emerald/violet translucent fills highlighting clay and sulfate deposits.
  3. `mars-swim-subsurface-ice`: GeoJSON polygons with cyan ice-depth hatch fills.
  4. `mars-settlement-sites`: GeoJSON points with gold tactical hexagonal markers.

- [ ] **Step 1: Write failing test in `layerService.test.ts`**
  - Test resolution and renderer creation for `mars-seismic-catalog`, `mars-crism-minerals`, `mars-swim-subsurface-ice`, and `mars-settlement-sites`.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/services/data/layerService.test.ts`.
- [ ] **Step 3: Update `datasetRegistry.ts` and `layerService.ts`**
  - Add dataset entries with classifications, plain-English "what it is" and "how it looks" guides, and styling renderers.
- [ ] **Step 4: Update `useAppStore.ts`**
  - Ensure new layers are mapped into `INITIAL_LAYERS` with appropriate defaults.
- [ ] **Step 5: Run tests and verify pass**
  - Run `npx vitest run src/services/data/layerService.test.ts src/services/data/datasetRegistry.test.ts`.

---

### Task 7: 3D Globe & 2D Map Multi-Rover Traverse & Reticle Synchronization

**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Modify: `src/components/map/MarsGlobeView.test.tsx`
- Modify: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Dynamically fetch and display the active rover's traverse GeoJSON based on `selectedRoverId`:
  - `perseverance` $\to$ `/data/perseverance_traverse.geojson` (Orange)
  - `curiosity` $\to$ `/data/curiosity_traverse.geojson` (Cyan)
  - `opportunity` $\to$ `/data/opportunity_traverse.geojson` (Emerald)
  - `spirit` $\to$ `/data/spirit_traverse.geojson` (Amber)
  - `zhurong` $\to$ `/data/zhurong_traverse.geojson` (Rose)
- Enable 1-click Ground POV transition at any Sol milestone.

- [ ] **Step 1: Write failing tests in `MarsGlobeView.test.tsx` and `MarsMapView.test.tsx`**
  - Verify switching `selectedRoverId` updates the traverse GraphicsLayer features and colors.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/components/map/MarsGlobeView.test.tsx src/components/map/MarsMapView.test.tsx`.
- [ ] **Step 3: Implement dynamic traverse loading in `MarsGlobeView.tsx` and `MarsMapView.tsx`**
  - Support color-coded trajectories and milestones for all 5 rovers with interactive hit-test click handlers.
- [ ] **Step 4: Run tests and verify 100% pass**
  - Run `npx vitest run src/components/map/MarsGlobeView.test.tsx src/components/map/MarsMapView.test.tsx`.

---

### Task 8: Full Verification Gate & Documentation

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: Run complete Python data pipeline test suite**
  - `python3 -m unittest discover -s scripts/data_pipeline`
- [ ] **Step 2: Run complete Vitest test suite**
  - `npm test -- --run`
- [ ] **Step 3: Run production build check**
  - `npm run build`
- [ ] **Step 4: Update `PROGRESS.md`**
  - Log Phase 08.5 completion, passing test counts, and transition to Phase 09 readiness.
