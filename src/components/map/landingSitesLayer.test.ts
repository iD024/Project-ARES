import { describe, it, expect } from 'vitest';
import { createLandingSiteGraphicsData } from './landingSitesLayer.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';

describe('Landing Sites 3D Graphics Layer', () => {
  it('creates graphic specifications for all verified Mars landing sites', () => {
    const graphicsData = createLandingSiteGraphicsData();
    expect(graphicsData.length).toBe(MARS_LANDING_SITES.length);

    const perseverance = graphicsData.find((g) => g.attributes.siteId === 'perseverance');
    expect(perseverance).toBeDefined();
    expect(perseverance?.geometry.x).toBeCloseTo(77.45, 1);
    expect(perseverance?.geometry.y).toBeCloseTo(18.38, 1);
    expect(perseverance?.geometry.spatialReference.wkid).toBe(104971);
    expect(perseverance?.attributes.name).toBe('Perseverance (Jezero Crater)');
  });
});

