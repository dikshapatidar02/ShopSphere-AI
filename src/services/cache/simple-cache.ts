export interface CacheEntry<T> {
  readonly value: T;
  readonly timestamp: number;
  readonly ttlMs: number;
}

export class SimpleCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  public set<T>(key: string, value: T, ttlMs: number = 300000): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
    if (isExpired) {
      return null;
    }

    return entry.value;
  }

  /**
   * Retrieves last-known cached value even if expired (used for graceful fallback on network failure).
   */
  public getLastKnown<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    return entry ? entry.value : null;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const globalCache = new SimpleCache();
