# Phase 00: Foundation and Reconnaissance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the foundational environment, project scaffolding, documentation suite (7 core docs), and verified Mars 3D mapping harness for ARES.

**Architecture:** Initialize a modern React 19/18 + TypeScript + Vite + Tailwind CSS application configured for `@arcgis/core` with `GCS_Mars_2000` (WKID 104905). Create the 7 mandatory architectural documents tracking project invariants, datasets, decisions, and progress. Verify the foundation with automated tests and a functional local build.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, `@arcgis/core`, Vitest, Lucide React, Zustand.

**Spec:** [`PROMPTS.MD`](file:///home/laksh/Hackathons/Space-App/PROMPTS.MD#L7-L45)

## Global Constraints
- Spatial Reference: strictly `GCS_Mars_2000` (`wkid: 104905` / `104971`), Mars mean radius $R = 3,396,190\text{ m}$.
- Earth datums (WGS84, Web Mercator EPSG:3857) are strictly forbidden in Mars scene contexts.
- Maintain the 7 canonical documents: `GEMINI.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `DATA_CATALOG.md`, `DESIGN_SYSTEM.md`, `PROGRESS.md`, `DECISIONS.md`.
- Zero unhandled console errors or broken dependencies.

---

### Task 1: Git Repository & Environment Configuration

**Files:**
- Create: `.gitignore`
- Create: `.env.example`

**Interfaces:**
- Consumes: None
- Produces: Clean git tracking and environment boundary.

- [ ] **Step 1: Initialize git repository and configure .gitignore**
  Initialize `git init` in `/home/laksh/Hackathons/Space-App`. Create `.gitignore` ignoring `node_modules`, `dist`, `.env`, `.env.local`, `.system_generated`, `*.pyc`, `__pycache__`, `data/cache`.
- [ ] **Step 2: Commit initial git state**
  Commit git initialization and ignore files.

---

### Task 2: Project Scaffolding (Vite + React + TypeScript + Tailwind CSS)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

**Interfaces:**
- Consumes: Node runtime, npm
- Produces: Executable Vite dev server and production build pipeline.

- [ ] **Step 1: Create package.json and install dependencies**
  Configure dependencies: `@arcgis/core`, `react`, `react-dom`, `lucide-react`, `zustand`, `clsx`, `tailwind-merge`. Dev dependencies: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `vitest`.
- [ ] **Step 2: Configure Vite and TypeScript for ArcGIS SDK**
  Configure `vite.config.ts` for clean build, asset resolution, and Vitest test runner.
- [ ] **Step 3: Configure Tailwind CSS with ARES deep-space color palette**
  Define `ares-space` (slate-950/black), `ares-panel` (slate-900/80), `ares-rust` (orange/amber accents), `ares-cyan` (telemetry cyan).
- [ ] **Step 4: Verify npm run build succeeds**
  Run `npm run build` to confirm zero compilation errors.

---

### Task 3: Establish the 7 Mandatory Master Documentation Files

**Files:**
- Create: `GEMINI.md`
- Create: `ROADMAP.md`
- Create: `ARCHITECTURE.md`
- Create: `DATA_CATALOG.md`
- Create: `DESIGN_SYSTEM.md`
- Create: `PROGRESS.md`
- Create: `DECISIONS.md`

**Interfaces:**
- Consumes: Findings from Phase 00 reconnaissance & PROMPTS.MD
- Produces: Authoritative living documentation for all subsequent phases.

- [ ] **Step 1: Create GEMINI.md**
  Document project operational rules, planetary GIS invariants, and phase governance.
- [ ] **Step 2: Create ROADMAP.md**
  Document the canonical 12-phase execution plan from Phase 00 through Phase 11.
- [ ] **Step 3: Create ARCHITECTURE.md**
  Document frontend structure, `@arcgis/core` scene coordination, CRS parameters, and data flow.
- [ ] **Step 4: Create DATA_CATALOG.md**
  Register NASA Trek WMTS, USGS WMS, MOLA, HRSC, CTX, HiRISE, and planetary nomenclature sources with metadata.
- [ ] **Step 5: Create DESIGN_SYSTEM.md**
  Specify the visual language: dark sci-fi aesthetic, typography (JetBrains Mono/Inter), color tokens, HUD glassmorphism.
- [ ] **Step 6: Create PROGRESS.md**
  Initialize the tracking log recording Phase 00 status and deliverables.
- [ ] **Step 7: Create DECISIONS.md**
  Record ADR 001 (`@arcgis/core` selection), ADR 002 (Mars 2000 WKID 104905), ADR 003 (Map-first HUD paradigm).
- [ ] **Step 8: Commit documentation suite**
  Commit the 7 documentation files to git.

---

### Task 4: Planetary GIS Constants & Automated Test Suite

**Files:**
- Create: `src/config/mars.ts`
- Create: `src/config/mars.test.ts`

**Interfaces:**
- Consumes: IAU 2000 Mars geodetic constants
- Produces: Type-safe Mars CRS config, radius constants, and verified coordinate checks.

- [ ] **Step 1: Write failing test in src/config/mars.test.ts**
  Assert that Mars semi-major radius is 3396190m, WKID is 104905, and default spatial reference object is valid.
- [ ] **Step 2: Run test to confirm it fails**
  Run `npx vitest run src/config/mars.test.ts`.
- [ ] **Step 3: Implement src/config/mars.ts**
  Define `MARS_SPATIAL_REFERENCE`, `MARS_EQUATORIAL_RADIUS`, `MARS_POLAR_RADIUS`, and initial landing site coordinates (Jezero, Gale).
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/config/mars.test.ts`.
- [ ] **Step 5: Commit task**
  Commit the Mars config and test.

---

### Task 5: Mars 3D Proof-of-Concept Harness & Smoke Test

**Files:**
- Create: `src/components/MarsHarness.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/MarsHarness.test.tsx`

**Interfaces:**
- Consumes: `@arcgis/core/views/SceneView`, `src/config/mars.ts`
- Produces: Functional 3D Mars globe proof-of-concept verifying WKID 104905 initialization without Earth projection artifacts.

- [ ] **Step 1: Write unit test for MarsHarness configuration**
  Verify the component renders the container and initializes with correct Mars spatial reference props.
- [ ] **Step 2: Implement MarsHarness.tsx**
  Implement clean ArcGIS SceneView mount/unmount lifecycle with `spatialReference: { wkid: 104905 }`, dark background, and HUD status pill.
- [ ] **Step 3: Connect to App.tsx**
  Render the harness with an ARES Phase 00 status overlay.
- [ ] **Step 4: Run tests and build**
  Run `npm run test` and `npm run build` to verify zero errors.
- [ ] **Step 5: Commit changes**
  Commit the working harness and App component.

---

### Task 6: Phase 00 Verification & Completion Report

**Files:**
- Modify: `PROGRESS.md`

- [ ] **Step 1: Execute test suite and production build**
  Verify all tests pass and build outputs clean dist assets.
- [ ] **Step 2: Update PROGRESS.md**
  Mark Phase 00 as complete with verification evidence.
- [ ] **Step 3: Generate Phase 00 Completion Report**
  Present the formal Phase 00 completion summary and await approval for Phase 01.

