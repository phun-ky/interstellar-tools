import type { Radians } from '@interstellar-tools/types';

/**
 * Compute how long to **wait for a phase angle**: when a target, leading a chaser on another circular orbit, will be at the angle a manoeuvre needs.
 *
 * The phase angle $ \theta $ is how far the target is ahead of the chaser, and it changes at the difference in mean motions:
 *
 * $$
 * \dot\theta = n_\text{target} - n_\text{chaser}, \qquad
 * t_\text{wait} = \frac{\theta_\text{required} - \theta_\text{now}}{n_\text{target} - n_\text{chaser}} \pmod{T_\text{syn}}
 * $$
 *
 * returning the first time that's not negative.
 *
 * **Units**
 * - Inputs: angles in **radians**, mean motions in **rad/s**.
 * - Output: $ t_\text{wait} $ in **s**, in $ [0, T_\text{syn}) $.
 *
 * ::: info Notes
 *
 * - A chaser in a lower, faster orbit closes the gap: the phase angle shrinks.
 * - For a Hohmann transfer to a target on a circular orbit, the required angle is $ \theta = \pi - n_\text{target}\, t_\text{transfer} $.
 * - If the required angle is just behind, the wait is almost a whole synodic period; see {@link synodicPeriod}.
 *
 * :::
 *
 * @param thetaNow - Current phase angle, target ahead of chaser, in **radians** (finite).
 * @param thetaRequired - Phase angle wanted, in **radians** (finite).
 * @param nChaser - Chaser's mean motion in **rad/s** (finite, > 0).
 * @param nTarget - Target's mean motion in **rad/s** (finite, > 0, not equal to `nChaser`).
 * @returns Waiting time in **s**, in [0, synodic period).
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If a mean motion is `<= 0`, or both are equal (the phase never changes).
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // Chaser 1° per orbit faster, target 10° ahead, burn when it's 4° ahead
 * const nTarget = 0.00113;
 * const nChaser = nTarget * (1 + 1 / 360);
 * const t = phasingWaitTime(
 *   ((10 * Math.PI) / 180) as Radians,
 *   ((4 * Math.PI) / 180) as Radians,
 *   nChaser,
 *   nTarget
 * );
 * // t ≈ 6 orbits of the target
 * ```
 *
 * @see {@link synodicPeriod}
 * @see {@link hohmannTransferTime}
 */
export const phasingWaitTime = (
  thetaNow: Radians,
  thetaRequired: Radians,
  nChaser: number,
  nTarget: number
): number => {
  for (const [name, x] of [
    ['thetaNow', thetaNow],
    ['thetaRequired', thetaRequired],
    ['nChaser', nChaser],
    ['nTarget', nTarget]
  ] as const) {
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);
  }

  for (const [name, x] of [
    ['nChaser', nChaser],
    ['nTarget', nTarget]
  ] as const) {
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);
  }

  if (nChaser === nTarget)
    throw new RangeError(
      `nChaser and nTarget must differ: the phase angle never changes. Received: ${nChaser}`
    );

  const rate = nTarget - nChaser;
  const synodic = (2 * Math.PI) / Math.abs(rate);
  const t = (thetaRequired - thetaNow) / rate;

  return ((t % synodic) + synodic) % synodic;
};
