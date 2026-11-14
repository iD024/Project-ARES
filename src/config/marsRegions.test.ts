import { describe, it, expect } from 'vitest';
import { MARS_REGIONS, getRegionById, findRegionAtCoordinates, MarsRegion } from './marsRegions.ts';

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
      // Valid GIS tile coordinate bounds strictly within [-180, 180]
      expect(region.centerLongitude).toBeGreaterThanOrEqual(-180);
      expect(region.centerLongitude).toBeLessThanOrEqual(180);

      // Bounding box validation
      expect(region.extent.minLatitude).toBeLessThan(region.extent.maxLatitude);
      expect(region.extent.minLongitude).toBeGreaterThanOrEqual(-180);
      expect(region.extent.maxLongitude).toBeLessThanOrEqual(180);
      expect(region.extent.minLongitude).toBeLessThan(region.extent.maxLongitude);

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

  it('dynamically resolves matching region at coordinates with findRegionAtCoordinates', () => {
    // Jezero Crater coordinates
    const jezero = findRegionAtCoordinates(77.45, 18.38);
    expect(jezero?.id).toBe('jezero-crater');

    // Olympus Mons coordinates
    const olympus = findRegionAtCoordinates(-133.8, 18.65);
    expect(olympus?.id).toBe('olympus-mons');

    // Gale Crater coordinates
    const gale = findRegionAtCoordinates(137.44, -4.59);
    expect(gale?.id).toBe('gale-crater');

    // Remote uncatalogued terrain
    const uncatalogued = findRegionAtCoordinates(10.0, 50.0);
    expect(uncatalogued).toBeUndefined();
  });
});

