/**
 * ARES Mars Geodetic Constants & Configuration
 *
 * Spheroid & Datum: IAU 2000 Mars Datum (D_Mars_2000)
 * Well-Known ID (WKID): 104905 (GCS_Mars_2000 Sphere) / 104971 (GCS_Mars_2000 Spheroid)
 */

export interface MarsSpatialReferenceConfig {
  wkid: number;
  name: string;
}

export const MARS_SPATIAL_REFERENCE: MarsSpatialReferenceConfig = {
  wkid: 104905,
  name: 'GCS_Mars_2000',
};

/**
 * Mars Physical Radii (in meters)
 * Equatorial: 3,396.19 km
 * Polar: 3,376.20 km
 */
export const MARS_EQUATORIAL_RADIUS_METERS = 3396190.0;
export const MARS_POLAR_RADIUS_METERS = 3376200.0;
export const MARS_MEAN_RADIUS_METERS = 3389500.0;

export interface MarsLandingSite {
  id: string;
  name: string;
  mission: string;
  roverOrLander: string;
  landingDate: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  targetFeatures: string[];
}

export const MARS_LANDING_SITES: MarsLandingSite[] = [
  {
    id: 'perseverance',
    name: 'Perseverance (Jezero Crater)',
    mission: 'Mars 2020',
    roverOrLander: 'Perseverance Rover & Ingenuity Helicopter',
    landingDate: '2021-02-18',
    latitude: 18.38,
    longitude: 77.45,
    elevationMeters: -2560,
    targetFeatures: ['Neretva Vallis Delta', 'Kodiak Buttes', 'Crater Floor'],
  },
  {
    id: 'curiosity',
    name: 'Curiosity (Gale Crater)',
    mission: 'Mars Science Laboratory (MSL)',
    roverOrLander: 'Curiosity Rover',
    landingDate: '2012-08-06',
    latitude: -4.59,
    longitude: 137.44,
    elevationMeters: -4500,
    targetFeatures: ['Aeolis Mons (Mount Sharp)', 'Vera Rubin Ridge', 'Gediz Vallis'],
  },
  {
    id: 'insight',
    name: 'InSight (Elysium Planitia)',
    mission: 'InSight Lander',
    roverOrLander: 'InSight Lander',
    landingDate: '2018-11-26',
    latitude: 4.50,
    longitude: 135.62,
    elevationMeters: -2610,
    targetFeatures: ['Smooth Volcanic Plain', 'Subsurface Seismic Studies'],
  },
  {
    id: 'opportunity',
    name: 'Opportunity (Meridiani Planum)',
    mission: 'Mars Exploration Rover (MER-B)',
    roverOrLander: 'Opportunity Rover',
    landingDate: '2004-01-25',
    latitude: -1.95,
    longitude: -5.53, // 354.47° E normalized to GIS [-180, 180] (5.53° W)
    elevationMeters: -1400,
    targetFeatures: ['Eagle Crater', 'Endurance Crater', 'Victoria Crater', 'Endeavour Crater'],
  },
  {
    id: 'spirit',
    name: 'Spirit (Gusev Crater)',
    mission: 'Mars Exploration Rover (MER-A)',
    roverOrLander: 'Spirit Rover',
    landingDate: '2004-01-04',
    latitude: -14.57,
    longitude: 175.47,
    elevationMeters: -1900,
    targetFeatures: ['Columbia Hills', 'Home Plate', 'Husband Hill'],
  },
  {
    id: 'zhurong',
    name: 'Zhurong (Utopia Planitia)',
    mission: 'Tianwen-1 (CNSA)',
    roverOrLander: 'Zhurong Rover & Lander',
    landingDate: '2021-05-14',
    latitude: 25.07,
    longitude: 109.93,
    elevationMeters: -4000,
    targetFeatures: ['Ancient Mud Volcanoes', 'Subsurface Ice Evidence', 'Southern Utopia Dunes'],
  },
  {
    id: 'phoenix',
    name: 'Phoenix (Vastitas Borealis)',
    mission: 'Phoenix Mars Lander',
    roverOrLander: 'Phoenix Polar Lander',
    landingDate: '2008-05-25',
    latitude: 68.22,
    longitude: -125.75, // 234.25° E
    elevationMeters: -4130,
    targetFeatures: ['Permafrost Ice Layer', 'Perchlorate Chemistry', 'Polar Polygon Soil'],
  },
  {
    id: 'viking1',
    name: 'Viking 1 (Chryse Planitia)',
    mission: 'Viking 1',
    roverOrLander: 'Viking 1 Lander',
    landingDate: '1976-07-20',
    latitude: 22.48,
    longitude: -47.97, // 312.03° E
    elevationMeters: -2690,
    targetFeatures: ['First Successful Mars Landing', 'Atmosphere & Soil Sampling'],
  },
  {
    id: 'viking2',
    name: 'Viking 2 (Utopia Planitia)',
    mission: 'Viking 2',
    roverOrLander: 'Viking 2 Lander',
    landingDate: '1976-09-03',
    latitude: 48.27,
    longitude: 134.00,
    elevationMeters: -4230,
    targetFeatures: ['Mie Crater Ejecta Field', 'Seasonal Frost Cycle Observations'],
  },
  {
    id: 'pathfinder',
    name: 'Mars Pathfinder (Ares Vallis)',
    mission: 'Mars Pathfinder',
    roverOrLander: 'Pathfinder Lander & Sojourner Rover',
    landingDate: '1997-07-04',
    latitude: 19.33,
    longitude: -33.55, // 326.45° E
    elevationMeters: -3680,
    targetFeatures: ['Catastrophic Outflow Channel', 'First Wheeled Rover on Mars', 'Barnacle Bill Rock'],
  },
  {
    id: 'beagle2',
    name: 'Beagle 2 (Isidis Planitia)',
    mission: 'ESA Mars Express',
    roverOrLander: 'Beagle 2 Lander',
    landingDate: '2003-12-25',
    latitude: 11.53,
    longitude: 90.43,
    elevationMeters: -3700,
    targetFeatures: ['Isidis Impact Basin Floor', 'Exobiology & Isotopic Soil Analysis'],
  },
  {
    id: 'mars3',
    name: 'Mars 3 (Sirenum Terra)',
    mission: 'Soviet Mars 3',
    roverOrLander: 'Mars 3 Lander & Prop-M Rover',
    landingDate: '1971-12-02',
    latitude: -45.00,
    longitude: -158.00, // 202.00° E
    elevationMeters: -1000,
    targetFeatures: ['First Soft Landing on Mars', 'Prop-M Tethered Micro-Rover Experiment'],
  },
];

/**
 * Formats decimal latitude and longitude into planetary notation.
 * e.g., (18.38, 77.45) -> "18.38° N, 77.45° E"
 */
export function formatMarsCoordinates(latitude: number, longitude: number): string {
  const latCard = latitude >= 0 ? 'N' : 'S';
  const lonCard = longitude >= 0 ? 'E' : 'W';
  const latStr = Math.abs(latitude).toFixed(2);
  const lonStr = Math.abs(longitude).toFixed(2);

  return `${latStr}° ${latCard}, ${lonStr}° ${lonCard}`;
}

