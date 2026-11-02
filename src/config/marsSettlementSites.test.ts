import { describe, it, expect } from 'vitest';
import {
  MARS_SETTLEMENT_SITES,
  getSettlementSiteById,
  getOptimalSettlementSites,
  getSitesByWaterProximity,
  type MarsSettlementCandidate,
} from './marsSettlementSites.ts';

describe('Candidate Human Settlement & Base Sites Catalog (Phase 08.5)', () => {
  const EXPECTED_SITE_IDS = [
    'arcadia-alpha',
    'deuteronilus-glacier',
    'mawrth-science',
    'erebus-shield',
    'melas-oasis',
    'utopia-vault',
    'jezero-depot',
    'gale-gateway',
  ];

  it('contains at least 8 prime candidate settlement sites in MARS_SETTLEMENT_SITES', () => {
    expect(MARS_SETTLEMENT_SITES.length).toBeGreaterThanOrEqual(8);
  });

  it('contains all 8 required prime candidate zone IDs', () => {
    const siteIds = MARS_SETTLEMENT_SITES.map((site) => site.id);
    for (const id of EXPECTED_SITE_IDS) {
      expect(siteIds).toContain(id);
    }
  });

  it('validates every site contains valid coordinates, elevations, and ratings', () => {
    MARS_SETTLEMENT_SITES.forEach((site: MarsSettlementCandidate) => {
      expect(site.id).toBeTruthy();
      expect(site.name).toBeTruthy();
      expect(site.targetRegion).toBeTruthy();

      // Latitude and Longitude ranges
      expect(typeof site.latitude).toBe('number');
      expect(site.latitude).toBeGreaterThanOrEqual(-90);
      expect(site.latitude).toBeLessThanOrEqual(90);

      expect(typeof site.longitude).toBe('number');
      expect(site.longitude).toBeGreaterThanOrEqual(-180);
      expect(site.longitude).toBeLessThanOrEqual(180);

      // Coordinates tuple [longitude, latitude]
      expect(Array.isArray(site.coordinates)).toBe(true);
      expect(site.coordinates.length).toBe(2);
      expect(site.coordinates[0]).toBe(site.longitude);
      expect(site.coordinates[1]).toBe(site.latitude);

      // Elevation
      expect(typeof site.elevationMeters).toBe('number');
      expect(site.elevationMeters).toBeGreaterThan(-9000);
      expect(site.elevationMeters).toBeLessThan(25000);

      // Water ice proximity
      expect(typeof site.waterIceProximityKm).toBe('number');
      expect(site.waterIceProximityKm).toBeGreaterThanOrEqual(0);

      // Slope safety rating
      expect(['OPTIMAL', 'MODERATE']).toContain(site.slopeSafetyRating);

      // Suitability factor & mission architecture
      expect(site.primarySuitabilityFactor.length).toBeGreaterThan(10);
      expect(site.missionArchitecture.length).toBeGreaterThan(10);
    });
  });

  it('verifies specific scientific attributes for key candidate sites', () => {
    const arcadia = getSettlementSiteById('arcadia-alpha');
    expect(arcadia).toBeDefined();
    expect(arcadia?.name).toContain('Arcadia Planitia');
    expect(arcadia?.elevationMeters).toBe(-3800);
    expect(arcadia?.slopeSafetyRating).toBe('OPTIMAL');
    expect(arcadia?.waterIceProximityKm).toBeLessThanOrEqual(1.0);

    const melas = getSettlementSiteById('melas-oasis');
    expect(melas).toBeDefined();
    expect(melas?.elevationMeters).toBeLessThanOrEqual(-3500);
    expect(melas?.primarySuitabilityFactor).toMatch(/pressure/i);

    const utopia = getSettlementSiteById('utopia-vault');
    expect(utopia).toBeDefined();
    expect(utopia?.slopeSafetyRating).toBe('OPTIMAL');
    expect(utopia?.missionArchitecture).toMatch(/vault|underground|cryo/i);
  });

  it('filters sites by optimal slope rating correctly', () => {
    const optimalSites = getOptimalSettlementSites();
    expect(optimalSites.length).toBeGreaterThan(0);
    optimalSites.forEach((site) => {
      expect(site.slopeSafetyRating).toBe('OPTIMAL');
    });
  });

  it('filters sites by water ice proximity correctly', () => {
    const directIceSites = getSitesByWaterProximity(1.0);
    expect(directIceSites.length).toBeGreaterThanOrEqual(2);
    directIceSites.forEach((site) => {
      expect(site.waterIceProximityKm).toBeLessThanOrEqual(1.0);
    });
  });

  it('returns undefined when querying an invalid settlement site id', () => {
    expect(getSettlementSiteById('non-existent-base')).toBeUndefined();
  });

  it('validates the exported mars_settlement_sites.geojson conforms to Mars 2000 (WKID 104971)', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const geojsonPath = path.resolve(__dirname, '../../public/data/mars_settlement_sites.geojson');
    
    expect(fs.existsSync(geojsonPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));
    
    expect(content.type).toBe('FeatureCollection');
    expect(content.crs?.properties?.name).toContain('104971');
    expect(content.features.length).toBe(8);

    const geojsonIds = content.features.map((f: any) => f.properties.id);
    for (const id of EXPECTED_SITE_IDS) {
      expect(geojsonIds).toContain(id);
    }

    content.features.forEach((feature: any) => {
      expect(feature.type).toBe('Feature');
      expect(feature.geometry.type).toBe('Point');
      expect(feature.geometry.coordinates.length).toBe(2);
      expect(feature.properties.classification).toBe('MODELED');
      expect(feature.properties.name).toBeTruthy();
    });
  });
});
