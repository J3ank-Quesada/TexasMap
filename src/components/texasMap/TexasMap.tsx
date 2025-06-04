'use client';

import React, { useEffect, useState } from 'react';
import { useCountySelection } from '../../hooks/useCountySelection';
import { useSVGMapInteractions } from '../../hooks/useSVGMapInteractions';
import { useTooltip } from '../../hooks/useTooltip';
import SidePanel from '../sidePanel/SidePanel';
import MapTooltip from './MapTooltip';

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
 * This component now uses separated responsibilities:
 * - useTooltip: manages tooltip state and positioning
 * - useCountySelection: manages county selection and panel state
 * - useSVGMapInteractions: handles SVG event listeners and setup
 * - MapTooltip: renders the tooltip UI
 * - SidePanel: displays detailed county information
 * 
 * @returns {React.JSX.Element} The Texas map component
 */
export default function TexasMap(): React.JSX.Element {
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Custom hooks for separated concerns
  const { tooltip, showTooltip, updateTooltipPosition, hideTooltip } = useTooltip();
  const { selectedCounty, isPanelVisible, selectCounty, closePanel } = useCountySelection();
  
  // SVG map interaction handlers
  const mapHandlers = {
    onCountyHover: showTooltip,
    onCountyMove: updateTooltipPosition,
    onCountyLeave: hideTooltip,
    onCountyClick: selectCounty
  };
  
  const { handleIframeLoad } = useSVGMapInteractions(mapHandlers);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading Texas Map...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {/* Header Section */}
      <header className="text-center py-6 px-5 flex-shrink-0">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3 drop-shadow-sm">
          Texas Counties Interactive Map
        </h1>
        <p className="text-xl text-gray-600 m-0 leading-relaxed">
          Explore all 254 counties of Texas - Hover for details, click to select
        </p>
      </header>

      {/* Map Tooltip */}
      <MapTooltip tooltip={tooltip} />

      {/* Side Panel */}
      <SidePanel 
        selectedCounty={selectedCounty}
        onClose={closePanel}
        isVisible={isPanelVisible}
      />

      {/* SVG Map Container - Takes remaining space */}
      <main className="flex-1 flex justify-center items-center p-5">
        <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex justify-center items-center">
          <iframe
            src="/texas-map.svg"
            className="w-full h-full max-w-5xl border-none rounded-lg bg-white"
            title="Interactive map of Texas counties"
            onLoad={handleIframeLoad}
          >
            <p>Your browser does not support SVG. Please upgrade to a modern browser to view the Texas counties map.</p>
          </iframe>
        </div>
      </main>

      {/* Map Attribution and Info */}
      <footer className="text-center text-sm text-gray-600 py-4 px-5 flex-shrink-0">
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
      </footer>
    </div>
  );
} 