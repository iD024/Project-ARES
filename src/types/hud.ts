/**
 * ARES HUD Types & Interfaces
 */

export type ViewMode = 'GLOBAL_3D' | 'REGIONAL_2D' | 'LOCAL_ANALYSIS';

export type DrawerId = 'layers' | 'tools' | 'sites' | null;

export type ModalId = 'provenance' | 'mission' | null;

export type DataClassification = 'OBSERVED' | 'DERIVED' | 'MODELED' | 'SIMULATED';

export type LayerCategory = 'surface' | 'topography' | 'multispectral' | 'geology' | 'features';

export interface LayerItem {
  id: string;
  name: string;
  subtitle: string;
  category: LayerCategory;
  classification: DataClassification;
  provider: string;
  resolution: string;
  coverage: string;
  visible: boolean;
  opacity: number; // 0.0 to 1.0
  sourceUrl: string;
  whatItIs?: string;
  howItLooks?: string;
  colorSwatch?: string;
  healthStatus?: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'UNKNOWN';
  minScale?: number;
  maxScale?: number;
  extent?: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
}

export interface TelemetryData {
  latitude: number;
  longitude: number;
  elevation: number;
  altitudeKm: number;
  subsolarLon: number;
  scale: string;
  crs: string;
}

export interface TerrainInspectionData {
  longitude: number;
  latitude: number;
  elevationMeters: number;
  regionalSlopeDegrees?: number;
  slopeCategory?: string;
  quadrangleName?: string;
  quadrangleCode?: string;
  geologicalPeriod?: 'Amazonian' | 'Hesperian' | 'Noachian' | 'Undivided' | string;
  classification?: DataClassification | 'INTERPRETED' | string;
}

