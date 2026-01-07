import type { Radians } from '@interstellar-tools/types';

/**
 * Convert **degrees → radians**.
 *
 * Uses the standard relation:
 * $$
 * \pi\ \text{rad} = 180^\circ
 * $$
 *
 * @param deg - Angle in **degrees**.
 * @returns Angle in **radians** (branded as {@link Radians}).
 * @group Helpers
 *
 * @example
 * ```ts
 * const halfTurn = toRad(180); // π (Radians)
 * const rightAngle = toRad(90); // π/2 (Radians)
 * ```
 */
export const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

/**
 * Brand a numeric value as {@link Radians}.
 *
 * This is a **type-level** helper only: it does not change the runtime value, but it
 * prevents accidentally mixing degree-values with radian-values at compile time.
 *
 * Use this when you already have a value in radians (e.g., from `Math.atan2`, `Math.PI`,
 * or your own radian-based computations) and want to pass it to APIs that require `Radians`.
 *
 * @param x - Angle value already expressed in **radians**.
 * @returns The same numeric value, branded as {@link Radians}.
 * @group Helpers
 *
 * @example
 * ```ts
 * const theta = rad(Math.PI / 3);
 * // theta has type Radians
 * ```
 */
export const rad = (x: number): Radians => x as Radians;
