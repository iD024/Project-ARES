import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ToolsDrawer } from './ToolsDrawer.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('ToolsDrawer component', () => {
  it('renders landing sites and provides action to explore in 2D map', () => {
    useAppStore.setState({
      selectedLandingSiteId: 'perseverance',
      viewMode: 'GLOBAL_3D',
    });

    render(<ToolsDrawer isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText(/Perseverance \(Jezero Crater\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Neretva Vallis Delta/i)).toBeInTheDocument();

    // Check for "Explore in 2D Map" button on the selected site
    const exploreBtn = screen.getByRole('button', { name: /Explore in 2D Map/i });
    expect(exploreBtn).toBeInTheDocument();

    fireEvent.click(exploreBtn);
    expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');
  });

  it('renders Regions tab and allows selecting an exploration region to dive into 2D', () => {
    useAppStore.setState({ viewMode: 'GLOBAL_3D', selectedRegionId: null });

    render(<ToolsDrawer isOpen={true} onClose={vi.fn()} />);

    // Click on Regions tab
    const regionsTab = screen.getByRole('tab', { name: /Regions/i });
    expect(regionsTab).toBeInTheDocument();
    fireEvent.click(regionsTab);

    // Bounded exploration regions should be listed
    expect(screen.getByText(/Olympus Mons Caldera & Scarp/i)).toBeInTheDocument();
    expect(screen.getByText(/Valles Marineris/i)).toBeInTheDocument();

    // Click on Olympus Mons region card
    const olympusCard = screen.getByText(/Olympus Mons Caldera & Scarp/i).closest('div[role="button"]') ||
      screen.getByText(/Olympus Mons Caldera & Scarp/i).closest('.cursor-pointer');
    expect(olympusCard).toBeTruthy();
    if (olympusCard) {
      fireEvent.click(olympusCard);
    }

    expect(useAppStore.getState().selectedRegionId).toBe('olympus-mons');
    expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');
  });
});
