import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';

export const ElevationProfileTray: React.FC = () => {
  const { elevationTransect, setElevationTransect } = useAppStore();
  const [isMinimized, setIsMinimized] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = elevationTransect?.points || [];
  const totalDistanceKm = elevationTransect?.totalDistanceKm || 0;
  const minElevationMeters = elevationTransect?.minElevationMeters || 0;
  const maxElevationMeters = elevationTransect?.maxElevationMeters || 0;
  const elevationChangeMeters = elevationTransect?.elevationChangeMeters || 0;
  const averageSlopeDegrees = elevationTransect?.averageSlopeDegrees || 0;

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 160;
  const paddingX = 40;
  const paddingY = 24;

  const elevSpan = Math.max(10, maxElevationMeters - minElevationMeters);
  const yMin = minElevationMeters - elevSpan * 0.1;
  const yMax = maxElevationMeters + elevSpan * 0.1;
  const totalYRange = Math.max(1, yMax - yMin);

  // Map transect points to SVG coordinate space
  const svgCoords = useMemo(() => {
    if (points.length === 0) return [];
    return points.map((pt, idx) => {
      const x = paddingX + (idx / Math.max(1, points.length - 1)) * (svgWidth - 2 * paddingX);
      const normalizedY = (pt.elevationMeters - yMin) / totalYRange;
      const y = svgHeight - paddingY - normalizedY * (svgHeight - 2 * paddingY);
      return { x, y, pt };
    });
  }, [points, yMin, totalYRange, svgHeight]);

  // Construct SVG path string
  const linePath = useMemo(() => {
    if (svgCoords.length === 0) return '';
    return svgCoords.reduce((acc, coord, idx) => {
      return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
    }, '');
  }, [svgCoords]);

  // Construct fill path
  const areaPath = useMemo(() => {
    if (svgCoords.length === 0) return '';
    const bottomY = svgHeight - paddingY;
    const first = svgCoords[0];
    const last = svgCoords[svgCoords.length - 1];
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [linePath, svgCoords, svgHeight]);

  // Y coordinate for Mars Zero Datum (0 m elevation)
  const zeroDatumY = useMemo(() => {
    if (yMin <= 0 && yMax >= 0) {
      const norm = (0 - yMin) / totalYRange;
      return svgHeight - paddingY - norm * (svgHeight - 2 * paddingY);
    }
    return null;
  }, [yMin, yMax, totalYRange, svgHeight]);

  if (!elevationTransect || elevationTransect.points.length === 0) {
    return null;
  }

  const activeHoverPoint = hoverIndex !== null && svgCoords[hoverIndex] ? svgCoords[hoverIndex] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clientX - paddingX) / (rect.width - 2 * paddingX)));
    const targetIdx = Math.round(ratio * (points.length - 1));
    setHoverIndex(targetIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  return (
    <div
      className={clsx(
        'absolute bottom-14 left-4 right-4 z-20 pointer-events-auto select-none transition-all',
        'rounded-2xl backdrop-blur-2xl bg-black/95 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.95)] text-slate-100 font-sans'
      )}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-white">
              Martian Elevation Cross-Section
            </h3>
            <p className="text-xs text-white/50 font-mono">Topographic Transect • MOLA Interpolation</p>
          </div>
        </div>

        {/* Metric Badges */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap font-mono text-xs">
          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="text-white/50">DIST:</span>
            <strong className="text-cyan-300 font-bold">{totalDistanceKm.toFixed(1)} km</strong>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="text-white/50">MIN:</span>
            <strong className={minElevationMeters < 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {minElevationMeters > 0 ? `+${minElevationMeters.toLocaleString()}` : `${minElevationMeters.toLocaleString()}`} m
            </strong>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="text-white/50">MAX:</span>
            <strong className={maxElevationMeters < 0 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
              {maxElevationMeters > 0 ? `+${maxElevationMeters.toLocaleString()}` : `${maxElevationMeters.toLocaleString()}`} m
            </strong>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="text-white/50">RELIEF:</span>
            <strong className="text-white font-bold">{elevationChangeMeters.toLocaleString()} m</strong>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
            <span className="text-white/50">SLOPE:</span>
            <strong className="text-orange-400 font-bold">{averageSlopeDegrees.toFixed(1)}°</strong>
          </div>
        </div>

        {/* Tray Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={isMinimized ? 'Expand Profile' : 'Minimize Profile'}
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            aria-label="Close Profile"
            onClick={() => setElevationTransect(null)}
            className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {!isMinimized && (
        <div data-testid="profile-chart-area" className="p-4 relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-36 overflow-visible cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <defs>
              <linearGradient id="elevationRampGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Zero Datum Line */}
            {zeroDatumY !== null && (
              <g>
                <line
                  x1={paddingX}
                  y1={zeroDatumY}
                  x2={svgWidth - paddingX}
                  y2={zeroDatumY}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <text
                  x={paddingX + 6}
                  y={zeroDatumY - 4}
                  fill="#10b981"
                  fontSize="10"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  0 m (Mars Datum)
                </text>
              </g>
            )}

            {/* Transect Area Fill */}
            <path d={areaPath} fill="url(#elevationRampGradient)" />

            {/* Transect Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Start and End Point Markers */}
            {svgCoords.length > 0 && (
              <>
                <circle
                  cx={svgCoords[0].x}
                  cy={svgCoords[0].y}
                  r="4"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <circle
                  cx={svgCoords[svgCoords.length - 1].x}
                  cy={svgCoords[svgCoords.length - 1].y}
                  r="4"
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </>
            )}

            {/* Interactive Hover Crosshair */}
            {activeHoverPoint && (
              <g>
                <line
                  x1={activeHoverPoint.x}
                  y1={paddingY}
                  x2={activeHoverPoint.x}
                  y2={svgHeight - paddingY}
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.75"
                />
                <circle
                  cx={activeHoverPoint.x}
                  cy={activeHoverPoint.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* Active Hover Floating Readout Card */}
          {activeHoverPoint && (
            <div
              className="absolute pointer-events-none px-3 py-1.5 rounded-xl bg-black/90 border border-white/20 shadow-xl font-mono text-xs z-30"
              style={{
                left: `${Math.max(60, Math.min(window.innerWidth - 220, (activeHoverPoint.x / svgWidth) * 100))}%`,
                top: '12px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="flex items-center gap-3 text-slate-200">
                <span>Dist: <strong className="text-white">{activeHoverPoint.pt.distanceKm.toFixed(1)} km</strong></span>
                <span>Elev: <strong className={activeHoverPoint.pt.elevationMeters < 0 ? 'text-amber-400' : 'text-emerald-400'}>
                  {activeHoverPoint.pt.elevationMeters > 0 ? `+${activeHoverPoint.pt.elevationMeters.toLocaleString()}` : `${activeHoverPoint.pt.elevationMeters.toLocaleString()}`} m
                </strong></span>
              </div>
            </div>
          )}

          {/* Bottom Coordinate Range Indicators */}
          <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-1 px-4">
            <span>
              Start: {points[0].longitude.toFixed(2)}°E, {points[0].latitude.toFixed(2)}°N
            </span>
            <span>
              End: {points[points.length - 1].longitude.toFixed(2)}°E, {points[points.length - 1].latitude.toFixed(2)}°N
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevationProfileTray;
