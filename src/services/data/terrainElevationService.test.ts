import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getQuadrangleForCoordinates,
  queryPointElevation,
  inspectMartianTerrain,
  clearElevationCache,
} from './terrainElevationService.ts';

describe('Terrain Elevation Service', () => {
  beforeEach(() => {
    clearElevationCache();
  });

  describe('getQuadrangleForCoordinates', () => {
    it('correctly resolves key Martian landmarks to their USGS quadrangles', () => {
      // Equator (0°, 0°) -> MC-13 Oxia Palus
      const equatorQuad = getQuadrangleForCoordinates(0, 0);
      expect(equatorQuad.code).toBe('MC-13');
      expect(equatorQuad.name).toBe('Oxia Palus');

      // Jezero Crater (77.45°E, 18.38°N) -> MC-11 Syrtis Major
      const jezeroQuad = getQuadrangleForCoordinates(77.45, 18.38);
      expect(jezeroQuad.code).toBe('MC-11');
      expect(jezeroQuad.name).toBe('Syrtis Major');

      // Olympus Mons (226.2°E, 18.65°N) -> MC-09 Tharsis
      const olympusQuad = getQuadrangleForCoordinates(226.2, 18.65);
      expect(olympusQuad.code).toBe('MC-09');
      expect(olympusQuad.name).toBe('Tharsis');

      // North Pole (0°, 85°N) -> MC-01 Mare Boreum
      const northPoleQuad = getQuadrangleForCoordinates(0, 85);
      expect(northPoleQuad.code).toBe('MC-01');
      expect(northPoleQuad.name).toBe('Mare Boreum');

      // South Pole (0°, -85°S) -> MC-30 Mare Australe
      const southPoleQuad = getQuadrangleForCoordinates(0, -85);
      expect(southPoleQuad.code).toBe('MC-30');
      expect(southPoleQuad.name).toBe('Mare Australe');
    });

    it('handles negative longitude mapping [-180, 180] to [0, 360]', () => {
      // Olympus Mons at -133.8° (equiv to 226.2°E), 18.65°N
      const olympusNegativeLon = getQuadrangleForCoordinates(-133.8, 18.65);
      expect(olympusNegativeLon.code).toBe('MC-09');
      expect(olympusNegativeLon.name).toBe('Tharsis');

      // Valles Marineris at -75.9° (equiv to 284.1°E), -6.53°S -> MC-18 Coprates
      const vallesMarineris = getQuadrangleForCoordinates(-75.9, -6.53);
      expect(vallesMarineris.code).toBe('MC-18');
      expect(vallesMarineris.name).toBe('Coprates');
    });

    it('accurately resolves polar cap boundaries at 65°N and -65°S', () => {
      expect(getQuadrangleForCoordinates(100, 65).code).toBe('MC-01');
      expect(getQuadrangleForCoordinates(100, 75).code).toBe('MC-01');
      expect(getQuadrangleForCoordinates(200, -65).code).toBe('MC-30');
      expect(getQuadrangleForCoordinates(200, -75).code).toBe('MC-30');
    });

    it('accurately resolves subpolar north quadrangles (MC-02 to MC-07: 30°N to 65°N)', () => {
      // MC-02: Diacria (180°E to 240°E)
      expect(getQuadrangleForCoordinates(200, 45).code).toBe('MC-02');
      // MC-03: Arcadia (240°E to 300°E)
      expect(getQuadrangleForCoordinates(260, 45).code).toBe('MC-03');
      // MC-04: Mare Acidalium (300°E to 360°E)
      expect(getQuadrangleForCoordinates(330, 45).code).toBe('MC-04');
      // MC-05: Ismenius Lacus (0°E to 60°E)
      expect(getQuadrangleForCoordinates(30, 45).code).toBe('MC-05');
      // MC-06: Casius (60°E to 120°E)
      expect(getQuadrangleForCoordinates(90, 45).code).toBe('MC-06');
      // MC-07: Cebrenia (120°E to 180°E)
      expect(getQuadrangleForCoordinates(150, 45).code).toBe('MC-07');
    });

    it('accurately resolves subpolar south quadrangles (MC-24 to MC-29: -65°S to -30°S)', () => {
      // MC-24: Phaethontis (180°E to 240°E)
      expect(getQuadrangleForCoordinates(200, -45).code).toBe('MC-24');
      // MC-25: Thaumasia (240°E to 300°E)
      expect(getQuadrangleForCoordinates(260, -45).code).toBe('MC-25');
      // MC-26: Argyre (300°E to 360°E)
      expect(getQuadrangleForCoordinates(330, -45).code).toBe('MC-26');
      // MC-27: Noachis (0°E to 60°E)
      expect(getQuadrangleForCoordinates(30, -45).code).toBe('MC-27');
      // MC-28: Hellas (60°E to 120°E)
      expect(getQuadrangleForCoordinates(90, -45).code).toBe('MC-28');
      // MC-29: Eridania (120°E to 180°E)
      expect(getQuadrangleForCoordinates(150, -45).code).toBe('MC-29');
    });

    it('accurately resolves southern equatorial quadrangles (MC-16 to MC-23: -30°S to 0°)', () => {
      // Gale Crater in MC-23 Aeolis (135°E to 180°E, -4.59°S)
      const galeQuad = getQuadrangleForCoordinates(137.44, -4.59);
      expect(galeQuad.code).toBe('MC-23');
      expect(galeQuad.name).toBe('Aeolis');

      // MC-16 Memnonia (180°E to 225°E)
      expect(getQuadrangleForCoordinates(190, -10).code).toBe('MC-16');
      // MC-17 Phoenicis Lacus (225°E to 270°E)
      expect(getQuadrangleForCoordinates(240, -10).code).toBe('MC-17');
    });
  });

  describe('queryPointElevation', () => {
    it('returns calibrated elevation for known Martian benchmark landmarks when offline', async () => {
      // Olympus Mons summit (~21,229 m)
      const olympusElevation = await queryPointElevation(226.2, 18.65);
      expect(olympusElevation).toBeCloseTo(21229, -2); // within ~100m of benchmark

      // Hellas Planitia floor (~-8,200 m)
      const hellasElevation = await queryPointElevation(70.0, -42.0);
      expect(hellasElevation).toBeCloseTo(-8200, -2);

      // Jezero Crater floor (~-2,560 m)
      const jezeroElevation = await queryPointElevation(77.45, 18.38);
      expect(jezeroElevation).toBeCloseTo(-2560, -1);

      // Gale Crater (~-4,450 m)
      const galeElevation = await queryPointElevation(137.44, -4.59);
      expect(galeElevation).toBeCloseTo(-4450, -2);
    });

    it('queries from an ArcGIS elevation layer instance if provided', async () => {
      const mockElevationLayer = {
        queryElevation: vi.fn().mockResolvedValue({
          geometry: {
            x: 77.45,
            y: 18.38,
            z: -2562.4,
          },
        }),
      };

      const elevation = await queryPointElevation(77.45, 18.38, mockElevationLayer);
      expect(mockElevationLayer.queryElevation).toHaveBeenCalled();
      expect(elevation).toBe(-2562);
    });

    it('falls back gracefully to offline elevation model when layer query fails', async () => {
      const failingElevationLayer = {
        queryElevation: vi.fn().mockRejectedValue(new Error('Network tile timeout')),
      };

      const elevation = await queryPointElevation(226.2, 18.65, failingElevationLayer);
      expect(failingElevationLayer.queryElevation).toHaveBeenCalled();
      expect(elevation).toBeCloseTo(21229, -2);
    });

    it('caches elevation queries to prevent duplicate layer queries', async () => {
      const mockElevationLayer = {
        queryElevation: vi.fn().mockResolvedValue({
          geometry: { x: 10, y: 20, z: 1250 },
        }),
      };

      const firstCall = await queryPointElevation(10, 20, mockElevationLayer);
      const secondCall = await queryPointElevation(10, 20, mockElevationLayer);

      expect(firstCall).toBe(1250);
      expect(secondCall).toBe(1250);
      expect(mockElevationLayer.queryElevation).toHaveBeenCalledTimes(1);
    });
  });

  describe('inspectMartianTerrain', () => {
    it('returns a complete TerrainInspectionData object with classification DERIVED', async () => {
      const inspection = await inspectMartianTerrain(77.45, 18.38);

      expect(inspection).toBeDefined();
      expect(inspection.longitude).toBe(77.45);
      expect(inspection.latitude).toBe(18.38);
      expect(typeof inspection.elevationMeters).toBe('number');
      expect(inspection.elevationMeters).toBeCloseTo(-2560, -1);
      expect(inspection.quadrangleName).toBe('MC-11 Syrtis Major');
      expect(typeof inspection.regionalSlopeDegrees).toBe('number');
      expect(inspection.regionalSlopeDegrees).toBeGreaterThanOrEqual(0);
      expect(inspection.slopeCategory).toBeDefined();
      expect(['FLAT', 'GENTLE', 'MODERATE', 'STEEP', 'PRECIPITOUS']).toContain(
        inspection.slopeCategory
      );
      expect(inspection.classification).toBe('DERIVED');
      expect(inspection.geologicalPeriod).toBeDefined();
      expect(['Amazonian', 'Hesperian', 'Noachian', 'Undivided']).toContain(
        inspection.geologicalPeriod
      );
    });

    it('correctly associates geological period with Martian regions', async () => {
      // Olympus Mons is Amazonian volcanic shield
      const olympusInspection = await inspectMartianTerrain(226.2, 18.65);
      expect(olympusInspection.geologicalPeriod).toBe('Amazonian');

      // Southern cratered highlands (Noachis) are Noachian
      const noachisInspection = await inspectMartianTerrain(30, -45);
      expect(noachisInspection.geologicalPeriod).toBe('Noachian');
    });

    it('uses elevation layer query when provided for terrain inspection', async () => {
      const mockElevationLayer = {
        queryElevation: vi.fn().mockImplementation((point) => {
          return Promise.resolve({
            geometry: {
              x: point.x,
              y: point.y,
              z: -2500,
            },
          });
        }),
      };

      const inspection = await inspectMartianTerrain(77.45, 18.38, mockElevationLayer);
      expect(mockElevationLayer.queryElevation).toHaveBeenCalled();
      expect(inspection.elevationMeters).toBe(-2500);
      expect(inspection.classification).toBe('DERIVED');
    });
  });
});
