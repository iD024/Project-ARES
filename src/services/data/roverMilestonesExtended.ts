import { RoverMilestone, RoverInstrument } from './roverMissionService.ts';

export const MER_INSTRUMENTS: RoverInstrument[] = [
  {
    id: 'pancam',
    name: 'Panoramic Camera (Pancam)',
    acronym: 'Pancam',
    type: 'CAMERA',
    description: 'High-resolution multispectral stereoscopic mast camera with 14 color filters.',
    primeScience: 'Multispectral terrain geology, atmospheric dust opacity, and high-resolution panoramic imaging.',
  },
  {
    id: 'minites',
    name: 'Miniature Thermal Emission Spectrometer (Mini-TES)',
    acronym: 'Mini-TES',
    type: 'SPECTROMETER',
    description: 'Infrared spectrometer measuring rock and mineral thermal emission spectra from standoff distance.',
    primeScience: 'Remote mineralogical identification (carbonates, silicates, sulfates) and thermophysical properties.',
  },
  {
    id: 'micro-imager',
    name: 'Microscopic Imager (MI)',
    acronym: 'MI',
    type: 'CAMERA',
    description: 'Robotic arm-mounted extreme close-up camera providing 30-micron resolution images.',
    primeScience: 'Microscopic texture of rocks and soils; discovered the famous hematite spherules (blueberries).',
  },
  {
    id: 'apxs',
    name: 'Alpha Particle X-ray Spectrometer (APXS)',
    acronym: 'APXS',
    type: 'SPECTROMETER',
    description: 'Contact instrument utilizing curium-244 alpha sources to quantify bulk elemental chemistry.',
    primeScience: 'Quantitative elemental analysis of rock abrasion patches and soil trenches.',
  },
  {
    id: 'mossbauer',
    name: 'Mössbauer Spectrometer (MIMOS II)',
    acronym: 'Mössbauer',
    type: 'SPECTROMETER',
    description: 'Gamma-ray spectrometer identifying iron-bearing minerals and oxidation states.',
    primeScience: 'Definitive identification of jarosite, hematite, and pyroxene iron mineralogy.',
  },
  {
    id: 'rat',
    name: 'Rock Abrasion Tool (RAT)',
    acronym: 'RAT',
    type: 'TECH_DEMO',
    description: 'Diamond-tipped grinding bit removing surface dust and weathered coatings up to 5mm depth.',
    primeScience: 'Exposing unweathered interior rock matrices for contact spectroscopy.',
  },
];

export const ZHURONG_INSTRUMENTS: RoverInstrument[] = [
  {
    id: 'natecam',
    name: 'Navigation and Topography Camera (NaTeCam)',
    acronym: 'NaTeCam',
    type: 'CAMERA',
    description: 'Mast-mounted stereo color navigation camera mapping local micro-topography.',
    primeScience: 'Landing site terrain mapping, obstacle avoidance, and digital elevation reconstructions.',
  },
  {
    id: 'mscam',
    name: 'Multispectral Camera (MSCam)',
    acronym: 'MSCam',
    type: 'CAMERA',
    description: 'Multispectral camera with 8 spectral bands spanning visible to near-infrared wavelengths.',
    primeScience: 'Spectral classification of rocks, bright duricrusts, and transverse aeolian ridges.',
  },
  {
    id: 'roper',
    name: 'Rover Penetrating Radar (RoPeR)',
    acronym: 'RoPeR',
    type: 'RADAR',
    description: 'Dual-frequency ground-penetrating radar probing 10m to 100m beneath the rover wheels.',
    primeScience: 'Discovered multi-layered flood sediment sequences and buried giant polygonal contraction wedges.',
  },
  {
    id: 'marscode',
    name: 'Mars Surface Compound Detector (MarSCoDe)',
    acronym: 'MarSCoDe',
    type: 'CHEMISTRY',
    description: 'Laser-Induced Breakdown Spectroscopy (LIBS) combined with infrared absorption spectrometer.',
    primeScience: 'Standoff elemental and mineralogical analysis of rocks and hydration state of sediments.',
  },
  {
    id: 'mcs',
    name: 'Mars Climate Station (MCS)',
    acronym: 'MCS',
    type: 'ENVIRONMENTAL',
    description: 'Surface weather station measuring air temperature, pressure, wind velocity, and acoustic sounds.',
    primeScience: 'Surface boundary layer meteorological monitoring and atmospheric acoustic recording.',
  },
  {
    id: 'msfmd',
    name: 'Mars Surface Magnetic Field Detector (MSFMD)',
    acronym: 'MSFMD',
    type: 'TECH_DEMO',
    description: 'Dual fluxgate magnetometers mounted on mast measuring crustal magnetic remanence.',
    primeScience: 'Fine-scale crustal paleomagnetic field measurements in southern Utopia Planitia.',
  },
];

export const INSIGHT_INSTRUMENTS: RoverInstrument[] = [
  {
    id: 'seis',
    name: 'Seismic Experiment for Interior Structure (SEIS)',
    acronym: 'SEIS',
    type: 'RADAR',
    description: 'Ultra-sensitive three-axis broadband and short-period seismometer deployed directly onto the Martian ground under an aerodynamic Wind and Thermal Shield.',
    primeScience: 'Detected over 1,300 marsquakes; mapped Martian crustal thickness, mantle layering, and core size.',
  },
  {
    id: 'hp3',
    name: 'Heat Flow and Physical Properties Package (HP3)',
    acronym: 'HP3',
    type: 'TECH_DEMO',
    description: 'Self-hammering thermal probe (the mole) designed to measure geothermal heat flow from Mars core.',
    primeScience: 'Measured thermal conductivity and subsurface regolith mechanical friction properties.',
  },
  {
    id: 'rise',
    name: 'Rotation and Interior Structure Experiment (RISE)',
    acronym: 'RISE',
    type: 'RADAR',
    description: 'Precision X-band radio Doppler transponder measuring planetary wobble and nutation.',
    primeScience: 'Measured Martian core liquid state and nutation precession rate with millimeter precision.',
  },
  {
    id: 'apss',
    name: 'Auxiliary Payload Sensor Suite (APSS)',
    acronym: 'APSS',
    type: 'ENVIRONMENTAL',
    description: 'Precision surface meteorology station with TWINS temperature/wind sensors and microbarometer.',
    primeScience: 'Recorded dust devils, atmospheric gravity waves, and extreme diurnal pressure oscillations.',
  },
];

export const OPPORTUNITY_MILESTONES: RoverMilestone[] = [
  {
    "sol": 0,
    "earthDate": "2004-01-25",
    "longitude": -5.53,
    "latitude": -1.9483,
    "elevationMeters": -1400,
    "distanceKm": 0.0,
    "siteName": "Challenger Memorial Station / Eagle Crater",
    "formation": "Hematite-Rich Meridiani Plains",
    "instrumentTargets": [
      "Pancam First Panorama",
      "Mini-TES Mineral Baseline"
    ],
    "discoverySummary": "Historic hole-in-one landing inside small impact crater Eagle Crater; immediate identification of layered bedrock.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 20,
    "earthDate": "2004-02-14",
    "longitude": -5.529,
    "latitude": -1.948,
    "elevationMeters": -1401,
    "distanceKm": 0.05,
    "siteName": "Opportunity Ledge Outcrop",
    "formation": "Sulfate-Rich Evaporite Bedrock",
    "instrumentTargets": [
      "Microscopic Imager",
      "APXS Blueberry Cluster",
      "M\u00f6ssbauer Hematite Assay"
    ],
    "discoverySummary": "First in-situ analysis of hematite spherules ('blueberries') confirming past standing liquid water on Mars.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 60,
    "earthDate": "2004-03-26",
    "longitude": -5.522,
    "latitude": -1.947,
    "elevationMeters": -1398,
    "distanceKm": 0.4,
    "siteName": "Fram Crater",
    "formation": "Eolian Sand Sheet Over Sandstone",
    "instrumentTargets": [
      "Pancam Multispectral",
      "Mini-TES Rock Survey"
    ],
    "discoverySummary": "Inspected 8-meter fresh impact crater exposing subsurface layered sulfate rocks during transit east.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 134,
    "earthDate": "2004-06-09",
    "longitude": -5.512,
    "latitude": -1.946,
    "elevationMeters": -1395,
    "distanceKm": 0.8,
    "siteName": "Endurance Crater Ingress (Karatepe)",
    "formation": "Upper Burns Formation Sandstone",
    "instrumentTargets": [
      "Hazcam Navigational Ingress",
      "Pancam Stratigraphy"
    ],
    "discoverySummary": "Entered massive 130-meter wide Endurance Crater to analyze thick stratigraphic column.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 190,
    "earthDate": "2004-08-06",
    "longitude": -5.51,
    "latitude": -1.945,
    "elevationMeters": -1412,
    "distanceKm": 1.2,
    "siteName": "Burns Cliff Stratigraphy",
    "formation": "Lower Burns Formation Cross-Bedding",
    "instrumentTargets": [
      "RAT Rock Abrasion",
      "Microscopic Imager Cross-Beds",
      "APXS Chlorine/Bromine"
    ],
    "discoverySummary": "Detailed vertical geological column showing aqueous evaporite cross-beds deposited in fluctuating ancient lake/dune systems.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 315,
    "earthDate": "2004-12-13",
    "longitude": -5.508,
    "latitude": -1.947,
    "elevationMeters": -1395,
    "distanceKm": 1.8,
    "siteName": "Endurance Crater Egress",
    "formation": "Crater Rim Crest",
    "instrumentTargets": [
      "Pancam Egress Panorama",
      "Drive Actuator Odometry"
    ],
    "discoverySummary": "Successfully climbed out of Endurance Crater slope to begin southward traverse across open plains.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 350,
    "earthDate": "2005-01-19",
    "longitude": -5.504,
    "latitude": -1.956,
    "elevationMeters": -1392,
    "distanceKm": 2.3,
    "siteName": "Heat Shield Rock",
    "formation": "Basaltic Plains Regolith",
    "instrumentTargets": [
      "Pancam Thermal Shield Inspection",
      "APXS Iron-Nickel Assay",
      "M\u00f6ssbauer Kamacite"
    ],
    "discoverySummary": "Discovered first meteorite on another planet: 'Heat Shield Rock', an iron-nickel meteorite.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 420,
    "earthDate": "2005-04-01",
    "longitude": -5.501,
    "latitude": -1.972,
    "elevationMeters": -1390,
    "distanceKm": 3.5,
    "siteName": "Vostok Crater",
    "formation": "Degraded Impact Structure",
    "instrumentTargets": [
      "Mini-TES Sulfate Profile",
      "Pancam Horizon Survey"
    ],
    "discoverySummary": "Investigated ancient sand-choked crater, measuring wind erosion rates of sulfate bedrock.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 600,
    "earthDate": "2005-10-02",
    "longitude": -5.498,
    "latitude": -2.008,
    "elevationMeters": -1388,
    "distanceKm": 6.2,
    "siteName": "Erebus Crater Rim",
    "formation": "Etched Terrain Dunes",
    "instrumentTargets": [
      "Pancam 360 Panorama",
      "Hazcam Ripple Extrication"
    ],
    "discoverySummary": "Negotiated extensive megaripple dune fields ('Purgatory Dune' escape) bordering broad Erebus depression.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 750,
    "earthDate": "2006-03-05",
    "longitude": -5.496,
    "latitude": -2.031,
    "elevationMeters": -1386,
    "distanceKm": 7.8,
    "siteName": "Beagle Crater",
    "formation": "Victoria Ejecta Blanket",
    "instrumentTargets": [
      "Microscopic Imager Soil Matrix",
      "Mini-TES Mineralogy"
    ],
    "discoverySummary": "Sampled dark basaltic ejecta blanket surrounding 35-meter crater Beagle.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 800,
    "earthDate": "2006-04-26",
    "longitude": -5.495,
    "latitude": -2.041,
    "elevationMeters": -1385,
    "distanceKm": 8.5,
    "siteName": "Emma Dean Crater",
    "formation": "Upper Crater Rim Deposits",
    "instrumentTargets": [
      "Pancam Victoria Approach",
      "APXS Spherule Chemistry"
    ],
    "discoverySummary": "Scouted impact ejecta on the outer apron of Victoria Crater.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 951,
    "earthDate": "2006-09-27",
    "longitude": -5.494,
    "latitude": -2.052,
    "elevationMeters": -1384,
    "distanceKm": 9.3,
    "siteName": "Victoria Crater (Duck Bay)",
    "formation": "Cape Verde / Duck Bay Promontory",
    "instrumentTargets": [
      "Pancam Cape Verde Panorama",
      "Mini-TES Stratigraphic Sounding"
    ],
    "discoverySummary": "Historic arrival at 750-meter diameter Victoria Crater; surveyed dramatic scalloped alcoves and towering promontories.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 1160,
    "earthDate": "2007-04-30",
    "longitude": -5.493,
    "latitude": -2.0535,
    "elevationMeters": -1415,
    "distanceKm": 10.4,
    "siteName": "Cape Verde Interior Descent",
    "formation": "Steno Banded Sediments",
    "instrumentTargets": [
      "RAT Rock Grind",
      "Microscopic Imager Lamination",
      "APXS Elemental Profile"
    ],
    "discoverySummary": "Descended into Duck Bay alcove, revealing extensive wind-blown paleo-dune bedding.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 1680,
    "earthDate": "2008-10-15",
    "longitude": -5.49,
    "latitude": -2.058,
    "elevationMeters": -1384,
    "distanceKm": 12.0,
    "siteName": "Victoria Crater Egress",
    "formation": "Southern Rim Apron",
    "instrumentTargets": [
      "AutoNav Plains Sprint",
      "Pancam Forward Track"
    ],
    "discoverySummary": "Departed Victoria Crater to embark on epic 21-kilometer multi-year journey toward Endeavour Crater.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 2000,
    "earthDate": "2009-09-09",
    "longitude": -5.465,
    "latitude": -2.1,
    "elevationMeters": -1380,
    "distanceKm": 18.5,
    "siteName": "Block Island Meteorite",
    "formation": "Open Meridiani Sand Sheets",
    "instrumentTargets": [
      "APXS Iron-Nickel Assay",
      "Microscopic Imager Widmanst\u00e4tten Pits"
    ],
    "discoverySummary": "Discovered largest meteorite yet found on Mars: 60-centimeter iron-nickel boulder 'Block Island'.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 2240,
    "earthDate": "2010-05-12",
    "longitude": -5.445,
    "latitude": -2.135,
    "elevationMeters": -1375,
    "distanceKm": 21.3,
    "siteName": "Concepcion Crater",
    "formation": "Fresh Rayed Impact Ejecta",
    "instrumentTargets": [
      "Pancam Dark Rays",
      "Mini-TES Rock Coatings"
    ],
    "discoverySummary": "Investigated extremely young, pristine rayed crater with dark target-rock coatings.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 2450,
    "earthDate": "2010-12-15",
    "longitude": -5.42,
    "latitude": -2.175,
    "elevationMeters": -1370,
    "distanceKm": 25.8,
    "siteName": "Santa Maria Crater",
    "formation": "Hydrated Sulfate Outcrop",
    "instrumentTargets": [
      "Pancam Crater Rim Panorama",
      "APXS Hydration Campaign",
      "Mini-TES Spectral Validation"
    ],
    "discoverySummary": "Coordinated ground-truth observations matching orbital CRISM detection of hydrated sulfate minerals.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 2710,
    "earthDate": "2011-09-09",
    "longitude": -5.35,
    "latitude": -2.28,
    "elevationMeters": -1360,
    "distanceKm": 33.5,
    "siteName": "Endeavour Crater Arrival (Spirit Point / Cape York)",
    "formation": "Shoemaker Formation (Impact Breccia)",
    "instrumentTargets": [
      "Pancam Cape York Panorama",
      "Microscopic Imager 'Tisdale 2' Breccia"
    ],
    "discoverySummary": "Arrived at 22-kilometer Endeavour Crater; discovered impact ejecta dating back to the Noachian epoch.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 3000,
    "earthDate": "2012-07-02",
    "longitude": -5.345,
    "latitude": -2.29,
    "elevationMeters": -1355,
    "distanceKm": 35.8,
    "siteName": "Matijevic Hill (Whitewater Lake)",
    "formation": "Matijevic Formation Clays",
    "instrumentTargets": [
      "APXS Smectite Clay Detection",
      "RAT Homestake Vein",
      "Microscopic Imager Spheres"
    ],
    "discoverySummary": "Discovered gypsum vein ('Homestake') and ancient clay minerals formed in neutral-pH, benign habitable water.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 3500,
    "earthDate": "2013-11-28",
    "longitude": -5.338,
    "latitude": -2.315,
    "elevationMeters": -1345,
    "distanceKm": 38.6,
    "siteName": "Solander Point (Cape Tribulation)",
    "formation": "Pre-Noachian Rim Escarpment",
    "instrumentTargets": [
      "Pancam Climbing Telephoto",
      "Mini-TES Thermal Inertia"
    ],
    "discoverySummary": "Ascended the rugged pre-Noachian slopes of Cape Tribulation, uncovering rocks ancient even by Martian standards.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 4000,
    "earthDate": "2015-04-26",
    "longitude": -5.33,
    "latitude": -2.34,
    "elevationMeters": -1340,
    "distanceKm": 42.1,
    "siteName": "Marathon Valley",
    "formation": "Noachian Smectite Deposits",
    "instrumentTargets": [
      "Pancam Mineral Filters",
      "APXS Pebble Swarms",
      "Microscopic Imager Veins"
    ],
    "discoverySummary": "Investigated extensive smectite-bearing clay outcrops lining valley cut through Endeavour crater rim.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  },
  {
    "sol": 5111,
    "earthDate": "2018-06-10",
    "longitude": -5.32,
    "latitude": -2.36,
    "elevationMeters": -1335,
    "distanceKm": 45.16,
    "siteName": "Perseverance Valley",
    "formation": "Carved Fluvial/Debris Channel",
    "instrumentTargets": [
      "Pancam Final Frame",
      "Solar Array Opacity TAU Test"
    ],
    "discoverySummary": "Final science operations in Perseverance Valley fluid-carved channel before record global dust storm silenced rover after 14.5 years.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Opportunity Archive"
  }
];

export const SPIRIT_MILESTONES: RoverMilestone[] = [
  {
    "sol": 0,
    "earthDate": "2004-01-04",
    "longitude": 175.4729,
    "latitude": -14.5684,
    "elevationMeters": -1900,
    "distanceKm": 0.0,
    "siteName": "Columbia Memorial Station",
    "formation": "Gusev Crater Plains Regolith",
    "instrumentTargets": [
      "Pancam First Light",
      "Mini-TES Ground Temperature"
    ],
    "discoverySummary": "Flawless landing inside 160-kilometer Gusev Crater, named in tribute to the Space Shuttle Columbia crew.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 35,
    "earthDate": "2004-02-08",
    "longitude": 175.475,
    "latitude": -14.5695,
    "elevationMeters": -1901,
    "distanceKm": 0.12,
    "siteName": "Adirondack Rock",
    "formation": "Vesicular Basalt Bedrock",
    "instrumentTargets": [
      "RAT First Rock Abrasion",
      "Microscopic Imager Basalt Crystals",
      "APXS Olivine Assay"
    ],
    "discoverySummary": "Performed first rock grind on Mars; discovered unweathered olivine-rich volcanic basalt.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 65,
    "earthDate": "2004-03-10",
    "longitude": 175.48,
    "latitude": -14.571,
    "elevationMeters": -1898,
    "distanceKm": 0.38,
    "siteName": "Bonneville Crater Rim",
    "formation": "Impact Rim Boulder Field",
    "instrumentTargets": [
      "Pancam 360 Horizon Mosaic",
      "Mini-TES Crater Floor Sounding"
    ],
    "discoverySummary": "Reached rim of 200-meter Bonneville Crater; viewed heat shield on floor and Columbia Hills on the eastern horizon.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 105,
    "earthDate": "2004-04-20",
    "longitude": 175.487,
    "latitude": -14.575,
    "elevationMeters": -1896,
    "distanceKm": 0.75,
    "siteName": "Missoula Crater Outcrop",
    "formation": "Plains Inter-Crater Soils",
    "instrumentTargets": [
      "Pancam Color Filter",
      "Microscopic Imager Soil Grains"
    ],
    "discoverySummary": "Characterized eolian sand drifts and dark pebble lags during long cross-country sprint to the hills.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 150,
    "earthDate": "2004-06-06",
    "longitude": 175.495,
    "latitude": -14.582,
    "elevationMeters": -1893,
    "distanceKm": 1.4,
    "siteName": "Lahontan Crater",
    "formation": "Basaltic Plains Dune",
    "instrumentTargets": [
      "Hazcam Drive Tracking",
      "AutoNav High-Speed Odometry"
    ],
    "discoverySummary": "Circumnavigated small impact depression Lahontan while sustaining peak drive distances per sol.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 180,
    "earthDate": "2004-07-07",
    "longitude": 175.505,
    "latitude": -14.591,
    "elevationMeters": -1885,
    "distanceKm": 2.1,
    "siteName": "West Spur Base (Columbia Hills)",
    "formation": "Basal Hill Sediments",
    "instrumentTargets": [
      "Pancam Slopes Panorama",
      "Mini-TES Altered Rock Scan"
    ],
    "discoverySummary": "Arrived at base of Columbia Hills; encountered bedrock distinctly different from the basaltic plains.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 260,
    "earthDate": "2004-09-27",
    "longitude": 175.51,
    "latitude": -14.595,
    "elevationMeters": -1870,
    "distanceKm": 2.85,
    "siteName": "Clovis Rock Outcrop",
    "formation": "Altered Soft Volcanic Tuff",
    "instrumentTargets": [
      "RAT Grinding Hole",
      "APXS High Sulfur/Phosphorus",
      "M\u00f6ssbauer Goethite"
    ],
    "discoverySummary": "Discovered goethite mineral indicating ancient water chemically altered the volcanic rocks of Columbia Hills.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 370,
    "earthDate": "2005-01-18",
    "longitude": 175.515,
    "latitude": -14.6,
    "elevationMeters": -1855,
    "distanceKm": 3.5,
    "siteName": "Cumberland Ridge",
    "formation": "Layered Volcaniclastic Strata",
    "instrumentTargets": [
      "Microscopic Imager Vesicles",
      "APXS Elemental Profiling"
    ],
    "discoverySummary": "Identified dense layered volcaniclastic rocks pointing to explosive hydromagmatic eruptions.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 480,
    "earthDate": "2005-05-10",
    "longitude": 175.52,
    "latitude": -14.604,
    "elevationMeters": -1835,
    "distanceKm": 4.15,
    "siteName": "Larry's Lookout",
    "formation": "Summit Ridge Slope",
    "instrumentTargets": [
      "Pancam Tennessee Valley Panorama",
      "Mini-TES Dust Devils"
    ],
    "discoverySummary": "Spectacular vantage point overlooking Gusev Crater floor; observed multiple active dust devils cleansing solar panels.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 580,
    "earthDate": "2005-08-21",
    "longitude": 175.525,
    "latitude": -14.608,
    "elevationMeters": -1820,
    "distanceKm": 4.81,
    "siteName": "Husband Hill Summit",
    "formation": "Summit Peak Crest",
    "instrumentTargets": [
      "Pancam 360 Summit Panorama",
      "Mini-TES Thermal Sounding",
      "APXS Outcrop Assay"
    ],
    "discoverySummary": "Reached summit of Husband Hill (80 meters above plain), surveying the Inner Basin and Home Plate plateau.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 660,
    "earthDate": "2005-11-12",
    "longitude": 175.528,
    "latitude": -14.612,
    "elevationMeters": -1845,
    "distanceKm": 5.35,
    "siteName": "Hillary Outcrop",
    "formation": "South Ridge Bedrock",
    "instrumentTargets": [
      "Microscopic Imager Granules",
      "Pancam Southern Descent"
    ],
    "discoverySummary": "Traversed steep southern ridge descent toward the geological formations of the Inner Basin.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 750,
    "earthDate": "2006-02-12",
    "longitude": 175.532,
    "latitude": -14.618,
    "elevationMeters": -1885,
    "distanceKm": 6.1,
    "siteName": "Home Plate Arrival",
    "formation": "Volcanic Pyroclastic Apron",
    "instrumentTargets": [
      "Pancam Home Plate Facies",
      "Microscopic Imager Bomb Sag",
      "APXS High Alkaline"
    ],
    "discoverySummary": "Discovered volcanic bomb-sag structure proving explosive phreatomagmatic volcanic eruptions.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 850,
    "earthDate": "2006-05-26",
    "longitude": 175.534,
    "latitude": -14.622,
    "elevationMeters": -1888,
    "distanceKm": 6.7,
    "siteName": "Tyrrhenian Plateau / Low Ridge Haven",
    "formation": "Layered Basaltic Tephra",
    "instrumentTargets": [
      "Winter Station Solar Tilt",
      "Pancam McMurdo Panorama"
    ],
    "discoverySummary": "Parked on northward tilted slope at Low Ridge Haven to survive second Martian winter.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 1150,
    "earthDate": "2007-04-01",
    "longitude": 175.536,
    "latitude": -14.625,
    "elevationMeters": -1886,
    "distanceKm": 7.15,
    "siteName": "Gertrude Weil (Hydrothermal Opaline Silica)",
    "formation": "Hydrothermal Spring Fumarole Deposits",
    "instrumentTargets": [
      "APXS 90% Opaline Silica",
      "Mini-TES Hydrated Silica",
      "Microscopic Imager Silica Nodules"
    ],
    "discoverySummary": "Jammed right-front wheel dragged a trench uncovering pure bright opaline silica; conclusive evidence of past hydrothermal hot springs or fumaroles.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 1400,
    "earthDate": "2007-12-12",
    "longitude": 175.5345,
    "latitude": -14.62,
    "elevationMeters": -1885,
    "distanceKm": 7.5,
    "siteName": "Home Plate Winter Haven",
    "formation": "North Face Slope",
    "instrumentTargets": [
      "Pancam Bonestell Panorama",
      "APXS Soil Drag"
    ],
    "discoverySummary": "Positioned on northern slope of Home Plate for maximum winter solar angle.",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  },
  {
    "sol": 1892,
    "earthDate": "2009-05-01",
    "longitude": 175.538,
    "latitude": -14.628,
    "elevationMeters": -1890,
    "distanceKm": 7.73,
    "siteName": "Troy Sand Trap",
    "formation": "Subsurface Sulfate Sinking Crust",
    "instrumentTargets": [
      "Hazcam Spin Diagnostic",
      "APXS Ferric Sulfate Core",
      "M\u00f6ssbauer Iron Sulfate"
    ],
    "discoverySummary": "Broke through thin crust into concealed soft iron sulfate sand at 'Troy'; operated as stationary planetary science station until March 2010 (Sol 2210).",
    "pdsCitation": "NASA/JPL-Caltech/PDS MER Spirit Archive"
  }
];

export const ZHURONG_MILESTONES: RoverMilestone[] = [
  {
    "sol": 0,
    "earthDate": "2021-05-15",
    "longitude": 109.925,
    "latitude": 25.066,
    "elevationMeters": -4100,
    "distanceKm": 0.0,
    "siteName": "Utopia Planitia Touchdown Platform",
    "formation": "Vastitas Borealis Lowland Plains",
    "instrumentTargets": [
      "NaTeCam Lander Panorama",
      "RoPeR Calibration"
    ],
    "discoverySummary": "China's first Mars landing: Tianwen-1 lander and Zhurong rover touchdown safely in southern Utopia Planitia.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Ground Research Application System"
  },
  {
    "sol": 8,
    "earthDate": "2021-05-22",
    "longitude": 109.9248,
    "latitude": 25.0652,
    "elevationMeters": -4100,
    "distanceKm": 0.02,
    "siteName": "Ramp Ingress onto Martian Soil",
    "formation": "Regolith Soil Mantle",
    "instrumentTargets": [
      "Front Hazcam Ramp View",
      "Wheel Odometry Sensor"
    ],
    "discoverySummary": "Successfully rolled down boarding ramps onto Martian soil, officially initiating surface mobility operations.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 19,
    "earthDate": "2021-06-03",
    "longitude": 109.924,
    "latitude": 25.0635,
    "elevationMeters": -4101,
    "distanceKm": 0.06,
    "siteName": "Remote Selfie Site",
    "formation": "Smooth Lowland Inter-Dune",
    "instrumentTargets": [
      "Deployable Wi-Fi Remote Camera",
      "MSCam Multispectral"
    ],
    "discoverySummary": "Deployed detachable wireless mini-camera on the ground and backed away to capture historic dual selfie with lander.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 42,
    "earthDate": "2021-06-27",
    "longitude": 109.922,
    "latitude": 25.058,
    "elevationMeters": -4102,
    "distanceKm": 0.24,
    "siteName": "Transverse Aeolian Ridge (TAR) Field #1",
    "formation": "Bright Asymmetrical Sand Ripples",
    "instrumentTargets": [
      "NaTeCam Stereo 3D",
      "MCS Weather Wind Pressure"
    ],
    "discoverySummary": "Detailed close-up imaging and laser spectroscopy of bright dust-mantled Transverse Aeolian Ridges.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 63,
    "earthDate": "2021-07-18",
    "longitude": 109.92,
    "latitude": 25.051,
    "elevationMeters": -4103,
    "distanceKm": 0.51,
    "siteName": "Bright Duricrust Outcrop",
    "formation": "Cemented Sulfate Duricrust",
    "instrumentTargets": [
      "MarSCoDe LIBS Laser",
      "Micro-Imager Salt Crust"
    ],
    "discoverySummary": "Laser ablation spectroscopy revealed hydrated sulfate/silica cement in duricrust formed by liquid water activity during the Amazonian epoch.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 90,
    "earthDate": "2021-08-15",
    "longitude": 109.9175,
    "latitude": 25.042,
    "elevationMeters": -4105,
    "distanceKm": 0.89,
    "siteName": "Primary Mission Milestone",
    "formation": "Lowland Impact Ejecta Regolith",
    "instrumentTargets": [
      "RoPeR Subsurface Echoes",
      "RoMAG Magnetic Dipole Survey"
    ],
    "discoverySummary": "Completed designated 90-sol primary design life, surpassing 889 meters traversed with all 6 scientific instruments fully operational.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 120,
    "earthDate": "2021-09-15",
    "longitude": 109.917,
    "latitude": 25.04,
    "elevationMeters": -4105,
    "distanceKm": 1.02,
    "siteName": "Solar Conjunction Park Site",
    "formation": "Quiet Plains Haven",
    "instrumentTargets": [
      "Autonomous Telemetry Monitor",
      "RoMAG Low-Noise Background"
    ],
    "discoverySummary": "Parked safely during solar conjunction when communication blackout occurred as Mars passed behind the Sun.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 165,
    "earthDate": "2021-11-01",
    "longitude": 109.915,
    "latitude": 25.033,
    "elevationMeters": -4107,
    "distanceKm": 1.25,
    "siteName": "Deep Ground-Penetrating Radar Survey",
    "formation": "Multi-Layered Sedimentary Basin",
    "instrumentTargets": [
      "RoPeR Channel 1 & 2 Soundings",
      "NaTeCam Obstacle Avoidance"
    ],
    "discoverySummary": "RoPeR ground radar probed down to 80 meters depth, revealing multi-layered sedimentary sequences from ancient flooding episodes.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 210,
    "earthDate": "2021-12-18",
    "longitude": 109.913,
    "latitude": 25.026,
    "elevationMeters": -4108,
    "distanceKm": 1.45,
    "siteName": "Giant Polygonal Terrain Zone",
    "formation": "Thermal Contraction Wedge Polygons",
    "instrumentTargets": [
      "RoPeR Wedge Geometry",
      "MSCam Color Mosaic"
    ],
    "discoverySummary": "Identified subsurface giant polygon structures beneath Utopia Planitia, indicative of thermal contraction crack polygons and paleoclimate change.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 260,
    "earthDate": "2022-02-08",
    "longitude": 109.911,
    "latitude": 25.019,
    "elevationMeters": -4110,
    "distanceKm": 1.63,
    "siteName": "Etched Bedrock Trough",
    "formation": "Laminated Water-Laid Siltstone",
    "instrumentTargets": [
      "MarSCoDe Elemental Composition",
      "NaTeCam Micro-Topography"
    ],
    "discoverySummary": "Analyzed laminated bedrock exposed in local shallow depression, confirming episodic aqueous deposition in the northern lowlands.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 305,
    "earthDate": "2022-03-26",
    "longitude": 109.909,
    "latitude": 25.013,
    "elevationMeters": -4111,
    "distanceKm": 1.78,
    "siteName": "TAR Field #2 Crossing",
    "formation": "Active Megaripples",
    "instrumentTargets": [
      "Wheel Sinkage Geometry",
      "RoMAG Local Anomalies"
    ],
    "discoverySummary": "Crossed second major ripple field, testing crawler steering and wheel traction against Martian dust-covered dunes.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  },
  {
    "sol": 347,
    "earthDate": "2022-05-01",
    "longitude": 109.9075,
    "latitude": 25.008,
    "elevationMeters": -4112,
    "distanceKm": 1.92,
    "siteName": "Northern Winter Dormancy Station",
    "formation": "Sheltered Plains Depression",
    "instrumentTargets": [
      "Final Pre-Hibernation Health Check",
      "MCS Thermal Baseline"
    ],
    "discoverySummary": "Entered planned winter dormancy mode on Sol 347 to endure northern winter dust storms and extreme sub-zero cold after 1,921 meters traversed.",
    "pdsCitation": "CNSA/GRAS Tianwen-1 Science Release"
  }
];

export const INSIGHT_MILESTONES: RoverMilestone[] = [
  {
    sol: 0,
    earthDate: '2018-11-26',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'InSight Touchdown Site',
    formation: 'Smooth Volcanic Plain (Elysium Planitia)',
    instrumentTargets: ['IDC First Surface Image', 'APSS Pressure Startup'],
    discoverySummary: 'Successful pulsed-descent landing inside a smooth, shallow impact hollow (Homestead hollow).',
    pdsCitation: 'NASA/PDS InSight Mission Archive'
  },
  {
    sol: 22,
    earthDate: '2018-12-19',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'SEIS Seismometer Ground Deployment',
    formation: 'Basaltic Regolith',
    instrumentTargets: ['Robotic Arm IDA', 'Grapple Release', 'SEIS Leveling System'],
    discoverySummary: 'First historic deployment of a seismometer directly onto the ground of another planet.',
    pdsCitation: 'NASA/PDS InSight SEIS Data Release'
  },
  {
    sol: 66,
    earthDate: '2019-02-04',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'WTS Dome Placement',
    formation: 'Homestead Hollow Floor',
    instrumentTargets: ['Wind and Thermal Shield', 'Tether Thermal Seal'],
    discoverySummary: 'Lowered the Wind and Thermal Shield (WTS) dome over SEIS, insulating it against 100°C daily swings.',
    pdsCitation: 'NASA/PDS InSight Mission Archive'
  },
  {
    sol: 110,
    earthDate: '2019-03-20',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'HP3 Thermal Mole Deployment',
    formation: 'Cohesive Duricrust Bed',
    instrumentTargets: ['HP3 Mole Penetration', 'Thermal Foil Temperature Array'],
    discoverySummary: 'Commenced self-hammering operations of the HP3 heat probe mole into Martian regolith.',
    pdsCitation: 'DLR/NASA PDS HP3 Archive'
  },
  {
    sol: 173,
    earthDate: '2019-05-23',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'First Cerberus Fossae Marsquake (S0173a)',
    formation: 'Elysium Mantle Tectonic Ray',
    instrumentTargets: ['SEIS VBB', 'APSS Wind Correlation'],
    discoverySummary: 'Recorded first unequivocal low-frequency marsquake (Magnitude 3.7) traced to Cerberus Fossae active rifts.',
    pdsCitation: 'InSight Marsquake Service (MQS) PDS Archive'
  },
  {
    sol: 1000,
    earthDate: '2021-09-18',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'Amazonis Meteoroid Impact Detection (S1000a)',
    formation: 'Acoustic Shockwave Coupling',
    instrumentTargets: ['SEIS HF Sensor', 'APSS Microbarometer Infrasound'],
    discoverySummary: 'Recorded both seismic ground waves and atmospheric acoustic infrasound from fresh bolide cratering in Amazonis.',
    pdsCitation: 'NASA/PDS InSight Seismic Catalog'
  },
  {
    sol: 1094,
    earthDate: '2021-12-24',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'Surface Wave Bolide Strike (S1094b)',
    formation: 'Lowland Crustal Waveguide',
    instrumentTargets: ['SEIS Rayleigh Surface Waves', 'MRO CTX/HiRISE Crater Confirmation'],
    discoverySummary: 'Detected first planetary surface waves on Mars generated by massive meteorite impact excavating 150m crater and exposing ice.',
    pdsCitation: 'NASA/PDS InSight Science Products'
  },
  {
    sol: 1222,
    earthDate: '2022-05-04',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'Magnitude 4.7 Monster Marsquake (S1222a)',
    formation: 'Global Mantle Rayleigh Multi-Orbit',
    instrumentTargets: ['SEIS VBB Multi-Orbit Surface Waves (R1-R4)'],
    discoverySummary: 'Recorded largest seismic event of the mission: a magnitude 4.7 monster quake whose surface waves circled Mars multiple times.',
    pdsCitation: 'InSight Marsquake Service (MQS) PDS Archive'
  },
  {
    sol: 1456,
    earthDate: '2022-12-31',
    longitude: 135.6234,
    latitude: 4.5023,
    elevationMeters: -2610,
    distanceKm: 0.0,
    siteName: 'Final Science Transmission & Mission Completion',
    formation: 'Elysium Dust Coating',
    instrumentTargets: ['Final High-Gain Telemetry', 'SEIS Last Heartbeat'],
    discoverySummary: 'Successfully concluded 4+ years of interior exploration after accumulating over 1,300 recorded marsquakes.',
    pdsCitation: 'NASA/JPL-Caltech InSight End of Mission Archive'
  }
];
