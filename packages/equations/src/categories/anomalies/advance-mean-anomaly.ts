import { TWO_PI } from '@interstellar-tools/constants';
import { convertTemporalUnit } from '@interstellar-tools/temporal';
import type {
  OrbitInterface,
  Radians,
  TemporalInterface
} from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';

import { trueToMeanAnomaly } from './true-to-mean-anomaly.js';

/* node:coverage disable */
/**
 * Advances an orbit by a time step and returns its new **mean anomaly** ($M$).
 *
 * The orbit's `angle` (true anomaly) is the starting point. To get the eccentric
 * anomaly from the result, pass it to {@link solveKepler}. To find a body at a
 * given date, use {@link meanAnomalyAt} or {@link trueAnomalyAt}.
 *
 * **Mathematical Explanation:**
 *
 * The **mean anomaly** is a measure of the position of an orbiting body as if it moved
 * with uniform angular motion along a circular orbit with the same period as the actual
 * elliptical orbit. It grows linearly with time:
 *
 * $$ M = M_0 + n \cdot \Delta T, \qquad n = \frac{2\pi}{|P|} $$
 *
 * where:
 * - $M_0$ is the **initial mean anomaly**, converted from the true anomaly `angle`.
 * - $n$ is the **mean motion**, from the period $P$ in days. $P$ is a positive
 *   duration; a negative one, from data in the old 0.x convention, is read as
 *   its absolute value. A positive step always moves the body forward.
 * - $\Delta T$ is the time step, converted to days from its unit.
 *
 * The step can be any length, from a fraction of a second to many orbits, and
 * negative to go back in time. The result is wrapped to $[0, 2\pi)$.
 *
 * @param {Pick<OrbitInterface, 'e' | 'angle' | 'period'>} orbit - The body's orbit, for example `body.orbit` from a dataset.
 * @param {TemporalInterface} timeStep - How far to advance, in any temporal unit; negative goes back in time.
 * @returns {Radians} The mean anomaly after the time step, in $[0, 2\pi)$.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the orbit's eccentricity is outside the range $0 \leq e < 1$.
 *
 * @example
 * ```ts
 * import { advanceMeanAnomaly } from '@interstellar-tools/equations';
 *
 * const marsOrbit = {
 *   e: 0.0934, // Eccentricity of Mars' orbit
 *   angle: 1.047 as Radians, // Initial true anomaly (in radians)
 *   period: { value: 687, unit: 'd' } // Orbital period in days
 * };
 *
 * advanceMeanAnomaly(marsOrbit, { value: 1, unit: 'd' }); // one day on
 * advanceMeanAnomaly(marsOrbit, { value: 10, unit: 'yr' }); // ten years on
 * advanceMeanAnomaly(marsOrbit, { value: -1, unit: 'd' }); // one day back
 * ```
 *
 * @see {@link solveKepler} to convert the mean anomaly to the eccentric anomaly.
 * @see [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
 * @see [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
 * @group Anomalies
 */
/* node:coverage enable */
export const advanceMeanAnomaly = (
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  timeStep: TemporalInterface
): Radians => {
  const { e, angle, period } = orbit;

  if (e < 0 || e >= 1) {
    throw new RangeError(
      `Invalid eccentricity: ${e}. Eccentricity must be in the range [0, 1].`
    );
  }

  // Convert period and time step to days and compute mean motion
  const periodInDays = convertTemporalUnit(period, 'd').value;
  const timeStepInDays = convertTemporalUnit(timeStep, 'd').value;
  const meanMotion = TWO_PI / Math.abs(periodInDays);
  // Convert true anomaly (V) to mean anomaly (M0)
  const M0 = e === 0 ? angle : trueToMeanAnomaly(angle, e);

  return norm2pi(M0 + meanMotion * timeStepInDays) as Radians;
};
