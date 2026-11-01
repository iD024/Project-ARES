import React from 'react';
import { Compass, Home, Mountain, Plus, Minus } from 'lucide-react';

export interface GlobeControlsProps {
  onResetView: () => void;
  onRotateNorth: () => void;
  onToggleTilt: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

export const GlobeControls: React.FC<GlobeControlsProps> = ({
  onResetView,
  onRotateNorth,
  onToggleTilt,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div className="absolute top-20 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl backdrop-blur-xl bg-slate-900/85 border border-slate-700/60 shadow-2xl select-none">
      {/* Zoom In */}
      {onZoomIn && (
        <button
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom In"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
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
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
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
        title="Orient North"
        className="p-2 rounded-lg text-ares-cyan hover:bg-slate-800 transition-colors"
      >
        <Compass className="w-4 h-4" />
      </button>

      {/* Toggle Surface Tilt */}
      <button
        onClick={onToggleTilt}
        aria-label="Toggle surface tilt"
        title="Toggle Surface Tilt"
        className="p-2 rounded-lg text-ares-amber hover:bg-slate-800 transition-colors"
      >
        <Mountain className="w-4 h-4" />
      </button>

      {/* Reset View */}
      <button
        onClick={onResetView}
        aria-label="Reset orbital view"
        title="Reset Orbital View"
        className="p-2 rounded-lg text-ares-rust hover:bg-slate-800 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
    </div>
  );
};
