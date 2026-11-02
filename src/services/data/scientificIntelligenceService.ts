/**
 * ARES Scientific Intelligence Service
 *
 * Centralizes scientific provenance, sensor physics, chronostratigraphy,
 * terrain altimetry limits, and route cost mathematical formulation.
 * Strictly adheres to Mars 2000 datum and verifiable planetary datasets.
 */

import { DataClassification } from '../../types/hud.ts';
import { DATASET_REGISTRY } from './datasetRegistry.ts';

export interface DatasetScientificDossier {
  id: string;
  name: string;
  mission: string;
  provider: string;
  sensor: string;
  wavelength: string;
  physicalPrinciple: string;
  classification: DataClassification;
  resolution: string;
  coverage: string;
  spatialReference: string;
  citation: string;
  pdsUrl: string;
  caveats: string;
}

export interface GeologicalEpochDossier {
  epoch: 'Noachian' | 'Hesperian' | 'Amazonian';
  ageRange: string;
  color: string;
  description: string;
  dominantProcesses: string;
  keyMinerals: string;
  craterDensity: string;
  representativeRegions: string[];
}

export interface SlopeCategoryExplainer {
  range: string;
  category: string;
  description: string;
  risk: string;
}

export interface TerrainPhysicsDossier {
  primarySensors: string;
  laserWavelength: string;
  verticalPrecision: string;
  horizontalResolution: string;
  gridCellResolution: string;
  slopeAlgorithm: string;
  disclaimer: string;
  slopeCategories: SlopeCategoryExplainer[];
}

export interface VehicleMobilitySpec {
  id: string;
  name: string;
  maxSlopeDegrees: number;
  speedMetersPerSol: number;
  engineeringCharacteristics: string;
}

export interface RouteTraversalScienceDossier {
  costFormulaLatex: string;
  costExplanation: string;
  heuristicFormulaLatex: string;
  vehicleProfiles: VehicleMobilitySpec[];
  candidateRationale: {
    safest: string;
    balanced: string;
    direct: string;
  };
}

/**
 * Detailed sensor telemetry and physical descriptions for all datasets
 */
const SCIENTIFIC_DOSSIER_DETAILS: Record<
  string,
  {
    sensor: string;
    wavelength: string;
    physicalPrinciple: string;
    pdsUrl: string;
    caveats: string;
  }
> = {
  'mars-viking-mdim21': {
    sensor: 'Viking Orbiter Visual Imaging Subsystem (VIS) Vidicon Cameras',
    wavelength: '400 – 600 nm (Clear, Red, Violet visual band filters)',
    physicalPrinciple:
      'Solar optical reflectance from top of Martian atmosphere and surface regolith. Radiometrically calibrated, cosmetically cleaned, and photometrically normalized using a Minnaert photometric model.',
    pdsUrl: 'https://pds-imaging.jpl.nasa.gov/volumes/viking.html',
    caveats: 'Captured in late 1970s; atmospheric dust haze softens contrast in southern basin regions.',
  },
  'mars-mcolordem-shaded-relief': {
    sensor: 'Mars Orbiter Laser Altimeter (MOLA) Nd:YAG Laser Altimeter',
    wavelength: '1064 nm (Near-infrared laser pulse)',
    physicalPrinciple:
      'Two-way time-of-flight laser pulses measured from spacecraft orbit to planetary surface, computing radial elevation relative to the Mars geoid (areoid). Blended with synthetic analytical hillshading.',
    pdsUrl: 'https://pds-geosciences.wustl.edu/mgs/mgs-m-mola-5-megdr-l3-v1/mgsl_300x/',
    caveats: 'Color hypsometry represents regional elevation gradients; does not reflect natural visual surface color.',
  },
  'mars-mola-elevation-tint': {
    sensor: 'Mars Orbiter Laser Altimeter (MOLA) Nd:YAG Laser Altimeter',
    wavelength: '1064 nm',
    physicalPrinciple:
      'Precision altimetry gridded into a digital elevation model (DEM) and displayed through a hypsometric spectrum mapping -8,200 m (Hellas Basin) to +21,229 m (Olympus Mons caldera).',
    pdsUrl: 'https://pds-geosciences.wustl.edu/missions/mgs/mola.html',
    caveats: 'High-latitude polar regions experience minor orbital track convergence artifacts.',
  },
  'mars-hrsc-mola-blend': {
    sensor: 'High Resolution Stereo Camera (HRSC) + MOLA Altimeter',
    wavelength: 'Optical stereoscopic photogrammetry + 1064 nm laser pulses',
    physicalPrinciple:
      'Multi-line pushbroom stereo imagery parallax matched with absolute vertical geodetic control points from MOLA altimetry, yielding high spatial frequency terrain details with zero regional drift.',
    pdsUrl: 'https://astrogeology.usgs.gov/search/map/Mars/Topography/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2',
    caveats: 'Gaps in HRSC stereogrammetry default to interpolated MOLA topography.',
  },
  'mars-ctx-mosaic': {
    sensor: 'Context Camera (CTX) Linear CCD Pushbroom Array',
    wavelength: '500 – 800 nm (Panchromatic wideband visible)',
    physicalPrinciple:
      'High-contrast orbital visible imagery capturing regional geological context, crater rims, fault scarps, and landing site terrain at 6 meters per pixel.',
    pdsUrl: 'https://murray-lab.caltech.edu/CTX/',
    caveats: 'Panchromatic greyscale only; varying solar illumination angles between adjacent orbital tracks.',
  },
  'mars-geologic-quads': {
    sensor: 'Synthesized Remote Sensing (Viking, MGS, Odyssey, MRO)',
    wavelength: 'Multi-wavelength stratigraphic synthesis',
    physicalPrinciple:
      'Morphological, structural, and chronostratigraphic mapping of Martian geological units based on impact crater size-frequency distributions, cross-cutting relationships, and thermophysical properties.',
    pdsUrl: 'https://pubs.usgs.gov/sim/3292/',
    caveats: 'Regional scale mapping; geological unit boundaries are interpretive and regional.',
  },
  'mars-nomenclature': {
    sensor: 'Official Geodetic Nomenclature Catalog',
    wavelength: 'Vector feature gazetteer',
    physicalPrinciple:
      'Formally approved planetary feature centroids, bounding coordinates, diameters, and feature classifications (Mons, Valles, Planitia, Crater, Chasma, Fossa).',
    pdsUrl: 'https://planetarynames.wr.usgs.gov/',
    caveats: 'Gazetteer points denote feature centers; actual topographic rims vary in spatial extent.',
  },
  'mars-regional-slope': {
    sensor: 'Analytical 3x3 Convolutional Spatial Filter',
    wavelength: 'Derived terrain gradient',
    physicalPrinciple:
      "First-order partial derivatives of elevation dz/dx and dz/dy computed using Horn's quadratic weighting across the Mars 2000 spherical ellipsoid, deriving continuous slope in degrees.",
    pdsUrl: 'https://astrogeology.usgs.gov/search/map/Mars/Topography/HRSC_MOLA_Blend/',
    caveats: 'Regional DEM slopes cannot resolve rover-scale rocks, dunes, or sub-meter scarps.',
  },
  'mars-hirise-footprints': {
    sensor: 'High Resolution Imaging Science Experiment (HiRISE) Pushbroom Camera',
    wavelength: 'Visible & Near-Infrared (Blue-Green, Red, NIR channels)',
    physicalPrinciple:
      'Ultra-high spatial resolution orbital imaging capturing meter-scale sedimentary bedforms, boulder distribution, and rover wheel tracks at 25-50 cm/pixel.',
    pdsUrl: 'https://www.uahirise.org/pds/',
    caveats: 'Extreme targeted coverage; wide areas between footprints lack HiRISE imaging.',
  },
  'mars-hirise-jezero-dtm': {
    sensor: 'Stereo HiRISE Camera Pairs (RED filter)',
    wavelength: '550 – 850 nm',
    physicalPrinciple:
      'High-resolution digital terrain model photogrammetrically produced from stereo orbital observations taken from opposite orbital geometries, resolving 1-meter elevation steps.',
    pdsUrl: 'https://astrogeology.usgs.gov/search/map/Mars/Mars2020/Jezero_crater',
    caveats: 'Restricted to Perseverance exploration zone in Jezero Crater.',
  },
  'mars-seismic-catalog': {
    sensor: 'Seismic Experiment for Interior Structure (SEIS) Very Broad Band (VBB)',
    wavelength: '0.01 to 50 Hz Mechanical ground velocity (m/s)',
    physicalPrinciple:
      'Three-axis broadband seismometry recording body waves (P, S) and surface waves (Rayleigh, Love) propagating through the Martian crust, mantle, and core.',
    pdsUrl: 'https://doi.org/10.12686/a20',
    caveats: 'Epicentral distances derived from P-S arrival differential times; back-azimuth carries polarization uncertainty.',
  },
  'mars-crism-minerals': {
    sensor: 'Compact Reconnaissance Imaging Spectrometer for Mars (CRISM)',
    wavelength: '362 to 3920 nm (Visible / Shortwave Infrared Spectrometer)',
    physicalPrinciple:
      'Narrow absorption band spectroscopy detecting diagnostic molecular overtone and vibrational resonances of structural H2O, OH-, SO4(2-), and CO3(2-) within surface mineral lattices.',
    pdsUrl: 'https://crism.jhuapl.edu/',
    caveats: 'Spectra sensitive only to uppermost micrometers of regolith; dust cover obscures spectral signatures.',
  },
  'mars-swim-subsurface-ice': {
    sensor: 'SHARAD Radar Sounder, Neutron Spectrometer, Thermal Inertia Models',
    wavelength: '15-25 MHz Radar + Epithermal Neutron Flux (0.4 eV - 500 keV)',
    physicalPrinciple:
      'Synthesis of radar dielectric reflectivity, epithermal neutron hydrogen absorption, geomorphic lobate flow features, and thermal inertia modeling to derive subsurface ice depth and purity.',
    pdsUrl: 'https://swim.psi.edu/',
    caveats: 'Derived from statistical multi-dataset fusion; true ground ice depth requires in-situ drill validation.',
  },
  'mars-settlement-sites': {
    sensor: 'Multi-criteria GIS Spatial Decision Support Model',
    wavelength: 'Integrated multi-parameter terrain model',
    physicalPrinciple:
      'Deterministic multi-factor spatial optimization evaluating shallow subsurface water ice (< 2m depth), slope stability (< 5°), atmospheric radiation shielding (elevation < -2,000 m), and solar energy availability.',
    pdsUrl: 'https://ares.planetary.org/specs/settlement_zones.json',
    caveats: 'Engineering synthesis model for planning purposes; subject to future robotic ground-truth verification.',
  },
};

/**
 * Verified Martian Chronostratigraphic Epochs
 */
const GEOLOGICAL_EPOCHS: GeologicalEpochDossier[] = [
  {
    epoch: 'Noachian',
    ageRange: '4.1 – 3.7 Billion Years Ago (Ga)',
    color: '#92400e', // Amber-Brown
    description:
      'The ancient foundational era of Mars, characterized by intense asteroid bombardment, magnetic dynamo activity, warm/wet transient climates, and pervasive fluvial erosion.',
    dominantProcesses:
      'Heavy bombardment, valley network drainage incision, hydrothermal circulation, and crustal deformation.',
    keyMinerals: 'Fe/Mg smectite phyllosilicates (nontronite, saponite), chlorite, carbonate deposits, and silica.',
    craterDensity: 'Very High (Crater saturation density > 100 craters > 10 km diameter per 1,000,000 km²)',
    representativeRegions: ['Noachis Terra', 'Mawrth Vallis', 'Nili Fossae', 'Terra Sabaea', 'Jezero Crater Rim'],
  },
  {
    epoch: 'Hesperian',
    ageRange: '3.7 – 3.0 Billion Years Ago (Ga)',
    color: '#0284c7', // Sky-Cyan
    description:
      'The volcanic transition era of Mars, marked by massive fissure eruptions of fluid basalt, catastrophic episodic mega-floods, global cooling, and acidic surface waters.',
    dominantProcesses:
      'Volcanism, catastrophic mega-outflow channel carving, fault-bounded graben rifting, and widespread sulfate precipitation.',
    keyMinerals: 'Hydrated sulfates (kieserite, gypsum, bassanite, jarosite), hematite concretions, and olivine-bearing basalt.',
    craterDensity: 'Moderate (Impact rate declined sharply following Late Heavy Bombardment)',
    representativeRegions: ['Hesperia Planum', 'Valles Marineris Floor', 'Syrtis Major Planum', 'Chryse Planitia Outflows'],
  },
  {
    epoch: 'Amazonian',
    ageRange: '3.0 Billion Years Ago to Present (Ga)',
    color: '#e11d48', // Rose-Red
    description:
      'The modern, cold, hyper-arid desert era of Mars. Governed by aeolian wind action, slow episodic volcanism, orbital obliquity oscillations, and polar ice redistribution.',
    dominantProcesses:
      'Aeolian dust deflation and sand dune migration, glacial ice flow, periglacial frost shattering, and localized shield volcanism.',
    keyMinerals: 'Ferric oxide minerals (nanophase hematite, rust), atmospheric dust mantles, anhydrous basalts, and pure H2O/CO2 ice sheets.',
    craterDensity: 'Low (Sparse impact craters with preserved sharp ejecta blankets and ray systems)',
    representativeRegions: ['Olympus Mons', 'Tharsis Montes', 'Arcadia Planitia', 'Utopia Planitia', 'Planum Boreum'],
  },
];

/**
 * Terrain Altimetry & Physics Dossier
 */
const TERRAIN_PHYSICS: TerrainPhysicsDossier = {
  primarySensors: 'MOLA (MGS) Laser Altimeter & HRSC (Mars Express) Stereo Camera',
  laserWavelength: '1064 nm (Nd:YAG)',
  verticalPrecision: '±1 meter (relative laser altimetry), ±30 meters (absolute geoidal accuracy)',
  horizontalResolution: '463 m/px (MOLA global grid), 200 m/px (HRSC-MOLA blended DEM)',
  gridCellResolution: '200 m/cell',
  slopeAlgorithm: "Horn's polynomial 3x3 weighted moving kernel across Mars 2000 ellipsoid",
  disclaimer:
    'Regional terrain model derived from 200m DEM. Does not account for sub-meter boulder fields, sand traps, or fine rover-scale obstacles.',
  slopeCategories: [
    {
      range: '0.0° – 3.0°',
      category: 'FLAT',
      description: 'Expansive alluvial plains, smooth basaltic volcanic flows, and interior basin floors.',
      risk: 'Nominal traverse terrain; high speed with zero rollover risk.',
    },
    {
      range: '3.0° – 8.0°',
      category: 'GENTLE',
      description: 'Gentle rolling hills, bajada fan margins, and degraded impact ejecta sheets.',
      risk: 'Safe traverse; within standard automated rover driving envelope.',
    },
    {
      range: '8.0° – 15.0°',
      category: 'MODERATE',
      description: 'Crater walls, valley slopes, and sand dune stoss faces.',
      risk: 'Warning: Wheel slip increases up to 30%. Requires active torque and traction management.',
    },
    {
      range: '15.0° – 25.0°',
      category: 'STEEP',
      description: 'Fault scarps, rim walls, and canyon flanks.',
      risk: 'High hazard: Exceeds safe climbing limits for scout rovers; warning threshold for heavy science rovers.',
    },
    {
      range: '> 25.0°',
      category: 'PRECIPITOUS',
      description: 'Sheer vertical cliffs, bedrock alcoves, and canyon chasm walls.',
      risk: 'Impassable for wheeled mobile rovers; risk of catastrophic slide, tumble, or rockfall.',
    },
  ],
};

/**
 * Route Traversal Cost & Mathematical Model Dossier
 */
const ROUTE_SCIENCE: RouteTraversalScienceDossier = {
  costFormulaLatex:
    'C(u, v) = \\text{dist}(u, v) \\cdot \\left[1 + w_{\\text{slope}} \\cdot \\left(\\frac{\\theta(u, v)}{\\theta_{\\text{max}}}\\right)^2\\right]',
  costExplanation:
    'Edge traversal cost scales ground distance by a quadratic slope penalty. When the regional slope θ exceeds the vehicle maximum capability θ_cutoff, edge cost escalates toward infinity, forcing the pathfinder to seek lower-gradient alternatives.',
  heuristicFormulaLatex:
    'h(v) = \\text{calculateMarsGroundDistance}(v.\\text{lon}, v.\\text{lat}, \\text{dest}.\\text{lon}, \\text{dest}.\\text{lat})',
  vehicleProfiles: [
    {
      id: 'HEAVY_ROVER',
      name: 'Heavy Science Rover (Perseverance / Curiosity Class)',
      maxSlopeDegrees: 15,
      speedMetersPerSol: 100,
      engineeringCharacteristics:
        'High mass (1,025 kg), rocker-bogie 6-wheel suspension, high torque gearboxes, RTG nuclear power, autonomous visual odometry hazard avoidance.',
    },
    {
      id: 'SCOUT_ROVER',
      name: 'Lightweight Scout Rover (Opportunity / Spirit Class)',
      maxSlopeDegrees: 12,
      speedMetersPerSol: 50,
      engineeringCharacteristics:
        'Medium mass (185 kg), solar powered, lower climbing torque, vulnerable to loose regolith wheel entrenchment.',
    },
    {
      id: 'AERIAL_DRONE',
      name: 'Autonomous Scout Drone (Ingenuity Class)',
      maxSlopeDegrees: 90,
      speedMetersPerSol: 1000,
      engineeringCharacteristics:
        'Ultra-lightweight (1.8 kg), twin counter-rotating carbon fiber rotors (2,400 RPM), ignores terrain slopes, limited to discrete line-of-sight flight hops.',
    },
  ],
  candidateRationale: {
    safest:
      'Weaves along topographic contours and valley floors to minimize slope energy expenditure. Strictly rejects paths exceeding 15° slope.',
    balanced:
      'Optimal compromise between travel distance and slope safety. Allows short ascents across gentle saddles while avoiding major hazards.',
    direct:
      'Highlights the raw, shortest geodetic path across the Martian ellipsoid, highlighting extreme terrain gradients and slope warning zones.',
  },
};

/**
 * Returns all registered dataset dossiers dynamically merged from DATASET_REGISTRY
 */
export function getAllDatasetDossiers(): DatasetScientificDossier[] {
  return DATASET_REGISTRY.map((dataset) => {
    const detail = SCIENTIFIC_DOSSIER_DETAILS[dataset.id];
    return {
      id: dataset.id,
      name: dataset.name,
      mission: dataset.mission,
      provider: dataset.provider,
      sensor: detail?.sensor ?? 'Planetary Remote Sensor',
      wavelength: detail?.wavelength ?? 'Multi-spectral band',
      physicalPrinciple: detail?.physicalPrinciple ?? dataset.description,
      classification: dataset.classification,
      resolution: dataset.resolution,
      coverage: dataset.coverage,
      spatialReference: dataset.spatialReference,
      citation: dataset.citation,
      pdsUrl: detail?.pdsUrl ?? dataset.endpointUrl,
      caveats: detail?.caveats ?? 'Regional data coverage limitations apply.',
    };
  });
}

/**
 * Retrieves a specific dataset dossier by ID
 */
export function getDatasetDossierById(id: string): DatasetScientificDossier | undefined {
  const dataset = DATASET_REGISTRY.find((d) => d.id === id);
  if (!dataset) return undefined;
  const detail = SCIENTIFIC_DOSSIER_DETAILS[dataset.id];
  return {
    id: dataset.id,
    name: dataset.name,
    mission: dataset.mission,
    provider: dataset.provider,
    sensor: detail?.sensor ?? 'Planetary Remote Sensor',
    wavelength: detail?.wavelength ?? 'Multi-spectral band',
    physicalPrinciple: detail?.physicalPrinciple ?? dataset.description,
    classification: dataset.classification,
    resolution: dataset.resolution,
    coverage: dataset.coverage,
    spatialReference: dataset.spatialReference,
    citation: dataset.citation,
    pdsUrl: detail?.pdsUrl ?? dataset.endpointUrl,
    caveats: detail?.caveats ?? 'Regional data coverage limitations apply.',
  };
}

/**
 * Returns all 3 Martian geological epochs
 */
export function getAllGeologicalEpochs(): GeologicalEpochDossier[] {
  return GEOLOGICAL_EPOCHS;
}

/**
 * Retrieves a geological epoch dossier by name
 */
export function getGeologicalEpochDossier(epoch: string): GeologicalEpochDossier | undefined {
  return GEOLOGICAL_EPOCHS.find(
    (e) => e.epoch.toLowerCase() === epoch.trim().toLowerCase()
  );
}

/**
 * Returns terrain physics and DEM specifications
 */
export function getTerrainPhysicsDossier(): TerrainPhysicsDossier {
  return TERRAIN_PHYSICS;
}

/**
 * Returns route traversal science and mathematical formulation
 */
export function getRouteTraversalScienceDossier(): RouteTraversalScienceDossier {
  return ROUTE_SCIENCE;
}

/**
 * Explains a specific regional slope gradient with engineering mobility risk
 */
export function explainRegionalSlope(degrees: number): {
  category: string;
  description: string;
  engineeringRisk: string;
} {
  const clamped = Math.max(0, degrees);

  if (clamped <= 3.0) {
    return {
      category: 'FLAT',
      description: 'Expansive alluvial plains, smooth basaltic volcanic flows, and interior basin floors.',
      engineeringRisk: 'Nominal traverse terrain; high speed with zero rollover risk.',
    };
  }
  if (clamped <= 8.0) {
    return {
      category: 'GENTLE',
      description: 'Gentle rolling hills, bajada fan margins, and degraded impact ejecta sheets.',
      engineeringRisk: 'Safe traverse; within standard automated rover driving envelope.',
    };
  }
  if (clamped <= 15.0) {
    return {
      category: 'MODERATE',
      description: 'Crater walls, valley slopes, and sand dune stoss faces.',
      engineeringRisk: 'Warning: Wheel slip increases up to 30%. Requires active torque and traction management.',
    };
  }
  if (clamped <= 25.0) {
    return {
      category: 'STEEP',
      description: 'Fault scarps, rim walls, and canyon flanks.',
      engineeringRisk: 'High hazard: Exceeds safe climbing limits for scout rovers; warning threshold for heavy science rovers.',
    };
  }
  return {
    category: 'PRECIPITOUS',
    description: 'Sheer vertical cliffs, bedrock alcoves, and canyon chasm walls.',
    engineeringRisk: 'Impassable for wheeled mobile rovers; risk of catastrophic slide, tumble, or rockfall.',
  };
}
