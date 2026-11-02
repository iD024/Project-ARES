import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Badge } from '../ui/Badge.tsx';
import { REGIONAL_SLOPE_DISCLAIMER, classifyRegionalSlope } from '../../services/data/marsGeodesyService.ts';
import { MapPin, Mountain, AlertTriangle, X, Compass, Layers } from 'lucide-react';
import { clsx } from 'clsx';

export const TerrainInspectorCard: React.FC = () => {
  const activeTerrainInspection = useAppStore((state) => state.activeTerrainInspection);
  const setActiveTerrainInspection = useAppStore((state) => state.setActiveTerrainInspection);

  if (!activeTerrainInspection) {
    return null;
  }

  const {
    longitude,
    latitude,
    elevationMeters,
    regionalSlopeDegrees,
    slopeCategory,
    quadrangleName,
    quadrangleCode,
    geologicalPeriod,
    classification = 'DERIVED',
  } = activeTerrainInspection;

  // Format coordinates (e.g., 77.45°E, 18.38°N)
  const lonCard = longitude >= 0 ? 'E' : 'W';
  const latCard = latitude >= 0 ? 'N' : 'S';
  const formattedCoords = `${Math.abs(longitude).toFixed(2)}°${lonCard}, ${Math.abs(latitude).toFixed(2)}°${latCard}`;

  // Format elevation with explicit sign (e.g., -2,560 m or +1,250 m or 0 m)
  const formatElevation = (elev: number): string => {
    const formatted = Math.abs(elev).toLocaleString();
    if (elev > 0) return `+${formatted} m`;
    if (elev < 0) return `-${formatted} m`;
    return '0 m';
  };

  // Determine slope display and category
  let slopeLabel = '';
  let resolvedCategory = slopeCategory;
  if (!resolvedCategory && regionalSlopeDegrees !== undefined) {
    resolvedCategory = classifyRegionalSlope(regionalSlopeDegrees).category;
  }

  if (resolvedCategory && regionalSlopeDegrees !== undefined) {
    slopeLabel = `${resolvedCategory} (${regionalSlopeDegrees.toFixed(1)}°)`;
  } else if (resolvedCategory) {
    slopeLabel = resolvedCategory;
  } else if (regionalSlopeDegrees !== undefined) {
    slopeLabel = `${regionalSlopeDegrees.toFixed(1)}°`;
  }

  // Format quadrangle name and code
  const quadrangleDisplay = quadrangleName
    ? quadrangleCode && !quadrangleName.includes(quadrangleCode)
      ? `${quadrangleCode} ${quadrangleName}`
      : quadrangleName
    : quadrangleCode || 'Mars Surface';

  return (
    <div
      data-testid="terrain-inspector-card"
      className={clsx(
        'absolute top-20 right-4 z-20 w-84 max-w-[calc(100vw-2rem)] select-none pointer-events-auto',
        'bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3.5 shadow-2xl text-slate-100 font-sans'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-ares-rust/20 border border-ares-rust/40 flex items-center justify-center text-ares-rust">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-200">
              Terrain Inspection
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Spot Interrogation</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant={(classification as any) || 'DERIVED'}>
            {classification}
          </Badge>
          <button
            type="button"
            aria-label="Close terrain inspection"
            onClick={() => setActiveTerrainInspection(null)}
            className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
        {/* Coordinates */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-ares-cyan" />
            COORDINATES
          </span>
          <span
            data-testid="terrain-inspector-coords"
            className="text-xs font-semibold text-ares-cyan mt-1 truncate"
          >
            {formattedCoords}
          </span>
        </div>

        {/* Elevation */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 text-emerald-400" />
            ELEVATION
          </span>
          <span
            data-testid="terrain-inspector-elevation"
            className={clsx(
              'text-xs font-bold mt-1',
              elevationMeters < 0 ? 'text-amber-400' : 'text-emerald-400'
            )}
          >
            {formatElevation(elevationMeters)}
          </span>
        </div>
      </div>

      {/* Secondary Regional & Geological Attributes */}
      <div className="mt-2 space-y-1.5 text-xs font-mono">
        {/* Quadrangle */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60">
          <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-slate-400" />
            QUADRANGLE
          </span>
          <span className="text-[11px] font-semibold text-slate-200">
            {quadrangleDisplay}
          </span>
        </div>

        {/* Regional Slope */}
        {slopeLabel && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">REGIONAL SLOPE</span>
            <span
              className={clsx(
                'text-[11px] font-semibold',
                resolvedCategory === 'STEEP' || resolvedCategory === 'PRECIPITOUS'
                  ? 'text-rose-400'
                  : resolvedCategory === 'MODERATE'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
              )}
            >
              {slopeLabel}
            </span>
          </div>
        )}

        {/* Geological Period */}
        {geologicalPeriod && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800/60">
            <span className="text-[10px] text-slate-400">EPOCH</span>
            <span className="text-[11px] font-semibold text-amber-300">
              {geologicalPeriod}
            </span>
          </div>
        )}
      </div>

      {/* Mandatory Scientific Disclaimer */}
      <div className="mt-2.5 flex items-start gap-1.5 p-2 rounded-lg bg-amber-950/20 border border-amber-900/40 text-[10px] text-amber-300/90 leading-tight">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p>{REGIONAL_SLOPE_DISCLAIMER}</p>
      </div>
    </div>
  );
};

export default TerrainInspectorCard;
