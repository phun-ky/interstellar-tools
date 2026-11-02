/**
 * Compute the **thrust** of a rocket engine from its exhaust, including the pressure term.
 *
 * $$
 * F = \dot m\, v_e + (p_e - p_a)\, A_e
 * $$
 *
 * Where:
 * - $ \dot m $ is the mass flow rate (kg/s)
 * - $ v_e $ is the exhaust velocity at the nozzle exit (m/s)
 * - $ p_e $ is the pressure at the nozzle exit (Pa)
 * - $ p_a $ is the ambient pressure (Pa), 0 in vacuum
 * - $ A_e $ is the nozzle exit area (m²)
 *
 * **Units**
 * - Inputs: `mDot` in **kg/s**, `ve` in **m/s**, `pe` and `pa` in **Pa**, `Ae` in **m²**.
 * - Output: $ F $ in **N**.
 *
 * ::: info Notes
 *
 * - The same engine gives more thrust in vacuum than at sea level: $ p_a $ pushes back on the nozzle exit.
 * - A nozzle with $ p_e < p_a $ is over-expanded, and the pressure term reduces the thrust.
 * - With $ p_e = p_a $ the thrust is $ \dot m\, v_e $, and $ v_e $ equals $ I_{sp}\, g_0 $.
 *
 * :::
 *
 * @param mDot - Mass flow rate $ \dot m $ in **kg/s** (finite, >= 0).
 * @param ve - Exhaust velocity $ v_e $ in **m/s** (finite, >= 0).
 * @param pe - Nozzle exit pressure $ p_e $ in **Pa** (finite, >= 0).
 * @param pa - Ambient pressure $ p_a $ in **Pa** (finite, >= 0).
 * @param Ae - Nozzle exit area $ A_e $ in **m²** (finite, >= 0).
 * @returns Thrust $ F $ in **N**. Can be negative for a badly over-expanded nozzle with little flow.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If any input is negative.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // 250 kg/s at 3000 m/s, exit at 70 kPa through a 1.2 m² nozzle
 * const vacuum = rocketThrust(250, 3000, 70_000, 0, 1.2); // 834 000 N
 * const seaLevel = rocketThrust(250, 3000, 70_000, 101_325, 1.2); // ≈ 712 410 N
 * ```
 *
 * @see {@link massFlowRate}
 * @see https://en.wikipedia.org/wiki/Rocket_engine_nozzle Rocket engine nozzle (thrust equation)
 */
export const rocketThrust = (
  mDot: number,
  ve: number,
  pe: number,
  pa: number,
  Ae: number
): number => {
  for (const [name, v] of [
    ['mDot', mDot],
    ['ve', ve],
    ['pe', pe],
    ['pa', pa],
    ['Ae', Ae]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);

    if (v < 0) throw new RangeError(`${name} must be >= 0. Received: ${v}`);
  }

  return mDot * ve + (pe - pa) * Ae;
};
