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

const TOOLTIP_OFFSET = 60;

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
   * Shows tooltip positioned above the county element
   * @param countyName - Name of the county to display
   * @param event - Mouse event containing the target element
   */
  const showTooltip = useCallback((countyName: string, event: Event): void => {
    const mouseEvent = event as MouseEvent;
    const pathElement = mouseEvent.target as SVGPathElement;
    
    // Get the iframe element that contains the SVG
    const iframe = pathElement.ownerDocument?.defaultView?.frameElement as HTMLIFrameElement;
    
    if (iframe) {
      // Get the bounding box of the county path element (relative to iframe)
      const pathBbox = pathElement.getBoundingClientRect();
      
      // Get the bounding box of the iframe (relative to main window)
      const iframeBbox = iframe.getBoundingClientRect();
      
      // Calculate the absolute position by adding iframe offset
      const absoluteX = iframeBbox.left + pathBbox.left + pathBbox.width / 2;
      const absoluteY = iframeBbox.top + pathBbox.top;
      
      setTooltip({
        x: absoluteX,
        y: absoluteY - TOOLTIP_OFFSET, // Position 60px above the county
        county: countyName,
        visible: true
      });
    } else {
      // Fallback to mouse position if iframe calculation fails
      setTooltip({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY - TOOLTIP_OFFSET, // Also increase fallback offset
        county: countyName,
        visible: true
      });
    }
  }, []);

  /**
   * Updates tooltip position - for element-based positioning, we don't need to update on mouse move
   */
  const updateTooltipPosition = useCallback((): void => {
    // For element-based positioning, we don't update on mouse move
    // The tooltip stays fixed above the county
  }, []);

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