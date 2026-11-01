# ARES — PHASE EXECUTION PROMPTS

These prompts are executed sequentially in Antigravity. Each phase must be planned, approved, implemented, tested, documented, and approved before proceeding.

---

# PHASE 00 — FOUNDATION AND RECONNAISSANCE

**Objective:** Understand the existing environment and establish the technical foundation.

### Prompt

Act as the lead software architect for ARES.

Inspect the complete existing repository, development environment, dependencies, configuration, and available project files.

Do not immediately start implementing product features.

Tasks:

1. Identify the existing framework, application structure, dependencies, and entry points.
2. Determine whether an existing application should be preserved or initialized.
3. Evaluate ArcGIS Maps SDK for JavaScript and CesiumJS for Mars-specific planetary visualization.
4. Evaluate available Mars coordinate systems and imagery delivery options.
5. Identify licensing, API, performance, and data availability risks.
6. Propose a scalable frontend and data architecture.
7. Establish development, testing, and documentation conventions.
8. Identify technical dependencies between roadmap phases.

Create or update:
- GEMINI.md
- ROADMAP.md
- ARCHITECTURE.md
- DATA_CATALOG.md
- DESIGN_SYSTEM.md
- PROGRESS.md
- DECISIONS.md

Do not make major architectural changes without approval.

Deliver a technical assessment, recommended architecture, dependency map, and Phase 00 implementation plan.

Wait for approval.

---

# PHASE 01 — DESIGN SYSTEM AND APPLICATION SHELL

**Objective:** Build the complete visual foundation of ARES.

### Prompt

Implement the ARES application shell using the approved architecture.

Design direction: Esri Explore Mars.

Requirements:

1. Establish an original ARES visual identity.
2. Create a professional scientific exploration interface.
3. Use a dark planetary exploration aesthetic.
4. Build the main application layout.
5. Create navigation, sidebars, toolbars, panels, dialogs, and reusable UI components.
6. Establish typography, spacing, iconography, colors, and interaction states.
7. Design the map viewport as the dominant application element.
8. Support desktop-first layouts and responsive behavior.
9. Create consistent loading, empty, error, and no-data states.

Do not build the actual Mars map yet.

Use temporary visual placeholders only where necessary and identify them clearly.

Create reusable components rather than isolated page-specific implementations.

Deliver a functional frontend shell with a documented design system.

Verify the application in the browser before reporting completion.

---

# PHASE 02 — GLOBAL 3D MARS ENVIRONMENT

**Objective:** Build the interactive global Mars experience.

### Prompt

Implement the global 3D Mars environment using the approved planetary mapping engine.

Requirements:

1. Render a correctly shaped Mars globe.
2. Use an appropriate Mars-specific coordinate reference system.
3. Integrate a real global Mars imagery source.
4. Integrate terrain/elevation where supported.
5. Support globe rotation, zoom, and camera movement.
6. Display major geographic features and verified mission locations where data is available.
7. Add coordinate inspection.
8. Add reset-view and navigation controls.
9. Implement smooth camera interactions.
10. Handle missing imagery and terrain gracefully.

Evaluate NASA Mars Trek and suitable Mars-specific imagery/terrain services.

Do not use an Earth globe with a Mars texture as a substitute for a correctly configured planetary environment.

The resulting globe must be genuinely interactive and scientifically grounded.

Document imagery sources, terrain sources, coordinate assumptions, and limitations.

---

# PHASE 03 — MARS DATA INFRASTRUCTURE

**Objective:** Establish the data pipeline used by all subsequent scientific features.

### Prompt

Build the ARES Mars data infrastructure.

Inspect the approved DATA_CATALOG.md and architecture.

Implement the necessary ingestion, processing, storage, and delivery mechanisms.

Initial datasets to investigate and integrate:

1. Viking global color mosaic.
2. HRSC–MOLA blended DEM.
3. CTX global mosaic.
4. USGS Geologic Map of Mars.
5. HiRISE DTM coverage/index data.

Requirements:

- Create a structured dataset registry.
- Store source, license, resolution, projection, coverage, and data type.
- Support downloading or accessing only necessary regional subsets.
- Prepare suitable formats for frontend delivery.
- Support raster and vector datasets.
- Implement caching where appropriate.
- Handle unavailable datasets and service failures.
- Avoid downloading enormous global datasets unnecessarily.
- Document processing scripts and reproducible workflows.

Use Python, GDAL, Rasterio, and GeoPandas where appropriate.

Do not claim a dataset is integrated until it has been tested.

Deliver a working data pipeline and updated DATA_CATALOG.md.

---

# PHASE 04 — 2D REGIONAL EXPLORATION

**Objective:** Implement the transition from global Mars to regional surface exploration.

### Prompt

Build the regional 2D map experience.

Requirements:

1. Allow users to select a region from the global 3D globe.
2. Transition from the global experience to a top-down regional map.
3. Preserve the selected geographic location.
4. Preserve geographic context during the transition.
5. Support pan, zoom, and coordinate inspection.
6. Load appropriate regional imagery.
7. Display geographic labels and verified points of interest.
8. Support region selection and returning to the global globe.
9. Handle changes in imagery resolution as users zoom.

The transition must feel like one continuous geographic application, not an unrelated page navigation.

Do not simply stretch global imagery at high zoom levels.

Implement the regional map using the approved mapping architecture.

Test geographic alignment and coordinate consistency.

---

# PHASE 05 — MULTI-RESOLUTION IMAGERY AND MAP LAYERS

**Objective:** Create the imagery exploration system.

### Prompt

Implement the multi-resolution Mars imagery system.

Requirements:

1. Integrate global imagery.
2. Integrate regional CTX imagery where available.
3. Integrate higher-resolution local imagery where available.
4. Support NASA Mars Trek WMTS products after verifying their capabilities.
5. Implement layer selection and visibility controls.
6. Support opacity adjustment for overlays.
7. Display imagery attribution and source information.
8. Handle missing tiles and incomplete coverage.
9. Load data progressively based on geographic extent and zoom.
10. Avoid unnecessary requests and excessive memory consumption.

Build a reusable layer-management system.

Do not imply that higher-resolution imagery exists everywhere.

The frontend must communicate when a layer has incomplete coverage or is unavailable.

---

# PHASE 06 — TERRAIN INTELLIGENCE AND ANALYSIS

**Objective:** Convert scientific terrain datasets into useful visual layers.

### Prompt

Implement the ARES terrain-analysis system.

Use real elevation and geological datasets.

Required capabilities:

1. Elevation visualization.
2. Hillshade generation and visualization.
3. Slope calculation and visualization.
4. Geological map overlays.
5. High-resolution terrain visualization where HiRISE DTM coverage exists.
6. Layer legends and units.
7. Layer opacity controls.
8. Coordinate-based elevation inspection.
9. Resolution and coverage indicators.
10. Scientific data attribution.

Processing requirements:

- Use GDAL/Rasterio or the approved processing stack.
- Verify projections and units.
- Account for Mars latitude-dependent ground distances.
- Document resampling and interpolation.
- Distinguish observed, derived, and interpreted data.

Do not fabricate hazard classifications.

Global elevation-derived slope must be described as regional terrain information, not rover-scale obstacle detection.

Deliver working terrain layers and a documented processing pipeline.

---

# PHASE 07 — LOCATION INTELLIGENCE AND MEASUREMENT

**Objective:** Make the map interactive and informative.

### Prompt

Implement the location inspection and measurement system.

Requirements:

1. Click anywhere on the map to inspect a location.
2. Display latitude and longitude.
3. Display elevation when valid data is available.
4. Display available geological information.
5. Display relevant imagery and terrain metadata.
6. Implement distance measurement.
7. Implement area measurement.
8. Implement elevation profile generation where the underlying DEM supports it.
9. Show measurement units.
10. Show data source and resolution.

Build contextual information panels that work consistently across global, regional, and local exploration.

Ensure that coordinate calculations use the approved Mars reference system.

Do not display fabricated elevation or geological information when data is unavailable.

---

# PHASE 08 — MISSION AND ROVER INTELLIGENCE

**Objective:** Integrate historical mission information into the exploration experience.

### Prompt

Implement the Mars mission and rover information system.

Investigate accessible, verifiable datasets for:

- Perseverance.
- Curiosity.
- Historical landing locations.
- Rover traverse information.
- Scientific observations.
- Relevant instrument measurements.

Use PDS and other authoritative planetary data sources.

Requirements:

1. Display verified landing locations.
2. Display rover paths where machine-readable traverse data is available.
3. Display historical mission markers.
4. Allow users to select a mission or rover.
5. Display available mission details.
6. Connect mission information to geographic locations.
7. Show source and observation dates.
8. Clearly distinguish historical observations from current conditions.

Do not invent rover coordinates or traverse paths.

Do not represent archived measurements as live telemetry.

---

# PHASE 09 — TERRAIN-AWARE ROUTE PLANNING

**Objective:** Build the core navigation functionality.

### Prompt

Implement a terrain-aware route-planning engine.

Requirements:

1. Allow users to select starting and destination coordinates.
2. Generate a terrain-cost grid from available data.
3. Implement A* or Dijkstra-based route search.
4. Incorporate distance and supported terrain attributes into the cost function.
5. Account for elevation and slope where valid.
6. Generate alternative candidate routes.
7. Compare route distance and terrain statistics.
8. Display candidate routes on the map.
9. Generate elevation profiles.
10. Explain the criteria behind route recommendations.

The cost model must be transparent and configurable.

Clearly document missing terrain information and uncertainty.

Do not claim that the shortest or lowest-cost route is guaranteed safe.

Where rover-scale hazards are not observable, explicitly communicate that limitation.

Test routing against known geographic and synthetic test cases.

---

# PHASE 10 — SCIENTIFIC INTELLIGENCE INTERFACE

**Objective:** Make the scientific information understandable.

### Prompt

Implement the scientific interpretation and explanation interface.

Requirements:

1. Provide understandable descriptions of active map layers.
2. Explain elevation and slope information.
3. Describe available geological units using source-backed information.
4. Explain route comparisons.
5. Explain the inputs used in terrain-cost calculations.
6. Show dataset provenance.
7. Show resolution and geographic coverage.
8. Show missing or uncertain information.
9. Distinguish observations from derived calculations and models.
10. Provide contextual explanations when users select geographic features.

Do not invent scientific conclusions.

Every explanation must be traceable to available data or clearly labelled as a calculation or estimate.

Keep explanations concise and integrated into the map experience.

---

# PHASE 11 — INTEGRATION, OPTIMIZATION AND RELEASE

**Objective:** Deliver a stable, polished application.

### Prompt

Perform final integration and release validation for ARES.

Inspect the complete application and all previous phases.

Requirements:

1. Verify the global 3D Mars environment.
2. Verify transitions into regional 2D exploration.
3. Verify local imagery and terrain layers.
4. Verify data attribution and metadata.
5. Verify location inspection and measurement.
6. Verify mission information.
7. Verify route planning.
8. Verify scientific explanations.
9. Test all major interactions.
10. Perform regression testing.
11. Optimize imagery loading and map performance.
12. Test missing-data and network-failure scenarios.
13. Fix console errors and broken interactions.
14. Review responsive behavior.
15. Review accessibility and usability.
16. Prepare deployment configuration and documentation.

Do not remove functionality merely to make the application appear stable.

Create a final verification report that lists:
- Completed features.
- Verified functionality.
- Known limitations.
- Remaining issues.
- Dataset sources.
- Deployment instructions.

Do not claim release readiness until critical acceptance criteria have passed.

---

# END OF PHASE PROMPTS

After each phase, wait for explicit human approval before executing the next phase.