import { describe, it, expect } from 'vitest';
import {
  DATASET_REGISTRY,
  getDatasetById,
  getDatasetsByCategory,
  DatasetEntry,
} from './datasetRegistry.ts';

describe('Dataset Registry & Scientific Provenance', () => {
  it('registers all 5 foundational Mars datasets mandated by Phase 03', () => {
    const requiredIds = [
      'mars-viking-mdim21',
      'mars-hrsc-mola-blend',
      'mars-ctx-mosaic',
      'mars-geologic-quads',
      'mars-hirise-footprints',
    ];

    requiredIds.forEach((id) => {
      const entry = getDatasetById(id);
      expect(entry, `Dataset ${id} must be registered`).toBeDefined();
    });
  });

  it('verifies dataset metadata conforms to scientific integrity standards', () => {
    DATASET_REGISTRY.forEach((dataset: DatasetEntry) => {
      expect(dataset.id).toBeTruthy();
      expect(dataset.name).toBeTruthy();
      expect(dataset.provider).toBeTruthy();
      expect(dataset.resolution).toBeTruthy();
      expect(dataset.coverage).toBeTruthy();
      expect(dataset.endpointUrl).toBeTruthy();
      expect(dataset.license).toBeTruthy();
      expect(['OBSERVED', 'DERIVED', 'MODELED', 'SIMULATED']).toContain(
        dataset.classification
      );
    });
  });

  it('filters datasets by category', () => {
    const surfaceDatasets = getDatasetsByCategory('surface');
    expect(surfaceDatasets.some((d) => d.id === 'mars-viking-mdim21')).toBe(true);

    const topoDatasets = getDatasetsByCategory('topography');
    expect(topoDatasets.some((d) => d.id === 'mars-hrsc-mola-blend')).toBe(true);

    const featureDatasets = getDatasetsByCategory('features');
    expect(featureDatasets.some((d) => d.id === 'mars-hirise-footprints')).toBe(true);
  });

  it('registers high-resolution localized dataset mars-hirise-jezero-dtm with scale and extent bounds', () => {
    const jezeroDtm = getDatasetById('mars-hirise-jezero-dtm');
    expect(jezeroDtm, 'mars-hirise-jezero-dtm must be registered in DATASET_REGISTRY').toBeDefined();
    expect(jezeroDtm?.classification).toBe('DERIVED');
    expect(jezeroDtm?.extent).toBeDefined();
    expect(jezeroDtm?.extent?.minLon).toBeLessThanOrEqual(77.5);
    expect(jezeroDtm?.extent?.maxLon).toBeGreaterThanOrEqual(77.5);
    expect(jezeroDtm?.extent?.minLat).toBeLessThanOrEqual(18.5);
    expect(jezeroDtm?.extent?.maxLat).toBeGreaterThanOrEqual(18.5);
    expect(jezeroDtm?.minScale).toBeDefined();
    expect(jezeroDtm?.minScale).toBeLessThanOrEqual(2500000);
    expect(jezeroDtm?.maxScale).toBeDefined();
    expect(jezeroDtm?.maxScale).toBeLessThanOrEqual(1000);
  });

  it('defines multi-resolution scale boundaries for CTX mosaic, USGS quads, and HiRISE footprints', () => {
    const ctx = getDatasetById('mars-ctx-mosaic');
    expect(ctx?.minScale).toBe(2500000);
    expect(ctx?.maxScale).toBe(25000);

    const quads = getDatasetById('mars-geologic-quads');
    expect(quads?.minScale).toBe(25000000);
    expect(quads?.maxScale).toBe(500000);

    const footprints = getDatasetById('mars-hirise-footprints');
    expect(footprints?.minScale).toBe(10000000);
    expect(footprints?.maxScale).toBe(1000);
  });

  it('registers Phase 06 terrain intelligence layers (shaded relief, elevation tint, regional slope)', () => {
    // Assert mars-mcolordem-shaded-relief is registered with category topography, classification DERIVED, and format TILE_SERVER
    const shadedRelief = getDatasetById('mars-mcolordem-shaded-relief');
    expect(shadedRelief, 'mars-mcolordem-shaded-relief must be registered').toBeDefined();
    expect(shadedRelief?.category).toBe('topography');
    expect(shadedRelief?.classification).toBe('DERIVED');
    expect(shadedRelief?.format).toBe('TILE_SERVER');

    // Assert mars-mola-elevation-tint is registered with category topography, classification DERIVED
    const elevationTint = getDatasetById('mars-mola-elevation-tint');
    expect(elevationTint, 'mars-mola-elevation-tint must be registered').toBeDefined();
    expect(elevationTint?.category).toBe('topography');
    expect(elevationTint?.classification).toBe('DERIVED');

    // Assert mars-regional-slope is registered with category topography, classification DERIVED, and description explicitly noting regional scale derivation
    const regionalSlope = getDatasetById('mars-regional-slope');
    expect(regionalSlope, 'mars-regional-slope must be registered').toBeDefined();
    expect(regionalSlope?.category).toBe('topography');
    expect(regionalSlope?.classification).toBe('DERIVED');
    expect(regionalSlope?.description).toMatch(/regional.*derived/i);
  });

  it('registers Phase 08.5 planetary exploration datasets (seismic catalog, minerals, subsurface ice, settlement sites)', () => {
    const seismic = getDatasetById('mars-seismic-catalog');
    expect(seismic, 'mars-seismic-catalog must be registered').toBeDefined();
    expect(seismic?.category).toBe('geology');
    expect(seismic?.classification).toBe('OBSERVED');
    expect(seismic?.endpointUrl).toBe('/data/mars_seismic_events.geojson');

    const minerals = getDatasetById('mars-crism-minerals');
    expect(minerals, 'mars-crism-minerals must be registered').toBeDefined();
    expect(minerals?.category).toBe('geology');
    expect(minerals?.classification).toBe('DERIVED');
    expect(minerals?.endpointUrl).toBe('/data/mars_hydrated_minerals.geojson');

    const ice = getDatasetById('mars-swim-subsurface-ice');
    expect(ice, 'mars-swim-subsurface-ice must be registered').toBeDefined();
    expect(ice?.category).toBe('geology');
    expect(ice?.classification).toBe('DERIVED');
    expect(ice?.endpointUrl).toBe('/data/mars_subsurface_ice.geojson');

    const settlements = getDatasetById('mars-settlement-sites');
    expect(settlements, 'mars-settlement-sites must be registered').toBeDefined();
    expect(settlements?.category).toBe('features');
    expect(settlements?.classification).toBe('MODELED');
    expect(settlements?.endpointUrl).toBe('/data/mars_settlement_sites.geojson');
  });
});
