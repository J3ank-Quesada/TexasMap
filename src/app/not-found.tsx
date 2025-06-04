import Link from 'next/link';
import React from 'react';

/**
 * Custom 404 Not Found Page
 * 
 * Displays when users navigate to a non-existent route
 * Provides navigation options to get back to the main application
 * 
 * @returns {React.JSX.Element} The 404 not found page
 */
export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
          <div className="text-6xl mb-4">🗺️</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            County Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Looks like you&apos;ve wandered off the Texas map! 
            This page doesn&apos;t exist in any of our 254 counties.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            🎯 Explore Texas Counties
          </Link>
          
          
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help finding your way? Try exploring our interactive map of all Texas counties.
          </p>
        </div>

      </div>
    </div>
  );
} 