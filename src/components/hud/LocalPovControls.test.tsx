import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocalPovControls } from './LocalPovControls.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('LocalPovControls component', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: 'LOCAL_ANALYSIS',
      selectedLandmarkId: 'olympus-mons',
      selectedLandingSiteId: 'perseverance',
    });
  });

  it('renders nothing when viewMode is not LOCAL_ANALYSIS', () => {
    useAppStore.setState({ viewMode: 'GLOBAL_3D' });
    const { container } = render(<LocalPovControls />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders POV flight deck when viewMode is LOCAL_ANALYSIS', () => {
    render(<LocalPovControls />);
    expect(screen.getByRole('region', { name: /Local 3D POV Flight Deck/i })).toBeInTheDocument();
    expect(screen.getByText(/3D POV INSPECTION/i)).toBeInTheDocument();
  });

  it('toggles 360 orbit mode when orbit button clicked', () => {
    render(<LocalPovControls />);
    const orbitBtn = screen.getByRole('button', { name: /360° Orbit/i });
    expect(orbitBtn).toBeInTheDocument();

    fireEvent.click(orbitBtn);
    expect(screen.getByText(/Orbiting Active/i)).toBeInTheDocument();
  });

  it('provides pitch preset buttons (Top-Down, Oblique, Ground POV, Horizon)', () => {
    const onPitchChange = vi.fn();
    render(<LocalPovControls onPitchChange={onPitchChange} />);

    const groundPovBtn = screen.getByRole('button', { name: /75° Ground/i });
    expect(groundPovBtn).toBeInTheDocument();
    fireEvent.click(groundPovBtn);
    expect(onPitchChange).toHaveBeenCalledWith(75);

    const horizonBtn = screen.getByRole('button', { name: /85° Horizon/i });
    fireEvent.click(horizonBtn);
    expect(onPitchChange).toHaveBeenCalledWith(85);
  });

  it('allows jumping between prominent landmarks', () => {
    render(<LocalPovControls />);
    const landmarkSelector = screen.getByRole('combobox', { name: /Landmark Selector/i });
    expect(landmarkSelector).toBeInTheDocument();

    fireEvent.change(landmarkSelector, { target: { value: 'valles-marineris' } });
    expect(useAppStore.getState().selectedLandmarkId).toBe('valles-marineris');
  });

  it('provides exit POV button that returns to GLOBAL_3D', () => {
    render(<LocalPovControls />);
    const exitBtn = screen.getByRole('button', { name: /Exit POV/i });
    expect(exitBtn).toBeInTheDocument();

    fireEvent.click(exitBtn);
    expect(useAppStore.getState().viewMode).toBe('GLOBAL_3D');
  });
});

