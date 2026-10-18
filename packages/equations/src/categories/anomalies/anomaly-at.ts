import { J2000_UTC, MILLISECONDS_PER_DAY } from '@interstellar-tools/constants';
import type { OrbitInterface, Radians } from '@interstellar-tools/types';

import { norm2pi } from '../helpers/misc.js';
import { solveKepler } from '../kepler/solve-kepler.js';

import { advanceMeanAnomaly } from './advance-mean-anomaly.js';
import { eccentricToTrueAnomaly } from './eccentric-to-true-anomaly.js';

/** Days from J2000 to `date`, after checking it's a valid date. */
const daysSinceJ2000 = (date: Date): number => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError(`date must be a valid Date. Received: ${String(date)}`);
  }

  return (date.getTime() - J2000_UTC.getTime()) / MILLISECONDS_PER_DAY;
};

/* node:coverage disable */
/**
 * The **mean anomaly** ($M$) of an orbit at a given date.
 *
 * Every `orbit.angle` in the datasets is the true anomaly at **J2000**
 * (2000-01-01 12:00 TT), so this advances the orbit from J2000 to `date` with
 * {@link advanceMeanAnomaly}. Dates before J2000 work too.
 *
 * $$ M = M_0 + \frac{2\pi}{|P|} \, (t - t_{J2000}) $$
 *
 * The time is measured in UTC, as JavaScript dates are, against
 * {@link J2000_UTC}. Leap seconds since 2000 are ignored, which moves a body by
 * a few seconds of its orbit at most.
 *
 * @param {Pick<OrbitInterface, 'e' | 'angle' | 'period'>} orbit - An orbit whose `angle` is the true anomaly at J2000, for example `body.orbit` from a dataset.
 * @param {Date} date - The date to find the body at.
 * @returns {Radians} The mean anomaly at `date`, in $[0, 2\pi)$.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If the orbit's eccentricity is outside $0 \leq e < 1$.
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 * import { meanAnomalyAt } from '@interstellar-tools/equations';
 *
 * const earth = PLANETS.find((planet) => planet.id === 'earth')!;
 *
 * meanAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // ≈ 4.934 rad (282.7°)
 * ```
 *
 * @see {@link trueAnomalyAt} for where the body actually is.
 * @group Anomalies
 */
/* node:coverage enable */
export const meanAnomalyAt = (
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  date: Date
): Radians =>
  advanceMeanAnomaly(orbit, { value: daysSinceJ2000(date), unit: 'd' });

/* node:coverage disable */
/**
 * The **true anomaly** ($\nu$) of an orbit at a given date: where the body is.
 *
 * Takes the mean anomaly at `date` from {@link meanAnomalyAt}, solves Kepler's
 * equation with {@link solveKepler}, and converts the result with
 * {@link eccentricToTrueAnomaly}.
 *
 * @param {Pick<OrbitInterface, 'e' | 'angle' | 'period'>} orbit - An orbit whose `angle` is the true anomaly at J2000, for example `body.orbit` from a dataset.
 * @param {Date} date - The date to find the body at.
 * @returns {Radians} The true anomaly at `date`, in $[0, 2\pi)$.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If the orbit's eccentricity is outside $0 \leq e < 1$.
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 * import { trueAnomalyAt } from '@interstellar-tools/equations';
 *
 * const earth = PLANETS.find((planet) => planet.id === 'earth')!;
 *
 * trueAnomalyAt(earth.orbit!, new Date('2026-10-17T12:00:00Z')); // ≈ 4.901 rad (280.8°)
 * ```
 *
 * @group Anomalies
 */
/* node:coverage enable */
export const trueAnomalyAt = (
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  date: Date
): Radians => {
  const M = meanAnomalyAt(orbit, date);
  const E = solveKepler(M, orbit.e);
  const nu = eccentricToTrueAnomaly(E, orbit.e);

  return norm2pi(nu) as Radians;
};
