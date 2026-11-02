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
        'absolute bottom-20 left-4 z-20 w-84 max-w-[calc(100vw-2rem)] select-none pointer-events-auto',
        'bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl text-slate-100 font-sans'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Mountain className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-200">
              Terrain Legend
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">MOLA • HRSC • USGS</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand legend' : 'Collapse legend'}
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
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
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div data-testid="terrain-legend-content" className="mt-2 space-y-3">
          {/* Section Filter Tabs */}
          <div
            role="tablist"
            className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900/80 border border-slate-800/80 font-mono text-[11px]"
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
                    'flex-1 py-1 rounded text-center font-medium transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Section 1: Elevation (Topography) */}
          {(activeTab === 'all' || activeTab === 'elevation') && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200 tracking-wide">
                  Elevation (Topography)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">MOLA DEM</span>
              </div>

              {/* Vertical Color Ramp with Key Elevation Marks */}
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="w-3.5 h-28 rounded-full border border-slate-700/80 shadow-inner shrink-0"
                  style={{
                    background:
                      'linear-gradient(to top, #081d58 0%, #253494 15%, #225ea8 30%, #1d91c0 45%, #41b6c4 52%, #7fcdbb 58%, #c7e9b4 68%, #edf8b1 76%, #fed976 84%, #fd8d3c 92%, #e31a1c 97%, #ffffff 100%)',
                  }}
                  title="Hypsometric Elevation Colormap (-8,200 m to +21,229 m)"
                />

                <div className="flex-1 flex flex-col justify-between h-28 font-mono text-[10px] text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">+21,229 m</span>
                    <span className="text-[9px] text-slate-400">Olympus Mons</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>+4,000 m</span>
                    <span className="text-[9px] text-slate-400">Tharsis Plateau</span>
                  </div>

                  {/* Highlighted Mars Zero Datum */}
                  <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold">
                    <span>0 m</span>
                    <span className="text-[9px] uppercase tracking-wider">Mars Datum</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>-4,000 m</span>
                    <span className="text-[9px] text-slate-400">Northern Plains</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-300">-8,200 m</span>
                    <span className="text-[9px] text-slate-400">Hellas Basin</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Regional Slope */}
          {(activeTab === 'all' || activeTab === 'slope') && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200 tracking-wide">
                  Regional Slope
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Gradient</span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-950/60 border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="text-slate-200 font-semibold">0°–5°</span>
                  <span className="text-[9px] text-slate-400 truncate">Low / Flat</span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-950/60 border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0" />
                  <span className="text-slate-200 font-semibold">5°–15°</span>
                  <span className="text-[9px] text-slate-400 truncate">Moderate</span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-950/60 border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 shrink-0" />
                  <span className="text-slate-200 font-semibold">15°–25°</span>
                  <span className="text-[9px] text-slate-400 truncate">Steep</span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded bg-slate-950/60 border border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                  <span className="text-slate-200 font-semibold">&gt; 25°</span>
                  <span className="text-[9px] text-slate-400 truncate">Extreme</span>
                </div>
              </div>

              {/* Mandatory DEM Disclaimer */}
              <div className="flex items-start gap-1.5 pt-1 text-[9px] text-amber-300/90 leading-tight">
                <Info className="w-3.5 h-3.5 shrink-0 text-amber-400 mt-0.5" />
                <p>
                  Regional terrain gradient derived from 200m DEM. Not suitable for rover-scale obstacle navigation.
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Martian Chronostratigraphy */}
          {(activeTab === 'all' || activeTab === 'geology') && (
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-200 tracking-wide">
                  Martian Chronostratigraphy
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Geology</span>
              </div>

              <div className="space-y-1.5 font-mono text-[10px]">
                <div className="flex items-center justify-between p-1.5 rounded bg-cyan-950/40 border border-cyan-800/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-slate-200">Amazonian</span>
                  </div>
                  <span className="text-cyan-300 text-[10px] font-semibold">&lt; 3.0 Ga</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-amber-950/40 border border-amber-800/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-semibold text-slate-200">Hesperian</span>
                  </div>
                  <span className="text-amber-300 text-[10px] font-semibold">3.0–3.7 Ga</span>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded bg-rose-950/40 border border-rose-800/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="font-semibold text-slate-200">Noachian</span>
                  </div>
                  <span className="text-rose-300 text-[10px] font-semibold">&gt; 3.7 Ga</span>
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
