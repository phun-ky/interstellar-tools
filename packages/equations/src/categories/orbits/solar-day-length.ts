/**
 * Compute the length of a **solar day**, sunrise to sunrise, from a body's
 * rotation and its orbit.
 *
 * $$
 * \frac{1}{S} = \left\lvert \frac{1}{P} - \frac{1}{T} \right\rvert
 * $$
 *
 * Where:
 * - $ P $ is the sidereal rotation period, one turn against the stars, negative for a backwards spin
 * - $ T $ is the orbital period
 * - $ S $ is the solar day
 *
 * **Units**
 * - Inputs: `P` and `T` in the **same unit**.
 * - Output: $ S $ in that unit.
 *
 * ::: info Notes
 *
 * - The body moves along its orbit as it turns, so it has to turn a little
 *   further for the Sun to come back to the same place in its sky: Earth turns
 *   in 23 h 56 m 4 s, and its day is 24 h.
 * - A backwards spin, against the orbit, makes the solar day **shorter** than
 *   the rotation: Venus turns in 243 days, and its day is 117.
 * - A spin slower than the orbit makes the Sun go backwards across the sky.
 *   The day is still the time between two sunrises, so it's always positive.
 * - Take $ P $ and $ T $ against the same reference: Earth's 23 h 56 m 4.0989 s
 *   turn against the stars goes with the sidereal year, and the 23 h 56 m
 *   4.0905 s sidereal day, measured against the moving equinox, with the
 *   tropical year. Both give 86 400 s to within a millisecond.
 * - The `PLANETS` and `MOONS` datasets in `@interstellar-tools/constants`
 *   give the orbital periods, and the rotation periods.
 * - The same formula gives the **synodic month**, new Moon to new Moon, from
 *   the Moon's orbit and Earth's.
 *
 * :::
 *
 * ::: practice Mercury
 *
 * **175.94 days**
 *
 * _From sunrise to sunrise, two of Mercury's years_
 *
 * Mercury turns three times for every two orbits, so the Sun takes two of its
 * years to come back. Close to perihelion its orbit outruns its spin, and the
 * Sun stops in the sky and goes back for a few days.
 *
 * ```ts
 * solarDayLength(58.6462, 87.969); // ≈ 175.94 days
 * ```
 *
 * :::
 *
 * @param P - Sidereal rotation period (finite, not 0, not equal to `T`), negative for a spin against the orbit.
 * @param T - Orbital period, in the same unit as `P` (finite, > 0).
 * @returns The solar day, in the unit of `P` and `T`.
 * @throws {TypeError} If `P` or `T` is not a finite number.
 * @throws {RangeError} If `P = 0`, `T <= 0`, or `P = T` (the body keeps one face to the Sun and has no solar day).
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth: a turn against the stars, and the sidereal year, in seconds
 * solarDayLength(86_164.0989, 365.256_363 * 86_400); // ≈ 86 400 s
 *
 * // Mars: the sol
 * solarDayLength(88_642.663, 686.971 * 86_400); // ≈ 88 775.244 s
 *
 * // Venus spins backwards, in days
 * solarDayLength(-243.0226, 224.701); // ≈ 116.75 d
 * ```
 *
 * @see {@link synodicPeriod}
 * @see {@link greenwichMeanSiderealTime}
 * @see https://en.wikipedia.org/wiki/Solar_time Solar time
 */
export const solarDayLength = (P: number, T: number): number => {
  for (const [name, x] of [
    ['P', P],
    ['T', T]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  if (P === 0) throw new RangeError('P must not be 0.');

  if (T <= 0) throw new RangeError(`T must be > 0. Received: ${T}`);

  if (P === T)
    throw new RangeError(
      `P and T must differ: a body that turns once an orbit keeps one face to the Sun and has no solar day. Received: ${P}`
    );

  return Math.abs((P * T) / (T - P));
};
