import { describe, it, expect } from 'vitest';
import {
  calculateMarsGeodesicDistance,
  calculateMarsPolygonArea,
  generateElevationTransect,
} from './measurementService.ts';

describe('Mars 2000 Geodesic Measurement Service', () => {
  describe('calculateMarsGeodesicDistance', () => {
    it('returns zero distance for fewer than 2 points', () => {
      expect(calculateMarsGeodesicDistance([]).totalMeters).toBe(0);
      expect(calculateMarsGeodesicDistance([{ lon: 0, lat: 0 }]).totalMeters).toBe(0);
      expect(calculateMarsGeodesicDistance([{ lon: 0, lat: 0 }]).segments).toEqual([]);
    });

    it('calculates accurate Mars equatorial 1-degree distance (~59.28 km)', () => {
      // 1 degree along Mars equator (R = 3,396,190 m)
      // d = 3396190 * (pi / 180) ≈ 59275.6 m = 59.28 km
      const result = calculateMarsGeodesicDistance([
        { lon: 0, lat: 0 },
        { lon: 1, lat: 0 },
      ]);

      expect(result.totalMeters).toBeCloseTo(59275.6, -1);
      expect(result.totalKm).toBeCloseTo(59.28, 1);
      expect(result.segments.length).toBe(1);
      expect(result.segments[0]).toBeCloseTo(59275.6, -1);
    });

    it('handles meridian-spanning multi-segment paths correctly', () => {
      const result = calculateMarsGeodesicDistance([
        { lon: 359, lat: 0 },
        { lon: 0, lat: 0 },
        { lon: 1, lat: 0 },
      ]);

      expect(result.segments.length).toBe(2);
      expect(result.totalKm).toBeCloseTo(118.55, 0);
    });

    it('calculates realistic distance between Olympus Mons and Jezero Crater', () => {
      // Olympus Mons: ~226.2°E, 18.65°N
      // Jezero Crater: ~77.45°E, 18.38°N
      // Angular difference ~148.75° -> Great-circle distance approx 8,800 km on Mars
      const result = calculateMarsGeodesicDistance([
        { lon: 226.2, lat: 18.65 },
        { lon: 77.45, lat: 18.38 },
      ]);

      expect(result.totalKm).toBeGreaterThan(7000);
      expect(result.totalKm).toBeLessThan(8500);
    });
  });

  describe('calculateMarsPolygonArea', () => {
    it('returns 0 for fewer than 3 vertices', () => {
      expect(calculateMarsPolygonArea([]).areaSquareKm).toBe(0);
      expect(calculateMarsPolygonArea([{ lon: 0, lat: 0 }, { lon: 1, lat: 1 }]).areaSquareKm).toBe(0);
    });

    it('calculates spherical area for a 1-degree equatorial square on Mars', () => {
      // 1° x 1° square at Mars equator: Area ≈ 3,513 km²
      const vertices = [
        { lon: 0, lat: 0 },
        { lon: 1, lat: 0 },
        { lon: 1, lat: 1 },
        { lon: 0, lat: 1 },
      ];

      const result = calculateMarsPolygonArea(vertices);
      expect(result.areaSquareKm).toBeGreaterThan(3400);
      expect(result.areaSquareKm).toBeLessThan(3600);
      expect(result.areaHectares).toBeCloseTo(result.areaSquareKm * 100, -2);
    });
  });

  describe('generateElevationTransect', () => {
    it('generates an interpolated elevation profile between two coordinates', async () => {
      const start = { lon: 77.0, lat: 18.0 };
      const end = { lon: 78.0, lat: 18.5 };

      const result = await generateElevationTransect(start, end, 10);

      expect(result.points.length).toBe(10);
      expect(result.totalDistanceKm).toBeGreaterThan(0);
      expect(result.points[0].fraction).toBe(0);
      expect(result.points[9].fraction).toBe(1);
      expect(result.minElevationMeters).toBeLessThanOrEqual(result.maxElevationMeters);
      expect(typeof result.averageSlopeDegrees).toBe('number');
    });
  });
});
