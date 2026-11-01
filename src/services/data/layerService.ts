/**
 * ARES ArcGIS Layer Factory & Resolver
 *
 * Converts DatasetRegistry entries into concrete layer configurations and instances
 * compatible with @arcgis/core.
 */

import { DatasetEntry } from './datasetRegistry.ts';

export type ArcGISLayerType = 'tile' | 'elevation' | 'geojson' | 'wms' | 'unknown';

export interface ResolvedLayerConfig {
  layerType: ArcGISLayerType;
  id: string;
  title: string;
  url: string;
  opacity: number;
  copyright: string;
  customParameters?: Record<string, any>;
}

export function resolveLayerConfig(dataset: DatasetEntry): ResolvedLayerConfig {
  let layerType: ArcGISLayerType = 'unknown';

  switch (dataset.format) {
    case 'TILE_SERVER':
    case 'WMTS':
      layerType = 'tile';
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
      });
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
      return new GeoJSONLayer({
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
      });
    }
    case 'wms': {
      const { default: WMSLayer } = await import('@arcgis/core/layers/WMSLayer');
      return new WMSLayer({
        id: config.id,
        url: config.url,
        title: config.title,
        opacity: config.opacity,
        copyright: config.copyright,
      });
    }
    default:
      throw new Error(`Unsupported layer type for dataset: ${dataset.id}`);
  }
}
