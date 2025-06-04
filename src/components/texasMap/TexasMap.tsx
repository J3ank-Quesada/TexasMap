'use client';

import React, { useCallback, useEffect, useState } from 'react';
import SidePanel from '../sidePanel/SidePanel';

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
  const [isPanelVisible, setIsPanelVisible] = useState(false);
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
    setIsPanelVisible(true);
    console.log(`Selected county: ${countyName}`);
  }, []);

  /**
   * Handles closing the side panel
   */
  const handleClosePanel = useCallback((): void => {
    setIsPanelVisible(false);
    setSelectedCounty(null);
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
    <div className="flex flex-col items-center p-5 min-h-screen bg-gray-50 font-sans">
      <div className="text-center mb-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 drop-shadow-sm">Texas Counties Interactive Map</h1>
        <p className="text-xl text-gray-600 m-0 leading-relaxed">
          Explore all 254 counties of Texas - Hover for details, click to select
        </p>
      </div>

      {/* Dynamic Tooltip */}
      {tooltip.visible && (
        <div 
          className="fixed z-[1000] pointer-events-none animate-in fade-in duration-200"
          style={{
            left: `${tooltip.x - 20}px`,
            top: `${tooltip.y - 30}px`
          }}
        >
          <div className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm shadow-lg max-w-xs text-center relative">
            <strong className="block font-semibold mb-1">{formatCountyName(tooltip.county)}</strong>
            <div className="text-xs opacity-80 text-gray-300">
              Click to select • Part of Texas
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}

      {/* Side Panel */}
      <SidePanel 
        selectedCounty={selectedCounty}
        onClose={handleClosePanel}
        isVisible={isPanelVisible}
      />

      {/* SVG Map Container */}
      <div className="flex justify-center items-center w-full max-w-5xl my-5 p-5 bg-white rounded-xl shadow-lg border border-gray-200">
        <iframe
          src="/texas-map.svg"
          className="w-full h-auto max-w-4xl min-h-[400px] border-none rounded-lg bg-white"
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
      <div className="mt-8 text-center text-sm text-gray-600">
        <p className="my-1">
          Texas Counties Map • 254 Counties • Interactive SVG Map
        </p>
        <p className="my-1">
          Original map data from{' '}
          <a 
            href="https://mapsvg.com/maps/usa-tx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 no-underline font-medium hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            MapSVG
          </a>
        </p>
      </div>
    </div>
  );
} 