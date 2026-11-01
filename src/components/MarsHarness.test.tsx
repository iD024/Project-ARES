import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarsHarness from './MarsHarness.tsx';

describe('MarsHarness Component', () => {
  it('renders the Mars viewport container and geodetic reference indicator', () => {
    render(<MarsHarness />);
    
    // Check map container exists
    const container = screen.getByTestId('ares-map-container');
    expect(container).toBeInTheDocument();

    // Check geodetic status indicator displays WKID 104905
    expect(screen.getByText(/GCS_Mars_2000/i)).toBeInTheDocument();
    expect(screen.getByText(/104905/i)).toBeInTheDocument();
  });

  it('renders planetary telemetry HUD pill with Mars radius', () => {
    render(<MarsHarness />);
    expect(screen.getByText(/3,396\.19 km/i)).toBeInTheDocument();
  });
});

