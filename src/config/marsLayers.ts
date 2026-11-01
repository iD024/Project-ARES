/**
 * ARES Mars Planetary Services & Layer Configurations
 *
 * Configures authoritative, public Mars REST services from USGS, NASA, and Esri:
 * 1. MDEM200M: Blended MOLA-HRSC Digital Elevation Model (200m/pixel)
 * 2. MDIM: Viking Mars Digital Image Mosaic 2.1 (232m/pixel)
 * 3. MColorDEM: Colorized Mars Shaded Relief
 *
 * Spatial Reference: GCS_Mars_2000 (WKID 104971 / 104905)
 */

export const MARS_SERVICE_ENDPOINTS = {
  elevation: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer',
  imagery: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer',
  shadedRelief: 'https://astro.arcgis.com/arcgis/rest/services/OnMars/MColorDEM/MapServer',
} as const;

export const MARS_PLANETARY_SR = {
  wkid: 104971,
  name: 'GCS_Mars_2000',
};

export const MARS_DEFAULT_CAMERA = {
  position: {
    x: 0,
    y: 0,
    z: 11520000, // 11,520 km orbital overview
    spatialReference: {
      wkid: 104971,
    },
  },
  heading: 0,
  tilt: 0,
};

export const MARS_GROUND_COLOR = [144, 106, 100] as [number, number, number]; // Martian rust soil tone

