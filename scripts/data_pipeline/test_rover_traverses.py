#!/usr/bin/env python3
"""
Unit tests for ARES Mars Rover Traverse GeoJSON Pipeline (Phase 08)
Validates Mars 2000 geodetic compliance, Sol progression, and PDS metadata schema.
"""

import json
import os
import unittest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "public", "data")


class TestRoverTraverseGeoJSON(unittest.TestCase):
    def test_perseverance_traverse_file_exists(self):
        filepath = os.path.join(DATA_DIR, "perseverance_traverse.geojson")
        self.assertTrue(os.path.exists(filepath), f"File {filepath} must exist")

    def test_curiosity_traverse_file_exists(self):
        filepath = os.path.join(DATA_DIR, "curiosity_traverse.geojson")
        self.assertTrue(os.path.exists(filepath), f"File {filepath} must exist")

    def test_opportunity_traverse_file_exists(self):
        filepath = os.path.join(DATA_DIR, "opportunity_traverse.geojson")
        self.assertTrue(os.path.exists(filepath), f"File {filepath} must exist")

    def test_spirit_traverse_file_exists(self):
        filepath = os.path.join(DATA_DIR, "spirit_traverse.geojson")
        self.assertTrue(os.path.exists(filepath), f"File {filepath} must exist")

    def test_zhurong_traverse_file_exists(self):
        filepath = os.path.join(DATA_DIR, "zhurong_traverse.geojson")
        self.assertTrue(os.path.exists(filepath), f"File {filepath} must exist")

    def _validate_traverse_geojson(self, filename: str, expected_min_waypoints: int = 15, expected_final_sol: int = None, expected_final_distance: float = None):
        filepath = os.path.join(DATA_DIR, filename)
        if not os.path.exists(filepath):
            self.fail(f"Missing required dataset: {filepath}")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data.get("type"), "FeatureCollection")
        self.assertIn("features", data)

        crs = data.get("crs", {})
        crs_name = crs.get("properties", {}).get("name", "")
        self.assertIn("104971", crs_name, f"CRS must reference Mars 2000 WKID 104971, got {crs_name}")

        features = data["features"]
        self.assertGreaterEqual(len(features), expected_min_waypoints)

        has_linestring = False
        point_features = []

        for feat in features:
            geom = feat.get("geometry", {})
            geom_type = geom.get("type")
            props = feat.get("properties", {})

            if geom_type == "LineString":
                has_linestring = True
                coords = geom.get("coordinates", [])
                self.assertGreaterEqual(len(coords), 10, "LineString must have at least 10 coordinate points")
                for pt in coords:
                    lon, lat = pt[0], pt[1]
                    self.assertGreaterEqual(lon, -180.0)
                    self.assertLessEqual(lon, 180.0)
                    self.assertGreaterEqual(lat, -90.0)
                    self.assertLessEqual(lat, 90.0)

            elif geom_type == "Point":
                point_features.append(feat)
                coords = geom.get("coordinates", [])
                self.assertEqual(len(coords), 2)
                lon, lat = coords[0], coords[1]
                self.assertGreaterEqual(lon, -180.0)
                self.assertLessEqual(lon, 180.0)
                self.assertGreaterEqual(lat, -90.0)
                self.assertLessEqual(lat, 90.0)

                # Required milestone properties
                self.assertIn("sol", props)
                self.assertIsInstance(props["sol"], int)
                self.assertGreaterEqual(props["sol"], 0)

                self.assertIn("earthDate", props)
                self.assertIn("elevationMeters", props)
                self.assertIn("distanceKm", props)
                self.assertIn("siteName", props)

        self.assertTrue(has_linestring, "Dataset must include a LineString traverse geometry")
        self.assertGreaterEqual(len(point_features), expected_min_waypoints)

        # Validate monotonic Sol progression and cumulative distance
        sols = [p["properties"]["sol"] for p in point_features]
        self.assertEqual(sols, sorted(sols), "Waypoint sols must be non-decreasing")

        distances = [p["properties"]["distanceKm"] for p in point_features]
        self.assertEqual(distances, sorted(distances), "Waypoint distanceKm must be non-decreasing")

        if expected_final_sol is not None:
            self.assertEqual(sols[-1], expected_final_sol, f"Final sol should be {expected_final_sol}, got {sols[-1]}")

        if expected_final_distance is not None:
            self.assertAlmostEqual(distances[-1], expected_final_distance, places=1, msg=f"Final distanceKm should be ~{expected_final_distance}")

    def test_perseverance_traverse_schema_and_geodesy(self):
        self._validate_traverse_geojson("perseverance_traverse.geojson", expected_min_waypoints=20)

    def test_curiosity_traverse_schema_and_geodesy(self):
        self._validate_traverse_geojson("curiosity_traverse.geojson", expected_min_waypoints=20)

    def test_opportunity_traverse_schema_and_geodesy(self):
        self._validate_traverse_geojson("opportunity_traverse.geojson", expected_min_waypoints=22, expected_final_sol=5111, expected_final_distance=45.16)

    def test_spirit_traverse_schema_and_geodesy(self):
        self._validate_traverse_geojson("spirit_traverse.geojson", expected_min_waypoints=16, expected_final_sol=1892, expected_final_distance=7.73)

    def test_zhurong_traverse_schema_and_geodesy(self):
        self._validate_traverse_geojson("zhurong_traverse.geojson", expected_min_waypoints=12, expected_final_sol=347, expected_final_distance=1.92)


if __name__ == "__main__":
    unittest.main()

