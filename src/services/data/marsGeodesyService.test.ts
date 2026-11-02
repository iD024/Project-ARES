import { describe, it, expect } from 'vitest';
import {
  MARS_RADIUS_METERS,
  REGIONAL_SLOPE_DISCLAIMER,
  calculateMarsGroundDistance,
  calculateMarsLongitudeDegreeDistance,
  calculateSlopeAngle,
  classifyRegionalSlope,
  estimateMarsElevationProfileSlope,
} from './marsGeodesyService.ts';

describe('Mars Geodesy Service', () => {
  describe('Planetary Geodetic Constants', () => {
    it('uses Mars 2000 equatorial radius of 3,396,190 meters', () => {
      expect(MARS_RADIUS_METERS).toBe(3396190);
    });

    it('defines mandatory scientific disclaimer for regional DEM gradients', () => {
      expect(REGIONAL_SLOPE_DISCLAIMER).toBe(
        'Regional terrain gradient derived from 200m DEM. Not suitable for rover-scale obstacle navigation.'
      );
    });
  });

  describe('calculateMarsGroundDistance', () => {
    it('calculates Mars equatorial ground distance for 1 degree longitude (~59.27 km)', () => {
      const distance = calculateMarsGroundDistance(0, 0, 1, 0);
      // Theoretical: 2 * PI * 3396190 / 360 = 59,274.6975 m
      expect(distance).toBeCloseTo(59274.7, 0);
      expect(distance / 1000).toBeCloseTo(59.27, 1);
    });

    it('scales ground distance with latitude at 60 deg N (cos(60) = 0.5, ~29.64 km)', () => {
      const distanceAt60N = calculateMarsGroundDistance(0, 60, 1, 60);
      // Great-circle arc at 60 deg lat between lon 0 and lon 1 is ~29637 m
      expect(distanceAt60N / 1000).toBeCloseTo(29.64, 1);
      expect(distanceAt60N).toBeCloseTo(29637.1, 0);

      // Verify degree length helper matches cos(lat) scaling
      const degreeScaleAt60 = calculateMarsLongitudeDegreeDistance(60);
      expect(degreeScaleAt60 / 1000).toBeCloseTo(29.64, 1);
      expect(degreeScaleAt60).toBeCloseTo(
        calculateMarsLongitudeDegreeDistance(0) * 0.5,
        1
      );
    });

    it('calculates great-circle distance accurately along meridians', () => {
      // 1 degree latitude along meridian is 59,274.7 m everywhere on sphere
      const dist1DegLat = calculateMarsGroundDistance(0, 0, 0, 1);
      expect(dist1DegLat).toBeCloseTo(59274.7, 0);

      // Quarter-sphere (90 degrees latitude from equator to pole)
      const distToPole = calculateMarsGroundDistance(0, 0, 0, 90);
      const expectedQuarterCircumference = (Math.PI / 2) * MARS_RADIUS_METERS;
      expect(distToPole).toBeCloseTo(expectedQuarterCircumference, 0);
    });

    it('handles identical points and zero distance', () => {
      const dist = calculateMarsGroundDistance(77.45, 18.38, 77.45, 18.38);
      expect(dist).toBe(0);
    });

    it('handles antimeridian crossing and longitude wrapping', () => {
      // From 179.5 to -179.5 (or 180.5) is 1 degree across antimeridian
      const distAntimeridian = calculateMarsGroundDistance(179.5, 0, -179.5, 0);
      expect(distAntimeridian / 1000).toBeCloseTo(59.27, 1);

      // 0 to 360 representation
      const distWrapping = calculateMarsGroundDistance(359.5, 0, 0.5, 0);
      expect(distWrapping / 1000).toBeCloseTo(59.27, 1);
    });

    it('calculates realistic distance between Jezero Crater and Gale Crater', () => {
      // Jezero: 77.45° E, 18.38° N
      // Gale: 137.44° E, -4.59° N
      const distJezeroGale = calculateMarsGroundDistance(77.45, 18.38, 137.44, -4.59);
      // Great circle angular distance ~ 62.4 degrees -> ~3,699 km
      expect(distJezeroGale / 1000).toBeGreaterThan(3600);
      expect(distJezeroGale / 1000).toBeLessThan(3800);
    });
  });

  describe('calculateSlopeAngle', () => {
    it('computes 0 degrees for flat horizontal terrain', () => {
      expect(calculateSlopeAngle(0, 1000)).toBe(0);
    });

    it('computes 45 degrees when elevation change equals horizontal distance', () => {
      expect(calculateSlopeAngle(100, 100)).toBeCloseTo(45, 4);
      expect(calculateSlopeAngle(-100, 100)).toBeCloseTo(45, 4);
    });

    it('computes 30 degrees for tan(30) gradient', () => {
      const dz = 1000 * Math.tan((30 * Math.PI) / 180);
      expect(calculateSlopeAngle(dz, 1000)).toBeCloseTo(30, 4);
    });

    it('handles zero or negative horizontal distance safely without throwing or NaN', () => {
      expect(calculateSlopeAngle(50, 0)).toBe(0);
      expect(calculateSlopeAngle(50, -10)).toBe(0);
      expect(calculateSlopeAngle(0, 0)).toBe(0);
    });

    it('supports signed slope angle when requested', () => {
      expect(calculateSlopeAngle(100, 100, { signed: true })).toBeCloseTo(45, 4);
      expect(calculateSlopeAngle(-100, 100, { signed: true })).toBeCloseTo(-45, 4);
    });
  });

  describe('classifyRegionalSlope', () => {
    it('classifies FLAT slopes (0 to 2 deg) for smooth plains / mare', () => {
      const c1 = classifyRegionalSlope(0);
      expect(c1.category).toBe('FLAT');
      expect(c1.description.toLowerCase()).toContain('smooth plains / mare');
      expect(c1.disclaimer).toBe(REGIONAL_SLOPE_DISCLAIMER);

      const c2 = classifyRegionalSlope(1.5);
      expect(c2.category).toBe('FLAT');
    });

    it('classifies GENTLE slopes (2 to 5 deg) for low rolling terrain', () => {
      const c1 = classifyRegionalSlope(2.0);
      expect(c1.category).toBe('GENTLE');
      expect(c1.description.toLowerCase()).toContain('low rolling terrain');

      const c2 = classifyRegionalSlope(4.99);
      expect(c2.category).toBe('GENTLE');
    });

    it('classifies MODERATE slopes (5 to 15 deg) for crater walls / rolling hills', () => {
      const c1 = classifyRegionalSlope(5.0);
      expect(c1.category).toBe('MODERATE');
      expect(c1.description.toLowerCase()).toContain('crater walls / rolling hills');

      const c2 = classifyRegionalSlope(14.5);
      expect(c2.category).toBe('MODERATE');
    });

    it('classifies STEEP slopes (15 to 25 deg) for canyon rims / mountain slopes', () => {
      const c1 = classifyRegionalSlope(15.0);
      expect(c1.category).toBe('STEEP');
      expect(c1.description.toLowerCase()).toContain('canyon rims / mountain slopes');

      const c2 = classifyRegionalSlope(24.9);
      expect(c2.category).toBe('STEEP');
    });

    it('classifies PRECIPITOUS slopes (>25 deg) for chasmata escarpments / volcanic calderas', () => {
      const c1 = classifyRegionalSlope(25.0);
      expect(c1.category).toBe('PRECIPITOUS');
      expect(c1.description.toLowerCase()).toContain('chasmata escarpments / volcanic calderas');

      const c2 = classifyRegionalSlope(60.0);
      expect(c2.category).toBe('PRECIPITOUS');
    });

    it('handles negative angles by using magnitude', () => {
      const c = classifyRegionalSlope(-18.5);
      expect(c.category).toBe('STEEP');
      expect(c.angleDegrees).toBe(18.5);
    });
  });

  describe('estimateMarsElevationProfileSlope', () => {
    it('returns empty profile summary for zero or single points', () => {
      const emptyResult = estimateMarsElevationProfileSlope([]);
      expect(emptyResult.averageSlopeDegrees).toBe(0);
      expect(emptyResult.maxSlopeDegrees).toBe(0);
      expect(emptyResult.dominantClassification.category).toBe('FLAT');
      expect(emptyResult.segments).toHaveLength(0);
      expect(emptyResult.disclaimer).toBe(REGIONAL_SLOPE_DISCLAIMER);

      const singlePoint = estimateMarsElevationProfileSlope([{ elevation: -2500, distanceMeters: 0 }]);
      expect(singlePoint.segments).toHaveLength(0);
      expect(singlePoint.averageSlopeDegrees).toBe(0);
    });

    it('computes segment and profile slopes for flat terrain', () => {
      const points = [
        { elevation: -2500, distanceMeters: 0 },
        { elevation: -2500, distanceMeters: 1000 },
        { elevation: -2500, distanceMeters: 2000 },
      ];

      const profile = estimateMarsElevationProfileSlope(points);
      expect(profile.averageSlopeDegrees).toBe(0);
      expect(profile.maxSlopeDegrees).toBe(0);
      expect(profile.dominantClassification.category).toBe('FLAT');
      expect(profile.segments).toHaveLength(2);
      expect(profile.segments[0].slopeDegrees).toBe(0);
      expect(profile.segments[0].classification.category).toBe('FLAT');
    });

    it('computes transect crossing Valles Marineris canyon wall with precipitous slope', () => {
      const points = [
        { elevation: -1000, distanceMeters: 0 },
        { elevation: -1100, distanceMeters: 2000 }, // Gentle descent: dz = 100, dist = 2000 -> tan = 0.05 -> ~2.86 deg
        { elevation: -4500, distanceMeters: 6000 }, // Canyon drop: dz = 3400, dist = 4000 -> tan = 0.85 -> ~40.36 deg
        { elevation: -4520, distanceMeters: 8000 }, // Floor: dz = 20, dist = 2000 -> tan = 0.01 -> ~0.57 deg
      ];

      const profile = estimateMarsElevationProfileSlope(points);
      expect(profile.segments).toHaveLength(3);

      expect(profile.segments[0].classification.category).toBe('GENTLE');
      expect(profile.segments[1].classification.category).toBe('PRECIPITOUS');
      expect(profile.segments[2].classification.category).toBe('FLAT');

      expect(profile.maxSlopeDegrees).toBeCloseTo(40.36, 1);
      expect(profile.maxClassification.category).toBe('PRECIPITOUS');
      expect(profile.disclaimer).toBe(REGIONAL_SLOPE_DISCLAIMER);
    });
  });
});
