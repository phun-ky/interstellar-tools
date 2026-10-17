import type {
  OrbitInterface,
  Radians,
  TimeStepInterface
} from '@interstellar-tools/types';

import { eccentricToTrueAnomaly } from '../anomalies/eccentric-to-true-anomaly.js';
import { meanToEccentricAnomaly } from '../anomalies/mean-to-eccentric-anomaly.js';
import { solveKepler } from '../kepler/solve-kepler.js';

/**
 * Computes the orbital angle (true anomaly, $ν$) of a celestial body for a given date and time step.
 *
 * **Mathematical Explanation:**
 *
 * This function determines the **true anomaly** ($ν$) based on the time elapsed since the
 * **J2000 epoch** (January 1, 2000) and the provided time step. The calculation follows these steps:
 *
 * **Step 1: Compute Time Elapsed Since J2000**
 *
 * The number of days since **J2000** is computed as:
 * $$ \Delta T = \frac{t - t_{J2000}}{\text{MILLISECONDS\_PER\_DAY}} $$
 * where:
 * - $t$ is the current date in milliseconds.
 * - $t_{J2000}$ is **J2000** (2000-01-01T00:00:00Z).
 * - **MILLISECONDS_PER_DAY** is the number of milliseconds in one day.
 *
 * **Step 2: Compute the Mean Anomaly ($M$)**
 *
 * The **mean anomaly** is calculated as:
 * $$ M = M_0 + n \cdot (\Delta T + \text{timeStep}) $$
 * where:
 * - $M_0$ is the initial mean anomaly at **J2000**.
 * - $n$ is the mean motion (orbital angular velocity).
 * - $\text{timeStep}$ is the time step in days.
 *
 * **Step 3: Solve Kepler’s Equation for Eccentric Anomaly ($E$)**
 *
 * Kepler’s equation:
 * $$ M = E - e \sin(E) $$
 * is solved numerically to obtain the **eccentric anomaly** ($E$).
 *
 * **Step 4: Convert Eccentric Anomaly ($E$) to True Anomaly ($ν$)**
 *
 * Using the relation:
 * $$ ν = 2 \tan^{-1} \left( \sqrt{\frac{1+e}{1-e}} \tan\left(\frac{E}{2}\right) \right) $$
 *
 * **Step 5: Adjust the True Anomaly for Certain Bodies**
 * - For **comets**, the final **true anomaly** is adjusted by subtracting the **eccentricity** ($e$).
 * - For **stars and other celestial objects**, the computed **true anomaly** is used directly.
 *
 * @param {Pick<OrbitInterface, 'e' | 'angle' | 'period'>} orbit - The body's orbit, for example `body.orbit` from a dataset.
 * @param {TimeStepInterface} timeStep - The time step in days since the last frame.
 * @returns {Radians} The computed true anomaly in radians.
 *
 * @example
 * ```ts
 * import { PLANETS } from '@interstellar-tools/constants';
 * import { computeAngle } from '@interstellar-tools/equations';
 *
 * const earth = PLANETS.find((planet) => planet.id === 'earth');
 * const timeStep: TimeStepInterface = { value: 1, unit: 'd' }; // Time step of 1 day
 * const angle: Radians = computeAngle(earth.orbit, timeStep);
 * console.log(angle); // Output: Computed true anomaly in radians
 * ```
 *
 * @see [Kepler's Equation (Wikipedia)](https://en.wikipedia.org/wiki/Kepler%27s_equation)
 * @see [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
 * @see [Mean Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/Mean_anomaly)
 * @see [Orbital Mechanics (NASA)](https://solarsystem.nasa.gov/basics/chapter2-2/)
 * @group Angles
 */
export const computeAngle = (
  orbit: Pick<OrbitInterface, 'e' | 'angle' | 'period'>,
  timeStep: TimeStepInterface
): Radians => {
  // Compute mean anomaly (M) with time step
  const M: Radians = meanToEccentricAnomaly(orbit, timeStep);
  // Solve Kepler's equation for eccentric anomaly (E)
  const E: Radians = solveKepler(M, orbit.e);
  // Convert eccentric anomaly (E) to true anomaly (ν)
  const V: Radians = eccentricToTrueAnomaly(E, orbit.e);

  return V;
};
