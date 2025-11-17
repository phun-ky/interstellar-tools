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
 * **Angle in radians** (branded nominal type).
 *
 * **Relations**
 *
 * $$
 * \pi\ \mathrm{rad}=180^\circ,\qquad
 * 1\ \mathrm{rad}=\frac{\text{arc length}}{\text{radius}}
 * $$
 *
 * **Why branded?**
 * This type brands a `number` to prevent accidentally mixing **degrees** and **radians**
 * at compile time. You must construct it explicitly (e.g., via a small factory or cast).
 *
 * **Units**
 * - Stored as a JavaScript `number` whose unit is **radians** (dimensionless).
 *
 * @example
 * ```ts
 * // Construct with an explicit cast or small factory
 * const halfTurn: Radians = Math.PI as Radians;
 *
 * // Function expecting radians
 * function usesRadians(nu: Radians) { …}
 * usesRadians(halfTurn);
 * // usesRadians(180 as number);   // avoid passing degrees as a plain number
 * ```
 *
 * @example
 * ```ts
 * // Optional helper factory (recommended pattern)
 * const rad = (x: number): Radians => x as Radians;
 * const quarter: Radians = rad(Math.PI / 2);
 * ```
 *
 * @see flightPathAngleFromTrueAnomaly - accepts `nu: Radians`
 * @group Numeric
 */
export type Radians = number & { readonly __unit: 'radians' };

/**
 * **Angle in degrees** (branded nominal type).
 *
 * **Relations**
 *
 * $$
 * 180^\circ=\pi\ \mathrm{rad},\qquad
 * \text{deg}\to\text{rad}:~\theta_\mathrm{rad}=\theta_\mathrm{deg}\,\frac{\pi}{180},\qquad
 * \text{rad}\to\text{deg}:~\theta_\mathrm{deg}=\theta_\mathrm{rad}\,\frac{180}{\pi}
 * $$
 *
 * **Why branded?**
 * Brands a `number` to prevent accidentally mixing **degrees** and **radians**
 * at compile time. Construct explicitly (via a helper or cast).
 *
 * **Units**
 * - Stored as a JavaScript `number` whose unit is **degrees** (dimensionless).
 *
 * @example
 * ```ts
 * // Simple factory (recommended)
 * const deg = (x: number): DegreesType => x as DegreesType;
 * const rightAngle: DegreesType = deg(90);
 * ```
 *
 * @example
 * ```ts
 * // Converting to radians (using your own helper)
 * type Radians = number & { readonly __unit: 'radians' };
 * const toRadians = (d: DegreesType): Radians => ((d as number) * Math.PI / 180) as Radians;
 *
 * const heading: DegreesType = (45 as DegreesType);
 * const headingRad: Radians = toRadians(heading);
 * ```
 *
 * @see Radians - branded type for angles in radians
 * @group Numeric
 */
export type DegreesType = number & { readonly __unit: 'degrees' };
