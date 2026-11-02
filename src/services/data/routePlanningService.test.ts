import { describe, it, expect } from 'vitest';
import {
  planMarsRoutes,
  ROUTE_PLANNING_PRESETS,
  VEHICLE_PROFILES,
} from './routePlanningService.ts';

describe('Planetary Route Planning Engine (Phase 09)', () => {
  it('defines vehicle profile specifications with speed and slope constraints', () => {
    expect(VEHICLE_PROFILES.HEAVY_ROVER).toBeDefined();
    expect(VEHICLE_PROFILES.HEAVY_ROVER.maxSlopeDegrees).toBe(15);
    expect(VEHICLE_PROFILES.HEAVY_ROVER.speedMetersPerSol).toBe(100);

    expect(VEHICLE_PROFILES.SCOUT_ROVER).toBeDefined();
    expect(VEHICLE_PROFILES.SCOUT_ROVER.maxSlopeDegrees).toBe(12);
    expect(VEHICLE_PROFILES.SCOUT_ROVER.speedMetersPerSol).toBe(50);

    expect(VEHICLE_PROFILES.AERIAL_DRONE).toBeDefined();
    expect(VEHICLE_PROFILES.AERIAL_DRONE.speedMetersPerSol).toBe(1000);
  });

  it('provides verified preset mission scenarios including human settlement corridors', () => {
    expect(ROUTE_PLANNING_PRESETS.length).toBeGreaterThanOrEqual(4);

    const jezero = ROUTE_PLANNING_PRESETS.find((p) => p.id === 'jezero-delta-fan');
    expect(jezero).toBeDefined();
    expect(jezero?.origin.lon).toBeCloseTo(77.45, 1);
    expect(jezero?.destination.lon).toBeCloseTo(77.38, 1);

    const arcadia = ROUTE_PLANNING_PRESETS.find((p) => p.id === 'arcadia-base-ice-corridor');
    expect(arcadia).toBeDefined();
    expect(arcadia?.name).toContain('Arcadia');
    expect(arcadia?.origin.lat).toBeCloseTo(39.3, 1);
  });

  it('plans multi-candidate routes (Safest, Balanced, Direct) between two Martian coordinates', async () => {
    // Traverse within Jezero Crater
    const origin = { lon: 77.45, lat: 18.38 };
    const destination = { lon: 77.38, lat: 18.42 };

    const candidates = await planMarsRoutes(origin, destination, 'HEAVY_ROVER');

    expect(candidates).toBeDefined();
    expect(candidates.length).toBe(3);

    const [safest, balanced, direct] = candidates;

    expect(safest.id).toBe('SAFEST');
    expect(safest.name).toContain('Safest');
    expect(safest.colorHex).toBe('#10B981');
    expect(safest.isTraversable).toBe(true);
    expect(safest.waypoints.length).toBeGreaterThanOrEqual(2);

    expect(balanced.id).toBe('BALANCED');
    expect(balanced.colorHex).toBe('#06B6D4');
    expect(balanced.waypoints.length).toBeGreaterThanOrEqual(2);

    expect(direct.id).toBe('DIRECT');
    expect(direct.colorHex).toBe('#F59E0B');
    expect(direct.waypoints.length).toBeGreaterThanOrEqual(2);

    // Verify distance and slope metrics
    expect(safest.totalDistanceKm).toBeGreaterThan(0);
    expect(safest.maxSlopeDegrees).toBeGreaterThanOrEqual(0);
    expect(safest.averageSlopeDegrees).toBeGreaterThanOrEqual(0);
    expect(safest.estimatedSols).toBeGreaterThan(0);

    // Verify bridge to elevation transect result
    expect(safest.elevationTransect).toBeDefined();
    expect(safest.elevationTransect.points.length).toBe(safest.waypoints.length);
    expect(safest.elevationTransect.totalDistanceKm).toBeCloseTo(safest.totalDistanceKm, 1);
  });

  it('demonstrates slope-avoidance trade-off between Safest and Direct routes', async () => {
    // Transit from canyon plateau into canyon
    const origin = { lon: 284.1, lat: -6.53 };
    const destination = { lon: 284.5, lat: -6.85 };

    const candidates = await planMarsRoutes(origin, destination, 'HEAVY_ROVER');
    const safest = candidates.find((c) => c.id === 'SAFEST')!;
    const direct = candidates.find((c) => c.id === 'DIRECT')!;

    // Safest route detours around steep slopes, leading to lower or equal max slope
    expect(safest.maxSlopeDegrees).toBeLessThanOrEqual(direct.maxSlopeDegrees + 0.5);
  });

  it('scales estimated sols according to vehicle speed profile', async () => {
    const origin = { lon: 77.45, lat: 18.38 };
    const destination = { lon: 77.38, lat: 18.42 };

    const heavyRoutes = await planMarsRoutes(origin, destination, 'HEAVY_ROVER');
    const droneRoutes = await planMarsRoutes(origin, destination, 'AERIAL_DRONE');

    const heavySols = heavyRoutes[0].estimatedSols;
    const droneSols = droneRoutes[0].estimatedSols;

    // Aerial drone (1000m/sol) is ~10x faster than heavy rover (100m/sol)
    expect(heavySols).toBeGreaterThan(droneSols);
  });

  it('ensures waypoints have monotonic distance progression from origin to destination', async () => {
    const origin = { lon: 70.0, lat: -42.0 };
    const destination = { lon: 70.2, lat: -42.2 };

    const candidates = await planMarsRoutes(origin, destination, 'SCOUT_ROVER');
    const waypoints = candidates[0].waypoints;

    expect(waypoints[0].distanceFromStartKm).toBe(0);
    for (let i = 1; i < waypoints.length; i++) {
      expect(waypoints[i].distanceFromStartKm).toBeGreaterThanOrEqual(
        waypoints[i - 1].distanceFromStartKm
      );
    }
  });
});
