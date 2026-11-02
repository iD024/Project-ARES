/**
 * ARES Mars Rover Mission & Intelligence Service (Phase 08)
 *
 * Governs rover mission dossiers, science instruments, traverse waypoints,
 * sol milestones, and NASA Planetary Data System (PDS) archive provenance.
 */

import {
  MER_INSTRUMENTS,
  ZHURONG_INSTRUMENTS,
  INSIGHT_INSTRUMENTS,
  OPPORTUNITY_MILESTONES,
  SPIRIT_MILESTONES,
  ZHURONG_MILESTONES,
  INSIGHT_MILESTONES,
} from './roverMilestonesExtended.ts';

export type RoverMissionId = 'perseverance' | 'curiosity' | 'opportunity' | 'spirit' | 'zhurong' | 'insight';

export type RoverStatus = 'ACTIVE' | 'COMPLETED' | 'RETIRED';

export interface RoverInstrument {
  id: string;
  name: string;
  acronym: string;
  type: 'SPECTROMETER' | 'CAMERA' | 'RADAR' | 'ENVIRONMENTAL' | 'CHEMISTRY' | 'TECH_DEMO';
  description: string;
  primeScience: string;
}

export interface RoverMilestone {
  sol: number;
  earthDate: string;
  longitude: number;
  latitude: number;
  elevationMeters: number;
  distanceKm: number;
  siteName: string;
  formation: string;
  instrumentTargets: string[];
  discoverySummary: string;
  pdsCitation: string;
}

export interface RoverMission {
  id: RoverMissionId;
  name: string;
  missionName: string;
  organization: string;
  launchDate: string;
  landingDate: string;
  roverModel: string;
  massKg: number;
  powerSource: string;
  status: RoverStatus;
  landingSiteId: string;
  landingSiteName: string;
  targetRegion: string;
  totalDistanceKm: number;
  totalSols: number;
  pdsArchiveUrl: string;
  description: string;
  primaryObjectives: string[];
  instruments: RoverInstrument[];
  milestones: RoverMilestone[];
}

export const PERSEVERANCE_INSTRUMENTS: RoverInstrument[] = [
  {
    id: 'pixl',
    name: 'Planetary Instrument for X-ray Lithochemistry',
    acronym: 'PIXL',
    type: 'SPECTROMETER',
    description: 'High-resolution X-ray fluorescence spectrometer with optical camera revealing chemical element composition at sub-millimeter scales.',
    primeScience: 'Detects microscopic elemental signatures of biosignatures and geochemical alteration.',
  },
  {
    id: 'sherloc',
    name: 'Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals',
    acronym: 'SHERLOC',
    type: 'SPECTROMETER',
    description: 'Deep UV Raman and fluorescence spectrometer on robotic turret mounted with WATSON microscopic imager.',
    primeScience: 'Direct spatial mapping of organic carbon molecules and bio-relevant minerals.',
  },
  {
    id: 'supercam',
    name: 'SuperCam Remote Chemical Imaging',
    acronym: 'SuperCam',
    type: 'CHEMISTRY',
    description: 'Mast-mounted laser-induced breakdown spectroscopy (LIBS), infrared spectroscopy, and microphone.',
    primeScience: 'Rapid standoff rock composition and Martian acoustic recording up to 7 meters away.',
  },
  {
    id: 'mastcam-z',
    name: 'Mastcam-Z Stereo Zoom Camera',
    acronym: 'Mastcam-Z',
    type: 'CAMERA',
    description: 'Multispectral stereoscopic zoom cameras producing full 3D gigapixel color panoramas.',
    primeScience: 'Landscape geomorphology, atmospheric dust monitoring, and target triage.',
  },
  {
    id: 'rimfax',
    name: 'Radar Imager for Mars Subsurface Experiment',
    acronym: 'RIMFAX',
    type: 'RADAR',
    description: 'Ground-penetrating radar probing structural geological layering up to 10+ meters beneath the rover wheels.',
    primeScience: 'First direct radar cross-sections of buried crater floor and delta beds on Mars.',
  },
  {
    id: 'meda',
    name: 'Mars Environmental Dynamics Analyzer',
    acronym: 'MEDA',
    type: 'ENVIRONMENTAL',
    description: 'Comprehensive weather station measuring temperature, pressure, humidity, wind velocity, and solar radiation.',
    primeScience: 'Atmospheric boundary layer dynamics and dust particle size distribution.',
  },
  {
    id: 'moxie',
    name: 'Mars Oxygen ISRU Experiment',
    acronym: 'MOXIE',
    type: 'TECH_DEMO',
    description: 'Solid oxide electrolysis converting Martian carbon dioxide into breathable oxygen.',
    primeScience: 'Demonstrated in-situ resource utilization (ISRU) producing 122 grams of oxygen.',
  },
];

export const CURIOSITY_INSTRUMENTS: RoverInstrument[] = [
  {
    id: 'sam',
    name: 'Sample Analysis at Mars',
    acronym: 'SAM',
    type: 'CHEMISTRY',
    description: 'Internal analytical chemistry suite with Quadrupole Mass Spectrometer, Gas Chromatograph, and Tunable Laser Spectrometer.',
    primeScience: 'Carbon chemistry, atmospheric methane, noble gases, and complex organic detection.',
  },
  {
    id: 'chemin',
    name: 'Chemistry & Mineralogy X-ray Diffraction',
    acronym: 'CheMin',
    type: 'SPECTROMETER',
    description: 'X-ray diffraction and fluorescence instrument identifying definitive crystalline mineral species.',
    primeScience: 'Discovered clay minerals (smectite) and sulfates recording ancient freshwater environments.',
  },
  {
    id: 'chemcam',
    name: 'Chemistry & Camera Laser Spectrometer',
    acronym: 'ChemCam',
    type: 'CHEMISTRY',
    description: 'Laser-induced breakdown spectroscopy firing 1,000,000+ pulses at rock targets.',
    primeScience: 'Remote elemental composition and detection of lithium, boron, and calcium sulfate veins.',
  },
  {
    id: 'mahli',
    name: 'Mars Hand Lens Imager',
    acronym: 'MAHLI',
    type: 'CAMERA',
    description: 'Robotic arm-mounted focusable color micro-camera resolving grains down to 14 microns.',
    primeScience: 'Close-up examination of sedimentary textures, sand ripples, and drill tailings.',
  },
  {
    id: 'apxs',
    name: 'Alpha Particle X-ray Spectrometer',
    acronym: 'APXS',
    type: 'SPECTROMETER',
    description: 'Contact sensor using curium-244 radioactive source to measure elemental chemistry.',
    primeScience: 'Bulk rock and soil chemical characterization.',
  },
  {
    id: 'rems',
    name: 'Rover Environmental Monitoring Station',
    acronym: 'REMS',
    type: 'ENVIRONMENTAL',
    description: 'Meteorological suite measuring daily ground and air temperatures, wind, pressure, and UV flux.',
    primeScience: 'Continuous decadal climate tracking in Gale Crater.',
  },
  {
    id: 'dan',
    name: 'Dynamic Albedo of Neutrons',
    acronym: 'DAN',
    type: 'RADAR',
    description: 'Active neutron generator measuring subsurface hydrogen/water content down to 1 meter depth.',
    primeScience: 'Detected 1–3% bound water in shallow Martian soils.',
  },
];

export const PERSEVERANCE_MILESTONES: RoverMilestone[] = [
  { sol: 0, earthDate: '2021-02-18', longitude: 77.4509, latitude: 18.3797, elevationMeters: -2560, distanceKm: 0.0, siteName: 'Octavia E. Butler Landing', formation: 'Crater Floor Fractured Rough', instrumentTargets: ['MEDA Startup', 'Mastcam-Z Panorama', 'SuperCam Cal'], discoverySummary: 'Touchdown inside Jezero Crater via Sky Crane.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Mission Archive' },
  { sol: 58, earthDate: '2021-04-18', longitude: 77.4485, latitude: 18.3820, elevationMeters: -2565, distanceKm: 0.15, siteName: 'First Autonomous Drive', formation: 'Crater Floor', instrumentTargets: ['AutoNav Test', 'Hazcam'], discoverySummary: 'First autonomous navigation drive demonstrating visual odometry.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Navigational Data' },
  { sol: 114, earthDate: '2021-06-14', longitude: 77.4420, latitude: 18.3812, elevationMeters: -2568, distanceKm: 0.45, siteName: 'Wright Brothers Field', formation: 'Crater Floor Flat Plains', instrumentTargets: ['Ingenuity Support', 'Mastcam-Z Video'], discoverySummary: 'Staging airfield for Ingenuity helicopter historic first powered flight.', pdsCitation: 'NASA/JPL-Caltech Mars 2020 Ingenuity Airfield Archive' },
  { sol: 173, earthDate: '2021-08-14', longitude: 77.4380, latitude: 18.3750, elevationMeters: -2572, distanceKm: 1.10, siteName: 'Séítah North Ridge', formation: 'Séítah Sub-unit', instrumentTargets: ['PIXL Elemental', 'SHERLOC Raman'], discoverySummary: 'Initial survey of olivine-rich igneous rock units in Séítah formation.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 200, earthDate: '2021-09-11', longitude: 77.4360, latitude: 18.3690, elevationMeters: -2575, distanceKm: 1.85, siteName: 'Roubion Abrasion Target', formation: 'Séítah Layered Basalt', instrumentTargets: ['WATSON Microscope', 'PIXL Scan'], discoverySummary: 'First rock abrasion patch revealing pristine volcanic crystalline texture.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 235, earthDate: '2021-10-17', longitude: 77.4320, latitude: 18.3650, elevationMeters: -2578, distanceKm: 2.60, siteName: 'Montdenier Core Site', formation: 'Séítah Olivine Cumulate', instrumentTargets: ['Drill Coring', 'Sample Tube #1'], discoverySummary: 'First sealed Martian core sample inside titanium tube.', pdsCitation: 'NASA/JPL-Caltech/PDS Sample Return Caching System' },
  { sol: 285, earthDate: '2021-12-08', longitude: 77.4280, latitude: 18.3600, elevationMeters: -2580, distanceKm: 3.80, siteName: 'South Séítah Dunefield', formation: 'Active Sand Ripples', instrumentTargets: ['RIMFAX Radar', 'SuperCam LIBS'], discoverySummary: 'Subsurface radar confirmed layered volcanic beds beneath dunes.', pdsCitation: 'NASA/JPL-Caltech/PDS RIMFAX Archive' },
  { sol: 340, earthDate: '2022-02-02', longitude: 77.4310, latitude: 18.3550, elevationMeters: -2576, distanceKm: 5.10, siteName: 'Issole Sample Target', formation: 'Séítah Basalt', instrumentTargets: ['Drill Core #2', 'SHERLOC Fluorescence'], discoverySummary: 'Second igneous core sample collected before delta sprint.', pdsCitation: 'NASA/JPL-Caltech/PDS Sample Return Caching System' },
  { sol: 380, earthDate: '2022-03-15', longitude: 77.4250, latitude: 18.3720, elevationMeters: -2570, distanceKm: 7.20, siteName: 'Rapid Delta Transit', formation: 'Crater Floor Plains', instrumentTargets: ['AutoNav Sprint', 'Hazcam'], discoverySummary: 'Multi-kilometer autonomous driving sprint across Jezero plains.', pdsCitation: 'NASA/JPL-Caltech/PDS Navigational Traverses' },
  { sol: 420, earthDate: '2022-04-26', longitude: 77.4180, latitude: 18.3850, elevationMeters: -2565, distanceKm: 9.40, siteName: 'Enchanted Lake Base Scarp', formation: 'Delta Front Escarpment', instrumentTargets: ['Mastcam-Z Multispectral', 'SuperCam RMI'], discoverySummary: 'Arrival at the base of the Jezero ancient river delta with fluvial cross-beds.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 465, earthDate: '2022-06-11', longitude: 77.4110, latitude: 18.3910, elevationMeters: -2550, distanceKm: 10.80, siteName: 'Hawksbill Gap', formation: 'Shenandoah Delta Unit', instrumentTargets: ['PIXL Micro-map', 'Abrasion Bit'], discoverySummary: 'Elemental mapping of mudstones deposited in ancient Jezero lake.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 510, earthDate: '2022-07-28', longitude: 77.4060, latitude: 18.3970, elevationMeters: -2535, distanceKm: 12.30, siteName: 'Amalik Outcrop', formation: 'Fine Sandstone', instrumentTargets: ['SHERLOC Spectroscopy', 'WATSON'], discoverySummary: 'Identified sulfate and carbonate minerals with biosignature preservation potential.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 570, earthDate: '2022-09-28', longitude: 77.4010, latitude: 18.4020, elevationMeters: -2520, distanceKm: 13.90, siteName: 'Wildcat Ridge', formation: 'Deltaic Mudstone', instrumentTargets: ['Drill Cores #3 & #4', 'SHERLOC UV Raman'], discoverySummary: 'Detected aromatic organic molecules correlated with sulfate minerals.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 630, earthDate: '2022-11-29', longitude: 77.4080, latitude: 18.4080, elevationMeters: -2530, distanceKm: 15.40, siteName: 'Three Forks Sample Depot', formation: 'Delta Margin Flat', instrumentTargets: ['Sample Drop Arm', 'WATSON'], discoverySummary: 'Deposited 10 sealed backup sample tubes on the Martian surface.', pdsCitation: 'NASA/JPL-Caltech/PDS Sample Return Caching System' },
  { sol: 720, earthDate: '2023-03-02', longitude: 77.3950, latitude: 18.4140, elevationMeters: -2495, distanceKm: 17.10, siteName: 'Tenby Channel Outcrop', formation: 'Delta Top Sandstone', instrumentTargets: ['SuperCam LIBS', 'Mastcam-Z Stereo'], discoverySummary: 'Ascended to delta top surface, characterizing fast-flowing river currents.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 780, earthDate: '2023-05-04', longitude: 77.3880, latitude: 18.4190, elevationMeters: -2470, distanceKm: 19.20, siteName: 'Castell Henllys', formation: 'Delta Bedset', instrumentTargets: ['PIXL Lithochemistry', 'Drill Core #5'], discoverySummary: 'Sampled delta-top sandstone recording meandering river regime.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 840, earthDate: '2023-07-06', longitude: 77.3780, latitude: 18.4280, elevationMeters: -2440, distanceKm: 21.50, siteName: 'Belva Crater Rim', formation: 'Impact Breccia', instrumentTargets: ['RIMFAX Deep Sounding', 'Mastcam-Z Gigapixel'], discoverySummary: 'Panoramic view of Belva Crater exposing boulder-rich flood layers.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 900, earthDate: '2023-09-08', longitude: 77.3680, latitude: 18.4350, elevationMeters: -2410, distanceKm: 23.80, siteName: 'Otis Peak', formation: 'Conglomerate Cobble Beds', instrumentTargets: ['Abrasion Target', 'PIXL Trace Minerals'], discoverySummary: 'Discovered rounded volcanic cobbles carried from outside Jezero.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 960, earthDate: '2023-11-10', longitude: 77.3590, latitude: 18.4410, elevationMeters: -2380, distanceKm: 26.10, siteName: 'Jurabi Point', formation: 'Margin Carbonate Unit', instrumentTargets: ['SHERLOC Raman', 'Drill Core #6'], discoverySummary: 'Sampled carbonate-silica lake margin deposits, crucial for fossil microbial mats.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 1010, earthDate: '2024-01-02', longitude: 77.3500, latitude: 18.4480, elevationMeters: -2350, distanceKm: 28.30, siteName: 'Neretva Vallis Inflow Breach', formation: 'Canyon Inflow Floor', instrumentTargets: ['SuperCam Telephoto', 'MEDA Wind'], discoverySummary: 'Traversed canyon mouth where river water breached Jezero crater rim.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 1080, earthDate: '2024-03-15', longitude: 77.3420, latitude: 18.4550, elevationMeters: -2315, distanceKm: 30.20, siteName: 'Bright Angel Carbonate', formation: 'Altered Channel Bed', instrumentTargets: ['Walhalla Glades Abrasion', 'PIXL Mapping'], discoverySummary: 'Discovered chemical reduction spots with halos in channel bedrock.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
  { sol: 1150, earthDate: '2024-05-28', longitude: 77.3340, latitude: 18.4620, elevationMeters: -2280, distanceKm: 32.10, siteName: 'Dox Castle Fan Apex', formation: 'Upper Fan Margin', instrumentTargets: ['Mastcam-Z Panorama', 'RIMFAX Survey'], discoverySummary: 'Reached delta apex surveying the climb up Jezero crater rim.', pdsCitation: 'NASA/JPL-Caltech/PDS Mars 2020 Science Products' },
];

export const CURIOSITY_MILESTONES: RoverMilestone[] = [
  { sol: 0, earthDate: '2012-08-06', longitude: 137.4417, latitude: -4.5895, elevationMeters: -4501, distanceKm: 0.0, siteName: 'Bradbury Landing', formation: 'Crater Floor Plains', instrumentTargets: ['Mastcam First Light', 'REMS Baseline', 'ChemCam Cal'], discoverySummary: 'Sky Crane touchdown in Gale Crater on northern crater floor.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Primary Mission Archive' },
  { sol: 50, earthDate: '2012-09-26', longitude: 137.4450, latitude: -4.5880, elevationMeters: -4505, distanceKm: 0.45, siteName: 'Rocknest Sand Patch', formation: 'Eolian Sand Drift', instrumentTargets: ['CHIMRA Scoop', 'CheMin XRD', 'SAM Combustion'], discoverySummary: 'First soil scoop analyzed by CheMin and SAM.', pdsCitation: 'NASA/JPL-Caltech/PDS CheMin Archive' },
  { sol: 125, earthDate: '2012-12-12', longitude: 137.4520, latitude: -4.5840, elevationMeters: -4520, distanceKm: 0.95, siteName: 'Yellowknife Bay', formation: 'Sheepbed Mudstone', instrumentTargets: ['First Drill Hole', 'SAM GC-MS'], discoverySummary: 'Evidence of an ancient habitable freshwater lakebed with neutral pH.', pdsCitation: 'NASA/JPL-Caltech/PDS SAM Instrument Archive' },
  { sol: 270, earthDate: '2013-05-19', longitude: 137.4510, latitude: -4.5835, elevationMeters: -4522, distanceKm: 1.20, siteName: 'Cumberland Drill Target', formation: 'Sheepbed Member', instrumentTargets: ['CheMin Mineralogy', 'SAM Noble Gases'], discoverySummary: 'Smectite clay minerals formed in standing water; radiometric age dating.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 400, earthDate: '2013-09-22', longitude: 137.4320, latitude: -4.6050, elevationMeters: -4510, distanceKm: 3.40, siteName: 'Darwin Waypoint', formation: 'Conglomerate Cross-Beds', instrumentTargets: ['MAHLI Hand Lens', 'APXS Assay'], discoverySummary: 'Pebble conglomerates confirming ancient stream flow from Gale rim.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Traverse Archive' },
  { sol: 530, earthDate: '2014-02-03', longitude: 137.4180, latitude: -4.6220, elevationMeters: -4495, distanceKm: 5.80, siteName: 'Dingo Gap Dune Crossing', formation: 'Active Sand Ripples', instrumentTargets: ['Hazcam Slip', 'AutoNav Sand'], discoverySummary: 'Negotiated 1-meter active sand dune barrier into Moonlight Valley.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Mobility Data' },
  { sol: 670, earthDate: '2014-06-27', longitude: 137.3990, latitude: -4.6380, elevationMeters: -4480, distanceKm: 8.10, siteName: 'The Kimberley', formation: 'Windjana Sandstone', instrumentTargets: ['Drill Coring', 'CheMin K-Feldspar'], discoverySummary: 'High potassium-feldspar sandstone pointing to diverse crustal magmas.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 753, earthDate: '2014-09-19', longitude: 137.3820, latitude: -4.6540, elevationMeters: -4465, distanceKm: 10.20, siteName: 'Pahrump Hills', formation: 'Murray Formation Base', instrumentTargets: ['Confidence Hills Drill', 'CheMin Hematite'], discoverySummary: 'Official arrival at the base of Mount Sharp; 5km ascent begins.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Mount Sharp Baseline' },
  { sol: 950, earthDate: '2015-04-10', longitude: 137.3750, latitude: -4.6650, elevationMeters: -4440, distanceKm: 12.10, siteName: 'Garden City Veins', formation: 'Fracture Network', instrumentTargets: ['ChemCam Lasers', 'MAHLI Textures'], discoverySummary: 'Calcium sulfate mineral veins showing multiple groundwater episodes.', pdsCitation: 'NASA/JPL-Caltech/PDS ChemCam Spectral Archive' },
  { sol: 1220, earthDate: '2016-01-19', longitude: 137.3620, latitude: -4.6780, elevationMeters: -4415, distanceKm: 14.50, siteName: 'Namib Sand Dune', formation: 'Bagnold Dune Field', instrumentTargets: ['Wind Motion', 'DAN Neutrons'], discoverySummary: 'First in-situ exploration of active extraterrestrial basaltic dunes.', pdsCitation: 'NASA/JPL-Caltech/PDS DAN Instrument Archive' },
  { sol: 1500, earthDate: '2016-10-24', longitude: 137.3510, latitude: -4.6920, elevationMeters: -4380, distanceKm: 16.90, siteName: 'Murray Buttes', formation: 'Eolian Sandstone Towers', instrumentTargets: ['Mastcam Mosaic', 'ChemCam Bedding'], discoverySummary: 'Sandstone mesas formed from ancient fossilized sand dunes.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 1800, earthDate: '2017-08-30', longitude: 137.3420, latitude: -4.7060, elevationMeters: -4330, distanceKm: 19.40, siteName: 'Vera Rubin Ridge', formation: 'Hematite Ridge Member', instrumentTargets: ['Mastcam Filters', 'ChemCam Iron'], discoverySummary: 'Reached prominent ridge identifying crystalline hematite signatures.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 2050, earthDate: '2018-05-15', longitude: 137.3350, latitude: -4.7180, elevationMeters: -4285, distanceKm: 21.80, siteName: 'Rock Hall Drill Target', formation: 'Gray Hematite Bedrock', instrumentTargets: ['Extended Drill', 'CheMin XRD'], discoverySummary: 'Sampled hardest rock encountered on Mars.', pdsCitation: 'NASA/JPL-Caltech/PDS CheMin Archive' },
  { sol: 2350, earthDate: '2019-03-24', longitude: 137.3290, latitude: -4.7290, elevationMeters: -4250, distanceKm: 23.90, siteName: 'Glen Torridon Clay', formation: 'Jura Clay Member', instrumentTargets: ['Kilmarie Drill', 'SAM Pyro-GCMS'], discoverySummary: 'Highest concentration of clay minerals detected on Mars.', pdsCitation: 'NASA/JPL-Caltech/PDS SAM Instrument Archive' },
  { sol: 2700, earthDate: '2020-03-12', longitude: 137.3210, latitude: -4.7410, elevationMeters: -4210, distanceKm: 26.20, siteName: 'Greenheugh Pediment', formation: 'Stimson Sandstone', instrumentTargets: ['Steep AutoNav 32°', 'APXS Chemistry'], discoverySummary: 'Climbed record 32-degree slope onto capping pediment.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Mobility Data' },
  { sol: 3100, earthDate: '2021-04-26', longitude: 137.3120, latitude: -4.7550, elevationMeters: -4165, distanceKm: 28.50, siteName: 'Mont Mercou Cliff', formation: '6-Meter Escarpment', instrumentTargets: ['Nontron Sample', 'Mastcam Gigapan'], discoverySummary: 'Sedimentary cross-section documenting climatic drying of ancient Mars.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 3450, earthDate: '2022-04-20', longitude: 137.3040, latitude: -4.7680, elevationMeters: -4110, distanceKm: 30.80, siteName: 'Sulfate Unit Transition', formation: 'Mirador Sulfate Beds', instrumentTargets: ['Canaima Drill Core', 'ChemCam Salt'], discoverySummary: 'Entered salty sulfate-bearing region marking shift to arid climate.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 3750, earthDate: '2023-02-22', longitude: 137.2960, latitude: -4.7800, elevationMeters: -4050, distanceKm: 32.40, siteName: 'Marker Band Valley', formation: 'Carbonate/Sulfate Band', instrumentTargets: ['Tap-Abrasion', 'CheMin XRD'], discoverySummary: 'Preserved water-ripple textures formed by waves in shallow lake.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 4000, earthDate: '2023-11-06', longitude: 137.2880, latitude: -4.7920, elevationMeters: -3980, distanceKm: 34.10, siteName: 'Gediz Vallis Debris', formation: 'Catastrophic Debris Flow', instrumentTargets: ['Boulder Assay', 'Mastcam Channel'], discoverySummary: 'Investigated boulder deposits left by wet debris flows down Mount Sharp.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
  { sol: 4200, earthDate: '2024-06-01', longitude: 137.2810, latitude: -4.8020, elevationMeters: -3920, distanceKm: 35.60, siteName: 'Upper Gediz Canyon', formation: 'Upper Channel Scarp', instrumentTargets: ['Pure Sulfur Assay', 'APXS'], discoverySummary: 'Discovered pure yellow elemental sulfur crystals inside crushed rocks.', pdsCitation: 'NASA/JPL-Caltech/PDS MSL Science Products' },
];

export const ROVER_MISSIONS: RoverMission[] = [
  {
    id: 'perseverance',
    name: 'Perseverance Rover (Mars 2020)',
    missionName: 'Mars 2020',
    organization: 'NASA JPL / Caltech',
    launchDate: '2020-07-30',
    landingDate: '2021-02-18',
    roverModel: 'Mars 2020 Class Rover',
    massKg: 1025,
    powerSource: 'Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)',
    status: 'ACTIVE',
    landingSiteId: 'perseverance',
    landingSiteName: 'Octavia E. Butler Landing (Jezero Crater)',
    targetRegion: 'Jezero Crater Delta (MC-11 Syrtis Major)',
    totalDistanceKm: 32.1,
    totalSols: 1150,
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/mars2020/',
    description: 'Seeking signs of ancient life and collecting Martian rock and regolith samples for future return to Earth.',
    primaryObjectives: [
      'Identify ancient Martian environments capable of supporting microbial life',
      'Seek biosignatures preserved in rock records',
      'Collect and seal core samples in titanium sample tubes',
      'Test oxygen production from the Martian atmosphere (MOXIE)',
    ],
    instruments: PERSEVERANCE_INSTRUMENTS,
    milestones: PERSEVERANCE_MILESTONES,
  },
  {
    id: 'curiosity',
    name: 'Curiosity Rover (MSL)',
    missionName: 'Mars Science Laboratory',
    organization: 'NASA JPL / Caltech',
    launchDate: '2011-11-26',
    landingDate: '2012-08-06',
    roverModel: 'MSL Heavy Planetary Rover',
    massKg: 899,
    powerSource: 'Multi-Mission Radioisotope Thermoelectric Generator (MMRTG)',
    status: 'ACTIVE',
    landingSiteId: 'curiosity',
    landingSiteName: 'Bradbury Landing (Gale Crater)',
    targetRegion: 'Aeolis Mons (Mount Sharp) (MC-23 Aeolis)',
    totalDistanceKm: 35.6,
    totalSols: 4200,
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/msl/',
    description: 'Investigating whether Mars ever had an environment capable of supporting small life forms called microbes.',
    primaryObjectives: [
      'Assess biological potential of ancient Gale Crater lake environment',
      'Characterize geology and geochemistry of Mount Sharp layers',
      'Investigate planetary planetary habitability and water evolution',
      'Characterize surface radiation spectrum for future human missions',
    ],
    instruments: CURIOSITY_INSTRUMENTS,
    milestones: CURIOSITY_MILESTONES,
  },
  {
    id: 'opportunity',
    name: 'Opportunity Rover (MER-B)',
    missionName: 'Mars Exploration Rover',
    organization: 'NASA JPL / Caltech',
    launchDate: '2003-07-07',
    landingDate: '2004-01-25',
    roverModel: 'MER Exploration Rover',
    massKg: 185,
    powerSource: 'Solar Arrays (Triple-Junction Gallium Arsenide)',
    status: 'COMPLETED',
    landingSiteId: 'opportunity',
    landingSiteName: 'Challenger Memorial Station (Meridiani Planum)',
    targetRegion: 'Meridiani Planum (MC-19 Margaritifer Sinus)',
    totalDistanceKm: 45.16,
    totalSols: 5111,
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/mer/',
    description: 'Traversed 45.16 kilometers over 14+ years, discovering hematite spherules (blueberries) proving acidic ancient groundwater.',
    primaryObjectives: [
      'Search for and characterize rocks and soils that hold clues to past water activity',
      'Determine the distribution and composition of minerals, rocks, and soils',
    ],
    instruments: MER_INSTRUMENTS,
    milestones: OPPORTUNITY_MILESTONES,
  },
  {
    id: 'spirit',
    name: 'Spirit Rover (MER-A)',
    missionName: 'Mars Exploration Rover',
    organization: 'NASA JPL / Caltech',
    launchDate: '2003-06-10',
    landingDate: '2004-01-04',
    roverModel: 'MER Exploration Rover',
    massKg: 185,
    powerSource: 'Solar Arrays (Triple-Junction Gallium Arsenide)',
    status: 'COMPLETED',
    landingSiteId: 'spirit',
    landingSiteName: 'Columbia Memorial Station (Gusev Crater)',
    targetRegion: 'Gusev Crater (MC-23 Aeolis)',
    totalDistanceKm: 7.73,
    totalSols: 2210,
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/mer/',
    description: 'Explored Gusev Crater and Columbia Hills, uncovering hydrothermal silica deposits proving hot spring activity.',
    primaryObjectives: [
      'Search for and characterize water-related minerals and past volcanic history in Gusev Crater',
    ],
    instruments: MER_INSTRUMENTS,
    milestones: SPIRIT_MILESTONES,
  },
  {
    id: 'zhurong',
    name: 'Zhurong Rover (Tianwen-1)',
    missionName: 'Tianwen-1 Mars Mission',
    organization: 'China National Space Administration (CNSA)',
    launchDate: '2020-07-23',
    landingDate: '2021-05-15',
    roverModel: 'Tianwen-1 Six-Wheeled Rover',
    massKg: 240,
    powerSource: 'Solar Panels (Aerodynamic Foldable Wings)',
    status: 'COMPLETED',
    landingSiteId: 'zhurong',
    landingSiteName: 'Zhurong Landing Platform (Utopia Planitia)',
    targetRegion: 'Southern Utopia Planitia (MC-07 Cebrenia)',
    totalDistanceKm: 1.92,
    totalSols: 347,
    pdsArchiveUrl: 'https://moon.bao.ac.cn/',
    description: 'First Chinese rover on Mars; explored southern Utopia Planitia, discovering multi-layered subsurface flood strata and ancient giant polygonal wedges.',
    primaryObjectives: [
      'Map topography and geological structure of southern Utopia Planitia',
      'Analyze soil characteristics and water-ice distribution using ground-penetrating radar',
      'Investigate surface material composition, mineralogy, and paleoclimate',
    ],
    instruments: ZHURONG_INSTRUMENTS,
    milestones: ZHURONG_MILESTONES,
  },
  {
    id: 'insight',
    name: 'InSight Lander (SEIS / HP3)',
    missionName: 'Interior Exploration using Seismic Investigations, Geodesy and Heat Transport',
    organization: 'NASA JPL / CNES / DLR',
    launchDate: '2018-05-05',
    landingDate: '2018-11-26',
    roverModel: 'Stationary Planetary Geophysical Station',
    massKg: 358,
    powerSource: 'Dual Solar Arrays (UltraFlex Decagonal Panels)',
    status: 'COMPLETED',
    landingSiteId: 'insight',
    landingSiteName: 'Homestead Hollow (Elysium Planitia)',
    targetRegion: 'Elysium Planitia (MC-15 Elysium)',
    totalDistanceKm: 0.0,
    totalSols: 1456,
    pdsArchiveUrl: 'https://pds-geosciences.wustl.edu/missions/insight/',
    description: 'Decoded the internal structure of Mars using the SEIS seismometer, discovering crustal layering, mantle structure, and a large liquid metallic core.',
    primaryObjectives: [
      'Determine the thickness and structure of the Martian crust',
      'Determine the composition and structure of the mantle',
      'Determine the size, composition, and physical state of the core',
      'Measure the rate of Martian tectonic activity and meteorite impact rate',
    ],
    instruments: INSIGHT_INSTRUMENTS,
    milestones: INSIGHT_MILESTONES,
  },
];

export function getRoverMission(id: string): RoverMission | undefined {
  return ROVER_MISSIONS.find((m) => m.id === id);
}

export function getAllRoverMissions(): RoverMission[] {
  return ROVER_MISSIONS;
}

export function getRoverMilestones(id: string): RoverMilestone[] {
  const mission = getRoverMission(id);
  return mission ? mission.milestones : [];
}

export function getMilestoneBySol(id: string, sol: number): RoverMilestone | undefined {
  const milestones = getRoverMilestones(id);
  return milestones.find((m) => m.sol === sol);
}

export function getNextMilestone(id: string, currentSol: number): RoverMilestone | undefined {
  const milestones = getRoverMilestones(id);
  return milestones.find((m) => m.sol > currentSol);
}

export function getPrevMilestone(id: string, currentSol: number): RoverMilestone | undefined {
  const milestones = getRoverMilestones(id);
  const reversed = [...milestones].reverse();
  return reversed.find((m) => m.sol < currentSol);
}

export function getTraverseGeoJsonUrl(id: string): string | null {
  if (id === 'perseverance') return '/data/perseverance_traverse.geojson';
  if (id === 'curiosity') return '/data/curiosity_traverse.geojson';
  if (id === 'opportunity') return '/data/opportunity_traverse.geojson';
  if (id === 'spirit') return '/data/spirit_traverse.geojson';
  if (id === 'zhurong') return '/data/zhurong_traverse.geojson';
  return null;
}

export function getRoverColorRgba(id: string): [number, number, number, number] {
  switch (id) {
    case 'perseverance':
      return [234, 88, 12, 0.95]; // Mars Orange
    case 'curiosity':
      return [6, 182, 212, 0.95]; // High-tech Cyan
    case 'opportunity':
      return [16, 185, 129, 0.95]; // Veteran Emerald
    case 'spirit':
      return [245, 158, 11, 0.95]; // Columbia Amber
    case 'zhurong':
      return [244, 63, 94, 0.95]; // Fire God Rose
    case 'insight':
      return [139, 92, 246, 0.95]; // Seismic Violet
    default:
      return [234, 88, 12, 0.95];
  }
}

export function getRoverHexColor(id: string): string {
  switch (id) {
    case 'perseverance':
      return '#EA580C';
    case 'curiosity':
      return '#06B6D4';
    case 'opportunity':
      return '#10B981';
    case 'spirit':
      return '#F59E0B';
    case 'zhurong':
      return '#F43F5E';
    case 'insight':
      return '#8B5CF6';
    default:
      return '#EA580C';
  }
}


