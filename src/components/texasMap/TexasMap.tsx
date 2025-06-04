'use client';

import React, { useCallback, useEffect, useState } from 'react';
import styles from './TexasMap.module.css';

/**
 * Interface for tooltip position and content
 */
interface TooltipData {
  x: number;
  y: number;
  county: string;
  visible: boolean;
}

/**
 * TexasMap Component - Displays an interactive SVG map of Texas Counties
 * 
 * Features:
 * - Interactive SVG map with hover effects for all 254 Texas counties
 * - Dynamic tooltips that follow the cursor
 * - Click handling for counties/regions
 * - Responsive design
 * - Accessibility support
 * 
 * @returns {React.JSX.Element} The Texas map component
 */
export default function TexasMap(): React.JSX.Element {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    x: 0,
    y: 0,
    county: '',
    visible: false
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  /**
   * Handles click events on map counties
   * @param countyName - Name of the clicked county
   */
  const handleCountyClick = useCallback((countyName: string): void => {
    setSelectedCounty(countyName);
    console.log(`Selected county: ${countyName}`);
  }, []);

  /**
   * Handles mouse enter events on map counties
   * @param countyName - Name of the hovered county
   * @param event - Mouse event for positioning
   */
  const handleCountyHover = useCallback((countyName: string, event: Event): void => {
    console.log('JEANK countyName', countyName)
    const mouseEvent = event as MouseEvent;
    setTooltip({
      x: mouseEvent.clientX +125,
      y: mouseEvent.clientY + 125,
      county: countyName,
      visible: true
    });
  }, []);

  /**
   * Handles mouse move events to update tooltip position
   * @param event - Mouse event for positioning
   */
  const handleMouseMove = useCallback((event: Event): void => {
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
   * Handles mouse leave events on map counties
   */
  const handleCountyLeave = useCallback((): void => {
    setTooltip(prev => ({
      ...prev,
      visible: false
    }));
  }, []);

  if(!isHydrated) {
    return <div>Loading...</div>;
  }


  /**
   * Formats county name for display
   * @param countyName - Raw county name from SVG
   * @returns Formatted county name
   */
  const formatCountyName = (countyName: string): string => {
    // Handle special cases like "Red River" and "Deaf Smith"
    if (countyName.includes(' ')) {
      return `${countyName} County`;
    }
    return `${countyName} County`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Texas Counties Interactive Map</h1>
        <p className={styles.subtitle}>
          Explore all 254 counties of Texas - Hover for details, click to select
        </p>
      </div>

      {/* Display selected county info */}
      {selectedCounty && (
        <div className={styles.infoPanel}>
          <h3>Selected County: {formatCountyName(selectedCounty)}</h3>
          <p>Click on other counties to explore more areas of Texas</p>
        </div>
      )}

      {/* Dynamic Tooltip */}
      {tooltip.visible && (
        <div 
          className={styles.tooltip}
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y - 30}px`
          }}
        >
          <div className={styles.tooltipContent}>
            <strong>{formatCountyName(tooltip.county)}</strong>
            <div className={styles.tooltipSubtext}>
              Click to select • Part of Texas
            </div>
          </div>
          <div className={styles.tooltipArrow}></div>
        </div>
      )}

      {/* SVG Map Container */}
      <div className={styles.mapContainer}>
        <iframe
          src="/texas-map.svg"
          className={styles.svgMap}
          title="Interactive map of Texas counties"
          onLoad={(e) => {
            console.log('SVG iframe loaded');
            // Add interactivity to county paths once SVG is loaded
            const iframe = e.target as HTMLIFrameElement;
            try {
              const svgDoc = iframe.contentDocument || iframe.contentWindow?.document;
              console.log('SVG Document:', svgDoc);
              
              if (svgDoc) {
                const counties = svgDoc.querySelectorAll('path[id]');
                console.log('Found counties:', counties.length);
                
                counties.forEach((county) => {
                  const countyName = county.getAttribute('id');
                  console.log('Processing county:', countyName);
                  
                  if (countyName) {
                    // Set default colors first
                    (county as SVGElement).style.fill = '#e6f3ff';
                    (county as SVGElement).style.stroke = '#0066cc';
                    (county as SVGElement).style.strokeWidth = '1';
                    (county as SVGElement).style.cursor = 'pointer';
                    (county as SVGElement).style.transition = 'all 0.3s ease';
                    
                    // Add event listeners for tooltip and interaction
                    county.addEventListener('mouseenter', (event) => {
                      console.log('Mouse enter:', countyName);
                      handleCountyHover(countyName, event);
                      // Hover styling
                      (county as SVGElement).style.fill = '#b3d9ff';
                      (county as SVGElement).style.stroke = '#004499';
                      (county as SVGElement).style.strokeWidth = '2';
                      (county as SVGElement).style.filter = 'drop-shadow(0 2px 4px rgba(0, 102, 204, 0.3))';
                    });
                    
                    county.addEventListener('mousemove', handleMouseMove);
                    
                    county.addEventListener('mouseleave', () => {
                      console.log('Mouse leave:', countyName);
                      handleCountyLeave();
                      // Reset to default if not selected
                      if (selectedCounty !== countyName) {
                        (county as SVGElement).style.fill = '#e6f3ff';
                        (county as SVGElement).style.stroke = '#0066cc';
                        (county as SVGElement).style.strokeWidth = '1';
                        (county as SVGElement).style.filter = 'none';
                      }
                    });
                    
                    county.addEventListener('click', () => {
                      console.log('County clicked:', countyName);
                      handleCountyClick(countyName);
                      
                      // Reset all counties to default
                      counties.forEach((c) => {
                        (c as SVGElement).style.fill = '#e6f3ff';
                        (c as SVGElement).style.stroke = '#0066cc';
                        (c as SVGElement).style.strokeWidth = '1';
                        (c as SVGElement).style.filter = 'none';
                      });
                      
                      // Highlight selected county
                      (county as SVGElement).style.fill = '#ff6b35';
                      (county as SVGElement).style.stroke = '#cc5500';
                      (county as SVGElement).style.strokeWidth = '3';
                      (county as SVGElement).style.filter = 'drop-shadow(0 4px 8px rgba(255, 107, 53, 0.4))';
                    });
                  }
                });
              } else {
                console.error('Could not access SVG document');
              }
            } catch (error) {
              console.error('Error accessing iframe content:', error);
            }
          }}
        >
          <p>Your browser does not support SVG. Please upgrade to a modern browser to view the Texas counties map.</p>
        </iframe>
      </div>

      {/* Map Attribution and Info */}
      <div className={styles.attribution}>
        <p>
          Texas Counties Map • 254 Counties • Interactive SVG Map
        </p>
        <p>
          Original map data from{' '}
          <a 
            href="https://mapsvg.com/maps/usa-tx" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.attributionLink}
          >
            MapSVG
          </a>
        </p>
      </div>
    </div>
  );
} 