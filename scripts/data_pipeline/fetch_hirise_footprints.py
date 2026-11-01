#!/usr/bin/env python3
"""
fetch_hirise_footprints.py - ARES Planetary Data Pipeline

Compiles validated high-resolution Digital Terrain Model (DTM) footprints
from the High Resolution Imaging Science Experiment (HiRISE) onboard NASA's MRO.
Focuses on key science targets: Jezero Crater (Perseverance), Gale Crater (Curiosity),
Olympus Mons, and Valles Marineris.

Outputs: public/data/hirise_footprints.geojson
"""

import json
import os
import sys

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "public", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "hirise_footprints.geojson")

HIRIS_DTM_TARGETS = [
    {
        "id": "DTEEC_045994_1985_045282_1985_U01",
        "name": "Jezero Crater Western Fan Delta",
        "target_region": "Jezero Crater",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 0.5,
        "grid_elevation_min_m": -2720,
        "grid_elevation_max_m": -2210,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [77.30, 18.25, 77.62, 18.52],
        "coordinates": [
            [
                [77.30, 18.25],
                [77.62, 18.25],
                [77.62, 18.52],
                [77.30, 18.52],
                [77.30, 18.25]
            ]
        ]
    },
    {
        "id": "DTEEC_046772_1985_046706_1985_U01",
        "name": "Jezero Crater Kodiak Buttes & Rim",
        "target_region": "Jezero Crater",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 0.5,
        "grid_elevation_min_m": -2640,
        "grid_elevation_max_m": -2180,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [77.40, 18.15, 77.70, 18.38],
        "coordinates": [
            [
                [77.40, 18.15],
                [77.70, 18.15],
                [77.70, 18.38],
                [77.40, 18.38],
                [77.40, 18.15]
            ]
        ]
    },
    {
        "id": "DTEEC_009149_1750_009861_1750_U01",
        "name": "Gale Crater - Mount Sharp (Aeolis Mons) North Flank",
        "target_region": "Gale Crater",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 1.0,
        "grid_elevation_min_m": -4520,
        "grid_elevation_max_m": -850,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [137.28, -4.75, 137.60, -4.40],
        "coordinates": [
            [
                [137.28, -4.75],
                [137.60, -4.75],
                [137.60, -4.40],
                [137.28, -4.40],
                [137.28, -4.75]
            ]
        ]
    },
    {
        "id": "DTEEC_037841_1755_037129_1755_U01",
        "name": "Gale Crater - Vera Rubin Ridge & Gediz Vallis",
        "target_region": "Gale Crater",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 0.5,
        "grid_elevation_min_m": -4410,
        "grid_elevation_max_m": -3800,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [137.35, -4.80, 137.55, -4.55],
        "coordinates": [
            [
                [137.35, -4.80],
                [137.55, -4.80],
                [137.55, -4.55],
                [137.35, -4.55],
                [137.35, -4.80]
            ]
        ]
    },
    {
        "id": "DTEEC_002821_1985_003388_1985_U01",
        "name": "Olympus Mons Central Caldera Scarps",
        "target_region": "Olympus Mons",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 1.0,
        "grid_elevation_min_m": 18200,
        "grid_elevation_max_m": 21287,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [-133.80, 18.20, -133.40, 18.65],
        "coordinates": [
            [
                [-133.80, 18.20],
                [-133.40, 18.20],
                [-133.40, 18.65],
                [-133.80, 18.65],
                [-133.80, 18.20]
            ]
        ]
    },
    {
        "id": "DTEEC_002888_1740_003521_1740_U01",
        "name": "Valles Marineris - Candor Chasma Layered Deposits",
        "target_region": "Valles Marineris",
        "instrument": "HiRISE (MRO)",
        "resolution_m_px": 1.0,
        "grid_elevation_min_m": -4800,
        "grid_elevation_max_m": -1200,
        "citation": "NASA/JPL/University of Arizona/USGS",
        "bbox": [-75.80, -6.50, -75.40, -6.10],
        "coordinates": [
            [
                [-75.80, -6.50],
                [-75.40, -6.50],
                [-75.40, -6.10],
                [-75.80, -6.10],
                [-75.80, -6.50]
            ]
        ]
    }
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    features = []
    for dtm in HIRIS_DTM_TARGETS:
        feature = {
            "type": "Feature",
            "properties": {
                "id": dtm["id"],
                "name": dtm["name"],
                "targetRegion": dtm["target_region"],
                "instrument": dtm["instrument"],
                "resolution": f"{dtm['resolution_m_px']} m/px",
                "elevRange": f"{dtm['grid_elevation_min_m']} to {dtm['grid_elevation_max_m']} m",
                "classification": "DERIVED",
                "citation": dtm["citation"],
                "crs": "GCS_Mars_2000 (WKID 104971)"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": dtm["coordinates"]
            }
        }
        features.append(feature)

    geojson_doc = {
        "type": "FeatureCollection",
        "name": "ARES_HiRISE_DTM_Footprints",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::104971"
            }
        },
        "features": features
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(geojson_doc, f, indent=2)

    print(f"✅ Generated {len(features)} HiRISE DTM footprint polygons at {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
