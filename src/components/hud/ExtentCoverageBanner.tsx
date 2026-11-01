import React from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import {
  evaluateLayerStatus,
  LayerResolutionTarget,
  LayerScaleStatus,
} from '../../services/data/layerResolutionService.ts';
import { getDatasetById } from '../../services/data/datasetRegistry.ts';
import { LayerItem } from '../../types/hud.ts';
import { AlertTriangle } from 'lucide-react';
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

  if (notices.length === 0) {
    return null;
  }

  return (
    <aside
      data-testid="extent-coverage-banner"
      role="status"
      aria-live="polite"
      className={clsx(
        'absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none',
        'flex items-center gap-2 px-3 py-1.5 rounded-lg backdrop-blur-md',
        'bg-slate-950/90 border border-amber-500/50 text-amber-300 shadow-2xl',
        'font-mono text-xs max-w-xl text-center',
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
      <span className="truncate">{notices[0].message}</span>
    </aside>
  );
};

export default ExtentCoverageBanner;
