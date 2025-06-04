/**
 * County utility functions
 * 
 * Provides helper functions for county-related operations
 */

/**
 * Formats county name for display
 * @param countyName - Raw county name from SVG
 * @returns Formatted county name with "County" suffix
 */
export const formatCountyName = (countyName: string): string => {
  // Handle special cases like "Red River" and "Deaf Smith"
  if (countyName.includes(' ')) {
    return `${countyName} County`;
  }
  return `${countyName} County`;
};

/**
 * Validates if a county name is valid
 * @param countyName - County name to validate
 * @returns True if county name is valid
 */
export const isValidCountyName = (countyName: string): boolean => {
  return Boolean(countyName && countyName.trim().length > 0);
};

/**
 * Normalizes county name for comparison
 * @param countyName - County name to normalize
 * @returns Normalized county name
 */
export const normalizeCountyName = (countyName: string): string => {
  return countyName.toLowerCase().trim();
};

/**
 * Extracts county name without "County" suffix
 * @param fullCountyName - Full county name with suffix
 * @returns County name without suffix
 */
export const extractCountyName = (fullCountyName: string): string => {
  return fullCountyName.replace(/\s+County$/i, '').trim();
}; 