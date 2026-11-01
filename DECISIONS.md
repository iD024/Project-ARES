# ARES — Architecture Decision Records (ADRs)

---

## ADR 001: Selection of ArcGIS Maps SDK for JavaScript (`@arcgis/core`) as Primary Engine

### Context
ARES requires rendering an accurate, interactive 3D Mars globe with real elevation meshes, seamless transition to 2D regional maps, geodesic measurements on the Martian ellipsoid, and OGC WMTS/WMS raster ingestion from NASA Mars Trek and USGS Astrogeology.

### Options Considered
1. **ArcGIS Maps SDK for JavaScript (`@arcgis/core`)**: Native `GCS_Mars_2000` (WKID 104905) support, built-in Martian 3D LERC elevation services, synchronized `SceneView` and `MapView`, first-class WMTS/WMS layers.
2. **CesiumJS**: Open-source WebGL engine with custom ellipsoid support, but requires generating and hosting a custom pre-tiled quantized-mesh server for 3D Mars terrain, and lacks dedicated 2D GIS cartography tools.
3. **Three.js + MapLibre Custom Dual Engine**: High development overhead; requires manually implementing sphere tessellation, LOD quadtrees, and planetary projection math from scratch.

### Decision
Adopt **`@arcgis/core`** as the core planetary mapping engine for ARES.

### Consequences
- Rapid delivery of scientifically grounded 3D Martian terrain and synchronized 2D regional mapping.
- Native handling of Martian planetary radius ($3,396,190\text{ m}$) without Earth projection distortion.
- Client uses open public planetary data layers without requiring paid named-user tiers.

---

## ADR 002: Planetary Coordinate Reference System (`GCS_Mars_2000` / WKID 104905)

### Context
Standard web GIS engines default to Earth datums (WGS84 / EPSG:4326 or Web Mercator / EPSG:3857). Earth's radius is $6,378,137\text{ m}$, whereas Mars' mean radius is $3,396,190\text{ m}$. Using Earth projections distorts distances, areas, and elevation profiling by ~47%.

### Decision
Standardize all spatial operations, layers, and viewports on **`GCS_Mars_2000` (WKID 104905)**.

### Consequences
- All geodesic measurement tools reflect true Martian distances.
- Tile requests to NASA Trek WMTS align with the Equirectangular 2x1 Level-0 tile matrix grid.
- Earth datums are strictly forbidden across the codebase.

---

## ADR 003: Map-First Viewport with Floating Translucent HUD Architecture

### Context
ARES must prioritize the geographic and scientific exploration experience. Dense, dashboard-first designs obscure planetary spatial relationships.

### Decision
The map viewport occupies 100% of the screen (`fixed inset-0`). All UI components (telemetry bars, layer drawers, elevation profile inspectors, route comparison cards) float above the map as collapsible, semi-translucent HUD panels with dark aerospace glassmorphism.

### Consequences
- Uncompromised visual immersion.
- Maximized screen real estate for planetary observation and route evaluation.
- Clean separation between map rendering lifecycle and UI state.

