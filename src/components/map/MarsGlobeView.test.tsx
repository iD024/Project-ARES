import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsGlobeView } from './MarsGlobeView.tsx';
import { GlobeControls } from './GlobeControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import * as terrainElevationService from '../../services/data/terrainElevationService.ts';

const mockUseMarsLayerSync = vi.fn();
vi.mock('../../hooks/useMarsLayerSync.ts', () => ({
  useMarsLayerSync: (...args: any[]) => mockUseMarsLayerSync(...args),
  default: (...args: any[]) => mockUseMarsLayerSync(...args),
}));

const mockReactiveWatchCallbacks: Array<{ getter: () => any; callback: (val: any) => void }> = [];
const mockSceneViewHandlers: Record<string, (event: any) => any> = {};

const mockSceneView = {
  when: vi.fn().mockResolvedValue(true),
  on: vi.fn((event: string, handler: (event: any) => any) => {
    mockSceneViewHandlers[event] = handler;
    return { remove: vi.fn() };
  }),
  goTo: vi.fn(),
  destroy: vi.fn(),
  toMap: vi.fn(),
  hitTest: vi.fn().mockResolvedValue({ results: [] }),
  scale: 15000000,
  camera: {
    position: { x: 0, y: 0, z: 15000000 },
    clone: vi.fn().mockReturnValue({ position: { z: 15000000 }, heading: 0, tilt: 0 }),
  },
  map: { layers: [] },
};

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

vi.mock('@arcgis/core/views/SceneView', () => ({
  default: vi.fn().mockImplementation((opts) => {
    if (opts?.map) {
      mockSceneView.map = opts.map;
    }
    return mockSceneView;
  }),
}));

vi.mock('@arcgis/core/geometry/SpatialReference', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/layers/TileLayer', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/layers/ElevationLayer', () => ({
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
      mockReactiveWatchCallbacks.push({ getter, callback });
      return { remove: vi.fn() };
    }),
  },
  watch: vi.fn((getter: any, callback: any) => {
    mockReactiveWatchCallbacks.push({ getter, callback });
    return { remove: vi.fn() };
  }),
}));

describe('MarsGlobeView & GlobeControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReactiveWatchCallbacks.length = 0;
    for (const key of Object.keys(mockSceneViewHandlers)) {
      delete mockSceneViewHandlers[key];
    }
    delete (window as any).WebGLRenderingContext;
  });

  describe('GlobeControls', () => {
    it('renders navigation buttons and triggers camera controls', () => {
      const handleReset = vi.fn();
      const handleNorth = vi.fn();
      const handleTilt = vi.fn();

      render(
        <GlobeControls
          onResetView={handleReset}
          onRotateNorth={handleNorth}
          onToggleTilt={handleTilt}
        />
      );

      const resetBtn = screen.getByRole('button', { name: /Reset orbital view/i });
      fireEvent.click(resetBtn);
      expect(handleReset).toHaveBeenCalledTimes(1);

      const northBtn = screen.getByRole('button', { name: /Orient north/i });
      fireEvent.click(northBtn);
      expect(handleNorth).toHaveBeenCalledTimes(1);

      const tiltBtn = screen.getByRole('button', { name: /Toggle surface tilt/i });
      fireEvent.click(tiltBtn);
      expect(handleTilt).toHaveBeenCalledTimes(1);
    });
  });

  describe('MarsGlobeView', () => {
    it('renders globe container and navigation controls overlay', () => {
      render(<MarsGlobeView />);
      expect(screen.getByTestId('ares-globe-container')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset orbital view/i })).toBeInTheDocument();
    });

    it('renders target landing site callout with 2D exploration action', async () => {
      useAppStore.setState({
        selectedLandingSiteId: 'opportunity',
        viewMode: 'GLOBAL_3D',
      });

      render(<MarsGlobeView />);
      expect(screen.getByText(/Opportunity \(Meridiani Planum\)/i)).toBeInTheDocument();

      const exploreBtn = screen.getByRole('button', { name: /Enter 2D Regional Map/i });
      expect(exploreBtn).toBeInTheDocument();

      fireEvent.click(exploreBtn);
      expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');
      expect(useAppStore.getState().regionalCenter.latitude).toBeCloseTo(-1.95, 2);
      expect(useAppStore.getState().regionalCenter.longitude).toBeCloseTo(-5.53, 2);
    });

    it('mounts useMarsLayerSync hook with SceneView reference and readiness state', async () => {
      (window as any).WebGLRenderingContext = vi.fn();

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockUseMarsLayerSync).toHaveBeenCalledWith(mockSceneView, true);
      });
    });

    it('updates telemetry.scale when camera scale changes in 3D SceneView', async () => {
      (window as any).WebGLRenderingContext = vi.fn();

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      // Find the scale watch callback
      const scaleWatcher = mockReactiveWatchCallbacks.find((w) => {
        mockSceneView.scale = 7500000;
        return w.getter() === 7500000;
      });
      expect(scaleWatcher).toBeDefined();

      act(() => {
        scaleWatcher?.callback(7500000);
      });

      expect(useAppStore.getState().telemetry.scale).toBe('1:7,500,000');
    });

    it('updates telemetry.elevation on pointer-move using queryPointElevation', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        telemetry: {
          ...useAppStore.getState().telemetry,
          elevation: 0,
        },
      });

      mockSceneView.toMap.mockReturnValue({
        longitude: 226.2,
        latitude: 18.65,
      });

      const queryElevationSpy = vi.spyOn(terrainElevationService, 'queryPointElevation');

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const pointerMoveHandler = mockSceneViewHandlers['pointer-move'];
      expect(pointerMoveHandler).toBeDefined();

      await act(async () => {
        await pointerMoveHandler({ x: 100, y: 200 });
      });

      await waitFor(() => {
        expect(queryElevationSpy).toHaveBeenCalledWith(226.2, 18.65, expect.anything());
        expect(useAppStore.getState().telemetry.elevation).toBe(21229);
      });
    });

    it('triggers inspectMartianTerrain and sets activeTerrainInspection on surface click', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({ activeTerrainInspection: null });

      mockSceneView.toMap.mockReturnValue({
        longitude: 77.45,
        latitude: 18.38,
      });

      const inspectSpy = vi.spyOn(terrainElevationService, 'inspectMartianTerrain');

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const clickHandler = mockSceneViewHandlers['click'];
      expect(clickHandler).toBeDefined();

      await act(async () => {
        await clickHandler({ x: 300, y: 400 });
      });

      await waitFor(() => {
        expect(inspectSpy).toHaveBeenCalledWith(77.45, 18.38, expect.anything());
        const inspection = useAppStore.getState().activeTerrainInspection;
        expect(inspection).not.toBeNull();
        expect(inspection?.elevationMeters).toBe(-2560);
        expect(inspection?.quadrangleName).toBe('MC-11 Syrtis Major');
      });
    });

    it('triggers ground-level 3D POV fly-to when selectedLandmarkId changes in LOCAL_ANALYSIS mode', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        viewMode: 'LOCAL_ANALYSIS',
        selectedLandmarkId: null,
      });

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      mockSceneView.goTo.mockClear();

      await act(async () => {
        useAppStore.setState({ selectedLandmarkId: 'olympus-mons' });
      });

      await waitFor(() => {
        expect(mockSceneView.goTo).toHaveBeenCalled();
        const callArgs = mockSceneView.goTo.mock.calls[0][0];
        expect(callArgs.target.x).toBeCloseTo(-133.8, 1);
        expect(callArgs.target.y).toBeCloseTo(18.65, 1);
        expect(callArgs.tilt).toBeGreaterThanOrEqual(60);
      });
    });

    it('synchronizes rover traverse track and sol milestones onto 3D graphics layer', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        selectedRoverId: 'perseverance',
        isRoverTraverseVisible: true,
        activeSol: 420,
      });

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const traverseLayer = (mockSceneView.map.layers as any).find(
        (l: any) => l.id === 'mars-rover-traverse-layer'
      );
      expect(traverseLayer).toBeDefined();

      await waitFor(() => {
        expect(traverseLayer.graphics.length).toBeGreaterThan(0);
      });

      // Verify click hitTest on a sol milestone updates activeSol
      const clickHandler = mockSceneViewHandlers['click'];
      expect(clickHandler).toBeDefined();

      mockSceneView.hitTest.mockResolvedValueOnce({
        results: [
          {
            graphic: {
              attributes: { sol: 174 },
            },
          },
        ],
      });

      await act(async () => {
        await clickHandler({ x: 200, y: 300 });
      });

      expect(useAppStore.getState().activeSol).toBe(174);
    });

    it('renders Opportunity traverse with emerald palette and 22 milestones', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        selectedRoverId: 'opportunity',
        isRoverTraverseVisible: true,
        activeSol: null,
      });

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const traverseLayer = (mockSceneView.map.layers as any).find(
        (l: any) => l.id === 'mars-rover-traverse-layer'
      );
      expect(traverseLayer).toBeDefined();

      await waitFor(() => {
        expect(traverseLayer.graphics.length).toBeGreaterThanOrEqual(20);
      });

      // Verify line graphic has emerald color
      const lineGraphic = traverseLayer.graphics.find((g: any) => g.symbol?.type === 'simple-line');
      expect(lineGraphic).toBeDefined();
      expect(lineGraphic.symbol.color).toMatchObject({ r: 16, g: 185, b: 129, a: 0.95 });
    });

    it('synchronizes Phase 09 route planning candidate paths and origin/dest pins', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        routeOrigin: { lon: 77.45, lat: 18.38 },
        routeDestination: { lon: 77.38, lat: 18.42 },
        candidateRoutes: [
          {
            id: 'SAFEST',
            name: 'Safest Route',
            description: 'Safest',
            colorHex: '#10B981',
            colorRgba: [16, 185, 129, 0.95],
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

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const routesLayer = (mockSceneView.map.layers as any).find(
        (l: any) => l.id === 'mars-routes-layer'
      );
      expect(routesLayer).toBeDefined();

      await waitFor(() => {
        expect(routesLayer.graphics.length).toBeGreaterThanOrEqual(3); // origin pin + dest pin + route line
      });

      // Verify origin diamond pin
      const originPin = routesLayer.graphics.find(
        (g: any) => g.geometry?.x === 77.45 && g.symbol?.style === 'diamond'
      );
      expect(originPin).toBeDefined();
    });

    it('intercepts map click when isPickingRoutePoint is active to record coordinates', async () => {
      (window as any).WebGLRenderingContext = vi.fn();
      useAppStore.setState({
        isPickingRoutePoint: 'origin',
        routeOrigin: null,
      });

      render(<MarsGlobeView />);

      await waitFor(() => {
        expect(mockSceneView.when).toHaveBeenCalled();
      });

      const clickHandler = mockSceneViewHandlers['click'];
      expect(clickHandler).toBeDefined();

      await act(async () => {
        await clickHandler({
          mapPoint: { longitude: 189.7, latitude: 39.3 },
        });
      });

      expect(useAppStore.getState().routeOrigin).toEqual({ lon: 189.7, lat: 39.3 });
      expect(useAppStore.getState().isPickingRoutePoint).toBeNull();
    });
  });
});


