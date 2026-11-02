import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Badge } from '../ui/Badge.tsx';
import { REGIONAL_SLOPE_DISCLAIMER, classifyRegionalSlope } from '../../services/data/marsGeodesyService.ts';
import { MapPin, Mountain, AlertTriangle, X, Compass, Layers, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export const TerrainInspectorCard: React.FC = () => {
  const activeTerrainInspection = useAppStore((state) => state.activeTerrainInspection);
  const setActiveTerrainInspection = useAppStore((state) => state.setActiveTerrainInspection);
  const openIntelForGeology = useAppStore((state) => state.openIntelForGeology);

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
        'absolute top-20 right-4 z-20 w-88 max-w-[calc(100vw-2rem)] select-none pointer-events-auto',
        'bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-slate-100 font-sans'
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-ares-rust">
            <MapPin className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white">
              Terrain Inspection
            </h3>
            <p className="text-xs text-white/50 font-mono">Spot Interrogation</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={(classification as any) || 'DERIVED'}>
            {classification}
          </Badge>
          <button
            type="button"
            aria-label="Close terrain inspection"
            onClick={() => setActiveTerrainInspection(null)}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5 font-mono">
        {/* Coordinates */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-xs text-white/60 flex items-center gap-1.5 font-medium">
            <Compass className="w-3.5 h-3.5 text-ares-cyan" />
            COORDINATES
          </span>
          <span
            data-testid="terrain-inspector-coords"
            className="text-sm font-bold text-ares-cyan mt-1.5 truncate"
          >
            {formattedCoords}
          </span>
        </div>

        {/* Elevation */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between">
          <span className="text-xs text-white/60 flex items-center gap-1.5 font-medium">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            ELEVATION
          </span>
          <span
            data-testid="terrain-inspector-elevation"
            className={clsx(
              'text-sm font-extrabold mt-1.5',
              elevationMeters < 0 ? 'text-amber-400' : 'text-emerald-400'
            )}
          >
            {formatElevation(elevationMeters)}
          </span>
        </div>
      </div>

      {/* Secondary Regional & Geological Attributes */}
      <div className="mt-2.5 space-y-2 font-mono">
        {/* Quadrangle */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5">
          <span className="text-xs text-white/60 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-white/50" />
            QUADRANGLE
          </span>
          <span className="text-xs font-bold text-white">
            {quadrangleDisplay}
          </span>
        </div>

        {/* Regional Slope */}
        {slopeLabel && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-white/60">REGIONAL SLOPE</span>
            <span
              className={clsx(
                'text-xs font-bold',
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
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-white/60">EPOCH</span>
            <span className="text-xs font-bold text-amber-300">
              {geologicalPeriod}
            </span>
          </div>
        )}
      </div>

      {/* Phase 10 Contextual Scientific Dossier Action */}
      <button
        type="button"
        aria-label="Scientific Dossier"
        onClick={() => openIntelForGeology(geologicalPeriod || 'Noachian', quadrangleCode || undefined)}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-md"
      >
        <BookOpen className="w-3.5 h-3.5 text-purple-300" />
        <span>SCIENTIFIC DOSSIER</span>
      </button>

      {/* Mandatory Scientific Disclaimer */}
      <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed font-sans">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p>{REGIONAL_SLOPE_DISCLAIMER}</p>
      </div>
    </div>
  );
};

export default TerrainInspectorCard;
