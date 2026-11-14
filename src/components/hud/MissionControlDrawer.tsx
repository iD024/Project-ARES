import React, { useState } from 'react';
import { Drawer } from '../ui/Drawer.tsx';
import {
  ROVER_MISSIONS,
  getRoverMission,
  RoverMissionId,
} from '../../services/data/roverMissionService.ts';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  Radio,
  ExternalLink,
  Navigation,
  Calendar,
  Compass,
  BatteryCharging,
  Gauge,
  CheckCircle2,
  Clock,
  FlaskConical,
} from 'lucide-react';
import { clsx } from 'clsx';

export interface MissionControlDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MissionControlDrawer: React.FC<MissionControlDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    selectedRoverId,
    setSelectedRoverId,
    setActiveSol,
    setRoverTraverseVisible,
    setRegionalCenter,
    setIsMissionControlOpen,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<RoverMissionId>(
    selectedRoverId || 'perseverance'
  );

  const mission = getRoverMission(activeTab) || ROVER_MISSIONS[0];

  const handleTrackRover = () => {
    setSelectedRoverId(mission.id);
    setRoverTraverseVisible(true);

    // Default to the latest sol milestone if available
    if (mission.milestones.length > 0) {
      const latestMilestone = mission.milestones[mission.milestones.length - 1];
      setActiveSol(latestMilestone.sol);
      setRegionalCenter({
        longitude: latestMilestone.longitude,
        latitude: latestMilestone.latitude,
        zoom: 12,
      });
    }

    setIsMissionControlOpen(false);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="MISSION CONTROL"
      subtitle="Planetary Surface Assets & Historical Traverses"
      side="left"
      width="w-full sm:w-[500px]"
    >
      {/* Rover Mission Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 font-mono text-xs shadow-glass-sm">
        {ROVER_MISSIONS.map((m) => {
          const isSelected = activeTab === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={clsx(
                'flex-1 py-1.5 px-2 rounded-xl font-bold tracking-wider text-center transition-all cursor-pointer truncate text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40',
                isSelected
                  ? 'bg-white text-black shadow-md shadow-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              {m.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Main Mission Dossier Header Card */}
      <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-glass-sm flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border',
                  mission.status === 'ACTIVE'
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/10 text-white/60 border-white/15'
                )}
              >
                {mission.status}
              </span>
              <span className="text-[10px] text-white/50 font-mono">
                {mission.organization}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white mt-1 font-mono tracking-tight">
              {mission.name}
            </h3>
          </div>

          <button
            onClick={handleTrackRover}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-mono text-xs font-bold shadow-md shadow-orange-950/50 transition-all cursor-pointer border border-orange-400/40 shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-400"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Track Rover on Mars</span>
          </button>
        </div>

        <p className="text-xs text-white/70 leading-relaxed font-sans">
          {mission.description}
        </p>

        {/* Tactical Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs pt-1">
          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <Gauge className="w-3 h-3 text-cyan-400" />
              <span>ODOMETER</span>
            </div>
            <div className="text-white font-bold mt-0.5 tabular-nums">
              {mission.totalDistanceKm.toFixed(2)} km
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>TOTAL SOLS</span>
            </div>
            <div className="text-white font-bold mt-0.5 tabular-nums">
              Sol {mission.totalSols.toLocaleString()}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <BatteryCharging className="w-3 h-3 text-emerald-400" />
              <span>POWER</span>
            </div>
            <div className="text-white font-bold mt-0.5 truncate" title={mission.powerSource}>
              {mission.powerSource.split(' ')[0]}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <Calendar className="w-3 h-3 text-purple-400" />
              <span>LANDING DATE</span>
            </div>
            <div className="text-white font-bold mt-0.5 tabular-nums">{mission.landingDate}</div>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] sm:col-span-2">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px]">
              <Compass className="w-3 h-3 text-orange-400" />
              <span>LANDING SITE</span>
            </div>
            <div className="text-white font-bold mt-0.5 truncate" title={mission.landingSiteName}>
              {mission.landingSiteName}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Science Objectives */}
      <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex flex-col gap-2.5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white/90">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>PRIMARY MISSION OBJECTIVES</span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {mission.primaryObjectives.map((obj, i) => (
            <li
              key={i}
              className="text-xs text-white/70 flex items-start gap-2 leading-snug"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scientific Instruments Payload */}
      {mission.instruments.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white/90 px-1">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCIENTIFIC INSTRUMENT PAYLOAD</span>
            </div>
            <span className="text-[10px] text-white/50 tabular-nums">
              {mission.instruments.length} INVESTIGATIONS
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {mission.instruments.map((inst) => (
              <div
                key={inst.id}
                className="p-3 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex flex-col gap-1.5 hover:border-white/20 hover:bg-white/[0.045] transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 font-mono font-bold text-xs">
                      {inst.acronym}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {inst.name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/[0.04] text-white/60 border border-white/10">
                    {inst.type}
                  </span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                  {inst.description}
                </p>
                <div className="text-[10px] text-cyan-300 font-mono pt-0.5 flex items-start gap-1">
                  <span className="text-white/40">Prime Science:</span>
                  <span>{inst.primeScience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provenance & Planetary Data System (PDS) Link */}
      <div className="p-4 rounded-2xl bg-purple-950/15 border border-purple-500/20 flex flex-col gap-2 font-sans mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-mono font-bold text-purple-300">
              PDS ARCHIVED OBSERVATION
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-purple-900/40 text-purple-300 border border-purple-400/20">
            PDS GEOSCIENCES
          </span>
        </div>
        <p className="text-[11px] text-white/70 leading-relaxed">
          All traverse waypoints, instruments, and target logs are derived from official NASA
          Planetary Data System (PDS) archival deliveries and JPL Mission Operations data releases.
        </p>
        <a
          href={mission.pdsArchiveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View NASA PDS Archive"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors mt-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
        >
          <span>View NASA PDS Archive</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </Drawer>
  );
};

export default MissionControlDrawer;
