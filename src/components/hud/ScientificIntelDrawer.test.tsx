import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ScientificIntelDrawer } from './ScientificIntelDrawer.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('ScientificIntelDrawer', () => {
  beforeEach(() => {
    useAppStore.setState({
      activeDrawer: null,
      activeIntelTab: 'layers',
      intelFocusedDatasetId: null,
      intelFocusedGeologyPeriod: null,
      intelFocusedQuadCode: null,
    });
  });

  it('renders nothing when activeDrawer is not "intel"', () => {
    render(<ScientificIntelDrawer />);
    expect(screen.queryByTestId('scientific-intel-drawer')).toBeNull();
  });

  it('renders drawer header and navigation tabs when activeDrawer is "intel"', () => {
    useAppStore.setState({ activeDrawer: 'intel' });
    render(<ScientificIntelDrawer />);

    expect(screen.getByTestId('scientific-intel-drawer')).toBeDefined();
    expect(screen.getByText(/SCIENTIFIC INTELLIGENCE/i)).toBeDefined();

    // 4 tab buttons
    expect(screen.getByRole('tab', { name: /Layers/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Geology/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Terrain/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /Routes/i })).toBeDefined();
  });

  it('switches tabs and updates activeIntelTab in store', () => {
    useAppStore.setState({ activeDrawer: 'intel' });
    render(<ScientificIntelDrawer />);

    // Click Geology tab
    const geologyTab = screen.getByRole('tab', { name: /Geology/i });
    fireEvent.click(geologyTab);
    expect(useAppStore.getState().activeIntelTab).toBe('geology');
    expect(screen.getByText(/Chronostratigraphic Epochs/i)).toBeDefined();

    // Click Terrain tab
    const terrainTab = screen.getByRole('tab', { name: /Terrain/i });
    fireEvent.click(terrainTab);
    expect(useAppStore.getState().activeIntelTab).toBe('terrain');
    expect(screen.getAllByText(/Laser Altimetry/i).length).toBeGreaterThan(0);

    // Click Routes tab
    const routesTab = screen.getByRole('tab', { name: /Routes/i });
    fireEvent.click(routesTab);
    expect(useAppStore.getState().activeIntelTab).toBe('routes');
    expect(screen.getByText(/A\* Cost Formulation/i)).toBeDefined();
  });

  it('filters datasets by search query in the layers tab', () => {
    useAppStore.setState({ activeDrawer: 'intel', activeIntelTab: 'layers' });
    render(<ScientificIntelDrawer />);

    const searchInput = screen.getByPlaceholderText(/Search datasets/i);
    fireEvent.change(searchInput, { target: { value: 'InSight' } });

    // Should show InSight seismic catalog and hide Viking
    expect(screen.getByText(/InSight Marsquake Seismic Catalog/i)).toBeDefined();
    expect(screen.queryByText(/Viking MDIM 2.1 Color Mosaic/i)).toBeNull();
  });

  it('highlights deep-linked dataset when focused', () => {
    useAppStore.setState({
      activeDrawer: 'intel',
      activeIntelTab: 'layers',
      intelFocusedDatasetId: 'mars-mcolordem-shaded-relief',
    });
    render(<ScientificIntelDrawer />);

    const highlightedCard = screen.getByTestId('dataset-dossier-mars-mcolordem-shaded-relief');
    expect(highlightedCard).toBeDefined();
    expect(highlightedCard.className).toContain('border-purple-400');
  });

  it('copies citation to clipboard on click', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    useAppStore.setState({ activeDrawer: 'intel', activeIntelTab: 'layers' });
    render(<ScientificIntelDrawer />);

    const copyButtons = screen.getAllByRole('button', { name: /Copy Citation/i });
    expect(copyButtons.length).toBeGreaterThan(0);

    fireEvent.click(copyButtons[0]);
    expect(writeTextMock).toHaveBeenCalled();
  });

  it('closes drawer on close button click', () => {
    useAppStore.setState({ activeDrawer: 'intel' });
    render(<ScientificIntelDrawer />);

    const closeButton = screen.getByLabelText(/Close Scientific Intelligence/i);
    fireEvent.click(closeButton);

    expect(useAppStore.getState().activeDrawer).toBeNull();
  });
});
