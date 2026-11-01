# Phase 01: Design System & Application Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete visual foundation and application shell for ARES, including design system tokens, aerospace HUD panels, collapsible drawers, modal dialogues, and responsive viewport placeholder.

**Architecture:** Map-first full-bleed interface with floating translucent HUD overlays. State is managed by a centralized Zustand store (`useAppStore`), styling is governed by TasteSkill anti-slop principles with Tailwind CSS, and all components are decoupled and unit-tested with Vitest.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Zustand, Vitest.

**Spec:** [`PROMPTS.MD` (Phase 01)](file:///home/laksh/Hackathons/Space-App/PROMPTS.MD#L47-L79), [`DESIGN_SYSTEM.md`](file:///home/laksh/Hackathons/Space-App/DESIGN_SYSTEM.md)

## Global Constraints
- Spatial reference: Strictly `GCS_Mars_2000` (WKID `104905`), Mars radius $R = 3,396,190\text{ m}$.
- Viewport must remain the dominant element (100% full-screen). All UI elements must float with glassmorphism and be collapsible.
- No actual Mars map engine in this phase; use a tactical orbital viewport placeholder clearly labeled.
- All components must have automated unit tests before integration.

---

### Task 1: UI Types & Zustand Application State Store

**Files:**
- Create: `src/types/hud.ts`
- Create: `src/store/useAppStore.ts`
- Test: `src/store/useAppStore.test.ts`

**Interfaces:**
- Consumes: None
- Produces: `useAppStore` hook managing `activeDrawer`, `activeModal`, `viewMode`, `layers`, and `telemetry`.

- [ ] **Step 1: Write failing test in src/store/useAppStore.test.ts**
  Test initial store state, `setActiveDrawer`, `setViewMode`, `setLayerVisibility`, and `setLayerOpacity`.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/store/useAppStore.test.ts`.
- [ ] **Step 3: Implement src/types/hud.ts and src/store/useAppStore.ts**
  Define types for `ViewMode` ('GLOBAL_3D' | 'REGIONAL_2D' | 'LOCAL_ANALYSIS'), `DrawerId`, `ModalId`, `LayerItem`, and `TelemetryData`. Implement Zustand store with toggle actions.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/store/useAppStore.test.ts`.
- [ ] **Step 5: Commit Task 1**
  Commit store and types.

---

### Task 2: Core UI Primitives (Button, Badge, Slider, Tabs, Drawer, Modal)

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Slider.tsx`
- Create: `src/components/ui/Tabs.tsx`
- Create: `src/components/ui/Drawer.tsx`
- Create: `src/components/ui/Modal.tsx`
- Test: `src/components/ui/Primitives.test.tsx`

**Interfaces:**
- Consumes: `clsx`, `tailwind-merge`, `lucide-react`
- Produces: Reusable aerospace UI component set.

- [ ] **Step 1: Write failing tests in src/components/ui/Primitives.test.tsx**
  Test button clicks, badge variants, slider input events, tab switching, drawer visibility, and modal dismiss on escape.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/ui/Primitives.test.tsx`.
- [ ] **Step 3: Implement UI primitives**
  Implement `Button`, `Badge`, `Slider`, `Tabs`, `Drawer`, and `Modal` with dark aerospace styling.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/ui/Primitives.test.tsx`.
- [ ] **Step 5: Commit Task 2**
  Commit UI primitives.

---

### Task 3: Floating HUD Panels (TopCommandBar & TelemetryStrip)

**Files:**
- Create: `src/components/hud/TopCommandBar.tsx`
- Create: `src/components/hud/TelemetryStrip.tsx`
- Create: `src/components/hud/ViewportPlaceholder.tsx`
- Test: `src/components/hud/HudPanels.test.tsx`

**Interfaces:**
- Consumes: `useAppStore`, UI primitives
- Produces: Persistent floating header, telemetry footer, and tactical orbital canvas placeholder.

- [ ] **Step 1: Write failing tests in src/components/hud/HudPanels.test.tsx**
  Test mode toggle switching in `TopCommandBar`, telemetry value rendering in `TelemetryStrip`, and placeholder presence.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/hud/HudPanels.test.tsx`.
- [ ] **Step 3: Implement TopCommandBar, TelemetryStrip, and ViewportPlaceholder**
  Implement components with responsive styling and clean animations.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/hud/HudPanels.test.tsx`.
- [ ] **Step 5: Commit Task 3**
  Commit HUD panels.

---

### Task 4: Planetary Layers Drawer & Provenance Modal

**Files:**
- Create: `src/components/hud/LayersDrawer.tsx`
- Create: `src/components/hud/ToolsDrawer.tsx`
- Create: `src/components/hud/ProvenanceModal.tsx`
- Test: `src/components/hud/LayersAndProvenance.test.tsx`

**Interfaces:**
- Consumes: `useAppStore`, `DATA_CATALOG.md` specs
- Produces: Fully interactive layer control panel and scientific provenance viewer.

- [ ] **Step 1: Write failing test in src/components/hud/LayersAndProvenance.test.tsx**
  Verify layers list renders Viking, MOLA, THEMIS; test opacity slider changes and layer visibility toggles.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/hud/LayersAndProvenance.test.tsx`.
- [ ] **Step 3: Implement LayersDrawer, ToolsDrawer, and ProvenanceModal**
  Implement layer management, category filters, opacity controls, and dataset documentation modal.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/hud/LayersAndProvenance.test.tsx`.
- [ ] **Step 5: Commit Task 4**
  Commit layers and provenance components.

---

### Task 5: Empty, Loading, and Error State Components

**Files:**
- Create: `src/components/feedback/EmptyState.tsx`
- Create: `src/components/feedback/LoadingOverlay.tsx`
- Create: `src/components/feedback/ErrorBanner.tsx`
- Test: `src/components/feedback/FeedbackStates.test.tsx`

**Interfaces:**
- Consumes: `lucide-react`
- Produces: Reusable UI feedback widgets for network drops, empty selections, and data fetching.

- [ ] **Step 1: Write failing tests in src/components/feedback/FeedbackStates.test.tsx**
  Test rendering of EmptyState, LoadingOverlay with message, and ErrorBanner with retry trigger.
- [ ] **Step 2: Run test to confirm failure**
  Run `npx vitest run src/components/feedback/FeedbackStates.test.tsx`.
- [ ] **Step 3: Implement feedback components**
  Implement `EmptyState`, `LoadingOverlay`, and `ErrorBanner`.
- [ ] **Step 4: Run test to confirm it passes**
  Run `npx vitest run src/components/feedback/FeedbackStates.test.tsx`.
- [ ] **Step 5: Commit Task 5**
  Commit feedback states.

---

### Task 6: Full Application Shell Assembly, Verification & Phase Report

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `PROGRESS.md`
- Modify: `DESIGN_SYSTEM.md`

- [ ] **Step 1: Assemble full application shell in src/App.tsx**
  Integrate `ViewportPlaceholder`, `TopCommandBar`, `TelemetryStrip`, `LayersDrawer`, `ToolsDrawer`, and `ProvenanceModal`.
- [ ] **Step 2: Update src/App.test.tsx**
  Verify the integrated shell renders all HUD triggers, drawers open on click, and modals function.
- [ ] **Step 3: Run full test suite and production build**
  Execute `npm test` and `npm run build` to verify zero errors.
- [ ] **Step 4: Update documentation**
  Update `PROGRESS.md` and `DESIGN_SYSTEM.md` with Phase 01 deliverables.
- [ ] **Step 5: Commit Phase 01 and present completion report**
  Commit all changes and present Phase 01 report for sign-off.

