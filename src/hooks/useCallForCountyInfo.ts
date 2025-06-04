import { getCountyInfo, processCensusData } from "@/apis/countyInfoAPIs";
import { countyDataCache } from "@/services/countyDataCache";
import { CountyInfo, GetCountyInfoData } from "@/types";
import { useCallback, useRef, useState } from 'react';
import { useHttpRequest } from "./useHttpRequest";

/**
 * Normalize county name for consistent caching
 * Handles formats like "Harris County, Texas" -> "Harris"
 */
const normalizeCountyName = (countyName: string): string => {
    return countyName
        .replace(/\s*county\s*(,\s*texas)?\s*$/i, '') // Remove "County" and optional ", Texas"
        .trim();
};

/**
 * Custom hook for fetching county information from US Census Bureau API
 * Uses the dedicated cache service for data caching
 * @returns Hook utilities for county data fetching
 */
export default function useCallForCountyInfo() {
    const { data: rawData, isLoading, isError, error, execute } = useHttpRequest<string[][]>(
        '',
        { immediate: false }
    );

    const [cacheData, setCacheData] = useState<CountyInfo | null>(null);
    const [isFromCache, setIsFromCache] = useState(false);
    const lastStoredRef = useRef<string | null>(null);

    /**
     * Fetch county information by county name
     * Checks cache first using the cache service, then makes API call if needed
     * @param countyName - Name of the Texas county to fetch data for
     */
    const callForCountyInfo = useCallback(async ({ countyName }: GetCountyInfoData) => {
        try {
            // Normalize the county name for consistent cache lookup
            const normalizedCountyName = normalizeCountyName(countyName);
            console.log(`🔍 Looking for county: "${countyName}" -> normalized: "${normalizedCountyName}"`);
            
            // Check cache first using the cache service
            const cachedData = countyDataCache.get(normalizedCountyName);
            if (cachedData) {
                console.log(`✅ Cache HIT for "${normalizedCountyName}" - using cached data`);
                console.log(`📊 Cache stats:`, countyDataCache.getStats());
                setCacheData(cachedData);
                setIsFromCache(true);
                return;
            }

            console.log(`❌ Cache MISS for "${normalizedCountyName}" - fetching from API`);
            console.log(`📊 Current cache contents:`, countyDataCache.getCachedCounties());

            // Reset cache state for API call
            setCacheData(null);
            setIsFromCache(false);
            lastStoredRef.current = null; // Reset storage tracking

            // Make API call if not in cache
            const requestUrl = getCountyInfo({ countyName: normalizedCountyName });
            await execute(requestUrl);
        } catch (err) {
            // Handle county not found errors
            console.error('Error fetching county info:', err);
            setIsFromCache(false);
            setCacheData(null);
            throw err;
        }
    }, [execute]);

    // Process the raw Census data to extract county information
    const processedData: CountyInfo | null = rawData ? processCensusData(rawData) : null;

    // Store successful API responses in cache (only when not from cache and data exists)
    if (processedData && !isFromCache && !isLoading && !isError) {
        // Normalize the county name for consistent cache storage
        const normalizedCountyName = normalizeCountyName(processedData.name);
        
        // Only store if we haven't stored this exact data before (prevent duplicates)
        if (lastStoredRef.current !== normalizedCountyName) {
            lastStoredRef.current = normalizedCountyName;
            
            console.log(`📦 Storing in cache: "${processedData.name}" -> normalized: "${normalizedCountyName}"`);
            countyDataCache.set(normalizedCountyName, processedData);
            console.log(`✅ Successfully cached data for "${normalizedCountyName}"`);
            console.log(`📊 Cache size after storage:`, countyDataCache.size());
        }
    }

    // Return appropriate data: cache data if from cache, otherwise processed API data
    const finalData = isFromCache ? cacheData : processedData;

    return { 
        data: finalData, 
        rawData,
        isLoading: isFromCache ? false : isLoading,
        isError, 
        error, 
        callForCountyInfo,
        isFromCache,
        cacheSize: countyDataCache.size(),
        // Additional cache utilities
        getCachedCounties: countyDataCache.getCachedCounties.bind(countyDataCache),
        getCacheStats: countyDataCache.getStats.bind(countyDataCache),
        clearCache: countyDataCache.clear.bind(countyDataCache),
        cleanupExpiredCache: countyDataCache.cleanupExpired.bind(countyDataCache)
    };
}