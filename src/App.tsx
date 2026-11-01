import React from 'react';
import { useAppStore } from './store/useAppStore.ts';
import MarsGlobeView from './components/map/MarsGlobeView.tsx';
import { TopCommandBar } from './components/hud/TopCommandBar.tsx';
import { TelemetryStrip } from './components/hud/TelemetryStrip.tsx';
import { LayersDrawer } from './components/hud/LayersDrawer.tsx';
import { ToolsDrawer } from './components/hud/ToolsDrawer.tsx';
import { ProvenanceModal } from './components/hud/ProvenanceModal.tsx';

export const App: React.FC = () => {
  const { activeDrawer, setActiveDrawer, activeModal, setActiveModal } = useAppStore();

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-ares-space text-slate-100 flex flex-col font-sans select-none">
      {/* 1. Dominant Full-Bleed 3D Mars Globe Viewport */}
      <main className="relative flex-1 w-full h-full">
        <MarsGlobeView />
      </main>

      {/* 2. Top Floating Aerospace Command Bar */}
      <TopCommandBar />

      {/* 3. Left Dockable Drawer: Planetary Layers Manager */}
      <LayersDrawer
        isOpen={activeDrawer === 'layers'}
        onClose={() => setActiveDrawer(null)}
      />

      {/* 4. Right Dockable Drawer: Exploration Tools & Landing Sites */}
      <ToolsDrawer
        isOpen={activeDrawer === 'tools' || activeDrawer === 'sites'}
        onClose={() => setActiveDrawer(null)}
      />

      {/* 5. Center Modal: Scientific Provenance & Metadata Catalog */}
      <ProvenanceModal
        isOpen={activeModal === 'provenance'}
        onClose={() => setActiveModal(null)}
      />

      {/* 6. Bottom Floating Telemetry & System Status Strip */}
      <TelemetryStrip />
    </div>
  );
};

export default App;
