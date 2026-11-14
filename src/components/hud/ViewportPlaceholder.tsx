import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Crosshair, Eye, ShieldCheck } from 'lucide-react';

export const ViewportPlaceholder: React.FC = () => {
  const { viewMode } = useAppStore();

  return (
    <div
      data-testid="ares-viewport-placeholder"
      className="relative w-full h-full min-h-[100dvh] bg-ares-space overflow-hidden flex items-center justify-center select-none"
    >
      {/* Background Orbital Gridlines & Graticules */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%),
            linear-gradient(to right, rgba(51, 65, 85, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(51, 65, 85, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        }}
      />

      {/* Concentric Orbital Range Rings */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-slate-800/80 pointer-events-none animate-pulse" />
      <div className="absolute w-[720px] h-[720px] rounded-full border border-slate-800/50 pointer-events-none" />
      <div className="absolute w-[940px] h-[940px] rounded-full border border-slate-800/25 pointer-events-none" />

      {/* Axis Crosshairs */}
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
      <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent pointer-events-none" />

      {/* Central Tactical Target Reticle & Status Banner */}
      <div className="relative z-10 flex flex-col items-center gap-4 text-center max-w-md px-6 py-6 rounded-2xl backdrop-blur-md bg-slate-950/70 border border-slate-800/80 shadow-2xl">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-ares-rust/30 to-ares-amber/20 flex items-center justify-center border border-ares-rust/50 shadow-inner">
            <Crosshair className="w-8 h-8 text-ares-rust animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
          </div>
        </div>

        <div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-cyan-950/40 text-ares-cyan border border-cyan-800/60">
            ACTIVE VIEWPORT CONTAINER
          </span>
          <h2 className="mt-2 text-base font-bold font-mono text-slate-100 tracking-wide">
            PHASE 01 — VIEWPORT READY FOR PHASE 02
          </h2>
          <p className="mt-1 text-xs text-slate-400 font-sans leading-relaxed">
            Dominant full-bleed planetary canvas. Global 3D Mars globe engine wiring scheduled for Phase 02.
          </p>
        </div>

        <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800/80 font-mono text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Eye className="w-3.5 h-3.5 text-ares-cyan" />
            <span>MODE: <strong className="text-ares-cyan">{viewMode}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>IAU 2000 MARS SPHEROID</span>
          </div>
        </div>
      </div>
    </div>
  );
};

