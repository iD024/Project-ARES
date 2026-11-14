import { create } from 'zustand';
import { ViewMode, DrawerId, ModalId, LayerItem, TelemetryData, TerrainInspectionData, ScientificIntelTab } from '../types/hud.ts';
import { DATASET_REGISTRY } from '../services/data/datasetRegistry.ts';
import { MARS_REGIONS } from '../config/marsRegions.ts';
import {
  GeodesicCoordinate,
  ElevationTransectResult,
} from '../services/data/measurementService.ts';
import { RoverMissionId } from '../services/data/roverMissionService.ts';
import {
  CandidateRouteResult,
  VehicleProfileType,
} from '../services/data/routePlanningService.ts';

export type MeasurementToolType = 'distance' | 'area' | 'profile' | null;

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
  selectedLandmarkId: string | null;
  selectedRegionId: string | null;
  regionalCenter: RegionalCoordinates;
  isLegendOpen: boolean;
  activeTerrainInspection: TerrainInspectionData | null;

  // Phase 07 Measurement State
  activeMeasurementTool: MeasurementToolType;
  measurementPoints: GeodesicCoordinate[];
  elevationTransect: ElevationTransectResult | null;
  isMeasurementActive: boolean;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setActiveDrawer: (drawer: DrawerId) => void;
  setActiveModal: (modal: ModalId) => void;
  setTelemetry: (data: Partial<TelemetryData>) => void;
  setLayerVisibility: (layerId: string, visible: boolean) => void;
  setLayerOpacity: (layerId: string, opacity: number) => void;
  setLayerHealth: (layerId: string, health: 'ONLINE' | 'DEGRADED' | 'OFFLINE') => void;
  setSelectedLandingSiteId: (siteId: string | null) => void;
  setSelectedLandmarkId: (landmarkId: string | null) => void;
  setSelectedRegionId: (regionId: string | null) => void;
  setRegionalCenter: (center: Partial<RegionalCoordinates>) => void;
  setIsLegendOpen: (open: boolean) => void;
  setActiveTerrainInspection: (data: TerrainInspectionData | null) => void;

  // Phase 07 Measurement Actions
  setActiveMeasurementTool: (tool: MeasurementToolType) => void;
  addMeasurementPoint: (point: GeodesicCoordinate) => void;
  setMeasurementPoints: (points: GeodesicCoordinate[]) => void;
  clearMeasurement: () => void;
  setElevationTransect: (transect: ElevationTransectResult | null) => void;

  // Phase 08 Mission & Rover Intelligence State
  selectedRoverId: RoverMissionId | null;
  activeSol: number | null;
  isRoverTraverseVisible: boolean;
  isMissionControlOpen: boolean;

  // Phase 08 Actions
  setSelectedRoverId: (roverId: RoverMissionId | null) => void;
  setActiveSol: (sol: number | null) => void;
  setRoverTraverseVisible: (visible: boolean) => void;
  setIsMissionControlOpen: (open: boolean) => void;

  // Phase 09 Route Planning State
  routeOrigin: GeodesicCoordinate | null;
  routeDestination: GeodesicCoordinate | null;
  activeVehicleProfile: VehicleProfileType;
  candidateRoutes: CandidateRouteResult[];
  selectedRouteIndex: number;
  isRoutePlannerOpen: boolean;
  isPickingRoutePoint: 'origin' | 'destination' | null;

  // Phase 09 Route Planning Actions
  setRouteOrigin: (coord: GeodesicCoordinate | null) => void;
  setRouteDestination: (coord: GeodesicCoordinate | null) => void;
  setActiveVehicleProfile: (profile: VehicleProfileType) => void;
  setCandidateRoutes: (routes: CandidateRouteResult[]) => void;
  setSelectedRouteIndex: (index: number) => void;
  setIsRoutePlannerOpen: (open: boolean) => void;
  setIsPickingRoutePoint: (point: 'origin' | 'destination' | null) => void;
  clearRoutePlanning: () => void;

  // Phase 10 Scientific Intelligence State
  activeIntelTab: ScientificIntelTab;
  intelFocusedDatasetId: string | null;
  intelFocusedGeologyPeriod: string | null;
  intelFocusedQuadCode: string | null;

  // Phase 10 Scientific Intelligence Actions
  setActiveIntelTab: (tab: ScientificIntelTab) => void;
  openIntelForDataset: (datasetId: string) => void;
  openIntelForGeology: (period: string, quadCode?: string) => void;
  openIntelForRouteEvaluation: () => void;
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
  visible:
    dataset.id === 'mars-viking-mdim21' ||
    dataset.id === 'mars-nomenclature',
  opacity: dataset.defaultOpacity ?? 1.0,
  sourceUrl: dataset.endpointUrl,
  whatItIs: dataset.whatItIs,
  howItLooks: dataset.howItLooks,
  colorSwatch: dataset.colorSwatch,
  healthStatus: 'ONLINE',
  minScale: dataset.minScale,
  maxScale: dataset.maxScale,
  extent: dataset.extent,
}));

export const useAppStore = create<AppState>((set) => ({
  viewMode: 'GLOBAL_3D',
  activeDrawer: null,
  activeModal: null,
  selectedLandingSiteId: null,
  selectedLandmarkId: null,
  selectedRegionId: null,
  isLegendOpen: false,
  activeTerrainInspection: null,
  // Phase 07 Measurement
  activeMeasurementTool: null,
  measurementPoints: [],
  elevationTransect: null,
  isMeasurementActive: false,
  // Phase 08 Mission & Rover Intelligence
  selectedRoverId: 'perseverance',
  activeSol: 1150,
  isRoverTraverseVisible: false,
  isMissionControlOpen: false,

  // Phase 09 Route Planning State
  routeOrigin: null,
  routeDestination: null,
  activeVehicleProfile: 'HEAVY_ROVER',
  candidateRoutes: [],
  selectedRouteIndex: 0,
  isRoutePlannerOpen: false,
  isPickingRoutePoint: null,

  // Phase 10 Scientific Intelligence State
  activeIntelTab: 'layers',
  intelFocusedDatasetId: null,
  intelFocusedGeologyPeriod: null,
  intelFocusedQuadCode: null,
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
    set((state) => {
      const nextDrawer = state.activeDrawer === drawer ? null : drawer;
      return {
        activeDrawer: nextDrawer,
        isMissionControlOpen: nextDrawer ? false : state.isMissionControlOpen,
      };
    }),

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

  setSelectedLandmarkId: (landmarkId) => set({ selectedLandmarkId: landmarkId }),

  setSelectedRegionId: (regionId) =>
    set(() => {
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

  setIsLegendOpen: (open) => set({ isLegendOpen: open }),

  setActiveTerrainInspection: (data) => set({ activeTerrainInspection: data }),

  setActiveMeasurementTool: (tool) =>
    set((state) => ({
      activeMeasurementTool: tool,
      isMeasurementActive: tool !== null,
      // If switching or closing tool, reset points if closing
      measurementPoints: tool === null ? [] : state.measurementPoints,
      elevationTransect: tool === null ? null : state.elevationTransect,
    })),

  addMeasurementPoint: (point) =>
    set((state) => ({
      measurementPoints: [...state.measurementPoints, point],
    })),

  setMeasurementPoints: (points) =>
    set({
      measurementPoints: points,
    }),

  clearMeasurement: () =>
    set({
      measurementPoints: [],
      elevationTransect: null,
    }),

  setElevationTransect: (transect) =>
    set({
      elevationTransect: transect,
    }),

  // Phase 08 Actions
  setSelectedRoverId: (roverId) => set({ selectedRoverId: roverId }),
  setActiveSol: (sol) => set({ activeSol: sol }),
  setRoverTraverseVisible: (visible) => set({ isRoverTraverseVisible: visible }),
  setIsMissionControlOpen: (open) =>
    set((state) => ({
      isMissionControlOpen: open,
      isRoverTraverseVisible: open ? true : state.isRoverTraverseVisible,
      activeDrawer: open ? null : state.activeDrawer,
    })),

  // Phase 09 Actions
  setRouteOrigin: (coord) => set({ routeOrigin: coord }),
  setRouteDestination: (coord) => set({ routeDestination: coord }),
  setActiveVehicleProfile: (profile) => set({ activeVehicleProfile: profile }),
  setCandidateRoutes: (routes) =>
    set({
      candidateRoutes: routes,
      selectedRouteIndex: 0,
      elevationTransect: routes.length > 0 ? routes[0].elevationTransect : null,
    }),
  setSelectedRouteIndex: (index) =>
    set((state) => {
      const selected = state.candidateRoutes[index];
      return {
        selectedRouteIndex: index,
        elevationTransect: selected ? selected.elevationTransect : state.elevationTransect,
      };
    }),
  setIsRoutePlannerOpen: (open) => set({ isRoutePlannerOpen: open }),
  setIsPickingRoutePoint: (point) => set({ isPickingRoutePoint: point }),
  clearRoutePlanning: () =>
    set({
      routeOrigin: null,
      routeDestination: null,
      candidateRoutes: [],
      selectedRouteIndex: 0,
      isPickingRoutePoint: null,
    }),

  // Phase 10 Scientific Intelligence Actions
  setActiveIntelTab: (tab) => set({ activeIntelTab: tab }),
  openIntelForDataset: (datasetId) =>
    set({
      activeDrawer: 'intel',
      activeIntelTab: 'layers',
      intelFocusedDatasetId: datasetId,
    }),
  openIntelForGeology: (period, quadCode) =>
    set({
      activeDrawer: 'intel',
      activeIntelTab: 'geology',
      intelFocusedGeologyPeriod: period,
      intelFocusedQuadCode: quadCode ?? null,
    }),
  openIntelForRouteEvaluation: () =>
    set({
      activeDrawer: 'intel',
      activeIntelTab: 'routes',
    }),
}));
