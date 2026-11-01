import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Badge } from '../ui/Badge.tsx';
import { Info } from 'lucide-react';
import { LayerItem } from '../../types/hud.ts';
import { clsx } from 'clsx';

export interface MapAttributionOverlayProps {
  layers?: LayerItem[];
  onOpenProvenance?: () => void;
  className?: string;
}

export const MapAttributionOverlay: React.FC<MapAttributionOverlayProps> = ({
  layers: propLayers,
  onOpenProvenance,
  className,
}) => {
  const storeLayers = useAppStore((state) => state.layers);
  const setActiveModal = useAppStore((state) => state.setActiveModal);

  const layers = propLayers ?? storeLayers;

  // Active topmost surface layer or topmost visible layer
  const activeLayer =
    [...layers].reverse().find((l) => l.visible && l.category === 'surface') ||
    [...layers].reverse().find((l) => l.visible) ||
    null;

  if (!activeLayer) {
    return null;
  }

  const handleClick = () => {
    if (onOpenProvenance) {
      onOpenProvenance();
    } else {
      setActiveModal('provenance');
    }
  };

  return (
    <div
      data-testid="map-attribution-overlay"
      className={clsx(
        'absolute bottom-16 left-4 z-20 pointer-events-auto select-none',
        className
      )}
    >
      <button
        type="button"
        aria-label={`Attribution: ${activeLayer.name}`}
        title="View scientific provenance & data catalog"
        onClick={handleClick}
        className="group flex flex-wrap items-center gap-2 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg px-2.5 py-1.5 shadow-xl text-left hover:border-slate-700 hover:bg-slate-900/90 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-ares-cyan/50"
      >
        {/* Layer Classification Badge */}
        <Badge variant={activeLayer.classification}>{activeLayer.classification}</Badge>

        {/* Title and Provider */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 font-mono text-[11px] leading-tight">
          <span className="font-bold text-slate-100 group-hover:text-ares-cyan transition-colors">
            {activeLayer.name}
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[10px]">
            {activeLayer.provider}
          </span>
        </div>

        {/* Resolution Chip */}
        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-mono">
          {activeLayer.resolution}
        </span>

        {/* Info Icon */}
        <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-ares-cyan transition-colors shrink-0 ml-0.5" />
      </button>
    </div>
  );
};

export default MapAttributionOverlay;
