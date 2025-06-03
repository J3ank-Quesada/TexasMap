import { getCityInfo } from "@/apis/cityInfoAPIs";
import { CityInfo, GetCityInfoData } from "@/types";
import { useCallback } from 'react';
import { useHttpRequest } from "./useHttpRequest";

export default function useCallForCityInfo() {
    const { data, isLoading, isError, error, execute } = useHttpRequest<CityInfo>(
        '',
        { immediate: false }
    );

    const callForCityInfo = useCallback(async ({ cityName = '', rows = 1, facet = 'state', dataset = 'us-cities-demographics' }: GetCityInfoData) => {
        const requestUrl = getCityInfo({ cityName, rows, facet, dataset });
        await execute(requestUrl);
    }, [execute]);

    return { data, isLoading, isError, error, callForCityInfo };
}