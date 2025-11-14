/**
 *
 * @module
 */

/**
 * Represents a numerical value.
 *
 * @property {number} value - The numeric value of the measurement.
 *
 * @example
 * ```ts
 * const distance: ValueInterface = { value: 100 };
 * ```
 * @group Numeric
 */
export interface ValueInterface {
  value: number;
}

/**
 * Type alias representing an angle in **radians**.
 *
 * @typedef {number} Radians
 *
 * @example
 * ```ts
 * const angle: Radians = Math.PI / 2; // 90 degrees in radians
 * ```
 * @group Numeric
 */
export type Radians = number;
