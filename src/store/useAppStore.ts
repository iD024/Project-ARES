import { create } from 'zustand';
import { ViewMode, DrawerId, ModalId, LayerItem, TelemetryData } from '../types/hud.ts';

export interface AppState {
  viewMode: ViewMode;
  activeDrawer: DrawerId;
  activeModal: ModalId;
  telemetry: TelemetryData;
  layers: LayerItem[];
  selectedLandingSiteId: string | null;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveDrawer: (drawer: DrawerId) => void;
  setActiveModal: (modal: ModalId) => void;
  setTelemetry: (data: Partial<TelemetryData>) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setSelectedLandingSiteId: (siteId: string | null) => void;
}

const INITIAL_LAYERS: LayerItem[] = [
  {
    id: 'mars-viking-mdim21',
    name: 'Viking MDIM 2.1 Color',
    subtitle: 'True-color planetary mosaic',
    category: 'surface',
    classification: 'OBSERVED',
    provider: 'NASA / USGS',
    resolution: '232 m/px',
    coverage: 'Global (100%)',
    visible: true,
    opacity: 1.0,
    sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/',
  },
  {
    id: 'mars-mola-clrshade',
    name: 'MOLA Color Shaded Relief',
    subtitle: 'Hypsometric elevation gradient',
    category: 'topography',
    classification: 'DERIVED',
    provider: 'NASA MGS Altimeter',
    resolution: '463 m/px',
    coverage: 'Global (100%)',
    visible: false,
    opacity: 0.85,
    sourceUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/',
  },
  {
    id: 'mars-hrsc-mola-blend',
    name: 'HRSC–MOLA Blended Relief',
    subtitle: 'Combined ESA/NASA high-res DEM hillshade',
    category: 'topography',
    classification: 'DERIVED',
    provider: 'ESA Mars Express / USGS',
    resolution: '200 m/px',
    coverage: 'Global (100%)',
    visible: false,
    opacity: 0.75,
    sourceUrl: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map',
  },
  {
    id: 'mars-themis-ir-day',
    name: 'THEMIS IR Day 100m Mosaic',
    subtitle: 'Thermal infrared daytime brightness',
    category: 'multispectral',
    classification: 'OBSERVED',
    provider: 'ASU / NASA Odyssey',
    resolution: '100 m/px',
    coverage: 'Global (>95%)',
    visible: false,
    opacity: 0.8,
    sourceUrl: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map',
  },
  {
    id: 'mars-geologic-quads',
    name: 'USGS Geologic Units',
    subtitle: 'Stratigraphic & morphological quad map',
    category: 'geology',
    classification: 'DERIVED',
    provider: 'USGS Astrogeology',
    resolution: '1:5,000,000 scale',
    coverage: 'Global Quad Charts',
    visible: false,
    opacity: 0.65,
    sourceUrl: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map',
  },
];

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'GLOBAL_3D',
  activeDrawer: null,
  activeModal: null,
  selectedLandingSiteId: 'perseverance',
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

  setSelectedLandingSiteId: (siteId) => set({ selectedLandingSiteId: siteId }),
}));
