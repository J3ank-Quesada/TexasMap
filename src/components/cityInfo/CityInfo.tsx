'use client';
import useCallForCountyInfo from "@/hooks/useCallForCountyInfo";
import { useEffect, useRef } from "react";

export default function CityInfo() {
    const hasCalled = useRef(false);
    const { data, isLoading, isError, error, callForCountyInfo, isFromCache, cacheSize } = useCallForCountyInfo();

    useEffect(() => {
        if(!hasCalled.current) {
            callForCountyInfo({ countyName: 'Harris' });
            hasCalled.current = true;
        }
    }, [callForCountyInfo]);

    return (
        <div>
            <h1>County Info Test</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error}</p>}
            {data && (
                <div>
                    <p>County: {data.name}</p>
                    <p>Population: {data.population.toLocaleString()}</p>
                    <p>Cache Status: {isFromCache ? 'From Cache' : 'From API'}</p>
                    <p>Cache Size: {cacheSize}</p>
                </div>
            )}
            
            <div>
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        </div>
    );
}