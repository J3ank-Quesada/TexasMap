/**
 * Map styling utilities
 * 
 * Provides functions for styling SVG map elements
 */

/**
 * County style configuration
 */
export const COUNTY_STYLES = {
  default: {
    fill: '#e6f3ff',
    stroke: '#0066cc',
    strokeWidth: '1',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  hover: {
    fill: '#b3d9ff',
    stroke: '#004499',
    strokeWidth: '2',
    filter: 'drop-shadow(0 2px 4px rgba(0, 102, 204, 0.3))'
  },
  selected: {
    fill: '#ff6b35',
    stroke: '#cc5500',
    strokeWidth: '3',
    filter: 'drop-shadow(0 4px 8px rgba(255, 107, 53, 0.4))'
  }
} as const;

/**
 * Applies styles to an SVG element
 * @param element - SVG element to style
 * @param styles - Style object to apply
 */
export const applyStylesToElement = (element: SVGElement, styles: Record<string, string>): void => {
  Object.entries(styles).forEach(([property, value]) => {
    if (property === 'strokeWidth') {
      element.style.setProperty('stroke-width', value);
    } else {
      element.style.setProperty(property, value);
    }
  });
};

/**
 * Sets default styles for a county path
 * @param county - SVG path element
 */
export const setDefaultCountyStyles = (county: SVGElement): void => {
  applyStylesToElement(county, COUNTY_STYLES.default);
};

/**
 * Sets hover styles for a county path
 * @param county - SVG path element
 */
export const setHoverCountyStyles = (county: SVGElement): void => {
  applyStylesToElement(county, COUNTY_STYLES.hover);
};

/**
 * Sets selected styles for a county path
 * @param county - SVG path element
 */
export const setSelectedCountyStyles = (county: SVGElement): void => {
  applyStylesToElement(county, COUNTY_STYLES.selected);
};

/**
 * Resets all counties to default styles
 * @param counties - NodeList of county elements
 */
export const resetAllCountiesToDefault = (counties: NodeListOf<Element>): void => {
  counties.forEach((county) => {
    setDefaultCountyStyles(county as SVGElement);
  });
};

/**
 * Removes all styling from an element
 * @param element - SVG element to reset
 */
export const removeAllStyles = (element: SVGElement): void => {
  element.style.cssText = '';
}; 