import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MeasurementToolbar } from './MeasurementToolbar.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('MeasurementToolbar', () => {
  beforeEach(() => {
    useAppStore.setState({
      activeMeasurementTool: 'distance',
      isMeasurementActive: true,
      measurementPoints: [],
      elevationTransect: null,
    });
  });

  it('renders measurement toolbar with tool options when active', () => {
    render(<MeasurementToolbar />);

    expect(screen.getByRole('toolbar', { name: /Martian Geodesic Measurement/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Geodesic Distance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spherical Area/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Elevation Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Points/i })).toBeInTheDocument();
  });

  it('switches between distance, area, and elevation profile tools', () => {
    render(<MeasurementToolbar />);

    const areaBtn = screen.getByRole('button', { name: /Spherical Area/i });
    fireEvent.click(areaBtn);
    expect(useAppStore.getState().activeMeasurementTool).toBe('area');

    const profileBtn = screen.getByRole('button', { name: /Elevation Profile/i });
    fireEvent.click(profileBtn);
    expect(useAppStore.getState().activeMeasurementTool).toBe('profile');
  });

  it('displays calculated geodesic distance when points are added', () => {
    useAppStore.setState({
      activeMeasurementTool: 'distance',
      measurementPoints: [
        { lon: 77.45, lat: 18.38 },
        { lon: 78.45, lat: 18.38 },
      ],
    });

    render(<MeasurementToolbar />);

    expect(screen.getByText('Distance:')).toBeInTheDocument();
    expect(screen.getAllByText(/km/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays calculated polygon area when 3+ vertices are added', () => {
    useAppStore.setState({
      activeMeasurementTool: 'area',
      measurementPoints: [
        { lon: 0, lat: 0 },
        { lon: 10, lat: 0 },
        { lon: 10, lat: 10 },
      ],
    });

    render(<MeasurementToolbar />);

    expect(screen.getByText('Area:')).toBeInTheDocument();
    expect(screen.getByText(/km²/i)).toBeInTheDocument();
  });

  it('clears points when Clear button is clicked', () => {
    useAppStore.setState({
      measurementPoints: [
        { lon: 77.45, lat: 18.38 },
        { lon: 78.45, lat: 18.38 },
      ],
    });

    render(<MeasurementToolbar />);

    const clearBtn = screen.getByRole('button', { name: /Clear Points/i });
    fireEvent.click(clearBtn);

    expect(useAppStore.getState().measurementPoints).toEqual([]);
  });

  it('closes toolbar when close button is clicked', () => {
    render(<MeasurementToolbar />);

    const closeBtn = screen.getByRole('button', { name: /Close Measurement/i });
    fireEvent.click(closeBtn);

    expect(useAppStore.getState().activeMeasurementTool).toBeNull();
  });
});
