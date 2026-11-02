import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TerrainInspectorCard } from './TerrainInspectorCard.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import { TerrainInspectionData } from '../../types/hud.ts';

describe('TerrainInspectorCard Component', () => {
  const mockInspectionData: TerrainInspectionData = {
    longitude: 77.45,
    latitude: 18.38,
    elevationMeters: -2560,
    regionalSlopeDegrees: 8.5,
    slopeCategory: 'MODERATE',
    quadrangleName: 'MC-11 Syrtis Major',
    geologicalPeriod: 'Noachian',
    classification: 'DERIVED',
  };

  beforeEach(() => {
    // Reset state before each test
    useAppStore.setState({ activeTerrainInspection: null });
  });

  it('does not render when activeTerrainInspection is null', () => {
    useAppStore.setState({ activeTerrainInspection: null });
    const { container } = render(<TerrainInspectorCard />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('terrain-inspector-card')).not.toBeInTheDocument();
  });

  it('renders coordinates with formatting (e.g. 77.45°E, 18.38°N)', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByTestId('terrain-inspector-card')).toBeInTheDocument();
    expect(screen.getByText(/77\.45°E,\s*18\.38°N/i)).toBeInTheDocument();
  });

  it('renders negative elevation in meters with sign (e.g. -2,560 m)', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/-2,560\s*m/i)).toBeInTheDocument();
  });

  it('renders positive elevation in meters with sign (e.g. +1,250 m)', () => {
    useAppStore.setState({
      activeTerrainInspection: {
        ...mockInspectionData,
        elevationMeters: 1250,
      },
    });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/\+1,250\s*m/i)).toBeInTheDocument();
  });

  it('renders zero elevation in meters (0 m)', () => {
    useAppStore.setState({
      activeTerrainInspection: {
        ...mockInspectionData,
        elevationMeters: 0,
      },
    });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/^0\s*m$/i)).toBeInTheDocument();
    expect(screen.getByTestId('terrain-inspector-elevation')).toHaveTextContent('0 m');
  });

  it('renders quadrangle name and code (e.g. MC-11 Syrtis Major)', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/MC-11 Syrtis Major/i)).toBeInTheDocument();
  });

  it('renders regional slope category and angle (e.g. MODERATE (8.5°))', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/MODERATE\s*\(8\.5°\)/i)).toBeInTheDocument();
  });

  it('renders mandatory scientific disclaimer', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(
      screen.getByText(/Regional terrain gradient derived from 200m DEM\. Not suitable for rover-scale obstacle navigation\./i)
    ).toBeInTheDocument();
  });

  it('renders scientific data badge (DERIVED)', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByText('DERIVED')).toBeInTheDocument();
  });

  it('renders geological period when provided', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    expect(screen.getByText(/Noachian/i)).toBeInTheDocument();
  });

  it('clears activeTerrainInspection in useAppStore when close button is clicked', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData });
    render(<TerrainInspectorCard />);

    const closeButton = screen.getByRole('button', { name: /close|dismiss/i });
    fireEvent.click(closeButton);

    expect(useAppStore.getState().activeTerrainInspection).toBeNull();
  });

  it('opens scientific intelligence drawer with geology focus when SCIENTIFIC DOSSIER is clicked', () => {
    useAppStore.setState({ activeTerrainInspection: mockInspectionData, activeDrawer: null });
    render(<TerrainInspectorCard />);

    const dossierBtn = screen.getByRole('button', { name: /Scientific Dossier/i });
    fireEvent.click(dossierBtn);

    expect(useAppStore.getState().activeDrawer).toBe('intel');
    expect(useAppStore.getState().activeIntelTab).toBe('geology');
    expect(useAppStore.getState().intelFocusedGeologyPeriod).toBe('Noachian');
  });
});
