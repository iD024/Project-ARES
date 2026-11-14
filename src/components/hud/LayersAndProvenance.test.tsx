import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayersDrawer } from './LayersDrawer.tsx';
import { ToolsDrawer } from './ToolsDrawer.tsx';
import { ProvenanceModal } from './ProvenanceModal.tsx';
import { useAppStore } from '../../store/useAppStore.ts';
import { DATASET_REGISTRY } from '../../services/data/datasetRegistry.ts';

describe('LayersDrawer, ToolsDrawer & ProvenanceModal', () => {
  beforeEach(() => {
    useAppStore.setState({
      viewMode: 'GLOBAL_3D',
      activeDrawer: 'layers',
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
      layers: DATASET_REGISTRY.map((dataset) => ({
        id: dataset.id,
        name: dataset.name,
        subtitle: dataset.description,
        category: dataset.category,
        classification: dataset.classification,
        provider: dataset.provider,
        resolution: dataset.resolution,
        coverage: dataset.coverage,
        visible: dataset.id === 'mars-viking-mdim21' || dataset.id === 'mars-nomenclature',
        opacity: dataset.defaultOpacity ?? 1.0,
        sourceUrl: dataset.endpointUrl,
        healthStatus: 'ONLINE',
        minScale: dataset.minScale,
        maxScale: dataset.maxScale,
        extent: dataset.extent,
      })),
    });
  });

  describe('LayersDrawer', () => {
    it('renders layers from store and allows toggling visibility and opacity', () => {
      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      expect(screen.getByText('Viking MDIM 2.1 Color Mosaic')).toBeInTheDocument();
      expect(screen.getByText('HRSC–MOLA Blended Digital Elevation Model')).toBeInTheDocument();

      // Toggle visibility while on All
      const vikingVisibilityBtn = screen.getByLabelText(/Toggle visibility for Viking MDIM 2.1 Color Mosaic/i);
      fireEvent.click(vikingVisibilityBtn);
      const updatedViking = useAppStore.getState().layers.find(l => l.id === 'mars-viking-mdim21');
      expect(updatedViking?.visible).toBe(false);

      // Check category filtering (Elevation tab)
      const topoTab = screen.getByRole('tab', { name: /Elevation/i });
      fireEvent.click(topoTab);
      expect(screen.getByText('HRSC–MOLA Blended Digital Elevation Model')).toBeInTheDocument();
      expect(screen.queryByText('Viking MDIM 2.1 Color Mosaic')).not.toBeInTheDocument();
    });

    it('renders real-time scale and extent status badges for each layer', () => {
      // Set scale to 1:500,000 at Jezero (77.45, 18.38)
      // Viking MDIM 2.1 and CTX are active at 1:500,000
      // HiRISE Jezero DTM has minScale 100,000 -> at 1:500,000 it is scale inactive
      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      const activeBadges = screen.getAllByText(/Active/i);
      expect(activeBadges.length).toBeGreaterThan(0);

      const inactiveBadges = screen.getAllByText(/Scale Inactive/i);
      expect(inactiveBadges.length).toBeGreaterThan(0);
    });

    it('displays clear zoom guidance for scale-inactive layers', () => {
      // Scale 1:5,000,000 is zoomed out beyond CTX Mosaic minScale (2,500,000)
      useAppStore.setState({
        telemetry: {
          latitude: 18.38,
          longitude: 77.45,
          elevation: -2560,
          altitudeKm: 450,
          subsolarLon: 120.4,
          scale: '1:5,000,000',
          crs: 'GCS_Mars_2000 (WKID 104905)',
        },
      });

      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      // Assert zoom guidance is displayed for CTX Mosaic
      expect(screen.getByText(/Zoom in below 1:2,500,000/i)).toBeInTheDocument();
    });

    it('isolates target layer when solo button is clicked by deactivating other base raster layers', () => {
      // Both viking and shaded relief are initially visible
      useAppStore.setState({
        layers: DATASET_REGISTRY.map((dataset) => ({
          id: dataset.id,
          name: dataset.name,
          subtitle: dataset.description,
          category: dataset.category,
          classification: dataset.classification,
          provider: dataset.provider,
          resolution: dataset.resolution,
          coverage: dataset.coverage,
          visible: dataset.id === 'mars-viking-mdim21' || dataset.id === 'mars-mcolordem-shaded-relief',
          opacity: 1.0,
          sourceUrl: dataset.endpointUrl,
          healthStatus: 'ONLINE',
          minScale: dataset.minScale,
          maxScale: dataset.maxScale,
          extent: dataset.extent,
        })),
      });

      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      // Click Solo on Viking MDIM 2.1
      const soloVikingBtn = screen.getByLabelText(/Solo Viking MDIM 2.1 Color Mosaic/i);
      fireEvent.click(soloVikingBtn);

      const stateAfterVikingSolo = useAppStore.getState().layers;
      const viking = stateAfterVikingSolo.find((l) => l.id === 'mars-viking-mdim21');
      const shadedRelief = stateAfterVikingSolo.find((l) => l.id === 'mars-mcolordem-shaded-relief');

      expect(viking?.visible).toBe(true);
      // Shaded relief MUST be hidden when soloing Viking mosaic!
      expect(shadedRelief?.visible).toBe(false);
    });

    it('asserts Solo action button toggles only this layer on and disables all other surface layers', () => {
      // Initially, Viking MDIM 2.1 is visible (surface) and CTX Mosaic is hidden (surface)
      const initialViking = useAppStore.getState().layers.find((l) => l.id === 'mars-viking-mdim21');
      const initialCtx = useAppStore.getState().layers.find((l) => l.id === 'mars-ctx-mosaic');
      expect(initialViking?.visible).toBe(true);
      expect(initialCtx?.visible).toBe(false);

      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      // Find Solo button for CTX Mosaic
      const soloCtxBtn = screen.getByRole('button', {
        name: /Solo Context Camera \(CTX\) Global Mosaic/i,
      });
      expect(soloCtxBtn).toBeInTheDocument();
      fireEvent.click(soloCtxBtn);

      const afterState = useAppStore.getState();
      const updatedCtx = afterState.layers.find((l) => l.id === 'mars-ctx-mosaic');
      const updatedViking = afterState.layers.find((l) => l.id === 'mars-viking-mdim21');

      // Solo'd surface layer is toggled on
      expect(updatedCtx?.visible).toBe(true);
      // All other surface layers are disabled
      expect(updatedViking?.visible).toBe(false);
    });

    it('shows numeric percentage readout for layer opacity slider', () => {
      // Set opacity of Viking MDIM 2.1 to 0.85
      useAppStore.getState().setLayerOpacity('mars-viking-mdim21', 0.85);

      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('opens scientific intelligence drawer when View Scientific Dossier info button is clicked', () => {
      useAppStore.setState({ activeDrawer: 'layers' });
      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      const infoBtn = screen.getByRole('button', {
        name: /View Scientific Dossier for Viking MDIM 2\.1 Color Mosaic/i,
      });
      fireEvent.click(infoBtn);

      expect(useAppStore.getState().activeDrawer).toBe('intel');
      expect(useAppStore.getState().activeIntelTab).toBe('layers');
      expect(useAppStore.getState().intelFocusedDatasetId).toBe('mars-viking-mdim21');
    });
  });

  describe('ToolsDrawer', () => {
    it('renders landing sites and allows site selection', () => {
      render(<ToolsDrawer isOpen={true} onClose={() => {}} />);

      expect(screen.getByText('Perseverance (Jezero Crater)')).toBeInTheDocument();
      expect(screen.getByText('Curiosity (Gale Crater)')).toBeInTheDocument();

      const curiosityBtn = screen.getByText('Curiosity (Gale Crater)');
      fireEvent.click(curiosityBtn);
      expect(useAppStore.getState().selectedLandingSiteId).toBe('curiosity');
    });
  });

  describe('ProvenanceModal', () => {
    it('renders data provenance table and scientific integrity guarantee', () => {
      render(<ProvenanceModal isOpen={true} onClose={() => {}} />);

      expect(screen.getByText(/ARES Planetary Scientific Data Catalog/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Viking MDIM 2.1 Color Mosaic/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/NASA Mars Trek WMTS/i).length).toBeGreaterThan(0);
    });
  });
});
