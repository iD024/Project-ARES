/**
 * ARES Mars 2000 Terrain-Aware Route Planning Service (Phase 09)
 *
 * Implements discrete geodetic lattice generation, 8-neighbor slope cost surfaces,
 * multi-candidate A* pathfinding (Safest, Balanced, Direct Distance), and vehicle profile
 * telemetry strictly referencing Mars 2000 datum (D_Mars_2000, WKID 104971, R = 3,396,190 m).
 */

import {
  calculateMarsGroundDistance,
} from './marsGeodesyService.ts';
import { queryPointElevation } from './terrainElevationService.ts';
import {
  GeodesicCoordinate,
  ElevationTransectResult,
} from './measurementService.ts';

export type VehicleProfileType = 'HEAVY_ROVER' | 'SCOUT_ROVER' | 'AERIAL_DRONE';

export interface VehicleProfile {
  id: VehicleProfileType;
  name: string;
  maxSlopeDegrees: number;
  speedMetersPerSol: number;
  description: string;
}

export const VEHICLE_PROFILES: Record<VehicleProfileType, VehicleProfile> = {
  HEAVY_ROVER: {
    id: 'HEAVY_ROVER',
    name: 'Heavy Planetary Rover (Perseverance / Curiosity class)',
    maxSlopeDegrees: 15,
    speedMetersPerSol: 100,
    description: 'Autonomous science lab with rocker-bogie suspension and MMRTG nuclear power.',
  },
  SCOUT_ROVER: {
    id: 'SCOUT_ROVER',
    name: 'Light Scout Rover (Sojourner / MER class)',
    maxSlopeDegrees: 12,
    speedMetersPerSol: 50,
    description: 'Agile solar-powered scout designed for flat plain reconnaissance and outcrop sampling.',
  },
  AERIAL_DRONE: {
    id: 'AERIAL_DRONE',
    name: 'Planetary Aerial Drone (Ingenuity / Hexacopter class)',
    maxSlopeDegrees: 90,
    speedMetersPerSol: 1000,
    description: 'Rotary aerial scout independent of surface topography with 1 km/flight hop capability.',
  },
};

export interface RoutePlanningPreset {
  id: string;
  name: string;
  description: string;
  origin: GeodesicCoordinate;
  destination: GeodesicCoordinate;
  recommendedVehicle: VehicleProfileType;
}

export const ROUTE_PLANNING_PRESETS: RoutePlanningPreset[] = [
  {
    id: 'jezero-delta-fan',
    name: 'Jezero Delta Fan Margin Traverse',
    description: 'Octavia E. Butler landing site across crater floor to the ancient river delta fan front.',
    origin: { lon: 77.45, lat: 18.38 },
    destination: { lon: 77.38, lat: 18.42 },
    recommendedVehicle: 'HEAVY_ROVER',
  },
  {
    id: 'gale-mount-sharp',
    name: 'Gale Crater Mount Sharp Ascent',
    description: 'Bradbury Landing site across basaltic sand dunes ascending toward Aeolis Mons foothills.',
    origin: { lon: 137.44, lat: -4.59 },
    destination: { lon: 137.40, lat: -4.75 },
    recommendedVehicle: 'HEAVY_ROVER',
  },
  {
    id: 'valles-marineris-chasma',
    name: 'Valles Marineris Candor Chasma Crossing',
    description: 'Descent from Ophir Planum plateau down onto the layered sulfate floor of Candor Chasma.',
    origin: { lon: 284.1, lat: -6.53 },
    destination: { lon: 284.5, lat: -6.85 },
    recommendedVehicle: 'SCOUT_ROVER',
  },
  {
    id: 'arcadia-base-ice-corridor',
    name: 'Arcadia Base Alpha → Glacial Ice Corridor',
    description: 'Strategic colony transit corridor connecting Starship primary base to massive SWIM subsurface ice sheets.',
    origin: { lon: 189.7, lat: 39.3 },
    destination: { lon: 191.2, lat: 40.5 },
    recommendedVehicle: 'HEAVY_ROVER',
  },
];

export interface RouteWaypoint {
  longitude: number;
  latitude: number;
  elevationMeters: number;
  distanceFromStartKm: number;
  segmentSlopeDegrees: number;
}

export interface CandidateRouteResult {
  id: 'SAFEST' | 'BALANCED' | 'DIRECT';
  name: string;
  description: string;
  colorHex: string;
  colorRgba: [number, number, number, number];
  waypoints: RouteWaypoint[];
  totalDistanceKm: number;
  maxSlopeDegrees: number;
  averageSlopeDegrees: number;
  elevationChangeMeters: number;
  totalAscentMeters: number;
  totalDescentMeters: number;
  estimatedSols: number;
  isTraversable: boolean;
  warningMessage?: string;
  elevationTransect: ElevationTransectResult;
}

interface LatticeNode {
  index: number;
  lon: number;
  lat: number;
  elev: number;
}

/**
 * Plans 3 multi-candidate terrain-aware surface routes on Mars.
 */
export async function planMarsRoutes(
  origin: GeodesicCoordinate,
  destination: GeodesicCoordinate,
  vehicleType: VehicleProfileType = 'HEAVY_ROVER'
): Promise<CandidateRouteResult[]> {
  const vehicle = VEHICLE_PROFILES[vehicleType] || VEHICLE_PROFILES.HEAVY_ROVER;

  // Direct distance between origin and destination
  const directDistanceMeters = calculateMarsGroundDistance(
    origin.lon,
    origin.lat,
    destination.lon,
    destination.lat
  );
  const directDistanceKm = directDistanceMeters / 1000;

  // Adaptive lattice grid resolution based on distance
  let gridRes = 25;
  if (directDistanceKm >= 20 && directDistanceKm < 80) gridRes = 30;
  else if (directDistanceKm >= 80) gridRes = 35;

  // Construct geodetic bounding box with 25% safety expansion margin
  const minLonRaw = Math.min(origin.lon, destination.lon);
  const maxLonRaw = Math.max(origin.lon, destination.lon);
  const minLatRaw = Math.min(origin.lat, destination.lat);
  const maxLatRaw = Math.max(origin.lat, destination.lat);

  const spanLon = Math.max(0.04, maxLonRaw - minLonRaw);
  const spanLat = Math.max(0.04, maxLatRaw - minLatRaw);
  const marginLon = spanLon * 0.25;
  const marginLat = spanLat * 0.25;

  const minLon = minLonRaw - marginLon;
  const maxLon = maxLonRaw + marginLon;
  const minLat = Math.max(-89.9, minLatRaw - marginLat);
  const maxLat = Math.min(89.9, maxLatRaw + marginLat);

  // Generate grid nodes and sample elevations
  const stepLon = (maxLon - minLon) / (gridRes - 1);
  const stepLat = (maxLat - minLat) / (gridRes - 1);

  const nodes: LatticeNode[] = [];
  const elevationPromises: Promise<number>[] = [];

  for (let j = 0; j < gridRes; j++) {
    const lat = minLat + j * stepLat;
    for (let i = 0; i < gridRes; i++) {
      const lon = minLon + i * stepLon;
      nodes.push({
        index: nodes.length,
        lon,
        lat,
        elev: 0,
      });
      elevationPromises.push(queryPointElevation(lon, lat));
    }
  }

  const sampledElevations = await Promise.all(elevationPromises);
  for (let idx = 0; idx < nodes.length; idx++) {
    nodes[idx].elev = sampledElevations[idx];
  }

  // Find nearest start and goal node indices
  let startIdx = 0;
  let goalIdx = 0;
  let minStartDist = Infinity;
  let minGoalDist = Infinity;

  nodes.forEach((node) => {
    const dStart = calculateMarsGroundDistance(node.lon, node.lat, origin.lon, origin.lat);
    if (dStart < minStartDist) {
      minStartDist = dStart;
      startIdx = node.index;
    }
    const dGoal = calculateMarsGroundDistance(node.lon, node.lat, destination.lon, destination.lat);
    if (dGoal < minGoalDist) {
      minGoalDist = dGoal;
      goalIdx = node.index;
    }
  });

  // A* pathfinder function for a given configuration
  function runAStar(
    slopeWeight: number,
    cutoffSlope: number,
    uphillWeight: number
  ): { nodePath: LatticeNode[]; isTraversable: boolean } {
    const gScore = new Float64Array(nodes.length).fill(Infinity);
    const fScore = new Float64Array(nodes.length).fill(Infinity);
    const cameFrom = new Int32Array(nodes.length).fill(-1);
    const inOpenSet = new Uint8Array(nodes.length).fill(0);
    const openSet: number[] = [startIdx];

    gScore[startIdx] = 0;
    fScore[startIdx] = calculateMarsGroundDistance(
      nodes[startIdx].lon,
      nodes[startIdx].lat,
      nodes[goalIdx].lon,
      nodes[goalIdx].lat
    );
    inOpenSet[startIdx] = 1;

    let iterations = 0;
    const maxIterations = nodes.length * 8;

    while (openSet.length > 0 && iterations++ < maxIterations) {
      // Find node with lowest fScore
      let bestIdx = 0;
      let lowestF = fScore[openSet[0]];
      for (let k = 1; k < openSet.length; k++) {
        const f = fScore[openSet[k]];
        if (f < lowestF) {
          lowestF = f;
          bestIdx = k;
        }
      }

      const current = openSet[bestIdx];
      if (current === goalIdx) {
        // Reconstruct path
        const pathIndices: number[] = [];
        let curr = goalIdx;
        while (curr !== -1) {
          pathIndices.push(curr);
          curr = cameFrom[curr];
        }
        pathIndices.reverse();
        return {
          nodePath: pathIndices.map((i) => nodes[i]),
          isTraversable: true,
        };
      }

      openSet.splice(bestIdx, 1);
      inOpenSet[current] = 0;

      const cI = current % gridRes;
      const cJ = Math.floor(current / gridRes);

      // Explore 8 spatial neighbors
      for (let dj = -1; dj <= 1; dj++) {
        for (let di = -1; di <= 1; di++) {
          if (di === 0 && dj === 0) continue;
          const ni = cI + di;
          const nj = cJ + dj;
          if (ni < 0 || ni >= gridRes || nj < 0 || nj >= gridRes) continue;

          const neighbor = nj * gridRes + ni;
          const u = nodes[current];
          const v = nodes[neighbor];

          const edgeDist = calculateMarsGroundDistance(u.lon, u.lat, v.lon, v.lat);
          const dz = v.elev - u.elev;
          const slopeDeg = (Math.atan(Math.abs(dz) / Math.max(1, edgeDist)) * 180) / Math.PI;

          // Slope barrier
          if (slopeDeg > cutoffSlope) {
            continue;
          }

          const slopeCost = Math.pow(slopeDeg / Math.max(1, cutoffSlope), 2);
          const uphillCost = dz > 0 ? (dz / edgeDist) * uphillWeight : 0;
          const traversalCost = edgeDist * (1.0 + slopeWeight * slopeCost + uphillCost);

          const tentativeG = gScore[current] + traversalCost;
          if (tentativeG < gScore[neighbor]) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentativeG;
            const h = calculateMarsGroundDistance(v.lon, v.lat, nodes[goalIdx].lon, nodes[goalIdx].lat);
            fScore[neighbor] = tentativeG + h;

            if (inOpenSet[neighbor] === 0) {
              openSet.push(neighbor);
              inOpenSet[neighbor] = 1;
            }
          }
        }
      }
    }

    // Fallback: If no path found, return direct interpolated line
    const fallbackCount = 10;
    const fallbackPath: LatticeNode[] = [];
    for (let f = 0; f <= fallbackCount; f++) {
      const frac = f / fallbackCount;
      const lon = origin.lon + frac * (destination.lon - origin.lon);
      const lat = origin.lat + frac * (destination.lat - origin.lat);
      fallbackPath.push({
        index: -1,
        lon,
        lat,
        elev: nodes[startIdx].elev + frac * (nodes[goalIdx].elev - nodes[startIdx].elev),
      });
    }

    return {
      nodePath: fallbackPath,
      isTraversable: false,
    };
  }

  // Helper to compile waypoints and route metrics
  async function compileCandidate(
    id: 'SAFEST' | 'BALANCED' | 'DIRECT',
    name: string,
    description: string,
    colorHex: string,
    colorRgba: [number, number, number, number],
    rawNodes: LatticeNode[],
    isTraversable: boolean
  ): Promise<CandidateRouteResult> {
    // Inject exact origin at start and destination at finish
    const coords: GeodesicCoordinate[] = [
      { lon: origin.lon, lat: origin.lat },
      ...rawNodes.map((n) => ({ lon: n.lon, lat: n.lat })),
      { lon: destination.lon, lat: destination.lat },
    ];

    // Filter duplicate or near-identical consecutive points
    const dedupedCoords: GeodesicCoordinate[] = [];
    coords.forEach((pt, i) => {
      if (i === 0) {
        dedupedCoords.push(pt);
      } else {
        const prev = dedupedCoords[dedupedCoords.length - 1];
        const d = calculateMarsGroundDistance(prev.lon, prev.lat, pt.lon, pt.lat);
        if (d > 10 || i === coords.length - 1) {
          dedupedCoords.push(pt);
        }
      }
    });

    // Query accurate elevations along deduplicated path
    const elevations = await Promise.all(
      dedupedCoords.map((pt) => queryPointElevation(pt.lon, pt.lat))
    );

    let cumulativeDistMeters = 0;
    let maxSlope = 0;
    let totalSlopeSum = 0;
    let totalAscent = 0;
    let totalDescent = 0;

    const waypoints: RouteWaypoint[] = [];

    for (let k = 0; k < dedupedCoords.length; k++) {
      const curPt = dedupedCoords[k];
      const curElev = elevations[k];

      let segmentSlope = 0;
      if (k > 0) {
        const prevPt = dedupedCoords[k - 1];
        const prevElev = elevations[k - 1];
        const segDist = calculateMarsGroundDistance(prevPt.lon, prevPt.lat, curPt.lon, curPt.lat);
        cumulativeDistMeters += segDist;

        const dz = curElev - prevElev;
        if (dz > 0) totalAscent += dz;
        else totalDescent += Math.abs(dz);

        segmentSlope = (Math.atan(Math.abs(dz) / Math.max(1, segDist)) * 180) / Math.PI;
        totalSlopeSum += segmentSlope;
        if (segmentSlope > maxSlope) {
          maxSlope = segmentSlope;
        }
      }

      waypoints.push({
        longitude: curPt.lon,
        latitude: curPt.lat,
        elevationMeters: curElev,
        distanceFromStartKm: cumulativeDistMeters / 1000,
        segmentSlopeDegrees: Number(segmentSlope.toFixed(2)),
      });
    }

    const totalDistKm = cumulativeDistMeters / 1000;
    const avgSlope = waypoints.length > 1 ? totalSlopeSum / (waypoints.length - 1) : 0;
    const elevChange = elevations[elevations.length - 1] - elevations[0];

    const estimatedSols = Math.max(
      1,
      Math.ceil((totalDistKm * 1000) / vehicle.speedMetersPerSol)
    );

    const minElev = Math.min(...elevations);
    const maxElev = Math.max(...elevations);

    const elevationTransect: ElevationTransectResult = {
      points: waypoints.map((w, idx) => ({
        fraction: idx / Math.max(1, waypoints.length - 1),
        distanceKm: w.distanceFromStartKm,
        longitude: w.longitude,
        latitude: w.latitude,
        elevationMeters: w.elevationMeters,
      })),
      totalDistanceKm: Number(totalDistKm.toFixed(3)),
      minElevationMeters: minElev,
      maxElevationMeters: maxElev,
      elevationChangeMeters: elevChange,
      averageSlopeDegrees: Number(avgSlope.toFixed(2)),
    };

    return {
      id,
      name,
      description,
      colorHex,
      colorRgba,
      waypoints,
      totalDistanceKm: Number(totalDistKm.toFixed(3)),
      maxSlopeDegrees: Number(maxSlope.toFixed(2)),
      averageSlopeDegrees: Number(avgSlope.toFixed(2)),
      elevationChangeMeters: elevChange,
      totalAscentMeters: Math.round(totalAscent),
      totalDescentMeters: Math.round(totalDescent),
      estimatedSols,
      isTraversable,
      warningMessage: !isTraversable
        ? 'Impassable terrain encountered. Direct fallback path exceeds rover vehicle safety limit.'
        : undefined,
      elevationTransect,
    };
  }

  // 1. SAFEST ROUTE: high slope penalty (w_slope=5.0, cutoff=15°)
  const safestResult = runAStar(5.0, vehicle.maxSlopeDegrees, 3.0);
  const safestCandidate = await compileCandidate(
    'SAFEST',
    'Safest Traversal Route',
    'Optimized to minimize steep descents and climbs. Weaves through flat valleys and crater plains.',
    '#10B981',
    [16, 185, 129, 0.95],
    safestResult.nodePath,
    safestResult.isTraversable
  );

  // 2. BALANCED ROUTE: moderate slope penalty (w_slope=2.0, cutoff=20°)
  const balancedResult = runAStar(2.0, vehicle.maxSlopeDegrees + 5, 1.5);
  const balancedCandidate = await compileCandidate(
    'BALANCED',
    'Balanced Reconnaissance Route',
    'Optimal trade-off between mission travel time and terrain safety.',
    '#06B6D4',
    [6, 182, 212, 0.95],
    balancedResult.nodePath,
    balancedResult.isTraversable
  );

  // 3. DIRECT DISTANCE ROUTE: low slope penalty (w_slope=0.5, cutoff=35°)
  const directResult = runAStar(0.5, 35.0, 0.5);
  const directCandidate = await compileCandidate(
    'DIRECT',
    'Direct Distance Route',
    'Shortest straight-path line. Highlights topographic risks, steep cliffs, and energy-intensive climbs.',
    '#F59E0B',
    [245, 158, 11, 0.95],
    directResult.nodePath,
    directResult.isTraversable
  );

  return [safestCandidate, balancedCandidate, directCandidate];
}

