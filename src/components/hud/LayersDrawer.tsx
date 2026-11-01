import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Slider } from '../ui/Slider.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Eye, EyeOff, Layers, ExternalLink, Activity } from 'lucide-react';
import { LayerCategory } from '../../types/hud.ts';
import {
  evaluateLayerStatus,
  LayerResolutionTarget,
  LayerScaleStatus,
} from '../../services/data/layerResolutionService.ts';
import { getDatasetById } from '../../services/data/datasetRegistry.ts';

export interface LayersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({ isOpen, onClose }) => {
  const {
    layers,
    setLayerVisibility,
    setLayerOpacity,
    setActiveModal,
    telemetry,
    regionalCenter,
  } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'surface', label: 'Surface' },
    { id: 'topography', label: 'Elevation' },
    { id: 'features', label: 'Features' },
    { id: 'geology', label: 'Geology' },
  ];

  // Parse numeric current scale from telemetry.scale (e.g., "1:500,000" -> 500000)
  const parseScaleNumber = (telemetryScale?: string, fallback = 500000): number => {
    if (telemetryScale) {
      const str = String(telemetryScale).trim();
      if (str.includes(':')) {
        const afterColon = str.split(':')[1]?.replace(/[^0-9.]/g, '');
        const num = Number(afterColon);
        if (!isNaN(num) && num > 0) return num;
      } else {
        const digits = str.replace(/[^0-9.]/g, '');
        const parsed = Number(digits);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    if (regionalCenter?.scale && regionalCenter.scale > 0) {
      return regionalCenter.scale;
    }
    return fallback;
  };

  const currentScale = parseScaleNumber(telemetry?.scale);
  const currentCenter = {
    longitude: telemetry?.longitude ?? regionalCenter?.longitude ?? 0,
    latitude: telemetry?.latitude ?? regionalCenter?.latitude ?? 0,
  };

  const handleSolo = (targetLayerId: string) => {
    setLayerVisibility(targetLayerId, true);
    layers.forEach((l) => {
      if (l.id !== targetLayerId && l.category === 'surface') {
        setLayerVisibility(l.id, false);
      }
    });
  };

  const filteredLayers = layers.filter(
    (l) => selectedCategory === 'all' || l.category === (selectedCategory as LayerCategory)
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Planetary Layer Catalog"
      subtitle="NASA Trek WMTS, USGS WMS & HiRISE DTMs"
      side="left"
    >
      {/* Category Tabs */}
      <Tabs
        tabs={categories}
        activeTab={selectedCategory}
        onTabChange={setSelectedCategory}
        className="mb-2"
      />

      {/* Layer Cards List */}
      <div className="flex flex-col gap-2.5">
        {filteredLayers.map((layer) => {
          const dataset = getDatasetById(layer.id);
          const target: LayerResolutionTarget = {
            id: layer.id,
            minScale: layer.minScale ?? dataset?.minScale,
            maxScale: layer.maxScale ?? dataset?.maxScale,
            extent: layer.extent ?? (dataset as any)?.extent,
            healthStatus: layer.healthStatus,
          };

          const status: LayerScaleStatus = evaluateLayerStatus(target, currentScale, currentCenter);

          let statusLabel = 'Active';
          let badgeStyle = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
          let dotStyle = 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
          let zoomGuidance: string | null = null;

          if (status === 'SCALE_INACTIVE') {
            statusLabel = 'Scale Inactive';
            badgeStyle = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
            dotStyle = 'bg-amber-400 shadow-sm shadow-amber-400/50';
            if (target.minScale && currentScale > target.minScale) {
              zoomGuidance = `Zoom in below 1:${target.minScale.toLocaleString()}`;
            } else if (target.maxScale && currentScale < target.maxScale) {
              zoomGuidance = `Zoom out above 1:${target.maxScale.toLocaleString()}`;
            } else {
              zoomGuidance = 'Scale inactive at current view';
            }
          } else if (status === 'OUT_OF_EXTENT') {
            statusLabel = 'Out of Extent';
            badgeStyle = 'bg-slate-900/60 border-slate-700/60 text-slate-400';
            dotStyle = 'bg-slate-400';
            zoomGuidance = 'Outside current viewport extent';
          } else if (status === 'OFFLINE') {
            statusLabel = 'Offline';
            badgeStyle = 'bg-rose-950/60 border-rose-600/40 text-rose-300';
            dotStyle = 'bg-rose-500 shadow-sm shadow-rose-500/50';
            zoomGuidance = 'Endpoint offline';
          }

          return (
            <div
              key={layer.id}
              className={`p-3 rounded-xl border transition-all ${
                layer.visible
                  ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/50 opacity-65'
              }`}
            >
              {/* Header: Title + Actions */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold font-mono text-slate-100 truncate">
                      {layer.name}
                    </h3>
                    <Badge variant={layer.classification}>{layer.classification}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2">
                    {layer.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    title={`Solo ${layer.name}`}
                    aria-label={`Solo ${layer.name}`}
                    onClick={() => handleSolo(layer.id)}
                    className="px-2 py-1 rounded-lg border text-[10px] font-mono font-medium transition-all cursor-pointer bg-slate-900/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-ares-cyan hover:border-cyan-600/50"
                  >
                    Solo
                  </button>

                  <button
                    type="button"
                    aria-label={`Toggle visibility for ${layer.name}`}
                    onClick={() => setLayerVisibility(layer.id, !layer.visible)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      layer.visible
                        ? 'bg-cyan-950/60 text-ares-cyan border-cyan-700/80 shadow-sm'
                        : 'bg-slate-800/40 text-slate-500 border-slate-700/40 hover:text-slate-300'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Status Pill Badge & Zoom Guidance */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div
                  title={zoomGuidance || `Status: ${status}`}
                  data-testid={`layer-status-${layer.id}`}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border font-medium ${badgeStyle}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
                  <span>{statusLabel}</span>
                </div>

                {status === 'SCALE_INACTIVE' && zoomGuidance && (
                  <span
                    title={zoomGuidance}
                    className="text-[10px] font-mono text-amber-400/90 truncate flex-1"
                  >
                    {zoomGuidance}
                  </span>
                )}
                {status === 'OUT_OF_EXTENT' && (
                  <span
                    title="Outside current viewport extent"
                    className="text-[10px] font-mono text-slate-400 truncate flex-1"
                  >
                    Outside Extent
                  </span>
                )}
              </div>

              {/* Metadata Chips & Formatted Scale Ranges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 font-mono text-[10px] text-slate-400">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  Res: <strong className="text-slate-200">{layer.resolution}</strong>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 truncate max-w-[160px]">
                  {layer.coverage}
                </span>
                {(target.minScale || target.maxScale) && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    Scale:{' '}
                    {target.maxScale ? `1:${target.maxScale.toLocaleString()}` : '1:1'} –{' '}
                    {target.minScale ? `1:${target.minScale.toLocaleString()}` : 'Global'}
                  </span>
                )}
              </div>

              {/* Opacity Slider (visible when layer is active) with Live Numeric Percentage Readout */}
              {layer.visible && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                  <Slider
                    label="Layer Opacity"
                    value={layer.opacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(val) => setLayerOpacity(layer.id, val)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info Action */}
      <div className="mt-auto pt-3 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>Endpoint Health Active</span>
          </span>
          <span>5/5 Endpoints Live</span>
        </div>

        <button
          onClick={() => setActiveModal('provenance')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-700/70 border border-slate-700 text-xs font-mono text-slate-300 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-ares-cyan" />
          <span>Inspect Full Scientific Provenance</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </button>
      </div>
    </Drawer>
  );
};
