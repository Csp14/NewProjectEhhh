interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheManager {
  private static cache = new Map<string, CacheEntry<unknown>>();
  private static DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  static getCacheAge(key: string): number | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    return Math.floor((Date.now() - entry.timestamp) / 1000); // Age in seconds
  }

  static has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static getCacheStatus(key: string): 'active' | 'stale' | 'missing' {
    const entry = this.cache.get(key);

    if (!entry) {
      return 'missing';
    }

    const age = Date.now() - entry.timestamp;

    if (age > entry.ttl) {
      return 'stale';
    }

    return 'active';
  }

  static generateKey(prefix: string, params: Record<string, string | number | boolean>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    return `${prefix}_${sortedParams}`;
  }
}
