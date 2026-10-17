import { TWO_PI } from '@interstellar-tools/constants';
import { convertTemporalUnit } from '@interstellar-tools/temporal';
import type {
  OrbitInterface,
  Radians,
  TemporalInterface
} from '@interstellar-tools/types';

import { wrapAngle } from '../angle/wrap-angle.js';

import { trueToMeanAnomaly } from './true-to-mean-anomaly.js';
import { areEqual } from './utils/are-equal.js';

/* node:coverage disable */
/**
 * Advances an orbit by a time step and returns its new **mean anomaly** ($M$).
 *
 * The orbit's `angle` (true anomaly) is the starting point. To get the eccentric
 * anomaly from the result, pass it to {@link solveKepler}.
 *
 * **Mathematical Explanation:**
 *
 * The **mean anomaly** is a measure of the position of an orbiting body as if it moved
 * with uniform angular motion along a circular orbit with the same period as the actual
 * elliptical orbit. It is computed as:
 *
 * $$ M = M_0 + n \cdot \Delta T $$
 *
 * where:
 * - $M_0$ is the **initial mean anomaly** (converted from true anomaly if necessary).
 * - $n$ is the **mean motion**, given by:
 *   $$ n = \frac{2\pi}{P} $$
 *   where $P$ is the orbital period in days.
 * - $\Delta T$ is the time step, converted to days from its unit.
 *
 * @param {Pick<OrbitInterface, 'e' | 'angle' | 'period'>} orbit - The body's orbit, for example `body.orbit` from a dataset.
 * @param {TemporalInterface} timeStep - The time step over which to compute the change, in any temporal unit.
 * @returns {Radians} The computed mean anomaly in radians.
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
 * const timeStep: TemporalInterface = { value: 1, unit: 'd' }; // 1-day step
 * const meanAnomaly = advanceMeanAnomaly(marsOrbit, timeStep);
 * console.log(meanAnomaly); // Output: Computed mean anomaly in radians
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
  // Convert true anomaly (V) to mean anomaly (M0) if necessary
  const M0 = e === 0 ? angle : trueToMeanAnomaly(angle, e);

  if (timeStepInDays === 0) {
    return M0 as Radians;
  }

  // Clamping small time steps to prevent unnecessary updates
  const minTimeStep = 1e-5; // Minimum allowed time step
  const maxTimeStepFactor = e >= 0.9 ? 1 : 10; // Stricter limit for highly eccentric orbits
  const clampedDeltaT = Math.max(
    minTimeStep,
    Math.min(timeStepInDays, maxTimeStepFactor * Math.abs(periodInDays))
  );
  // Compute new mean anomaly with hysteresis filter and sign preservation
  const prevM = M0;

  let newM = wrapAngle(M0 + meanMotion * clampedDeltaT);

  if (areEqual(newM, prevM)) {
    newM = prevM;
  }

  return newM as Radians;
};
