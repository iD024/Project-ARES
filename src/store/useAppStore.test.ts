import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore.ts';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useAppStore.setState({
      activeDrawer: null,
      activeModal: null,
      viewMode: 'GLOBAL_3D',
      telemetry: {
        latitude: 18.38,
        longitude: 77.45,
        elevation: -2560,
        altitudeKm: 450,
        subsolarLon: 120.4,
        scale: '1:500,000',
        crs: 'GCS_Mars_2000 (WKID 104905)',
      },
    });
  });

  it('initializes with default global 3D mode and null drawers', () => {
    const state = useAppStore.getState();
    expect(state.viewMode).toBe('GLOBAL_3D');
    expect(state.activeDrawer).toBeNull();
    expect(state.activeModal).toBeNull();
  });

  it('toggles active drawer correctly', () => {
    useAppStore.getState().setActiveDrawer('layers');
    expect(useAppStore.getState().activeDrawer).toBe('layers');

    // Toggling the same drawer closes it
    useAppStore.getState().setActiveDrawer('layers');
    expect(useAppStore.getState().activeDrawer).toBeNull();
  });

  it('updates exploration view mode', () => {
    useAppStore.getState().setViewMode('REGIONAL_2D');
    expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');

    useAppStore.getState().setViewMode('LOCAL_ANALYSIS');
    expect(useAppStore.getState().viewMode).toBe('LOCAL_ANALYSIS');
  });

  it('toggles layer visibility and adjusts layer opacity', () => {
    const initialLayers = useAppStore.getState().layers;
    const firstLayer = initialLayers[0];
    expect(firstLayer).toBeDefined();

    // Toggle visibility
    const initialVisibility = firstLayer.visible;
    useAppStore.getState().setLayerVisibility(firstLayer.id, !initialVisibility);
    expect(useAppStore.getState().layers.find(l => l.id === firstLayer.id)?.visible).toBe(!initialVisibility);

    // Adjust opacity
    useAppStore.getState().setLayerOpacity(firstLayer.id, 0.45);
    expect(useAppStore.getState().layers.find(l => l.id === firstLayer.id)?.opacity).toBe(0.45);
  });
});
