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
  const isHudVisible = useAppStore((state) => state.isHudVisible);

  const layers = propLayers ?? storeLayers;

  // Active topmost surface layer or topmost visible layer
  const activeLayer =
    [...layers].reverse().find((l) => l.visible && l.category === 'surface') ||
    [...layers].reverse().find((l) => l.visible) ||
    null;

  if (!isHudVisible || !activeLayer) {
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
        'absolute bottom-14 sm:bottom-16 left-3 sm:left-4 z-20 pointer-events-auto select-none max-w-[calc(100vw-2rem)] sm:max-w-md',
        className
      )}
    >
      <button
        type="button"
        aria-label={`Attribution: ${activeLayer.name}`}
        title="View dataset information & data catalog"
        onClick={handleClick}
        className="group flex items-center gap-2 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.1)] text-left hover:border-white/20 hover:bg-white/[0.08] transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 max-w-full"
      >
        {/* Layer Classification Badge */}
        <Badge variant={activeLayer.classification}>{activeLayer.classification}</Badge>

        {/* Title and Provider */}
        <div className="flex items-center gap-1 font-mono text-[11px] leading-tight min-w-0 truncate">
          <span className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
            {activeLayer.name}
          </span>
          <span className="text-white/30 hidden sm:inline shrink-0">|</span>
          <span className="text-white/60 text-[10px] hidden sm:inline shrink-0">
            {activeLayer.provider}
          </span>
        </div>

        {/* Resolution Chip */}
        <span className="px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-[10px] text-white/80 font-mono tabular-nums hidden sm:inline shrink-0">
          {activeLayer.resolution}
        </span>

        {/* Info Icon */}
        <Info className="w-3.5 h-3.5 text-white/40 group-hover:text-cyan-400 transition-colors shrink-0 ml-0.5" />
      </button>
    </div>
  );
};

export default MapAttributionOverlay;
