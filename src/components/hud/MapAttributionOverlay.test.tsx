import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppStore } from '../../store/useAppStore.ts';
import { MapAttributionOverlay } from './MapAttributionOverlay.tsx';
import { ExtentCoverageBanner } from './ExtentCoverageBanner.tsx';
import { LayerItem } from '../../types/hud.ts';

describe('MapAttributionOverlay & ExtentCoverageBanner', () => {
  beforeEach(() => {
    // Reset store state
    useAppStore.setState({
      activeModal: null,
      telemetry: {
        latitude: 18.38,
        longitude: 77.45,
        elevation: -2560,
        altitudeKm: 450,
        subsolarLon: 120.4,
        scale: '1:500,000',
        crs: 'GCS_Mars_2000 (WKID 104905)',
      },
      regionalCenter: {
        latitude: 18.38,
        longitude: 77.45,
        scale: 500000,
      },
      layers: [
        {
          id: 'mars-viking-mdim21',
          name: 'Viking MDIM 2.1 Color Mosaic',
          subtitle: 'Orthorectified digital image mosaic',
          category: 'surface',
          classification: 'OBSERVED',
          provider: 'NASA / USGS Astrogeology Science Center',
          resolution: '232 m/px (256 px/deg)',
          coverage: 'Global (100%)',
          visible: true,
          opacity: 1.0,
          sourceUrl: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer',
          healthStatus: 'ONLINE',
        },
        {
          id: 'mars-ctx-mosaic',
          name: 'Context Camera (CTX) Global Mosaic',
          subtitle: 'Sub-decameter global baseline mosaic',
          category: 'surface',
          classification: 'OBSERVED',
          provider: 'Caltech Murray Lab / NASA JPL',
          resolution: '5.0–6.0 m/px',
          coverage: 'Global Mosaic (>99.5% Mars surface)',
          visible: false,
          opacity: 0.9,
          sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/',
          healthStatus: 'ONLINE',
          minScale: 2500000,
          maxScale: 25000,
        },
      ],
    });
  });

  describe('MapAttributionOverlay', () => {
    it('renders active surface imagery layer attribution (title, provider, resolution chip)', () => {
      render(<MapAttributionOverlay />);

      expect(screen.getByText('Viking MDIM 2.1 Color Mosaic')).toBeInTheDocument();
      expect(screen.getByText(/NASA \/ USGS Astrogeology Science Center/i)).toBeInTheDocument();
      expect(screen.getByText(/232 m\/px/i)).toBeInTheDocument();
      expect(screen.getByText('OBSERVED')).toBeInTheDocument();
    });

    it('clicking attribution badge calls setActiveModal("provenance")', () => {
      render(<MapAttributionOverlay />);

      const attributionButton = screen.getByRole('button', { name: /attribution/i });
      fireEvent.click(attributionButton);

      expect(useAppStore.getState().activeModal).toBe('provenance');
    });

    it('updates attribution to topmost visible surface layer when higher-res layer is visible', () => {
      // Make CTX mosaic visible (renders on top of Viking)
      const currentLayers = useAppStore.getState().layers;
      useAppStore.setState({
        layers: currentLayers.map((l) =>
          l.id === 'mars-ctx-mosaic' ? { ...l, visible: true } : l
        ),
      });

      render(<MapAttributionOverlay />);

      expect(screen.getByText('Context Camera (CTX) Global Mosaic')).toBeInTheDocument();
      expect(screen.getByText(/Caltech Murray Lab \/ NASA JPL/i)).toBeInTheDocument();
      expect(screen.getByText(/5.0–6.0 m\/px/i)).toBeInTheDocument();
    });

    it('renders null when no layers are visible', () => {
      useAppStore.setState({
        layers: useAppStore.getState().layers.map((l) => ({ ...l, visible: false })),
      });

      const { container } = render(<MapAttributionOverlay />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('ExtentCoverageBanner', () => {
    it('does not render banner when all visible layers are in scale and extent', () => {
      const { container } = render(<ExtentCoverageBanner />);
      // Global Viking layer has no minScale or localized extent restrictions at 1:500,000
      expect(container.firstChild).toBeNull();
    });

    it('displays honest notification banner when active layer is scale inactive (zoom needed)', () => {
      const localizedHiRISE: LayerItem = {
        id: 'mars-hirise-jezero',
        name: 'HiRISE Targeted DTM (Jezero Delta)',
        subtitle: 'Sub-meter stereoscopic elevation model',
        category: 'surface',
        classification: 'DERIVED',
        provider: 'NASA / JPL / Univ. of Arizona',
        resolution: '0.25 m/px',
        coverage: 'Jezero Delta',
        visible: true,
        opacity: 1.0,
        sourceUrl: 'https://hirise.lpl.arizona.edu',
        healthStatus: 'ONLINE',
        minScale: 100000, // Requires scale <= 100,000 to resolve
        extent: {
          minLon: 77.0,
          maxLon: 78.0,
          minLat: 18.0,
          maxLat: 19.0,
        },
      };

      // Set scale to 500,000 (zoomed out beyond minScale 100,000)
      useAppStore.setState({
        regionalCenter: {
          latitude: 18.38,
          longitude: 77.45,
          scale: 500000,
        },
        telemetry: {
          ...useAppStore.getState().telemetry,
          scale: '1:500,000',
        },
        layers: [...useAppStore.getState().layers, localizedHiRISE],
      });

      render(<ExtentCoverageBanner />);

      const banner = screen.getByTestId('extent-coverage-banner');
      expect(banner).toBeInTheDocument();
      expect(screen.getByText(/HiRISE Targeted DTM \(Jezero Delta\) active: zoom below 1:100,000 to resolve/i)).toBeInTheDocument();
    });

    it('displays honest notification banner when active layer is outside current viewport extent', () => {
      const localizedHiRISE: LayerItem = {
        id: 'mars-hirise-jezero',
        name: 'HiRISE Targeted DTM (Jezero Delta)',
        subtitle: 'Sub-meter stereoscopic elevation model',
        category: 'surface',
        classification: 'DERIVED',
        provider: 'NASA / JPL / Univ. of Arizona',
        resolution: '0.25 m/px',
        coverage: 'Jezero Delta',
        visible: true,
        opacity: 1.0,
        sourceUrl: 'https://hirise.lpl.arizona.edu',
        healthStatus: 'ONLINE',
        minScale: 100000,
        extent: {
          minLon: 77.0,
          maxLon: 78.0,
          minLat: 18.0,
          maxLat: 19.0,
        },
      };

      // Zoom is resolved (50,000 <= 100,000), but viewport center is far away at Gale Crater (lon 137.4, lat -4.6)
      useAppStore.setState({
        regionalCenter: {
          latitude: -4.6,
          longitude: 137.4,
          scale: 50000,
        },
        telemetry: {
          ...useAppStore.getState().telemetry,
          latitude: -4.6,
          longitude: 137.4,
          scale: '1:50,000',
        },
        layers: [...useAppStore.getState().layers, localizedHiRISE],
      });

      render(<ExtentCoverageBanner />);

      const banner = screen.getByTestId('extent-coverage-banner');
      expect(banner).toBeInTheDocument();
      expect(screen.getByText(/outside current viewport extent/i)).toBeInTheDocument();
    });

    it('hides banner when active localized layer is toggled off', () => {
      const localizedHiRISE: LayerItem = {
        id: 'mars-hirise-jezero',
        name: 'HiRISE Targeted DTM (Jezero Delta)',
        subtitle: 'Sub-meter stereoscopic elevation model',
        category: 'surface',
        classification: 'DERIVED',
        provider: 'NASA / JPL / Univ. of Arizona',
        resolution: '0.25 m/px',
        coverage: 'Jezero Delta',
        visible: false, // Inactive
        opacity: 1.0,
        sourceUrl: 'https://hirise.lpl.arizona.edu',
        healthStatus: 'ONLINE',
        minScale: 100000,
      };

      useAppStore.setState({
        regionalCenter: {
          latitude: 18.38,
          longitude: 77.45,
          scale: 500000,
        },
        layers: [...useAppStore.getState().layers, localizedHiRISE],
      });

      const { container } = render(<ExtentCoverageBanner />);
      expect(container.firstChild).toBeNull();
    });
  });
});
