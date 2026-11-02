/**
 * Compute the **synodic period** of two bodies on circular orbits: the time between two alignments.
 *
 * $$
 * T_\text{syn} = \frac{2\pi}{\lvert n_1 - n_2 \rvert}
 * $$
 *
 * Where:
 * - $ n_1 $, $ n_2 $ are the two mean motions (rad/s)
 *
 * **Units**
 * - Inputs: `n1`, `n2` in **rad/s**.
 * - Output: $ T_\text{syn} $ in **s**.
 *
 * ::: info Notes
 *
 * - The faster body gains $ 2\pi $ on the slower one every synodic period.
 * - The closer the two orbits, the longer it takes: a chaser that's slightly lower gains only a little each orbit.
 * - For planets, the same formula gives the time between launch windows, e.g. about 26 months for Earth and Mars.
 *
 * :::
 *
 * ::: practice Apollo 11, after lunar liftoff
 *
 * **41.8 h**
 *
 * _The LM in its 9.4 × 48.0 n mi orbit against the CSM in 56 × 62 n mi_
 *
 * The LM gained only about 16° on the CSM each orbit, so it had to lift off at the right moment: the whole rendezvous took 3 h 41 min.
 *
 * ```ts
 * const nLM = meanMotion(1_790_552, 4.902800118e12);
 * const nCSM = meanMotion(1_846_668, 4.902800118e12);
 * synodicPeriod(nLM, nCSM) / 3600; // ≈ 41.8 h
 * ```
 *
 * :::
 *
 * @param n1 - Mean motion of the first body in **rad/s** (finite, > 0).
 * @param n2 - Mean motion of the second body in **rad/s** (finite, > 0, not equal to `n1`).
 * @returns Synodic period in **s**.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `n1 <= 0`, `n2 <= 0`, or `n1 = n2` (the bodies never realign).
 * @group Orbits
 *
 * @example
 * ```ts
 * // Earth and Mars, from their periods in days
 * const day = 86_400;
 * const t = synodicPeriod((2 * Math.PI) / (365.256 * day), (2 * Math.PI) / (686.98 * day));
 * // t / day ≈ 780 days
 * ```
 *
 * @see {@link phasingWaitTime}
 * @see {@link meanMotion}
 * @see https://en.wikipedia.org/wiki/Orbital_period#Synodic_period Synodic period
 */
export const synodicPeriod = (n1: number, n2: number): number => {
  for (const [name, x] of [
    ['n1', n1],
    ['n2', n2]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
  }

  if (n1 === n2)
    throw new RangeError(
      `n1 and n2 must differ: equal mean motions never realign. Received: ${n1}`
    );

  return (2 * Math.PI) / Math.abs(n1 - n2);
};
