import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MARS_LANDING_SITES, formatMarsCoordinates } from '../../config/mars.ts';
import { MARS_REGIONS, MarsRegion } from '../../config/marsRegions.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Badge } from '../ui/Badge.tsx';
import { MapPin, Map, Ruler, Navigation, Mountain, CheckCircle2, Compass } from 'lucide-react';

export interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    selectedLandingSiteId,
    setSelectedLandingSiteId,
    selectedRegionId,
    setSelectedRegionId,
    setRegionalCenter,
    setViewMode,
    setTelemetry,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('sites');

  const toolTabs = [
    { id: 'sites', label: 'Sites', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'regions', label: 'Regions', icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'measure', label: 'Measure', icon: <Ruler className="w-3.5 h-3.5" /> },
    { id: 'route', label: 'Route', icon: <Navigation className="w-3.5 h-3.5" /> },
  ];

  const handleSelectSite = (site: typeof MARS_LANDING_SITES[0]) => {
    setSelectedLandingSiteId(site.id);
    setTelemetry({
      latitude: site.latitude,
      longitude: site.longitude,
      elevation: site.elevationMeters,
    });
  };

  const handleSelectRegion = (region: MarsRegion) => {
    setSelectedRegionId(region.id);
    setRegionalCenter({
      latitude: region.centerLatitude,
      longitude: region.centerLongitude,
      scale: region.targetScale,
    });
    setTelemetry({
      latitude: region.centerLatitude,
      longitude: region.centerLongitude,
      elevation: region.elevationMeters,
    });
    setViewMode('REGIONAL_2D');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Exploration & Terrain Tools"
      subtitle="Landing Sites, Geodesic Analysis & Traverses"
      side="right"
    >
      {/* Tool Tabs */}
      <Tabs
        tabs={toolTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {/* Sites Tab */}
      {activeTab === 'sites' && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] text-slate-400 font-sans">
            Select a verified Mars landing site to inspect coordinates, mission targets, and terrain context:
          </p>

          {MARS_LANDING_SITES.map((site) => {
            const isSelected = selectedLandingSiteId === site.id;
            return (
              <div
                key={site.id}
                tabIndex={0}
                onClick={() => handleSelectSite(site)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectSite(site);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-orange-950/40 border-ares-rust/80 shadow-md ring-1 ring-ares-rust/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5">
                      <span>{site.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-ares-rust" />}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">{site.mission}</p>
                  </div>
                  <Badge variant={site.id === 'perseverance' || site.id === 'curiosity' ? 'ACTIVE' : 'DEFAULT'}>
                    {site.roverOrLander.split(' ')[0]}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500">Coord: </span>
                    <span className="text-slate-200">{formatMarsCoordinates(site.latitude, site.longitude)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Elev: </span>
                    <span className="text-amber-400">{site.elevationMeters.toLocaleString()} m</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {site.targetFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {/* Explore in 2D Action Button */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegionalCenter({
                          latitude: site.latitude,
                          longitude: site.longitude,
                          scale: 500000,
                        });
                        setViewMode('REGIONAL_2D');
                      }}
                      aria-label="Explore in 2D Map"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-ares-rust/20 hover:bg-ares-rust/35 text-ares-rust border border-ares-rust/50 transition-colors cursor-pointer"
                    >
                      <Map className="w-3 h-3" />
                      <span>EXPLORE IN 2D MAP &rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Regions Tab */}
      {activeTab === 'regions' && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[11px] text-slate-400 font-sans">
            Select a verified Martian exploration region to explore top-down high-resolution 2D cartography:
          </p>

          {MARS_REGIONS.map((region) => {
            const isSelected = selectedRegionId === region.id;
            return (
              <div
                key={region.id}
                tabIndex={0}
                onClick={() => handleSelectRegion(region)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectRegion(region);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-ares-cyan/80 shadow-md ring-1 ring-ares-cyan/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5">
                      <span>{region.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-ares-cyan" />}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{region.quadrangle}</p>
                  </div>
                  <Badge variant={region.type === 'CRATER' ? 'ACTIVE' : 'DEFAULT'}>
                    {region.type}
                  </Badge>
                </div>

                <p className="text-[10px] text-slate-300 font-sans mt-2 line-clamp-2">
                  {region.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500">Center: </span>
                    <span className="text-slate-200">
                      {formatMarsCoordinates(region.centerLatitude, region.centerLongitude)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Elev: </span>
                    <span className="text-cyan-400">
                      {region.elevationMeters > 0 ? `+${region.elevationMeters.toLocaleString()}` : region.elevationMeters.toLocaleString()} m
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {region.geologicalFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Scale: 1:{region.targetScale.toLocaleString()}</span>
                  <span className="text-ares-cyan font-semibold flex items-center gap-1">
                    <Compass className="w-3 h-3" />
                    <span>2D Cartography &rarr;</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Measure Tool Placeholder */}
      {activeTab === 'measure' && (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800">
          <Ruler className="w-8 h-8 text-ares-cyan mb-2 opacity-80" />
          <h4 className="text-xs font-bold font-mono text-slate-200">GEODESIC MEASUREMENT ENGINE</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Calculates great-circle distances and surface polygon area on the Mars 2000 spheroid (WKID 104905). Scheduled for Phase 07.
          </p>
        </div>
      )}

      {/* Route Tool Placeholder */}
      {activeTab === 'route' && (
        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl bg-slate-950/60 border border-slate-800">
          <Mountain className="w-8 h-8 text-ares-amber mb-2 opacity-80" />
          <h4 className="text-xs font-bold font-mono text-slate-200">TERRAIN-AWARE ROUTE PLANNER</h4>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            A* / Dijkstra cost-grid pathfinding engine incorporating MOLA slope penalties and terrain roughness. Scheduled for Phase 09.
          </p>
        </div>
      )}
    </Drawer>
  );
};
