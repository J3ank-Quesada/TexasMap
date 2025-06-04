'use client';
import useCallForCountyInfo from "@/hooks/useCallForCountyInfo";
import { useEffect, useRef } from "react";

export default function CityInfo() {
    const hasCalled = useRef(false);
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        callForCountyInfo, 
        isFromCache, 
        cacheSize,
        getCachedCounties,
        getCacheStats 
    } = useCallForCountyInfo();

    useEffect(() => {
        if(!hasCalled.current) {
            callForCountyInfo({ countyName: 'Harris' });
            hasCalled.current = true;
        }
    }, [callForCountyInfo]);

    const testCache = async () => {
        console.log('🧪 Testing cache with Harris County...');
        await callForCountyInfo({ countyName: 'Harris' });
    };

    const testNewCounty = async () => {
        console.log('🧪 Testing new county (Dallas)...');
        await callForCountyInfo({ countyName: 'Dallas' });
    };

    const cacheStats = getCacheStats();
    const cachedCounties = getCachedCounties();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">County Cache Test</h1>
            
            {/* Cache Status */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Cache Status</h2>
                <p>Cache Size: {cacheSize}</p>
                <p>Is From Cache: {isFromCache ? '✅ Yes' : '❌ No'}</p>
                <p>Cached Counties: {cachedCounties.join(', ') || 'None'}</p>
                <p>Stats: {JSON.stringify(cacheStats, null, 2)}</p>
            </div>

            {/* Test Buttons */}
            <div className="mb-6 space-x-4">
                <button 
                    onClick={testCache}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isLoading}
                >
                    Test Harris County (Should be cached)
                </button>
                <button 
                    onClick={testNewCounty}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    disabled={isLoading}
                >
                    Test Dallas County (New request)
                </button>
            </div>

            {/* Data Display */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Current Data</h2>
                {isLoading && <p className="text-blue-600">Loading...</p>}
                {isError && <p className="text-red-600">Error: {error}</p>}
                {data && (
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p><strong>County:</strong> {data.name}</p>
                        <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
                        <p><strong>Cache Status:</strong> {isFromCache ? '📦 From Cache' : '🌐 From API'}</p>
                    </div>
                )}
            </div>

            {/* Raw Data */}
            <details className="mb-4">
                <summary className="cursor-pointer text-lg font-semibold">Raw Data (Click to expand)</summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </details>
        </div>
    );
}