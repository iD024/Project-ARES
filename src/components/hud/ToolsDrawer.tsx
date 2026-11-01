import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MARS_LANDING_SITES, formatMarsCoordinates } from '../../config/mars.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Badge } from '../ui/Badge.tsx';
import { MapPin, Ruler, Navigation, Mountain, CheckCircle2 } from 'lucide-react';

export interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ isOpen, onClose }) => {
  const { selectedLandingSiteId, setSelectedLandingSiteId, setTelemetry } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('sites');

  const toolTabs = [
    { id: 'sites', label: 'Sites', icon: <MapPin className="w-3.5 h-3.5" /> },
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
                onClick={() => handleSelectSite(site)}
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

