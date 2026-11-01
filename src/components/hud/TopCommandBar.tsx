import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { ViewMode } from '../../types/hud.ts';
import {
  Layers,
  Wrench,
  MapPin,
  FileText,
  Sparkles,
  Globe,
  Map,
  Compass,
} from 'lucide-react';
import { clsx } from 'clsx';

export const TopCommandBar: React.FC = () => {
  const { viewMode, setViewMode, activeDrawer, setActiveDrawer, activeModal, setActiveModal } =
    useAppStore();

  const modes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'GLOBAL_3D', label: 'GLOBAL 3D', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'REGIONAL_2D', label: 'REGIONAL 2D', icon: <Map className="w-3.5 h-3.5" /> },
    { id: 'LOCAL_ANALYSIS', label: 'LOCAL ANALYSIS', icon: <Compass className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="absolute top-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
      {/* Left: Brand Identity & Subsystem Telemetry */}
      <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ares-rust to-ares-amber flex items-center justify-center shadow-lg shadow-orange-950/50 shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-widest text-slate-100 font-mono">ARES</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold tracking-wider uppercase bg-ares-rust/20 text-ares-rust border border-ares-rust/30 font-mono">
              v0.1.0-alpha
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium tracking-tight">
            ADVANCED RECONNAISSANCE AND EXPLORATION SYSTEM
          </p>
        </div>
      </div>

      {/* Center: Seamless Mode Toggle Segment */}
      <div className="pointer-events-auto flex items-center p-1 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl font-mono text-xs">
        {modes.map((m) => {
          const isActive = viewMode === m.id;
          return (
            <button
              key={m.id}
              role="button"
              aria-label={m.label}
              onClick={() => setViewMode(m.id)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer',
                isActive
                  ? 'bg-gradient-to-r from-ares-rust to-orange-600 text-white shadow-md shadow-orange-950/40 border border-orange-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              )}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Quick HUD Panel Triggers */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl font-mono text-xs">
        <button
          onClick={() => setActiveDrawer('layers')}
          aria-label="Layers"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border text-xs font-medium',
            activeDrawer === 'layers'
              ? 'bg-cyan-950/60 text-ares-cyan border-cyan-700/80 shadow-sm'
              : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60'
          )}
        >
          <Layers className="w-3.5 h-3.5 text-ares-cyan" />
          <span>Layers</span>
        </button>

        <button
          onClick={() => setActiveDrawer('tools')}
          aria-label="Tools"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border text-xs font-medium',
            activeDrawer === 'tools'
              ? 'bg-amber-950/60 text-ares-amber border-amber-700/80 shadow-sm'
              : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60'
          )}
        >
          <Wrench className="w-3.5 h-3.5 text-ares-amber" />
          <span>Tools</span>
        </button>

        <button
          onClick={() => setActiveDrawer('sites')}
          aria-label="Sites"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer border text-xs font-medium',
            activeDrawer === 'sites'
              ? 'bg-orange-950/60 text-ares-rust border-orange-700/80 shadow-sm'
              : 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/70 border-slate-700/60'
          )}
        >
          <MapPin className="w-3.5 h-3.5 text-ares-rust" />
          <span>Sites</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-700/60 mx-0.5" />

        <button
          onClick={() => setActiveModal(activeModal === 'provenance' ? null : 'provenance')}
          aria-label="Provenance"
          title="Dataset Provenance & Scientific Metadata"
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border text-xs font-medium',
            activeModal === 'provenance'
              ? 'bg-purple-950/60 text-purple-300 border-purple-700/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-700/50 border-slate-700/40'
          )}
        >
          <FileText className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">Catalog</span>
        </button>
      </div>
    </header>
  );
};

