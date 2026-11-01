import { describe, it, expect } from 'vitest';
import { MARS_REGIONS, getRegionById, MarsRegion } from './marsRegions.ts';

describe('marsRegions configuration', () => {
  it('defines the core verified Martian scientific exploration regions', () => {
    expect(MARS_REGIONS.length).toBeGreaterThanOrEqual(5);

    const regionIds = MARS_REGIONS.map((r) => r.id);
    expect(regionIds).toContain('jezero-crater');
    expect(regionIds).toContain('gale-crater');
    expect(regionIds).toContain('olympus-mons');
    expect(regionIds).toContain('valles-marineris');
    expect(regionIds).toContain('elysium-planitia');
  });

  it('provides valid geodetic coordinates and bounding extents for each region', () => {
    MARS_REGIONS.forEach((region: MarsRegion) => {
      expect(region.id).toBeTruthy();
      expect(region.name).toBeTruthy();
      expect(region.centerLatitude).toBeGreaterThanOrEqual(-90);
      expect(region.centerLatitude).toBeLessThanOrEqual(90);
      expect(region.centerLongitude).toBeGreaterThanOrEqual(-180);
      expect(region.centerLongitude).toBeLessThanOrEqual(360);

      // Bounding box validation
      expect(region.extent.minLatitude).toBeLessThan(region.extent.maxLatitude);
      expect(region.extent.minLongitude).toBeDefined();
      expect(region.extent.maxLongitude).toBeDefined();

      // Target scale and geological features
      expect(region.targetScale).toBeGreaterThan(0);
      expect(region.geologicalFeatures.length).toBeGreaterThan(0);
    });
  });

  it('retrieves region by ID accurately with getRegionById', () => {
    const jezero = getRegionById('jezero-crater');
    expect(jezero).toBeDefined();
    expect(jezero?.name).toContain('Jezero');
    expect(jezero?.centerLatitude).toBeCloseTo(18.38, 2);
    expect(jezero?.centerLongitude).toBeCloseTo(77.45, 2);

    const nonexistent = getRegionById('unknown-region');
    expect(nonexistent).toBeUndefined();
  });
});
