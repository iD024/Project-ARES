import { describe, it, expect } from 'vitest';
import {
  getRoverMission,
  getAllRoverMissions,
  getRoverMilestones,
  getMilestoneBySol,
  getNextMilestone,
  getPrevMilestone,
  getTraverseGeoJsonUrl,
  getRoverColorRgba,
  getRoverHexColor,
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

  it('provides all cataloged missions including Opportunity, Spirit, Zhurong, and InSight', () => {
    const missions = getAllRoverMissions();
    expect(missions.length).toBeGreaterThanOrEqual(6);
    expect(missions.some((m) => m.id === 'perseverance')).toBe(true);
    expect(missions.some((m) => m.id === 'curiosity')).toBe(true);
    expect(missions.some((m) => m.id === 'opportunity')).toBe(true);
    expect(missions.some((m) => m.id === 'spirit')).toBe(true);
    expect(missions.some((m) => m.id === 'zhurong')).toBe(true);
    expect(missions.some((m) => m.id === 'insight')).toBe(true);
  });

  it('retrieves Opportunity mission dossier with verified instruments and 22 milestones', () => {
    const opp = getRoverMission('opportunity');
    expect(opp).toBeDefined();
    expect(opp?.name).toContain('Opportunity');
    expect(opp?.status).toBe('COMPLETED');
    expect(opp?.totalDistanceKm).toBe(45.16);
    expect(opp?.totalSols).toBe(5111);
    expect(opp?.instruments.length).toBeGreaterThanOrEqual(5);
    expect(opp?.milestones.length).toBeGreaterThanOrEqual(20);

    const pancam = opp?.instruments.find((i) => i.acronym === 'Pancam');
    expect(pancam).toBeDefined();

    const marathon = opp?.milestones.find((m) => m.siteName.includes('Marathon Valley'));
    expect(marathon).toBeDefined();
    expect(marathon?.sol).toBe(4000);
  });

  it('retrieves Spirit mission dossier with verified instruments and 16 milestones', () => {
    const spirit = getRoverMission('spirit');
    expect(spirit).toBeDefined();
    expect(spirit?.name).toContain('Spirit');
    expect(spirit?.status).toBe('COMPLETED');
    expect(spirit?.totalDistanceKm).toBe(7.73);
    expect(spirit?.instruments.length).toBeGreaterThanOrEqual(5);
    expect(spirit?.milestones.length).toBeGreaterThanOrEqual(15);

    const husbandHill = spirit?.milestones.find((m) => m.siteName.includes('Husband Hill'));
    expect(husbandHill).toBeDefined();
    expect(husbandHill?.elevationMeters).toBe(-1820);
  });

  it('retrieves Zhurong mission dossier with verified instruments and 12 milestones', () => {
    const zhurong = getRoverMission('zhurong');
    expect(zhurong).toBeDefined();
    expect(zhurong?.name).toContain('Zhurong');
    expect(zhurong?.organization).toContain('CNSA');
    expect(zhurong?.targetRegion).toContain('Utopia Planitia');
    expect(zhurong?.totalDistanceKm).toBe(1.92);
    expect(zhurong?.totalSols).toBe(347);
    expect(zhurong?.instruments.length).toBeGreaterThanOrEqual(4);
    expect(zhurong?.milestones.length).toBeGreaterThanOrEqual(12);

    const roper = zhurong?.instruments.find((i) => i.acronym === 'RoPeR');
    expect(roper).toBeDefined();
  });

  it('retrieves InSight mission dossier with verified scientific payload', () => {
    const insight = getRoverMission('insight');
    expect(insight).toBeDefined();
    expect(insight?.name).toContain('InSight');
    expect(insight?.targetRegion).toContain('Elysium Planitia');
    expect(insight?.instruments.length).toBeGreaterThanOrEqual(3);

    const seis = insight?.instruments.find((i) => i.acronym === 'SEIS');
    expect(seis).toBeDefined();
    expect(seis?.primeScience.toLowerCase()).toContain('marsquake');
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
    expect(getTraverseGeoJsonUrl('opportunity')).toBe('/data/opportunity_traverse.geojson');
    expect(getTraverseGeoJsonUrl('spirit')).toBe('/data/spirit_traverse.geojson');
    expect(getTraverseGeoJsonUrl('zhurong')).toBe('/data/zhurong_traverse.geojson');
    expect(getTraverseGeoJsonUrl('insight')).toBeNull();
  });

  it('provides distinct tactical color palettes for all missions', () => {
    expect(getRoverHexColor('perseverance')).toBe('#EA580C');
    expect(getRoverHexColor('curiosity')).toBe('#06B6D4');
    expect(getRoverHexColor('opportunity')).toBe('#10B981');
    expect(getRoverHexColor('spirit')).toBe('#F59E0B');
    expect(getRoverHexColor('zhurong')).toBe('#F43F5E');
    expect(getRoverHexColor('insight')).toBe('#8B5CF6');

    expect(getRoverColorRgba('perseverance')).toEqual([234, 88, 12, 0.95]);
    expect(getRoverColorRgba('opportunity')).toEqual([16, 185, 129, 0.95]);
  });
});

