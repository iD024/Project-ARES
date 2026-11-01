import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarsMapView } from './MarsMapView.tsx';
import { MapControls } from './MapControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

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
});
