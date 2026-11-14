import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  evaluateLayerStatus,
  LayerResolutionTarget,
  LayerScaleStatus,
} from '../../services/data/layerResolutionService.ts';
import { getDatasetById } from '../../services/data/datasetRegistry.ts';
import { LayerItem } from '../../types/hud.ts';
import { AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export interface ExtentCoverageBannerProps {
  layers?: LayerItem[];
  currentScale?: number;
  currentCenter?: { longitude: number; latitude: number };
  className?: string;
}

export const ExtentCoverageBanner: React.FC<ExtentCoverageBannerProps> = ({
  layers: propLayers,
  currentScale: propScale,
  currentCenter: propCenter,
  className,
}) => {
  const storeLayers = useAppStore((state) => state.layers);
  const telemetry = useAppStore((state) => state.telemetry);
  const regionalCenter = useAppStore((state) => state.regionalCenter);

  const layers = propLayers ?? storeLayers;

  const parseScaleNumber = (telemetryScale?: string, fallback = 500000): number => {
    if (regionalCenter?.scale && regionalCenter.scale > 0) {
      return regionalCenter.scale;
    }
    if (!telemetryScale) return fallback;
    const digits = telemetryScale.replace(/[^0-9]/g, '');
    const parsed = Number(digits);
    return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
  };

  const currentScale = propScale ?? parseScaleNumber(telemetry?.scale);
  const currentCenter = propCenter ?? {
    longitude: telemetry?.longitude ?? regionalCenter?.longitude ?? 0,
    latitude: telemetry?.latitude ?? regionalCenter?.latitude ?? 0,
  };

  const isMeasuring = useAppStore((state) => state.activeMeasurementTool !== null);
  const isHudVisible = useAppStore((state) => state.isHudVisible);

  const visibleLayers = layers.filter((l) => l.visible);

  interface LayerNotice {
    layer: LayerItem;
    status: LayerScaleStatus;
    message: string;
  }

  const notices: LayerNotice[] = [];

  for (const layer of visibleLayers) {
    const dataset = getDatasetById(layer.id);
    const target: LayerResolutionTarget = {
      id: layer.id,
      minScale: layer.minScale ?? dataset?.minScale,
      maxScale: layer.maxScale ?? dataset?.maxScale,
      extent: layer.extent ?? (dataset as any)?.extent,
      healthStatus: layer.healthStatus,
    };

    const status = evaluateLayerStatus(target, currentScale, currentCenter);

    if (status === 'SCALE_INACTIVE') {
      if (target.minScale && currentScale > target.minScale) {
        notices.push({
          layer,
          status,
          message: `${layer.name} active: zoom below 1:${target.minScale.toLocaleString()} to resolve`,
        });
      } else if (target.maxScale && currentScale < target.maxScale) {
        notices.push({
          layer,
          status,
          message: `${layer.name} active: zoom above 1:${target.maxScale.toLocaleString()} to resolve`,
        });
      } else {
        notices.push({
          layer,
          status,
          message: `${layer.name} active: outside scale resolution range`,
        });
      }
    } else if (status === 'OUT_OF_EXTENT') {
      const coveragePart = layer.coverage ? ` (${layer.coverage})` : '';
      notices.push({
        layer,
        status,
        message: `${layer.name}${coveragePart} active: outside current viewport extent`,
      });
    }
  }

  const [dismissedMessage, setDismissedMessage] = useState<string | null>(null);

  if (!isHudVisible || notices.length === 0 || dismissedMessage === notices[0].message) {
    return null;
  }

  return (
    <aside
      data-testid="extent-coverage-banner"
      role="status"
      aria-live="polite"
      className={clsx(
        'absolute left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none transition-all duration-200',
        isMeasuring ? 'top-36' : 'top-16',
        'flex items-center gap-2 px-3.5 py-1.5 rounded-xl backdrop-blur-2xl',
        'bg-[#080A0F]/90 border border-amber-500/40 text-amber-300 shadow-[0_12px_32px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.1)]',
        'font-mono text-xs max-w-xl text-center',
        className
      )}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate">{notices[0].message}</span>
      <button
        type="button"
        aria-label="Dismiss banner"
        onClick={() => setDismissedMessage(notices[0].message)}
        className="p-1 rounded-lg text-amber-300/60 hover:text-amber-200 hover:bg-amber-500/20 transition-colors ml-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

export default ExtentCoverageBanner;
