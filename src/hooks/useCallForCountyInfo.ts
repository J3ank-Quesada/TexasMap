import { getCountyInfo, processCensusData } from "@/apis/countyInfoAPIs";
import { countyDataCache } from "@/services/countyDataCache";
import { CountyInfo, GetCountyInfoData } from "@/types";
import { useCallback, useState } from 'react';
import { useHttpRequest } from "./useHttpRequest";

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

    const [cacheHit, setCacheHit] = useState<CountyInfo | null>(null);
    const [isFromCache, setIsFromCache] = useState(false);

    /**
     * Fetch county information by county name
     * Checks cache first using the cache service, then makes API call if needed
     * @param countyName - Name of the Texas county to fetch data for
     */
    const callForCountyInfo = useCallback(async ({ countyName }: GetCountyInfoData) => {
        try {
            // Check cache first using the cache service
            const cachedData = countyDataCache.get(countyName);
            if (cachedData) {
                setCacheHit(cachedData);
                setIsFromCache(true);
                return;
            }

            // Reset cache hit state
            setCacheHit(null);
            setIsFromCache(false);

            // Make API call if not in cache
            console.log(`⚡ Cache miss for ${countyName} - fetching from API`);
            const requestUrl = getCountyInfo({ countyName });
            await execute(requestUrl);
        } catch (err) {
            // Handle county not found errors
            console.error('Error fetching county info:', err);
            throw err;
        }
    }, [execute]);

    // Process the raw Census data to extract county information
    const processedData: CountyInfo | null = rawData ? processCensusData(rawData) : null;

    // Store successful API responses in cache using the cache service
    if (processedData && !isFromCache && !isLoading && !isError) {
        // Get the county name from the processed data to use as cache key
        const countyNameFromData = processedData.name.replace(' County', '');
        countyDataCache.set(countyNameFromData, processedData);
    }

    // Return cached data if available, otherwise return processed API data
    const finalData = isFromCache ? cacheHit : processedData;

    return { 
        data: finalData, 
        rawData,
        isLoading: isFromCache ? false : isLoading, // Don't show loading if using cache
        isError, 
        error, 
        callForCountyInfo,
        isFromCache, // Expose whether data came from cache
        cacheSize: countyDataCache.size(), // Get cache size from service
        // Additional cache utilities
        getCachedCounties: countyDataCache.getCachedCounties.bind(countyDataCache),
        getCacheStats: countyDataCache.getStats.bind(countyDataCache),
        clearCache: countyDataCache.clear.bind(countyDataCache),
        cleanupExpiredCache: countyDataCache.cleanupExpired.bind(countyDataCache)
    };
}