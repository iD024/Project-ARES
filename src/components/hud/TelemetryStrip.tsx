import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { formatMarsCoordinates } from '../../config/mars.ts';
import { Activity, Compass, Globe, Sun } from 'lucide-react';

export const TelemetryStrip: React.FC = () => {
  const { telemetry, viewMode, isHudVisible } = useAppStore();

  if (!isHudVisible) {
    return null;
  }

  const coordStr = formatMarsCoordinates(telemetry.latitude, telemetry.longitude);

  return (
    <footer className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 pointer-events-none flex justify-center">
      <div className="flex items-center justify-between gap-2.5 sm:gap-6 px-3.5 sm:px-6 py-1.5 sm:py-2 rounded-2xl backdrop-blur-2xl bg-black/85 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] pointer-events-auto font-mono text-xs text-white/90 max-w-full overflow-x-auto no-scrollbar">
        {/* Left Segment: Primary Position & Elevation Telemetry */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Live Telemetry Status Pill */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ares-rust" />
            </span>
            <span className="font-bold tracking-widest uppercase text-[10px] text-white/50">
              TELEMETRY
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/15 hidden sm:block" />

          {/* Coordinates Pod */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-white/50 text-[11px] hidden xs:inline">POS:</span>
            <strong className="text-white font-bold tracking-wide tabular-nums text-[11px] sm:text-xs">{coordStr}</strong>
          </div>

          <div className="h-3.5 w-px bg-white/15" />

          {/* Elevation Pod */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-white/50 text-[11px] hidden xs:inline">ELEV:</span>
            <strong
              className={`font-bold tabular-nums text-[11px] sm:text-xs ${
                telemetry.elevation < 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {telemetry.elevation > 0
                ? `+${telemetry.elevation.toLocaleString()}`
                : `${telemetry.elevation.toLocaleString()}`}{' '}
              m
            </strong>
          </div>

          <div className="h-3.5 w-px bg-white/15 hidden lg:block" />

          {/* Subsolar Point Pod */}
          <div className="hidden lg:flex items-center gap-2 text-white/60">
            <Sun className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
            <span className="text-[11px] text-white/50">SUB-SOLAR:</span>
            <strong className="text-white/90 font-semibold tabular-nums">
              {telemetry.subsolarLon.toFixed(1)}° E
            </strong>
          </div>
        </div>

        {/* Right Segment: CRS & Exploration Mode Badges */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs shrink-0">
          <div className="flex items-center gap-1.5 text-white/60">
            <Globe className="w-3.5 h-3.5 text-white/40 shrink-0" />
            <span className="text-white/70 font-semibold hidden sm:inline text-[11px]">
              GCS_Mars_2000 (WKID 104905)
            </span>
            <span className="text-white/70 font-semibold sm:hidden text-[11px]">Mars 2000</span>
          </div>

          <div className="h-3.5 w-px bg-white/15" />

          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400 shrink-0" />
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white border border-white/15">
              {viewMode.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default TelemetryStrip;
