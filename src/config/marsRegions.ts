/**
 * ARES Mars Regional Exploration Configuration & Scientific Bookmarks
 *
 * Defines high-priority scientific interest regions across Mars with verified
 * coordinates, bounding boxes (extents), optimal cartographic scales, and geological context.
 *
 * Datum: IAU 2000 Mars (GCS_Mars_2000, WKID 104971 / 104905)
 */

export interface MarsRegionExtent {
  minLongitude: number;
  minLatitude: number;
  maxLongitude: number;
  maxLatitude: number;
}

export interface MarsRegion {
  id: string;
  name: string;
  quadrangle: string;
  type: 'CRATER' | 'VOLCANO' | 'CANYON' | 'PLAINS';
  centerLatitude: number;
  centerLongitude: number;
  elevationMeters: number;
  targetScale: number; // e.g. 1:500,000 for regional map
  extent: MarsRegionExtent;
  missionContext?: string;
  geologicalFeatures: string[];
  description: string;
}

export const MARS_REGIONS: MarsRegion[] = [
  {
    id: 'jezero-crater',
    name: 'Jezero Crater & Neretva Delta',
    quadrangle: 'MC-13 Syrtis Major',
    type: 'CRATER',
    centerLatitude: 18.38,
    centerLongitude: 77.45,
    elevationMeters: -2560,
    targetScale: 500000,
    extent: {
      minLongitude: 76.5,
      minLatitude: 17.5,
      maxLongitude: 78.5,
      maxLatitude: 19.2,
    },
    missionContext: 'Mars 2020 Perseverance Rover & Ingenuity Mars Helicopter',
    geologicalFeatures: [
      'Neretva Vallis Inflow Delta',
      'Kodiak Butte Outlier',
      'Western Fan Sediments',
      'Olivine-bearing Crater Floor',
    ],
    description:
      'Ancient 45-km diameter impact crater hosting a well-preserved river-lake delta system rich in clay minerals, biosignature targets, and layered lacustrine strata.',
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater & Mount Sharp',
    quadrangle: 'MC-23 Aeolis',
    type: 'CRATER',
    centerLatitude: -4.59,
    centerLongitude: 137.44,
    elevationMeters: -4500,
    targetScale: 600000,
    extent: {
      minLongitude: 136.5,
      minLatitude: -5.6,
      maxLongitude: 138.5,
      maxLatitude: -3.8,
    },
    missionContext: 'Mars Science Laboratory (MSL) Curiosity Rover',
    geologicalFeatures: [
      'Aeolis Mons (Mount Sharp 5.5 km peak)',
      'Vera Rubin Hematite Ridge',
      'Gediz Vallis Channel',
      'Clay and Sulfate-bearing Layered Strata',
    ],
    description:
      'A 154-km impact basin featuring a 5.5 km central sedimentary mound displaying billions of years of hydrological and climatic Martian history.',
  },
  {
    id: 'olympus-mons',
    name: 'Olympus Mons Caldera & Scarp',
    quadrangle: 'MC-09 Tharsis',
    type: 'VOLCANO',
    centerLatitude: 18.65,
    centerLongitude: 226.2,
    elevationMeters: 21287,
    targetScale: 2000000,
    extent: {
      minLongitude: 223.0,
      minLatitude: 15.0,
      maxLongitude: 230.0,
      maxLatitude: 22.0,
    },
    missionContext: 'Global Planetary Geomorphology Benchmark',
    geologicalFeatures: [
      'Summit Caldera Complex (80 km wide)',
      'Basal Scarp Cliffs (6-8 km high)',
      'Lava Flow Channels and Tubes',
      'Aureole Deposit Lobes',
    ],
    description:
      'The largest volcano in the Solar System, standing nearly 22 km above Martian datum with complex overlapping caldera collapse pits and steep perimeter scarps.',
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris (Candor & Melas Chasmata)',
    quadrangle: 'MC-18 Coprates',
    type: 'CANYON',
    centerLatitude: -6.53,
    centerLongitude: 284.1,
    elevationMeters: -3800,
    targetScale: 1500000,
    extent: {
      minLongitude: 280.0,
      minLatitude: -10.0,
      maxLongitude: 288.0,
      maxLatitude: -4.0,
    },
    missionContext: 'Tectonic Rift & Hydrological Stratigraphy Corridor',
    geologicalFeatures: [
      'Candor Chasma Layered Internal Deposits',
      'Melas Chasma Deep Floor',
      'Massive Landslide Debris Lobes',
      'Subsurface Sulfate Veins',
    ],
    description:
      'The Grand Canyon of Mars, stretching over 4,000 km across the equatorial region with depths exceeding 8 km and extensive light-toned layered sedimentary exposures.',
  },
  {
    id: 'elysium-planitia',
    name: 'Elysium Planitia',
    quadrangle: 'MC-15 Elysium',
    type: 'PLAINS',
    centerLatitude: 4.5,
    centerLongitude: 135.62,
    elevationMeters: -2610,
    targetScale: 1000000,
    extent: {
      minLongitude: 133.5,
      minLatitude: 2.5,
      maxLongitude: 137.5,
      maxLatitude: 6.5,
    },
    missionContext: 'NASA InSight Geophysics Lander',
    geologicalFeatures: [
      'Smooth Young Flood Basalt Regolith',
      'Subsurface Seismic Discontinuity Zones',
      'Cerberus Fossae Graben Fractures',
    ],
    description:
      'Broad, smooth volcanic plain ideal for geophysical sounding; seismic epicenter of recent marsquakes originating from Cerberus Fossae.',
  },
];

/**
 * Find a region by its unique ID.
 */
export function getRegionById(id: string): MarsRegion | undefined {
  return MARS_REGIONS.find((r) => r.id === id);
}

