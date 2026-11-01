import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore.ts';
import { Drawer } from '../ui/Drawer.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Slider } from '../ui/Slider.tsx';
import { Tabs } from '../ui/Tabs.tsx';
import { Eye, EyeOff, Layers, ExternalLink, Activity } from 'lucide-react';
import { LayerCategory } from '../../types/hud.ts';

export interface LayersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({ isOpen, onClose }) => {
  const { layers, setLayerVisibility, setLayerOpacity, setActiveModal } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'surface', label: 'Surface' },
    { id: 'topography', label: 'Elevation' },
    { id: 'features', label: 'Features' },
    { id: 'geology', label: 'Geology' },
  ];

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
        {filteredLayers.map((layer) => (
          <div
            key={layer.id}
            className={`p-3 rounded-xl border transition-all ${
              layer.visible
                ? 'bg-slate-950/80 border-slate-700/80 shadow-md'
                : 'bg-slate-950/40 border-slate-800/50 opacity-65'
            }`}
          >
            {/* Header: Title + Visibility Toggle */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5">
                    <span>{layer.name}</span>
                    <span
                      title={`Status: ${layer.healthStatus || 'ONLINE'}`}
                      className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"
                    />
                  </h3>
                  <Badge variant={layer.classification}>{layer.classification}</Badge>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2">{layer.subtitle}</p>
              </div>

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

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2 font-mono text-[10px] text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                Res: <strong className="text-slate-200">{layer.resolution}</strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 truncate max-w-[160px]">
                {layer.coverage}
              </span>
            </div>

            {/* Opacity Slider (visible when layer is active) */}
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
        ))}
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
