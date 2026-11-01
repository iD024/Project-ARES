# ARES — Planetary Scientific Data Catalog

Every dataset in ARES is cataloged with strict scientific provenance, data classification (Observed, Derived, Modeled, Simulated), resolution, coverage, and access protocols.

---

## 1. Global Planetary Datasets

| Dataset Identifier | Full Name / Mission | Provider | Data Type | Native Resolution | Coverage | Protocol / URL |
|---|---|---|---|---|---|---|
| `mars-viking-mdim21` | Viking MDIM 2.1 Color Mosaic | NASA / USGS | Observed | 232 m/px | Global ($100\%$) | WMTS / NASA Mars Trek |
| `mars-mola-clrshade` | MOLA Color Shaded Relief | NASA MGS / MOLA | Derived (Elevation) | 463 m/px | Global ($100\%$) | WMTS / NASA Mars Trek |
| `mars-themis-ir-day` | THEMIS IR Day 100m Global Mosaic | ASU / NASA Odyssey | Observed | 100 m/px | Global ($>95\%$) | WMS / USGS Astrogeology |
| `mars-themis-ir-night`| THEMIS IR Night Mosaic | ASU / NASA Odyssey | Observed | 100 m/px | Global ($>85\%$) | WMS / USGS Astrogeology |
| `mars-hrsc-mola-blend`| HRSC–MOLA Blended DEM Shaded Relief | ESA Mars Express / USGS | Derived (Elevation) | 200 m/px | Global ($100\%$) | WMS / USGS Astrogeology |
| `mars-geologic-quads` | USGS Geologic Map of Mars | USGS Astrogeology | Derived (Scientific) | 1:5,000,000 | Global Quad Charts | WMS / USGS Astrogeology |

---

## 2. Regional & Local High-Resolution Datasets

| Dataset Identifier | Mission / Instrument | Provider | Data Type | Native Resolution | Target Region | Protocol |
|---|---|---|---|---|---|---|
| `mars-ctx-mosaic` | Context Camera (CTX) Mosaic | Caltech Murray Lab / NASA MRO | Observed | 5.0–6.0 m/px | Global mosaic (tiled coverage) | Tiled XYZ / WMTS |
| `mars-hirise-jezero`| HiRISE Ortho & DTM (Jezero Crater) | NASA MRO / Univ. Arizona / USGS | Derived (Photogrammetric DTM)| 0.25–1.0 m/px | Jezero Crater / Perseverance | GeoTIFF / Vector Footprint |
| `mars-hirise-gale` | HiRISE Ortho & DTM (Gale Crater) | NASA MRO / Univ. Arizona / USGS | Derived (Photogrammetric DTM)| 0.25–1.0 m/px | Gale Crater / Curiosity | GeoTIFF / Vector Footprint |

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

## 4. Nomenclature & Planetary Features
- **Source:** IAU Working Group for Planetary System Nomenclature (WGPSN) / USGS Astrogeology Gazetteer.
- **Attributes:** Feature Name, Feature Type (Crater, Mons, Chasma, Vallis, Planitia), Diameter (km), Center Lon/Lat, Origin of Name.
