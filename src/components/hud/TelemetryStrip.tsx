import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { formatMarsCoordinates } from '../../config/mars.ts';
import { Activity, Compass, Globe, Radio, Sun } from 'lucide-react';

export const TelemetryStrip: React.FC = () => {
  const { telemetry, viewMode } = useAppStore();

  const coordStr = formatMarsCoordinates(telemetry.latitude, telemetry.longitude);

  return (
    <footer className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] pointer-events-auto font-mono text-xs sm:text-sm text-slate-200">
        {/* Left Segment: Primary Position & Elevation Telemetry */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2 text-ares-rust">
            <Radio className="w-4 h-4 animate-pulse shrink-0" />
            <span className="font-bold tracking-wider uppercase text-xs">TELEMETRY</span>
          </div>

          <span className="text-white/20 hidden sm:inline">|</span>

          {/* Coordinates */}
          <div className="flex items-center gap-2 text-slate-200">
            <Compass className="w-4 h-4 text-ares-cyan shrink-0" />
            <span>
              POS: <strong className="text-ares-cyan font-bold">{coordStr}</strong>
            </span>
          </div>

          <span className="text-white/20 hidden md:inline">|</span>

          {/* Elevation */}
          <div className="flex items-center gap-2 text-slate-200">
            <span>
              ELEV:{' '}
              <strong className={telemetry.elevation < 0 ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
                {telemetry.elevation > 0
                  ? `+${telemetry.elevation.toLocaleString()}`
                  : `${telemetry.elevation.toLocaleString()}`}{' '}
                m
              </strong>
            </span>
          </div>

          <span className="text-white/20 hidden lg:inline">|</span>

          {/* Subsolar Point */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-xs">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              SUB-SOLAR: <strong className="text-white/90">{telemetry.subsolarLon.toFixed(1)}° E</strong>
            </span>
          </div>
        </div>

        {/* Right Segment: CRS & Exploration Mode Badges */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-slate-200 font-semibold hidden sm:inline">GCS_Mars_2000 (WKID 104905)</span>
            <span className="text-slate-200 font-semibold sm:hidden">Mars 2000</span>
          </div>

          <span className="text-white/20">|</span>

          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-ares-cyan shrink-0" />
            <span className="px-2.5 py-1 rounded-lg text-xs uppercase font-bold bg-white/10 text-white border border-white/15">
              {viewMode.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TelemetryStrip;
