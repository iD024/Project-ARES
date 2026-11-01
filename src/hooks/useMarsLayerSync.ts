/**
 * ARES Dual-Viewport Reactive Layer Coordinator Hook
 *
 * Synchronizes scientific layers configured in useAppStore with live @arcgis/core
 * view instances (SceneView or MapView). Applies atomic property mutations to
 * visibility and opacity without thrashing WebGL contexts or recreating layer objects.
 */

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore.ts';
import * as layerService from '../services/data/layerService.ts';
import { getDatasetById } from '../services/data/datasetRegistry.ts';

export interface UseMarsLayerSyncResult {
  syncedLayerCount: number;
  syncError: string | null;
}

export function addLayerToMap(map: any, instance: any) {
  if (!map || !instance) return;

  if (typeof map.add === 'function') {
    map.add(instance);
  } else if (map.layers && typeof map.layers.add === 'function') {
    map.layers.add(instance);
  } else if (Array.isArray(map.layers)) {
    if (!map.layers.includes(instance)) {
      map.layers.push(instance);
    }
  }

  // Ensure instance is registered in map.layers array for mocks/environments
  // where map.add is stubbed and does not automatically append to map.layers
  if (Array.isArray(map.layers) && !map.layers.includes(instance)) {
    map.layers.push(instance);
  }
}

export function removeLayerFromMap(map: any, instance: any) {
  if (!map || !instance) return;

  if (typeof map.remove === 'function') {
    map.remove(instance);
  } else if (map.layers && typeof map.layers.remove === 'function') {
    map.layers.remove(instance);
  }

  if (Array.isArray(map.layers)) {
    const idx = map.layers.indexOf(instance);
    if (idx !== -1) {
      map.layers.splice(idx, 1);
    }
  }
}

export function useMarsLayerSync(
  view: any,
  isViewReady: boolean
): UseMarsLayerSyncResult {
  const layers = useAppStore((state) => state.layers);
  const layerCacheRef = useRef<Map<string, any>>(new Map());
  const inFlightRef = useRef<Set<string>>(new Set());

  const [syncedLayerCount, setSyncedLayerCount] = useState<number>(0);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Teardown & cleanup managed layers when the view unmounts or changes
  useEffect(() => {
    const cache = layerCacheRef.current;
    const currentView = view;

    return () => {
      if (currentView?.map) {
        cache.forEach((instance) => {
          try {
            removeLayerFromMap(currentView.map, instance);
            if (typeof instance.destroy === 'function') {
              instance.destroy();
            }
          } catch {
            // Safe cleanup boundary: ignore individual layer disposal failures
          }
        });
        cache.clear();
      }
    };
  }, [view]);

  // Differential layer synchronization
  useEffect(() => {
    if (!isViewReady || !view || !view.map) {
      return;
    }

    let isMounted = true;

    const syncLayers = async () => {
      let passError: string | null = null;

      for (const layer of layers) {
        const cachedInstance = layerCacheRef.current.get(layer.id);

        if (cachedInstance) {
          // Atomic property mutation without recreating layer or context thrashing
          if (cachedInstance.visible !== layer.visible) {
            cachedInstance.visible = layer.visible;
          }
          if (cachedInstance.opacity !== layer.opacity) {
            cachedInstance.opacity = layer.opacity;
          }
        } else if (layer.visible && !inFlightRef.current.has(layer.id)) {
          const dataset = getDatasetById(layer.id);
          if (!dataset) {
            continue;
          }

          inFlightRef.current.add(layer.id);

          try {
            const instance = await layerService.createArcGISLayerInstance(dataset);

            if (!isMounted) {
              if (typeof instance?.destroy === 'function') {
                instance.destroy();
              }
              return;
            }

            // Sync latest visibility and opacity in case store updated during async creation
            const currentLayer =
              useAppStore.getState().layers.find((l) => l.id === layer.id) || layer;
            instance.visible = currentLayer.visible;
            instance.opacity = currentLayer.opacity;

            addLayerToMap(view.map, instance);
            layerCacheRef.current.set(layer.id, instance);

            if (isMounted) {
              setSyncedLayerCount(layerCacheRef.current.size);
            }
          } catch (err: any) {
            passError =
              err?.message || `Failed to initialize layer instance for ${layer.id}`;
            if (isMounted) {
              setSyncError(passError);
            }
          } finally {
            inFlightRef.current.delete(layer.id);
          }
        }
      }

      if (isMounted) {
        setSyncedLayerCount(layerCacheRef.current.size);
        if (!passError) {
          setSyncError(null);
        }
      }
    };

    syncLayers();

    return () => {
      isMounted = false;
    };
  }, [view, isViewReady, layers]);

  return {
    syncedLayerCount,
    syncError,
  };
}

export default useMarsLayerSync;
