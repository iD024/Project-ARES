import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TerrainLegendPanel } from './TerrainLegendPanel.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('TerrainLegendPanel component', () => {
  beforeEach(() => {
    useAppStore.setState({ isLegendOpen: true });
  });

  it('does not render when isLegendOpen is false', () => {
    useAppStore.setState({ isLegendOpen: false });
    const { container } = render(<TerrainLegendPanel />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('terrain-legend-panel')).not.toBeInTheDocument();
  });

  it('renders the three terrain legend sections: Elevation, Regional Slope, and Chronostratigraphy', () => {
    render(<TerrainLegendPanel />);

    expect(screen.getByTestId('terrain-legend-panel')).toBeInTheDocument();
    expect(screen.getByText(/Elevation \(Topography\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Regional Slope/i)).toBeInTheDocument();
    expect(screen.getByText(/Chronostratigraphy/i)).toBeInTheDocument();
  });

  it('displays elevation color ramp from -8,200 m to +21,229 m with zero datum highlighted', () => {
    render(<TerrainLegendPanel />);

    // Elevation extents
    expect(screen.getByText(/-8,200\s*m/i)).toBeInTheDocument();
    expect(screen.getByText(/\+21,229\s*m/i)).toBeInTheDocument();

    // Zero datum indicator
    expect(screen.getByText(/^0\s*m$/i)).toBeInTheDocument();
    expect(screen.getByText(/Datum/i)).toBeInTheDocument();
  });

  it('displays regional slope brackets with mandatory DEM disclaimer', () => {
    render(<TerrainLegendPanel />);

    // Slope brackets
    expect(screen.getByText(/0°[–-]5°/i)).toBeInTheDocument();
    expect(screen.getByText(/5°[–-]15°/i)).toBeInTheDocument();
    expect(screen.getByText(/15°[–-]25°/i)).toBeInTheDocument();
    expect(screen.getByText(/>\s*25°/i)).toBeInTheDocument();

    // Mandatory scientific disclaimer
    expect(
      screen.getByText(/Regional terrain gradient derived from 200m DEM/i)
    ).toBeInTheDocument();
  });

  it('displays Martian chronostratigraphy with Amazonian, Hesperian, and Noachian epochs', () => {
    render(<TerrainLegendPanel />);

    // Chronostratigraphic epochs and age constraints
    expect(screen.getByText(/Amazonian/i)).toBeInTheDocument();
    expect(screen.getByText(/<\s*3\.0\s*Ga/i)).toBeInTheDocument();

    expect(screen.getByText(/Hesperian/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.0[–-]3\.7\s*Ga/i)).toBeInTheDocument();

    expect(screen.getByText(/Noachian/i)).toBeInTheDocument();
    expect(screen.getByText(/>\s*3\.7\s*Ga/i)).toBeInTheDocument();
  });

  it('closes cleanly when the close button is clicked', () => {
    render(<TerrainLegendPanel />);

    const closeButton = screen.getByRole('button', { name: /close legend/i });
    fireEvent.click(closeButton);

    expect(useAppStore.getState().isLegendOpen).toBe(false);
  });

  it('toggles collapsible body when collapse/expand button is clicked', () => {
    render(<TerrainLegendPanel />);

    const toggleButton = screen.getByRole('button', { name: /collapse|expand/i });
    // Initially content is visible
    expect(screen.getByTestId('terrain-legend-content')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('terrain-legend-content')).not.toBeInTheDocument();

    // Click to expand again
    fireEvent.click(toggleButton);
    expect(screen.getByTestId('terrain-legend-content')).toBeInTheDocument();
  });

  it('supports switching tabs between Elevation, Slope, and Geology', () => {
    render(<TerrainLegendPanel />);

    // Check tabs exist
    const slopeTab = screen.getByRole('tab', { name: /Slope/i });
    fireEvent.click(slopeTab);

    // In slope tab, slope disclaimer should be visible
    expect(screen.getByText(/Regional terrain gradient derived from 200m DEM/i)).toBeInTheDocument();

    const elevTab = screen.getByRole('tab', { name: /Elevation/i });
    fireEvent.click(elevTab);
    expect(screen.getByText(/-8,200\s*m/i)).toBeInTheDocument();

    const geoTab = screen.getByRole('tab', { name: /Geology|Chronostratigraphy/i });
    fireEvent.click(geoTab);
    expect(screen.getByText(/Amazonian/i)).toBeInTheDocument();
  });
});
