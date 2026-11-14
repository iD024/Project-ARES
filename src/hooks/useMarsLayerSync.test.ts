import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMarsLayerSync, addLayerToMap } from './useMarsLayerSync.ts';
import { useAppStore } from '../store/useAppStore.ts';
import { DATASET_REGISTRY } from '../services/data/datasetRegistry.ts';
import * as layerService from '../services/data/layerService.ts';

// Mock ArcGIS Layer classes
class MockArcGISLayer {
  id: string;
  url?: string;
  urlTemplate?: string;
  title?: string;
  type?: string;
  declaredClass?: string;
  visible: boolean = true;
  opacity: number = 1.0;
  copyright?: string;
  minScale?: number;
  maxScale?: number;
  destroy = vi.fn();

  constructor(options: any = {}) {
    this.id = options.id;
    this.url = options.url;
    this.urlTemplate = options.urlTemplate;
    this.title = options.title;
    this.type = options.type;
    this.declaredClass = options.declaredClass;
    this.visible = options.visible ?? true;
    this.opacity = options.opacity ?? 1.0;
    this.copyright = options.copyright;
    this.minScale = options.minScale;
    this.maxScale = options.maxScale;
  }
}

vi.mock('@arcgis/core/layers/TileLayer', () => ({
  default: class MockTileLayer extends MockArcGISLayer {},
}));

vi.mock('@arcgis/core/layers/WebTileLayer', () => ({
  default: class MockWebTileLayer extends MockArcGISLayer {},
}));

vi.mock('@arcgis/core/layers/GeoJSONLayer', () => ({
  default: class MockGeoJSONLayer extends MockArcGISLayer {},
}));

vi.mock('@arcgis/core/layers/ElevationLayer', () => ({
  default: class MockElevationLayer extends MockArcGISLayer {
    type = 'elevation';
    declaredClass = 'esri.layers.ElevationLayer';
  },
}));

vi.mock('@arcgis/core/layers/WMSLayer', () => ({
  default: class MockWMSLayer extends MockArcGISLayer {},
}));

interface MockMap {
  layers: any[];
  add: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
}

function createMockView(initialLayers: any[] = []) {
  const layers = [...initialLayers];
  const map: MockMap = {
    layers,
    add: vi.fn((layer: any) => {
      if (!layers.includes(layer)) {
        layers.push(layer);
      }
    }),
    remove: vi.fn((layer: any) => {
      const idx = layers.indexOf(layer);
      if (idx !== -1) {
        layers.splice(idx, 1);
      }
    }),
  };
  return { map };
}

describe('useMarsLayerSync Hook', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Reset store layers to default registry state
    useAppStore.setState({
      layers: DATASET_REGISTRY.map((dataset) => ({
        id: dataset.id,
        name: dataset.name,
        subtitle: dataset.description,
        category: dataset.category,
        classification: dataset.classification,
        provider: dataset.provider,
        resolution: dataset.resolution,
        coverage: dataset.coverage,
        visible: dataset.id === 'mars-viking-mdim21' || dataset.id === 'mars-nomenclature',
        opacity: dataset.defaultOpacity ?? 1.0,
        sourceUrl: dataset.endpointUrl,
        healthStatus: 'ONLINE',
        minScale: dataset.minScale,
        maxScale: dataset.maxScale,
        extent: dataset.extent,
      })),
    });
  });

  it('does not perform mutations or layer creations when isViewReady is false', async () => {
    const view = createMockView();
    const { result } = renderHook(() => useMarsLayerSync(view, false));

    expect(view.map.add).not.toHaveBeenCalled();
    expect(view.map.layers.length).toBe(0);
    expect(result.current.syncedLayerCount).toBe(0);
    expect(result.current.syncError).toBeNull();
  });

  it('handles null view or view without map gracefully', () => {
    const { result: nullResult } = renderHook(() => useMarsLayerSync(null, true));
    expect(nullResult.current.syncedLayerCount).toBe(0);
    expect(nullResult.current.syncError).toBeNull();

    const { result: emptyMapResult } = renderHook(() => useMarsLayerSync({ map: null }, true));
    expect(emptyMapResult.current.syncedLayerCount).toBe(0);
    expect(emptyMapResult.current.syncError).toBeNull();
  });

  it('instantiates visible layers from store and adds them to view.map.layers when isViewReady is true', async () => {
    const view = createMockView();
    const { result } = renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(2);
    });

    const viking = view.map.layers.find((l) => l.id === 'mars-viking-mdim21');
    const nomenclature = view.map.layers.find((l) => l.id === 'mars-nomenclature');

    expect(viking).toBeDefined();
    expect(viking.visible).toBe(true);
    expect(viking.opacity).toBe(1.0);

    expect(nomenclature).toBeDefined();
    expect(nomenclature.visible).toBe(true);
    expect(nomenclature.opacity).toBe(1.0);

    expect(result.current.syncedLayerCount).toBe(2);
    expect(result.current.syncError).toBeNull();
  });

  it('mutates layerInstance.visible = false when store visibility is toggled off without recreating layer', async () => {
    const view = createMockView();
    renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(2);
    });

    const vikingInstance = view.map.layers.find((l) => l.id === 'mars-viking-mdim21');
    expect(vikingInstance).toBeDefined();
    expect(vikingInstance.visible).toBe(true);

    const initialAddCallCount = view.map.add.mock.calls.length;

    // Toggle Viking visibility off
    act(() => {
      useAppStore.getState().setLayerVisibility('mars-viking-mdim21', false);
    });

    await waitFor(() => {
      expect(vikingInstance.visible).toBe(false);
    });

    // Verify it was not re-added or recreated
    expect(view.map.add.mock.calls.length).toBe(initialAddCallCount);
    expect(view.map.layers.find((l) => l.id === 'mars-viking-mdim21')).toBe(vikingInstance);
  });

  it('mutates layerInstance.opacity = newOpacity directly when store opacity changes', async () => {
    const view = createMockView();
    renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(2);
    });

    const vikingInstance = view.map.layers.find((l) => l.id === 'mars-viking-mdim21');
    expect(vikingInstance).toBeDefined();

    act(() => {
      useAppStore.getState().setLayerOpacity('mars-viking-mdim21', 0.45);
    });

    await waitFor(() => {
      expect(vikingInstance.opacity).toBe(0.45);
    });

    expect(view.map.layers.find((l) => l.id === 'mars-viking-mdim21')).toBe(vikingInstance);
  });

  it('restores layerInstance.visible = true when toggled back on without recreating layer', async () => {
    const view = createMockView();
    renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(2);
    });

    const vikingInstance = view.map.layers.find((l) => l.id === 'mars-viking-mdim21');
    const initialAddCallCount = view.map.add.mock.calls.length;

    // Toggle off
    act(() => {
      useAppStore.getState().setLayerVisibility('mars-viking-mdim21', false);
    });

    await waitFor(() => {
      expect(vikingInstance.visible).toBe(false);
    });

    // Toggle back on
    act(() => {
      useAppStore.getState().setLayerVisibility('mars-viking-mdim21', true);
    });

    await waitFor(() => {
      expect(vikingInstance.visible).toBe(true);
    });

    // Confirm layer instance identity was preserved without extra additions
    expect(view.map.add.mock.calls.length).toBe(initialAddCallCount);
    expect(view.map.layers.find((l) => l.id === 'mars-viking-mdim21')).toBe(vikingInstance);
  });

  it('dynamically instantiates and adds newly toggled visible layer', async () => {
    const view = createMockView();
    const { result } = renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(2);
    });

    expect(view.map.layers.find((l) => l.id === 'mars-ctx-mosaic')).toBeUndefined();

    // Toggle CTX mosaic on
    act(() => {
      useAppStore.getState().setLayerVisibility('mars-ctx-mosaic', true);
    });

    await waitFor(() => {
      expect(view.map.layers.find((l) => l.id === 'mars-ctx-mosaic')).toBeDefined();
    });

    const ctxInstance = view.map.layers.find((l) => l.id === 'mars-ctx-mosaic');
    expect(ctxInstance.visible).toBe(true);
    expect(result.current.syncedLayerCount).toBe(3);
  });

  it('routes ElevationLayer to ground.layers when available and skips adding to map.layers when ground is absent', async () => {
    // Direct addLayerToMap check when ground is absent (e.g. 2D MapView)
    const mockMapNoGround = { layers: [], add: vi.fn() };
    const mockElevation = new MockArcGISLayer({ id: 'mola', type: 'elevation' });
    mockElevation.type = 'elevation';
    mockElevation.declaredClass = 'esri.layers.ElevationLayer';

    addLayerToMap(mockMapNoGround, mockElevation);
    expect(mockMapNoGround.add).not.toHaveBeenCalled();
  });

  it('safely cleans up and removes managed layers on unmount without touching pre-existing map layers', async () => {
    const preExistingBasemap = new MockArcGISLayer({
      id: 'mars-mdim-basemap',
      title: 'Pre-existing Baseline Mosaic',
    });

    const view = createMockView([preExistingBasemap]);
    expect(view.map.layers.length).toBe(1);

    const { unmount } = renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(view.map.layers.length).toBe(3); // pre-existing + 2 synced
    });

    const syncedViking = view.map.layers.find((l) => l.id === 'mars-viking-mdim21');
    const syncedNomenclature = view.map.layers.find((l) => l.id === 'mars-nomenclature');

    // Unmount hook
    unmount();

    // Managed layers should be removed
    expect(view.map.remove).toHaveBeenCalledWith(syncedViking);
    expect(view.map.remove).toHaveBeenCalledWith(syncedNomenclature);
    expect(syncedViking.destroy).toHaveBeenCalled();
    expect(syncedNomenclature.destroy).toHaveBeenCalled();

    // Pre-existing basemap should remain intact
    expect(view.map.remove).not.toHaveBeenCalledWith(preExistingBasemap);
    expect(view.map.layers).toContain(preExistingBasemap);
    expect(view.map.layers.length).toBe(1);
  });

  it('captures layer instantiation errors gracefully in syncError', async () => {
    const view = createMockView();
    const spy = vi.spyOn(layerService, 'createArcGISLayerInstance').mockRejectedValueOnce(
      new Error('Failed to load remote WMTS capabilities')
    );

    const { result } = renderHook(() => useMarsLayerSync(view, true));

    await waitFor(() => {
      expect(result.current.syncError).not.toBeNull();
      expect(result.current.syncError).toContain('Failed to load remote WMTS capabilities');
    });

    spy.mockRestore();
  });
});
