import { describe, it, expect } from 'vitest';
import { MARS_LANDMARKS, getLandmarkById } from './marsLandmarks.ts';
import { MARS_LANDING_SITES } from './mars.ts';

describe('Mars Expanded Landmarks and Landing Sites', () => {
  it('contains at least 12 verified Martian landing sites in MARS_LANDING_SITES', () => {
    expect(MARS_LANDING_SITES.length).toBeGreaterThanOrEqual(12);
    const siteIds = MARS_LANDING_SITES.map((s) => s.id);
    expect(siteIds).toContain('perseverance');
    expect(siteIds).toContain('curiosity');
    expect(siteIds).toContain('zhurong');
    expect(siteIds).toContain('phoenix');
    expect(siteIds).toContain('viking1');
    expect(siteIds).toContain('pathfinder');
  });

  it('contains at least 10 major Martian geographical wonders in MARS_LANDMARKS', () => {
    expect(MARS_LANDMARKS.length).toBeGreaterThanOrEqual(10);
    const landmarkIds = MARS_LANDMARKS.map((l) => l.id);
    expect(landmarkIds).toContain('olympus-mons');
    expect(landmarkIds).toContain('valles-marineris');
    expect(landmarkIds).toContain('hellas-planitia');
    expect(landmarkIds).toContain('cydonia-mensae');
  });

  it('validates every landmark contains verified coordinates, elevation, and rich science text', () => {
    MARS_LANDMARKS.forEach((landmark) => {
      expect(landmark.id).toBeTruthy();
      expect(landmark.name).toBeTruthy();
      expect(landmark.type).toBeTruthy();
      expect(typeof landmark.latitude).toBe('number');
      expect(typeof landmark.longitude).toBe('number');
      expect(typeof landmark.elevationMeters).toBe('number');
      expect(landmark.description.length).toBeGreaterThan(20);
      expect(landmark.scientificSignificance.length).toBeGreaterThan(20);
    });
  });

  it('retrieves landmark by ID', () => {
    const olympus = getLandmarkById('olympus-mons');
    expect(olympus).toBeDefined();
    expect(olympus?.name).toContain('Olympus Mons');
    expect(olympus?.elevationMeters).toBeGreaterThan(20000);
  });
});

