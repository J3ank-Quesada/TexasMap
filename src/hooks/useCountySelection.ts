import useCallForCountyInfo from '@/hooks/useCallForCountyInfo';
import { useCallback, useState } from 'react';

/**
 * Custom hook for managing county selection and side panel state
 * Integrates with Census API to fetch county data when a county is selected
 * Now includes comprehensive caching functionality via dedicated cache service
 * 
 * @returns County selection state and handlers
 */
export const useCountySelection = () => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  // Census API integration with dedicated cache service
  const { 
    data: countyData, 
    isLoading, 
    isError, 
    error, 
    callForCountyInfo,
    isFromCache,
    cacheSize,
    getCachedCounties,
    getCacheStats,
    clearCache,
    cleanupExpiredCache
  } = useCallForCountyInfo();

  /**
   * Selects a county, shows the side panel, and fetches Census data
   * Uses dedicated cache service when available to improve performance
   * @param countyName - Name of the county to select
   */
  const selectCounty = useCallback(async (countyName: string): Promise<void> => {
    setSelectedCounty(countyName);
    setIsPanelVisible(true);
    
    try {
      // Fetch Census data for the selected county (will use cache if available)
      await callForCountyInfo({ countyName });
      
    } catch (err) {
      console.error(`❌ Failed to fetch data for ${countyName}:`, err);
      // Continue showing the panel even if API call fails
    }
  }, [callForCountyInfo]);

  /**
   * Closes the side panel and clears selection
   */
  const closePanel = useCallback((): void => {
    setIsPanelVisible(false);
    setSelectedCounty(null);
  }, []);

  /**
   * Clears the selected county without affecting panel visibility
   */
  const clearSelection = useCallback((): void => {
    setSelectedCounty(null);
  }, []);

  return {
    selectedCounty,
    isPanelVisible,
    selectCounty,
    closePanel,
    clearSelection,
    // Census API data and states
    countyData,
    isLoadingCountyData: isLoading,
    isCountyDataError: isError,
    countyDataError: error,
    // Cache-related information and utilities
    isFromCache,
    cacheSize,
    getCachedCounties,
    getCacheStats,
    clearCache,
    cleanupExpiredCache
  };
}; 