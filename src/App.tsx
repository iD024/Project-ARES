import React from 'react';
import MarsHarness from './components/MarsHarness.tsx';
import { MARS_LANDING_SITES } from './config/mars.ts';
import { Activity, Layers, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-ares-space text-slate-100 flex flex-col font-sans select-none">
      {/* Top Floating Aerospace HUD Header */}
      <header className="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-md bg-slate-900/80 border border-slate-700/60 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ares-rust to-ares-amber flex items-center justify-center shadow-lg shadow-orange-950/50">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-widest text-slate-100 font-mono">ARES</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-ares-rust/20 text-ares-rust border border-ares-rust/30 font-mono">
                  v0.1.0-alpha
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                ADVANCED RECONNAISSANCE AND EXPLORATION SYSTEM
              </p>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-700/60 mx-1" />

          {/* Quick HUD Navigation Pill */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-ares-cyan" />
              <span>Layers</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-ares-amber" />
              <span>Sites</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Bleed Map Viewport */}
      <main className="relative flex-1 w-full h-full">
        <MarsHarness />
      </main>

      {/* Bottom Floating Telemetry & System Status Footer */}
      <footer className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="flex items-center justify-between px-4 py-2 rounded-xl backdrop-blur-md bg-slate-900/85 border border-slate-700/60 shadow-2xl pointer-events-auto text-xs font-mono text-slate-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-ares-cyan">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold tracking-wide">PHASE 00 FOUNDATION</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              VERIFIED SITES: <strong className="text-slate-200">{MARS_LANDING_SITES.length}</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              PRIMARY TARGET: <strong className="text-ares-amber">Jezero Crater (18.38° N, 77.45° E)</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldAlert className="w-3 h-3 text-ares-rust" />
              <span>Scientific Integrity Guard Active</span>
            </div>
            <span className="text-slate-600">|</span>
            <span>IAU 2000 Mars Spheroid</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

