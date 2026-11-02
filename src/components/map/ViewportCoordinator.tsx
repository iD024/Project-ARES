import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MarsGlobeView } from './MarsGlobeView.tsx';
import { MarsMapView } from './MarsMapView.tsx';
import { MapAttributionOverlay } from '../hud/MapAttributionOverlay.tsx';
import { ExtentCoverageBanner } from '../hud/ExtentCoverageBanner.tsx';
import { TerrainLegendPanel } from '../hud/TerrainLegendPanel.tsx';
import { TerrainInspectorCard } from '../hud/TerrainInspectorCard.tsx';
import { MeasurementToolbar } from '../hud/MeasurementToolbar.tsx';
import { ElevationProfileTray } from '../hud/ElevationProfileTray.tsx';
import { LocalPovControls } from '../hud/LocalPovControls.tsx';
import { RoverMilestoneSlider } from '../hud/RoverMilestoneSlider.tsx';
import { clsx } from 'clsx';

export const ViewportCoordinator: React.FC = () => {
  const { viewMode } = useAppStore();

  const isGlobeVisible = viewMode === 'GLOBAL_3D' || viewMode === 'LOCAL_ANALYSIS';
  const isMapVisible = viewMode === 'REGIONAL_2D';

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-ares-space">
      {/* 1. Global 3D Mars SceneView Viewport */}
      <div
        data-testid="viewport-globe-container"
        className={clsx(
          'absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out',
          isGlobeVisible
            ? 'opacity-100 pointer-events-auto z-10'
            : 'opacity-0 pointer-events-none z-0'
        )}
      >
        <MarsGlobeView />
      </div>

      {/* 2. Regional 2D Mars MapView Viewport */}
      <div
        data-testid="viewport-map-container"
        className={clsx(
          'absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out',
          isMapVisible
            ? 'opacity-100 pointer-events-auto z-10'
            : 'opacity-0 pointer-events-none z-0'
        )}
      >
        <MarsMapView />
      </div>

      {/* 3. Floating Viewport Attribution Overlay */}
      <MapAttributionOverlay />

      {/* 4. Floating Extent & Scale Coverage Banner */}
      <ExtentCoverageBanner />

      {/* 5. Floating HUD Terrain Legend Panel */}
      <TerrainLegendPanel />

      {/* 6. Contextual Terrain Inspection Card */}
      <TerrainInspectorCard />

      {/* 7. Phase 07 Measurement Toolbar */}
      <MeasurementToolbar />

      {/* 8. Phase 07 Elevation Profile Transect Tray */}
      <ElevationProfileTray />

      {/* 9. Phase 7.5 Local 3D POV Flight Deck */}
      <LocalPovControls />

      {/* 10. Phase 08 Rover Sol Milestone Timeline */}
      <RoverMilestoneSlider />
    </div>
  );
};

export default ViewportCoordinator;

