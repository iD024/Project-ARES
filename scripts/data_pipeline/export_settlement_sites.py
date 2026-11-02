#!/usr/bin/env python3
"""
export_settlement_sites.py - ARES Planetary Data Pipeline (Phase 08.5)

Exports the authoritative Candidate Human Settlement & Base Sites Catalog
into a Mars 2000 compliant GeoJSON dataset (WKID 104971 / IAU 2000 Mars Spheroid).

Evaluated candidate zones combine near-surface water ice accessibility,
safe landing slopes (<5°), atmospheric shielding / EDL depth, and scientific/ISRU value.

Outputs:
    public/data/mars_settlement_sites.geojson
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUTPUT_DIR = os.path.join(BASE_DIR, "public", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "mars_settlement_sites.geojson")

MARS_SETTLEMENT_SITES = [
    {
        "id": "arcadia-alpha",
        "name": "Arcadia Planitia Base Alpha",
        "targetRegion": "Arcadia Planitia",
        "latitude": 39.30,
        "longitude": -171.00,
        "elevationMeters": -3800,
        "waterIceProximityKm": 0.1,
        "slopeSafetyRating": "OPTIMAL",
        "primarySuitabilityFactor": "Near-surface massive sheet ice (<1m regolith overburden) and exceptionally flat terrain (<2° slope) for heavy cargo landing",
        "missionArchitecture": "ISRU Water Extraction & Starship Propellant Production Hub",
        "coordinates": [-171.00, 39.30],
        "surfaceSlopeDegrees": 1.2,
        "estimatedAtmosphericPressurePa": 810,
        "radiationShieldingRating": "STANDARD",
        "description": "Premier candidate for first crewed Starship landings. Abundant sheet ice confirmed by SWIM radar within 1 meter of the smooth, low-hazard volcanic plain."
    },
    {
        "id": "deuteronilus-glacier",
        "name": "Deuteronilus Mensae Glacial Outpost",
        "targetRegion": "Deuteronilus Mensae",
        "latitude": 43.90,
        "longitude": 24.50,
        "elevationMeters": -3100,
        "waterIceProximityKm": 0.5,
        "slopeSafetyRating": "MODERATE",
        "primarySuitabilityFactor": "Thick lobate debris apron (LDA) pure water ice glaciers protected by cliff escarpments offering passive galactic cosmic radiation shielding",
        "missionArchitecture": "Subsurface Glacial Tunnelling & Deep Science Outpost",
        "coordinates": [24.50, 43.90],
        "surfaceSlopeDegrees": 4.8,
        "estimatedAtmosphericPressurePa": 760,
        "radiationShieldingRating": "HIGH",
        "description": "Glacial bastion containing massive debris-covered glaciers hundreds of meters thick. Towering mesa cliffs provide natural shielding against cosmic rays and solar particle events."
    },
    {
        "id": "mawrth-science",
        "name": "Mawrth Vallis Astrobiology Base",
        "targetRegion": "Mawrth Vallis",
        "latitude": 24.00,
        "longitude": -19.00,
        "elevationMeters": -2200,
        "waterIceProximityKm": 25.0,
        "slopeSafetyRating": "OPTIMAL",
        "primarySuitabilityFactor": "Exposed stratigraphy of smectite and phyllosilicate clay strata for ISRU brick sintering and ancient astrobiology biosignature exploration",
        "missionArchitecture": "Astrobiology Science Headquarters & Ceramic Regolith Manufacturing Facility",
        "coordinates": [-19.00, 24.00],
        "surfaceSlopeDegrees": 1.8,
        "estimatedAtmosphericPressurePa": 710,
        "radiationShieldingRating": "STANDARD",
        "description": "One of the oldest ancient outflow channels on Mars, exposing rich, multi-layered phyllosilicate clay deposits ideal for mineral extraction, structural ceramic manufacturing, and searching for past life."
    },
    {
        "id": "erebus-shield",
        "name": "Erebus Montes Shielded Outpost",
        "targetRegion": "Erebus Montes",
        "latitude": 35.70,
        "longitude": -174.80,
        "elevationMeters": -2800,
        "waterIceProximityKm": 12.0,
        "slopeSafetyRating": "MODERATE",
        "primarySuitabilityFactor": "Subterranean lava tube voids and mass-wasting cliff shelter providing natural cosmic ray and micrometeorite shielding",
        "missionArchitecture": "Subterranean Habitation & Pressurized Cavern Colony",
        "coordinates": [-174.80, 35.70],
        "surfaceSlopeDegrees": 5.2,
        "estimatedAtmosphericPressurePa": 745,
        "radiationShieldingRating": "HIGH",
        "description": "Rugged terrain with intact volcanic lava tubes and overhang structures, enabling expandable subterranean habitats that protect long-duration astronaut crews from radiation without heavy surface shielding mass."
    },
    {
        "id": "melas-oasis",
        "name": "Melas Chasma Atmospheric Station",
        "targetRegion": "Melas Chasma (Valles Marineris)",
        "latitude": -9.80,
        "longitude": -76.50,
        "elevationMeters": -4200,
        "waterIceProximityKm": 8.0,
        "slopeSafetyRating": "MODERATE",
        "primarySuitabilityFactor": "Deep Valles Marineris canyon floor depression with elevated atmospheric pressure (~950 Pa), maximizing EDL aerocapture margins and aerodynamic radiation buffer",
        "missionArchitecture": "Deep Canyon Atmospheric Research Station & Hydrated Mineral Refinery",
        "coordinates": [-76.50, -9.80],
        "surfaceSlopeDegrees": 3.9,
        "estimatedAtmosphericPressurePa": 950,
        "radiationShieldingRating": "HIGH",
        "description": "Situated at the deepest floor of central Valles Marineris, where atmospheric pressure reaches Mars peak (~950 Pa), substantially improving Entry, Descent, and Landing (EDL) performance and aerodynamic protection."
    },
    {
        "id": "utopia-vault",
        "name": "Utopia Planitia Subsurface Vault",
        "targetRegion": "Utopia Planitia",
        "latitude": 25.10,
        "longitude": 109.90,
        "elevationMeters": -4100,
        "waterIceProximityKm": 0.8,
        "slopeSafetyRating": "OPTIMAL",
        "primarySuitabilityFactor": "Vast subsurface dielectric ice reservoir verified by Tianwen-1/Zhurong radar and SHARAD orbital sounding",
        "missionArchitecture": "Cryo-Vault Storage, Industrial Deep Mining & Permanent Plains Habitat",
        "coordinates": [109.90, 25.10],
        "surfaceSlopeDegrees": 1.1,
        "estimatedAtmosphericPressurePa": 830,
        "radiationShieldingRating": "STANDARD",
        "description": "Broad northern lowland basin containing an enormous subsurface water ice sheet estimated to rival Lake Superior in volume, confirmed by Zhurong ground radar and MRO SHARAD observations."
    },
    {
        "id": "jezero-depot",
        "name": "Jezero Delta Field Station",
        "targetRegion": "Jezero Crater",
        "latitude": 18.38,
        "longitude": 77.45,
        "elevationMeters": -2560,
        "waterIceProximityKm": 15.0,
        "slopeSafetyRating": "OPTIMAL",
        "primarySuitabilityFactor": "Access to Mars 2020 Perseverance hermetic sample cache depot and well-characterized Neretva delta fan geology",
        "missionArchitecture": "Sample Return Logistic Depot & Lacustrine Astrobiology Habitat",
        "coordinates": [77.45, 18.38],
        "surfaceSlopeDegrees": 1.9,
        "estimatedAtmosphericPressurePa": 730,
        "radiationShieldingRating": "STANDARD",
        "description": "Established around the high-priority sample return zone in Jezero Crater, utilizing years of rover traversal data and cataloged sample tubes sealed by NASA Mars 2020."
    },
    {
        "id": "gale-gateway",
        "name": "Gale Oasis Base",
        "targetRegion": "Gale Crater",
        "latitude": -4.59,
        "longitude": 137.44,
        "elevationMeters": -4500,
        "waterIceProximityKm": 20.0,
        "slopeSafetyRating": "OPTIMAL",
        "primarySuitabilityFactor": "Stratigraphic ramp access to Mount Sharp (Aeolis Mons) strata recording billions of years of Martian climate and geochemical transition",
        "missionArchitecture": "Cross-Planetary Exploration Hub & Deep Stratigraphic Research Campus",
        "coordinates": [137.44, -4.59],
        "surfaceSlopeDegrees": 2.1,
        "estimatedAtmosphericPressurePa": 860,
        "radiationShieldingRating": "MODERATE",
        "description": "Located on the smooth northern floor of Gale Crater near Bradbury Landing, offering access to Mount Sharps 5-kilometer geological column and well-mapped Curiosity rover exploration routes."
    }
]


def generate_settlement_sites_geojson():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    features = []
    for site in MARS_SETTLEMENT_SITES:
        feature = {
            "type": "Feature",
            "properties": {
                "id": site["id"],
                "name": site["name"],
                "targetRegion": site["targetRegion"],
                "latitude": site["latitude"],
                "longitude": site["longitude"],
                "elevationMeters": site["elevationMeters"],
                "waterIceProximityKm": site["waterIceProximityKm"],
                "slopeSafetyRating": site["slopeSafetyRating"],
                "primarySuitabilityFactor": site["primarySuitabilityFactor"],
                "missionArchitecture": site["missionArchitecture"],
                "surfaceSlopeDegrees": site.get("surfaceSlopeDegrees"),
                "estimatedAtmosphericPressurePa": site.get("estimatedAtmosphericPressurePa"),
                "radiationShieldingRating": site.get("radiationShieldingRating"),
                "description": site.get("description"),
                "classification": "MODELED",
                "authority": "NASA HLS2 / SpaceX / USGS Astrogeology / ARES Planetary Engineering"
            },
            "geometry": {
                "type": "Point",
                "coordinates": site["coordinates"]
            }
        }
        features.append(feature)

    geojson_doc = {
        "type": "FeatureCollection",
        "name": "ARES_Mars_Candidate_Settlement_Sites",
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

    print(f"✅ Exported {len(features)} Mars candidate settlement sites to {OUTPUT_FILE}")
    return geojson_doc


if __name__ == "__main__":
    generate_settlement_sites_geojson()
