import { isValidCountyName } from '@/utils/countyUtils';
import { setDefaultCountyStyles, setHoverCountyStyles } from '@/utils/mapStyling';
import { useCallback } from 'react';

/**
 * Interface for SVG map interaction handlers
 */
interface SVGMapHandlers {
  onCountyHover: (countyName: string, event: Event) => void;
  onCountyMove: () => void;
  onCountyLeave: () => void;
  onCountyClick: (countyName: string) => void;
}

/**
 * Custom hook for managing SVG map interactions
 * 
 * @param handlers - Event handlers for map interactions
 * @returns Setup function for SVG map
 */
export const useSVGMapInteractions = (handlers: SVGMapHandlers) => {
  
  /**
   * Sets up event listeners for all county paths in the SVG
   * @param iframe - HTMLIFrameElement containing the SVG map
   */
  const setupSVGInteractions = useCallback((iframe: HTMLIFrameElement): void => {
    try {
      const svgDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!svgDoc) {
        console.error('Could not access SVG document');
        return;
      }

      const counties = svgDoc.querySelectorAll('path[id]');
      
      counties.forEach((county) => {
        const countyName = county.getAttribute('id');
        
        if (!countyName || !isValidCountyName(countyName)) {
          return;
        }

        const countyElement = county as SVGElement;
        
        // Set default styles
        setDefaultCountyStyles(countyElement);
        
        // Add event listeners for tooltip and interaction
        county.addEventListener('mouseenter', (event) => {
          handlers.onCountyHover(countyName, event);
          setHoverCountyStyles(countyElement);
        });
        
        county.addEventListener('mouseleave', () => {
          handlers.onCountyLeave();
          // Reset to default styles
          setDefaultCountyStyles(countyElement);
        });
        
        county.addEventListener('click', () => {
          handlers.onCountyClick(countyName);
        });
      });
    } catch (error) {
      console.error('Error accessing iframe content:', error);
    }
  }, [handlers]);

  /**
   * Handles iframe load event
   * @param event - Load event from iframe
   */
  const handleIframeLoad = useCallback((event: React.SyntheticEvent<HTMLIFrameElement>): void => {
    const iframe = event.target as HTMLIFrameElement;
    setupSVGInteractions(iframe);
  }, [setupSVGInteractions]);

  return {
    handleIframeLoad
  };
}; 