import { create } from 'zustand';
import { ViewMode, DrawerId, ModalId, LayerItem, TelemetryData } from '../types/hud.ts';
import { DATASET_REGISTRY } from '../services/data/datasetRegistry.ts';
import { MARS_REGIONS } from '../config/marsRegions.ts';

export interface RegionalCoordinates {
  longitude: number;
  latitude: number;
  zoom?: number;
  scale?: number;
}

export interface AppState {
  viewMode: ViewMode;
  activeDrawer: DrawerId;
  activeModal: ModalId;
  telemetry: TelemetryData;
  layers: LayerItem[];
  selectedLandingSiteId: string | null;
  selectedRegionId: string | null;
  regionalCenter: RegionalCoordinates;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveDrawer: (drawer: DrawerId) => void;
  setActiveModal: (modal: ModalId) => void;
  setTelemetry: (data: Partial<TelemetryData>) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setLayerHealth: (layerId: string, health: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => void;
  setSelectedLandingSiteId: (siteId: string | null) => void;
  setSelectedRegionId: (regionId: string | null) => void;
  setRegionalCenter: (center: Partial<RegionalCoordinates>) => void;
}

const INITIAL_LAYERS: LayerItem[] = DATASET_REGISTRY.map((dataset) => ({
  id: dataset.id,
  name: dataset.name,
  subtitle: dataset.description,
  category: dataset.category,
  classification: dataset.classification,
  provider: dataset.provider,
  resolution: dataset.resolution,
  coverage: dataset.coverage,
  visible: dataset.id === 'mars-viking-mdim21' || dataset.id === 'mars-nomenclature',
  opacity: dataset.defaultOpacity ?? 1.0,
  sourceUrl: dataset.endpointUrl,
  healthStatus: 'ONLINE',
}));

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'GLOBAL_3D',
  activeDrawer: null,
  activeModal: null,
  selectedLandingSiteId: 'perseverance',
  selectedRegionId: 'jezero-crater',
  regionalCenter: {
    latitude: 18.38,
    longitude: 77.45,
    scale: 500000,
  },
  telemetry: {
    latitude: 18.38,
    longitude: 77.45,
    elevation: -2560,
    altitudeKm: 450,
    subsolarLon: 120.4,
    scale: '1:500,000',
    crs: 'GCS_Mars_2000 (WKID 104905)',
  },
  layers: INITIAL_LAYERS,

  setViewMode: (mode) => set({ viewMode: mode }),

  setActiveDrawer: (drawer) =>
    set((state) => ({
      activeDrawer: state.activeDrawer === drawer ? null : drawer,
    })),

  setActiveModal: (modal) => set({ activeModal: modal }),

  setTelemetry: (data) =>
    set((state) => ({
      telemetry: { ...state.telemetry, ...data },
    })),

  setLayerVisibility: (layerId, visible) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === layerId ? { ...l, visible } : l)),
    })),

  setLayerOpacity: (layerId, opacity) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === layerId ? { ...l, opacity } : l)),
    })),

  setLayerHealth: (layerId, healthStatus) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === layerId ? { ...l, healthStatus } : l)),
    })),

  setSelectedLandingSiteId: (siteId) => set({ selectedLandingSiteId: siteId }),

  setSelectedRegionId: (regionId) =>
    set((state) => {
      if (!regionId) return { selectedRegionId: null };
      const matchedRegion = MARS_REGIONS.find((r) => r.id === regionId);
      if (matchedRegion) {
        return {
          selectedRegionId: regionId,
          regionalCenter: {
            latitude: matchedRegion.centerLatitude,
            longitude: matchedRegion.centerLongitude,
            scale: matchedRegion.targetScale,
          },
        };
      }
      return { selectedRegionId: regionId };
    }),

  setRegionalCenter: (center) =>
    set((state) => ({
      regionalCenter: { ...state.regionalCenter, ...center },
    })),
}));
