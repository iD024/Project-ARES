#!/usr/bin/env python3
"""
Unit tests for ARES InSight Marsquake Seismic Catalog ETL Pipeline (Phase 08.5)
Validates Mars 2000 geodetic compliance, MQS Data Release 14 metadata schema,
spherical geodesy coordinate projections, and key seismic events.
"""

import json
import math
import os
import re
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")
GEOJSON_PATH = os.path.join(DATA_DIR, "mars_seismic_events.geojson")

INSIGHT_LAT = 4.5023
INSIGHT_LON = 135.6234


def calculate_expected_epicenter(lander_lat: float, lander_lon: float, dist_deg: float, az_deg: float):
    """Spherical forward geodesy destination point calculation."""
    phi1 = math.radians(lander_lat)
    lam1 = math.radians(lander_lon)
    delta = math.radians(dist_deg)
    theta = math.radians(az_deg)

    sin_phi2 = math.sin(phi1) * math.cos(delta) + math.cos(phi1) * math.sin(delta) * math.cos(theta)
    phi2 = math.asin(sin_phi2)

    y = math.sin(theta) * math.sin(delta) * math.cos(phi1)
    x = math.cos(delta) - math.sin(phi1) * math.sin(phi2)
    lam2 = lam1 + math.atan2(y, x)

    lat = math.degrees(phi2)
    lon = math.degrees(lam2)
    lon = ((lon + 180.0) % 360.0) - 180.0
    return lon, lat


class TestMarsquakesCatalog(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.file_exists = os.path.exists(GEOJSON_PATH)
        if cls.file_exists:
            with open(GEOJSON_PATH, "r", encoding="utf-8") as f:
                cls.data = json.load(f)
        else:
            cls.data = None

    def test_file_exists(self):
        self.assertTrue(os.path.exists(GEOJSON_PATH), f"Missing dataset: {GEOJSON_PATH}")

    def test_geojson_structure(self):
        self.assertIsNotNone(self.data, "Dataset could not be loaded")
        self.assertEqual(self.data.get("type"), "FeatureCollection")
        self.assertIn("features", self.data)

        # Mars 2000 CRS check (WKID 104971)
        crs = self.data.get("crs", {})
        crs_name = crs.get("properties", {}).get("name", "")
        self.assertIn("104971", crs_name, f"CRS must reference Mars 2000 WKID 104971, got {crs_name}")

        features = self.data.get("features", [])
        self.assertGreaterEqual(len(features), 40, f"Catalog must contain at least 40 events, found {len(features)}")

    def test_features_schema_and_integrity(self):
        self.assertIsNotNone(self.data)
        features = self.data.get("features", [])
        event_id_pattern = re.compile(r"^S\d{4}[a-z]$")
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")

        event_ids = set()

        for feat in features:
            self.assertEqual(feat.get("type"), "Feature")
            props = feat.get("properties", {})
            geom = feat.get("geometry", {})

            # Geometry validations
            self.assertEqual(geom.get("type"), "Point")
            coords = geom.get("coordinates", [])
            self.assertEqual(len(coords), 2, "Point coordinates must be [lon, lat]")
            lon, lat = coords[0], coords[1]
            self.assertGreaterEqual(lon, -180.0)
            self.assertLessEqual(lon, 180.0)
            self.assertGreaterEqual(lat, -90.0)
            self.assertLessEqual(lat, 90.0)

            # Property validations
            event_id = props.get("eventId")
            self.assertIsNotNone(event_id)
            self.assertTrue(event_id_pattern.match(event_id), f"Invalid eventId: {event_id}")
            self.assertNotIn(event_id, event_ids, f"Duplicate eventId detected: {event_id}")
            event_ids.add(event_id)

            sol = props.get("sol")
            self.assertIsInstance(sol, int)
            self.assertGreaterEqual(sol, 0)
            self.assertLessEqual(sol, 1500)

            earth_date = props.get("earthDate")
            self.assertIsInstance(earth_date, str)
            self.assertTrue(date_pattern.match(earth_date), f"Invalid earthDate: {earth_date}")

            magnitude = props.get("magnitude")
            self.assertTrue(isinstance(magnitude, (float, int)))
            self.assertGreaterEqual(float(magnitude), 1.0)
            self.assertLessEqual(float(magnitude), 5.0)

            event_type = props.get("eventType")
            self.assertIn(event_type, ["LF", "BB", "HF", "IMPACT"])

            quality = props.get("quality")
            self.assertIn(quality, ["A", "B", "C"])

            distance_deg = props.get("distanceDeg")
            self.assertTrue(isinstance(distance_deg, (float, int)))
            self.assertGreater(float(distance_deg), 0.0)
            self.assertLessEqual(float(distance_deg), 180.0)

            azimuth_deg = props.get("backAzimuthDeg")
            self.assertTrue(isinstance(azimuth_deg, (float, int)))
            self.assertGreaterEqual(float(azimuth_deg), 0.0)
            self.assertLessEqual(float(azimuth_deg), 360.0)

            region = props.get("epicenterRegion")
            self.assertIsInstance(region, str)
            self.assertGreater(len(region.strip()), 0)

            citation = props.get("pdsCitation")
            self.assertEqual(citation, "NASA/PDS InSight SEIS MQS Data Release 14")

            # Validate spherical geodesy coordinate projection
            exp_lon, exp_lat = calculate_expected_epicenter(
                INSIGHT_LAT, INSIGHT_LON, float(distance_deg), float(azimuth_deg)
            )
            self.assertAlmostEqual(lon, exp_lon, delta=0.1, msg=f"Longitude mismatch for {event_id}")
            self.assertAlmostEqual(lat, exp_lat, delta=0.1, msg=f"Latitude mismatch for {event_id}")

    def test_key_major_events_presence(self):
        self.assertIsNotNone(self.data)
        features = self.data.get("features", [])
        events_by_id = {f["properties"]["eventId"]: f["properties"] for f in features}

        required_major_events = ["S0173a", "S0235b", "S0809a", "S0976a", "S1000a", "S1094b", "S1222a"]
        for req_id in required_major_events:
            self.assertIn(req_id, events_by_id, f"Key seismic event {req_id} must be included in catalog")

        # Specific assertions for S1222a (Monster Quake)
        s1222a = events_by_id["S1222a"]
        self.assertEqual(s1222a["sol"], 1222)
        self.assertEqual(s1222a["magnitude"], 4.7)
        self.assertEqual(s1222a["eventType"], "BB")
        self.assertEqual(s1222a["quality"], "A")

        # Specific assertions for S1094b (Fresh Impact Crater)
        s1094b = events_by_id["S1094b"]
        self.assertEqual(s1094b["sol"], 1094)
        self.assertEqual(s1094b["eventType"], "IMPACT")
        self.assertEqual(s1094b["quality"], "A")

        # Specific assertions for S1000a (Amazonis Planitia Impact)
        s1000a = events_by_id["S1000a"]
        self.assertEqual(s1000a["sol"], 1000)
        self.assertEqual(s1000a["eventType"], "IMPACT")

        # Specific assertions for S0173a and S0235b (First detected Cerberus Fossae quakes)
        s0173a = events_by_id["S0173a"]
        self.assertEqual(s0173a["sol"], 173)
        self.assertEqual(s0173a["quality"], "A")
        self.assertEqual(s0173a["eventType"], "LF")

        s0235b = events_by_id["S0235b"]
        self.assertEqual(s0235b["sol"], 235)
        self.assertEqual(s0235b["quality"], "A")
        self.assertEqual(s0235b["eventType"], "LF")


if __name__ == "__main__":
    unittest.main()
