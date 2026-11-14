# Phase 10 — Scientific Intelligence Interface Specification

## 1. Problem Statement & Mission Context
ARES (Advanced Reconnaissance and Exploration System) aggregates petabytes of real Mars planetary datasets from NASA, USGS, ESA, and PDS. In prior phases, layers, 3D/2D viewports, measurement tools, rover milestone traverses, and A* route planning were established. However, planetary exploration data is dense and multidimensional; users require clear, source-backed scientific interpretation to understand:
1. What physical properties an active layer measures (e.g. thermal inertia vs laser time-of-flight vs multispectral reflectance).
2. The physical reality of terrain elevation and slope metrics derived from 200m regional DEMs.
3. The chronostratigraphic context of surface features (Noachian, Hesperian, Amazonian epochs and USGS quadrangles).
4. Why route options diverge, how cost formulas evaluate traversability, and what safety margins apply.
5. Absolute dataset provenance, spatial references, resolution boundaries, and scientific citations.

Phase 10 delivers a dedicated **Scientific Intelligence Interface** fulfilling all 10 requirements of Phase 10 in `PROMPTS.MD` without fabricating scientific conclusions or violating map-first HUD discipline.

---

## 2. Core Invariants & Scientific Directives

1. **Map-First Viewport**:
   - The map/globe occupies the primary viewport space at all times.
   - The Scientific Intelligence Interface is rendered as a floating, collapsible aerospace black-glass HUD drawer (`ScientificIntelDrawer.tsx`), preserving the immersive 3D/2D planetary environment.
2. **Scientific Data Integrity**:
   - Zero fabricated measurements, coordinates, or historical dates.
   - Explicit categorization of every data product:
     - **Observed**: Raw or calibrated instrument captures (Viking MDIM, THEMIS IR, HiRISE footprints, InSight MQS, Rover traverses).
     - **Derived**: Synthesized products (MColorDEM, HRSC-MOLA DEM, Horn's slope lattice, USGS geologic quad charts).
     - **Modeled / Simulated**: A* candidate routes, SWIM ice dielectric depth models, crustal thickness models.
   - PDS citations and DOIs for all datasets.
3. **Planetary Geodetic Rules**:
   - Strictly Mars 2000 reference datum (`D_Mars_2000`, `WKID 104971`), mean equatorial radius $a = 3,396,190\text{ m}$.
4. **Honest Limitations & Uncertainty**:
   - Mandatory disclosure: Regional terrain models ($200\text{ m}$ DEM) cannot resolve rover-scale obstacles (boulders $< 1\text{ m}$, sand traps, loose regolith slipfaces).
   - Clear "Data unavailable for this extent" warnings when layers lack high-resolution coverage.

---

## 3. Architecture & Interface Design

### A. Application State Slices (`src/types/hud.ts` & `src/store/useAppStore.ts`)
- Extend `DrawerId` union with `'intel'`:
  ```typescript
  export type DrawerId = 'layers' | 'tools' | 'sites' | 'routes' | 'intel' | null;
  ```
- Define `ScientificIntelTab`:
  ```typescript
  export type ScientificIntelTab = 'layers' | 'geology' | 'terrain' | 'routes';
  ```
- Store slices & actions:
  - `activeIntelTab: ScientificIntelTab` (defaults to `'layers'`)
  - `intelFocusedDatasetId: string | null`
  - `intelFocusedGeologyPeriod: string | null`
  - `intelFocusedQuadCode: string | null`
  - `setActiveIntelTab(tab: ScientificIntelTab): void`
  - `openIntelForDataset(datasetId: string): void`
  - `openIntelForGeology(period: string, quadCode?: string): void`
  - `openIntelForRouteEvaluation(): void`

---

### B. Scientific Intelligence Service (`src/services/data/scientificIntelligenceService.ts`)
A centralized scientific intelligence engine with deterministic, verified domain knowledge:

1. **Dataset Provenance & Sensor Science Engine**:
   - Ingests all 14 datasets from `datasetRegistry.ts`.
   - Returns structured `DatasetScientificDossier`:
     - Instrument & payload details (operating principle, physical wavelength, sensor type).
     - Spatial resolution, coverage extent, and planetary reference datum.
     - Formal scientific classification (`OBSERVED`, `DERIVED`, `MODELED`).
     - Data provenance, sponsoring agencies, and PDS citation.
     - Known limitations & coverage caveats.
2. **Geological Chronostratigraphy & Quadrangle Dossier Engine**:
   - Maps coordinates and USGS quadrangles (`MC-01` to `MC-30`) to verified chronostratigraphic epochs:
     - **Noachian Period (4.1 – 3.7 Ga)**: Heavy bombardment, dense cratering, fluvial valley networks, circum-basin phyllosilicate clay beds (smectite, nontronite).
     - **Hesperian Period (3.7 – 3.0 Ga)**: Intensive flood volcanism, ridged plains, catastrophic outflow floods (Valles Marineris into Chryse), acidic sulfate deposits (gypsum, kieserite).
     - **Amazonian Period (3.0 Ga – Present)**: Cold, hyper-arid desert conditions, thin atmosphere ($< 6\text{ mbar}$), aeolian dune fields, polar ice cap layered deposits, glacial lobate debris aprons (Arcadia, Utopia).
   - Provides plain-English interpretations of geological units and formation history.
3. **Terrain Physics & Altimetry Model Explainer**:
   - Explains the MOLA Nd:YAG laser altimeter ($1064\text{ nm}$) and HRSC stereo photogrammetry blend.
   - Explains Horn's $3 \times 3$ polynomial slope gradient derivation.
   - Explains the physical meaning of Martian slope categories ($0^\circ - 3^\circ$ flat plains, $3^\circ - 8^\circ$ gentle slopes, $8^\circ - 15^\circ$ moderate inclines, $15^\circ - 25^\circ$ steep scarps, $> 25^\circ$ precipitous cliffs).
   - Formulates the physical engineering limitations of 200m regional grid cells for rover mobility.
4. **Route Traversal Cost & Physics Model**:
   - Explains the mathematical A* cost function:
     $$C(u, v) = \text{dist}(u, v) \cdot \left[1 + w_{\text{slope}} \cdot \left(\frac{\theta(u, v)}{\theta_{\text{max}}}\right)^2\right]$$
   - Explains vehicle mobility profiles:
     - **Heavy Science Rover**: Perseverance/Curiosity class, max slope $15^\circ$, speed $100\text{ m/sol}$, high stability.
     - **Light Scout Rover**: Opportunity/Spirit class, max slope $12^\circ$, speed $50\text{ m/sol}$, lower torque.
     - **Aerial Drone**: Ingenuity class, ignores ground slope, step hop limit $1000\text{ m}$.
   - Provides comparative rationale explaining why Safest weaves through valleys while Balanced optimizes travel time.

---

### C. HUD Components & Interaction Model

1. **`TopCommandBar.tsx`**:
   - Add `[Intel]` trigger button with an `Atom` or `BookOpen` icon with violet accent (`text-purple-400`, `border-purple-500/20`).
   - Toggles `activeDrawer === 'intel'`.
2. **`ScientificIntelDrawer.tsx`**:
   - Aerospace black-glass drawer (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
   - Header with quick search input filtering datasets, geological terms, or vehicle metrics.
   - 4 Interactive Navigation Tabs:
     1. 📡 **Active Layers & Provenance**: Live status of enabled vs available layers, sensor breakdown, and PDS citation copies.
     2. 🌋 **Geological Stratigraphy**: Interactive Martian timeline, stratigraphic column, and USGS quadrangle lookup.
     3. 📐 **Terrain Physics & DEM**: Interactive slope slope-meter explainer, laser altimetry vs stereo photogrammetry, and regional scale warnings.
     4. 🧭 **Route Traversal Science**: Algorithmic cost formula breakdown, slope penalty curves, and vehicle clearance matrices.
3. **In-Situ Contextual Deep-Links**:
   - **`TerrainInspectorCard.tsx`**:
     - Add `[Scientific Dossier]` action button that opens `ScientificIntelDrawer` directly on the `geology` tab with the active quadrangle and epoch highlighted.
   - **`RoutePlannerDrawer.tsx`**:
     - Add `[Scientific Evaluation]` button alongside candidate routes that opens the `routes` tab with the current candidate's cost metrics loaded.
   - **`LayersDrawer.tsx`**:
     - Add `[Info]` button on each layer card opening the `layers` tab with that specific dataset pre-selected.

---

## 4. Verification & Testing Strategy

1. **Automated Unit Testing (`vitest`)**:
   - `scientificIntelligenceService.test.ts`:
     - Test complete provenance coverage for all 14 datasets.
     - Test geological epoch data retrieval for all 3 major epochs.
     - Test terrain slope classification explanations and mathematical validity.
     - Test route cost formula explanation generation.
   - `ScientificIntelDrawer.test.tsx`:
     - Test rendering of all 4 tabs.
     - Test tab switching and search filter logic.
     - Test deep-link focusing behavior via Zustand store.
   - Integration tests in `TopCommandBar.test.tsx`, `TerrainInspectorCard.test.tsx`, `RoutePlannerDrawer.test.tsx`, and `App.test.tsx`.
2. **Production Bundle Integrity**:
   - Execute `npx vitest run` ensuring 100% green tests (baseline 274 + new tests).
   - Execute `npm run build` validating zero TypeScript compilation errors or bundling regressions.

