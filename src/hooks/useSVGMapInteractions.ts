import { useCallback } from 'react';
import { isValidCountyName } from '../utils/countyUtils';
import { setDefaultCountyStyles, setHoverCountyStyles } from '../utils/mapStyling';

/**
 * Interface for SVG map interaction handlers
 */
interface SVGMapHandlers {
  onCountyHover: (countyName: string, event: Event) => void;
  onCountyMove: (event: Event) => void;
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
      console.log('SVG Document:', svgDoc);
      
      if (!svgDoc) {
        console.error('Could not access SVG document');
        return;
      }

      const counties = svgDoc.querySelectorAll('path[id]');
      console.log('Found counties:', counties.length);
      
      counties.forEach((county) => {
        const countyName = county.getAttribute('id');
        console.log('Processing county:', countyName);
        
        if (!countyName || !isValidCountyName(countyName)) {
          return;
        }

        const countyElement = county as SVGElement;
        
        // Set default styles
        setDefaultCountyStyles(countyElement);
        
        // Add event listeners for tooltip and interaction
        county.addEventListener('mouseenter', (event) => {
          console.log('Mouse enter:', countyName);
          handlers.onCountyHover(countyName, event);
          setHoverCountyStyles(countyElement);
        });
        
        county.addEventListener('mousemove', handlers.onCountyMove);
        
        county.addEventListener('mouseleave', () => {
          console.log('Mouse leave:', countyName);
          handlers.onCountyLeave();
          // Reset to default styles
          setDefaultCountyStyles(countyElement);
        });
        
        county.addEventListener('click', () => {
          console.log('County clicked:', countyName);
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
    console.log('SVG iframe loaded');
    const iframe = event.target as HTMLIFrameElement;
    setupSVGInteractions(iframe);
  }, [setupSVGInteractions]);

  return {
    handleIframeLoad
  };
}; 