import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsGlobeView } from './MarsGlobeView.tsx';
import { GlobeControls } from './GlobeControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

const mockUseMarsLayerSync = vi.fn();
vi.mock('../../hooks/useMarsLayerSync.ts', () => ({
  useMarsLayerSync: (...args: any[]) => mockUseMarsLayerSync(...args),
  default: (...args: any[]) => mockUseMarsLayerSync(...args),
}));

const mockReactiveWatchCallbacks: Array<{ getter: () => any; callback: (val: any) => void }> = [];

const mockSceneView = {
  when: vi.fn().mockResolvedValue(true),
  on: vi.fn(),
  goTo: vi.fn(),
  destroy: vi.fn(),
  toMap: vi.fn(),
  scale: 15000000,
  camera: {
    position: { x: 0, y: 0, z: 15000000 },
    clone: vi.fn().mockReturnValue({ position: { z: 15000000 }, heading: 0, tilt: 0 }),
  },
  map: { layers: [] },
};

vi.mock('@arcgis/core/Map', () => ({
  default: vi.fn().mockImplementation((opts) => ({ ...opts, layers: [] })),
}));

vi.mock('@arcgis/core/views/SceneView', () => ({
  default: vi.fn().mockImplementation(() => mockSceneView),
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
  default: vi.fn().mockImplementation((opts) => ({ ...opts, add: vi.fn() })),
}));

vi.mock('@arcgis/core/Graphic', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/geometry/Point', () => ({
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
  });
});


