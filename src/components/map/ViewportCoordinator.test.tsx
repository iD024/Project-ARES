import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
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

  it('renders 2D Map container active when in LOCAL_ANALYSIS mode', () => {
    useAppStore.setState({ viewMode: 'LOCAL_ANALYSIS' });

    render(<ViewportCoordinator />);

    const globeContainer = screen.getByTestId('viewport-globe-container');
    const mapContainer = screen.getByTestId('viewport-map-container');

    expect(globeContainer).toHaveClass('opacity-0', 'pointer-events-none');
    expect(mapContainer).toHaveClass('opacity-100', 'pointer-events-auto');
  });
});
