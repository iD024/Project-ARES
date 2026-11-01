import { describe, it, expect } from 'vitest';
import {
  MARS_SERVICE_ENDPOINTS,
  MARS_PLANETARY_SR,
  MARS_DEFAULT_CAMERA,
} from './marsLayers.ts';

describe('Mars Planetary Services & Layer Configurations', () => {
  it('defines live verified Mars REST endpoints for elevation, imagery, and shaded relief', () => {
    expect(MARS_SERVICE_ENDPOINTS.elevation).toBe(
      'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer'
    );
    expect(MARS_SERVICE_ENDPOINTS.imagery).toBe(
      'https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer'
    );
    expect(MARS_SERVICE_ENDPOINTS.shadedRelief).toBe(
      'https://astro.arcgis.com/arcgis/rest/services/OnMars/MColorDEM/MapServer'
    );
  });

  it('configures planetary spatial reference GCS_Mars_2000 Spheroid (WKID 104971)', () => {
    expect(MARS_PLANETARY_SR.wkid).toBe(104971);
  });

  it('defines default global orbital camera position', () => {
    expect(MARS_DEFAULT_CAMERA.position.z).toBeGreaterThan(5000000); // Orbital altitude > 5,000 km
    expect(MARS_DEFAULT_CAMERA.heading).toBeDefined();
    expect(MARS_DEFAULT_CAMERA.tilt).toBeDefined();
  });
});
