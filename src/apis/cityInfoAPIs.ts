import { GetCityInfoData } from "@/types";

export function getCityInfo({ cityName = '', rows = 1, facet = 'state', dataset = 'us-cities-demographics' }: GetCityInfoData) {
    return `https://public.opendatasoft.com/api/records/1.0/search/?dataset=${dataset}&q=${cityName}&rows=${rows}&facet=${facet}`;
}
