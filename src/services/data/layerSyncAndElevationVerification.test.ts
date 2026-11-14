import { describe, it, expect, vi } from 'vitest';
import { getDatasetById } from './datasetRegistry.ts';
import { resolveLayerConfig } from './layerService.ts';
import { addLayerToMap, useMarsLayerSync } from '../../hooks/useMarsLayerSync.ts';
import { useAppStore } from '../../store/useAppStore.ts';
import { renderHook, waitFor } from '@testing-library/react';

describe('Phase 05 & 06 Layer Sync and Elevation Verification Reproducer', () => {
  it('resolves mars-mola-elevation-tint to webtile with valid NASA Trek WMTS template', () => {
    const mola = getDatasetById('mars-mola-elevation-tint');
    expect(mola).toBeDefined();
    expect(mola?.format).toBe('WMTS');

    const config = resolveLayerConfig(mola!);
    expect(config.layerType).toBe('webtile');
    expect(config.url).toContain('https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/');
    expect(config.url).toContain('.jpg');
  });

  it('resolves mars-ctx-mosaic to TileLayer format with authoritative Esri/USGS service', () => {
    const ctx = getDatasetById('mars-ctx-mosaic');
    expect(ctx).toBeDefined();
    expect(ctx?.format).toBe('TILE_SERVER');

    const config = resolveLayerConfig(ctx!);
    expect(config.layerType).toBe('tile');
    expect(config.url).toBe('https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer');
  });

  it('resolves mars-regional-slope to webtile format', () => {
    const slope = getDatasetById('mars-regional-slope');
    expect(slope).toBeDefined();
    expect(slope?.format).toBe('WMTS');

    const config = resolveLayerConfig(slope!);
    expect(config.layerType).toBe('webtile');
  });

  it('inserts operational raster layers below graphics layers so landing site pins are not covered', () => {
    const landingSitesGraphicLayer = {
      id: 'mars-landing-sites',
      type: 'graphics',
    };
    const map: any = {
      layers: [landingSitesGraphicLayer],
      add: vi.fn((layer: any, index?: number) => {
        if (index !== undefined) {
          map.layers.splice(index, 0, layer);
        } else {
          map.layers.push(layer);
        }
      }),
    };

    const newShadedReliefLayer = {
      id: 'mars-mcolordem-shaded-relief',
      type: 'tile',
    };

    addLayerToMap(map, newShadedReliefLayer);

    // The new raster layer must be inserted before the graphics layer
    expect(map.layers[0].id).toBe('mars-mcolordem-shaded-relief');
    expect(map.layers[1].id).toBe('mars-landing-sites');
  });

  it('routes ElevationLayer to ground.layers instead of operational map.layers', () => {
    const map: any = {
      layers: [],
      ground: {
        layers: [],
      },
      add: vi.fn((layer: any) => map.layers.push(layer)),
    };

    const elevationLayer = {
      id: 'mars-hrsc-mola-blend',
      type: 'elevation',
    };

    addLayerToMap(map, elevationLayer);

    expect(map.layers.length).toBe(0);
    expect(map.ground.layers.length).toBe(1);
    expect(map.ground.layers[0].id).toBe('mars-hrsc-mola-blend');
  });

  it('adopts existing surface layer on map to avoid duplicate layers', async () => {
    const existingSurfaceLayer = {
      id: 'mars-viking-mdim21',
      type: 'tile',
      visible: true,
      opacity: 1.0,
      destroy: vi.fn(),
    };

    const map: any = {
      layers: [existingSurfaceLayer],
      add: vi.fn((l) => map.layers.push(l)),
      remove: vi.fn(),
    };

    const view = { map };

    useAppStore.setState({
      layers: [
        {
          id: 'mars-viking-mdim21',
          name: 'Viking MDIM 2.1 Color Mosaic',
          subtitle: '',
          category: 'surface',
          classification: 'OBSERVED',
          provider: 'USGS',
          resolution: '232m',
          coverage: 'Global',
          visible: true,
          opacity: 1.0,
          sourceUrl: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer',
          healthStatus: 'ONLINE',
        },
      ],
    });

    const { result } = renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(result.current.syncedLayerCount).toBe(1);
    });

    // Should NOT have called map.add to re-add mars-viking-mdim21
    expect(map.add).not.toHaveBeenCalled();
    expect(map.layers.length).toBe(1);
  });
});
