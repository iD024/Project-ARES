import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsMapView } from './MarsMapView.tsx';
import { MapControls } from './MapControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import * as terrainElevationService from '../../services/data/terrainElevationService.ts';

const mockUseMarsLayerSync = vi.fn();
vi.mock('../../hooks/useMarsLayerSync.ts', () => ({
  useMarsLayerSync: (...args: any[]) => mockUseMarsLayerSync(...args),
  default: (...args: any[]) => mockUseMarsLayerSync(...args),
}));

const mockMapWatchCallbacks: Array<{ getter: () => any; callback: (val: any) => void }> = [];
const mockMapViewHandlers: Record<string, (event: any) => any> = {};

const mockMapView = {
  when: vi.fn().mockResolvedValue(true),
  on: vi.fn((event: string, handler: (event: any) => any) => {
    mockMapViewHandlers[event] = handler;
    return { remove: vi.fn() };
  }),
  goTo: vi.fn(),
  destroy: vi.fn(),
  toMap: vi.fn(),
  hitTest: vi.fn().mockResolvedValue({ results: [] }),
  scale: 500000,
  map: { layers: [] },
};

vi.mock('@arcgis/core/views/MapView', () => ({
  default: vi.fn().mockImplementation((opts) => {
    if (opts?.map) {
      mockMapView.map = opts.map;
    }
    return mockMapView;
  }),
}));

vi.mock('@arcgis/core/Map', () => ({
  default: vi.fn().mockImplementation((opts) => ({
    ...opts,
    layers: {
      find: (predicate: any) => opts.layers?.find(predicate),
      forEach: (fn: any) => opts.layers?.forEach(fn),
      map: (fn: any) => opts.layers?.map(fn),
      items: opts.layers || [],
    },
  })),
}));

vi.mock('@arcgis/core/geometry/SpatialReference', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/layers/TileLayer', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/layers/GraphicsLayer', () => ({
  default: vi.fn().mockImplementation((opts) => {
    const graphics: any[] = [];
    return {
      ...opts,
      add: vi.fn((g) => graphics.push(g)),
      removeAll: vi.fn(() => {
        graphics.length = 0;
      }),
      graphics,
    };
  }),
}));

vi.mock('@arcgis/core/Graphic', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/geometry/Point', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/geometry/Polyline', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/core/reactiveUtils', () => ({
  default: {
    watch: vi.fn((getter: any, callback: any) => {
      mockMapWatchCallbacks.push({ getter, callback });
      return { remove: vi.fn() };
    }),
  },
  watch: vi.fn((getter: any, callback: any) => {
    mockMapWatchCallbacks.push({ getter, callback });
    return { remove: vi.fn() };
  }),
}));

describe('MapControls component', () => {
  it('renders 2D cartographic control buttons with proper accessible names', () => {
    const handleZoomIn = vi.fn();
    const handleZoomOut = vi.fn();
    const handleRotateNorth = vi.fn();
    const handleResetExtent = vi.fn();
    const handleReturnToGlobe = vi.fn();

    render(
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotateNorth={handleRotateNorth}
        onResetExtent={handleResetExtent}
        onReturnToGlobe={handleReturnToGlobe}
      />
    );

    const zoomInBtn = screen.getByRole('button', { name: /Zoom in/i });
    const zoomOutBtn = screen.getByRole('button', { name: /Zoom out/i });
    const northBtn = screen.getByRole('button', { name: /Orient north/i });
    const resetBtn = screen.getByRole('button', { name: /Reset regional extent/i });
    const returnBtn = screen.getByRole('button', { name: /Return to 3D globe/i });

    expect(zoomInBtn).toBeInTheDocument();
    expect(zoomOutBtn).toBeInTheDocument();
    expect(northBtn).toBeInTheDocument();
    expect(resetBtn).toBeInTheDocument();
    expect(returnBtn).toBeInTheDocument();

    fireEvent.click(zoomInBtn);
    expect(handleZoomIn).toHaveBeenCalledTimes(1);

    fireEvent.click(returnBtn);
    expect(handleReturnToGlobe).toHaveBeenCalledTimes(1);
  });
});

describe('MarsMapView component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMapWatchCallbacks.length = 0;
    for (const key of Object.keys(mockMapViewHandlers)) {
      delete mockMapViewHandlers[key];
    }
    delete (window as any).WebGLRenderingContext;
  });

  it('renders map container and handles headless testing environment gracefully', () => {
    const { container } = render(<MarsMapView />);

    const mapElement = container.querySelector('[data-testid="mars-map-view"]');
    expect(mapElement).toBeInTheDocument();

    // Since jsdom does not implement WebGL, notice banner or fallback container is rendered
    expect(screen.getByText(/WebGL acceleration not available/i)).toBeInTheDocument();
    expect(screen.getAllByText(/2D Regional Cartography/i).length).toBeGreaterThan(0);
  });

  it('triggers return to 3D globe and switches app store viewMode', () => {
    useAppStore.setState({ viewMode: 'REGIONAL_2D' });

    render(<MarsMapView />);
    const returnBtn = screen.getByRole('button', { name: /Return to 3D globe/i });
    expect(returnBtn).toBeInTheDocument();

    fireEvent.click(returnBtn);
    expect(useAppStore.getState().viewMode).toBe('GLOBAL_3D');
  });

  it('does not force camera to Jezero Crater when isRoverTraverseVisible is false', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    mockMapView.goTo.mockClear();

    useAppStore.setState({
      viewMode: 'REGIONAL_2D',
      regionalCenter: { longitude: -133.8, latitude: 18.65, scale: 500000 },
      isRoverTraverseVisible: false,
      selectedRoverId: 'perseverance',
      activeSol: 1150,
    });

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    // Verify goTo was called with regionalCenter (Olympus Mons: -133.8, 18.65), NOT rover coordinates (77.418, 18.385)
    expect(mockMapView.goTo).toHaveBeenCalledWith(
      expect.objectContaining({
        center: [-133.8, 18.65],
        scale: 500000,
      }),
      expect.anything()
    );
    expect(mockMapView.goTo).not.toHaveBeenCalledWith(
      expect.objectContaining({
        center: [expect.closeTo(77.418, 1), expect.closeTo(18.385, 1)],
      }),
      expect.anything()
    );
  });

  it('mounts useMarsLayerSync hook with MapView reference and readiness state', async () => {
    (window as any).WebGLRenderingContext = vi.fn();

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockUseMarsLayerSync).toHaveBeenCalledWith(mockMapView, true);
    });
  });

  it('updates telemetry.scale when view scale changes in 2D MapView', async () => {
    (window as any).WebGLRenderingContext = vi.fn();

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    // Find the scale watch callback
    const scaleWatcher = mockMapWatchCallbacks.find((w) => {
      mockMapView.scale = 250000;
      return w.getter() === 250000;
    });
    expect(scaleWatcher).toBeDefined();

    act(() => {
      scaleWatcher?.callback(250000);
    });

    expect(useAppStore.getState().telemetry.scale).toBe('1:250,000');
  });

  it('updates telemetry.elevation on pointer-move using queryPointElevation', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({
      telemetry: {
        ...useAppStore.getState().telemetry,
        elevation: 0,
      },
    });

    mockMapView.toMap.mockReturnValue({
      longitude: 226.2,
      latitude: 18.65,
    });

    const queryElevationSpy = vi.spyOn(terrainElevationService, 'queryPointElevation');

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const pointerMoveHandler = mockMapViewHandlers['pointer-move'];
    expect(pointerMoveHandler).toBeDefined();

    await act(async () => {
      await pointerMoveHandler({ x: 150, y: 250 });
    });

    await waitFor(() => {
      expect(queryElevationSpy).toHaveBeenCalledWith(226.2, 18.65);
      expect(useAppStore.getState().telemetry.elevation).toBe(21229);
    });
  });

  it('triggers inspectMartianTerrain and sets activeTerrainInspection on surface click', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({ activeTerrainInspection: null });

    mockMapView.toMap.mockReturnValue({
      longitude: 77.45,
      latitude: 18.38,
    });

    const inspectSpy = vi.spyOn(terrainElevationService, 'inspectMartianTerrain');

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const clickHandler = mockMapViewHandlers['click'];
    expect(clickHandler).toBeDefined();

    await act(async () => {
      await clickHandler({ x: 300, y: 400 });
    });

    await waitFor(() => {
      expect(inspectSpy).toHaveBeenCalledWith(77.45, 18.38);
      const inspection = useAppStore.getState().activeTerrainInspection;
      expect(inspection).not.toBeNull();
      expect(inspection?.elevationMeters).toBe(-2560);
      expect(inspection?.quadrangleName).toBe('MC-11 Syrtis Major');
    });
  });

  it('synchronizes rover traverse track and sol milestones onto 2D graphics layer', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({
      selectedRoverId: 'curiosity',
      isRoverTraverseVisible: true,
      activeSol: 1000,
    });

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const traverseLayer = (mockMapView.map.layers as any).find(
      (l: any) => l.id === 'mars-rover-traverse-layer-2d'
    );
    expect(traverseLayer).toBeDefined();

    await waitFor(() => {
      expect(traverseLayer.graphics.length).toBeGreaterThan(0);
    });

    // Verify clicking sol milestone updates activeSol
    const clickHandler = mockMapViewHandlers['click'];
    expect(clickHandler).toBeDefined();

    mockMapView.hitTest.mockResolvedValueOnce({
      results: [
        {
          graphic: {
            attributes: { sol: 1200 },
          },
        },
      ],
    });

    await act(async () => {
      await clickHandler({ x: 100, y: 150 });
    });

    expect(useAppStore.getState().activeSol).toBe(1200);
  });

  it('renders Zhurong traverse with rose palette and 12 milestones in 2D view', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({
      selectedRoverId: 'zhurong',
      isRoverTraverseVisible: true,
      activeSol: null,
    });

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const traverseLayer = (mockMapView.map.layers as any).find(
      (l: any) => l.id === 'mars-rover-traverse-layer-2d'
    );
    expect(traverseLayer).toBeDefined();

    await waitFor(() => {
      expect(traverseLayer.graphics.length).toBeGreaterThanOrEqual(12);
    });

    const lineGraphic = traverseLayer.graphics.find((g: any) => g.symbol?.type === 'simple-line');
    expect(lineGraphic).toBeDefined();
    expect(lineGraphic.symbol.color).toMatchObject({ r: 244, g: 63, b: 94, a: 0.95 });
  });

  it('synchronizes Phase 09 route planning candidate paths on 2D map', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({
      routeOrigin: { lon: 77.45, lat: 18.38 },
      routeDestination: { lon: 77.38, lat: 18.42 },
      candidateRoutes: [
        {
          id: 'BALANCED',
          name: 'Balanced Route',
          description: 'Balanced',
          colorHex: '#06B6D4',
          colorRgba: [6, 182, 212, 0.95],
          waypoints: [
            { longitude: 77.45, latitude: 18.38, elevationMeters: -2560, distanceFromStartKm: 0, segmentSlopeDegrees: 0 },
            { longitude: 77.38, latitude: 18.42, elevationMeters: -2500, distanceFromStartKm: 2.5, segmentSlopeDegrees: 1.5 },
          ],
          totalDistanceKm: 2.5,
          maxSlopeDegrees: 2.5,
          averageSlopeDegrees: 1.5,
          elevationChangeMeters: 60,
          totalAscentMeters: 60,
          totalDescentMeters: 0,
          estimatedSols: 25,
          isTraversable: true,
          elevationTransect: {
            points: [],
            totalDistanceKm: 2.5,
            minElevationMeters: -2560,
            maxElevationMeters: -2500,
            elevationChangeMeters: 60,
            averageSlopeDegrees: 1.5,
          },
        },
      ],
      selectedRouteIndex: 0,
    });

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const routesLayer = (mockMapView.map.layers as any).find(
      (l: any) => l.id === 'mars-routes-layer-2d'
    );
    expect(routesLayer).toBeDefined();

    await waitFor(() => {
      expect(routesLayer.graphics.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('intercepts map click when isPickingRoutePoint is destination to record coordinates', async () => {
    (window as any).WebGLRenderingContext = vi.fn();
    useAppStore.setState({
      isPickingRoutePoint: 'destination',
      routeDestination: null,
    });

    render(<MarsMapView />);

    await waitFor(() => {
      expect(mockMapView.when).toHaveBeenCalled();
    });

    const clickHandler = mockMapViewHandlers['click'];
    expect(clickHandler).toBeDefined();

    await act(async () => {
      await clickHandler({
        mapPoint: { longitude: 191.2, latitude: 40.5 },
      });
    });

    expect(useAppStore.getState().routeDestination).toEqual({ lon: 191.2, lat: 40.5 });
    expect(useAppStore.getState().isPickingRoutePoint).toBeNull();
  });
});

