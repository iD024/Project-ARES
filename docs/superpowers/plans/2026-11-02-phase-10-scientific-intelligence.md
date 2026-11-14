# Phase 10 — Scientific Intelligence Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, accessible Scientific Intelligence Interface for ARES that provides plain-English, source-backed explanations of active map layers, terrain physics, geological chronostratigraphic units, and route optimization criteria, featuring an aerospace black-glass HUD drawer (`ScientificIntelDrawer.tsx`) and seamless in-situ contextual deep-links from terrain spot interrogations, route planner candidates, and layer catalogs.

**Architecture:** A deterministic scientific domain service (`scientificIntelligenceService.ts`) synthesizes sensor operating principles, PDS citations, USGS 30-quadrangle chronostratigraphy, MOLA/HRSC altimetry physics, and A* route cost mathematics for all 14 registered planetary datasets. The global Zustand store (`useAppStore.ts`) manages active tab states and deep-link focus targets (`'layers' | 'geology' | 'terrain' | 'routes'`). High-contrast HUD components (`ScientificIntelDrawer.tsx`, `TopCommandBar.tsx`) and contextual deep-links (`TerrainInspectorCard.tsx`, `RoutePlannerDrawer.tsx`, `LayersDrawer.tsx`) provide instant, 1-click educational and scientific transparency while strictly preserving the map-first viewport.

**Tech Stack:** TypeScript, React 19, Zustand, Tailwind CSS, Lucide React, Vitest, React Testing Library.

**Spec:** [`docs/superpowers/specs/2026-11-02-phase-10-scientific-intelligence-design.md`](file:///home/laksh/Hackathons/Space-App/docs/superpowers/specs/2026-11-02-phase-10-scientific-intelligence-design.md)

## Global Constraints
- Strictly Mars 2000 geodetic datum (`D_Mars_2000`, `WKID 104971`, $R = 3,396,190\text{ m}$).
- No fabricated scientific measurements, coordinates, elevations, or historical dates.
- Explicit classification of all datasets: `OBSERVED`, `DERIVED`, `MODELED`, or `SIMULATED`.
- Mandatory regional DEM disclaimer: *"Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles."*
- Aerospace black-glass HUD styling (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
- Map-first viewport: Intel Drawer must be floating, collapsible, and non-intrusive.

---

## File Structure & Responsibilities

| File | Purpose |
|---|---|
| `src/services/data/scientificIntelligenceService.ts` | Central scientific domain engine: dataset dossiers (all 14 datasets), sensor physics, chronostratigraphy (Noachian, Hesperian, Amazonian), quadrangle lookup, slope/DEM physics, and A* route cost explanation. |
| `src/services/data/scientificIntelligenceService.test.ts` | Comprehensive unit tests for scientific dossiers, sensor specifications, geological periods, terrain slope classification explanations, and route cost mathematics. |
| `src/types/hud.ts` | Extend `DrawerId` with `'intel'`, define `ScientificIntelTab`, `DatasetScientificDossier`, `GeologicalEpochDossier`, `TerrainPhysicsDossier`, and `RouteTraversalScienceDossier`. |
| `src/store/useAppStore.ts` | Add state slices: `activeIntelTab`, `intelFocusedDatasetId`, `intelFocusedGeologyPeriod`, `intelFocusedQuadCode`, and atomic actions: `setActiveIntelTab`, `openIntelForDataset`, `openIntelForGeology`, `openIntelForRouteEvaluation`. |
| `src/store/useAppStore.test.ts` | Unit tests verifying scientific intelligence store transitions and deep-link actions. |
| `src/components/hud/ScientificIntelDrawer.tsx` | Aerospace black-glass drawer featuring search filtering and 4 tabs: Layers & Provenance, Geological Stratigraphy, Terrain Physics & DEM, Route Traversal Science. |
| `src/components/hud/ScientificIntelDrawer.test.tsx` | Unit tests for drawer rendering, tab navigation, search filtering, citation copying, and deep-link focus states. |
| `src/components/hud/TopCommandBar.tsx` | Add `[Intel]` trigger button with violet `Atom` icon and keyboard shortcut / accessibility attributes. |
| `src/components/hud/TerrainInspectorCard.tsx` | Add `[Scientific Dossier]` action button deep-linking into `ScientificIntelDrawer` with the active quadrangle and epoch. |
| `src/components/hud/RoutePlannerDrawer.tsx` | Add `[Scientific Evaluation]` / `[Why this route?]` action button deep-linking into `ScientificIntelDrawer` route traversal tab. |
| `src/components/hud/LayersDrawer.tsx` | Add `[Info]` action button on layer cards opening the layer provenance tab. |
| `src/App.tsx` | Mount `ScientificIntelDrawer.tsx` inside the HUD drawer stack. |
| `PROGRESS.md` & `ROADMAP.md` | Verification log and roadmap updates for Phase 10 completion. |

---

## Tasks

### Task 1: Scientific Intelligence Core Domain Engine (`scientificIntelligenceService.ts`)

**Files:**
- Create: `src/services/data/scientificIntelligenceService.ts`
- Test: `src/services/data/scientificIntelligenceService.test.ts`

**Interfaces:**
- Consumes:
  - `DATASET_REGISTRY` from `./datasetRegistry.ts`
  - `classifyRegionalSlope` from `./marsGeodesyService.ts`
  - `DataClassification` from `../../types/hud.ts`
- Produces:
  - `DatasetScientificDossier`: `{ id, name, mission, sensor, wavelength, physicalPrinciple, classification, resolution, coverage, citation, pdsUrl, caveats }`
  - `GeologicalEpochDossier`: `{ epoch, ageRange, color, description, dominantProcesses, keyMinerals, representativeRegions }`
  - `TerrainPhysicsDossier`: `{ sensorType, horizontalResolution, verticalPrecision, slopeModel, slopeCategories, roverMobilityLimits, disclaimer }`
  - `RouteTraversalScienceDossier`: `{ costFormulaLatex, parameters, vehicleProfiles, comparisonRationale }`
  - Helper functions:
    - `getAllDatasetDossiers(): DatasetScientificDossier[]`
    - `getDatasetDossierById(id: string): DatasetScientificDossier | undefined`
    - `getGeologicalEpochDossier(epoch: string): GeologicalEpochDossier | undefined`
    - `getAllGeologicalEpochs(): GeologicalEpochDossier[]`
    - `getTerrainPhysicsDossier(): TerrainPhysicsDossier`
    - `getRouteTraversalScienceDossier(): RouteTraversalScienceDossier`
    - `explainRegionalSlope(degrees: number): { category: string; description: string; engineeringRisk: string }`

- [ ] **Step 1: Write failing unit tests in `src/services/data/scientificIntelligenceService.test.ts`**
  - Test that all 14 datasets in `DATASET_REGISTRY` have a matching `DatasetScientificDossier` with valid sensor, classification, and citation.
  - Test that `getGeologicalEpochDossier` returns valid dossiers for 'Noachian', 'Hesperian', and 'Amazonian'.
  - Test that `getTerrainPhysicsDossier` returns correct sensor types (MOLA 1064nm, HRSC stereo) and includes the mandatory 200m DEM disclaimer.
  - Test that `getRouteTraversalScienceDossier` contains the A* cost formula, vehicle constraints, and candidate comparison rationales.
  - Test that `explainRegionalSlope` accurately categorizes slopes ($1.8^\circ \to$ Gentle, $12^\circ \to$ Moderate, $22^\circ \to$ Steep, $32^\circ \to$ Precipitous) with vehicle mobility guidance.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/services/data/scientificIntelligenceService.test.ts` (should fail: module not found).
- [ ] **Step 3: Implement `src/services/data/scientificIntelligenceService.ts`**
  - Implement full dataset dossier registry with accurate scientific telemetry for all 14 datasets.
  - Implement chronostratigraphy data structures and helper lookups.
  - Implement terrain physics and slope explainer with non-negotiable engineering invariants.
  - Implement route traversal math formulation.
- [ ] **Step 4: Run test to confirm passing**
  - Run `npx vitest run src/services/data/scientificIntelligenceService.test.ts` (all tests pass).
- [ ] **Step 5: Commit changes**
  - `git add src/services/data/scientificIntelligenceService* && git commit -m "feat(science): implement scientificIntelligenceService core engine with tests"`

---

### Task 2: State Slices & Types Integration (`hud.ts` & `useAppStore.ts`)

**Files:**
- Modify: `src/types/hud.ts`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/store/useAppStore.test.ts`

**Interfaces:**
- Consumes:
  - `ScientificIntelTab`
- Produces:
  - `useAppStore` selectors and actions:
    - `activeIntelTab: ScientificIntelTab`
    - `intelFocusedDatasetId: string | null`
    - `intelFocusedGeologyPeriod: string | null`
    - `intelFocusedQuadCode: string | null`
    - `setActiveIntelTab(tab: ScientificIntelTab): void`
    - `openIntelForDataset(datasetId: string): void`
    - `openIntelForGeology(period: string, quadCode?: string): void`
    - `openIntelForRouteEvaluation(): void`

- [ ] **Step 1: Write failing test in `src/store/useAppStore.test.ts`**
  - Test initial state for `activeIntelTab` (defaults to `'layers'`).
  - Test `setActiveIntelTab('geology')`.
  - Test `openIntelForDataset('mars-mcolordem-shaded-relief')`: sets `activeDrawer = 'intel'`, `activeIntelTab = 'layers'`, `intelFocusedDatasetId = 'mars-mcolordem-shaded-relief'`.
  - Test `openIntelForGeology('Noachian', 'MC-11')`: sets `activeDrawer = 'intel'`, `activeIntelTab = 'geology'`, `intelFocusedGeologyPeriod = 'Noachian'`, `intelFocusedQuadCode = 'MC-11'`.
  - Test `openIntelForRouteEvaluation()`: sets `activeDrawer = 'intel'`, `activeIntelTab = 'routes'`.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/store/useAppStore.test.ts` (should fail on undefined actions/properties).
- [ ] **Step 3: Update `src/types/hud.ts` and `src/store/useAppStore.ts`**
  - Add `'intel'` to `DrawerId`.
  - Add `ScientificIntelTab` type: `'layers' | 'geology' | 'terrain' | 'routes'`.
  - Add state slices and atomic actions.
- [ ] **Step 4: Run test to confirm passing**
  - Run `npx vitest run src/store/useAppStore.test.ts` (all pass).
- [ ] **Step 5: Commit changes**
  - `git add src/types/hud.ts src/store/useAppStore* && git commit -m "feat(hud): extend store with scientific intelligence slices and deep-link actions"`

---

### Task 3: Black-Glass Scientific Intelligence Drawer (`ScientificIntelDrawer.tsx`)

**Files:**
- Create: `src/components/hud/ScientificIntelDrawer.tsx`
- Create: `src/components/hud/ScientificIntelDrawer.test.tsx`

**Interfaces:**
- Consumes:
  - `useAppStore` (`activeDrawer`, `setActiveDrawer`, `activeIntelTab`, `setActiveIntelTab`, `intelFocusedDatasetId`, etc.)
  - `scientificIntelligenceService`
  - `Badge` component
- Produces:
  - React HUD component `ScientificIntelDrawer`

- [ ] **Step 1: Write failing test in `src/components/hud/ScientificIntelDrawer.test.tsx`**
  - Test that drawer renders nothing when `activeDrawer !== 'intel'`.
  - Test that drawer renders header with title "SCIENTIFIC INTELLIGENCE" when `activeDrawer === 'intel'`.
  - Test that all 4 tab buttons are rendered and clicking tabs switches content.
  - Test search input filtering dataset cards.
  - Test that clicking "Copy Citation" calls `navigator.clipboard.writeText`.
  - Test that deep-linked dataset ID scrolls into view or is highlighted.
- [ ] **Step 2: Run test to confirm failure**
  - Run `npx vitest run src/components/hud/ScientificIntelDrawer.test.tsx` (fails: module not found).
- [ ] **Step 3: Implement `src/components/hud/ScientificIntelDrawer.tsx`**
  - Aerospace black-glass drawer styling (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
  - Search bar with live keyword filtering across dataset names, missions, sensors, and geology.
  - 4 specialized tab views:
    - **Layers & Provenance**: Cards for all 14 datasets with classification badge (`OBSERVED`, `DERIVED`, `MODELED`), mission sponsor, sensor physics, resolution, coverage, and citation copy button.
    - **Geological Stratigraphy**: Chronological epoch slider/cards (Noachian, Hesperian, Amazonian) with color accents, age ranges, crater densities, mineral associations, and quadrangle locator.
    - **Terrain Physics & DEM Limits**: Altimetry methodology, Horn's slope derivation explanation, slope category reference table, and the mandatory 200m regional DEM disclaimer.
    - **Route Traversal Science**: A* cost equation breakdown ($C = d \cdot [1 + w_{\text{slope}} \cdot (\theta/\theta_{\text{max}})^2]$), vehicle profile comparison matrix (Heavy vs Scout vs Drone), and route candidate rationale.
- [ ] **Step 4: Run test to confirm passing**
  - Run `npx vitest run src/components/hud/ScientificIntelDrawer.test.tsx` (all pass).
- [ ] **Step 5: Commit changes**
  - `git add src/components/hud/ScientificIntelDrawer* && git commit -m "feat(hud): implement ScientificIntelDrawer with 4 tabs and search filtering"`

---

### Task 4: Command Bar & In-Situ Contextual Deep-Links Integration

**Files:**
- Modify: `src/components/hud/TopCommandBar.tsx`
- Modify: `src/components/hud/TopCommandBar.test.tsx`
- Modify: `src/components/hud/TerrainInspectorCard.tsx`
- Modify: `src/components/hud/TerrainInspectorCard.test.tsx`
- Modify: `src/components/hud/RoutePlannerDrawer.tsx`
- Modify: `src/components/hud/RoutePlannerDrawer.test.tsx`
- Modify: `src/components/hud/LayersDrawer.tsx`
- Modify: `src/components/hud/LayersDrawer.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes:
  - `openIntelForDataset`, `openIntelForGeology`, `openIntelForRouteEvaluation` from `useAppStore`
- Produces:
  - 1-click contextual access points across the application

- [ ] **Step 1: Write failing tests for contextual triggers**
  - In `TopCommandBar.test.tsx`: Test that `[Intel]` button is rendered and clicking it toggles `activeDrawer === 'intel'`.
  - In `TerrainInspectorCard.test.tsx`: Test that `[Scientific Dossier]` button calls `openIntelForGeology`.
  - In `RoutePlannerDrawer.test.tsx`: Test that `[Why this route?]` button calls `openIntelForRouteEvaluation`.
  - In `LayersDrawer.test.tsx`: Test that clicking info button on a layer item calls `openIntelForDataset`.
- [ ] **Step 2: Run tests to confirm failures**
  - Run `npx vitest run src/components/hud/` (tests fail on missing buttons/actions).
- [ ] **Step 3: Implement UI updates and mount `ScientificIntelDrawer` in `App.tsx`**
  - In `TopCommandBar.tsx`: Add `[Intel]` button with `Atom` icon and violet styling (`activeDrawer === 'intel'`).
  - In `TerrainInspectorCard.tsx`: Add button `[Scientific Dossier]` with `BookOpen` icon.
  - In `RoutePlannerDrawer.tsx`: Add button `[Why this route?]` with `HelpCircle` icon next to candidate routes.
  - In `LayersDrawer.tsx`: Add `[Info]` button on each layer item.
  - In `App.tsx`: Mount `ScientificIntelDrawer` in drawer stack.
- [ ] **Step 4: Run tests to confirm passing**
  - Run `npx vitest run` across all modified test suites.
- [ ] **Step 5: Commit changes**
  - `git add src/components/hud/ src/App.tsx src/App.test.tsx && git commit -m "feat(hud): integrate Intel button in TopCommandBar and contextual deep-links"`

---

### Task 5: Verification Gate, Documentation & Phase 10 Sign-off

**Files:**
- Modify: `PROGRESS.md`
- Modify: `ROADMAP.md`

- [ ] **Step 1: Run comprehensive Vitest suite**
  - Run `npx vitest run` and confirm 100% green tests (expect >290 tests passing).
- [ ] **Step 2: Run Python data pipeline tests**
  - Run `pytest scripts/data_pipeline/` and confirm 38/38 tests passing.
- [ ] **Step 3: Run production build**
  - Run `npm run build` and verify clean Vite bundle with zero TypeScript compilation errors.
- [ ] **Step 4: Update `PROGRESS.md` & `ROADMAP.md`**
  - Record Phase 10 as completed with detailed deliverables and verification counts.
- [ ] **Step 5: Commit changes and run postflight**
  - `git add PROGRESS.md ROADMAP.md && git commit -m "docs(progress): record Phase 10 Scientific Intelligence completion"`

