#!/usr/bin/env python3
"""
generate_nomenclature.py - ARES Planetary Data Pipeline

Compiles authoritative planetary features from the IAU Gazetteer of Planetary Nomenclature
and USGS Astrogeology Science Center.
Includes major impact craters, volcanic montes, chasms, and exploration plains.

Outputs: public/data/mars_nomenclature.geojson
"""

import json
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "public", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "mars_nomenclature.geojson")

IAU_MARS_FEATURES = [
    # Craters
    {"name": "Jezero", "type": "Crater", "lat": 18.38, "lon": 77.45, "diameter_km": 47.5, "origin": "Town in Bosnia and Herzegovina"},
    {"name": "Gale", "type": "Crater", "lat": -4.59, "lon": 137.44, "diameter_km": 154.0, "origin": "Walter F. Gale, Australian astronomer"},
    {"name": "Gusev", "type": "Crater", "lat": -14.57, "lon": 175.47, "diameter_km": 166.0, "origin": "Matvey Gusev, Russian astronomer"},
    {"name": "Victoria", "type": "Crater", "lat": -2.05, "lon": 354.49, "diameter_km": 0.8, "origin": "Ship of Ferdinand Magellan"},
    {"name": "Endeavour", "type": "Crater", "lat": -2.28, "lon": 354.77, "diameter_km": 22.0, "origin": "HMS Endeavour, Captain James Cook"},
    {"name": "Schiaparelli", "type": "Crater", "lat": -2.70, "lon": 16.70, "diameter_km": 461.0, "origin": "Giovanni Schiaparelli, Italian astronomer"},
    {"name": "Cassini", "type": "Crater", "lat": 23.80, "lon": 32.20, "diameter_km": 412.0, "origin": "Giovanni Cassini, Italian-French astronomer"},
    {"name": "Hellas Planitia", "type": "Impact Basin", "lat": -42.70, "lon": 70.00, "diameter_km": 2300.0, "origin": "Classical Greek name for Greece"},
    {"name": "Argyre Planitia", "type": "Impact Basin", "lat": -49.70, "lon": 316.00, "diameter_km": 800.0, "origin": "Mythical silver island"},

    # Montes (Volcanoes)
    {"name": "Olympus Mons", "type": "Mons", "lat": 18.65, "lon": -133.80, "diameter_km": 624.0, "origin": "Mount Olympus, home of the Greek gods"},
    {"name": "Ascraeus Mons", "type": "Mons", "lat": 11.90, "lon": -104.50, "diameter_km": 462.0, "origin": "Ascraea fountain in Boeotia"},
    {"name": "Pavonis Mons", "type": "Mons", "lat": 0.80, "lon": -112.80, "diameter_km": 375.0, "origin": "Peacock constellation"},
    {"name": "Arsia Mons", "type": "Mons", "lat": -8.40, "lon": -121.10, "diameter_km": 435.0, "origin": "Legendary Roman forest Arsia Silva"},
    {"name": "Elysium Mons", "type": "Mons", "lat": 25.00, "lon": 147.20, "diameter_km": 240.0, "origin": "Elysian Fields, Greek mythology"},

    # Chasms & Valleys
    {"name": "Valles Marineris", "type": "Chasma", "lat": -13.90, "lon": -59.20, "diameter_km": 4000.0, "origin": "Named after Mariner 9 orbiter"},
    {"name": "Ares Vallis", "type": "Vallis", "lat": 10.40, "lon": -25.80, "diameter_km": 1700.0, "origin": "Greek god of war, Mars equivalent"},
    {"name": "Kasei Valles", "type": "Vallis", "lat": 24.60, "lon": -65.00, "diameter_km": 1780.0, "origin": "Japanese word for Mars (火星)"},
    {"name": "Neretva Vallis", "type": "Vallis", "lat": 18.50, "lon": 77.20, "diameter_km": 17.0, "origin": "Neretva River in Herzegovina"},

    # Plains
    {"name": "Isidis Planitia", "type": "Planitia", "lat": 12.90, "lon": 87.00, "diameter_km": 1500.0, "origin": "Egyptian goddess Isis"},
    {"name": "Elysium Planitia", "type": "Planitia", "lat": 3.00, "lon": 155.00, "diameter_km": 3000.0, "origin": "Classical Greek mythology"},
    {"name": "Meridiani Planum", "type": "Planum", "lat": 0.20, "lon": 357.50, "diameter_km": 1100.0, "origin": "Mars Prime Meridian location"}
]

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    features = []
    for item in IAU_MARS_FEATURES:
        feature = {
            "type": "Feature",
            "properties": {
                "name": item["name"],
                "type": item["type"],
                "diameterKm": item["diameter_km"],
                "origin": item["origin"],
                "classification": "OBSERVED",
                "authority": "IAU WGPSN / USGS Gazetteer"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [item["lon"], item["lat"]]
            }
        }
        features.append(feature)

    geojson_doc = {
        "type": "FeatureCollection",
        "name": "ARES_IAU_Mars_Nomenclature",
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

    print(f"✅ Generated {len(features)} IAU Mars planetary nomenclature features at {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
