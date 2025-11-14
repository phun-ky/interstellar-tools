const EPSILON = 1e-15; // Increased tolerance for high eccentricity

/**
 * Compares two floating-point numbers for equality within a tolerance.
 *
 * @param {number} a - First number to compare.
 * @param {number} b - Second number to compare.
 * @param {number} [epsilon=EPSILON] - Tolerance for floating-point precision.
 * @returns {boolean} `true` if values are approximately equal.
 */
export const areEqual = (
  a: number,
  b: number,
  epsilon: number = EPSILON
): boolean => {
  return Math.abs(a - b) < epsilon * Math.max(1, Math.abs(a), Math.abs(b));
};
