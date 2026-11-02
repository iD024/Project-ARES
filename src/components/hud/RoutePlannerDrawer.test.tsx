import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoutePlannerDrawer } from './RoutePlannerDrawer.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import * as routePlanningService from '../../services/data/routePlanningService.ts';

describe('RoutePlannerDrawer Component (Phase 09)', () => {
  beforeEach(() => {
    useAppStore.setState({
      activeDrawer: 'routes',
      routeOrigin: { lon: 77.45, lat: 18.38 },
      routeDestination: { lon: 77.38, lat: 18.42 },
      activeVehicleProfile: 'HEAVY_ROVER',
      candidateRoutes: [],
      selectedRouteIndex: 0,
      isPickingRoutePoint: null,
    });
  });

  it('renders drawer header, coordinate inputs, and vehicle selector', () => {
    render(<RoutePlannerDrawer />);

    expect(screen.getByText(/SURFACE ROUTE PLANNER/i)).toBeInTheDocument();
    expect(screen.getByText(/Mars 2000 Geodetic/i)).toBeInTheDocument();

    // Verify coordinate input labels
    expect(screen.getByLabelText(/Origin Longitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Origin Latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination Longitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination Latitude/i)).toBeInTheDocument();

    // Verify vehicle profile buttons
    expect(screen.getByText(/Heavy Rover/i)).toBeInTheDocument();
    expect(screen.getByText(/Scout Rover/i)).toBeInTheDocument();
    expect(screen.getByText(/Aerial Drone/i)).toBeInTheDocument();
  });

  it('allows selecting preset mission scenarios', () => {
    render(<RoutePlannerDrawer />);

    const select = screen.getByLabelText(/Preset Mission Scenario/i);
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'arcadia-base-ice-corridor' } });

    const state = useAppStore.getState();
    expect(state.routeOrigin?.lat).toBeCloseTo(39.3, 1);
    expect(state.routeDestination?.lat).toBeCloseTo(40.5, 1);
  });

  it('triggers route calculation and renders candidate comparison cards', async () => {
    const mockPlanRoutes = vi.spyOn(routePlanningService, 'planMarsRoutes').mockResolvedValueOnce([
      {
        id: 'SAFEST',
        name: 'Safest Traversal Route',
        description: 'Valley corridor',
        colorHex: '#10B981',
        colorRgba: [16, 185, 129, 0.95],
        waypoints: [],
        totalDistanceKm: 3.45,
        maxSlopeDegrees: 4.5,
        averageSlopeDegrees: 2.1,
        elevationChangeMeters: 50,
        totalAscentMeters: 50,
        totalDescentMeters: 0,
        estimatedSols: 35,
        isTraversable: true,
        elevationTransect: {
          points: [],
          totalDistanceKm: 3.45,
          minElevationMeters: -2560,
          maxElevationMeters: -2510,
          elevationChangeMeters: 50,
          averageSlopeDegrees: 2.1,
        },
      },
      {
        id: 'BALANCED',
        name: 'Balanced Reconnaissance Route',
        description: 'Balanced path',
        colorHex: '#06B6D4',
        colorRgba: [6, 182, 212, 0.95],
        waypoints: [],
        totalDistanceKm: 3.12,
        maxSlopeDegrees: 7.2,
        averageSlopeDegrees: 3.4,
        elevationChangeMeters: 50,
        totalAscentMeters: 50,
        totalDescentMeters: 0,
        estimatedSols: 32,
        isTraversable: true,
        elevationTransect: {
          points: [],
          totalDistanceKm: 3.12,
          minElevationMeters: -2560,
          maxElevationMeters: -2510,
          elevationChangeMeters: 50,
          averageSlopeDegrees: 3.4,
        },
      },
      {
        id: 'DIRECT',
        name: 'Direct Distance Route',
        description: 'Direct straight path',
        colorHex: '#F59E0B',
        colorRgba: [245, 158, 11, 0.95],
        waypoints: [],
        totalDistanceKm: 2.85,
        maxSlopeDegrees: 14.8,
        averageSlopeDegrees: 6.2,
        elevationChangeMeters: 50,
        totalAscentMeters: 50,
        totalDescentMeters: 0,
        estimatedSols: 29,
        isTraversable: true,
        elevationTransect: {
          points: [],
          totalDistanceKm: 2.85,
          minElevationMeters: -2560,
          maxElevationMeters: -2510,
          elevationChangeMeters: 50,
          averageSlopeDegrees: 6.2,
        },
      },
    ]);

    render(<RoutePlannerDrawer />);

    const calculateBtn = screen.getByRole('button', { name: /Calculate Optimal Routes/i });
    fireEvent.click(calculateBtn);

    await waitFor(() => {
      expect(mockPlanRoutes).toHaveBeenCalled();
      expect(screen.getByText(/Safest Traversal Route/i)).toBeInTheDocument();
      expect(screen.getByText(/Balanced Reconnaissance Route/i)).toBeInTheDocument();
      expect(screen.getByText(/Direct Distance Route/i)).toBeInTheDocument();
    });

    // Selecting candidate route
    const balancedCard = screen.getByText(/Balanced Reconnaissance Route/i);
    fireEvent.click(balancedCard);
    expect(useAppStore.getState().selectedRouteIndex).toBe(1);

    // Verify mandatory disclaimer is present
    expect(screen.getByText(/Does not account for sub-meter boulder fields/i)).toBeInTheDocument();
  });

  it('toggles map point picking mode', () => {
    render(<RoutePlannerDrawer />);

    const pickOriginBtn = screen.getByRole('button', { name: /Pick Origin on Map/i });
    fireEvent.click(pickOriginBtn);
    expect(useAppStore.getState().isPickingRoutePoint).toBe('origin');

    fireEvent.click(pickOriginBtn);
    expect(useAppStore.getState().isPickingRoutePoint).toBeNull();
  });

  it('opens scientific intelligence drawer on route evaluation click', () => {
    useAppStore.setState({ activeDrawer: 'routes' });
    render(<RoutePlannerDrawer />);

    const whyBtn = screen.getByRole('button', { name: /Why this route\?/i });
    fireEvent.click(whyBtn);

    expect(useAppStore.getState().activeDrawer).toBe('intel');
    expect(useAppStore.getState().activeIntelTab).toBe('routes');
  });
});

