import { describe, it, expect } from 'vitest';
import {
  getAllDatasetDossiers,
  getDatasetDossierById,
  getAllGeologicalEpochs,
  getGeologicalEpochDossier,
  getTerrainPhysicsDossier,
  getRouteTraversalScienceDossier,
  explainRegionalSlope,
} from './scientificIntelligenceService.ts';
import { DATASET_REGISTRY } from './datasetRegistry.ts';

describe('scientificIntelligenceService', () => {
  describe('Dataset Provenance & Sensor Science', () => {
    it('provides complete scientific dossiers for all registered datasets', () => {
      const dossiers = getAllDatasetDossiers();
      expect(dossiers.length).toBe(DATASET_REGISTRY.length);
      expect(dossiers.length).toBeGreaterThanOrEqual(14);

      for (const dataset of DATASET_REGISTRY) {
        const dossier = getDatasetDossierById(dataset.id);
        expect(dossier, `Missing dossier for dataset ${dataset.id}`).toBeDefined();
        expect(dossier?.id).toBe(dataset.id);
        expect(dossier?.name).toBe(dataset.name);
        expect(dossier?.sensor).toBeTruthy();
        expect(dossier?.physicalPrinciple).toBeTruthy();
        expect(dossier?.classification).toBe(dataset.classification);
        expect(dossier?.citation).toBeTruthy();
        expect(dossier?.resolution).toBeTruthy();
        expect(dossier?.caveats).toBeTruthy();
      }
    });

    it('returns undefined for an unknown dataset ID', () => {
      expect(getDatasetDossierById('mars-unknown-dataset-xyz')).toBeUndefined();
    });

    it('distinguishes observed, derived, and modeled datasets correctly', () => {
      const viking = getDatasetDossierById('mars-viking-mdim21');
      expect(viking?.classification).toBe('OBSERVED');
      expect(viking?.sensor).toContain('Visual Imaging Subsystem');

      const mcolorDem = getDatasetDossierById('mars-mcolordem-shaded-relief');
      expect(mcolorDem?.classification).toBe('DERIVED');
      expect(mcolorDem?.sensor).toContain('Laser Altimeter');

      const settlement = getDatasetDossierById('mars-settlement-sites');
      expect(settlement?.classification).toBe('MODELED');
      expect(settlement?.sensor).toContain('GIS');
    });
  });

  describe('Geological Stratigraphy & Epochs', () => {
    it('provides dossiers for all 3 major Martian chronostratigraphic epochs', () => {
      const epochs = getAllGeologicalEpochs();
      expect(epochs.length).toBe(3);

      const epochNames = epochs.map((e) => e.epoch);
      expect(epochNames).toContain('Noachian');
      expect(epochNames).toContain('Hesperian');
      expect(epochNames).toContain('Amazonian');
    });

    it('retrieves detailed geological dossiers by epoch name', () => {
      const noachian = getGeologicalEpochDossier('Noachian');
      expect(noachian).toBeDefined();
      expect(noachian?.ageRange).toContain('4.1');
      expect(noachian?.dominantProcesses).toContain('Heavy bombardment');
      expect(noachian?.keyMinerals.toLowerCase()).toContain('phyllosilicates');

      const hesperian = getGeologicalEpochDossier('Hesperian');
      expect(hesperian).toBeDefined();
      expect(hesperian?.ageRange).toContain('3.7');
      expect(hesperian?.dominantProcesses).toContain('Volcanism');
      expect(hesperian?.keyMinerals.toLowerCase()).toContain('sulfates');

      const amazonian = getGeologicalEpochDossier('Amazonian');
      expect(amazonian).toBeDefined();
      expect(amazonian?.ageRange).toContain('Present');
      expect(amazonian?.dominantProcesses).toContain('Aeolian');
      expect(amazonian?.keyMinerals.toLowerCase()).toContain('ferric oxide');
    });

    it('returns undefined for unrecognized epochs', () => {
      expect(getGeologicalEpochDossier('Jurassic')).toBeUndefined();
    });
  });

  describe('Terrain Physics & DEM Limits', () => {
    it('returns accurate altimetry sensor specifications and physics', () => {
      const terrainPhysics = getTerrainPhysicsDossier();
      expect(terrainPhysics.primarySensors).toContain('MOLA');
      expect(terrainPhysics.laserWavelength).toBe('1064 nm (Nd:YAG)');
      expect(terrainPhysics.gridCellResolution).toBe('200 m/cell');
      expect(terrainPhysics.disclaimer).toContain('200m DEM');
      expect(terrainPhysics.disclaimer).toContain('sub-meter boulder fields');
    });

    it('explains regional slope gradient categories and engineering risks', () => {
      const flat = explainRegionalSlope(1.5);
      expect(flat.category).toBe('FLAT');
      expect(flat.engineeringRisk).toContain('Nominal');

      const gentle = explainRegionalSlope(5.0);
      expect(gentle.category).toBe('GENTLE');
      expect(gentle.engineeringRisk).toContain('Safe');

      const moderate = explainRegionalSlope(12.0);
      expect(moderate.category).toBe('MODERATE');
      expect(moderate.engineeringRisk).toContain('Warning');

      const steep = explainRegionalSlope(22.0);
      expect(steep.category).toBe('STEEP');
      expect(steep.engineeringRisk).toContain('High hazard');

      const precipitous = explainRegionalSlope(35.0);
      expect(precipitous.category).toBe('PRECIPITOUS');
      expect(precipitous.engineeringRisk).toContain('Impassable');
    });
  });

  describe('Route Traversal Science & Mathematics', () => {
    it('returns transparent mathematical formulation for A* pathfinding', () => {
      const routeScience = getRouteTraversalScienceDossier();
      expect(routeScience.costFormulaLatex).toContain('\\text{dist}');
      expect(routeScience.costFormulaLatex).toContain('w_{\\text{slope}}');
      expect(routeScience.vehicleProfiles.length).toBe(3);

      const heavyRover = routeScience.vehicleProfiles.find((v) => v.id === 'HEAVY_ROVER');
      expect(heavyRover).toBeDefined();
      expect(heavyRover?.maxSlopeDegrees).toBe(15);

      const scoutRover = routeScience.vehicleProfiles.find((v) => v.id === 'SCOUT_ROVER');
      expect(scoutRover).toBeDefined();
      expect(scoutRover?.maxSlopeDegrees).toBe(12);

      const drone = routeScience.vehicleProfiles.find((v) => v.id === 'AERIAL_DRONE');
      expect(drone).toBeDefined();
      expect(drone?.maxSlopeDegrees).toBe(90);

      expect(routeScience.candidateRationale.safest).toContain('contour');
      expect(routeScience.candidateRationale.balanced).toContain('compromise');
      expect(routeScience.candidateRationale.direct).toContain('shortest');
    });
  });
});
