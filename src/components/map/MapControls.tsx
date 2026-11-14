import React from 'react';
import { Compass, Plus, Minus, Globe, Maximize2 } from 'lucide-react';

export interface MapControlsProps {
  onResetExtent: () => void;
  onRotateNorth: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReturnToGlobe?: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onResetExtent,
  onRotateNorth,
  onZoomIn,
  onZoomOut,
  onReturnToGlobe,
}) => {
  return (
    <>
      {/* Top Banner: Return to 3D Globe Button */}
      {onReturnToGlobe && (
        <div className="absolute top-20 left-4 z-20 pointer-events-auto">
          <button
            onClick={onReturnToGlobe}
            aria-label="Return to 3D globe"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl backdrop-blur-xl bg-slate-900/90 hover:bg-slate-800 text-ares-rust border border-ares-rust/60 hover:border-ares-rust shadow-2xl text-xs font-mono font-semibold transition-all cursor-pointer group"
          >
            <Globe className="w-4 h-4 text-ares-rust group-hover:rotate-12 transition-transform" />
            <span>&larr; RETURN TO 3D GLOBE</span>
          </button>
        </div>
      )}

      {/* Right Toolbar: 2D Cartographic Navigation Controls */}
      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl backdrop-blur-2xl bg-black/85 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] select-none">
        {/* Zoom In */}
        {onZoomIn && (
          <button
            onClick={onZoomIn}
            aria-label="Zoom in"
            title="Zoom In"
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Zoom Out */}
        {onZoomOut && (
          <button
            onClick={onZoomOut}
            aria-label="Zoom out"
            title="Zoom Out"
            className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}

        {/* Divider */}
        <div className="h-[1px] bg-white/15 mx-1 my-0.5" />

        {/* Orient North */}
        <button
          onClick={onRotateNorth}
          aria-label="Orient north"
          title="Orient North (0° Rotation)"
          className="p-2 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Reset Extent */}
        <button
          onClick={onResetExtent}
          aria-label="Reset regional extent"
          title="Reset Regional Extent"
          className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
