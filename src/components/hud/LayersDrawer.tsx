import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Slider } from '../ui/Slider.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Eye, EyeOff, Layers, ExternalLink, Activity, Info } from 'lucide-react';
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
    openIntelForDataset,
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
    const targetLayer = layers.find((l) => l.id === targetLayerId);
    setLayerVisibility(targetLayerId, true);

    const isBaseRaster =
      targetLayer?.category === 'surface' || targetLayer?.category === 'topography';

    layers.forEach((l) => {
      if (l.id !== targetLayerId) {
        if (isBaseRaster && (l.category === 'surface' || l.category === 'topography')) {
          setLayerVisibility(l.id, false);
        } else if (!isBaseRaster && l.category === targetLayer?.category) {
          setLayerVisibility(l.id, false);
        }
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
          let badgeStyle = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
          let dotStyle = 'bg-emerald-400 shadow-sm shadow-emerald-400/50';
          let zoomGuidance: string | null = null;

          if (status === 'SCALE_INACTIVE') {
            statusLabel = 'Scale Inactive';
            badgeStyle = 'bg-amber-950/40 border-amber-500/40 text-amber-300';
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
            badgeStyle = 'bg-white/5 border-white/10 text-white/50';
            dotStyle = 'bg-white/40';
            zoomGuidance = 'Outside current viewport extent';
          } else if (status === 'OFFLINE') {
            statusLabel = 'Offline';
            badgeStyle = 'bg-rose-950/50 border-rose-600/40 text-rose-300';
            dotStyle = 'bg-rose-500 shadow-sm shadow-rose-500/50';
            zoomGuidance = 'Endpoint offline';
          }

          return (
            <div
              key={layer.id}
              className={`p-3.5 rounded-2xl border transition-all duration-150 ${
                layer.visible
                  ? 'bg-white/[0.045] border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.6)] ring-1 ring-white/10'
                  : 'bg-white/[0.015] border-white/[0.06] opacity-70 hover:opacity-95 hover:border-white/10'
              }`}
            >
              {/* Header: Title, Visual Swatch + Actions */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {layer.colorSwatch && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 shadow-sm"
                        style={{ background: layer.colorSwatch }}
                        title="Layer color palette preview"
                      />
                    )}
                    <h3 className="text-xs font-bold font-mono text-white tracking-wide truncate">
                      {layer.name}
                    </h3>
                    <Badge variant={layer.classification}>{layer.classification}</Badge>
                  </div>
                  <p className="text-xs text-white/60 font-sans mt-1">
                    {layer.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    title={`View Scientific Dossier for ${layer.name}`}
                    aria-label={`View Scientific Dossier for ${layer.name}`}
                    onClick={() => openIntelForDataset(layer.id)}
                    className="p-1.5 rounded-xl border text-xs font-mono font-medium transition-all cursor-pointer bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title={`Solo ${layer.name}`}
                    aria-label={`Solo ${layer.name}`}
                    onClick={() => handleSolo(layer.id)}
                    className="px-2 py-1 rounded-lg border text-[11px] font-mono font-medium transition-all cursor-pointer bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    Solo
                  </button>

                  <button
                    type="button"
                    aria-label={`Toggle visibility for ${layer.name}`}
                    onClick={() => setLayerVisibility(layer.id, !layer.visible)}
                    className={`p-1.5 rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                      layer.visible
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-sm'
                        : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Explanatory Cards: What it is & How it looks */}
              {(layer.whatItIs || layer.howItLooks) && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.08] space-y-1.5 text-xs font-sans">
                  {layer.whatItIs && (
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300 block mb-0.5">
                        WHAT IT IS
                      </span>
                      <p className="leading-relaxed text-white/70 text-xs">{layer.whatItIs}</p>
                    </div>
                  )}

                  {layer.howItLooks && (
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/80">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
                        HOW IT LOOKS
                      </span>
                      <p className="leading-relaxed text-white/70 text-xs">{layer.howItLooks}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Pill Badge & Zoom Guidance */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <div
                  title={zoomGuidance || `Status: ${status}`}
                  data-testid={`layer-status-${layer.id}`}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border font-medium ${badgeStyle}`}
                >
                  <span className={`w-2 h-2 rounded-full ${dotStyle}`} />
                  <span>{statusLabel}</span>
                </div>

                {status === 'SCALE_INACTIVE' && zoomGuidance && (
                  <span
                    title={zoomGuidance}
                    className="text-xs font-mono text-amber-400/90 truncate flex-1"
                  >
                    {zoomGuidance}
                  </span>
                )}
                {status === 'OUT_OF_EXTENT' && (
                  <span
                    title="Outside current viewport extent"
                    className="text-xs font-mono text-white/40 truncate flex-1"
                  >
                    Outside Extent
                  </span>
                )}
              </div>

              {/* Metadata Chips & Formatted Scale Ranges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 font-mono text-[11px] text-white/70">
                <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] tabular-nums">
                  Res: <strong className="text-white">{layer.resolution}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] truncate max-w-[180px]">
                  {layer.coverage}
                </span>
                {(target.minScale || target.maxScale) && (
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/60 tabular-nums">
                    Scale:{' '}
                    {target.maxScale ? `1:${target.maxScale.toLocaleString()}` : '1:1'} –{' '}
                    {target.minScale ? `1:${target.minScale.toLocaleString()}` : 'Global'}
                  </span>
                )}
              </div>

              {/* Opacity Slider (visible when layer is active) */}
              {layer.visible && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.08]">
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
      <div className="mt-auto pt-3 border-t border-white/[0.08] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-white/50 px-1">
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" />
            <span>Planetary Tile Endpoints Live</span>
          </span>
          <span className="text-white/40">NASA Trek • USGS • ESA</span>
        </div>

        <button
          onClick={() => setActiveModal('provenance')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Inspect Full Scientific Provenance</span>
          <ExternalLink className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>
    </Drawer>
  );
};

export default LayersDrawer;
