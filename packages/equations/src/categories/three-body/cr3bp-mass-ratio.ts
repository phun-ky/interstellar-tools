/**
 * Compute the **mass ratio** $ \mu $ of the circular restricted three-body problem.
 *
 * $$
 * \mu = \frac{m_2}{m_1 + m_2}
 * $$
 *
 * Where:
 * - $ m_1 $ is the larger body's mass, $ m_2 $ the smaller's
 *
 * **Units**
 * - Inputs: `m1` and `m2` in the same unit: kg, or gravitational parameters in m³/s² (the ratio is the same).
 * - Output: $ \mu $, dimensionless, in (0, 0.5].
 *
 * ::: info Notes
 *
 * - In the normalised rotating frame, the larger body sits at $ x = -\mu $ and the smaller at $ x = 1 - \mu $; their centre of mass is the origin.
 * - Earth–Moon: $ \mu \approx 0.01215 $. Sun–Earth: $ \mu \approx 3.0 \times 10^{-6} $. Sun–Jupiter: $ \mu \approx 9.5 \times 10^{-4} $.
 * - The Lagrange points L4 and L5 are stable for $ \mu < 0.0385 $.
 *
 * :::
 *
 * @param m1 - Mass (or gravitational parameter) of the larger body (finite, > 0).
 * @param m2 - Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`).
 * @returns The mass ratio $ \mu $.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `m1 <= 0`, `m2 <= 0` or `m2 > m1`.
 * @group Three-body
 *
 * @example
 * ```ts
 * // Earth and Moon, from their gravitational parameters
 * cr3bpMassRatio(3.986004418e14, 4.902800118e12); // ≈ 0.012151
 * ```
 *
 * @see {@link cr3bpUnits}
 * @see {@link cr3bpDerivatives}
 */
export const cr3bpMassRatio = (m1: number, m2: number): number => {
  for (const [name, x] of [
    ['m1', m1],
    ['m2', m2]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
  }

  if (m2 > m1)
    throw new RangeError(
      `m2 must be the smaller body: m2 <= m1. Received: m1 = ${m1}, m2 = ${m2}`
    );

  return m2 / (m1 + m2);
};
