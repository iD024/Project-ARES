import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopCommandBar } from './TopCommandBar.tsx';
import { TelemetryStrip } from './TelemetryStrip.tsx';
import { ViewportPlaceholder } from './ViewportPlaceholder.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('HUD Panels', () => {
  describe('TopCommandBar', () => {
    it('renders system brand and allows switching view mode', () => {
      render(<TopCommandBar />);
      expect(screen.getByText('ARES')).toBeInTheDocument();
      expect(screen.getByText(/ADVANCED RECONNAISSANCE/i)).toBeInTheDocument();

      // Switch to REGIONAL 2D
      const regionalBtn = screen.getByRole('button', { name: /REGIONAL 2D/i });
      fireEvent.click(regionalBtn);
      expect(useAppStore.getState().viewMode).toBe('REGIONAL_2D');
    });

    it('toggles layer and tool drawers', () => {
      render(<TopCommandBar />);
      const layersBtn = screen.getByRole('button', { name: /Layers/i });
      fireEvent.click(layersBtn);
      expect(useAppStore.getState().activeDrawer).toBe('layers');

      const toolsBtn = screen.getByRole('button', { name: /Tools/i });
      fireEvent.click(toolsBtn);
      expect(useAppStore.getState().activeDrawer).toBe('tools');
    });
  });

  describe('TelemetryStrip', () => {
    it('renders live Martian telemetry readouts and CRS', () => {
      useAppStore.setState({
        telemetry: {
          latitude: 18.38,
          longitude: 77.45,
          elevation: -2560,
          altitudeKm: 450,
          subsolarLon: 120.4,
          scale: '1:500,000',
          crs: 'GCS_Mars_2000 (WKID 104905)',
        },
      });

      render(<TelemetryStrip />);
      expect(screen.getByText(/18\.38° N, 77\.45° E/i)).toBeInTheDocument();
      expect(screen.getByText(/-2,560 m/i)).toBeInTheDocument();
      expect(screen.getByText(/WKID 104905/i)).toBeInTheDocument();
    });
  });

  describe('ViewportPlaceholder', () => {
    it('renders tactical graticule canvas with Phase 01 readiness indicator', () => {
      render(<ViewportPlaceholder />);
      expect(screen.getByText(/PHASE 01 — VIEWPORT READY FOR PHASE 02/i)).toBeInTheDocument();
      expect(screen.getByText(/IAU 2000 MARS SPHEROID/i)).toBeInTheDocument();
    });
  });
});
