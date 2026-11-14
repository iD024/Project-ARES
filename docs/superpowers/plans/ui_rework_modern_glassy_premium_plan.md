# Implementation Plan: Modern Black & White Glassy UI Rework

## Phase 1: Core Design Tokens & Glass Utilities
- Update `tailwind.config.js` with:
  - Obsidian glass colors (`surface-glass`, `surface-elevated`, `surface-card`)
  - Specular inset shadow and outer glass glow tokens
  - Hairline glass border tokens
- Enhance `src/index.css`:
  - Modern aerospace scrollbar styling
  - High-precision glass utility classes (`glass-panel`, `glass-card`, `glass-pill`, `tabular-nums`)

## Phase 2: Design Primitive Modernization (`src/components/ui/`)
- `Drawer.tsx`: Obsidian glass floating drawer with 24px corner radius, hairline highlight, smooth slide-in, and responsive widths.
- `Modal.tsx`: Floating glassy dialog with dark frosted backdrop and specular rim.
- `Button.tsx`: Tactical/glass button variants with subtle sheen, accessible focus rings, and tactile micro-press (`active:scale-[0.98]`).
- `Badge.tsx`: Crisp monospace status capsules with semantic translucent backings.
- `Slider.tsx` & `Tabs.tsx`: Modern range track and segmented tab switches.

## Phase 3: Top Command Bar & Viewport Switcher (`TopCommandBar.tsx`)
- Modernize the layout into three floating capsules:
  1. **Brand Capsule**: ARES Mars 2000 badge with pulsing telemetry pip.
  2. **Mode Switcher**: Segmented glass capsule (Global 3D / Regional 2D / Local Analysis) with white pill active state.
  3. **Grouped Action Dock**: Cleanly organize the 8 disparate buttons into 2 logical clusters (Exploration: Layers, Missions, Explorer; Analytics: Measure, Routes, Intel; Utilities: Legend, Data) with monochromatic glass default styling and unified active states.
  4. Ensure full responsive behavior on laptop and mobile viewports.

## Phase 4: Floating Flight Deck Telemetry Strip (`TelemetryStrip.tsx`)
- Redesign the bottom bar into an aerodynamic floating capsule.
- Use tabular monospace typography (`tabular-nums`) for jitter-free real-time telemetry coordinates, elevation (+/- sign), subsolar longitude, and Mars 2000 CRS badge.

## Phase 5: Floating HUD Cards & Trays
- `TerrainInspectorCard.tsx`: Obsidian glass popover with clear data hierarchy, quadrangle badge, slope gauge, and one-click deep link to Scientific Intel.
- `ElevationProfileTray.tsx`: Sleek transect drawer with clean glass card backings and elevation callouts.
- `MeasurementToolbar.tsx`: Compact floating measurement toolbar with tactile tool switches.
- `RoverMilestoneSlider.tsx`: Refined milestone timeline scrub bar with glass thumb and milestone tick badges.
- `MapAttributionOverlay.tsx` & `ExtentCoverageBanner.tsx`: High-legibility translucent notification banners.

## Phase 6: Automated Testing, Visual Inspection & Vercel Web Guidelines Audit
- Run the full test suite (`npm test -- --run`) ensuring all 296 tests pass.
- Start dev server and inspect with Playwright (`1280x800` desktop and `375x667` mobile).
- Run `audit_ui.py` for accessibility and keyboard focus compliance.

