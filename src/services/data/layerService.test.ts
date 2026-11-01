import { describe, it, expect } from 'vitest';
import { resolveLayerConfig } from './layerService.ts';
import { getDatasetById } from './datasetRegistry.ts';

describe('ArcGIS Layer Factory & Resolver', () => {
  it('resolves TileLayer configuration for Viking MDIM 2.1', () => {
    const viking = getDatasetById('mars-viking-mdim21');
    expect(viking).toBeDefined();

    const config = resolveLayerConfig(viking!);
    expect(config.layerType).toBe('tile');
    expect(config.url).toBe(viking?.endpointUrl);
    expect(config.id).toBe(viking?.id);
    expect(config.title).toBe(viking?.name);
  });

  it('resolves ElevationLayer configuration for HRSC-MOLA DEM', () => {
    const mola = getDatasetById('mars-hrsc-mola-blend');
    expect(mola).toBeDefined();

    const config = resolveLayerConfig(mola!);
    expect(config.layerType).toBe('elevation');
    expect(config.url).toBe(mola?.endpointUrl);
    expect(config.id).toBe(mola?.id);
  });

  it('resolves GeoJSONLayer configuration for HiRISE Footprints', () => {
    const hirise = getDatasetById('mars-hirise-footprints');
    expect(hirise).toBeDefined();

    const config = resolveLayerConfig(hirise!);
    expect(config.layerType).toBe('geojson');
    expect(config.url).toBe('/data/hirise_footprints.geojson');
  });

  it('resolves WMSLayer configuration for USGS Geologic Quads', () => {
    const geology = getDatasetById('mars-geologic-quads');
    expect(geology).toBeDefined();

    const config = resolveLayerConfig(geology!);
    expect(config.layerType).toBe('wms');
    expect(config.url).toBe(geology?.endpointUrl);
  });
});
