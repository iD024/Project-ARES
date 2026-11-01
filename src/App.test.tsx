import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.tsx';

describe('ARES Main Application Component', () => {
  it('renders the top HUD header and system identity', () => {
    render(<App />);
    expect(screen.getByText('ADVANCED RECONNAISSANCE AND EXPLORATION SYSTEM')).toBeInTheDocument();
    expect(screen.getAllByText(/ARES/i).length).toBeGreaterThan(0);
  });

  it('renders the bottom telemetry bar and Mars landing site count', () => {
    render(<App />);
    expect(screen.getByText(/PHASE 00 FOUNDATION/i)).toBeInTheDocument();
    expect(screen.getByText(/VERIFIED SITES:/i)).toBeInTheDocument();
    expect(screen.getByText(/Jezero Crater/i)).toBeInTheDocument();
  });
});
