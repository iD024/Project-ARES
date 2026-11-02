import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ViewportCoordinator } from './ViewportCoordinator.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('ViewportCoordinator component', () => {
  it('renders both 3D Globe and 2D Map containers with appropriate initial visibility', () => {
    useAppStore.setState({ viewMode: 'GLOBAL_3D' });

    render(<ViewportCoordinator />);

    const globeContainer = screen.getByTestId('viewport-globe-container');
    const mapContainer = screen.getByTestId('viewport-map-container');

    expect(globeContainer).toBeInTheDocument();
    expect(mapContainer).toBeInTheDocument();

    // Globe should be visible, Map should be hidden
    expect(globeContainer).toHaveClass('opacity-100', 'pointer-events-auto');
    expect(mapContainer).toHaveClass('opacity-0', 'pointer-events-none');
  });

  it('updates container visibility classes when viewMode switches to REGIONAL_2D', () => {
    useAppStore.setState({ viewMode: 'REGIONAL_2D' });

    render(<ViewportCoordinator />);

    const globeContainer = screen.getByTestId('viewport-globe-container');
    const mapContainer = screen.getByTestId('viewport-map-container');

    // Globe should be hidden, Map should be visible
    expect(globeContainer).toHaveClass('opacity-0', 'pointer-events-none');
    expect(mapContainer).toHaveClass('opacity-100', 'pointer-events-auto');
  });

  it('renders 3D Globe SceneView container active when in LOCAL_ANALYSIS mode (POV mode)', () => {
    useAppStore.setState({ viewMode: 'LOCAL_ANALYSIS' });

    render(<ViewportCoordinator />);

    const globeContainer = screen.getByTestId('viewport-globe-container');
    const mapContainer = screen.getByTestId('viewport-map-container');

    expect(globeContainer).toHaveClass('opacity-100', 'pointer-events-auto');
    expect(mapContainer).toHaveClass('opacity-0', 'pointer-events-none');
  });

  it('mounts floating MapAttributionOverlay overlay', () => {
    useAppStore.setState({
      layers: [
        {
          id: 'mars-viking-mdim21',
          name: 'Viking MDIM 2.1 Color Mosaic',
          subtitle: 'Mosaic',
          category: 'surface',
          classification: 'OBSERVED',
          provider: 'USGS',
          resolution: '232 m/px',
          coverage: 'Global',
          visible: true,
          opacity: 1,
          sourceUrl: 'https://...',
        },
      ],
    });

    render(<ViewportCoordinator />);

    expect(screen.getByTestId('map-attribution-overlay')).toBeInTheDocument();
  });

  it('mounts floating TerrainLegendPanel when isLegendOpen is true', () => {
    useAppStore.setState({ isLegendOpen: true });

    render(<ViewportCoordinator />);

    expect(screen.getByTestId('terrain-legend-panel')).toBeInTheDocument();
  });

  it('mounts MeasurementToolbar when measurement tool is active', () => {
    useAppStore.setState({
      activeMeasurementTool: 'distance',
      isMeasurementActive: true,
    });

    render(<ViewportCoordinator />);

    expect(screen.getByRole('toolbar', { name: /Martian Geodesic Measurement/i })).toBeInTheDocument();
  });

  it('mounts ElevationProfileTray when elevation transect is populated', () => {
    useAppStore.setState({
      elevationTransect: {
        totalDistanceKm: 120,
        minElevationMeters: -1500,
        maxElevationMeters: 2500,
        elevationChangeMeters: 4000,
        averageSlopeDegrees: 2.5,
        points: [
          { fraction: 0, distanceKm: 0, longitude: 0, latitude: 0, elevationMeters: -1500 },
          { fraction: 1, distanceKm: 120, longitude: 2, latitude: 2, elevationMeters: 2500 },
        ],
      },
    });

    render(<ViewportCoordinator />);

    expect(screen.getByText('Martian Elevation Cross-Section')).toBeInTheDocument();
  });

  it('mounts LocalPovControls when in LOCAL_ANALYSIS mode', () => {
    useAppStore.setState({ viewMode: 'LOCAL_ANALYSIS' });

    render(<ViewportCoordinator />);

    expect(screen.getByRole('region', { name: /Local 3D POV Flight Deck/i })).toBeInTheDocument();
  });
});
