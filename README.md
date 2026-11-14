# ARES — Advanced Reconnaissance and Exploration System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![ArcGIS Maps SDK](https://img.shields.io/badge/@arcgis/core-4.31-007ac2.svg)](https://developers.arcgis.com/javascript/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-334%20Passed-brightgreen.svg)](https://vitest.dev/)

**ARES** is an interactive, high-fidelity Mars exploration and planetary terrain-intelligence platform inspired by Esri Explore Mars and NASA Trek. Built for planetary scientists, aerospace researchers, and mission planners, ARES delivers an immersive, scientific-grade GIS environment for investigating the Martian surface, deciphering chronostratigraphy, analyzing historical rover traverses, and planning autonomous surface navigation.

---

## 🌟 Key Features

- **Planetary Geodetic Integrity:** Built strictly on IAU `GCS_Mars_2000` (WKID `104905` sphere / `104971` spheroid; $a = 3,396,190\text{ m}$). Prevents the severe latitudinal distortions caused by projecting extraterrestrial bodies onto Earth coordinate reference systems.
- **Triple-Mode Viewport Architecture:**
  - 🌐 **Global 3D SceneView:** Full planetary globe with real vertical exaggeration using the HRSC-MOLA blended elevation mesh (`MDEM200M`).
  - 🗺️ **Regional 2D MapView:** High-precision top-down planetary cartography workspace.
  - 🚀 **Local Analysis POV:** First-person tactical ground cockpit with 360° orbital sweeps and pitch-controlled terrain inspection.
- **14 Ingested Planetary Datasets:**
  - *Global Imagery & Relief:* Viking MDIM 2.1 color mosaic, HRSC-MOLA blended shaded relief, MOLA color relief, THEMIS Day IR, CTX mosaic, USGS Geologic Quads.
  - *Overlays & Gazetteers:* IAU Mars nomenclature (craters, montes, valles), HiRISE DTM meter-scale footprints (Jezero, Gale, Olympus Mons).
  - *Specialized Science:* CRISM mineral spectroscopy (carbonates, phyllosilicates, sulfates), SWIM subsurface water ice, InSight Marsquake Service (MQS) seismic catalog, and human settlement zones.
- **Mission & Rover Intelligence:** Sol-by-sol timeline scrubbing, milestone tracking, and 1-click ground-level camera fly-tos for Perseverance, Curiosity, Spirit, Opportunity, InSight, and Zhurong.
- **Autonomous Terrain-Aware A* Route Planner:** Discrete geodetic lattice pathfinding evaluating slope gradients via Horn’s algorithm to generate 3 candidate paths (Safest, Balanced, Direct) weighted against vehicle rollover thresholds and wheel-soil traction.
- **Obsidian Glass Heads-Up Display (HUD):** Aerodynamic, dark-glass UI built to 100/100 Vercel Web Design Guidelines compliance with zero numerical jitter, responsive clustered docks, and deep-linked scientific dossiers.

---

## 🛠️ Technology Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Planetary Engine** | `@arcgis/core` (ArcGIS Maps SDK for JavaScript) |
| **State Management** | Zustand |
| **Styling & Icons** | Tailwind CSS, Lucide React |
| **Data Pipelines (ETL)** | Python 3, GDAL, Rasterio, GeoPandas |
| **Testing** | Vitest, React Testing Library (296 Vitest + 38 Python tests) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Python 3.10+** (optional, for offline data pipelines)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd Space-App

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Tests & Verification

```bash
# Run Vitest test suite
npm test

# Build production bundle
npm run build
```

---

## 📂 Project Structure

```
Space-App/
├── src/
│   ├── components/       # HUD, Viewports (SceneView/MapView), Drawers, UI primitives
│   ├── config/           # Dataset catalog, planetary layer configs, landmarks
│   ├── hooks/            # Map and layer synchronization hooks
│   ├── services/         # Geodesy math, A* route planner, scientific intelligence
│   ├── stores/           # Zustand application state
│   └── types/            # TypeScript schemas and geodetic types
├── scripts/data_pipeline/ # Python ETL pipelines for HiRISE, nomenclature, validation
├── public/               # Local GeoJSON caches, markers, and assets
├── ARCHITECTURE.md       # Full architectural specification
├── DATA_CATALOG.md       # Provenance ledger for all 14 datasets
├── DESIGN.md             # Obsidian glass design system & guidelines
└── PROGRESS.md           # Engineering log and verification gates
```

---

## 📜 Scientific Data Provenance

All datasets used in ARES originate from verified public NASA PDS and USGS Astrogeology repositories:
- NASA Planetary Data System (PDS) Geosciences Node
- USGS Astrogeology Science Center
- ESA Planetary Science Archive (PSA)

---

## 📄 License

MIT License. See `LICENSE` for details.
