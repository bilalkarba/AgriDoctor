/**
 * Simple in-memory cache for API responses to reduce quota usage
 * Caches responses for 1 hour by default
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Generate a cache key from request parameters
 */
function generateKey(prefix: string, params: Record<string, any>): string {
  const paramsStr = JSON.stringify(params);
  return `${prefix}:${Buffer.from(paramsStr).toString('base64')}`;
}

/**
 * Get cached value if it exists and hasn't expired
 */
export function getCached<T>(prefix: string, params: Record<string, any>): T | null {
  const key = generateKey(prefix, params);
  const entry = cache.get(key);

  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

/**
 * Set cached value with TTL (default 1 hour)
 */
export function setCached(
  prefix: string,
  params: Record<string, any>,
  data: any,
  ttlMs: number = 60 * 60 * 1000 // 1 hour default
): void {
  const key = generateKey(prefix, params);
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache size (number of entries)
 */
export function getCacheSize(): number {
  return cache.size;
}
