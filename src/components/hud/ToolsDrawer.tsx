import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { MARS_LANDING_SITES, formatMarsCoordinates, MarsLandingSite } from '../../config/mars.ts';
import { MARS_REGIONS, MarsRegion } from '../../config/marsRegions.ts';
import { MARS_LANDMARKS, MarsLandmark } from '../../config/marsLandmarks.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Badge } from '../ui/Badge.tsx';
import {
  MapPin,
  Map,
  Sparkles,
  CheckCircle2,
  Compass,
} from 'lucide-react';

export interface ToolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    selectedLandingSiteId,
    setSelectedLandingSiteId,
    selectedLandmarkId,
    setSelectedLandmarkId,
    selectedRegionId,
    setSelectedRegionId,
    setRegionalCenter,
    setViewMode,
    setTelemetry,
    setActiveTerrainInspection,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('sites');

  const toolTabs = [
    { id: 'sites', label: 'Landing Sites', icon: <MapPin className="w-4 h-4" /> },
    { id: 'wonders', label: 'Landmarks', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'regions', label: 'Regions', icon: <Map className="w-4 h-4" /> },
  ];

  const handleSelectSite = (site: MarsLandingSite) => {
    setSelectedLandingSiteId(site.id);
    setTelemetry({
      latitude: site.latitude,
      longitude: site.longitude,
      elevation: site.elevationMeters,
    });
    setActiveTerrainInspection({
      longitude: site.longitude,
      latitude: site.latitude,
      elevationMeters: site.elevationMeters,
      quadrangleName: site.name,
      geologicalPeriod: 'Noachian',
      classification: 'OBSERVED',
    });
  };

  const handleSelectLandmark = (landmark: MarsLandmark) => {
    setSelectedLandmarkId(landmark.id);
    setTelemetry({
      latitude: landmark.latitude,
      longitude: landmark.longitude,
      elevation: landmark.elevationMeters,
    });
    setActiveTerrainInspection({
      longitude: landmark.longitude,
      latitude: landmark.latitude,
      elevationMeters: landmark.elevationMeters,
      quadrangleName: landmark.quadrangle,
      geologicalPeriod: landmark.geologicalPeriod,
      classification: 'DERIVED',
    });
  };

  const handleSelectRegion = (region: MarsRegion) => {
    setSelectedRegionId(region.id);
    setRegionalCenter({
      latitude: region.centerLatitude,
      longitude: region.centerLongitude,
      scale: region.targetScale,
    });
    setTelemetry({
      latitude: region.centerLatitude,
      longitude: region.centerLongitude,
      elevation: region.elevationMeters,
    });
    setViewMode('REGIONAL_2D');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Planetary Exploration Catalog"
      subtitle="Verified Landing Sites, Geological Wonders & Regional Charts"
      side="right"
      width="w-96 sm:w-[450px]"
    >
      {/* Tool Tabs */}
      <Tabs
        tabs={toolTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {/* 1. Sites Tab */}
      {activeTab === 'sites' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300 font-sans">
            Select any of the 12 authoritative rover and lander landing sites to inspect mission telemetry and terrain context:
          </p>

          {MARS_LANDING_SITES.map((site) => {
            const isSelected = selectedLandingSiteId === site.id;
            return (
              <div
                key={site.id}
                tabIndex={0}
                onClick={() => handleSelectSite(site)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectSite(site);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black/90 border-orange-500/80 shadow-xl shadow-orange-950/40 ring-1 ring-orange-500/50'
                    : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                      <span>{site.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 font-sans mt-0.5">{site.mission}</p>
                  </div>
                  <Badge variant={site.id === 'perseverance' || site.id === 'curiosity' || site.id === 'zhurong' ? 'ACTIVE' : 'DEFAULT'}>
                    {site.roverOrLander.split(' ')[0]}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-white/10 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Coord: </span>
                    <span className="text-cyan-300 font-semibold">{formatMarsCoordinates(site.latitude, site.longitude)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Elev: </span>
                    <span className={site.elevationMeters < 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {site.elevationMeters > 0 ? `+${site.elevationMeters.toLocaleString()}` : `${site.elevationMeters.toLocaleString()}`} m
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {site.targetFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white/5 border border-white/10 text-slate-300"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono text-slate-400">Landing: {site.landingDate}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSite(site);
                          setViewMode('LOCAL_ANALYSIS');
                        }}
                        aria-label={`3D POV View for ${site.name}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/50 transition-all cursor-pointer shadow-md"
                      >
                        <Compass className="w-3.5 h-3.5 text-cyan-300" />
                        <span>3D POV &rarr;</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRegionalCenter({
                            latitude: site.latitude,
                            longitude: site.longitude,
                            scale: 500000,
                          });
                          setViewMode('REGIONAL_2D');
                        }}
                        aria-label="Explore in 2D Map"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-orange-500/20 hover:bg-orange-500/35 text-orange-300 border border-orange-500/50 transition-colors cursor-pointer"
                      >
                        <Map className="w-3.5 h-3.5" />
                        <span>2D &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Landmarks / Geological Wonders Tab */}
      {activeTab === 'wonders' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300 font-sans">
            Major planetary landmarks across Mars: volcanoes, mega-canyons, impact basins, and river deltas:
          </p>

          {MARS_LANDMARKS.map((landmark) => {
            const isSelected = selectedLandmarkId === landmark.id;
            return (
              <div
                key={landmark.id}
                tabIndex={0}
                onClick={() => handleSelectLandmark(landmark)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectLandmark(landmark);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black/90 border-cyan-500/80 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                      <span>{landmark.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{landmark.quadrangle}</p>
                  </div>
                  <Badge variant={landmark.type === 'VOLCANO' ? 'ACTIVE' : 'DEFAULT'}>
                    {landmark.type}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  {landmark.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-white/10 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Coord: </span>
                    <span className="text-cyan-300 font-semibold">{formatMarsCoordinates(landmark.latitude, landmark.longitude)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Elev: </span>
                    <span className={landmark.elevationMeters > 0 ? 'text-emerald-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {landmark.elevationMeters > 0 ? `+${landmark.elevationMeters.toLocaleString()}` : `${landmark.elevationMeters.toLocaleString()}`} m
                    </span>
                  </div>
                </div>

                {landmark.dimensions && (
                  <div className="mt-2 text-xs font-mono text-slate-400">
                    <span className="text-slate-500">Scale: </span>
                    <span>{landmark.dimensions}</span>
                  </div>
                )}

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono text-amber-300">{landmark.geologicalPeriod} Era</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectLandmark(landmark);
                        setViewMode('LOCAL_ANALYSIS');
                      }}
                      aria-label={`3D POV View for ${landmark.name}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-200 border border-cyan-400/50 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      <span>3D POV &rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRegionalCenter({
                          latitude: landmark.latitude,
                          longitude: landmark.longitude,
                          scale: 1500000,
                        });
                        setViewMode('REGIONAL_2D');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>2D &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Regions Tab */}
      {activeTab === 'regions' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-300 font-sans">
            Curated exploration regions with targeted 2D cartography:
          </p>

          {MARS_REGIONS.map((region) => {
            const isSelected = selectedRegionId === region.id;
            return (
              <div
                key={region.id}
                tabIndex={0}
                onClick={() => handleSelectRegion(region)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectRegion(region);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-black/90 border-cyan-500/80 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-black/60 border-white/10 hover:border-white/25 hover:bg-black/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white flex items-center gap-1.5">
                      <span>{region.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">{region.quadrangle}</p>
                  </div>
                  <Badge variant={region.type === 'CRATER' ? 'ACTIVE' : 'DEFAULT'}>
                    {region.type}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  {region.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-white/10 font-mono text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Center: </span>
                    <span className="text-cyan-300 font-semibold">{formatMarsCoordinates(region.centerLatitude, region.centerLongitude)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Elev: </span>
                    <span className="text-cyan-400 font-bold">
                      {region.elevationMeters > 0 ? `+${region.elevationMeters.toLocaleString()}` : `${region.elevationMeters.toLocaleString()}`} m
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Scale 1:{region.targetScale.toLocaleString()}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>2D Cartography &rarr;</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
};
