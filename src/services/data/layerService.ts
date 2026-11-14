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
        const [
          { default: WebTileLayer },
          { default: SpatialReference },
          { default: TileInfo },
          { default: Point },
        ] = await Promise.all([
          import('@arcgis/core/layers/WebTileLayer'),
          import('@arcgis/core/geometry/SpatialReference'),
          import('@arcgis/core/layers/support/TileInfo'),
          import('@arcgis/core/geometry/Point'),
        ]);

        const marsSR = new SpatialReference({ wkid: 104971 });
        const urlTemplate = config.url.includes('{')
          ? config.url
          : `${config.url.replace(/\/+$/, '')}/{level}/{col}/{row}.png`;

        // Mars Equirectangular Tile Matrix (NASA Trek WKID 104905 / 104971)
        const tileInfo = new TileInfo({
          dpi: 96,
          size: [256, 256],
          spatialReference: marsSR,
          origin: new Point({ x: -180, y: 90, spatialReference: marsSR }),
          lods: [
            { level: 0, scale: 279227636.3, resolution: 0.703125 },
            { level: 1, scale: 139613818.1, resolution: 0.3515625 },
            { level: 2, scale: 69806909.1, resolution: 0.17578125 },
            { level: 3, scale: 34903454.5, resolution: 0.087890625 },
            { level: 4, scale: 17451727.3, resolution: 0.0439453125 },
            { level: 5, scale: 8725863.6, resolution: 0.02197265625 },
            { level: 6, scale: 4362931.8, resolution: 0.010986328125 },
            { level: 7, scale: 2181465.9, resolution: 0.0054931640625 },
            { level: 8, scale: 1090732.9, resolution: 0.00274658203125 },
            { level: 9, scale: 545366.5, resolution: 0.001373291015625 },
            { level: 10, scale: 272683.2, resolution: 0.0006866455078125 },
            { level: 11, scale: 136341.6, resolution: 0.00034332275390625 },
            { level: 12, scale: 68170.8, resolution: 0.000171661376953125 },
          ],
        });

        const options: any = {
          id: config.id,
          urlTemplate,
          title: config.title,
          opacity: config.opacity,
          copyright: config.copyright,
          minScale: config.minScale,
          maxScale: config.maxScale,
          spatialReference: marsSR,
          tileInfo,
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
      const [
        { default: GeoJSONLayer },
        { default: SpatialReference },
      ] = await Promise.all([
        import('@arcgis/core/layers/GeoJSONLayer'),
        import('@arcgis/core/geometry/SpatialReference'),
      ]);

      const geojsonProps: any = {
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
        minScale: config.minScale,
        maxScale: config.maxScale,
        spatialReference: new SpatialReference({ wkid: 104971 }),
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
