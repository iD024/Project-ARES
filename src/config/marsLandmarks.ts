/**
 * ARES Authoritative Martian Wonders & Geographical Landmarks
 *
 * Curated catalog of the most scientifically prominent geological landmarks
 * across Mars, incorporating exact Mars 2000 coordinates, calibrated elevations,
 * geological periods, and scientific context.
 */

export interface MarsLandmark {
  id: string;
  name: string;
  type: 'VOLCANO' | 'CANYON' | 'BASIN' | 'CRATER' | 'CHAOS' | 'DELTA' | 'FORMATION';
  latitude: number;
  longitude: number;
  elevationMeters: number;
  quadrangle: string;
  geologicalPeriod: 'Amazonian' | 'Hesperian' | 'Noachian';
  description: string;
  scientificSignificance: string;
  dimensions?: string;
}

export const MARS_LANDMARKS: MarsLandmark[] = [
  {
    id: 'olympus-mons',
    name: 'Olympus Mons',
    type: 'VOLCANO',
    latitude: 18.65,
    longitude: -133.80, // 226.20° E
    elevationMeters: 21229,
    quadrangle: 'MC-09 Tharsis',
    geologicalPeriod: 'Amazonian',
    dimensions: '600 km diameter, 21.2 km summit height, 80 km caldera',
    description: 'The largest shield volcano and tallest planetary mountain in the Solar System, towering two and a half times the height of Mount Everest.',
    scientificSignificance: 'Formed by millions of years of basaltic effusive lava flows over a stationary crustal hotspot. The 8 km high perimeter scarp records ancient tectonic and collapse events.',
  },
  {
    id: 'valles-marineris',
    name: 'Valles Marineris (Candor Chasma)',
    type: 'CANYON',
    latitude: -6.53,
    longitude: -75.90, // 284.10° E
    elevationMeters: -3800,
    quadrangle: 'MC-18 Coprates',
    geologicalPeriod: 'Hesperian',
    dimensions: '4,000 km long, 200 km wide, up to 7 km deep',
    description: 'The monumental Grand Canyon of Mars, stretching across nearly a quarter of the planetary circumference along the Martian equator.',
    scientificSignificance: 'A vast tectonic rift valley initiated during the Tharsis volcanic bulge crustal uplift, later widened by massive water flows, landslides, and eolian erosion.',
  },
  {
    id: 'hellas-planitia',
    name: 'Hellas Planitia (Hellas Basin)',
    type: 'BASIN',
    latitude: -42.00,
    longitude: 70.00,
    elevationMeters: -8200,
    quadrangle: 'MC-28 Hellas',
    geologicalPeriod: 'Noachian',
    dimensions: '2,300 km diameter, 8.2 km maximum depth',
    description: 'The deepest impact basin on Mars and one of the largest surviving planetary impact craters in the entire Solar System.',
    scientificSignificance: 'Excavated 4.0 billion years ago during the Late Heavy Bombardment. The atmospheric pressure at its floor is roughly twice that of the zero datum, shielding ancient glacial and sedimentary deposits.',
  },
  {
    id: 'gale-crater',
    name: 'Gale Crater & Mount Sharp',
    type: 'CRATER',
    latitude: -4.59,
    longitude: 137.44,
    elevationMeters: -4500,
    quadrangle: 'MC-23 Aeolis',
    geologicalPeriod: 'Hesperian',
    dimensions: '154 km diameter, 5.5 km central mound (Aeolis Mons)',
    description: 'An ancient impact crater featuring a 5.5 km layered central mountain composed of water-deposited sedimentary strata.',
    scientificSignificance: 'Explored by NASA Curiosity rover; proved Mars once hosted long-lived lacustrine (lake) environments with neutral pH, carbon, nitrogen, sulfur, and habitable chemical conditions.',
  },
  {
    id: 'jezero-crater',
    name: 'Jezero Crater & Neretva Delta',
    type: 'DELTA',
    latitude: 18.38,
    longitude: 77.45,
    elevationMeters: -2560,
    quadrangle: 'MC-11 Syrtis Major',
    geologicalPeriod: 'Noachian',
    dimensions: '45 km diameter crater, 12 km wide fan delta',
    description: 'A paleolake basin on the northwest margin of Isidis Planitia featuring an exquisitely preserved ancient river delta deposit.',
    scientificSignificance: 'Landing site of NASA Perseverance rover and Ingenuity helicopter; dedicated to astrobiological biosignature search within ancient smectite clay and carbonate river sediments.',
  },
  {
    id: 'tharsis-montes',
    name: 'Tharsis Montes (Ascraeus Mons)',
    type: 'VOLCANO',
    latitude: 11.90,
    longitude: -104.50, // 255.50° E
    elevationMeters: 18225,
    quadrangle: 'MC-09 Tharsis',
    geologicalPeriod: 'Amazonian',
    dimensions: '480 km diameter, 18.2 km height',
    description: 'The northernmost volcano of the three giant Tharsis Montes aligned southwest-to-northeast along the Tharsis volcanic plateau.',
    scientificSignificance: 'Features the most complex caldera structure on Mars, consisting of at least eight coalesced collapse calderas and pristine volcanic rilles.',
  },
  {
    id: 'cydonia-mensae',
    name: 'Cydonia Mensae',
    type: 'FORMATION',
    latitude: 40.75,
    longitude: -9.46, // 350.54° E
    elevationMeters: -3900,
    quadrangle: 'MC-04 Mare Acidalium',
    geologicalPeriod: 'Hesperian',
    dimensions: 'Mesa field across 150 km',
    description: 'A famous region of transitional residual mesas and knob fields along the northern lowland dichotomy boundary, noted for the historical "Face on Mars" optical illusion.',
    scientificSignificance: 'High-resolution MRO HiRISE and Mars Express HRSC observations resolved the feature as a natural flat-topped erosion mesa formed by mass wasting and ancient periglacial processes.',
  },
  {
    id: 'argyre-planitia',
    name: 'Argyre Planitia',
    type: 'BASIN',
    latitude: -50.00,
    longitude: -42.00, // 318.00° E
    elevationMeters: -5200,
    quadrangle: 'MC-26 Argyre',
    geologicalPeriod: 'Noachian',
    dimensions: '1,800 km diameter, 5.2 km depth',
    description: 'The second largest well-preserved impact basin on Mars, encircled by the jagged rugged rim mountains of Montes Nereidum and Montes Charitum.',
    scientificSignificance: 'Hosts extensive glaciovolcanic eskers, moraine ridges, and outflow channel deltas indicating prolonged interactions between ancient subsurface ice and volcanic heat sources.',
  },
  {
    id: 'noctis-labyrinthus',
    name: 'Noctis Labyrinthus',
    type: 'CHAOS',
    latitude: -7.00,
    longitude: -101.00, // 259.00° E
    elevationMeters: 4500,
    quadrangle: 'MC-17 Phoenicis Lacus',
    geologicalPeriod: 'Hesperian',
    dimensions: '1,200 km span of interconnected intersecting graben canyons',
    description: 'The "Labyrinth of the Night": a spectacular maze of deep, steep-walled intersecting canyon valleys bridging the Tharsis plateau and Valles Marineris.',
    scientificSignificance: 'Formed by crustal extension and catastrophic subsurface magma evacuation; recently revealed buried water-ice glaciers beneath sulfate-rich ash deposits.',
  },
  {
    id: 'medusae-fossae',
    name: 'Medusae Fossae Formation',
    type: 'FORMATION',
    latitude: -0.20,
    longitude: -167.00, // 193.00° E
    elevationMeters: -1200,
    quadrangle: 'MC-08 Amazonis',
    geologicalPeriod: 'Amazonian',
    dimensions: 'Extends 5,500 km across the equator',
    description: 'An enigmatic, highly wind-eroded deposit of fine-grained friable pyroclastic volcanic ash and dust stretching along the Martian dichotomy boundary.',
    scientificSignificance: 'The largest single source of atmospheric dust on Mars. Mars Express MARSIS radar sounding revealed massive subsurface ice deposits up to 3.7 km deep beneath the ash mantle.',
  },
];

export function getLandmarkById(id: string): MarsLandmark | undefined {
  return MARS_LANDMARKS.find((l) => l.id === id);
}

export function getLandmarksByType(type: MarsLandmark['type']): MarsLandmark[] {
  return MARS_LANDMARKS.filter((l) => l.type === type);
}

