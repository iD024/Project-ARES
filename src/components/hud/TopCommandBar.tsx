import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { ViewMode } from '../../types/hud.ts';
import {
  Layers,
  Compass,
  FileText,
  Sparkles,
  Globe,
  Map,
  Ruler,
  Mountain,
  Radio,
} from 'lucide-react';
import { clsx } from 'clsx';

export const TopCommandBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeDrawer,
    setActiveDrawer,
    activeModal,
    setActiveModal,
    isLegendOpen,
    setIsLegendOpen,
    activeMeasurementTool,
    setActiveMeasurementTool,
    isMissionControlOpen,
    setIsMissionControlOpen,
  } = useAppStore();

  const modes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'GLOBAL_3D', label: 'GLOBAL 3D', icon: <Globe className="w-4 h-4" /> },
    { id: 'REGIONAL_2D', label: 'REGIONAL 2D', icon: <Map className="w-4 h-4" /> },
    { id: 'LOCAL_ANALYSIS', label: 'LOCAL ANALYSIS', icon: <Compass className="w-4 h-4" /> },
  ];

  const isMeasuring = activeMeasurementTool !== null;

  return (
    <header className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-3 font-sans">
      {/* Left: Brand Identity */}
      <div className="pointer-events-auto flex items-center gap-3.5 px-4 py-2.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ares-rust to-orange-500 flex items-center justify-center shadow-lg shadow-orange-950/40 shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-widest text-white font-mono">ARES</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/10 text-white/90 border border-white/15 font-mono">
              Mars 2000
            </span>
          </div>
          <p className="text-xs text-white/60 font-medium tracking-tight">
            ADVANCED RECONNAISSANCE & EXPLORATION
          </p>
        </div>
      </div>

      {/* Center: Mode Switcher */}
      <div className="pointer-events-auto hidden md:flex items-center p-1.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-mono">
        {modes.map((m) => {
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              role="button"
              aria-label={m.label}
              onClick={() => setViewMode(m.id)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-black shadow-lg shadow-white/20 border border-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Consolidated Glass Action Controls */}
      <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-mono text-xs sm:text-sm">
        {/* Layers Drawer Toggle */}
        <button
          onClick={() => setActiveDrawer('layers')}
          aria-label="Layers"
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            activeDrawer === 'layers'
              ? 'bg-white/20 text-white border-white/30 shadow-md'
              : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Layers</span>
        </button>

        {/* Phase 07 Measurement Toggle */}
        <button
          onClick={() => setActiveMeasurementTool(isMeasuring ? null : 'distance')}
          aria-label="Measure"
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            isMeasuring
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-md shadow-cyan-950/50'
              : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <Ruler className="w-4 h-4 text-cyan-300" />
          <span className="hidden sm:inline">Measure</span>
        </button>

        {/* Unified Tools & Sites Explorer Toggle */}
        <button
          onClick={() => setActiveDrawer('tools')}
          aria-label="Tools & Sites"
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            activeDrawer === 'tools' || activeDrawer === 'sites'
              ? 'bg-white/20 text-white border-white/30 shadow-md'
              : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Explorer</span>
        </button>

        {/* Phase 08 Mission Control Drawer Toggle */}
        <button
          onClick={() => setIsMissionControlOpen(!isMissionControlOpen)}
          aria-label="Missions"
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            isMissionControlOpen
              ? 'bg-orange-500/20 text-orange-300 border-orange-400/40 shadow-md shadow-orange-950/50'
              : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <Radio className="w-4 h-4 text-orange-400" />
          <span className="hidden sm:inline">Missions</span>
        </button>

        {/* Hypsometry & Slope Legend Toggle */}
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          aria-label="Legend"
          className={clsx(
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            isLegendOpen
              ? 'bg-white/20 text-white border-white/30 shadow-md'
              : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <Mountain className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Legend</span>
        </button>

        <div className="h-6 w-[1px] bg-white/15 mx-0.5" />

        {/* Provenance Metadata Modal Toggle */}
        <button
          onClick={() => setActiveModal(activeModal === 'provenance' ? null : 'provenance')}
          aria-label="Provenance"
          title="Dataset Provenance & Scientific Metadata"
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer border font-semibold',
            activeModal === 'provenance'
              ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-md'
              : 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
          )}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span className="hidden lg:inline text-xs">Data</span>
        </button>
      </div>
    </header>
  );
};

export default TopCommandBar;
