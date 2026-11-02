import { describe, it, expect } from 'vitest';
import {
  getRoverMission,
  getAllRoverMissions,
  getRoverMilestones,
  getMilestoneBySol,
  getNextMilestone,
  getPrevMilestone,
  getTraverseGeoJsonUrl,
} from './roverMissionService.ts';

describe('Rover Mission Service', () => {
  it('retrieves Perseverance mission dossier with instruments and milestones', () => {
    const perseverance = getRoverMission('perseverance');
    expect(perseverance).toBeDefined();
    expect(perseverance?.name).toContain('Perseverance');
    expect(perseverance?.status).toBe('ACTIVE');
    expect(perseverance?.powerSource).toContain('MMRTG');
    expect(perseverance?.instruments.length).toBeGreaterThanOrEqual(5);

    // Check key instruments
    const pixl = perseverance?.instruments.find((i) => i.acronym === 'PIXL');
    expect(pixl).toBeDefined();
    expect(pixl?.primeScience).toBeDefined();
  });

  it('retrieves Curiosity mission dossier with instruments and milestones', () => {
    const curiosity = getRoverMission('curiosity');
    expect(curiosity).toBeDefined();
    expect(curiosity?.name).toContain('Curiosity');
    expect(curiosity?.status).toBe('ACTIVE');
    expect(curiosity?.totalDistanceKm).toBeGreaterThanOrEqual(30);

    const sam = curiosity?.instruments.find((i) => i.acronym === 'SAM');
    expect(sam).toBeDefined();
  });

  it('provides all cataloged missions including Opportunity, Spirit, and Zhurong', () => {
    const missions = getAllRoverMissions();
    expect(missions.length).toBeGreaterThanOrEqual(4);
    expect(missions.some((m) => m.id === 'perseverance')).toBe(true);
    expect(missions.some((m) => m.id === 'curiosity')).toBe(true);
    expect(missions.some((m) => m.id === 'opportunity')).toBe(true);
    expect(missions.some((m) => m.id === 'spirit')).toBe(true);
  });

  it('fetches milestones and supports next/prev navigation by Sol', () => {
    const milestones = getRoverMilestones('perseverance');
    expect(milestones.length).toBeGreaterThanOrEqual(20);

    const first = milestones[0];
    expect(first.sol).toBe(0);
    expect(first.siteName).toContain('Octavia E. Butler');

    // Milestone lookup by exact Sol
    const sol420 = getMilestoneBySol('perseverance', 420);
    expect(sol420).toBeDefined();
    expect(sol420?.siteName).toContain('Enchanted Lake');

    // Next milestone navigation
    const next = getNextMilestone('perseverance', 0);
    expect(next).toBeDefined();
    expect(next?.sol).toBeGreaterThan(0);

    // Prev milestone navigation
    const prev = getPrevMilestone('perseverance', 420);
    expect(prev).toBeDefined();
    expect(prev?.sol).toBeLessThan(420);
  });

  it('returns valid local GeoJSON traverse asset URLs for rovers with published routes', () => {
    expect(getTraverseGeoJsonUrl('perseverance')).toBe('/data/perseverance_traverse.geojson');
    expect(getTraverseGeoJsonUrl('curiosity')).toBe('/data/curiosity_traverse.geojson');
  });
});

