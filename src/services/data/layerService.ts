/**
 * ARES ArcGIS Layer Factory & Resolver
 *
 * Converts DatasetRegistry entries into concrete layer configurations and instances
 * compatible with @arcgis/core.
 */

import { DatasetEntry } from './datasetRegistry.ts';

export type ArcGISLayerType = 'tile' | 'webtile' | 'elevation' | 'geojson' | 'wms' | 'unknown';

export interface ResolvedLayerConfig {
  layerType: ArcGISLayerType;
  id: string;
  title: string;
  url: string;
  opacity: number;
  copyright: string;
  customParameters?: Record<string, any>;
  minScale?: number;
  maxScale?: number;
}

export function resolveLayerConfig(dataset: DatasetEntry): ResolvedLayerConfig {
  let layerType: ArcGISLayerType = 'unknown';

  switch (dataset.format) {
    case 'TILE_SERVER':
      layerType = 'tile';
      break;
    case 'WMTS':
      layerType = 'webtile';
      break;
    case 'IMAGE_SERVER':
      layerType = 'elevation';
      break;
    case 'GEOJSON':
      layerType = 'geojson';
      break;
    case 'WMS':
      layerType = 'wms';
      break;
    default:
      layerType = 'unknown';
  }

  return {
    layerType,
    id: dataset.id,
    title: dataset.name,
    url: dataset.endpointUrl,
    opacity: dataset.defaultOpacity ?? 1.0,
    copyright: `${dataset.provider} (${dataset.license})`,
    minScale: dataset.minScale,
    maxScale: dataset.maxScale,
  };
}

/**
 * Dynamically instantiates an ArcGIS layer from a dataset configuration.
 * Uses dynamic imports to maintain bundle isolation and test compatibility.
 */
export async function createArcGISLayerInstance(dataset: DatasetEntry): Promise<any> {
  const config = resolveLayerConfig(dataset);

  switch (config.layerType) {
    case 'tile': {
      const { default: TileLayer } = await import('@arcgis/core/layers/TileLayer');
      return new TileLayer({
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
        minScale: config.minScale,
        maxScale: config.maxScale,
      });
    }
    case 'webtile': {
      try {
        const { default: WebTileLayer } = await import('@arcgis/core/layers/WebTileLayer');
        const urlTemplate = config.url.includes('{')
          ? config.url
          : `${config.url.replace(/\/+$/, '')}/{level}/{col}/{row}.png`;

        const options: any = {
          id: config.id,
          urlTemplate,
          title: config.title,
          opacity: config.opacity,
          copyright: config.copyright,
          minScale: config.minScale,
          maxScale: config.maxScale,
        };

        if (urlTemplate.includes('{subDomain}')) {
          options.subDomains = ['a', 'b', 'c', 'd'];
        }

        return new WebTileLayer(options);
      } catch {
        const { default: TileLayer } = await import('@arcgis/core/layers/TileLayer');
        return new TileLayer({
          id: config.id,
          url: config.url,
          title: config.title,
          opacity: config.opacity,
          copyright: config.copyright,
          minScale: config.minScale,
          maxScale: config.maxScale,
        });
      }
    }
    case 'elevation': {
      const { default: ElevationLayer } = await import('@arcgis/core/layers/ElevationLayer');
      return new ElevationLayer({
        id: config.id,
        url: config.url,
        title: config.title,
        copyright: config.copyright,
      });
    }
    case 'geojson': {
      const { default: GeoJSONLayer } = await import('@arcgis/core/layers/GeoJSONLayer');
      const geojsonProps: any = {
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
        minScale: config.minScale,
        maxScale: config.maxScale,
      };

      if (dataset.id === 'mars-nomenclature') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            style: 'diamond',
            color: [6, 182, 212, 0.9], // ARES Cyan
            size: 9,
            outline: {
              color: [255, 255, 255, 0.95],
              width: 1.5,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: '{name}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'type', label: 'Feature Type' },
                { fieldName: 'diameterKm', label: 'Diameter (km)' },
                { fieldName: 'origin', label: 'Origin' },
                { fieldName: 'classification', label: 'Data Classification' },
              ],
            },
          ],
        };
      } else if (dataset.id === 'mars-hirise-footprints') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [6, 182, 212, 0.2], // Translucent Cyan
            outline: {
              color: [249, 115, 22, 0.95], // ARES Orange
              width: 2,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: '{name}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'targetRegion', label: 'Target Region' },
                { fieldName: 'instrument', label: 'Instrument' },
                { fieldName: 'resolution', label: 'Native Resolution' },
                { fieldName: 'elevRange', label: 'Elevation Range' },
                { fieldName: 'citation', label: 'Citation' },
              ],
            },
          ],
        };
      } else if (dataset.id === 'mars-seismic-catalog') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            style: 'circle',
            color: [239, 68, 68, 0.85], // Crimson red
            size: 10,
            outline: {
              color: [255, 255, 255, 0.95],
              width: 1.5,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: 'Marsquake {eventId} (Sol {sol})',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'magnitude', label: 'Magnitude (Mw)' },
                { fieldName: 'eventType', label: 'Wave Type' },
                { fieldName: 'quality', label: 'Signal Quality' },
                { fieldName: 'epicenterRegion', label: 'Epicenter Region' },
                { fieldName: 'distanceDeg', label: 'Epicentral Distance (°)' },
                { fieldName: 'backAzimuthDeg', label: 'Back Azimuth (°)' },
                { fieldName: 'pdsCitation', label: 'Data Provenance' },
              ],
            },
          ],
        };
      } else if (dataset.id === 'mars-crism-minerals') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [16, 185, 129, 0.35], // Translucent emerald
            outline: {
              color: [52, 211, 153, 0.95], // Emerald border
              width: 2,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: '{name}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'mineralType', label: 'Mineral Classification' },
                { fieldName: 'concentrationGrade', label: 'Abundance Grade' },
                { fieldName: 'targetRegion', label: 'Target Region' },
                { fieldName: 'geologicalContext', label: 'Geological Formation' },
                { fieldName: 'citation', label: 'Science Citation' },
              ],
            },
          ],
        };
      } else if (dataset.id === 'mars-swim-subsurface-ice') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [6, 182, 212, 0.35], // Glacial Cyan
            outline: {
              color: [34, 211, 238, 0.95],
              width: 2,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: '{name}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'depthRangeMeters', label: 'Estimated Depth' },
                { fieldName: 'icePurityPercentage', label: 'Ice Purity (%)' },
                { fieldName: 'consistencyScore', label: 'SWIM Radar Consistency' },
                { fieldName: 'isruSuitability', label: 'ISRU Extraction Rating' },
                { fieldName: 'targetRegion', label: 'Target Region' },
                { fieldName: 'citation', label: 'Citation' },
              ],
            },
          ],
        };
      } else if (dataset.id === 'mars-settlement-sites') {
        geojsonProps.renderer = {
          type: 'simple',
          symbol: {
            type: 'simple-marker',
            style: 'diamond',
            color: [245, 158, 11, 0.9], // Tactical gold
            size: 11,
            outline: {
              color: [255, 255, 255, 0.95],
              width: 1.5,
            },
          },
        };
        geojsonProps.popupTemplate = {
          title: '{name}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                { fieldName: 'targetRegion', label: 'Target Region' },
                { fieldName: 'elevationMeters', label: 'Elevation (m)' },
                { fieldName: 'waterIceProximityKm', label: 'Water Ice Proximity (km)' },
                { fieldName: 'slopeSafetyRating', label: 'Slope Safety Rating' },
                { fieldName: 'primarySuitabilityFactor', label: 'Primary Suitability' },
                { fieldName: 'missionArchitecture', label: 'Mission Architecture' },
              ],
            },
          ],
        };
      }

      return new GeoJSONLayer(geojsonProps);
    }
    case 'wms': {
      const { default: WMSLayer } = await import('@arcgis/core/layers/WMSLayer');
      const wmsProps: any = {
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
        minScale: config.minScale,
        maxScale: config.maxScale,
      };
      if (dataset.sublayers && dataset.sublayers.length > 0) {
        wmsProps.sublayers = dataset.sublayers;
      }
      return new WMSLayer(wmsProps);
    }
    default:
      throw new Error(`Unsupported layer type for dataset: ${dataset.id}`);
  }
}
