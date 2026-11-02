import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  planMarsRoutes,
  ROUTE_PLANNING_PRESETS,
  VEHICLE_PROFILES,
  VehicleProfileType,
} from '../../services/data/routePlanningService.ts';
import {
  Navigation,
  MapPin,
  Crosshair,
  Compass,
  AlertTriangle,
  X,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

export const RoutePlannerDrawer: React.FC = () => {
  const {
    activeDrawer,
    setActiveDrawer,
    routeOrigin,
    routeDestination,
    setRouteOrigin,
    setRouteDestination,
    activeVehicleProfile,
    setActiveVehicleProfile,
    candidateRoutes,
    setCandidateRoutes,
    selectedRouteIndex,
    setSelectedRouteIndex,
    isPickingRoutePoint,
    setIsPickingRoutePoint,
    clearRoutePlanning,
  } = useAppStore();

  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  if (activeDrawer !== 'routes') return null;

  const handleCalculateRoutes = async () => {
    if (!routeOrigin || !routeDestination) {
      setCalculationError('Please set both origin and destination coordinates.');
      return;
    }
    setCalculationError(null);
    setIsCalculating(true);
    try {
      const routes = await planMarsRoutes(routeOrigin, routeDestination, activeVehicleProfile);
      setCandidateRoutes(routes);
    } catch (err: any) {
      setCalculationError(err?.message || 'Failed to calculate traversal route.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = ROUTE_PLANNING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setRouteOrigin(preset.origin);
      setRouteDestination(preset.destination);
      setActiveVehicleProfile(preset.recommendedVehicle);
      setCalculationError(null);
    }
  };

  return (
    <aside
      data-testid="route-planner-drawer"
      className="fixed top-0 right-0 z-30 w-full sm:w-[480px] h-screen bg-black/90 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl flex flex-col font-sans select-none overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-wider text-white font-mono uppercase">
                SURFACE ROUTE PLANNER
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                A* Engine
              </span>
            </div>
            <p className="text-xs text-white/60 font-medium">
              Mars 2000 Geodetic Traversability & Cost Surfaces
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveDrawer(null)}
          aria-label="Close Route Planner"
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-sm">
        {/* Preset Mission Scenarios */}
        <div className="space-y-2">
          <label
            htmlFor="preset-select"
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/70"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Preset Mission Scenario</span>
          </label>
          <select
            id="preset-select"
            aria-label="Preset Mission Scenario"
            defaultValue=""
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="" disabled className="bg-slate-900 text-white">
              -- Select Exploration Corridor --
            </option>
            {ROUTE_PLANNING_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id} className="bg-slate-900 text-white">
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 font-mono">
          {/* Origin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Origin (Start Waypoint)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPickingRoutePoint(isPickingRoutePoint === 'origin' ? null : 'origin')}
                aria-label="Pick Origin on Map"
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border',
                  isPickingRoutePoint === 'origin'
                    ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                    : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                )}
              >
                <Crosshair className="w-3 h-3" />
                <span>{isPickingRoutePoint === 'origin' ? 'Click Map...' : 'Pick on Map'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="origin-lon" className="text-[10px] text-white/50 block mb-1">
                  Origin Longitude (°E)
                </label>
                <input
                  id="origin-lon"
                  aria-label="Origin Longitude"
                  type="number"
                  step="0.001"
                  value={routeOrigin ? routeOrigin.lon : ''}
                  onChange={(e) =>
                    setRouteOrigin({
                      lon: parseFloat(e.target.value) || 0,
                      lat: routeOrigin ? routeOrigin.lat : 0,
                    })
                  }
                  placeholder="0.000"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label htmlFor="origin-lat" className="text-[10px] text-white/50 block mb-1">
                  Origin Latitude (°N)
                </label>
                <input
                  id="origin-lat"
                  aria-label="Origin Latitude"
                  type="number"
                  step="0.001"
                  value={routeOrigin ? routeOrigin.lat : ''}
                  onChange={(e) =>
                    setRouteOrigin({
                      lon: routeOrigin ? routeOrigin.lon : 0,
                      lat: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.000"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5" />

          {/* Destination */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Destination (Target Goal)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPickingRoutePoint(isPickingRoutePoint === 'destination' ? null : 'destination')}
                aria-label="Pick Destination on Map"
                className={clsx(
                  'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border',
                  isPickingRoutePoint === 'destination'
                    ? 'bg-red-500 text-white border-red-400 animate-pulse'
                    : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                )}
              >
                <Crosshair className="w-3 h-3" />
                <span>{isPickingRoutePoint === 'destination' ? 'Click Map...' : 'Pick on Map'}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="dest-lon" className="text-[10px] text-white/50 block mb-1">
                  Destination Longitude (°E)
                </label>
                <input
                  id="dest-lon"
                  aria-label="Destination Longitude"
                  type="number"
                  step="0.001"
                  value={routeDestination ? routeDestination.lon : ''}
                  onChange={(e) =>
                    setRouteDestination({
                      lon: parseFloat(e.target.value) || 0,
                      lat: routeDestination ? routeDestination.lat : 0,
                    })
                  }
                  placeholder="0.000"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-red-400"
                />
              </div>
              <div>
                <label htmlFor="dest-lat" className="text-[10px] text-white/50 block mb-1">
                  Destination Latitude (°N)
                </label>
                <input
                  id="dest-lat"
                  aria-label="Destination Latitude"
                  type="number"
                  step="0.001"
                  value={routeDestination ? routeDestination.lat : ''}
                  onChange={(e) =>
                    setRouteDestination({
                      lon: routeDestination ? routeDestination.lon : 0,
                      lat: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0.000"
                  className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-red-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Configuration Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-white/70">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vehicle Mobility Profile</span>
          </label>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            {(Object.keys(VEHICLE_PROFILES) as VehicleProfileType[]).map((type) => {
              const profile = VEHICLE_PROFILES[type];
              const isSelected = activeVehicleProfile === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveVehicleProfile(type)}
                  className={clsx(
                    'flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer',
                    isSelected
                      ? 'bg-white/15 border-white text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                  )}
                >
                  <span className="font-bold text-[11px] truncate">
                    {type === 'HEAVY_ROVER' && 'Heavy Rover'}
                    {type === 'SCOUT_ROVER' && 'Scout Rover'}
                    {type === 'AERIAL_DRONE' && 'Aerial Drone'}
                  </span>
                  <span className="text-[10px] text-white/50 mt-1">
                    {profile.speedMetersPerSol} m/sol
                  </span>
                  <span className="text-[9px] text-emerald-400">
                    Max {profile.maxSlopeDegrees}°
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCalculateRoutes}
            disabled={isCalculating}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50 transition-all"
          >
            <Navigation className="w-4 h-4 animate-spin-slow" />
            <span>{isCalculating ? 'Computing A* Lattice...' : 'Calculate Optimal Routes'}</span>
          </button>
          {candidateRoutes.length > 0 && (
            <button
              type="button"
              onClick={clearRoutePlanning}
              aria-label="Clear Routes"
              className="px-3.5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-xs font-mono transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {calculationError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{calculationError}</span>
          </div>
        )}

        {/* Candidate Routes Comparison Cards */}
        {candidateRoutes.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                Multi-Candidate Traversal Paths ({candidateRoutes.length})
              </span>
              <span className="text-[10px] font-mono text-white/40">Select route to inspect</span>
            </div>

            <div className="space-y-2.5">
              {candidateRoutes.map((route, idx) => {
                const isSelected = selectedRouteIndex === idx;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteIndex(idx)}
                    className={clsx(
                      'p-4 rounded-2xl border transition-all cursor-pointer font-mono',
                      isSelected
                        ? 'bg-white/10 shadow-xl border-white/30'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    )}
                    style={{
                      borderColor: isSelected ? route.colorHex : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: route.colorHex }}
                        />
                        <span className="font-bold text-xs text-white tracking-wide">
                          {route.name}
                        </span>
                      </div>
                      <span
                        className={clsx(
                          'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase',
                          route.isTraversable
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        )}
                      >
                        {route.isTraversable ? 'PASSABLE' : 'CLIPPED HAZARD'}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/60 mb-3 font-sans leading-relaxed">
                      {route.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-2 text-[10px] bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <span className="text-white/40 block">Distance</span>
                        <span className="font-bold text-white">{route.totalDistanceKm} km</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Max Slope</span>
                        <span
                          className={clsx(
                            'font-bold',
                            route.maxSlopeDegrees <= 15 ? 'text-emerald-400' : 'text-amber-400'
                          )}
                        >
                          {route.maxSlopeDegrees}°
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Relief Δz</span>
                        <span className="font-bold text-cyan-400">
                          {route.elevationChangeMeters > 0 ? `+${route.elevationChangeMeters}` : route.elevationChangeMeters} m
                        </span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Est. Sols</span>
                        <span className="font-bold text-amber-300">{route.estimatedSols} sols</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mandatory Scientific Disclaimer */}
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-amber-200/80 font-mono text-[10px] leading-relaxed">
          <p className="flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Scientific Disclaimer:</strong> Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles. Traversal routes are modeled/simulated.
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RoutePlannerDrawer;
