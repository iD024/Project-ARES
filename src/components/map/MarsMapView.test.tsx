import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsMapView } from './MarsMapView.tsx';
import { MapControls } from './MapControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

const mockUseMarsLayerSync = vi.fn();
vi.mock('../../hooks/useMarsLayerSync.ts', () => ({
  useMarsLayerSync: (...args: any[]) => mockUseMarsLayerSync(...args),
  default: (...args: any[]) => mockUseMarsLayerSync(...args),
}));

const mockMapWatchCallbacks: Array<{ getter: () => any; callback: (val: any) => void }> = [];

const mockMapView = {
  when: vi.fn().mockResolvedValue(true),
  on: vi.fn(),
  goTo: vi.fn(),
  destroy: vi.fn(),
  toMap: vi.fn(),
  scale: 500000,
  map: { layers: [] },
};

vi.mock('@arcgis/core/views/MapView', () => ({
  default: vi.fn().mockImplementation(() => mockMapView),
}));

vi.mock('@arcgis/core/Map', () => ({
  default: vi.fn().mockImplementation((opts) => ({ ...opts, layers: [] })),
}));

vi.mock('@arcgis/core/geometry/SpatialReference', () => ({
  default: vi.fn().mockImplementation((opts) => opts),
}));

vi.mock('@arcgis/core/layers/TileLayer', () => ({
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
});

