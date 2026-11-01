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

