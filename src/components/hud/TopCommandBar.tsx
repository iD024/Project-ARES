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
  Navigation,
  Atom,
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
    { id: 'GLOBAL_3D', label: 'GLOBAL 3D', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'REGIONAL_2D', label: 'REGIONAL 2D', icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'LOCAL_ANALYSIS', label: 'LOCAL ANALYSIS', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  const isMeasuring = activeMeasurementTool !== null;

  return (
    <header className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between gap-3 font-sans">
      {/* 1. Left: Brand Identity & Telemetry Status Pill */}
      <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-2xl backdrop-blur-2xl bg-black/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-ares-rust to-orange-600 flex items-center justify-center shadow-md shadow-orange-950/60 shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-widest text-white font-mono">ARES</span>
            <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold tracking-wider uppercase bg-white/10 text-white/90 border border-white/15 font-mono">
              Mars 2000
            </span>
          </div>
          <p className="text-[10px] text-white/50 font-medium tracking-tight">
            ADVANCED RECONNAISSANCE & EXPLORATION
          </p>
        </div>
      </div>

      {/* 2. Center: Segmented Viewport Mode Switcher */}
      <div className="pointer-events-auto hidden md:flex items-center p-1 rounded-2xl backdrop-blur-2xl bg-black/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono">
        {modes.map((m) => {
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              role="button"
              aria-label={m.label}
              onClick={() => setViewMode(m.id)}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
                isActive
                  ? 'bg-white text-black shadow-md shadow-white/20 font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Right: Consolidated Glass Aerospace Action Dock */}
      <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-2xl backdrop-blur-2xl bg-black/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono text-xs">
        {/* --- Cluster A: Exploration (Layers, Tools/Sites, Missions) --- */}
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'layers' ? null : 'layers')}
          aria-label="Layers"
          title="Planetary Layers & Raster Mosaics"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            activeDrawer === 'layers'
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden lg:inline text-xs">Layers</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'tools' || activeDrawer === 'sites' ? null : 'tools')}
          aria-label="Tools & Sites"
          title="Exploration Tools & Landing Sites"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            activeDrawer === 'tools' || activeDrawer === 'sites'
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden lg:inline text-xs">Tools</span>
        </button>

        <button
          onClick={() => setIsMissionControlOpen(!isMissionControlOpen)}
          aria-label="Missions"
          title="Mission Control & Rover Traverses"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            isMissionControlOpen
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Radio className="w-3.5 h-3.5 text-orange-400" />
          <span className="hidden lg:inline text-xs">Missions</span>
        </button>

        {/* Subtle Hairline Divider */}
        <div className="h-4 w-px bg-white/15 mx-0.5" />

        {/* --- Cluster B: Analysis (Measure, Routes, Intel) --- */}
        <button
          onClick={() => setActiveMeasurementTool(isMeasuring ? null : 'distance')}
          aria-label="Measure"
          title="Mars Great-Circle Distance & Geodesy Measurement"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            isMeasuring
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Ruler className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden xl:inline text-xs">Measure</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'routes' ? null : 'routes')}
          aria-label="Route Planner"
          title="Surface Route Planner & Traverse Optimization"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            activeDrawer === 'routes'
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline text-xs">Routes</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'intel' ? null : 'intel')}
          aria-label="Intel"
          title="Scientific Intelligence & Provenance"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            activeDrawer === 'intel'
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/70 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Atom className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden xl:inline text-xs">Intel</span>
        </button>

        {/* Subtle Hairline Divider */}
        <div className="h-4 w-px bg-white/15 mx-0.5" />

        {/* --- Cluster C: Utilities (Legend, Provenance) --- */}
        <button
          onClick={() => setIsLegendOpen(!isLegendOpen)}
          aria-label="Legend"
          title="Hypsometry & Slope Legend"
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            isLegendOpen
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/60 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <Mountain className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden 2xl:inline text-xs">Legend</span>
        </button>

        <button
          onClick={() => setActiveModal(activeModal === 'provenance' ? null : 'provenance')}
          aria-label="Provenance"
          title="Dataset Provenance & Scientific Metadata"
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-150 cursor-pointer border font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
            activeModal === 'provenance'
              ? 'bg-white/20 text-white border-white/30 shadow-sm'
              : 'text-white/60 hover:text-white bg-transparent hover:bg-white/10 border-transparent hover:border-white/10'
          )}
        >
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden 2xl:inline text-xs">Data</span>
        </button>
      </div>
    </header>
  );
};

export default TopCommandBar;
