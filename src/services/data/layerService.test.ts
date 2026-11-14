import { describe, it, expect } from 'vitest';
import { resolveLayerConfig, createArcGISLayerInstance } from './layerService.ts';
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

  it('resolves scale constraints (minScale and maxScale) onto ResolvedLayerConfig for CTX TileLayer', () => {
    const ctx = getDatasetById('mars-ctx-mosaic');
    expect(ctx).toBeDefined();

    const config = resolveLayerConfig(ctx!);
    expect(config.layerType).toBe('tile');
    expect(config.url).toBe('https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer');
    expect(config.minScale).toBe(2500000);
    expect(config.maxScale).toBe(25000);
  });

  it('assigns GCS_Mars_2000 (WKID 104971) spatial reference to GeoJSONLayer instances', async () => {
    const nomenclature = getDatasetById('mars-nomenclature');
    expect(nomenclature).toBeDefined();

    const layer = await createArcGISLayerInstance(nomenclature!);
    expect(layer.spatialReference).toBeDefined();
    expect(layer.spatialReference.wkid).toBe(104971);
  });

  it('resolves WMTS format dataset into webtile layer configuration with urlTemplate', () => {
    const jezeroDtm = getDatasetById('mars-hirise-jezero-dtm');
    expect(jezeroDtm).toBeDefined();

    const config = resolveLayerConfig(jezeroDtm!);
    expect(config.layerType).toBe('webtile');
    expect(config.minScale).toBeDefined();
    expect(config.maxScale).toBeDefined();
    expect(config.url).toContain('https://trek.nasa.gov');
  });

  it('creates ArcGIS TileLayer instance with minScale and maxScale configured', async () => {
    const ctx = getDatasetById('mars-ctx-mosaic');
    expect(ctx).toBeDefined();

    const layer = await createArcGISLayerInstance(ctx!);
    expect(layer).toBeDefined();
    expect(layer.minScale).toBe(2500000);
    expect(layer.maxScale).toBe(25000);
  });

  it('creates ArcGIS WebTileLayer instance for WMTS dataset with scale constraints', async () => {
    const jezeroDtm = getDatasetById('mars-hirise-jezero-dtm');
    expect(jezeroDtm).toBeDefined();

    const layer = await createArcGISLayerInstance(jezeroDtm!);
    expect(layer).toBeDefined();
    expect(layer.minScale).toBe(jezeroDtm?.minScale);
    expect(layer.maxScale).toBe(jezeroDtm?.maxScale);
  });

  it('creates GeoJSONLayer with custom glowing cyan renderer for IAU Nomenclature', async () => {
    const nomenclature = getDatasetById('mars-nomenclature');
    expect(nomenclature).toBeDefined();

    const layer = await createArcGISLayerInstance(nomenclature!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer).toBeDefined();
    expect(layer.renderer.type).toBe('simple');
    expect(layer.renderer.symbol).toBeDefined();
  });

  it('creates GeoJSONLayer with translucent polygon renderer for HiRISE Footprints', async () => {
    const footprints = getDatasetById('mars-hirise-footprints');
    expect(footprints).toBeDefined();

    const layer = await createArcGISLayerInstance(footprints!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer).toBeDefined();
    expect(layer.renderer.type).toBe('simple');
    expect(layer.renderer.symbol).toBeDefined();
  });

  it('creates GeoJSONLayer with crimson circle marker renderer and popup for Marsquake Seismic Catalog', async () => {
    const quakes = getDatasetById('mars-seismic-catalog');
    expect(quakes).toBeDefined();

    const layer = await createArcGISLayerInstance(quakes!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer?.type).toBe('simple');
    expect(layer.renderer?.symbol?.style).toBe('circle');
    expect(layer.popupTemplate?.title).toContain('Marsquake');
  });

  it('creates GeoJSONLayer with emerald fill renderer and popup for CRISM Hydrated Minerals', async () => {
    const minerals = getDatasetById('mars-crism-minerals');
    expect(minerals).toBeDefined();

    const layer = await createArcGISLayerInstance(minerals!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer?.type).toBe('simple');
    expect(layer.renderer?.symbol?.type).toBe('simple-fill');
    expect(layer.popupTemplate?.content).toBeDefined();
  });

  it('creates GeoJSONLayer with cyan fill renderer and popup for SWIM Subsurface Ice', async () => {
    const ice = getDatasetById('mars-swim-subsurface-ice');
    expect(ice).toBeDefined();

    const layer = await createArcGISLayerInstance(ice!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer?.type).toBe('simple');
    expect(layer.renderer?.symbol?.type).toBe('simple-fill');
    expect(layer.popupTemplate?.content).toBeDefined();
  });

  it('creates GeoJSONLayer with tactical diamond marker renderer and popup for Settlement Sites', async () => {
    const settlements = getDatasetById('mars-settlement-sites');
    expect(settlements).toBeDefined();

    const layer = await createArcGISLayerInstance(settlements!);
    expect(layer).toBeDefined();
    expect(layer.declaredClass || layer.type).toMatch(/GeoJSONLayer|geojson/i);
    expect(layer.renderer?.type).toBe('simple');
    expect(layer.renderer?.symbol?.style).toBe('diamond');
    expect(layer.popupTemplate?.content).toBeDefined();
  });
});
