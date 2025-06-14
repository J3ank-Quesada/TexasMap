'use client';

import { formatCountyName } from '@/utils/countyUtils';
import React from 'react';

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
 * Interface for MapTooltip props
 */
interface MapTooltipProps {
  /** Tooltip data including position and content */
  tooltip: TooltipData;
}

/**
 * MapTooltip Component - Displays county information tooltip
 * 
 * Features:
 * - Fixed positioning based on mouse coordinates
 * - Smooth fade-in animation
 * - Arrow pointing to the hovered area
 * - Non-interactive (pointer-events: none)
 * 
 * @param props - The component props
 * @returns {React.JSX.Element | null} The tooltip component or null if not visible
 */
export default function MapTooltip({ tooltip }: MapTooltipProps): React.JSX.Element | null {
  // Don't render if tooltip is not visible
  if (!tooltip.visible) {
    return null;
  }

  // Use the exact position calculated from the county element
  const tooltipX = tooltip.x - 100;
  const tooltipY = tooltip.y;

  return (
    <div 
      className="fixed z-[1000] pointer-events-none animate-in fade-in duration-200"
      style={{
        left: `${tooltipX}px`,
        top: `${tooltipY}px`
      }}
    >
      <div className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm shadow-lg max-w-xs text-center relative">
        <strong className="block font-semibold mb-1">
          {formatCountyName(tooltip.county)}
        </strong>
        <div className="text-xs opacity-80 text-gray-300">
          Click to select
        </div>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-gray-800"></div>
      </div>
    </div>
  );
} 