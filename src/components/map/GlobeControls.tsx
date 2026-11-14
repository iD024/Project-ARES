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
    <div className="absolute bottom-20 right-4 z-20 flex flex-col gap-1.5 p-1.5 rounded-2xl backdrop-blur-2xl bg-black/80 border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.12)] select-none">
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
        title="Orient North"
        className="p-2 rounded-xl text-cyan-400 hover:text-cyan-300 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        <Compass className="w-4 h-4" />
      </button>

      {/* Toggle Surface Tilt */}
      <button
        onClick={onToggleTilt}
        aria-label="Toggle surface tilt"
        title="Toggle Surface Tilt"
        className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        <Mountain className="w-4 h-4" />
      </button>

      {/* Reset View */}
      <button
        onClick={onResetView}
        aria-label="Reset orbital view"
        title="Reset Orbital View"
        className="p-2 rounded-xl text-orange-400 hover:text-orange-300 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        <Home className="w-4 h-4" />
      </button>
    </div>
  );
};

