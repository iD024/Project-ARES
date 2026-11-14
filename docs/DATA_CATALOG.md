# ARES — Planetary Scientific Data Catalog

Every dataset in ARES is cataloged with strict scientific provenance, data classification (Observed, Derived, Modeled, Simulated), resolution, coverage, and access protocols.

---

## 1. Global Planetary Datasets

| Dataset Identifier | Full Name / Mission | Provider | Data Type | Native Resolution | Coverage | Protocol / Verified URL | Status |
|---|---|---|---|---|---|---|---|
| `mars-viking-mdim21` | Viking MDIM 2.1 Color Mosaic | NASA / USGS | Observed | 232 m/px | Global ($100\%$) | MapServer / `https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer` | 🟢 Online (1170ms) |
| `mars-hrsc-mola-blend`| HRSC–MOLA Blended DEM Shaded Relief | ESA Mars Express / USGS | Derived (Elevation) | 200 m/px | Global ($100\%$) | ImageServer / `https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer` | 🟢 Online (1078ms) |
| `mars-mola-clrshade` | MOLA Color Shaded Relief | NASA MGS / MOLA | Derived (Elevation) | 463 m/px | Global ($100\%$) | WMTS / `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/` | 🟢 Online (1028ms) |
| `mars-themis-ir-day` | THEMIS IR Day 100m Global Mosaic | ASU / NASA Odyssey | Observed | 100 m/px | Global ($>95\%$) | WMS / `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map` | 🟢 Online (947ms) |
| `mars-geologic-quads` | USGS Geologic Map of Mars | USGS Astrogeology | Derived (Scientific) | 1:5,000,000 | Global Quad Charts | WMS / `https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map` | 🟢 Online (947ms) |

---

## 2. Regional & Local High-Resolution Datasets

| Dataset Identifier | Mission / Instrument | Provider | Data Type | Native Resolution | Target Region | Protocol / Asset | Status |
|---|---|---|---|---|---|---|---|
| `mars-ctx-mosaic` | Context Camera (CTX) Mosaic | Caltech Murray Lab / NASA MRO | Observed | 5.0–6.0 m/px | Global mosaic (tiled coverage) | Tiled XYZ / WMTS | 🟢 Online |
| `mars-hirise-footprints`| HiRISE DTM Footprint Vector Index | NASA MRO / Univ. Arizona / USGS | Derived (DTM Footprints)| 0.25–1.0 m/px | Jezero Crater, Gale Crater, Olympus Mons | GeoJSON / `/data/hirise_footprints.geojson` | 🟢 Local Cache (6 Polygons) |
| `mars-nomenclature` | IAU Mars Planetary Gazetteer | IAU WGPSN / USGS | Observed (Nomenclature) | Feature Centroids | Global Craters, Montes, Chasms, Valleys | GeoJSON / `/data/mars_nomenclature.geojson` | 🟢 Local Cache (21 Points) |

---

## 3. Mission Waypoints & Traverse Data

| Mission Identifier | Spacecraft / Rover | Organization | Landing Date | Coordinates (Lon, Lat) | Data Source |
|---|---|---|---|---|---|
| `perseverance-m2020`| Perseverance Rover | NASA JPL | 2021-02-18 | $77.45^\circ\text{ E}, 18.38^\circ\text{ N}$ | NASA PDS Mars 2020 Traverse Logs |
| `curiosity-msl` | Curiosity Rover | NASA JPL | 2012-08-06 | $137.44^\circ\text{ E}, -4.59^\circ\text{ N}$ | NASA PDS MSL Traverse Logs |
| `insight-lander` | InSight Lander | NASA JPL | 2018-11-26 | $135.62^\circ\text{ E}, 4.50^\circ\text{ N}$ | NASA PDS InSight Archive |
| `opportunity-mer` | Opportunity Rover | NASA JPL | 2004-01-25 | $354.47^\circ\text{ E}, -1.95^\circ\text{ N}$ | NASA PDS MER Traverse Logs |
| `spirit-mer` | Spirit Rover | NASA JPL | 2004-01-04 | $175.47^\circ\text{ E}, -14.57^\circ\text{ N}$ | NASA PDS MER Traverse Logs |

---

## 4. Python ETL Pipeline Reference
- **HiRISE Extractor:** [`scripts/data_pipeline/fetch_hirise_footprints.py`](file:///home/laksh/Hackathons/Space-App/scripts/data_pipeline/fetch_hirise_footprints.py)
- **Nomenclature Compiler:** [`scripts/data_pipeline/generate_nomenclature.py`](file:///home/laksh/Hackathons/Space-App/scripts/data_pipeline/generate_nomenclature.py)
- **Catalog Validator:** [`scripts/data_pipeline/validate_catalog.py`](file:///home/laksh/Hackathons/Space-App/scripts/data_pipeline/validate_catalog.py)
- **Validation Report:** [`scripts/data_pipeline/catalog_health_report.json`](file:///home/laksh/Hackathons/Space-App/scripts/data_pipeline/catalog_health_report.json)
