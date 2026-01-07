/**
 * Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using effective exhaust velocity.
 *
 * $$
 * \Delta v = v_e \ln\!\left(\frac{m_0}{m_f}\right)
 * $$
 *
 * Where:
 * - $ v_e $ is the effective exhaust velocity (m/s)
 * - $ m_0 $ is initial (wet) mass before the burn (kg)
 * - $ m_f $ is final (dry / post-burn) mass after the burn (kg)
 *
 * **Units**
 * - Inputs: `ve` in **m/s**, masses in **kg**.
 * - Output: $\Delta v$ in **m/s**.
 *
 * ::: info Notes
 *
 * - This is the **ideal** rocket equation (no gravity/drag losses, finite burn effects, steering losses, etc.).
 * - Requires `mf < m0` to yield a positive delta-v.
 * - Relationship to specific impulse: $v_e = g_0 I_{sp}$.
 *
 * :::
 *
 * @param ve - Effective exhaust velocity $ v_e $ in **m/s** (finite, > 0).
 * @param m0 - Initial mass $ m_0 $ in **kg** (finite, > 0).
 * @param mf - Final mass $ m_f $ in **kg** (finite, > 0 and < `m0`).
 * @returns Ideal delta-v $ \Delta v $ in **m/s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `ve <= 0`, `m0 <= 0`, `mf <= 0`, or `mf >= m0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // Example:
 * // ve = 3100 m/s, m0 = 1200 kg, mf = 800 kg
 * const dv = rocketDeltaVFromVe(3100, 1200, 800);
 * // dv ≈ 3100 * ln(1200/800) ≈ 1256 m/s
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation Tsiolkovsky rocket equation (background and derivation)
 */
export const rocketDeltaVFromVe = (
  ve: number,
  m0: number,
  mf: number
): number => {
  for (const [name, v] of [
    ['ve', ve],
    ['m0', m0],
    ['mf', mf]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (ve <= 0) throw new RangeError(`ve must be > 0. Received: ${ve}`);

  if (m0 <= 0) throw new RangeError(`m0 must be > 0. Received: ${m0}`);

  if (mf <= 0) throw new RangeError(`mf must be > 0. Received: ${mf}`);

  if (mf >= m0)
    throw new RangeError(`mf must be < m0. Received: mf=${mf}, m0=${m0}`);

  return ve * Math.log(m0 / mf);
};
