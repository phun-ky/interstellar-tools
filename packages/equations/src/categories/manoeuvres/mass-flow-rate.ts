/**
 * Compute the **mass flow rate** of a rocket engine from its thrust and specific impulse.
 *
 * $$
 * \dot m = \frac{F}{I_{sp}\, g_0}
 * $$
 *
 * Where:
 * - $ F $ is the thrust (N)
 * - $ I_{sp} $ is the specific impulse (s)
 * - $ g_0 $ is standard gravity (m/s²)
 *
 * **Units**
 * - Inputs: `F` in **N**, `Isp` in **s**, `g0` in **m/s²**.
 * - Output: $ \dot m $ in **kg/s**.
 *
 * ::: info Notes
 *
 * - $ I_{sp}\, g_0 $ is the effective exhaust velocity $ v_e $, so this is $ F = \dot m\, v_e $ solved for $ \dot m $.
 * - `g0` defaults to **9.80665 m/s²** (standard gravity). It converts the units of $ I_{sp} $; it is not the local gravity.
 *
 * :::
 *
 * ::: practice Apollo 11's lunar module, leaving the Moon
 *
 * **5.09 kg/s**
 *
 * _Ascent engine, 15 409 N at 309 s_
 *
 * The ascent stage burned about 5 kg of propellant a second for its 7-minute climb to lunar orbit.
 *
 * ```ts
 * massFlowRate(15_409, 309); // ≈ 5.085 kg/s
 * ```
 *
 * :::
 *
 * @param F - Thrust $ F $ in **N** (finite, > 0).
 * @param Isp - Specific impulse $ I_{sp} $ in **seconds** (finite, > 0).
 * @param g0 - Standard gravity $ g_0 $ in **m/s²** (finite, > 0). Defaults to `9.80665`.
 * @returns Mass flow rate $ \dot m $ in **kg/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `F <= 0`, `Isp <= 0` or `g0 <= 0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // A 1 kN thruster with Isp = 300 s
 * const mDot = massFlowRate(1000, 300);
 * // mDot ≈ 1000 / (300 * 9.80665) ≈ 0.340 kg/s
 * ```
 *
 * @see {@link burnTime}
 * @see {@link rocketThrust}
 */
export const massFlowRate = (F: number, Isp: number, g0 = 9.80665): number => {
  for (const [name, v] of [
    ['F', F],
    ['Isp', Isp],
    ['g0', g0]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (F <= 0) throw new RangeError(`F must be > 0. Received: ${F}`);

  if (Isp <= 0) throw new RangeError(`Isp must be > 0. Received: ${Isp}`);

  if (g0 <= 0) throw new RangeError(`g0 must be > 0. Received: ${g0}`);

  return F / (Isp * g0);
};
