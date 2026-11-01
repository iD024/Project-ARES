import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App.tsx';
import { useAppStore } from './store/useAppStore.ts';

describe('ARES Application Shell (Phase 01)', () => {
  it('renders dominant viewport placeholder, top command bar, and telemetry footer', () => {
    render(<App />);

    // Dominant Viewport Placeholder
    expect(screen.getByTestId('ares-viewport-placeholder')).toBeInTheDocument();
    expect(screen.getByText(/PHASE 01 — VIEWPORT READY FOR PHASE 02/i)).toBeInTheDocument();

    // Top Command Bar
    expect(screen.getByText('ARES')).toBeInTheDocument();
    expect(screen.getByText(/ADVANCED RECONNAISSANCE/i)).toBeInTheDocument();

    // Telemetry Footer
    expect(screen.getByText(/TELEMETRY/i)).toBeInTheDocument();
    expect(screen.getByText(/WKID 104905/i)).toBeInTheDocument();
  });

  it('opens Layers drawer when Layers trigger is clicked', () => {
    render(<App />);

    const layersBtn = screen.getByRole('button', { name: /Layers/i });
    fireEvent.click(layersBtn);

    expect(screen.getByText('Planetary Layer Catalog')).toBeInTheDocument();
    expect(screen.getByText('Viking MDIM 2.1 Color')).toBeInTheDocument();
  });

  it('opens Tools drawer when Sites trigger is clicked', () => {
    render(<App />);

    const sitesBtn = screen.getByRole('button', { name: /Sites/i });
    fireEvent.click(sitesBtn);

    expect(screen.getByText('Exploration & Terrain Tools')).toBeInTheDocument();
    expect(screen.getByText('Perseverance (Jezero Crater)')).toBeInTheDocument();
  });

  it('opens Provenance modal when Catalog trigger is clicked', () => {
    render(<App />);

    const catalogBtn = screen.getByRole('button', { name: /Provenance/i });
    fireEvent.click(catalogBtn);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/ARES Planetary Scientific Data Catalog/i)).toBeInTheDocument();
  });

  it('updates exploration mode when mode switcher is clicked', () => {
    render(<App />);

    const regionalBtn = screen.getByRole('button', { name: /REGIONAL 2D/i });
    fireEvent.click(regionalBtn);

    expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');
  });
});
