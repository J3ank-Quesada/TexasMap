import { useCallback, useState } from 'react';

/**
 * Interface for tooltip data
 */
interface TooltipData {
  x: number;
  y: number;
  county: string;
  visible: boolean;
}

/**
 * Custom hook for managing tooltip state and interactions
 * 
 * @returns Tooltip state and handlers
 */
export const useTooltip = () => {
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    county: '',
    visible: false
  });

  /**
   * Shows tooltip at specified position
   * @param countyName - Name of the county to display
   * @param event - Mouse event for positioning
   */
  const showTooltip = useCallback((countyName: string, event: Event): void => {
    const mouseEvent = event as MouseEvent;
    setTooltip({
      x: mouseEvent.clientX + 125,
      y: mouseEvent.clientY + 125,
      county: countyName,
      visible: true
    });
  }, []);

  /**
   * Updates tooltip position based on mouse movement
   * @param event - Mouse event for positioning
   */
  const updateTooltipPosition = useCallback((event: Event): void => {
    if (tooltip.visible) {
      const mouseEvent = event as MouseEvent;
      setTooltip(prev => ({
        ...prev,
        x: mouseEvent.clientX,
        y: mouseEvent.clientY - 20
      }));
    }
  }, [tooltip.visible]);

  /**
   * Hides the tooltip
   */
  const hideTooltip = useCallback((): void => {
    setTooltip(prev => ({
      ...prev,
      visible: false
    }));
  }, []);

  return {
    tooltip,
    showTooltip,
    updateTooltipPosition,
    hideTooltip
  };
}; 