'use client';
import useCallForCityInfo from "@/hooks/useCallForCityInfo";
import { useEffect, useRef } from "react";

export default function CityInfo() {
    const hasCalled = useRef(false);
    const { data, isLoading, isError, error, callForCityInfo } = useCallForCityInfo();

    useEffect(() => {
        if(!hasCalled.current) {
            callForCityInfo({ cityName: 'San Francisco', rows: 1, facet: 'state', dataset: 'us-cities-demographics' });
            hasCalled.current = true;
        }
    }, [callForCityInfo]);

    return (
        <div>
            <h1>City Info</h1>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error: {error}</p>}
            {data && <p>Data: {data.name}</p>}
            
            <div>
                {JSON.stringify(data)}
            </div>
        </div>
    );
}