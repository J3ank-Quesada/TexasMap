'use client';

import { CountyInfo } from '@/types';
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
  /** Census data for the selected county */
  countyData: CountyInfo | null;
  /** Loading state for county data */
  isLoadingCountyData: boolean;
  /** Error state for county data */
  isCountyDataError: boolean;
  /** Error message for county data */
  countyDataError: string | undefined;
  /** Whether data came from cache */
  isFromCache?: boolean;
  /** Current cache size */
  cacheSize?: number;
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
 * - Real-time Census Bureau demographic data
 * 
 * @param props - The component props
 * @returns {React.JSX.Element} The side panel component
 */
export default function SidePanel({ 
  selectedCounty, 
  onClose, 
  isVisible, 
  countyData, 
  isLoadingCountyData, 
  isCountyDataError, 
  countyDataError, 
  isFromCache, 
  cacheSize 
}: SidePanelProps): React.JSX.Element {
  
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
   * Format currency values for display
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  /**
   * Format number values for display
   */
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
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
          {/* Loading State */}
          {isLoadingCountyData && (
            <div className="flex items-center justify-center p-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading county data...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isCountyDataError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load county data
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{countyDataError || 'Unable to fetch demographic data from the Census Bureau.'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* County Demographics - Show when data is available */}
          {countyData && !isLoadingCountyData && (
            <>
              {/* County Overview */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
                  County Demographics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatNumber(countyData.population)}
                    </div>
                    <div className="text-sm text-blue-800 font-medium">Total Population</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(countyData.medianHouseholdIncome)}
                    </div>
                    <div className="text-sm text-green-800 font-medium">Median Household Income</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {formatCurrency(countyData.medianHomeValue)}
                    </div>
                    <div className="text-sm text-purple-800 font-medium">Median Home Value</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {formatNumber(countyData.bachelorsDegreePop)}
                    </div>
                    <div className="text-sm text-orange-800 font-medium">Bachelor&apos;s Degree+</div>
                  </div>
                </div>
              </section>

              {/* Housing Information */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
                  Housing Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Owner Occupied:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(countyData.ownerOccupiedHousing)} units
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">Renter Occupied:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatNumber(countyData.renterOccupiedHousing)} units
                    </span>
                  </div>
                </div>
              </section>

              {/* County Information */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">
                  County Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">State:</span>
                    <span className="text-sm font-semibold text-gray-900">Texas</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">County Code:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {countyData.stateCode}-{countyData.countyCode}
                    </span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Default Content - Show when no data yet and not loading/error */}
          {!countyData && !isLoadingCountyData && !isCountyDataError && (
            <>
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
                </div>
              </section>

              {/* County Details */}
              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-100 pb-2">County Details</h3>
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-base">
                    {formatCountyName(selectedCounty)} is one of the 254 counties in the state of Texas. 
                    Demographic data is being loaded from the US Census Bureau.
                  </p>
                </div>
              </section>
            </>
          )}

          {/* Action Buttons */}
          <section className="pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer" 
                type="button"
              >
                Learn More
              </button>
              <button 
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer" 
                onClick={onClose} 
                type="button"
              >
                Close Panel
              </button>
            </div>
          </section>

          {/* Data Source */}
          {countyData && (
            <section className="pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  Data source: U.S. Census Bureau, American Community Survey 2022 5-Year Estimates
                </p>
                {isFromCache && (
                  <div className="flex items-center justify-center space-x-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-green-600 font-medium">
                      Loaded from cache ({cacheSize} counties cached)
                    </span>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
} 