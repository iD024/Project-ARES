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
});
