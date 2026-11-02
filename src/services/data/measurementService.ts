/**
 * ARES Mars 2000 Geodesic Measurement & Elevation Transect Engine
 *
 * Implements high-precision great-circle distance, spherical polygon surface area,
 * and elevation transect cross-sections strictly referencing the Mars 2000 datum
 * (D_Mars_2000, WKID 104905 / 104971, R = 3,396,190 m).
 */

import { MARS_RADIUS_METERS, calculateMarsGroundDistance } from './marsGeodesyService.ts';
import { queryPointElevation } from './terrainElevationService.ts';

export interface GeodesicCoordinate {
  lon: number;
  lat: number;
}

export interface GeodesicDistanceResult {
  totalMeters: number;
  totalKm: number;
  segments: number[]; // meters per segment
}

export interface PolygonAreaResult {
  areaSquareMeters: number;
  areaSquareKm: number;
  areaHectares: number;
}

export interface ElevationTransectPoint {
  fraction: number; // 0.0 to 1.0
  distanceKm: number;
  longitude: number;
  latitude: number;
  elevationMeters: number;
}

export interface ElevationTransectResult {
  points: ElevationTransectPoint[];
  totalDistanceKm: number;
  minElevationMeters: number;
  maxElevationMeters: number;
  elevationChangeMeters: number;
  averageSlopeDegrees: number;
}

/**
 * Normalizes longitude to [0, 360) degrees.
 */
function normalizeLon(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

/**
 * Calculates cumulative geodesic distance across an ordered array of Martian coordinates.
 */
export function calculateMarsGeodesicDistance(points: GeodesicCoordinate[]): GeodesicDistanceResult {
  if (!points || points.length < 2) {
    return {
      totalMeters: 0,
      totalKm: 0,
      segments: [],
    };
  }

  const segments: number[] = [];
  let totalMeters = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segDist = calculateMarsGroundDistance(p1.lon, p1.lat, p2.lon, p2.lat);
    segments.push(segDist);
    totalMeters += segDist;
  }

  const totalKm = Math.round((totalMeters / 1000) * 100) / 100;

  return {
    totalMeters,
    totalKm,
    segments,
  };
}

/**
 * Calculates spherical polygon surface area on the Mars 2000 datum using spherical excess.
 */
export function calculateMarsPolygonArea(vertices: GeodesicCoordinate[]): PolygonAreaResult {
  if (!vertices || vertices.length < 3) {
    return {
      areaSquareMeters: 0,
      areaSquareKm: 0,
      areaHectares: 0,
    };
  }

  // Convert vertices to radians
  const coordsRad = vertices.map((v) => ({
    lon: (normalizeLon(v.lon) * Math.PI) / 180,
    lat: (Math.max(-89.99, Math.min(89.99, v.lat)) * Math.PI) / 180,
  }));

  // Ensure closed polygon
  const n = coordsRad.length;
  let totalExcess = 0;

  for (let i = 0; i < n; i++) {
    const p1 = coordsRad[i];
    const p2 = coordsRad[(i + 1) % n];

    // Spherical excess component: (lambda2 - lambda1) * (2 + sin(phi1) + sin(phi2))
    let dLon = p2.lon - p1.lon;
    if (dLon > Math.PI) dLon -= 2 * Math.PI;
    if (dLon < -Math.PI) dLon += 2 * Math.PI;

    totalExcess += dLon * (Math.sin(p1.lat) + Math.sin(p2.lat));
  }

  // Area = (R^2 / 2) * |totalExcess|
  const areaSquareMeters = Math.abs((MARS_RADIUS_METERS * MARS_RADIUS_METERS * totalExcess) / 2);
  const areaSquareKm = Math.round((areaSquareMeters / 1_000_000) * 100) / 100;
  const areaHectares = Math.round((areaSquareMeters / 10_000) * 100) / 100;

  return {
    areaSquareMeters,
    areaSquareKm,
    areaHectares,
  };
}

/**
 * Generates an elevation transect cross-section between two Martian points.
 * Linearly interpolates coordinates and queries spot elevation along the profile.
 */
export async function generateElevationTransect(
  start: GeodesicCoordinate,
  end: GeodesicCoordinate,
  sampleCount: number = 30,
  elevationLayerInstance?: any
): Promise<ElevationTransectResult> {
  const count = Math.max(2, Math.min(100, sampleCount));
  const totalMeters = calculateMarsGroundDistance(start.lon, start.lat, end.lon, end.lat);
  const totalDistanceKm = Math.round((totalMeters / 1000) * 10) / 10;

  const startLon = normalizeLon(start.lon);
  let endLon = normalizeLon(end.lon);

  // Shortest path around 360 meridian
  if (Math.abs(endLon - startLon) > 180) {
    if (endLon > startLon) endLon -= 360;
    else endLon += 360;
  }

  const points: ElevationTransectPoint[] = [];
  let minElev = Infinity;
  let maxElev = -Infinity;

  for (let i = 0; i < count; i++) {
    const fraction = i / (count - 1);
    const lon = normalizeLon(startLon + (endLon - startLon) * fraction);
    const lat = start.lat + (end.lat - start.lat) * fraction;
    const distanceKm = Math.round(totalDistanceKm * fraction * 10) / 10;

    const elev = await queryPointElevation(lon, lat, elevationLayerInstance);
    if (elev < minElev) minElev = elev;
    if (elev > maxElev) maxElev = elev;

    points.push({
      fraction,
      distanceKm,
      longitude: Number(lon.toFixed(4)),
      latitude: Number(lat.toFixed(4)),
      elevationMeters: elev,
    });
  }

  const elevationChangeMeters = Math.abs(points[points.length - 1].elevationMeters - points[0].elevationMeters);
  const slopeGradient = totalMeters > 0 ? elevationChangeMeters / totalMeters : 0;
  const averageSlopeDegrees = Math.round(((Math.atan(slopeGradient) * 180) / Math.PI) * 10) / 10;

  return {
    points,
    totalDistanceKm,
    minElevationMeters: minElev === Infinity ? 0 : minElev,
    maxElevationMeters: maxElev === -Infinity ? 0 : maxElev,
    elevationChangeMeters,
    averageSlopeDegrees,
  };
}

