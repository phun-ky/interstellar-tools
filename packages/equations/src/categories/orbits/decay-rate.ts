/**
 * How much a near-circular orbit **sinks in one revolution** under
 * atmospheric drag: the change in its semi-major axis per orbit.
 *
 * $$
 * \Delta a_{\text{rev}} \approx -2\pi\,\frac{\rho\,a^2}{\beta}
 * $$
 *
 * Where:
 * - $ \rho $ is the air density at the orbit's height (kg/m³), from {@link exponentialAtmosphereDensity} or `nrlmsise00`
 * - $ a $ is the semi-major axis (m)
 * - $ \beta = m / (C_D A) $ is the ballistic coefficient (kg/m²), from {@link ballisticCoefficient}
 *
 * **Units**
 * - Inputs: `a` in **m**, `beta` in **kg/m²**, `rho` in **kg/m³**.
 * - Output: $ \Delta a_{\text{rev}} $ in **m**, negative: the orbit sinks.
 *
 * ::: info Notes
 *
 * - Drag takes energy out of the orbit, so it shrinks; the satellite speeds
 *   up as it sinks, into denser air, so the decay runs away near the end.
 * - For a near-circular orbit, with the density at its height. An
 *   elliptical orbit loses most of its height at apogee, as drag at perigee
 *   circularises it.
 * - Per unit time, divide by the period: $ \dot a = -\rho\sqrt{\mu a}/\beta $.
 *
 * :::
 *
 * @param a - Semi-major axis $ a $ in **m** (finite, > 0).
 * @param beta - Ballistic coefficient $ \beta $ in **kg/m²** (finite, > 0).
 * @param rho - Air density $ \rho $ in **kg/m³** (finite, >= 0).
 * @returns The change in semi-major axis per revolution $ \Delta a_{\text{rev}} $ in **m**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `a` or `beta` is not > 0, or `rho < 0`.
 * @group Orbits
 *
 * @example
 * ```ts
 * // A 1U CubeSat, β ≈ 60 kg/m², 400 km up
 * const rho = exponentialAtmosphereDensity(400_000);
 *
 * decayRate(6_778_137, ballisticCoefficient(1.33, 2.2, 0.01), rho); // ≈ -17.8 m an orbit
 * ```
 *
 * @see {@link estimateLifetime}
 * @see {@link atmosphericDragAcceleration}
 */
export const decayRate = (a: number, beta: number, rho: number): number => {
  for (const [name, x] of [
    ['a', a],
    ['beta', beta],
    ['rho', rho]
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  for (const [name, x] of [
    ['a', a],
    ['beta', beta]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  if (rho < 0) throw new RangeError(`rho must be >= 0. Received: ${rho}`);

  return (-2 * Math.PI * rho * a * a) / beta;
};
