/**
 * Compute the **mass needed at ignition** to give a final mass a delta-v: the rocket equation solved for $ m_0 $.
 *
 * $$
 * m_0 = m_f\, e^{\Delta v/(I_{sp}\, g_0)}
 * $$
 *
 * Where:
 * - $ m_f $ is the mass left after the burn (kg)
 * - $ \Delta v $ is the delta-v of the burn (m/s)
 * - $ I_{sp} $ is the specific impulse (s)
 * - $ g_0 $ is standard gravity (m/s²)
 *
 * **Units**
 * - Inputs: `mf` in **kg**, `dv` in **m/s**, `Isp` in **s**, `g0` in **m/s²**.
 * - Output: $ m_0 $ in **kg**.
 *
 * ::: info Notes
 *
 * - The factor $ e^{\Delta v/(I_{sp} g_0)} $ is the price of the burn: every kilogram left after it costs that many kilograms before it.
 * - For a sequence of burns, work backwards from the last one: each burn's $ m_0 $ is the previous burn's $ m_f $.
 * - This is the ideal rocket equation: the result counts propellant, not the tanks and engines that hold and burn it.
 *
 * :::
 *
 * ::: practice Apollo 11's lunar module, before landing
 *
 * **9 905 kg**
 *
 * _To land with a 4 888 kg ascent stage, for 2 112.3 m/s at 305 s_
 *
 * The real lunar module weighed 15 279 kg at undocking: the rest is the descent stage's own structure, engine and legs.
 *
 * ```ts
 * initialMassForDeltaV(4888, 2112.3, 305); // ≈ 9905 kg
 * ```
 *
 * :::
 *
 * @param mf - Mass after the burn $ m_f $ in **kg** (finite, > 0).
 * @param dv - Delta-v of the burn $ \Delta v $ in **m/s** (finite, >= 0).
 * @param Isp - Specific impulse $ I_{sp} $ in **seconds** (finite, > 0).
 * @param g0 - Standard gravity $ g_0 $ in **m/s²** (finite, > 0). Defaults to `9.80665`.
 * @returns Mass at ignition $ m_0 $ in **kg**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `mf <= 0`, `dv < 0`, `Isp <= 0` or `g0 <= 0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * // 800 kg left after a 1270 m/s burn at Isp = 320 s
 * const m0 = initialMassForDeltaV(800, 1270, 320);
 * // m0 ≈ 800 * e^(1270 / 3138.1) ≈ 1200 kg
 * ```
 *
 * @see {@link rocketDeltaVFromIsp}
 * @see https://en.wikipedia.org/wiki/Tsiolkovsky_rocket_equation Tsiolkovsky rocket equation
 */
export const initialMassForDeltaV = (
  mf: number,
  dv: number,
  Isp: number,
  g0 = 9.80665
): number => {
  for (const [name, v] of [
    ['mf', mf],
    ['dv', dv],
    ['Isp', Isp],
    ['g0', g0]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (mf <= 0) throw new RangeError(`mf must be > 0. Received: ${mf}`);

  if (dv < 0) throw new RangeError(`dv must be >= 0. Received: ${dv}`);

  if (Isp <= 0) throw new RangeError(`Isp must be > 0. Received: ${Isp}`);

  if (g0 <= 0) throw new RangeError(`g0 must be > 0. Received: ${g0}`);

  return mf * Math.exp(dv / (Isp * g0));
};
