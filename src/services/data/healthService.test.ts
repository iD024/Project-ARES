import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkDatasetHealth, getCachedHealthStatus, clearHealthCache } from './healthService.ts';

describe('Data Health & Availability Service', () => {
  beforeEach(() => {
    clearHealthCache();
    vi.restoreAllMocks();
  });

  it('probes endpoint and returns ONLINE status with latency for responsive services', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
    } as any);

    const result = await checkDatasetHealth('mars-viking-mdim21');
    expect(result.status).toBe('ONLINE');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.lastChecked).toBeDefined();

    // Verify cache stores the result
    expect(getCachedHealthStatus('mars-viking-mdim21')?.status).toBe('ONLINE');
  });

  it('handles offline or network failures gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection timeout'));

    const result = await checkDatasetHealth('mars-ctx-mosaic');
    expect(result.status).toBe('OFFLINE');
    expect(result.error).toContain('Network connection timeout');
  });

  it('returns UNKNOWN for non-existent datasets', async () => {
    const result = await checkDatasetHealth('non-existent-dataset');
    expect(result.status).toBe('UNKNOWN');
  });
});
