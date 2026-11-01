# Phase 03: Mars Data Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the scalable data infrastructure, Python ETL pipelines, type-safe dataset registry, dynamic ArcGIS layer factory, and health checking mechanism for ARES.

**Architecture:** Hybrid streaming and local vector caching. Large global rasters (Viking MDIM, HRSC-MOLA, THEMIS, CTX, USGS Geologic units) stream on-demand from verified endpoints. Regional vector assets (HiRISE DTM footprint index polygons, IAU crater and mountain nomenclature) are compiled via Python scripts into optimized GeoJSON in `public/data/`. A centralized `datasetRegistry` provides full metadata and source traceability matching `DATA_CATALOG.md`.

**Tech Stack:** Python 3, React 19, TypeScript, `@arcgis/core`, Vitest, Zustand.

**Spec:** [`PROMPTS.MD` (Phase 03)](file:///home/laksh/Hackathons/Space-App/PROMPTS.MD#L112-L150), [`DATA_CATALOG.md`](file:///home/laksh/Hackathons/Space-App/DATA_CATALOG.md)

## Global Constraints
- Spatial Reference: strictly `GCS_Mars_2000` (WKID `104971` / `104905`), Mars radius $a = 3,396,190\text{ m}$.
- All scientific data must be classified as `OBSERVED`, `DERIVED`, `MODELED`, or `SIMULATED`.
- No massive multi-gigabyte global downloads. Use streaming endpoints and regional GeoJSON subsets.
- All code and pipelines must be covered by automated test assertions.

---

### Task 1: Type-Safe Scientific Dataset Registry

**Files:**
- Create: `src/services/data/datasetRegistry.ts`
- Test: `src/services/data/datasetRegistry.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `DATASET_REGISTRY`, `getDatasetById()`, `getDatasetsByCategory()`, and dataset schema validators.

- [ ] **Step 1: Write failing test in src/services/data/datasetRegistry.test.ts**
  Verify presence of the 5 core datasets (Viking, MOLA/HRSC DEM, CTX, USGS Geologic, HiRISE footprints) and valid classification/metadata attributes.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/services/data/datasetRegistry.test.ts`.
- [ ] **Step 3: Implement src/services/data/datasetRegistry.ts**
  Define `DatasetEntry` interface, export `DATASET_REGISTRY` with complete metadata from `DATA_CATALOG.md`, and helper lookup functions.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/services/data/datasetRegistry.test.ts`.
- [ ] **Step 5: Commit Task 1**
  Commit dataset registry.

---

### Task 2: Python Data Pipeline Scripts & GeoJSON Generation

**Files:**
- Create: `scripts/data_pipeline/fetch_hirise_footprints.py`
- Create: `scripts/data_pipeline/generate_nomenclature.py`
- Create: `scripts/data_pipeline/validate_catalog.py`
- Output: `public/data/hirise_footprints.geojson`
- Output: `public/data/mars_nomenclature.geojson`
- Test: `tests/data_pipeline_test.py`

**Interfaces:**
- Consumes: IAU 2000 Martian coordinates, USGS Astrogeology gazetteer, NASA PDS HiRISE index
- Produces: High-performance GeoJSON assets for frontend rendering.

- [ ] **Step 1: Write Python ETL scripts**
  Implement `fetch_hirise_footprints.py` (generating real HiRISE DTM polygons for Jezero Crater delta and Gale Crater Mount Sharp), `generate_nomenclature.py` (generating major Mars features: Olympus Mons, Valles Marineris, Jezero, Gale, etc.), and `validate_catalog.py`.
- [ ] **Step 2: Run Python pipeline and verify GeoJSON outputs**
  Execute scripts and test GeoJSON file integrity with python `json.load()` and schema checks.
- [ ] **Step 3: Commit Task 2**
  Commit pipeline scripts and generated GeoJSON data files.

---

### Task 3: Dynamic ArcGIS Layer Factory Service

**Files:**
- Create: `src/services/data/layerService.ts`
- Test: `src/services/data/layerService.test.ts`

**Interfaces:**
- Consumes: `datasetRegistry.ts`, `@arcgis/core`
- Produces: `createArcGISLayer(dataset: DatasetEntry)` returning configured `TileLayer`, `ElevationLayer`, `GeoJSONLayer`, or `WMSLayer`.

- [ ] **Step 1: Write failing test in src/services/data/layerService.test.ts**
  Verify factory resolves tile layers, elevation layers, and GeoJSON layers with correct URLs and WKID 104971 spatial reference.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/services/data/layerService.test.ts`.
- [ ] **Step 3: Implement src/services/data/layerService.ts**
  Build modular factory functions for all dataset types with error callbacks and popup templates.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/services/data/layerService.test.ts`.
- [ ] **Step 5: Commit Task 3**
  Commit layer factory.

---

### Task 4: Data Health & Endpoint Probe Service

**Files:**
- Create: `src/services/data/healthService.ts`
- Test: `src/services/data/healthService.test.ts`

**Interfaces:**
- Consumes: `datasetRegistry.ts`, `fetch` API
- Produces: `checkDatasetHealth(datasetId: string)` returning `ONLINE`, `DEGRADED`, or `OFFLINE` status.

- [ ] **Step 1: Write failing test in src/services/data/healthService.test.ts**
  Test online resolution and timeout/failure handling for remote endpoints.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/services/data/healthService.test.ts`.
- [ ] **Step 3: Implement src/services/data/healthService.ts**
  Implement lightweight `HEAD`/`GET` probe with timeout and in-memory status cache.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/services/data/healthService.test.ts`.
- [ ] **Step 5: Commit Task 4**
  Commit health service.

---

### Task 5: Integration with HUD Layer Manager & 3D Globe

**Files:**
- Modify: `src/store/useAppStore.ts`
- Modify: `src/components/hud/LayersDrawer.tsx`
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/hud/LayersAndProvenance.test.tsx`

- [ ] **Step 1: Connect useAppStore to datasetRegistry**
  Populate initial layer items from `datasetRegistry.ts`.
- [ ] **Step 2: Update LayersDrawer to show dataset health indicator**
  Display online indicator and quick catalog inspection.
- [ ] **Step 3: Add GeoJSON overlay layers to MarsGlobeView**
  Optionally mount `mars_nomenclature.geojson` and `hirise_footprints.geojson` when enabled.
- [ ] **Step 4: Run full test suite and verify**
  Run `npm test` and `npm run build`.
- [ ] **Step 5: Commit Task 5**
  Commit integration changes.

---

### Task 6: Phase 03 Verification, Documentation & Completion Report

**Files:**
- Modify: `DATA_CATALOG.md`
- Modify: `PROGRESS.md`
- Modify: `ARCHITECTURE.md`

- [ ] **Step 1: Update documentation files**
  Document the newly integrated datasets, GeoJSON assets, and layer pipeline.
- [ ] **Step 2: Present Phase 03 Completion Report**
  Deliver formal report for user sign-off.
