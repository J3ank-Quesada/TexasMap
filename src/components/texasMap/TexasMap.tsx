'use client';

import React, { useState } from 'react';
import styles from './TexasMap.module.css';

/**
 * TexasMap Component - Displays an interactive SVG map of Texas Counties
 * 
 * Features:
 * - Interactive SVG map with hover effects for all 254 Texas counties
 * - Click handling for counties/regions
 * - Responsive design
 * - Accessibility support
 * 
 * @returns {React.JSX.Element} The Texas map component
 */
export default function TexasMap(): React.JSX.Element {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [hoveredCounty, setHoveredCounty] = useState<string | null>(null);

  /**
   * Handles click events on map counties
   * @param countyName - Name of the clicked county
   */
  const handleCountyClick = (countyName: string): void => {
    setSelectedCounty(countyName);
    console.log(`Selected county: ${countyName}`);
  };

  /**
   * Handles mouse enter events on map counties
   * @param countyName - Name of the hovered county
   */
  const handleCountyHover = (countyName: string): void => {
    setHoveredCounty(countyName);
  };

  /**
   * Handles mouse leave events on map counties
   */
  const handleCountyLeave = (): void => {
    setHoveredCounty(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Texas Counties Interactive Map</h1>
        <p className={styles.subtitle}>
          Explore all 254 counties of Texas - Click on any county to see details
        </p>
      </div>

      {/* Display selected county info */}
      {selectedCounty && (
        <div className={styles.infoPanel}>
          <h3>Selected County: {selectedCounty}</h3>
          <p>Click on other counties to explore more areas of Texas</p>
        </div>
      )}

      {/* Display hovered county info */}
      {hoveredCounty && (
        <div className={styles.hoverInfo}>
          Hovering: {hoveredCounty} County
        </div>
      )}

      {/* SVG Map Container */}
      <div className={styles.mapContainer}>
        <object
          data="/texas-map.svg"
          type="image/svg+xml"
          className={styles.svgMap}
          aria-label="Interactive map of Texas counties"
          onLoad={(e) => {
            // Add interactivity to county paths once SVG is loaded
            const svgDoc = (e.target as HTMLObjectElement).contentDocument;
            if (svgDoc) {
              const counties = svgDoc.querySelectorAll('path[id]');
              
              counties.forEach((county) => {
                const countyName = county.getAttribute('id');
                
                if (countyName) {
                  // Add hover effects
                  county.addEventListener('mouseenter', () => handleCountyHover(countyName));
                  county.addEventListener('mouseleave', handleCountyLeave);
                  
                  // Add click handlers
                  county.addEventListener('click', () => handleCountyClick(countyName));
                  
                  // Add CSS classes for styling
                  county.setAttribute('class', 'texas-county');
                  
                  // Add cursor pointer and basic styling
                  (county as SVGElement).style.cursor = 'pointer';
                  (county as SVGElement).style.transition = 'all 0.3s ease';
                  
                  // Set default colors
                  (county as SVGElement).style.fill = '#e6f3ff';
                  (county as SVGElement).style.stroke = '#0066cc';
                  (county as SVGElement).style.strokeWidth = '1';
                  
                  // Add hover effects
                  county.addEventListener('mouseenter', () => {
                    (county as SVGElement).style.fill = '#b3d9ff';
                    (county as SVGElement).style.stroke = '#004499';
                    (county as SVGElement).style.strokeWidth = '2';
                    (county as SVGElement).style.filter = 'drop-shadow(0 2px 4px rgba(0, 102, 204, 0.3))';
                  });
                  
                  county.addEventListener('mouseleave', () => {
                    if (selectedCounty !== countyName) {
                      (county as SVGElement).style.fill = '#e6f3ff';
                      (county as SVGElement).style.stroke = '#0066cc';
                      (county as SVGElement).style.strokeWidth = '1';
                      (county as SVGElement).style.filter = 'none';
                    }
                  });
                  
                  // Highlight selected county
                  county.addEventListener('click', () => {
                    // Reset all counties
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
            }
          }}
        >
          <p>Your browser does not support SVG. Please upgrade to a modern browser to view the Texas counties map.</p>
        </object>
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