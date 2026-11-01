/**
 * ARES Planetary Layer Resolution & Scale Evaluation Engine
 *
 * Evaluates real-time view scale and geographic extent against layer capabilities
 * to provide honest coverage feedback, progressive disclosure, and zoom guidance.
 * Supports Martian planetary coordinate reference systems (WKID 104971 / 104905)
 * and longitude wrapping ([-180, 180] and [0, 360] East-positive).
 */

export type LayerScaleStatus = 'ACTIVE' | 'SCALE_INACTIVE' | 'OUT_OF_EXTENT' | 'OFFLINE';

export interface BoundingBox {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface LayerResolutionTarget {
  id?: string;
  minScale?: number;
  maxScale?: number;
  extent?: BoundingBox;
  healthStatus?: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | string;
}

/**
 * Normalizes an arbitrary longitude value into the [-180, 180] East-positive domain.
 */
export function normalizeLongitude180(lon: number): number {
  const normalized = ((((lon + 180) % 360) + 360) % 360) - 180;
  if (normalized === -180 && lon > 0) {
    return 180;
  }
  return normalized;
}

/**
 * Normalizes an arbitrary longitude value into the [0, 360] East-positive domain.
 */
export function normalizeLongitude360(lon: number): number {
  return ((lon % 360) + 360) % 360;
}

/**
 * Evaluates whether a geographic coordinate point falls within a Martian BoundingBox extent.
 * Supports both standard GIS [-180, 180] and planetary [0, 360] representations,
 * as well as meridian wrapping.
 */
export function isPointInExtent(
  center: { longitude: number; latitude: number },
  extent: BoundingBox
): boolean {
  // Latitude check
  const minLat = Math.min(extent.minLat, extent.maxLat);
  const maxLat = Math.max(extent.minLat, extent.maxLat);
  if (center.latitude < minLat || center.latitude > maxLat) {
    return false;
  }

  // Global longitude coverage check
  if (Math.abs(extent.maxLon - extent.minLon) >= 360) {
    return true;
  }

  // Calculate circular span from minLon to maxLon going East
  let span = (extent.maxLon - extent.minLon) % 360;
  if (span < 0) {
    span += 360;
  }

  // If minLon and maxLon are numerically identical, span is 0
  // Calculate circular offset from minLon to center.longitude going East
  let offset = (center.longitude - extent.minLon) % 360;
  if (offset < 0) {
    offset += 360;
  }

  // Allow floating point precision epsilon (1e-7 deg ~ 6mm on Mars)
  return offset <= span + 1e-7;
}

/**
 * Determines whether the current view scale is within a layer's active range.
 * In cartography, minScale is zoomed out (larger scale denominator),
 * maxScale is zoomed in (smaller scale denominator).
 * A value of 0 or undefined indicates no limit.
 */
export function isScaleActive(
  currentScale: number,
  minScale?: number,
  maxScale?: number
): boolean {
  if (minScale !== undefined && minScale > 0 && currentScale > minScale) {
    return false;
  }
  if (maxScale !== undefined && maxScale > 0 && currentScale < maxScale) {
    return false;
  }
  return true;
}

/**
 * Evaluates the real-time operational status of a Martian planetary layer.
 *
 * Rules:
 * 1. If layer health is OFFLINE, returns 'OFFLINE'.
 * 2. If current scale exceeds minScale (zoomed out too far) or is below maxScale
 *    (zoomed in past layer resolution), returns 'SCALE_INACTIVE'.
 * 3. If layer has an extent and current center point is outside it, returns 'OUT_OF_EXTENT'.
 * 4. Otherwise returns 'ACTIVE'.
 */
export function evaluateLayerStatus(
  layer: LayerResolutionTarget,
  currentScale: number,
  currentCenter?: { longitude: number; latitude: number }
): LayerScaleStatus {
  // Rule 1: Health check
  if (layer.healthStatus === 'OFFLINE') {
    return 'OFFLINE';
  }

  // Rule 2: Scale check
  if (!isScaleActive(currentScale, layer.minScale, layer.maxScale)) {
    return 'SCALE_INACTIVE';
  }

  // Rule 3: Extent check
  if (layer.extent && currentCenter) {
    if (!isPointInExtent(currentCenter, layer.extent)) {
      return 'OUT_OF_EXTENT';
    }
  }

  // Rule 4: Active
  return 'ACTIVE';
}

