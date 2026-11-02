import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore, MeasurementToolType } from '../../store/useAppStore.ts';
import {
  calculateMarsGeodesicDistance,
  calculateMarsPolygonArea,
  generateElevationTransect,
} from '../../services/data/measurementService.ts';
import {
  Ruler,
  Maximize2,
  Activity,
  Trash2,
  X,
  Info,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';

export const MeasurementToolbar: React.FC = () => {
  const {
    activeMeasurementTool,
    setActiveMeasurementTool,
    measurementPoints,
    clearMeasurement,
    setElevationTransect,
  } = useAppStore();

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Auto-calculate elevation transect when in profile mode with 2 points
  useEffect(() => {
    let cancelled = false;

    if (activeMeasurementTool === 'profile' && measurementPoints.length >= 2) {
      const [start, end] = measurementPoints;
      setIsLoadingProfile(true);

      generateElevationTransect(start, end, 35)
        .then((result) => {
          if (!cancelled) {
            setElevationTransect(result);
            setIsLoadingProfile(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setIsLoadingProfile(false);
          }
        });
    }

    return () => {
      cancelled = true;
    };
  }, [activeMeasurementTool, measurementPoints, setElevationTransect]);

  const distanceResult = useMemo(() => {
    if (activeMeasurementTool === 'distance' && measurementPoints.length >= 2) {
      return calculateMarsGeodesicDistance(measurementPoints);
    }
    return null;
  }, [activeMeasurementTool, measurementPoints]);

  const areaResult = useMemo(() => {
    if (activeMeasurementTool === 'area' && measurementPoints.length >= 3) {
      return calculateMarsPolygonArea(measurementPoints);
    }
    return null;
  }, [activeMeasurementTool, measurementPoints]);

  if (!activeMeasurementTool) {
    return null;
  }

  const tools: { id: MeasurementToolType; label: string; icon: React.ReactNode }[] = [
    { id: 'distance', label: 'Geodesic Distance', icon: <Ruler className="w-4 h-4" /> },
    { id: 'area', label: 'Spherical Area', icon: <Maximize2 className="w-4 h-4" /> },
    { id: 'profile', label: 'Elevation Profile', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Martian Geodesic Measurement"
      className={clsx(
        'absolute top-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-auto',
        'w-[92vw] sm:w-auto max-w-xl'
      )}
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl backdrop-blur-2xl bg-black/90 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] text-slate-100 font-mono text-xs sm:text-sm">
        {/* Tool Mode Buttons */}
        {tools.map((t) => {
          const isActive = activeMeasurementTool === t.id;
          return (
            <button
              key={t.id}
              role="button"
              aria-label={t.label}
              onClick={() => setActiveMeasurementTool(t.id)}
              className={clsx(
                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-bold tracking-wide transition-all cursor-pointer',
                isActive
                  ? 'bg-white text-black shadow-lg shadow-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}

        <div className="h-6 w-[1px] bg-white/15 mx-1" />

        {/* Clear Action */}
        <button
          type="button"
          aria-label="Clear Points"
          onClick={clearMeasurement}
          disabled={measurementPoints.length === 0}
          title="Clear all points"
          className={clsx(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all font-semibold',
            measurementPoints.length > 0
              ? 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer'
              : 'text-white/20 cursor-not-allowed'
          )}
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>

        {/* Close Action */}
        <button
          type="button"
          aria-label="Close Measurement"
          onClick={() => setActiveMeasurementTool(null)}
          title="Exit measurement mode"
          className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Live Measurement Readout & Guidance Banner */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-xl bg-black/85 border border-white/10 shadow-lg text-xs font-mono text-slate-200">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />

        {activeMeasurementTool === 'distance' && (
          <div>
            {distanceResult ? (
              <span className="flex items-center gap-2">
                <span>Distance:</span>
                <strong className="text-cyan-300 text-sm font-extrabold">
                  {distanceResult.totalKm.toLocaleString(undefined, { maximumFractionDigits: 2 })} km
                </strong>
                <span className="text-white/50">
                  ({(distanceResult.totalMeters / 1000).toFixed(1)} km, {measurementPoints.length} points)
                </span>
              </span>
            ) : (
              <span>Click map to place 2 or more points for geodesic distance.</span>
            )}
          </div>
        )}

        {activeMeasurementTool === 'area' && (
          <div>
            {areaResult ? (
              <span className="flex items-center gap-2">
                <span>Area:</span>
                <strong className="text-emerald-300 text-sm font-extrabold">
                  {areaResult.areaSquareKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km²
                </strong>
                <span className="text-white/50">
                  ({areaResult.areaHectares.toLocaleString(undefined, { maximumFractionDigits: 0 })} ha)
                </span>
              </span>
            ) : (
              <span>
                Click map to place 3+ vertices for spherical surface area ({measurementPoints.length}/3 placed).
              </span>
            )}
          </div>
        )}

        {activeMeasurementTool === 'profile' && (
          <div className="flex items-center gap-2">
            {isLoadingProfile ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Sampling MOLA elevation along transect...</span>
              </>
            ) : measurementPoints.length >= 2 ? (
              <span>Elevation transect ready. See bottom cross-section tray.</span>
            ) : (
              <span>
                Click map to select start and end points for elevation cross-section ({measurementPoints.length}/2).
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurementToolbar;

