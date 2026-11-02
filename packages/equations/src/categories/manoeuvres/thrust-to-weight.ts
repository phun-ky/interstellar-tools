/**
 * Compute the **thrust-to-weight ratio** of a vehicle in a gravity field.
 *
 * $$
 * \frac{T}{W} = \frac{F}{m\, g}
 * $$
 *
 * Where:
 * - $ F $ is the thrust (N)
 * - $ m $ is the vehicle's mass (kg)
 * - $ g $ is the local gravitational acceleration (m/s²)
 *
 * **Units**
 * - Inputs: `F` in **N**, `m` in **kg**, `g` in **m/s²**.
 * - Output: dimensionless ratio.
 *
 * ::: info Notes
 *
 * - A vehicle can only lift off vertically when $ T/W > 1 $.
 * - Use the local $ g $, e.g. $ \mu / r^2 $ for the body you're on, not standard gravity.
 * - The ratio grows during a burn as propellant is used up; pass the current mass.
 *
 * :::
 *
 * ::: practice Apollo 11's lunar module, leaving the Moon
 *
 * **1.94**
 *
 * _Ascent stage at liftoff, in the Moon's 1.62 m/s² gravity_
 *
 * On Earth the same stage would manage only 0.32: too little to lift off.
 *
 * ```ts
 * thrustToWeight(15_409, 4888, 1.624); // ≈ 1.94
 * ```
 *
 * :::
 *
 * @param F - Thrust $ F $ in **N** (finite, >= 0).
 * @param m - Mass $ m $ in **kg** (finite, > 0).
 * @param g - Local gravitational acceleration $ g $ in **m/s²** (finite, > 0).
 * @returns Thrust-to-weight ratio (dimensionless).
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `F < 0`, `m <= 0` or `g <= 0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // A 2000 kg lander with a 45 kN engine on Mars (g ≈ 3.71 m/s²)
 * const tw = thrustToWeight(45_000, 2000, 3.71);
 * // tw ≈ 6.06
 * ```
 *
 * @see {@link massFlowRate}
 */
export const thrustToWeight = (F: number, m: number, g: number): number => {
  for (const [name, v] of [
    ['F', F],
    ['m', m],
    ['g', g]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (F < 0) throw new RangeError(`F must be >= 0. Received: ${F}`);

  if (m <= 0) throw new RangeError(`m must be > 0. Received: ${m}`);

  if (g <= 0) throw new RangeError(`g must be > 0. Received: ${g}`);

  return F / (m * g);
};
