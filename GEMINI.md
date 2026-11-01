# GEMINI.md — ARES Engineering Directives & Invariants

## 1. Project Mission & Identity
ARES (Advanced Reconnaissance and Exploration System) is an interactive Mars exploration and terrain-analysis platform inspired by the capabilities and immersive experience of Esri Explore Mars.

## 2. Core Invariants (Non-Negotiable)

1. **Map-First Viewport:**
   - The map/globe occupies the primary viewport space at all times.
   - UI elements (telemetry, layer selector, elevation profiler, mission waypoints) must be floating, collapsible, non-intrusive HUD panels.
2. **Scientific Data Integrity:**
   - Always use real, traceable Mars datasets (NASA Trek WMTS, USGS Astrogeology WMS, HRSC-MOLA blended DEM, CTX mosaics, HiRISE DTMs).
   - Never invent scientific measurements, coordinates, elevations, or rover traverses.
   - Always label data clearly: **Observed**, **Derived**, **Modeled**, or **Simulated**.
3. **Planetary Geodetic Rules (Mars Reference System):**
   - Strictly Mars 2000 datum (`D_Mars_2000`, `WKID 104905` / `104971`).
   - Mean equatorial radius: $a = 3,396,190\text{ m}$.
   - Earth coordinate reference systems (WGS84, Web Mercator EPSG:3857) are strictly banned from Mars scene viewports.
4. **Phase Governance:**
   - Every phase must be planned, approved, implemented, tested, documented, and approved before proceeding.
   - Never advance independently to the next phase without explicit user sign-off.
5. **No Broken States or Faked Functionality:**
   - Gracefully handle network timeouts, missing tiles, and incomplete layer coverage.
   - When data is unavailable for a region or zoom level, display an honest "Data unavailable for this extent" indicator.

## 3. Technology Stack Conventions
- **Frontend:** React 19/18, TypeScript, Vite, Tailwind CSS.
- **Planetary Engine:** `@arcgis/core` (ArcGIS Maps SDK for JavaScript).
- **Icons & Styling:** Lucide React, Tailwind CSS custom ARES dark palette (`ares-space`, `ares-panel`, `ares-rust`, `ares-cyan`).
- **Data Pipeline:** Python 3 (GDAL, Rasterio, GeoPandas) for offline processing and vector formatting.
- **Testing:** Vitest + React Testing Library. All components and utility math must have automated tests.
