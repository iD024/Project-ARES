import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore.ts';
import { DATASET_REGISTRY } from '../services/data/datasetRegistry.ts';

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

  it('manages regional center coordinates and selected region ID', () => {
    // Initial regionalCenter defaults to Jezero Crater coordinates
    const initial = useAppStore.getState();
    expect(initial.regionalCenter).toBeDefined();
    expect(initial.regionalCenter.latitude).toBeCloseTo(18.38, 2);
    expect(initial.regionalCenter.longitude).toBeCloseTo(77.45, 2);

    // Update regional center
    useAppStore.getState().setRegionalCenter({
      latitude: -4.59,
      longitude: 137.44,
      scale: 600000,
    });
    expect(useAppStore.getState().regionalCenter.latitude).toBeCloseTo(-4.59, 2);
    expect(useAppStore.getState().regionalCenter.longitude).toBeCloseTo(137.44, 2);
    expect(useAppStore.getState().regionalCenter.scale).toBe(600000);

    // Select region ID and verify state
    useAppStore.getState().setSelectedRegionId('olympus-mons');
    expect(useAppStore.getState().selectedRegionId).toBe('olympus-mons');
    // Selecting olympus mons updates regional center to its coordinates
    expect(useAppStore.getState().regionalCenter.latitude).toBeCloseTo(18.65, 2);
    expect(useAppStore.getState().regionalCenter.longitude).toBeCloseTo(-133.8, 1);
  });

  it('initializes layers from DATASET_REGISTRY including all terrain intelligence layers', () => {
    const layers = useAppStore.getState().layers;
    expect(layers.length).toBe(DATASET_REGISTRY.length);
    expect(layers.some((l) => l.id === 'mars-mcolordem-shaded-relief')).toBe(true);
    expect(layers.some((l) => l.id === 'mars-mola-elevation-tint')).toBe(true);
    expect(layers.some((l) => l.id === 'mars-regional-slope')).toBe(true);
  });
});

