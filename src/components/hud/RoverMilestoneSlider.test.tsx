import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RoverMilestoneSlider } from './RoverMilestoneSlider.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('RoverMilestoneSlider component', () => {
  beforeEach(() => {
    useAppStore.setState({
      selectedRoverId: 'perseverance',
      activeSol: 420,
      isRoverTraverseVisible: true,
      viewMode: 'GLOBAL_3D',
    });
  });

  it('renders nothing when selectedRoverId is null', () => {
    useAppStore.setState({ selectedRoverId: null });
    const { container } = render(<RoverMilestoneSlider />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when isRoverTraverseVisible is false', () => {
    useAppStore.setState({ isRoverTraverseVisible: false });
    const { container } = render(<RoverMilestoneSlider />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders milestone details for active Sol', () => {
    render(<RoverMilestoneSlider />);
    expect(screen.getByRole('region', { name: /Rover Sol Milestone Timeline/i })).toBeInTheDocument();
    expect(screen.getByText(/Enchanted Lake Base Scarp/i)).toBeInTheDocument();
    expect(screen.getAllByText(/SOL 420/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/9.40 km/i)).toBeInTheDocument();
  });

  it('steps to previous and next milestones on button click', () => {
    render(<RoverMilestoneSlider />);

    const prevBtn = screen.getByRole('button', { name: /Previous Sol Milestone/i });
    expect(prevBtn).toBeInTheDocument();
    fireEvent.click(prevBtn);
    expect(useAppStore.getState().activeSol).toBe(380);

    const nextBtn = screen.getByRole('button', { name: /Next Sol Milestone/i });
    expect(nextBtn).toBeInTheDocument();
    fireEvent.click(nextBtn);
    expect(useAppStore.getState().activeSol).toBe(420);
  });

  it('triggers 3D Ground POV at Sol on button click', () => {
    render(<RoverMilestoneSlider />);

    const povBtn = screen.getByRole('button', { name: /3D Ground POV at Sol/i });
    expect(povBtn).toBeInTheDocument();

    fireEvent.click(povBtn);
    expect(useAppStore.getState().viewMode).toBe('LOCAL_ANALYSIS');
    expect(useAppStore.getState().telemetry.latitude).toBeCloseTo(18.385, 2);
    expect(useAppStore.getState().telemetry.longitude).toBeCloseTo(77.418, 2);
  });
});
