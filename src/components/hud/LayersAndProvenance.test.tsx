import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LayersDrawer } from './LayersDrawer.tsx';
import { ToolsDrawer } from './ToolsDrawer.tsx';
import { ProvenanceModal } from './ProvenanceModal.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

describe('LayersDrawer, ToolsDrawer & ProvenanceModal', () => {
  describe('LayersDrawer', () => {
    it('renders layers from store and allows toggling visibility and opacity', () => {
      render(<LayersDrawer isOpen={true} onClose={() => {}} />);

      expect(screen.getByText('Viking MDIM 2.1 Color')).toBeInTheDocument();
      expect(screen.getByText('MOLA Color Shaded Relief')).toBeInTheDocument();

      // Toggle visibility while on All
      const vikingVisibilityBtn = screen.getByLabelText(/Toggle visibility for Viking MDIM 2.1 Color/i);
      fireEvent.click(vikingVisibilityBtn);
      const updatedViking = useAppStore.getState().layers.find(l => l.id === 'mars-viking-mdim21');
      expect(updatedViking?.visible).toBe(false);

      // Check category filtering
      const topoTab = screen.getByRole('tab', { name: /Topography/i });
      fireEvent.click(topoTab);
      expect(screen.getByText('MOLA Color Shaded Relief')).toBeInTheDocument();
      expect(screen.queryByText('Viking MDIM 2.1 Color')).not.toBeInTheDocument();
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
