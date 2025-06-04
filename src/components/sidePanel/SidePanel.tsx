'use client';

import React from 'react';

/**
 * Interface for SidePanel props
 */
interface SidePanelProps {
  /** Name of the selected county */
  selectedCounty: string | null;
  /** Function to close the side panel */
  onClose: () => void;
  /** Whether the panel is visible */
  isVisible: boolean;
}

/**
 * SidePanel Component - Displays detailed information about a selected Texas county
 * 
 * Features:
 * - Full height overlay panel
 * - Responsive design (full width on mobile, partial width on desktop)
 * - High z-index to appear above all other elements
 * - Smooth slide-in animation
 * - Close functionality
 * - Accessible design with proper ARIA attributes
 * 
 * @param props - The component props
 * @returns {React.JSX.Element} The side panel component
 */
export default function SidePanel({ selectedCounty, onClose, isVisible }: SidePanelProps): React.JSX.Element {
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

  /**
   * Handles escape key press to close panel
   * @param event - Keyboard event
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  // Don't render if not visible or no county selected
  if (!isVisible || !selectedCounty) {
    return <></>;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ease-in-out"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Side Panel */}
      <div 
        className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex-shrink-0">
          <h2 id="panel-title" className="text-2xl font-bold text-white leading-tight">
            {formatCountyName(selectedCounty)}
          </h2>
          <button
            className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-600"
            onClick={onClose}
            aria-label="Close county information panel"
            type="button"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* County Overview */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">County Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">State:</span>
                <span className="text-sm font-semibold text-gray-900">Texas</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">County Type:</span>
                <span className="text-sm font-semibold text-gray-900">Texas County</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Region:</span>
                <span className="text-sm font-semibold text-gray-900">Part of Texas</span>
              </div>
            </div>
          </section>

          {/* County Details */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">County Details</h3>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-base">
                {formatCountyName(selectedCounty)} is one of the 254 counties in the state of Texas. 
                Each county in Texas has its own unique history, demographics, and characteristics 
                that contribute to the diverse landscape of the Lone Star State.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">254</div>
                  <div className="text-sm text-blue-800 font-medium">Total TX Counties</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
                  <div className="text-sm text-blue-800 font-medium">Selected County</div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Information */}
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">Additional Information</h3>
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Click on other counties on the map to explore different areas of Texas. 
                Each county has its own unique characteristics and contributes to the 
                rich diversity of the state.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button 
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200" 
                  type="button"
                >
                  Learn More
                </button>
                <button 
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200" 
                  onClick={onClose} 
                  type="button"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
} 