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

/**
 * County information structure from US Census Bureau API
 */
export interface CountyInfo {
    name: string;
    population: number;
    medianHouseholdIncome: number;
    medianHomeValue: number;
    totalCommuteTime: number;
    bachelorsDegreePop: number;
    ownerOccupiedHousing: number;
    renterOccupiedHousing: number;
    stateCode: string;
    countyCode: string;
}

/**
 * Parameters for fetching county information
 */
export interface GetCountyInfoData {
    countyName: string;
}