/**
 * Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using specific impulse.
 *
 * $$
 * \Delta v = g_0 I_{sp}\ln\!\left(\frac{m_0}{m_f}\right)
 * $$
 *
 * Where:
 * - $ I_{sp} $ is the specific impulse (s)
 * - $ g_0 $ is standard gravity (m/s²)
 * - $ m_0 $ is initial (wet) mass before the burn (kg)
 * - $ m_f $ is final (dry / post-burn) mass after the burn (kg)
 *
 * **Units**
 * - Inputs: `Isp` in **s**, `g0` in **m/s²**, masses in **kg**.
 * - Output: $ \Delta v $ in **m/s**.
 *
 * ::: info Notes
 *
 * - This is the **ideal** rocket equation (no gravity/drag losses, finite burn effects, steering losses, etc.).
 * - `g0` defaults to **9.80665 m/s²** (standard gravity).
 * - Requires `mf < m0` to yield a positive delta-v.
 *
 * :::
 *
 * @param Isp - Specific impulse $ I_{sp} $ in **seconds** (finite, > 0).
 * @param m0 - Initial mass $ m_0 $ in **kg** (finite, > 0).
 * @param mf - Final mass $ m_f $ in **kg** (finite, > 0 and < `m0`).
 * @param g0 - Standard gravity $ g_0 $ in **m/s²** (finite, > 0). Defaults to `9.80665`.
 * @returns Ideal delta-v $ \Delta v $ in **m/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `Isp <= 0`, `g0 <= 0`, `m0 <= 0`, `mf <= 0`, or `mf >= m0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // Example:
 * // Isp = 320 s, m0 = 1200 kg, mf = 800 kg
 * const dv = rocketDeltaVFromIsp(320, 1200, 800);
 * // dv ≈ 9.80665 * 320 * ln(1200/800) ≈ 1270 m/s
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation Tsiolkovsky rocket equation (background and derivation)
 */
export const rocketDeltaVFromIsp = (
  Isp: number,
  m0: number,
  mf: number,
  g0 = 9.80665
): number => {
  for (const [name, v] of [
    ['Isp', Isp],
    ['m0', m0],
    ['mf', mf],
    ['g0', g0]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (Isp <= 0) throw new RangeError(`Isp must be > 0. Received: ${Isp}`);

  if (g0 <= 0) throw new RangeError(`g0 must be > 0. Received: ${g0}`);

  if (m0 <= 0) throw new RangeError(`m0 must be > 0. Received: ${m0}`);

  if (mf <= 0) throw new RangeError(`mf must be > 0. Received: ${mf}`);

  if (mf >= m0)
    throw new RangeError(`mf must be < m0. Received: mf=${mf}, m0=${m0}`);

  return g0 * Isp * Math.log(m0 / mf);
};
