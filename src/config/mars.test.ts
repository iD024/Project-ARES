import { describe, it, expect } from 'vitest';
import {
  MARS_SPATIAL_REFERENCE,
  MARS_EQUATORIAL_RADIUS_METERS,
  MARS_POLAR_RADIUS_METERS,
  MARS_LANDING_SITES,
  formatMarsCoordinates,
} from './mars.ts';

describe('Mars Geodetic Reference & Constants', () => {
  it('defines the correct IAU GCS_Mars_2000 spatial reference WKID', () => {
    expect(MARS_SPATIAL_REFERENCE.wkid).toBe(104905);
  });

  it('defines accurate Mars equatorial and polar radii', () => {
    expect(MARS_EQUATORIAL_RADIUS_METERS).toBe(3396190.0);
    expect(MARS_POLAR_RADIUS_METERS).toBe(3376200.0);
  });

  it('contains verified landing site coordinates for Perseverance and Curiosity', () => {
    const perseverance = MARS_LANDING_SITES.find(s => s.id === 'perseverance');
    const curiosity = MARS_LANDING_SITES.find(s => s.id === 'curiosity');

    expect(perseverance).toBeDefined();
    expect(perseverance?.name).toBe('Perseverance (Jezero Crater)');
    expect(perseverance?.latitude).toBeCloseTo(18.38, 1);
    expect(perseverance?.longitude).toBeCloseTo(77.45, 1);

    expect(curiosity).toBeDefined();
    expect(curiosity?.name).toBe('Curiosity (Gale Crater)');
    expect(curiosity?.latitude).toBeCloseTo(-4.59, 1);
    expect(curiosity?.longitude).toBeCloseTo(137.44, 1);

    // All landing sites must be within valid GIS tile bounds [-180, 180]
    MARS_LANDING_SITES.forEach((site) => {
      expect(site.longitude).toBeGreaterThanOrEqual(-180);
      expect(site.longitude).toBeLessThanOrEqual(180);
    });
  });

  it('formats Mars coordinates into clean planetary strings', () => {
    expect(formatMarsCoordinates(18.38, 77.45)).toBe('18.38° N, 77.45° E');
    expect(formatMarsCoordinates(-4.59, -120.5)).toBe('4.59° S, 120.50° W');
  });
});

