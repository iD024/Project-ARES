import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MARS_LANDMARKS } from '../../config/marsLandmarks.ts';
import { MARS_LANDING_SITES } from '../../config/mars.ts';
import {
  Compass,
  RotateCw,
  Mountain,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface LocalPovControlsProps {
  onPitchChange?: (pitch: number) => void;
  onOrbitToggle?: (active: boolean) => void;
  onRotateNorth?: () => void;
}

export const LocalPovControls: React.FC<LocalPovControlsProps> = ({
  onPitchChange,
  onOrbitToggle,
  onRotateNorth,
}) => {
  const {
    viewMode,
    setViewMode,
    selectedLandmarkId,
    setSelectedLandmarkId,
    selectedLandingSiteId,
    setSelectedLandingSiteId,
    telemetry,
  } = useAppStore();

  const [isOrbiting, setIsOrbiting] = useState(false);
  const [activePitch, setActivePitch] = useState(75);

  if (viewMode !== 'LOCAL_ANALYSIS') {
    return null;
  }

  const activeLandmark = MARS_LANDMARKS.find((l) => l.id === selectedLandmarkId);
  const activeSite = MARS_LANDING_SITES.find((s) => s.id === selectedLandingSiteId);
  const activeTargetName = activeLandmark?.name || activeSite?.name || 'Surface Inspection Point';

  const handleToggleOrbit = () => {
    const nextState = !isOrbiting;
    setIsOrbiting(nextState);
    if (onOrbitToggle) onOrbitToggle(nextState);
  };

  const handleSelectPitch = (pitch: number) => {
    setActivePitch(pitch);
    if (onPitchChange) onPitchChange(pitch);
  };

  const handleSelectTarget = (targetId: string) => {
    const isLm = MARS_LANDMARKS.some((l) => l.id === targetId);
    if (isLm) {
      setSelectedLandmarkId(targetId);
    } else {
      setSelectedLandingSiteId(targetId);
    }
  };

  const pitchPresets = [
    { label: '0° Top', value: 0 },
    { label: '45° Oblique', value: 45 },
    { label: '75° Ground', value: 75 },
    { label: '85° Horizon', value: 85 },
  ];

  return (
    <aside
      role="region"
      aria-label="Local 3D POV Flight Deck"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col gap-2 p-3 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.85)] font-mono text-xs text-white w-[92vw] max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header: Title, Active Target & Exit POV button */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                3D POV INSPECTION
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-200">
                GOOGLE EARTH STYLE
              </span>
            </div>
            <p className="text-white font-semibold text-xs truncate max-w-[260px] sm:max-w-xs">
              {activeTargetName}
            </p>
          </div>
        </div>

        {/* Exit POV Action */}
        <button
          type="button"
          aria-label="Exit POV"
          onClick={() => setViewMode('GLOBAL_3D')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 transition-colors cursor-pointer"
        >
          <span>Exit POV</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row 1: Pitch Presets, 360° Orbit & North Reset */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Pitch Presets */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <span className="text-[10px] text-slate-400 px-1 font-semibold uppercase">PITCH:</span>
          {pitchPresets.map((p) => {
            const isSelected = activePitch === p.value;
            return (
              <button
                key={p.value}
                type="button"
                aria-label={p.value === 75 ? '75° Ground' : p.value === 85 ? '85° Horizon' : p.label}
                onClick={() => handleSelectPitch(p.value)}
                className={clsx(
                  'px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer',
                  isSelected
                    ? 'bg-white text-black shadow-md border border-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* 360° Orbit Mode Toggle */}
        <button
          type="button"
          aria-label="360° Orbit"
          onClick={handleToggleOrbit}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border',
            isOrbiting
              ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400/60 shadow-lg shadow-cyan-950/60'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/15 hover:text-white'
          )}
        >
          <RotateCw className={clsx('w-3.5 h-3.5', isOrbiting && 'animate-spin')} />
          <span>{isOrbiting ? 'Orbiting Active' : '360° Orbit'}</span>
        </button>

        {/* Orient North */}
        {onRotateNorth && (
          <button
            type="button"
            aria-label="Orient North"
            onClick={onRotateNorth}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Orient North"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>N</span>
          </button>
        )}
      </div>

      {/* Row 2: Landmark Jumper & Telemetry Summary */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
        {/* Landmark Jumper Select */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">
            JUMP TO:
          </span>
          <select
            aria-label="Landmark Selector"
            value={selectedLandmarkId || selectedLandingSiteId || ''}
            onChange={(e) => handleSelectTarget(e.target.value)}
            className="w-full bg-black/80 border border-white/20 rounded-xl px-2 py-1 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
          >
            <optgroup label="Geological Wonders (10)">
              {MARS_LANDMARKS.map((lm) => (
                <option key={lm.id} value={lm.id}>
                  {lm.name} ({lm.type})
                </option>
              ))}
            </optgroup>
            <optgroup label="Landing Sites (12)">
              {MARS_LANDING_SITES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.mission})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Live Elevation Chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 shrink-0 text-[10px] text-slate-300">
          <Mountain className="w-3 h-3 text-cyan-400" />
          <span>ELEV:</span>
          <span className="font-bold text-white">
            {typeof telemetry.elevation === 'number'
              ? `${telemetry.elevation > 0 ? '+' : ''}${telemetry.elevation.toLocaleString()} m`
              : 'Surface'}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default LocalPovControls;
