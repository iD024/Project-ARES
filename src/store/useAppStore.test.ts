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

  it('manages Phase 07 measurement tools and point records', () => {
    expect(useAppStore.getState().activeMeasurementTool).toBeNull();
    expect(useAppStore.getState().measurementPoints).toEqual([]);

    // Activate distance tool
    useAppStore.getState().setActiveMeasurementTool('distance');
    expect(useAppStore.getState().activeMeasurementTool).toBe('distance');
    expect(useAppStore.getState().isMeasurementActive).toBe(true);

    // Add points
    useAppStore.getState().addMeasurementPoint({ lon: 77.45, lat: 18.38 });
    useAppStore.getState().addMeasurementPoint({ lon: 78.10, lat: 18.90 });
    expect(useAppStore.getState().measurementPoints.length).toBe(2);

    // Clear points
    useAppStore.getState().clearMeasurement();
    expect(useAppStore.getState().measurementPoints).toEqual([]);

    // Deactivate tool
    useAppStore.getState().setActiveMeasurementTool(null);
    expect(useAppStore.getState().activeMeasurementTool).toBeNull();
    expect(useAppStore.getState().isMeasurementActive).toBe(false);
  });

  it('manages selectedLandmarkId for 3D local POV exploration', () => {
    useAppStore.getState().setSelectedLandmarkId('olympus-mons');
    expect(useAppStore.getState().selectedLandmarkId).toBe('olympus-mons');

    useAppStore.getState().setSelectedLandmarkId('valles-marineris');
    expect(useAppStore.getState().selectedLandmarkId).toBe('valles-marineris');
  });

  it('manages Phase 08 rover mission state and active Sol milestones', () => {
    expect(useAppStore.getState().selectedRoverId).toBeDefined();

    useAppStore.getState().setSelectedRoverId('curiosity');
    expect(useAppStore.getState().selectedRoverId).toBe('curiosity');

    useAppStore.getState().setActiveSol(125);
    expect(useAppStore.getState().activeSol).toBe(125);

    useAppStore.getState().setRoverTraverseVisible(false);
    expect(useAppStore.getState().isRoverTraverseVisible).toBe(false);

    useAppStore.getState().setIsMissionControlOpen(true);
    expect(useAppStore.getState().isMissionControlOpen).toBe(true);
  });

  it('manages Phase 09 route planning state, origin/destination, candidates, and elevation bridge', () => {
    // Initial state
    expect(useAppStore.getState().routeOrigin).toBeNull();
    expect(useAppStore.getState().routeDestination).toBeNull();
    expect(useAppStore.getState().activeVehicleProfile).toBe('HEAVY_ROVER');
    expect(useAppStore.getState().candidateRoutes).toEqual([]);
    expect(useAppStore.getState().selectedRouteIndex).toBe(0);
    expect(useAppStore.getState().isPickingRoutePoint).toBeNull();

    // Set origin and destination
    useAppStore.getState().setRouteOrigin({ lon: 77.45, lat: 18.38 });
    expect(useAppStore.getState().routeOrigin).toEqual({ lon: 77.45, lat: 18.38 });

    useAppStore.getState().setRouteDestination({ lon: 77.38, lat: 18.42 });
    expect(useAppStore.getState().routeDestination).toEqual({ lon: 77.38, lat: 18.42 });

    // Set vehicle profile
    useAppStore.getState().setActiveVehicleProfile('AERIAL_DRONE');
    expect(useAppStore.getState().activeVehicleProfile).toBe('AERIAL_DRONE');

    // Set picking point mode
    useAppStore.getState().setIsPickingRoutePoint('origin');
    expect(useAppStore.getState().isPickingRoutePoint).toBe('origin');

    // Mock candidate routes with elevation transects
    const mockTransect = {
      points: [
        { fraction: 0, distanceKm: 0, longitude: 77.45, latitude: 18.38, elevationMeters: -2560 },
        { fraction: 1, distanceKm: 2.5, longitude: 77.38, latitude: 18.42, elevationMeters: -2500 },
      ],
      totalDistanceKm: 2.5,
      minElevationMeters: -2560,
      maxElevationMeters: -2500,
      elevationChangeMeters: 60,
      averageSlopeDegrees: 1.8,
    };

    const mockCandidates = [
      {
        id: 'SAFEST' as const,
        name: 'Safest Route',
        description: 'Safest path',
        colorHex: '#10B981',
        colorRgba: [16, 185, 129, 0.95] as [number, number, number, number],
        waypoints: [],
        totalDistanceKm: 2.5,
        maxSlopeDegrees: 3.2,
        averageSlopeDegrees: 1.8,
        elevationChangeMeters: 60,
        totalAscentMeters: 60,
        totalDescentMeters: 0,
        estimatedSols: 25,
        isTraversable: true,
        elevationTransect: mockTransect,
      },
    ];

    useAppStore.getState().setCandidateRoutes(mockCandidates as any);
    expect(useAppStore.getState().candidateRoutes.length).toBe(1);

    // Selecting candidate index bridges to elevationTransect in store
    useAppStore.getState().setSelectedRouteIndex(0);
    expect(useAppStore.getState().selectedRouteIndex).toBe(0);
    expect(useAppStore.getState().elevationTransect).toEqual(mockTransect);

    // Clear route planning resets coordinates and candidates
    useAppStore.getState().clearRoutePlanning();
    expect(useAppStore.getState().routeOrigin).toBeNull();
    expect(useAppStore.getState().routeDestination).toBeNull();
    expect(useAppStore.getState().candidateRoutes).toEqual([]);
    expect(useAppStore.getState().isPickingRoutePoint).toBeNull();
  });

  it('manages Phase 10 scientific intelligence drawer tabs and contextual deep-link actions', () => {
    // Initial activeIntelTab should default to 'layers'
    expect(useAppStore.getState().activeIntelTab).toBe('layers');
    expect(useAppStore.getState().intelFocusedDatasetId).toBeNull();
    expect(useAppStore.getState().intelFocusedGeologyPeriod).toBeNull();
    expect(useAppStore.getState().intelFocusedQuadCode).toBeNull();

    // Tab switching
    useAppStore.getState().setActiveIntelTab('geology');
    expect(useAppStore.getState().activeIntelTab).toBe('geology');

    // Deep-link to dataset: opens intel drawer, sets tab to 'layers', focuses dataset
    useAppStore.getState().openIntelForDataset('mars-mcolordem-shaded-relief');
    expect(useAppStore.getState().activeDrawer).toBe('intel');
    expect(useAppStore.getState().activeIntelTab).toBe('layers');
    expect(useAppStore.getState().intelFocusedDatasetId).toBe('mars-mcolordem-shaded-relief');

    // Deep-link to geology: opens intel drawer, sets tab to 'geology', focuses period & quad
    useAppStore.getState().openIntelForGeology('Noachian', 'MC-11');
    expect(useAppStore.getState().activeDrawer).toBe('intel');
    expect(useAppStore.getState().activeIntelTab).toBe('geology');
    expect(useAppStore.getState().intelFocusedGeologyPeriod).toBe('Noachian');
    expect(useAppStore.getState().intelFocusedQuadCode).toBe('MC-11');

    // Deep-link to route evaluation: opens intel drawer, sets tab to 'routes'
    useAppStore.getState().openIntelForRouteEvaluation();
    expect(useAppStore.getState().activeDrawer).toBe('intel');
    expect(useAppStore.getState().activeIntelTab).toBe('routes');
  });
});

