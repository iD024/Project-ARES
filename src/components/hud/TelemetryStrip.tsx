import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { formatMarsCoordinates } from '../../config/mars.ts';
import { Activity, Compass, Globe, Radio, Sun } from 'lucide-react';

export const TelemetryStrip: React.FC = () => {
  const { telemetry, viewMode } = useAppStore();

  const coordStr = formatMarsCoordinates(telemetry.latitude, telemetry.longitude);

  return (
    <footer className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl pointer-events-auto font-mono text-xs text-slate-300">
        {/* Left Segment: Primary Position & Elevation Telemetry */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-ares-rust">
            <Radio className="w-3.5 h-3.5 animate-pulse shrink-0" />
            <span className="font-semibold tracking-wider uppercase text-[11px]">TELEMETRY</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Coordinates */}
          <div className="flex items-center gap-1.5 text-slate-200">
            <Compass className="w-3.5 h-3.5 text-ares-cyan shrink-0" />
            <span>POS: <strong className="text-ares-cyan font-bold">{coordStr}</strong></span>
          </div>

          <span className="text-slate-600 hidden md:inline">|</span>

          {/* Elevation */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <span>ELEV: <strong className={telemetry.elevation < 0 ? 'text-amber-400' : 'text-emerald-400'}>
              {telemetry.elevation.toLocaleString()} m
            </strong></span>
          </div>

          <span className="text-slate-600 hidden lg:inline">|</span>

          {/* Subsolar Point */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <Sun className="w-3 h-3 text-amber-400 shrink-0" />
            <span>SUB-SOLAR: <strong>{telemetry.subsolarLon.toFixed(1)}° E</strong></span>
          </div>
        </div>

        {/* Right Segment: CRS & Exploration Mode Badges */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-300 font-medium">GCS_Mars_2000 (WKID 104905)</span>
          </div>

          <span className="text-slate-600">|</span>

          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-ares-cyan shrink-0" />
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-800 text-ares-cyan border border-slate-700">
              {viewMode.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

