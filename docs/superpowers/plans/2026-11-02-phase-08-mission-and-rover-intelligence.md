# Phase 08 — Mission & Rover Intelligence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate historical mission and rover information into ARES, featuring verified machine-readable traverse paths, sol milestones, scientific instrument targets, and PDS provenance for Perseverance and Curiosity, with an interactive Sol timeline slider and ground POV navigation.

**Architecture:**
- Python ETL pipeline generates validated Mars 2000 (`WKID 104971`) GeoJSON traverse datasets for Perseverance and Curiosity with real PDS waypoints.
- `roverMissionService.ts` governs spacecraft specifications, payload instruments, sol milestones, and PDS citations.
- `useAppStore.ts` tracks `selectedRoverId`, `activeSol`, `isRoverTraverseVisible`, and `isMissionControlOpen`.
- `RoverMilestoneSlider.tsx` floats at the bottom of the viewport for interactive Sol scrubbing, odometer/elevation readouts, and 1-click 3D POV fly-to at any Sol.
- `MissionControlDrawer.tsx` provides rich mission dossiers, instrument breakdowns, sample tube inventories, and PDS archive links.
- `MarsGlobeView.tsx` and `MarsMapView.tsx` render high-contrast traverse polylines and milestone markers on dedicated GraphicsLayers.

**Tech Stack:** React 19, TypeScript, `@arcgis/core` (GraphicsLayer, Polyline, Point, Graphic), Tailwind CSS, Lucide React, Python 3, Vitest.

**Spec:** In-chat approved design from Phase 08 brainstorming session.

## Global Constraints
- Strictly Mars 2000 geodetic datum (`D_Mars_2000`, `WKID 104971` / `104905`). Mean equatorial radius $a = 3,396,190\text{ m}$.
- Earth coordinate reference systems (WGS84, Web Mercator EPSG:3857) are strictly banned from Mars scene viewports.
- Non-negotiable scientific data integrity: clearly label all data (**ARCHIVED OBSERVATION (PDS)**, **DERIVED**, **OBSERVED**). Do not fabricate rover traverses or represent archived measurements as live active telemetry.
- Maintain 100% passing test suite across all Vitest files and clean TypeScript build.

---

### Task 1: Python ETL Pipeline & GeoJSON Rover Traverse Datasets
**Files:**
- Create: `scripts/data_pipeline/generate_rover_traverses.py`
- Create: `scripts/data_pipeline/test_rover_traverses.py`
- Create: `public/data/perseverance_traverse.geojson`
- Create: `public/data/curiosity_traverse.geojson`

**Interfaces:**
- Produces: Valid Mars 2000 GeoJSON FeatureCollections containing `LineString` traverse routes and `Point` sol milestones with attributes: `sol`, `earthDate`, `elevationMeters`, `distanceKm`, `siteName`, `instrumentTargets`, `discoverySummary`.

- [ ] **Step 1: Write failing Python tests in `scripts/data_pipeline/test_rover_traverses.py`**
  - Verify coordinate bounds in Mars 2000 $[-180, 180]$ longitude.
  - Verify monotonic Sol and distance progression.
  - Verify required feature properties.
- [ ] **Step 2: Run Python tests and verify failure**
  - Run `python3 -m unittest scripts/data_pipeline/test_rover_traverses.py`.
- [ ] **Step 3: Implement `scripts/data_pipeline/generate_rover_traverses.py`**
  - Generate verified Jezero Crater western delta traverse for Perseverance (Sols 0–1000+, 30+ waypoints).
  - Generate verified Mount Sharp ascent traverse for Curiosity (Sols 0–4000+, 30+ waypoints).
  - Execute script to output `perseverance_traverse.geojson` and `curiosity_traverse.geojson`.
- [ ] **Step 4: Run Python tests and verify they pass**
  - Run `python3 -m unittest scripts/data_pipeline/test_rover_traverses.py`.

---

### Task 2: Rover Mission Service & Store Integration
**Files:**
- Create: `src/services/data/roverMissionService.ts`
- Create: `src/services/data/roverMissionService.test.ts`
- Modify: `src/store/useAppStore.ts`
- Modify: `src/store/useAppStore.test.ts`

**Interfaces:**
- Produces: `ROVER_MISSIONS`, `getMissionById`, `getRoverMilestones`, `getMilestoneBySol`, `getTraverseStats`.
- Zustand Store: `selectedRoverId`, `activeSol`, `isRoverTraverseVisible`, `isMissionControlOpen`, and actions.

- [ ] **Step 1: Write failing tests in `src/services/data/roverMissionService.test.ts`**
  - Test mission retrieval for Perseverance and Curiosity.
  - Test milestone retrieval by Sol.
  - Test traverse statistics calculation (total distance, elevation relief, sol count).
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/services/data/roverMissionService.test.ts`.
- [ ] **Step 3: Implement `src/services/data/roverMissionService.ts` & update `useAppStore.ts`**
  - Implement full mission models, instruments, milestones, and PDS citation links.
  - Add rover state variables and setters to `useAppStore.ts`.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/services/data/roverMissionService.test.ts` and `npm test src/store/useAppStore.test.ts`.

---

### Task 3: Interactive Sol Milestone Timeline (`RoverMilestoneSlider.tsx`)
**Files:**
- Create: `src/components/hud/RoverMilestoneSlider.tsx`
- Create: `src/components/hud/RoverMilestoneSlider.test.tsx`
- Modify: `src/components/map/ViewportCoordinator.tsx`

**Interfaces:**
- Consumes: `useAppStore` (`selectedRoverId`, `activeSol`, `setActiveSol`, `setViewMode`, `setTelemetry`)
- Produces: Floating black-glass Sol timeline scrubber with Prev/Next step buttons, Sol slider, distance/elevation readouts, and 1-click "3D POV at Sol" fly-to button.

- [ ] **Step 1: Write failing tests in `src/components/hud/RoverMilestoneSlider.test.tsx`**
  - Test rendering when a rover is selected.
  - Test hidden when no rover is selected.
  - Test Sol slider change updates `activeSol`.
  - Test Prev/Next buttons step through milestones.
  - Test "3D POV at Sol" triggers `LOCAL_ANALYSIS` and updates coordinates.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/hud/RoverMilestoneSlider.test.tsx`.
- [ ] **Step 3: Implement `src/components/hud/RoverMilestoneSlider.tsx`**
  - Build high-contrast black-glass panel (`bg-black/90 backdrop-blur-2xl border-white/10 text-white`).
  - Wire actions: Slider, Next/Prev, 3D POV button, Dismiss button.
  - Mount within `ViewportCoordinator.tsx`.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/hud/RoverMilestoneSlider.test.tsx`.

---

### Task 4: Mission Control Drawer (`MissionControlDrawer.tsx`)
**Files:**
- Create: `src/components/hud/MissionControlDrawer.tsx`
- Create: `src/components/hud/MissionControlDrawer.test.tsx`
- Modify: `src/components/hud/TopCommandBar.tsx`
- Modify: `src/components/hud/TopCommandBar.test.tsx`

**Interfaces:**
- Consumes: `ROVER_MISSIONS`, `useAppStore`
- Produces: Mission control drawer with tabs for Perseverance, Curiosity, Opportunity, Spirit, and Historical Landers, instrument specifications, sample inventory, and PDS links.

- [ ] **Step 1: Write failing tests in `src/components/hud/MissionControlDrawer.test.tsx`**
  - Test drawer open/close.
  - Test tab switching between rovers.
  - Test instrument payload display.
  - Test "Track Rover" action sets `selectedRoverId` and centers map.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/hud/MissionControlDrawer.test.tsx`.
- [ ] **Step 3: Implement `src/components/hud/MissionControlDrawer.tsx` & connect `TopCommandBar.tsx`**
  - Build rich dossier views with badges, specs, and payload cards.
  - Add `[Missions]` trigger button to `TopCommandBar.tsx`.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/hud/MissionControlDrawer.test.tsx` and `npm test src/components/hud/TopCommandBar.test.tsx`.

---

### Task 5: 3D & 2D Rover Traverse Graphics Rendering
**Files:**
- Modify: `src/components/map/MarsGlobeView.tsx`
- Modify: `src/components/map/MarsMapView.tsx`
- Test: `src/components/map/MarsGlobeView.test.tsx`
- Test: `src/components/map/MarsMapView.test.tsx`

**Interfaces:**
- Consumes: `selectedRoverId`, `activeSol`, `isRoverTraverseVisible`
- Produces: Traverse GraphicsLayer rendering neon traverse line, milestone circle markers, and active Sol reticle pin on both viewports.

- [ ] **Step 1: Write failing tests for traverse rendering**
  - Test that selecting a rover populates traverse graphics.
  - Test that changing `activeSol` updates the active reticle position.
- [ ] **Step 2: Run tests and verify failure**
  - Run `npm test src/components/map/MarsGlobeView.test.tsx` and `src/components/map/MarsMapView.test.tsx`.
- [ ] **Step 3: Implement traverse graphic synchronization in `MarsGlobeView.tsx` & `MarsMapView.tsx`**
  - Add `mars-rover-traverse-layer` GraphicsLayer.
  - Render Polyline paths and Point milestones.
  - Render pulsing reticle at active Sol waypoint.
- [ ] **Step 4: Run tests and verify they pass**
  - Run `npm test src/components/map/MarsGlobeView.test.tsx` and `src/components/map/MarsMapView.test.tsx`.

---

### Task 6: End-to-End Verification, Documentation & Roadmap Ledger Update
**Files:**
- Modify: `PROGRESS.md`
- Modify: `ROADMAP.md`
- Modify: `PROMPTS.MD`

- [ ] **Step 1: Run full test suite & production build check**
  - Run `npm test` across all Vitest test files.
  - Run `python3 -m unittest discover scripts/data_pipeline/`.
  - Run `npm run build` for full TypeScript compilation and Vite bundling.
- [ ] **Step 2: Update documentation ledgers**
  - Update `PROGRESS.md`: Record Phase 08 completion and verification results.
  - Update `ROADMAP.md`: Mark Phase 08 Completed & Verified.
  - Update `PROMPTS.MD`: Update Phase 08 status.
- [ ] **Step 3: Execute AgentMemory postflight persistence and report completion**

