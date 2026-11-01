/**
 * ARES Scientific Dataset Registry
 *
 * Governs all verified Mars planetary datasets according to DATA_CATALOG.md.
 * Distinguishes OBSERVED, DERIVED, MODELED, and SIMULATED data types.
 */

import { DataClassification } from '../../types/hud.ts';

export type DatasetCategory =
  | 'surface'
  | 'topography'
  | 'multispectral'
  | 'geology'
  | 'features';

export type LayerDeliveryFormat =
  | 'TILE_SERVER'
  | 'IMAGE_SERVER'
  | 'WMS'
  | 'WMTS'
  | 'GEOJSON';

export interface DatasetEntry {
  id: string;
  name: string;
  mission: string;
  provider: string;
  category: DatasetCategory;
  classification: DataClassification;
  spatialReference: string;
  resolution: string;
  coverage: string;
  accessProtocol: string;
  format: LayerDeliveryFormat;
  endpointUrl: string;
  license: string;
  citation: string;
  description: string;
  defaultOpacity?: number;
  minScale?: number;
  maxScale?: number;
  extent?: {
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  };
  nasaTrekId?: string;
}

export const DATASET_REGISTRY: DatasetEntry[] = [
  {
    id: 'mars-viking-mdim21',
    name: 'Viking MDIM 2.1 Color Mosaic',
    mission: 'Viking 1 & 2 Orbiters',
    provider: 'NASA / USGS Astrogeology Science Center',
    category: 'surface',
    classification: 'OBSERVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: '232 m/px (256 px/deg)',
    coverage: 'Global (100%)',
    accessProtocol: 'ArcGIS MapServer / NASA Trek WMTS',
    format: 'TILE_SERVER',
    endpointUrl: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer',
    license: 'Public Domain (NASA / USGS open science)',
    citation: 'Archinal, B. et al. (2003). Mars Digital Image Mosaic 2.1. USGS Open-File Report.',
    description: 'Orthorectified digital image mosaic combining calibrated visual filters for seamless planetary true-color visualization.',
    defaultOpacity: 1.0,
  },
  {
    id: 'mars-hrsc-mola-blend',
    name: 'HRSC–MOLA Blended Digital Elevation Model',
    mission: 'ESA Mars Express & NASA Mars Global Surveyor',
    provider: 'ESA / DLR / USGS Astrogeology',
    category: 'topography',
    classification: 'DERIVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: '200 m/px (approx. 296 px/deg)',
    coverage: 'Global (100%)',
    accessProtocol: 'ArcGIS ImageServer / LERC',
    format: 'IMAGE_SERVER',
    endpointUrl: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer',
    license: 'Public Domain (ESA / NASA open planetary data)',
    citation: 'Fergason, R. L. et al. (2018). HRSC and MOLA Blended Digital Elevation Model at 200m v2. USGS Astrogeology.',
    description: 'Rigorous photogrammetric blend merging High Resolution Stereo Camera stereoscopic elevations with MOLA laser altimetry control.',
    defaultOpacity: 0.85,
  },
  {
    id: 'mars-ctx-mosaic',
    name: 'Context Camera (CTX) Global Mosaic',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    provider: 'Caltech Murray Lab / NASA JPL',
    category: 'surface',
    classification: 'OBSERVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: '5.0–6.0 m/px',
    coverage: 'Global Mosaic (>99.5% Mars surface)',
    accessProtocol: 'XYZ Tile Stream / WMTS',
    format: 'TILE_SERVER',
    endpointUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/',
    license: 'NASA / JPL Open Data',
    citation: 'Dickson, J. L. et al. (2023). A Global 5.0m/pixel Context Camera (CTX) Mosaic of Mars. Earth and Space Science.',
    description: 'Sub-decameter global baseline mosaic assembled from 110,000+ MRO CTX images for regional exploration.',
    defaultOpacity: 0.9,
    minScale: 2500000,
    maxScale: 25000,
  },
  {
    id: 'mars-geologic-quads',
    name: 'USGS Geologic Map of Mars Quad Series',
    mission: 'USGS Astrogeology Planetary Mapping Program',
    provider: 'USGS Astrogeology Science Center',
    category: 'geology',
    classification: 'DERIVED',
    spatialReference: 'Simple Cylindrical (Mars 2000)',
    resolution: '1:5,000,000 Scale',
    coverage: 'Global Quad Charts (MC-01 through MC-30)',
    accessProtocol: 'USGS Planetary WMS',
    format: 'WMS',
    endpointUrl: 'https://planetarymaps.usgs.gov/cgi-bin/mapserv?map=/maps/mars/mars_simp_cyl.map',
    license: 'Public Domain (USGS)',
    citation: 'Tanaka, K. L. et al. (2014). Geologic Map of Mars. USGS Scientific Investigations Map 3292.',
    description: 'Stratigraphic geologic mapping synthesizing Viking, MGS, Odyssey, and MRO data into chronostratigraphic Martian units.',
    defaultOpacity: 0.65,
    minScale: 25000000,
    maxScale: 500000,
  },
  {
    id: 'mars-hirise-footprints',
    name: 'HiRISE DTM Coverage & Footprint Index',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    provider: 'University of Arizona / NASA PDS Geosciences',
    category: 'features',
    classification: 'DERIVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: '0.25–1.0 m/px Footprint Extents',
    coverage: 'High-Priority Sites (Jezero Crater, Gale Crater, Olympus Mons)',
    accessProtocol: 'GeoJSON Vector Index',
    format: 'GEOJSON',
    endpointUrl: '/data/hirise_footprints.geojson',
    license: 'NASA PDS Open Science',
    citation: 'McEwen, A. S. et al. (2007). Mars Reconnaissance Orbiter\'s High Resolution Imaging Science Experiment (HiRISE). JGR Planets.',
    description: 'Vector polygon index representing validated sub-meter digital terrain model coverage from the HiRISE experiment.',
    defaultOpacity: 1.0,
    minScale: 10000000,
    maxScale: 1000,
  },
  {
    id: 'mars-hirise-jezero-dtm',
    name: 'HiRISE Jezero Crater Delta DTM',
    mission: 'Mars Reconnaissance Orbiter (MRO)',
    provider: 'NASA / JPL / University of Arizona / USGS',
    category: 'topography',
    classification: 'DERIVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: '0.25–1.0 m/px',
    coverage: 'Jezero Crater Delta (77°–78°E, 18°–19°N)',
    accessProtocol: 'NASA Trek WMTS / XYZ',
    format: 'WMTS',
    endpointUrl: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MRO_HiRISE_JezeroDelta_DTM/1.0.0/{level}/{col}/{row}.png',
    license: 'NASA / JPL / University of Arizona Open Science',
    citation: 'NASA/JPL/University of Arizona/USGS (2020). HiRISE Digital Terrain Model of Jezero Crater Western Delta.',
    description: 'Sub-meter digital elevation model and shaded relief for Jezero Crater western fan delta.',
    defaultOpacity: 1.0,
    minScale: 100000,
    maxScale: 1000,
    extent: {
      minLon: 77.0,
      maxLon: 78.5,
      minLat: 18.0,
      maxLat: 19.0,
    },
    nasaTrekId: 'Mars_MRO_HiRISE_JezeroDelta_DTM',
  },
  {
    id: 'mars-nomenclature',
    name: 'IAU Mars Planetary Gazetteer & Features',
    mission: 'IAU WGPSN / USGS Gazetteer',
    provider: 'International Astronomical Union / USGS',
    category: 'features',
    classification: 'OBSERVED',
    spatialReference: 'GCS_Mars_2000 (WKID 104971)',
    resolution: 'Named Craters, Montes, Chasmata, Vallis',
    coverage: 'Global Planetary Features',
    accessProtocol: 'GeoJSON Vector Points',
    format: 'GEOJSON',
    endpointUrl: '/data/mars_nomenclature.geojson',
    license: 'Public Domain',
    citation: 'Gazetteer of Planetary Nomenclature. IAU Working Group for Planetary System Nomenclature (WGPSN).',
    description: 'Authoritative nomenclature for Martian landing sites, mountains, chasms, and verified impact craters.',
    defaultOpacity: 1.0,
    minScale: 20000000,
    maxScale: 5000,
  },
];

export function getDatasetById(id: string): DatasetEntry | undefined {
  return DATASET_REGISTRY.find((d) => d.id === id);
}

export function getDatasetsByCategory(category: DatasetCategory): DatasetEntry[] {
  return DATASET_REGISTRY.filter((d) => d.category === category);
}
