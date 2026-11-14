import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  getRoverMission,
  getRoverMilestones,
  getMilestoneBySol,
  getNextMilestone,
  getPrevMilestone,
} from '../../services/data/roverMissionService.ts';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Mountain,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';

export const RoverMilestoneSlider: React.FC = () => {
  const {
    selectedRoverId,
    activeSol,
    setActiveSol,
    isRoverTraverseVisible,
    setRoverTraverseVisible,
    setViewMode,
    setTelemetry,
    setRegionalCenter,
    setActiveTerrainInspection,
    isHudVisible,
  } = useAppStore();

  if (!isHudVisible || !selectedRoverId || !isRoverTraverseVisible) {
    return null;
  }

  const mission = getRoverMission(selectedRoverId);
  if (!mission) {
    return null;
  }

  const milestones = getRoverMilestones(selectedRoverId);
  if (milestones.length === 0) {
    return null;
  }

  const currentSol = activeSol ?? milestones[milestones.length - 1].sol;
  const currentMilestone =
    getMilestoneBySol(selectedRoverId, currentSol) || milestones[milestones.length - 1];

  const handlePrev = () => {
    const prev = getPrevMilestone(selectedRoverId, currentMilestone.sol);
    if (prev) {
      setActiveSol(prev.sol);
    }
  };

  const handleNext = () => {
    const next = getNextMilestone(selectedRoverId, currentMilestone.sol);
    if (next) {
      setActiveSol(next.sol);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(e.target.value);
    if (index >= 0 && index < milestones.length) {
      setActiveSol(milestones[index].sol);
    }
  };

  const currentIndex = milestones.findIndex((m) => m.sol === currentMilestone.sol);

  const handlePovAtSol = () => {
    setTelemetry({
      latitude: currentMilestone.latitude,
      longitude: currentMilestone.longitude,
      elevation: currentMilestone.elevationMeters,
    });
    setRegionalCenter({
      latitude: currentMilestone.latitude,
      longitude: currentMilestone.longitude,
      scale: 100000,
    });
    setActiveTerrainInspection({
      longitude: currentMilestone.longitude,
      latitude: currentMilestone.latitude,
      elevationMeters: currentMilestone.elevationMeters,
      quadrangleName: currentMilestone.siteName,
      geologicalPeriod: 'Noachian',
      classification: 'ARCHIVED OBSERVATION (PDS)',
    });
    setViewMode('LOCAL_ANALYSIS');
  };

  return (
    <aside
      role="region"
      aria-label="Rover Sol Milestone Timeline"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col gap-2 p-3.5 rounded-2xl backdrop-blur-2xl bg-[#080A0F]/92 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.12)] font-mono text-xs text-white w-[94vw] max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      {/* Header: Rover Badge, Milestone Name & Dismiss */}
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">
                {mission.name.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 border border-white/15 text-white">
                SOL {currentMilestone.sol}
              </span>
              <span className="px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                PDS ARCHIVE
              </span>
            </div>
            <h3 className="text-white font-bold text-sm truncate mt-0.5">
              {currentMilestone.siteName}
            </h3>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close Rover Timeline"
          onClick={() => setRoverTraverseVisible(false)}
          className="p-1.5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Discovery Summary */}
      <p className="text-xs text-white/70 font-sans leading-relaxed">
        {currentMilestone.discoverySummary}
      </p>

      {/* Telemetry Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1.5 px-2.5 rounded-xl bg-white/[0.035] border border-white/[0.08] text-[11px]">
        <div className="flex items-center gap-1.5 text-white/70">
          <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-white/50">Date:</span>
          <span className="font-semibold text-white truncate tabular-nums">{currentMilestone.earthDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="text-white/50">Odom:</span>
          <span className="font-semibold text-white tabular-nums">{currentMilestone.distanceKm.toFixed(2)} km</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          <Mountain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-white/50">Elev:</span>
          <span className="font-semibold text-white tabular-nums">{currentMilestone.elevationMeters} m</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/70">
          <span className="text-white/50">Unit:</span>
          <span className="font-semibold text-amber-300 truncate">{currentMilestone.formation}</span>
        </div>
      </div>

      {/* Scientific Instruments Active */}
      {currentMilestone.instrumentTargets && currentMilestone.instrumentTargets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-white/50 uppercase font-semibold">TARGETS:</span>
          {currentMilestone.instrumentTargets.map((tgt) => (
            <span
              key={tgt}
              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-950/40 border border-cyan-500/30 text-cyan-200"
            >
              {tgt}
            </span>
          ))}
        </div>
      )}

      {/* Interactive Sol Scrubber Slider & Steppers */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/[0.08]">
        <button
          type="button"
          aria-label="Previous Sol Milestone"
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-white/50">
            <span>Sol {milestones[0].sol} (Landing)</span>
            <span className="text-orange-400 font-bold tabular-nums">Sol {currentMilestone.sol}</span>
            <span>Sol {milestones[milestones.length - 1].sol}</span>
          </div>
          <input
            type="range"
            aria-label="Sol Milestone Slider"
            min={0}
            max={milestones.length - 1}
            value={currentIndex !== -1 ? currentIndex : 0}
            onChange={handleSliderChange}
            className="w-full accent-orange-500 bg-white/20 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <button
          type="button"
          aria-label="Next Sol Milestone"
          onClick={handleNext}
          disabled={currentIndex >= milestones.length - 1}
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.12] text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none border border-white/10 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* 3D Ground POV at Sol */}
        <button
          type="button"
          aria-label="3D Ground POV at Sol"
          onClick={handlePovAtSol}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shadow-md shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span className="hidden sm:inline">3D POV AT SOL</span>
          <span className="sm:hidden">POV</span>
        </button>
      </div>
    </aside>
  );
};

export default RoverMilestoneSlider;
