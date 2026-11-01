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
      <div className="absolute top-20 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl select-none">
        {/* Zoom In */}
        {onZoomIn && (
          <button
            onClick={onZoomIn}
            aria-label="Zoom in"
            title="Zoom In"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
        )}

        {/* Divider */}
        <div className="h-[1px] bg-slate-700/60 mx-1 my-0.5" />

        {/* Orient North */}
        <button
          onClick={onRotateNorth}
          aria-label="Orient north"
          title="Orient North (0° Rotation)"
          className="p-2 rounded-lg text-ares-cyan hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Reset Extent */}
        <button
          onClick={onResetExtent}
          aria-label="Reset regional extent"
          title="Reset Regional Extent"
          className="p-2 rounded-lg text-ares-amber hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};
