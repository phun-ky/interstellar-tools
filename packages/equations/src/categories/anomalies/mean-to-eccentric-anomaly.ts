import { TWO_PI } from '@interstellar-tools/constants';
import { convertTemporalUnit } from '@interstellar-tools/temporal';
import type {
  CelestialBodyType,
  Radians,
  TemporalInterface
} from '@interstellar-tools/types';

import { wrapAngle } from '../angle/wrap-angle';

import { trueToMeanAnomaly } from './true-to-mean-anomaly';
import { areEqual } from './utils/are-equal';

/**
 * Computes the **mean anomaly** ($M$) of a celestial body for a given time step.
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
 * - $\Delta T$ is the time step.
 *
 * @param {CelestialBodyType} body - The celestial body for which to compute the mean anomaly.
 * @param {TemporalInterface} timeStep - The time step over which to compute the change.
 * @returns {Radians} The computed mean anomaly in radians.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If the body's eccentricity is outside the range $0 \leq e < 1$.
 *
 * @example
 * ```ts
 * import { meanToEccentricAnomaly } from './compute-mean-anomaly';
 *
 * const mars: CelestialBodyType = {
 *   name: 'Mars',
 *   e: 0.0934, // Eccentricity of Mars' orbit
 *   angle: 1.047, // Initial true anomaly (in radians)
 *   period: { value: 687, unit: 'day' }, // Orbital period in days
 * };
 *
 * const timeStep: TemporalInterface = { value: 1, unit: 'day' }; // 1-day step
 * const meanAnomaly = meanToEccentricAnomaly(mars, timeStep);
 * console.log(meanAnomaly); // Output: Computed mean anomaly in radians
 * ```
 *
 * @see [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
 * @see [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
 * @category Anomalies
 */
export const meanToEccentricAnomaly = (
  body: CelestialBodyType,
  timeStep: TemporalInterface
): Radians => {
  const { e, angle, period } = body;

  if (e < 0 || e >= 1) {
    throw new RangeError(
      `Invalid eccentricity: ${e}. Eccentricity must be in the range [0, 1].`
    );
  }

  // Convert period to days and compute mean motion
  const periodInDays = convertTemporalUnit(period, 'd').value;
  const meanMotion = TWO_PI / Math.abs(periodInDays);
  // Convert true anomaly (V) to mean anomaly (M0) if necessary
  const M0 = e === 0 ? angle : trueToMeanAnomaly(angle, e);

  if (timeStep.value === 0) {
    return M0;
  }

  // Clamping small time steps to prevent unnecessary updates
  const minTimeStep = 1e-5; // Minimum allowed time step
  const maxTimeStepFactor = e >= 0.9 ? 1 : 10; // Stricter limit for highly eccentric orbits
  const clampedDeltaT = Math.max(
    minTimeStep,
    Math.min(timeStep.value, maxTimeStepFactor * Math.abs(periodInDays))
  );
  // Compute new mean anomaly with hysteresis filter and sign preservation
  const prevM = M0;

  let newM = wrapAngle(M0 + meanMotion * clampedDeltaT);

  if (areEqual(newM, prevM)) {
    newM = prevM;
  }

  return newM;
};
