# Implementation Plan: ARES Mars UI Declutter & Ergonomic Redesign

## Phase 1: Store & State Unification
- Unify drawer state in `useAppStore.ts`:
  - Consolidate `isMissionControlOpen` into `activeDrawer === 'missions'`.
  - Add `isHudVisible: boolean` (default `true`) and `toggleHudVisibility()`.
  - Add mutual exclusivity between bottom trays (`activeBottomShelf`: `'profile' | 'rover' | 'pov' | null`).
  - Ensure updating tests for store changes.

## Phase 2: Top Command Bar Ergonomics (`TopCommandBar.tsx`)
- Streamline the 8 action buttons into 3 structured, intuitive clusters:
  - **Explore**: Layers & Landing Sites (`activeDrawer === 'layers' | 'tools'`).
  - **Missions**: Rover Missions & Route Planner (`activeDrawer === 'missions' | 'routes'`).
  - **Analysis**: Geodesic Measure (`activeMeasurementTool`) & Scientific Intel (`activeDrawer === 'intel'`).
- Add HUD Visibility (Zen Mode) Toggle icon (`Eye` / `EyeOff`) with keyboard shortcut `H`.
- Polish badge typography and responsive collapsing for laptop and tablet viewports.

## Phase 3: Coordinated Top Center Notification Hub
- Coordinate `ExtentCoverageBanner.tsx`, `MeasurementToolbar.tsx`, and the 2D Regional Cartography badge in `MarsMapView.tsx`.
- Stack them with deterministic vertical offsets (`top-16`, `top-28`) or integrate them so `MeasurementToolbar` and `ExtentCoverageBanner` do not collide or obscure each other.

## Phase 4: Non-Colliding Camera & Inspection Dock (Top-Right)
- Relocate `GlobeControls.tsx` and `MapControls.tsx` to a clean right-hand tactical position.
- Adjust `TerrainInspectorCard.tsx` positioning and z-index so it smoothly docks without obscuring camera zoom/tilt buttons.

## Phase 5: Bottom Activity Shelf & Telemetry Coordination
- Coordinate `TelemetryStrip.tsx` (anchored at `bottom-3 left-4 right-4`).
- Refactor `ElevationProfileTray.tsx`, `RoverMilestoneSlider.tsx`, and `LocalPovControls.tsx` to mount inside a unified `BottomActivityShelf` directly above `TelemetryStrip` (`bottom-16`), ensuring only one is rendered at a time.
- Adjust `MapAttributionOverlay.tsx` and `TerrainLegendPanel.tsx` coordinates so they do not collide with each other or the bottom shelf.

## Phase 6: Vercel Web Guidelines Audit & Testing
- Fix `LAYOUT_VH_VIEWPORT_JUMP` (`min-h-[100dvh]`).
- Fix `A11Y_OUTLINE_SUPPRESSED` in `MarsMapView.tsx`.
- Run `audit_ui.py` until 100/100 score.
- Run complete test suite (`npm test`) to ensure all 305 tests pass.
