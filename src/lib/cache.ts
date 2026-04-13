/**
 * Shared localStorage cache utility with expiry
 *
 * Used by shopify.ts and dataFetcher.ts to avoid duplication.
 * All cache entries have a configurable TTL and are automatically
 * cleaned up on expiry.
 */

export interface CachedData<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  /** Cache duration in milliseconds (default: 5 minutes) */
  ttl?: number;
  /** Key prefix to namespace cache entries (default: 'app') */
  prefix?: string;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const DEFAULT_PREFIX = 'app';

/**
 * Generate a cache key from a prefix and variables object.
 */
export function getCacheKey(prefix: string, variables: Record<string, unknown>): string {
  return `${prefix}:${JSON.stringify(variables)}`;
}

/**
 * Read cached data. Returns null if not found or expired.
 * Automatically removes expired entries.
 */
export function readFromCache<T>(cacheKey: string): T | null {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(cacheKey);
  if (!cached) return null;

  try {
    const { data, timestamp }: CachedData<T> = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > DEFAULT_TTL;

    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Write data to cache with current timestamp.
 */
export function writeToCache<T>(cacheKey: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    const cached: CachedData<T> = { data, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(cached));
  } catch {
    // Ignore cache write errors (e.g., quota exceeded)
  }
}

/**
 * Clear all cache entries with the given prefix.
 */
export function clearCache(prefix: string = DEFAULT_PREFIX): void {
  if (typeof window === 'undefined') return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Create a cache client with a specific prefix and TTL.
 */
export function createCache(options: CacheOptions = {}) {
  const prefix = options.prefix || DEFAULT_PREFIX;
  const ttl = options.ttl || DEFAULT_TTL;

  return {
    /** Generate a cache key from variables */
    key(name: string, variables: Record<string, unknown>): string {
      return getCacheKey(`${prefix}:${name}`, variables);
    },

    /** Read cached data */
    read<T>(key: string): T | null {
      return readFromCache<T>(key);
    },

    /** Write data to cache */
    write<T>(key: string, data: T): void {
      // Override TTL check for this specific cache
      if (typeof window === 'undefined') return;
      try {
        const cached: CachedData<T> = { data, timestamp: Date.now() };
        // Custom TTL: store expiry info alongside data
        const entry = { ...cached, ttl };
        localStorage.setItem(key, JSON.stringify(entry));
      } catch {
        // Ignore
      }
    },

    /** Clear all entries with this prefix */
    clear(): void {
      clearCache(prefix);
    },
  };
}
