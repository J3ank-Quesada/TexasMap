import { CountyInfo, GetCountyInfoData } from "@/types";

/**
 * Texas County Name to FIPS Code mapping
 * FIPS format: 48XXX where 48 is Texas state code
 */
const TEXAS_COUNTY_FIPS: Record<string, string> = {
    'Anderson': '001',    'Andrews': '003',      'Angelina': '005',     'Aransas': '007',
    'Archer': '009',      'Armstrong': '011',    'Atascosa': '013',     'Austin': '015',
    'Bailey': '017',      'Bandera': '019',      'Bastrop': '021',      'Baylor': '023',
    'Bee': '025',         'Bell': '027',         'Bexar': '029',        'Blanco': '031',
    'Borden': '033',      'Bosque': '035',       'Bowie': '037',        'Brazoria': '039',
    'Brazos': '041',      'Brewster': '043',     'Briscoe': '045',      'Brooks': '047',
    'Brown': '049',       'Burleson': '051',     'Burnet': '053',       'Caldwell': '055',
    'Calhoun': '057',     'Callahan': '059',     'Cameron': '061',      'Camp': '063',
    'Carson': '065',      'Cass': '067',         'Castro': '069',       'Chambers': '071',
    'Cherokee': '073',    'Childress': '075',    'Clay': '077',         'Cochran': '079',
    'Coke': '081',        'Coleman': '083',      'Collin': '085',       'Collingsworth': '087',
    'Colorado': '089',    'Comal': '091',        'Comanche': '093',     'Concho': '095',
    'Cooke': '097',       'Coryell': '099',      'Cottle': '101',       'Crane': '103',
    'Crockett': '105',    'Crosby': '107',       'Culberson': '109',    'Dallam': '111',
    'Dallas': '113',      'Dawson': '115',       'Deaf Smith': '117',   'Delta': '119',
    'Denton': '121',      'DeWitt': '123',       'Dickens': '125',      'Dimmit': '127',
    'Donley': '129',      'Duval': '131',        'Eastland': '133',     'Ector': '135',
    'Edwards': '137',     'Ellis': '139',        'El Paso': '141',      'Erath': '143',
    'Falls': '145',       'Fannin': '147',       'Fayette': '149',      'Fisher': '151',
    'Floyd': '153',       'Foard': '155',        'Fort Bend': '157',    'Franklin': '159',
    'Freestone': '161',   'Frio': '163',         'Gaines': '165',       'Galveston': '167',
    'Garza': '169',       'Gillespie': '171',    'Glasscock': '173',    'Goliad': '175',
    'Gonzales': '177',    'Gray': '179',         'Grayson': '181',      'Gregg': '183',
    'Grimes': '185',      'Guadalupe': '187',    'Hale': '189',         'Hall': '191',
    'Hamilton': '193',    'Hansford': '195',     'Hardeman': '197',     'Hardin': '199',
    'Harris': '201',      'Harrison': '203',     'Hartley': '205',      'Haskell': '207',
    'Hays': '209',        'Hemphill': '211',     'Henderson': '213',    'Hidalgo': '215',
    'Hill': '217',        'Hockley': '219',      'Hood': '221',         'Hopkins': '223',
    'Houston': '225',     'Howard': '227',       'Hudspeth': '229',     'Hunt': '231',
    'Hutchinson': '233',  'Irion': '235',        'Jack': '237',         'Jackson': '239',
    'Jasper': '241',      'Jeff Davis': '243',   'Jefferson': '245',    'Jim Hogg': '247',
    'Jim Wells': '249',   'Johnson': '251',      'Jones': '253',        'Karnes': '255',
    'Kaufman': '257',     'Kendall': '259',      'Kenedy': '261',       'Kent': '263',
    'Kerr': '265',        'Kimble': '267',       'King': '269',         'Kinney': '271',
    'Kleberg': '273',     'Knox': '275',         'Lamar': '277',        'Lamb': '279',
    'Lampasas': '281',    'LaSalle': '283',      'Lavaca': '285',       'Lee': '287',
    'Leon': '289',        'Liberty': '291',      'Limestone': '293',    'Lipscomb': '295',
    'Live Oak': '297',    'Llano': '299',        'Loving': '301',       'Lubbock': '303',
    'Lynn': '305',        'McCulloch': '307',    'McLennan': '309',     'McMullen': '311',
    'Madison': '313',     'Marion': '315',       'Martin': '317',       'Mason': '319',
    'Matagorda': '321',   'Maverick': '323',     'Medina': '325',       'Menard': '327',
    'Midland': '329',     'Milam': '331',        'Mills': '333',        'Mitchell': '335',
    'Montague': '337',    'Montgomery': '339',   'Moore': '341',        'Morris': '343',
    'Motley': '345',      'Nacogdoches': '347',  'Navarro': '349',      'Newton': '351',
    'Nolan': '353',       'Nueces': '355',       'Ochiltree': '357',    'Oldham': '359',
    'Orange': '361',      'Palo Pinto': '363',   'Panola': '365',       'Parker': '367',
    'Parmer': '369',      'Pecos': '371',        'Polk': '373',         'Potter': '375',
    'Presidio': '377',    'Rains': '379',        'Randall': '381',      'Reagan': '383',
    'Real': '385',        'Red River': '387',    'Reeves': '389',       'Refugio': '391',
    'Roberts': '393',     'Robertson': '395',    'Rockwall': '397',     'Runnels': '399',
    'Rusk': '401',        'Sabine': '403',       'San Augustine': '405', 'San Jacinto': '407',
    'San Patricio': '409', 'San Saba': '411',    'Schleicher': '413',   'Scurry': '415',
    'Shackelford': '417', 'Shelby': '419',       'Sherman': '421',      'Smith': '423',
    'Somervell': '425',   'Starr': '427',        'Stephens': '429',     'Sterling': '431',
    'Stonewall': '433',   'Sutton': '435',       'Swisher': '437',      'Tarrant': '439',
    'Taylor': '441',      'Terrell': '443',      'Terry': '445',        'Throckmorton': '447',
    'Titus': '449',       'Tom Green': '451',    'Travis': '453',       'Trinity': '455',
    'Tyler': '457',       'Upshur': '459',       'Upton': '461',        'Uvalde': '463',
    'Val Verde': '465',   'Van Zandt': '467',    'Victoria': '469',     'Walker': '471',
    'Waller': '473',      'Ward': '475',         'Washington': '477',   'Webb': '479',
    'Wharton': '481',     'Wheeler': '483',      'Wichita': '485',      'Wilbarger': '487',
    'Willacy': '489',     'Williamson': '491',   'Wilson': '493',       'Winkler': '495',
    'Wise': '497',        'Wood': '499',         'Yoakum': '501',       'Young': '503',
    'Zapata': '505',      'Zavala': '507'
};

/**
 * Get county information from US Census Bureau API for a specific county
 * @param countyName - Name of the county (e.g., "Harris", "Dallas")
 * @returns Census API URL for specific county demographic data
 */
export function getCountyInfo({ countyName }: GetCountyInfoData): string {
    // Find FIPS code for the county (case-insensitive lookup)
    const normalizedCountyName = Object.keys(TEXAS_COUNTY_FIPS).find(
        key => key.toLowerCase() === countyName.toLowerCase()
    );
    
    if (!normalizedCountyName) {
        throw new Error(`County '${countyName}' not found in Texas. Please check the spelling.`);
    }
    
    const fipsCode = TEXAS_COUNTY_FIPS[normalizedCountyName];
    
    // Get key demographic variables: NAME, Population, Median Household Income, etc.
    const variables = [
        'NAME',           // County name
        'B01001_001E',    // Total population
        'B19013_001E',    // Median household income
        'B25077_001E',    // Median home value
        'B08303_001E',    // Total commute time
        'B15003_022E',    // Bachelor's degree
        'B25003_002E',    // Owner occupied housing units
        'B25003_003E'     // Renter occupied housing units
    ].join(',');
    
    return `https://api.census.gov/data/2022/acs/acs5?get=${variables}&for=county:${fipsCode}&in=state:48`;
}

/**
 * Process Census API response for a single county
 * @param data - Raw Census API response (array of arrays format)
 * @returns Processed county data or null if invalid
 */
export function processCensusData(data: string[][]): CountyInfo | null {
    if (!data || data.length < 2) return null;
    
    // For single county requests, we expect exactly 2 rows: headers + data
    const countyRow = data[1];
    
    if (!countyRow || countyRow.length < 10) return null;
    
    // Create object with meaningful property names
    const countyData: CountyInfo = {
        name: countyRow[0],
        population: parseInt(countyRow[1]) || 0,
        medianHouseholdIncome: parseInt(countyRow[2]) || 0,
        medianHomeValue: parseInt(countyRow[3]) || 0,
        totalCommuteTime: parseInt(countyRow[4]) || 0,
        bachelorsDegreePop: parseInt(countyRow[5]) || 0,
        ownerOccupiedHousing: parseInt(countyRow[6]) || 0,
        renterOccupiedHousing: parseInt(countyRow[7]) || 0,
        stateCode: countyRow[8],
        countyCode: countyRow[9]
    };
    
    return countyData;
}

/**
 * Get list of all available Texas county names
 * @returns Array of all Texas county names
 */
export function getAvailableCounties(): string[] {
    return Object.keys(TEXAS_COUNTY_FIPS).sort();
}
