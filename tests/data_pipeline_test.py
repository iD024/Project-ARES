import json
import os
import unittest

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(WORKSPACE_ROOT, "public", "data")

class TestMarsDataPipeline(unittest.TestCase):
    def test_hirise_footprints_geojson(self):
        file_path = os.path.join(DATA_DIR, "hirise_footprints.geojson")
        self.assertTrue(os.path.exists(file_path), "hirise_footprints.geojson must exist")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["type"], "FeatureCollection")
        self.assertGreaterEqual(len(data["features"]), 6)

        # Check Jezero and Gale footprints
        target_regions = [f["properties"]["targetRegion"] for f in data["features"]]
        self.assertIn("Jezero Crater", target_regions)
        self.assertIn("Gale Crater", target_regions)

        for feat in data["features"]:
            self.assertEqual(feat["geometry"]["type"], "Polygon")
            self.assertIn("resolution", feat["properties"])
            self.assertEqual(feat["properties"]["classification"], "DERIVED")

    def test_mars_nomenclature_geojson(self):
        file_path = os.path.join(DATA_DIR, "mars_nomenclature.geojson")
        self.assertTrue(os.path.exists(file_path), "mars_nomenclature.geojson must exist")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertEqual(data["type"], "FeatureCollection")
        self.assertGreaterEqual(len(data["features"]), 20)

        names = [f["properties"]["name"] for f in data["features"]]
        self.assertIn("Olympus Mons", names)
        self.assertIn("Valles Marineris", names)
        self.assertIn("Jezero", names)
        self.assertIn("Gale", names)

        for feat in data["features"]:
            self.assertEqual(feat["geometry"]["type"], "Point")
            self.assertIn("type", feat["properties"])
            self.assertEqual(feat["properties"]["classification"], "OBSERVED")

if __name__ == "__main__":
    unittest.main()
