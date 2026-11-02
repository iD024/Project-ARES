import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Mountain, ChevronDown, ChevronUp, X, Info } from 'lucide-react';
import { clsx } from 'clsx';

type LegendTab = 'all' | 'elevation' | 'slope' | 'geology';

export const TerrainLegendPanel: React.FC = () => {
  const { isLegendOpen, setIsLegendOpen } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<LegendTab>('all');

  if (!isLegendOpen) {
    return null;
  }

  const tabs: { id: LegendTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'elevation', label: 'Elevation' },
    { id: 'slope', label: 'Slope' },
    { id: 'geology', label: 'Geology' },
  ];

  return (
    <div
      data-testid="terrain-legend-panel"
      className={clsx(
        'absolute bottom-20 left-4 z-20 w-88 max-w-[calc(100vw-2rem)] select-none pointer-events-auto',
        'bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-slate-100 font-sans'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white">
              Terrain Legend
            </h3>
            <p className="text-xs text-white/50 font-mono">MOLA • HRSC • USGS</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand legend' : 'Collapse legend'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            aria-label="Close legend"
            onClick={() => setIsLegendOpen(false)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div data-testid="terrain-legend-content" className="mt-3 space-y-3.5">
          {/* Section Filter Tabs */}
          <div
            role="tablist"
            className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs"
          >
            {tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer',
                    isSelected
                      ? 'bg-white text-black shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Section 1: Elevation (Topography) */}
          {(activeTab === 'all' || activeTab === 'elevation') && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">
                  Elevation (Topography)
                </span>
                <span className="text-xs text-white/50 font-mono">MOLA DEM</span>
              </div>

              {/* Vertical Color Ramp with Key Elevation Marks */}
              <div className="flex items-center gap-3.5 pt-1">
                <div
                  className="w-4 h-32 rounded-full border border-white/20 shadow-inner shrink-0"
                  style={{
                    background:
                      'linear-gradient(to top, #081d58 0%, #253494 15%, #225ea8 30%, #1d91c0 45%, #41b6c4 52%, #7fcdbb 58%, #c7e9b4 68%, #edf8b1 76%, #fed976 84%, #fd8d3c 92%, #e31a1c 97%, #ffffff 100%)',
                  }}
                  title="Hypsometric Elevation Colormap (-8,200 m to +21,229 m)"
                />

                <div className="flex-1 flex flex-col justify-between h-32 font-mono text-xs text-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">+21,229 m</span>
                    <span className="text-xs text-white/50">Olympus Mons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>+4,000 m</span>
                    <span className="text-xs text-white/50">Tharsis Plateau</span>
                  </div>

                  {/* Highlighted Mars Zero Datum */}
                  <div className="flex items-center justify-between px-2 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 font-bold">
                    <span>0 m</span>
                    <span className="text-xs uppercase tracking-wider">Mars Datum</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>-4,000 m</span>
                    <span className="text-xs text-white/50">Northern Plains</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">-8,200 m</span>
                    <span className="text-xs text-white/50">Hellas Basin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Regional Slope */}
          {(activeTab === 'all' || activeTab === 'slope') && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">
                  Regional Slope
                </span>
                <span className="text-xs text-white/50 font-mono">Gradient</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="text-white font-bold">0°–5°</span>
                  <span className="text-xs text-white/50 truncate">Low/Flat</span>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="w-3 h-3 rounded-sm bg-amber-400 shrink-0" />
                  <span className="text-white font-bold">5°–15°</span>
                  <span className="text-xs text-white/50 truncate">Moderate</span>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="w-3 h-3 rounded-sm bg-orange-500 shrink-0" />
                  <span className="text-white font-bold">15°–25°</span>
                  <span className="text-xs text-white/50 truncate">Steep</span>
                </div>

                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 border border-white/5">
                  <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0" />
                  <span className="text-white font-bold">&gt; 25°</span>
                  <span className="text-xs text-white/50 truncate">Extreme</span>
                </div>
              </div>

              {/* Mandatory DEM Disclaimer */}
              <div className="flex items-start gap-2 pt-1 text-xs text-amber-200/90 leading-relaxed font-sans">
                <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <p>
                  Regional terrain gradient derived from 200m DEM. Not suitable for rover-scale obstacle navigation.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Martian Chronostratigraphy */}
          {(activeTab === 'all' || activeTab === 'geology') && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">
                  Martian Chronostratigraphy
                </span>
                <span className="text-xs text-white/50 font-mono">Geology</span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="font-bold text-white">Amazonian</span>
                  </div>
                  <span className="text-cyan-300 font-bold">&lt; 3.0 Ga</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="font-bold text-white">Hesperian</span>
                  </div>
                  <span className="text-amber-300 font-bold">3.0–3.7 Ga</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-950/40 border border-rose-800/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="font-bold text-white">Noachian</span>
                  </div>
                  <span className="text-rose-300 font-bold">&gt; 3.7 Ga</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TerrainLegendPanel;
