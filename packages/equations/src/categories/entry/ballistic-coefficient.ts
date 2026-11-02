import { assertFinite, assertPositive } from './validate.js';

/**
 * Compute the **ballistic coefficient** of an entry vehicle: how much mass it has per unit of drag.
 *
 * $$
 * \beta = \frac{m}{C_D A}
 * $$
 *
 * Where:
 * - $ m $ is the vehicle's mass (kg)
 * - $ C_D $ is its drag coefficient (dimensionless)
 * - $ A $ is its reference area, usually the frontal area (m²)
 *
 * **Units**
 * - Inputs: `m` in **kg**, `Cd` dimensionless, `A` in **m²**.
 * - Output: $ \beta $ in **kg/m²**.
 *
 * ::: info Notes
 *
 * - A low $ \beta $ slows down high in the thin upper atmosphere; a high $ \beta $ plunges deeper before it slows.
 * - The drag deceleration is $ a = \rho V^2 / (2\beta) $.
 * - Some texts define it the other way up, as $ C_D A / m $. This library uses $ m / (C_D A) $ throughout.
 *
 * :::
 *
 * @param m - Mass $ m $ in **kg** (finite, > 0).
 * @param Cd - Drag coefficient $ C_D $ (finite, > 0).
 * @param A - Reference area $ A $ in **m²** (finite, > 0).
 * @returns Ballistic coefficient $ \beta $ in **kg/m²**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If any input is `<= 0`.
 * @group Entry
 *
 * @example
 * ```ts
 * // A 5000 kg capsule, 3.9 m across, with Cd = 1.3
 * const beta = ballisticCoefficient(5000, 1.3, Math.PI * 1.95 ** 2);
 * // beta ≈ 322 kg/m²
 * ```
 *
 * @see {@link ballisticEntrySpeed}
 * @see https://en.wikipedia.org/wiki/Ballistic_coefficient Ballistic coefficient
 */
export const ballisticCoefficient = (
  m: number,
  Cd: number,
  A: number
): number => {
  const inputs = [
    ['m', m],
    ['Cd', Cd],
    ['A', A]
  ] as const;

  assertFinite(inputs);
  assertPositive(inputs);

  return m / (Cd * A);
};
