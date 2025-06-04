import { useCallback, useState } from 'react';

/**
 * Custom hook for managing county selection and side panel state
 * 
 * @returns County selection state and handlers
 */
export const useCountySelection = () => {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  /**
   * Selects a county and shows the side panel
   * @param countyName - Name of the county to select
   */
  const selectCounty = useCallback((countyName: string): void => {
    setSelectedCounty(countyName);
    setIsPanelVisible(true);
    console.log(`Selected county: ${countyName}`);
  }, []);

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
    clearSelection
  };
}; 