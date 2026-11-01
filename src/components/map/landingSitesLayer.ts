import { MARS_LANDING_SITES } from '../../config/mars.ts';
import { MARS_PLANETARY_SR } from '../../config/marsLayers.ts';

export interface LandingSiteGraphicSpec {
  geometry: {
    type: 'point';
    x: number; // Longitude
    y: number; // Latitude
    z?: number;
    spatialReference: {
      wkid: number;
    };
  };
  attributes: {
    siteId: string;
    name: string;
    mission: string;
    roverOrLander: string;
    landingDate: string;
    elevationMeters: number;
    targetFeatures: string[];
  };
}

export function createLandingSiteGraphicsData(): LandingSiteGraphicSpec[] {
  return MARS_LANDING_SITES.map((site) => ({
    geometry: {
      type: 'point',
      x: site.longitude,
      y: site.latitude,
      z: 0,
      spatialReference: {
        wkid: MARS_PLANETARY_SR.wkid,
      },
    },
    attributes: {
      siteId: site.id,
      name: site.name,
      mission: site.mission,
      roverOrLander: site.roverOrLander,
      landingDate: site.landingDate,
      elevationMeters: site.elevationMeters,
      targetFeatures: site.targetFeatures,
    },
  }));
}
