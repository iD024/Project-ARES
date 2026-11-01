import { describe, it, expect } from 'vitest';
import {
  evaluateLayerStatus,
  normalizeLongitude180,
  normalizeLongitude360,
  isPointInExtent,
  isScaleActive,
  LayerResolutionTarget,
  BoundingBox,
} from './layerResolutionService.ts';

describe('layerResolutionService', () => {
  describe('normalizeLongitude', () => {
    it('normalizes longitudes to [-180, 180]', () => {
      expect(normalizeLongitude180(0)).toBe(0);
      expect(normalizeLongitude180(180)).toBe(180);
      expect(normalizeLongitude180(-180)).toBe(-180);
      expect(normalizeLongitude180(270)).toBe(-90);
      expect(normalizeLongitude180(-270)).toBe(90);
      expect(normalizeLongitude180(360)).toBe(0);
      expect(normalizeLongitude180(77.45)).toBeCloseTo(77.45, 4);
      expect(normalizeLongitude180(437.45)).toBeCloseTo(77.45, 4);
    });

    it('normalizes longitudes to [0, 360]', () => {
      expect(normalizeLongitude360(0)).toBe(0);
      expect(normalizeLongitude360(180)).toBe(180);
      expect(normalizeLongitude360(-90)).toBe(270);
      expect(normalizeLongitude360(-180)).toBe(180);
      expect(normalizeLongitude360(360)).toBe(0);
      expect(normalizeLongitude360(720)).toBe(0);
      expect(normalizeLongitude360(-100)).toBe(260);
    });
  });

  describe('isPointInExtent', () => {
    it('detects point inside standard bounding box', () => {
      const extent: BoundingBox = {
        minLon: 70,
        maxLon: 85,
        minLat: 10,
        maxLat: 25,
      };

      expect(isPointInExtent({ longitude: 77.45, latitude: 18.38 }, extent)).toBe(true);
      expect(isPointInExtent({ longitude: 90, latitude: 18.38 }, extent)).toBe(false);
      expect(isPointInExtent({ longitude: 77.45, latitude: 30 }, extent)).toBe(false);
    });

    it('handles global planetary extents', () => {
      const globalExtent180: BoundingBox = {
        minLon: -180,
        maxLon: 180,
        minLat: -90,
        maxLat: 90,
      };
      expect(isPointInExtent({ longitude: 0, latitude: 0 }, globalExtent180)).toBe(true);
      expect(isPointInExtent({ longitude: -150, latitude: 45 }, globalExtent180)).toBe(true);

      const globalExtent360: BoundingBox = {
        minLon: 0,
        maxLon: 360,
        minLat: -90,
        maxLat: 90,
      };
      expect(isPointInExtent({ longitude: -100, latitude: -20 }, globalExtent360)).toBe(true);
    });

    it('evaluates Martian longitude representation bridging ([-180, 180] vs [0, 360])', () => {
      // Extent defined in [0, 360] east-positive (Olympus Mons region around 225-235E)
      const olympusMons360: BoundingBox = {
        minLon: 220,
        maxLon: 240,
        minLat: 10,
        maxLat: 25,
      };

      // Center provided in [-180, 180]: 230 deg E is -130 deg
      expect(isPointInExtent({ longitude: -130, latitude: 18.65 }, olympusMons360)).toBe(true);
      // Outside
      expect(isPointInExtent({ longitude: -100, latitude: 18.65 }, olympusMons360)).toBe(false);

      // Extent defined in [-180, 180]
      const extent180: BoundingBox = {
        minLon: -140,
        maxLon: -120,
        minLat: 10,
        maxLat: 25,
      };
      // Center provided in [0, 360]: 230 deg
      expect(isPointInExtent({ longitude: 230, latitude: 18.65 }, extent180)).toBe(true);
    });

    it('evaluates extents crossing the antimeridian / wrap boundary', () => {
      // Crossing 180 deg: 170 to -170
      const cross180: BoundingBox = {
        minLon: 170,
        maxLon: -170,
        minLat: -10,
        maxLat: 10,
      };
      expect(isPointInExtent({ longitude: 175, latitude: 0 }, cross180)).toBe(true);
      expect(isPointInExtent({ longitude: -175, latitude: 0 }, cross180)).toBe(true);
      expect(isPointInExtent({ longitude: 0, latitude: 0 }, cross180)).toBe(false);

      // Crossing 0 / 360 deg: 350 to 10
      const cross0: BoundingBox = {
        minLon: 350,
        maxLon: 10,
        minLat: -10,
        maxLat: 10,
      };
      expect(isPointInExtent({ longitude: 355, latitude: 0 }, cross0)).toBe(true);
      expect(isPointInExtent({ longitude: 5, latitude: 0 }, cross0)).toBe(true);
      expect(isPointInExtent({ longitude: -5, latitude: 0 }, cross0)).toBe(true);
      expect(isPointInExtent({ longitude: 180, latitude: 0 }, cross0)).toBe(false);
    });
  });

  describe('isScaleActive', () => {
    it('returns true when currentScale is within bounds', () => {
      expect(isScaleActive(500_000, 2_000_000, 100_000)).toBe(true);
      expect(isScaleActive(2_000_000, 2_000_000, 100_000)).toBe(true);
      expect(isScaleActive(100_000, 2_000_000, 100_000)).toBe(true);
    });

    it('returns false when zoomed out too far (currentScale > minScale)', () => {
      expect(isScaleActive(5_000_000, 2_000_000, 100_000)).toBe(false);
    });

    it('returns false when zoomed in past layer resolution (currentScale < maxScale)', () => {
      expect(isScaleActive(50_000, 2_000_000, 100_000)).toBe(false);
    });

    it('handles undefined or 0 bounds without restriction', () => {
      expect(isScaleActive(500_000, undefined, undefined)).toBe(true);
      expect(isScaleActive(500_000, 0, 0)).toBe(true);
      expect(isScaleActive(500_000, 1_000_000, undefined)).toBe(true);
      expect(isScaleActive(500_000, undefined, 100_000)).toBe(true);
    });
  });

  describe('evaluateLayerStatus', () => {
    const baseLayer: LayerResolutionTarget = {
      id: 'test-layer',
      minScale: 2_000_000,
      maxScale: 100_000,
      extent: {
        minLon: 70,
        maxLon: 80,
        minLat: 15,
        maxLat: 25,
      },
      healthStatus: 'ONLINE',
    };

    it('returns ACTIVE when scale and extent match and layer is online', () => {
      const status = evaluateLayerStatus(baseLayer, 500_000, {
        longitude: 77.45,
        latitude: 18.38,
      });
      expect(status).toBe('ACTIVE');
    });

    it('returns OFFLINE when healthStatus is OFFLINE regardless of scale/extent', () => {
      const offlineLayer: LayerResolutionTarget = {
        ...baseLayer,
        healthStatus: 'OFFLINE',
      };
      const status = evaluateLayerStatus(offlineLayer, 500_000, {
        longitude: 77.45,
        latitude: 18.38,
      });
      expect(status).toBe('OFFLINE');
    });

    it('returns SCALE_INACTIVE when currentScale is zoomed out beyond minScale', () => {
      const status = evaluateLayerStatus(baseLayer, 10_000_000, {
        longitude: 77.45,
        latitude: 18.38,
      });
      expect(status).toBe('SCALE_INACTIVE');
    });

    it('returns SCALE_INACTIVE when currentScale is zoomed in beyond maxScale', () => {
      const status = evaluateLayerStatus(baseLayer, 50_000, {
        longitude: 77.45,
        latitude: 18.38,
      });
      expect(status).toBe('SCALE_INACTIVE');
    });

    it('returns OUT_OF_EXTENT when currentCenter is outside layer bounding box', () => {
      const status = evaluateLayerStatus(baseLayer, 500_000, {
        longitude: 10.0,
        latitude: 0.0,
      });
      expect(status).toBe('OUT_OF_EXTENT');
    });

    it('prioritizes SCALE_INACTIVE over OUT_OF_EXTENT when both fail', () => {
      const status = evaluateLayerStatus(baseLayer, 10_000_000, {
        longitude: 10.0,
        latitude: 0.0,
      });
      expect(status).toBe('SCALE_INACTIVE');
    });

    it('returns ACTIVE when currentCenter is not provided and scale matches', () => {
      const status = evaluateLayerStatus(baseLayer, 500_000);
      expect(status).toBe('ACTIVE');
    });

    it('returns ACTIVE when layer has no extent specified', () => {
      const globalLayer: LayerResolutionTarget = {
        id: 'global-viking',
        minScale: 50_000_000,
        maxScale: 1_000,
      };
      const status = evaluateLayerStatus(globalLayer, 1_000_000, {
        longitude: -120,
        latitude: -45,
      });
      expect(status).toBe('ACTIVE');
    });

    it('supports DEGRADED health status as ACTIVE if network still passes data', () => {
      const degradedLayer: LayerResolutionTarget = {
        ...baseLayer,
        healthStatus: 'DEGRADED',
      };
      const status = evaluateLayerStatus(degradedLayer, 500_000, {
        longitude: 77.45,
        latitude: 18.38,
      });
      expect(status).toBe('ACTIVE');
    });
  });
});

