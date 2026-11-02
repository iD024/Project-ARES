import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MissionControlDrawer } from './MissionControlDrawer.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('MissionControlDrawer', () => {
  beforeEach(() => {
    useAppStore.setState({
      isMissionControlOpen: true,
      selectedRoverId: null,
      activeSol: null,
      isRoverTraverseVisible: false,
    });
  });

  it('renders nothing when closed', () => {
    useAppStore.setState({ isMissionControlOpen: false });
    const { container } = render(
      <MissionControlDrawer isOpen={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders rover mission tabs and details when open', () => {
    render(<MissionControlDrawer isOpen={true} onClose={() => {}} />);
    expect(screen.getByText(/MISSION CONTROL/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Perseverance/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Curiosity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Opportunity/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spirit/i })).toBeInTheDocument();

    // Default tab should be Perseverance
    expect(screen.getByText(/Perseverance Rover \(Mars 2020\)/i)).toBeInTheDocument();
    expect(screen.getByText(/PIXL/i)).toBeInTheDocument();
    expect(screen.getByText(/SHERLOC/i)).toBeInTheDocument();
    expect(screen.getByText(/RIMFAX/i)).toBeInTheDocument();
  });

  it('switches tabs to Curiosity and displays MSL instruments and details', () => {
    render(<MissionControlDrawer isOpen={true} onClose={() => {}} />);
    const curiosityTab = screen.getByRole('button', { name: /Curiosity/i });
    fireEvent.click(curiosityTab);

    expect(screen.getByText(/Curiosity Rover \(MSL\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SAM/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/ChemCam/i)).toBeInTheDocument();
    expect(screen.getByText(/CheMin/i)).toBeInTheDocument();
  });

  it('activates rover tracking and updates store when Track Rover button is clicked', () => {
    let closed = false;
    render(<MissionControlDrawer isOpen={true} onClose={() => { closed = true; }} />);

    const trackBtn = screen.getByRole('button', { name: /Track Rover on Mars/i });
    fireEvent.click(trackBtn);

    const state = useAppStore.getState();
    expect(state.selectedRoverId).toBe('perseverance');
    expect(state.isRoverTraverseVisible).toBe(true);
    expect(state.activeSol).not.toBeNull();
    expect(closed).toBe(true);
  });

  it('contains valid NASA PDS archive link', () => {
    render(<MissionControlDrawer isOpen={true} onClose={() => {}} />);
    const pdsLink = screen.getByRole('link', { name: /View NASA PDS Archive/i });
    expect(pdsLink).toHaveAttribute('href', expect.stringContaining('pds'));
    expect(pdsLink).toHaveAttribute('target', '_blank');
  });
});
