import { CountyInfo } from '@/types';

/**
 * County data cache entry interface
 */
interface CacheEntry {
  data: CountyInfo;
  timestamp: number;
}

/**
 * County data cache interface
 */
interface CountyCache {
  [countyName: string]: CacheEntry;
}

/**
 * Cache expiration time (24 hours in milliseconds)
 * Since Census data is from 2022 estimates, it doesn't change frequently
 */
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours

/**
 * County Data Cache Service
 * 
 * Provides caching functionality for county demographic data to improve performance
 * and reduce API calls. Implements automatic cache expiration and validation.
 */
class CountyDataCacheService {
  private cache: CountyCache = {};

  /**
   * Check if cached data is still valid
   * @param timestamp - When the data was cached
   * @returns Whether the cached data is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < CACHE_EXPIRY_TIME;
  }

  /**
   * Normalize county name for consistent cache keys
   * @param countyName - Raw county name
   * @returns Normalized cache key
   */
  private normalizeCountyName(countyName: string): string {
    return countyName.toLowerCase().trim();
  }

  /**
   * Store county data in cache
   * @param countyName - Name of the county to cache
   * @param data - County data to store
   */
  public set(countyName: string, data: CountyInfo): void {
    const cacheKey = this.normalizeCountyName(countyName);
    this.cache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
  }

  /**
   * Get county data from cache if available and valid
   * @param countyName - Name of the county to retrieve from cache
   * @returns Cached county data or null if not found/expired
   */
  public get(countyName: string): CountyInfo | null {
    const cacheKey = this.normalizeCountyName(countyName);
    const cachedEntry = this.cache[cacheKey];
    
    if (!cachedEntry) {
      return null;
    }

    if (this.isCacheValid(cachedEntry.timestamp)) {
      return cachedEntry.data;
    }
    
    // Remove expired cache entry
    this.remove(countyName);
    return null;
  }

  /**
   * Check if county data exists in cache (regardless of expiration)
   * @param countyName - Name of the county to check
   * @returns Whether the county exists in cache
   */
  public has(countyName: string): boolean {
    const cacheKey = this.normalizeCountyName(countyName);
    return cacheKey in this.cache;
  }

  /**
   * Remove specific county data from cache
   * @param countyName - Name of the county to remove
   */
  public remove(countyName: string): void {
    const cacheKey = this.normalizeCountyName(countyName);
    delete this.cache[cacheKey];
  }

  /**
   * Clear all cached data
   */
  public clear(): void {
    this.cache = {};
  }

  /**
   * Get current cache size
   * @returns Number of entries in cache
   */
  public size(): number {
    return Object.keys(this.cache).length;
  }

  /**
   * Get all cached county names
   * @returns Array of cached county names
   */
  public getCachedCounties(): string[] {
    return Object.keys(this.cache).map(cacheKey => 
      this.cache[cacheKey].data.name.replace(' County', '')
    );
  }

  /**
   * Get cache statistics
   * @returns Cache statistics including size, oldest entry, etc.
   */
  public getStats(): {
    size: number;
    oldestEntry: string | null;
    newestEntry: string | null;
    totalSize: number;
  } {
    const entries = Object.values(this.cache);
    
    if (entries.length === 0) {
      return {
        size: 0,
        oldestEntry: null,
        newestEntry: null,
        totalSize: 0
      };
    }

    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    let oldestEntry = '';
    let newestEntry = '';

    entries.forEach((entry) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestEntry = entry.data.name;
      }
      if (entry.timestamp > newestTimestamp) {
        newestTimestamp = entry.timestamp;
        newestEntry = entry.data.name;
      }
    });

    return {
      size: entries.length,
      oldestEntry,
      newestEntry,
      totalSize: JSON.stringify(this.cache).length
    };
  }

  /**
   * Remove expired entries from cache
   * @returns Number of entries removed
   */
  public cleanupExpired(): number {
    const initialSize = this.size();
    
    Object.keys(this.cache).forEach(cacheKey => {
      if (!this.isCacheValid(this.cache[cacheKey].timestamp)) {
        delete this.cache[cacheKey];
      }
    });
    
    const removedCount = initialSize - this.size();
    
    return removedCount;
  }
}

// Export singleton instance
export const countyDataCache = new CountyDataCacheService();

// Export the class for testing purposes
export { CountyDataCacheService };
