#!/usr/bin/env python3
"""
Unit tests for ARES Planetary Resources ETL Pipeline (Phase 08.5 - Task 3)
Validates Mars 2000 geodetic compliance, CRISM hydrated mineralogy,
and SWIM subsurface water ice sheet datasets.
"""

import json
import os
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")

VALID_MINERAL_TYPES = {"Phyllosilicates", "Carbonates", "Sulfates", "Hydrated Silica"}
VALID_DEPTH_RANGES = {"0-1m", "1-5m", ">5m"}
VALID_ISRU_SUITABILITY = {"EXCELLENT", "GOOD", "MODERATE"}


class TestPlanetaryResourcesGeoJSON(unittest.TestCase):
    def setUp(self):
        self.minerals_path = os.path.join(DATA_DIR, "mars_hydrated_minerals.geojson")
        self.ice_path = os.path.join(DATA_DIR, "mars_subsurface_ice.geojson")

    def test_minerals_file_exists(self):
        self.assertTrue(os.path.exists(self.minerals_path), f"Missing {self.minerals_path}")

    def test_subsurface_ice_file_exists(self):
        self.assertTrue(os.path.exists(self.ice_path), f"Missing {self.ice_path}")

    def _validate_polygon_geometry(self, geom):
        geom_type = geom.get("type")
        self.assertIn(geom_type, ["Polygon", "MultiPolygon"], f"Invalid geometry type: {geom_type}")
        
        coordinates = geom.get("coordinates", [])
        self.assertTrue(len(coordinates) > 0, "Coordinates list cannot be empty")

        rings_to_check = coordinates if geom_type == "Polygon" else [ring for poly in coordinates for ring in poly]

        for ring in rings_to_check:
            self.assertGreaterEqual(len(ring), 4, "A polygon ring must contain at least 4 coordinates (3 vertices + closure)")
            # Polygon ring closure
            self.assertEqual(ring[0], ring[-1], f"Ring is not closed: first {ring[0]} != last {ring[-1]}")
            for pt in ring:
                self.assertEqual(len(pt), 2, f"Coordinate must have exactly [lon, lat], got: {pt}")
                lon, lat = pt[0], pt[1]
                self.assertGreaterEqual(lon, -180.0, f"Longitude {lon} < -180")
                self.assertLessEqual(lon, 180.0, f"Longitude {lon} > 180")
                self.assertGreaterEqual(lat, -90.0, f"Latitude {lat} < -90")
                self.assertLessEqual(lat, 90.0, f"Latitude {lat} > 90")

    def test_hydrated_minerals_schema_and_geodesy(self):
        if not os.path.exists(self.minerals_path):
            self.skipTest(f"Hydrated minerals file not generated yet: {self.minerals_path}")

        with open(self.minerals_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("type"), "FeatureCollection")
        crs = data.get("crs", {})
        crs_name = crs.get("properties", {}).get("name", "")
        self.assertIn("104971", crs_name, f"CRS must reference Mars 2000 WKID 104971, got: {crs_name}")

        features = data.get("features", [])
        self.assertGreaterEqual(len(features), 5, "Must include at least 5 mineral deposit features")

        required_regions = {
            "Mawrth Vallis",
            "Nili Fossae",
            "Oxia Planum",
            "Jezero Crater Delta",
            "Valles Marineris",
        }
        found_regions = set()

        for feat in features:
            self.assertEqual(feat.get("type"), "Feature")
            props = feat.get("properties", {})
            self.assertIn("id", props)
            self.assertTrue(bool(props["id"]), "id must not be empty")

            self.assertIn("name", props)
            self.assertTrue(bool(props["name"]), "name must not be empty")

            self.assertIn("mineralType", props)
            self.assertIn(props["mineralType"], VALID_MINERAL_TYPES, f"Invalid mineralType: {props['mineralType']}")

            self.assertIn("targetRegion", props)
            target_reg = props["targetRegion"]
            self.assertTrue(bool(target_reg), "targetRegion must not be empty")
            for req in required_regions:
                if req.lower() in target_reg.lower() or target_reg.lower() in req.lower():
                    found_regions.add(req)

            self.assertIn("concentrationGrade", props)
            self.assertTrue(bool(props["concentrationGrade"]), "concentrationGrade must not be empty")

            self.assertIn("geologicalContext", props)
            self.assertTrue(bool(props["geologicalContext"]), "geologicalContext must not be empty")

            self.assertIn("citation", props)
            self.assertTrue(bool(props["citation"]), "citation must not be empty")

            self._validate_polygon_geometry(feat.get("geometry", {}))

        missing_regions = required_regions - found_regions
        self.assertEqual(len(missing_regions), 0, f"Missing required mineral regions: {missing_regions}")

    def test_subsurface_ice_schema_and_geodesy(self):
        if not os.path.exists(self.ice_path):
            self.skipTest(f"Subsurface ice file not generated yet: {self.ice_path}")

        with open(self.ice_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("type"), "FeatureCollection")
        crs = data.get("crs", {})
        crs_name = crs.get("properties", {}).get("name", "")
        self.assertIn("104971", crs_name, f"CRS must reference Mars 2000 WKID 104971, got: {crs_name}")

        features = data.get("features", [])
        self.assertGreaterEqual(len(features), 4, "Must include at least 4 subsurface ice sheet features")

        required_regions = {
            "Arcadia Planitia",
            "Deuteronilus Mensae",
            "Utopia Planitia",
            "Erebus Montes",
        }
        found_regions = set()

        for feat in features:
            self.assertEqual(feat.get("type"), "Feature")
            props = feat.get("properties", {})
            self.assertIn("id", props)
            self.assertTrue(bool(props["id"]), "id must not be empty")

            self.assertIn("name", props)
            self.assertTrue(bool(props["name"]), "name must not be empty")

            self.assertIn("targetRegion", props)
            target_reg = props["targetRegion"]
            self.assertTrue(bool(target_reg), "targetRegion must not be empty")
            for req in required_regions:
                if req.lower() in target_reg.lower() or target_reg.lower() in req.lower():
                    found_regions.add(req)

            self.assertIn("depthRangeMeters", props)
            self.assertIn(props["depthRangeMeters"], VALID_DEPTH_RANGES, f"Invalid depthRangeMeters: {props['depthRangeMeters']}")

            self.assertIn("icePurityPercentage", props)
            self.assertIsInstance(props["icePurityPercentage"], (int, float))
            self.assertGreaterEqual(props["icePurityPercentage"], 0)
            self.assertLessEqual(props["icePurityPercentage"], 100)

            self.assertIn("consistencyScore", props)
            self.assertIsInstance(props["consistencyScore"], (int, float))
            self.assertGreaterEqual(props["consistencyScore"], 0.0)
            self.assertLessEqual(props["consistencyScore"], 1.0)

            self.assertIn("isruSuitability", props)
            self.assertIn(props["isruSuitability"], VALID_ISRU_SUITABILITY, f"Invalid isruSuitability: {props['isruSuitability']}")

            self.assertIn("citation", props)
            self.assertTrue(bool(props["citation"]), "citation must not be empty")

            self._validate_polygon_geometry(feat.get("geometry", {}))

        missing_regions = required_regions - found_regions
        self.assertEqual(len(missing_regions), 0, f"Missing required ice regions: {missing_regions}")


if __name__ == "__main__":
    unittest.main()
