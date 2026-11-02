import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ElevationProfileTray } from './ElevationProfileTray.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import { ElevationTransectResult } from '../../services/data/measurementService.ts';

const MOCK_TRANSECT: ElevationTransectResult = {
  totalDistanceKm: 150.5,
  minElevationMeters: -3200,
  maxElevationMeters: 1450,
  elevationChangeMeters: 4650,
  averageSlopeDegrees: 3.4,
  points: [
    { fraction: 0.0, distanceKm: 0, longitude: 77.0, latitude: 18.0, elevationMeters: -3200 },
    { fraction: 0.5, distanceKm: 75.25, longitude: 77.5, latitude: 18.5, elevationMeters: -1200 },
    { fraction: 1.0, distanceKm: 150.5, longitude: 78.0, latitude: 19.0, elevationMeters: 1450 },
  ],
};

describe('ElevationProfileTray', () => {
  beforeEach(() => {
    useAppStore.setState({
      elevationTransect: null,
      activeMeasurementTool: 'profile',
    });
  });

  it('renders nothing when elevationTransect is null', () => {
    const { container } = render(<ElevationProfileTray />);
    expect(container.firstChild).toBeNull();
  });

  it('renders transect metrics and elevation chart when profile is available', () => {
    useAppStore.setState({ elevationTransect: MOCK_TRANSECT });
    render(<ElevationProfileTray />);

    expect(screen.getByText('Martian Elevation Cross-Section')).toBeInTheDocument();
    expect(screen.getByText(/150\.5 km/i)).toBeInTheDocument();
    expect(screen.getByText(/-3,200 m/i)).toBeInTheDocument();
    expect(screen.getByText(/\+1,450 m/i)).toBeInTheDocument();
    expect(screen.getByText(/4,650 m/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.4°/i)).toBeInTheDocument();
  });

  it('allows closing the transect tray', () => {
    useAppStore.setState({ elevationTransect: MOCK_TRANSECT });
    render(<ElevationProfileTray />);

    const closeBtn = screen.getByRole('button', { name: /Close Profile/i });
    fireEvent.click(closeBtn);

    expect(useAppStore.getState().elevationTransect).toBeNull();
  });

  it('supports minimizing and expanding tray', () => {
    useAppStore.setState({ elevationTransect: MOCK_TRANSECT });
    render(<ElevationProfileTray />);

    const collapseBtn = screen.getByRole('button', { name: /Minimize Profile/i });
    fireEvent.click(collapseBtn);

    expect(screen.queryByTestId('profile-chart-area')).not.toBeInTheDocument();

    const expandBtn = screen.getByRole('button', { name: /Expand Profile/i });
    fireEvent.click(expandBtn);

    expect(screen.getByTestId('profile-chart-area')).toBeInTheDocument();
  });
});

