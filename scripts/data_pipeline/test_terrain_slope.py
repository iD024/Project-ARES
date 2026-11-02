#!/usr/bin/env python3
"""
Unit tests for the ARES Offline Planetary Terrain Pipeline Script.
Tests Mars 2000 ground resolution calculations, Horn's slope derivation,
and analytical hillshade illumination models.
"""

import math
import os
import subprocess
import sys
import tempfile
import unittest
import numpy as np

# Import the module under test (will fail before implementation)
try:
    from process_terrain_slope import (
        MARS_RADIUS_METERS,
        calculate_mars_ground_resolution,
        compute_slope_degrees,
        compute_hillshade,
    )
except ImportError:
    # Allow testing import failure in step 2
    MARS_RADIUS_METERS = 3396190.0
    calculate_mars_ground_resolution = None
    compute_slope_degrees = None
    compute_hillshade = None


class TestMarsGroundResolution(unittest.TestCase):
    """Tests for Mars 2000 geodetic cell resolution scaling."""

    def setUp(self):
        if calculate_mars_ground_resolution is None:
            self.skipTest("process_terrain_slope.py not yet implemented")

    def test_equatorial_resolution(self):
        """At equator (0 deg), dx and dy should both be ~59,274.7 m per degree."""
        dx, dy = calculate_mars_ground_resolution(0.0, 1.0)
        expected = (math.pi * MARS_RADIUS_METERS) / 180.0
        self.assertAlmostEqual(dy, expected, places=3)
        self.assertAlmostEqual(dx, expected, places=3)
        self.assertAlmostEqual(dx, 59274.6975, places=3)

    def test_mid_latitude_resolution(self):
        """At 60 degrees North, dx should scale by cos(60 deg) = 0.5."""
        dx, dy = calculate_mars_ground_resolution(60.0, 1.0)
        expected_dy = (math.pi * MARS_RADIUS_METERS) / 180.0
        expected_dx = expected_dy * math.cos(math.radians(60.0))
        self.assertAlmostEqual(dy, expected_dy, places=3)
        self.assertAlmostEqual(dx, expected_dx, places=3)
        self.assertAlmostEqual(dx, expected_dy * 0.5, places=3)

    def test_southern_latitude_resolution(self):
        """At 60 degrees South, dx should remain positive and equal to 60 deg N."""
        dx, dy = calculate_mars_ground_resolution(-60.0, 1.0)
        expected_dy = (math.pi * MARS_RADIUS_METERS) / 180.0
        expected_dx = expected_dy * 0.5
        self.assertAlmostEqual(dx, expected_dx, places=3)
        self.assertAlmostEqual(dy, expected_dy, places=3)
        self.assertGreater(dx, 0.0)

    def test_polar_resolution(self):
        """At poles (+/- 90 deg), dx should approach 0 while dy remains constant."""
        dx_north, dy_north = calculate_mars_ground_resolution(90.0, 1.0)
        dx_south, dy_south = calculate_mars_ground_resolution(-90.0, 1.0)
        self.assertAlmostEqual(dx_north, 0.0, places=5)
        self.assertAlmostEqual(dx_south, 0.0, places=5)
        self.assertAlmostEqual(dy_north, 59274.6975, places=3)
        self.assertAlmostEqual(dy_south, 59274.6975, places=3)

    def test_hirise_scale_resolution(self):
        """For high-resolution sub-kilometer DEM (cell_deg = 0.0001 deg ~= 5.93 m)."""
        dx, dy = calculate_mars_ground_resolution(0.0, 0.0001)
        self.assertAlmostEqual(dx, 5.92747, places=4)
        self.assertAlmostEqual(dy, 5.92747, places=4)

    def test_keyword_arguments_support(self):
        """Should accept latitude and cell_size_degrees as keyword arguments."""
        dx1, dy1 = calculate_mars_ground_resolution(lat_deg=30.0, cell_deg=0.5)
        dx2, dy2 = calculate_mars_ground_resolution(latitude=30.0, cell_size_degrees=0.5)
        self.assertEqual(dx1, dx2)
        self.assertEqual(dy1, dy2)


class TestHornSlopeDerivation(unittest.TestCase):
    """Tests for Horn's method slope derivation from elevation grids."""

    def setUp(self):
        if compute_slope_degrees is None:
            self.skipTest("process_terrain_slope.py not yet implemented")

    def test_flat_terrain(self):
        """A completely flat elevation surface must have 0.0 degrees slope everywhere."""
        grid = np.full((10, 10), 1500.0, dtype=np.float64)
        slope = compute_slope_degrees(grid, dx=100.0, dy=100.0)
        self.assertEqual(slope.shape, grid.shape)
        np.testing.assert_allclose(slope, 0.0, atol=1e-5)

    def test_uniform_x_slope(self):
        """A uniform ramp in x-direction with dz/dx = 1.0 must yield 45 degrees slope."""
        dx = 50.0
        dy = 50.0
        # Elev increases by 50 m per column (dz/dx = 1.0)
        cols = np.arange(7) * 50.0
        grid = np.tile(cols, (7, 1)).astype(np.float64)

        slope = compute_slope_degrees(grid, dx=dx, dy=dy)
        # Check interior pixels (unaffected by border padding)
        interior = slope[1:-1, 1:-1]
        np.testing.assert_allclose(interior, 45.0, atol=1e-4)

    def test_uniform_y_slope(self):
        """A uniform ramp in y-direction with dz/dy = 1.0 must yield 45 degrees slope."""
        dx = 40.0
        dy = 40.0
        rows = np.arange(7) * 40.0
        grid = np.tile(rows[:, np.newaxis], (1, 7)).astype(np.float64)

        slope = compute_slope_degrees(grid, dx=dx, dy=dy)
        interior = slope[1:-1, 1:-1]
        np.testing.assert_allclose(interior, 45.0, atol=1e-4)

    def test_combined_xy_slope(self):
        """Ramp with dz/dx = 1.0 and dz/dy = 1.0 yields arctan(sqrt(2)) ~= 54.7356 degrees."""
        dx = 20.0
        dy = 20.0
        y_indices, x_indices = np.indices((9, 9))
        grid = (x_indices * dx + y_indices * dy).astype(np.float64)

        slope = compute_slope_degrees(grid, dx=dx, dy=dy)
        expected_angle = math.degrees(math.atan(math.sqrt(2.0)))
        interior = slope[1:-1, 1:-1]
        np.testing.assert_allclose(interior, expected_angle, atol=1e-4)

    def test_elevation_offset_invariance(self):
        """Slope must be strictly invariant to vertical elevation offsets (e.g. datum shift)."""
        dx, dy = 30.0, 30.0
        base_grid = np.random.RandomState(42).uniform(-4000.0, 3000.0, (8, 8))
        slope1 = compute_slope_degrees(base_grid, dx=dx, dy=dy)
        slope2 = compute_slope_degrees(base_grid + 5000.0, dx=dx, dy=dy)
        np.testing.assert_allclose(slope1, slope2, atol=1e-8)

    def test_invalid_dimension_raises(self):
        """Should raise ValueError if grid is 1D or 3D."""
        with self.assertRaises(ValueError):
            compute_slope_degrees(np.array([1.0, 2.0, 3.0]), dx=10.0, dy=10.0)

    def test_elevation_grid_keyword_alias(self):
        """Should accept elevation_grid keyword alias."""
        grid = np.zeros((5, 5))
        slope = compute_slope_degrees(elevation_grid=grid, dx=10.0, dy=10.0)
        self.assertEqual(slope.shape, (5, 5))


class TestAnalyticalHillshade(unittest.TestCase):
    """Tests for Lambertian hillshade calculation."""

    def setUp(self):
        if compute_hillshade is None:
            self.skipTest("process_terrain_slope.py not yet implemented")

    def test_hillshade_offset_invariance(self):
        """Hillshade must be invariant to uniform elevation offsets."""
        dx, dy = 25.0, 25.0
        base_grid = np.random.RandomState(42).uniform(-2000.0, 2000.0, (10, 10))
        hs1 = compute_hillshade(base_grid, dx=dx, dy=dy, azimuth_deg=315.0, altitude_deg=45.0)
        hs2 = compute_hillshade(base_grid + 10000.0, dx=dx, dy=dy, azimuth_deg=315.0, altitude_deg=45.0)
        np.testing.assert_allclose(hs1, hs2, atol=1e-8)

    def test_flat_terrain_standard_sun(self):
        """Flat terrain illuminated at 45 deg altitude yields 255 * sin(45) ~= 180.312."""
        grid = np.full((7, 7), 200.0, dtype=np.float64)
        hillshade = compute_hillshade(grid, dx=100.0, dy=100.0, azimuth_deg=315.0, altitude_deg=45.0)

        expected = 255.0 * math.sin(math.radians(45.0))
        np.testing.assert_allclose(hillshade, expected, atol=1e-3)

    def test_flat_terrain_overhead_sun(self):
        """Flat terrain with solar altitude of 90 degrees yields 255 (maximum illumination)."""
        grid = np.full((5, 5), 50.0, dtype=np.float64)
        hillshade = compute_hillshade(grid, dx=50.0, dy=50.0, altitude_deg=90.0)
        np.testing.assert_allclose(hillshade, 255.0, atol=1e-4)

    def test_slope_facing_sun_vs_away(self):
        """A slope facing NW (towards sun at 315 deg) should be brighter than slope facing SE."""
        dx, dy = 10.0, 10.0
        y_idx, x_idx = np.indices((7, 7))

        # Terrain tilting up towards SE (facing NW towards 315 deg illumination):
        # As x increases (East) and y increases (South), elevation increases
        grid_facing_nw = (x_idx * 10.0 + y_idx * 10.0).astype(np.float64)

        # Opposite terrain tilting up towards NW (facing SE, in shadow from 315 deg):
        # As x and y increase, elevation decreases
        grid_facing_se = (-x_idx * 10.0 - y_idx * 10.0).astype(np.float64)

        hs_nw = compute_hillshade(grid_facing_nw, dx=dx, dy=dy, azimuth_deg=315.0, altitude_deg=45.0)
        hs_se = compute_hillshade(grid_facing_se, dx=dx, dy=dy, azimuth_deg=315.0, altitude_deg=45.0)

        # NW facing should be significantly brighter than SE facing
        self.assertGreater(hs_nw[3, 3], hs_se[3, 3])
        # Values must be bounded in [0, 255]
        self.assertTrue(np.all(hs_nw >= 0.0) and np.all(hs_nw <= 255.0))
        self.assertTrue(np.all(hs_se >= 0.0) and np.all(hs_se <= 255.0))


class TestCommandLineInterface(unittest.TestCase):
    """Tests for CLI flags and synthetic execution."""

    def test_cli_help(self):
        """Running the script with --help should return code 0 and usage text."""
        script_path = os.path.join(os.path.dirname(__file__), "process_terrain_slope.py")
        result = subprocess.run(
            [sys.executable, script_path, "--help"],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("ARES Mars Terrain Slope & Hillshade Pipeline", result.stdout)
        self.assertIn("--input", result.stdout)
        self.assertIn("--output-slope", result.stdout)
        self.assertIn("--output-hillshade", result.stdout)

    def test_cli_synthetic_processing(self):
        """Running CLI without input generates synthetic crater terrain and writes outputs."""
        script_path = os.path.join(os.path.dirname(__file__), "process_terrain_slope.py")
        with tempfile.TemporaryDirectory() as tmpdir:
            slope_out = os.path.join(tmpdir, "test_slope.npy")
            hs_out = os.path.join(tmpdir, "test_hs.npy")

            result = subprocess.run(
                [
                    sys.executable,
                    script_path,
                    "--synthetic",
                    "--lat",
                    "-14.5",
                    "--output-slope",
                    slope_out,
                    "--output-hillshade",
                    hs_out,
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, msg=f"CLI failed with error: {result.stderr}")
            self.assertTrue(os.path.exists(slope_out))
            self.assertTrue(os.path.exists(hs_out))

            loaded_slope = np.load(slope_out)
            loaded_hs = np.load(hs_out)
            self.assertEqual(loaded_slope.shape, loaded_hs.shape)
            self.assertTrue(np.all(loaded_slope >= 0.0))
            self.assertTrue(np.all((loaded_hs >= 0.0) & (loaded_hs <= 255.0)))

    def test_cli_csv_processing(self):
        """CLI should support saving as CSV when file extension is .csv."""
        script_path = os.path.join(os.path.dirname(__file__), "process_terrain_slope.py")
        with tempfile.TemporaryDirectory() as tmpdir:
            slope_csv = os.path.join(tmpdir, "slope.csv")
            hs_csv = os.path.join(tmpdir, "hs.csv")

            result = subprocess.run(
                [
                    sys.executable,
                    script_path,
                    "--synthetic",
                    "--output-slope",
                    slope_csv,
                    "--output-hillshade",
                    hs_csv,
                ],
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0)
            self.assertTrue(os.path.exists(slope_csv))
            self.assertTrue(os.path.exists(hs_csv))

            loaded_slope = np.loadtxt(slope_csv, delimiter=",")
            self.assertEqual(loaded_slope.shape, (200, 200))


if __name__ == "__main__":
    unittest.main()
