/**
 * ARES Mars Geodesy & Terrain Slope Math Engine
 *
 * Provides accurate planetary ground distance calculations, slope angle derivations,
 * and regional terrain slope classifications conforming strictly to the Mars 2000
 * Geodetic Datum (D_Mars_2000, WKID 104905 / 104971, equatorial radius a = 3,396,190 m).
 */

/**
 * Mars equatorial radius in meters according to IAU/IAG Mars 2000 coordinate system.
 */
export const MARS_RADIUS_METERS = 3396190;

/**
 * Mandatory scientific disclaimer for DEM-derived slope evaluations.
 * Distinguishes regional terrain slope from fine rover-scale obstacle hazards.
 */
export const REGIONAL_SLOPE_DISCLAIMER =
  'Regional terrain gradient derived from 200m DEM. Not suitable for rover-scale obstacle navigation.';

/**
 * Planetary terrain slope classification categories based on regional gradient.
 */
export type SlopeCategory = 'FLAT' | 'GENTLE' | 'MODERATE' | 'STEEP' | 'PRECIPITOUS';

/**
 * Detailed regional slope classification metadata.
 */
export interface TerrainSlopeClassification {
  category: SlopeCategory;
  angleDegrees: number;
  description: string;
  minAngleDegrees: number;
  maxAngleDegrees: number;
  disclaimer: string;
}

/**
 * Segment evaluation along an elevation transect profile.
 */
export interface ProfileSlopeSegment {
  segmentIndex: number;
  distanceMeters: number;
  elevationChangeMeters: number;
  slopeDegrees: number;
  classification: TerrainSlopeClassification;
}

/**
 * Summary metrics of an elevation transect profile.
 */
export interface ProfileSlopeSummary {
  averageSlopeDegrees: number;
  maxSlopeDegrees: number;
  minSlopeDegrees: number;
  overallSlopeDegrees: number;
  dominantClassification: TerrainSlopeClassification;
  maxClassification: TerrainSlopeClassification;
  segments: ProfileSlopeSegment[];
  disclaimer: string;
}

/**
 * Calculates Mars parallel ground distance for 1 degree of longitude at a specific latitude.
 *
 * @param latitudeDegrees Latitude in decimal degrees [-90, 90]
 * @returns Ground distance in meters for 1 degree of longitude at given latitude
 */
export function calculateMarsLongitudeDegreeDistance(latitudeDegrees: number): number {
  const latRad = (latitudeDegrees * Math.PI) / 180;
  return ((2 * Math.PI * MARS_RADIUS_METERS) / 360) * Math.cos(latRad);
}

/**
 * Calculates great-circle ground distance between two planetary coordinates on Mars
 * using the Haversine formula with Mars 2000 equatorial radius (R = 3,396,190 m).
 *
 * Accounts for longitude antimeridian wrapping [-180, 180] and [0, 360].
 *
 * @param lon1 Longitude of point 1 in degrees
 * @param lat1 Latitude of point 1 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @returns Geodesic surface distance in meters
 */
export function calculateMarsGroundDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number {
  if (lon1 === lon2 && lat1 === lat2) {
    return 0;
  }

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;

  // Shortest angular difference across antimeridian [-180, 180]
  const deltaLonDeg = (((lon2 - lon1) % 360 + 540) % 360) - 180;
  const deltaLambda = (deltaLonDeg * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const clampedA = Math.max(0, Math.min(1, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));

  return MARS_RADIUS_METERS * c;
}

/**
 * Computes slope angle in degrees: arctan(|deltaZ| / deltaD) * (180 / PI).
 *
 * @param elevationChangeMeters Vertical elevation delta (Z2 - Z1) in meters
 * @param horizontalDistanceMeters Horizontal ground distance in meters
 * @param options Optional configuration (e.g. signed slope angle)
 * @returns Slope angle in degrees [0, 90] (or [-90, 90] if signed: true)
 */
export function calculateSlopeAngle(
  elevationChangeMeters: number,
  horizontalDistanceMeters: number,
  options?: { signed?: boolean }
): number {
  if (horizontalDistanceMeters <= 0) {
    return 0;
  }

  const dz = options?.signed ? elevationChangeMeters : Math.abs(elevationChangeMeters);
  const angleRad = Math.atan(dz / horizontalDistanceMeters);
  return (angleRad * 180) / Math.PI;
}

/**
 * Classifies terrain slope based on regional planetary slope criteria:
 * - FLAT (0 to 2 deg): Smooth plains / mare
 * - GENTLE (2 to 5 deg): Low rolling terrain
 * - MODERATE (5 to 15 deg): Crater walls / rolling hills
 * - STEEP (15 to 25 deg): Canyon rims / mountain slopes
 * - PRECIPITOUS (>25 deg): Chasmata escarpments / volcanic calderas
 *
 * @param angleDegrees Slope angle in degrees
 * @returns TerrainSlopeClassification object with scientific disclaimer
 */
export function classifyRegionalSlope(angleDegrees: number): TerrainSlopeClassification {
  const absAngle = Math.abs(angleDegrees);

  if (absAngle < 2) {
    return {
      category: 'FLAT',
      angleDegrees: absAngle,
      description: 'Smooth plains / mare',
      minAngleDegrees: 0,
      maxAngleDegrees: 2,
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  } else if (absAngle < 5) {
    return {
      category: 'GENTLE',
      angleDegrees: absAngle,
      description: 'Low rolling terrain',
      minAngleDegrees: 2,
      maxAngleDegrees: 5,
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  } else if (absAngle < 15) {
    return {
      category: 'MODERATE',
      angleDegrees: absAngle,
      description: 'Crater walls / rolling hills',
      minAngleDegrees: 5,
      maxAngleDegrees: 15,
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  } else if (absAngle < 25) {
    return {
      category: 'STEEP',
      angleDegrees: absAngle,
      description: 'Canyon rims / mountain slopes',
      minAngleDegrees: 15,
      maxAngleDegrees: 25,
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  } else {
    return {
      category: 'PRECIPITOUS',
      angleDegrees: absAngle,
      description: 'Chasmata escarpments / volcanic calderas',
      minAngleDegrees: 25,
      maxAngleDegrees: 90,
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  }
}

/**
 * Estimates slope profile metrics along an elevation transect.
 * Computes individual segment slopes, distance-weighted average slope,
 * maximum slope encountered, and overall net slope.
 *
 * @param points Array of elevation profile points with cumulative distanceMeters and elevation
 * @returns ProfileSlopeSummary containing segments and overall classification
 */
export function estimateMarsElevationProfileSlope(
  points: Array<{ elevation: number; distanceMeters: number }>
): ProfileSlopeSummary {
  if (!points || points.length < 2) {
    const flatClassification = classifyRegionalSlope(0);
    return {
      averageSlopeDegrees: 0,
      maxSlopeDegrees: 0,
      minSlopeDegrees: 0,
      overallSlopeDegrees: 0,
      dominantClassification: flatClassification,
      maxClassification: flatClassification,
      segments: [],
      disclaimer: REGIONAL_SLOPE_DISCLAIMER,
    };
  }

  const segments: ProfileSlopeSegment[] = [];
  let totalDistance = 0;
  let weightedSlopeSum = 0;
  let maxSlope = 0;
  let minSlope = Infinity;

  for (let i = 1; i < points.length; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];

    const segmentDist = Math.max(0, pCurr.distanceMeters - pPrev.distanceMeters);
    const deltaZ = pCurr.elevation - pPrev.elevation;
    const slope = segmentDist > 0 ? calculateSlopeAngle(deltaZ, segmentDist) : 0;
    const classification = classifyRegionalSlope(slope);

    segments.push({
      segmentIndex: i - 1,
      distanceMeters: segmentDist,
      elevationChangeMeters: deltaZ,
      slopeDegrees: slope,
      classification,
    });

    if (segmentDist > 0) {
      totalDistance += segmentDist;
      weightedSlopeSum += slope * segmentDist;
    }

    if (slope > maxSlope) {
      maxSlope = slope;
    }
    if (slope < minSlope) {
      minSlope = slope;
    }
  }

  if (minSlope === Infinity) {
    minSlope = 0;
  }

  const averageSlope = totalDistance > 0 ? weightedSlopeSum / totalDistance : 0;
  const overallDistance = Math.max(
    0,
    points[points.length - 1].distanceMeters - points[0].distanceMeters
  );
  const overallElevationChange =
    points[points.length - 1].elevation - points[0].elevation;
  const overallSlope =
    overallDistance > 0 ? calculateSlopeAngle(overallElevationChange, overallDistance) : 0;

  return {
    averageSlopeDegrees: averageSlope,
    maxSlopeDegrees: maxSlope,
    minSlopeDegrees: minSlope,
    overallSlopeDegrees: overallSlope,
    dominantClassification: classifyRegionalSlope(averageSlope),
    maxClassification: classifyRegionalSlope(maxSlope),
    segments,
    disclaimer: REGIONAL_SLOPE_DISCLAIMER,
  };
}
