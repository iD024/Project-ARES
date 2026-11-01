/**
 * ARES Planetary Data Health & Endpoint Probe Service
 *
 * Checks endpoint responsiveness, CORS support, and network latency.
 * Caches health status in memory to minimize network overhead.
 */

import { getDatasetById } from './datasetRegistry.ts';

export type HealthStatus = 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'UNKNOWN';

export interface HealthReport {
  datasetId: string;
  status: HealthStatus;
  latencyMs: number;
  lastChecked: number;
  error?: string;
}

const healthCache = new Map<string, HealthReport>();
const CACHE_TTL_MS = 60000; // 1 minute cache TTL

export function clearHealthCache(): void {
  healthCache.clear();
}

export function getCachedHealthStatus(datasetId: string): HealthReport | undefined {
  const cached = healthCache.get(datasetId);
  if (cached && Date.now() - cached.lastChecked < CACHE_TTL_MS) {
    return cached;
  }
  return undefined;
}

export async function checkDatasetHealth(datasetId: string): Promise<HealthReport> {
  const dataset = getDatasetById(datasetId);
  if (!dataset) {
    return {
      datasetId,
      status: 'UNKNOWN',
      latencyMs: 0,
      lastChecked: Date.now(),
      error: 'Dataset not found in registry',
    };
  }

  const cached = getCachedHealthStatus(datasetId);
  if (cached) {
    return cached;
  }

  // Local geojson files are always online if available
  if (dataset.format === 'GEOJSON') {
    const report: HealthReport = {
      datasetId,
      status: 'ONLINE',
      latencyMs: 5,
      lastChecked: Date.now(),
    };
    healthCache.set(datasetId, report);
    return report;
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const probeUrl = dataset.endpointUrl.includes('?')
      ? `${dataset.endpointUrl}&probe=ares`
      : `${dataset.endpointUrl}?probe=ares`;

    const response = await fetch(probeUrl, {
      method: 'HEAD',
      signal: controller.signal,
    }).catch(() => {
      // Fallback to GET with range if HEAD rejected
      return fetch(probeUrl, {
        method: 'GET',
        headers: { Range: 'bytes=0-100' },
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;
    const isOnline = response.ok || response.status === 200 || response.status === 206 || response.status === 400;

    const report: HealthReport = {
      datasetId,
      status: isOnline ? 'ONLINE' : 'DEGRADED',
      latencyMs,
      lastChecked: Date.now(),
    };

    healthCache.set(datasetId, report);
    return report;
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const report: HealthReport = {
      datasetId,
      status: 'OFFLINE',
      latencyMs,
      lastChecked: Date.now(),
      error: err?.message || 'Network unreachable',
    };
    healthCache.set(datasetId, report);
    return report;
  }
}
