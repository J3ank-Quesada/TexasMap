export interface CityInfo {
    name: string;
    country: string;
    population: number;
    area: number;
    populationDensity: number;
}


export interface GetCityInfoData {
    cityName: string;
    rows: number;
    facet: string;
    dataset: string;
}