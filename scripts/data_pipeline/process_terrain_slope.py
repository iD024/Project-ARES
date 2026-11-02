#!/usr/bin/env python3
"""
ARES Planetary Terrain Intelligence Pipeline — Slope & Hillshade Processor
Reference: ARES Phase 06 Terrain Intelligence (WKID 104971 / Mars 2000 datum)

Derives Horn's method slope and Lambertian analytical hillshade from Mars
elevation grids, strictly incorporating Mars 2000 latitude-dependent ground
cell resolution scaling.

Datum: Mars 2000 Sphere / Ellipsoid (a = 3,396,190.0 m)
"""

import argparse
import math
import os
import sys
from typing import Tuple, Optional
import numpy as np

# Mars 2000 mean equatorial radius (meters)
MARS_RADIUS_METERS: float = 3396190.0


def calculate_mars_ground_resolution(
    lat_deg: Optional[float] = None,
    cell_deg: Optional[float] = None,
    *,
    latitude: Optional[float] = None,
    cell_size_degrees: Optional[float] = None,
) -> Tuple[float, float]:
    """
    Calculate Martian ground resolution (dx, dy) in meters for a given latitude
    and angular cell size (degrees) on the Mars 2000 datum (radius = 3,396,190 m).

    Parameters:
        lat_deg / latitude: Latitude in degrees [-90, +90]
        cell_deg / cell_size_degrees: Grid cell angular size in degrees

    Returns:
        (dx, dy): Tuple of (east-west ground resolution in meters,
                           north-south ground resolution in meters)
    """
    phi = lat_deg if lat_deg is not None else latitude
    c_deg = cell_deg if cell_deg is not None else cell_size_degrees

    if phi is None:
        phi = 0.0
    if c_deg is None:
        c_deg = 1.0

    phi_rad = math.radians(phi)
    c_rad = math.radians(c_deg)

    # North-South resolution: arc length along meridian
    dy = MARS_RADIUS_METERS * c_rad

    # East-West resolution: arc length along parallel (scaled by cos(latitude))
    dx = MARS_RADIUS_METERS * math.cos(phi_rad) * c_rad

    # Ensure dx is positive even in southern hemisphere
    return abs(dx), abs(dy)


def compute_slope_degrees(
    grid: Optional[np.ndarray] = None,
    dx: float = 1.0,
    dy: float = 1.0,
    *,
    elevation_grid: Optional[np.ndarray] = None,
) -> np.ndarray:
    """
    Derive terrain slope in degrees using Horn's 8-neighbor finite difference
    method.

    Parameters:
        grid / elevation_grid: 2D numpy array of elevation values in meters
        dx: Ground cell spacing along x-axis (East-West) in meters
        dy: Ground cell spacing along y-axis (North-South) in meters

    Returns:
        2D numpy array of slope angles in degrees [0, 90]
    """
    dem = grid if grid is not None else elevation_grid
    if dem is None:
        raise ValueError("Must provide grid or elevation_grid array")

    dem = np.asarray(dem, dtype=np.float64)
    if dem.ndim != 2:
        raise ValueError(f"Elevation grid must be 2-dimensional, got shape {dem.shape}")

    # Pad array borders using edge replication to maintain original grid dimensions
    padded = np.pad(dem, pad_width=1, mode="edge")

    # 3x3 neighborhood slices:
    # row 0 is North, row 2 is South; col 0 is West, col 2 is East
    z1 = padded[:-2, :-2]   # NW
    z2 = padded[:-2, 1:-1]  # N
    z3 = padded[:-2, 2:]    # NE
    z4 = padded[1:-1, :-2]  # W
    # z5 is center
    z6 = padded[1:-1, 2:]   # E
    z7 = padded[2:, :-2]    # SW
    z8 = padded[2:, 1:-1]   # S
    z9 = padded[2:, 2:]     # SE

    # Horn's method gradients:
    # dz/dx (East-West rate of change)
    dz_dx = ((z3 + 2.0 * z6 + z9) - (z1 + 2.0 * z4 + z7)) / (8.0 * dx)

    # dz/dy (North-South rate of change, North is +y)
    dz_dy = ((z1 + 2.0 * z2 + z3) - (z7 + 2.0 * z8 + z9)) / (8.0 * dy)

    # Slope angle in radians: theta = arctan(sqrt(p^2 + q^2))
    rise_run = np.sqrt(dz_dx**2 + dz_dy**2)
    slope_radians = np.arctan(rise_run)
    slope_degrees = np.degrees(slope_radians)

    return slope_degrees


def compute_hillshade(
    grid: Optional[np.ndarray] = None,
    dx: float = 1.0,
    dy: float = 1.0,
    azimuth_deg: float = 315.0,
    altitude_deg: float = 45.0,
    *,
    elevation_grid: Optional[np.ndarray] = None,
) -> np.ndarray:
    """
    Derive analytical Lambertian hillshade using Horn's gradients and cartographic
    solar illumination geometry.

    Parameters:
        grid / elevation_grid: 2D numpy array of elevation values in meters
        dx: East-West cell resolution in meters
        dy: North-South cell resolution in meters
        azimuth_deg: Sun azimuth angle in degrees clockwise from North (default 315 deg, NW)
        altitude_deg: Sun altitude angle above horizon in degrees (default 45 deg)

    Returns:
        2D numpy array of 8-bit shaded relief values in range [0.0, 255.0]
    """
    dem = grid if grid is not None else elevation_grid
    if dem is None:
        raise ValueError("Must provide grid or elevation_grid array")

    dem = np.asarray(dem, dtype=np.float64)
    if dem.ndim != 2:
        raise ValueError(f"Elevation grid must be 2-dimensional, got shape {dem.shape}")

    padded = np.pad(dem, pad_width=1, mode="edge")

    z1 = padded[:-2, :-2]
    z2 = padded[:-2, 1:-1]
    z3 = padded[:-2, 2:]
    z4 = padded[1:-1, :-2]
    z6 = padded[1:-1, 2:]
    z7 = padded[2:, :-2]
    z8 = padded[2:, 1:-1]
    z9 = padded[2:, 2:]

    # Horn gradients
    dz_dx = ((z3 + 2.0 * z6 + z9) - (z1 + 2.0 * z4 + z7)) / (8.0 * dx)
    # North is row 0 (top), South is row H-1 (bottom)
    dz_dy_north = ((z1 + 2.0 * z2 + z3) - (z7 + 2.0 * z8 + z9)) / (8.0 * dy)

    # Illumination geometry
    alt_rad = math.radians(altitude_deg)
    zenith_rad = math.radians(90.0 - altitude_deg)

    # Cartographic azimuth conversion to polar math angle
    azimuth_math = 360.0 - azimuth_deg + 90.0
    if azimuth_math >= 360.0:
        azimuth_math -= 360.0
    azimuth_rad = math.radians(azimuth_math)

    # Slope angle
    slope_rad = np.arctan(np.sqrt(dz_dx**2 + dz_dy_north**2))

    # Aspect in cartographic coordinate frame
    # (q_esri = -dz_dy_north because ESRI index y increases downward)
    aspect_rad = np.arctan2(-dz_dy_north, -dz_dx)
    aspect_rad = np.where(aspect_rad < 0, aspect_rad + 2.0 * np.pi, aspect_rad)

    # Lambertian cosine of solar incidence angle
    cos_inc = (
        math.sin(alt_rad) * np.cos(slope_rad)
        + math.cos(alt_rad) * np.sin(slope_rad) * np.cos(azimuth_rad - aspect_rad)
    )

    # Hillshade mapped to [0, 255]
    hillshade = 255.0 * np.clip(cos_inc, 0.0, 1.0)
    return hillshade


def generate_synthetic_mars_dem(shape: Tuple[int, int] = (200, 200)) -> np.ndarray:
    """
    Generate a synthetic Martian impact crater DEM with central peak, crater floor,
    terraced rim, and ejecta blanket for testing and verification.
    """
    rows, cols = shape
    y, x = np.ogrid[:rows, :cols]
    cy, cx = rows / 2.0, cols / 2.0
    r = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (min(rows, cols) * 0.4)

    # Base plateau elevation: -1500 m (e.g. Chryse Planitia)
    elevation = np.full(shape, -1500.0, dtype=np.float64)

    # Rim: raised circular ridge at r ~ 1.0
    rim = 800.0 * np.exp(-((r - 1.0) ** 2) / 0.04)
    # Cavity: depression inside rim r < 1.0
    cavity = -1200.0 * (1.0 - np.clip(r, 0.0, 1.0) ** 2)
    # Central peak: elevation resurgence at r < 0.2
    central_peak = 600.0 * np.exp(-(r**2) / 0.015)
    # Gentle ejecta slope outside rim
    ejecta = 300.0 * np.exp(-(r - 1.0) / 0.5) * (r >= 1.0)

    elevation += rim + cavity + central_peak + ejecta
    return elevation


def print_reproducible_gdal_commands(
    input_path: str,
    output_slope: str,
    output_hillshade: str,
    dx_meters: float,
    cell_size_deg: float,
    azimuth: float = 315.0,
    altitude: float = 45.0,
):
    """
    Print the reproducible GDAL command-line instructions for planetary rasters.
    """
    # Scale factor converts elevation units (meters) to horizontal units (degrees)
    # GDAL requires: scale = meters_per_degree
    scale = dx_meters / cell_size_deg if cell_size_deg > 0 else 59274.7

    print("\n" + "=" * 72)
    print("REPRODUCIBLE GDAL DEM COMMANDS (Mars 2000 WKID 104971):")
    print("=" * 72)
    print(f"# Calculate slope with latitude-corrected scale factor:")
    print(f"gdaldem slope {input_path} {output_slope} -s {scale:.3f} -compute_edges")
    print(f"\n# Calculate analytical shaded relief:")
    print(
        f"gdaldem hillshade {input_path} {output_hillshade} "
        f"-z 1.0 -s {scale:.3f} -az {azimuth} -alt {altitude} -compute_edges"
    )
    print("=" * 72 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="ARES Mars Terrain Slope & Hillshade Pipeline (Mars 2000 Datum / Horn Method)"
    )
    parser.add_argument(
        "--input",
        "-i",
        type=str,
        help="Path to input elevation raster (.npy, .csv, or GeoTIFF)",
    )
    parser.add_argument(
        "--output-slope",
        "-s",
        type=str,
        help="Path to save computed slope raster (.npy or .csv)",
    )
    parser.add_argument(
        "--output-hillshade",
        "-hs",
        type=str,
        help="Path to save computed hillshade raster (.npy or .csv)",
    )
    parser.add_argument(
        "--lat",
        "--latitude",
        dest="latitude",
        type=float,
        default=0.0,
        help="Martian latitude for ground cell resolution correction [-90 to +90 deg] (default: 0.0)",
    )
    parser.add_argument(
        "--cell-deg",
        "--cell-size-degrees",
        dest="cell_size_deg",
        type=float,
        default=0.003374,  # ~200 m HRSC-MOLA resolution at equator
        help="Cell angular size in degrees (default: 0.003374 ~= 200m DEM)",
    )
    parser.add_argument(
        "--azimuth",
        type=float,
        default=315.0,
        help="Sun illumination azimuth angle in degrees clockwise from North (default: 315.0)",
    )
    parser.add_argument(
        "--altitude",
        type=float,
        default=45.0,
        help="Sun illumination altitude angle above horizon in degrees (default: 45.0)",
    )
    parser.add_argument(
        "--synthetic",
        action="store_true",
        help="Generate synthetic Martian impact crater DEM when no input is provided",
    )

    args = parser.parse_args()

    # Calculate Mars 2000 ground resolution
    dx, dy = calculate_mars_ground_resolution(args.latitude, args.cell_size_deg)
    print(f"[ARES Pipeline] Mars 2000 Geodesy Datum (a = {MARS_RADIUS_METERS:.1f} m)")
    print(f"[ARES Pipeline] Latitude: {args.latitude:.2f} deg | Cell Size: {args.cell_size_deg:.6f} deg")
    print(f"[ARES Pipeline] True Ground Resolution: dx = {dx:.2f} m, dy = {dy:.2f} m")

    # Load or generate elevation grid
    if args.input and os.path.exists(args.input):
        print(f"[ARES Pipeline] Loading elevation raster: {args.input}")
        if args.input.endswith(".npy"):
            dem = np.load(args.input)
        elif args.input.endswith(".csv") or args.input.endswith(".txt"):
            dem = np.loadtxt(args.input, delimiter=",")
        else:
            try:
                import rasterio
                with rasterio.open(args.input) as src:
                    dem = src.read(1)
            except ImportError:
                print(f"[Error] rasterio not installed; cannot read non-numpy raster {args.input}", file=sys.stderr)
                sys.exit(1)
    elif args.synthetic or not args.input:
        print("[ARES Pipeline] Generating synthetic 200x200 Martian impact crater DEM...")
        dem = generate_synthetic_mars_dem((200, 200))
    else:
        print(f"[Error] Specified input file not found: {args.input}", file=sys.stderr)
        sys.exit(1)

    print(f"[ARES Pipeline] DEM Shape: {dem.shape} | Min Elev: {np.min(dem):.1f} m | Max Elev: {np.max(dem):.1f} m")

    # Compute Slope
    slope = compute_slope_degrees(dem, dx=dx, dy=dy)
    print(f"[ARES Pipeline] Slope Computed | Min: {np.min(slope):.2f}° | Max: {np.max(slope):.2f}° | Mean: {np.mean(slope):.2f}°")

    # Compute Hillshade
    hillshade = compute_hillshade(
        dem, dx=dx, dy=dy, azimuth_deg=args.azimuth, altitude_deg=args.altitude
    )
    print(f"[ARES Pipeline] Hillshade Computed (az={args.azimuth}°, alt={args.altitude}°) | Mean Intensity: {np.mean(hillshade):.1f}/255")

    # Save outputs
    if args.output_slope:
        os.makedirs(os.path.dirname(os.path.abspath(args.output_slope)), exist_ok=True)
        if args.output_slope.endswith(".csv"):
            np.savetxt(args.output_slope, slope, delimiter=",", fmt="%.3f")
        else:
            np.save(args.output_slope, slope)
        print(f"[ARES Pipeline] Slope raster saved to: {args.output_slope}")

    if args.output_hillshade:
        os.makedirs(os.path.dirname(os.path.abspath(args.output_hillshade)), exist_ok=True)
        if args.output_hillshade.endswith(".csv"):
            np.savetxt(args.output_hillshade, hillshade, delimiter=",", fmt="%.2f")
        else:
            np.save(args.output_hillshade, hillshade)
        print(f"[ARES Pipeline] Hillshade raster saved to: {args.output_hillshade}")

    # Output GDAL reproduction notes
    in_name = args.input if args.input else "mars_elevation.tif"
    out_s = args.output_slope if args.output_slope else "mars_slope.tif"
    out_hs = args.output_hillshade if args.output_hillshade else "mars_hillshade.tif"
    print_reproducible_gdal_commands(in_name, out_s, out_hs, dx, args.cell_size_deg, args.azimuth, args.altitude)


if __name__ == "__main__":
    main()
