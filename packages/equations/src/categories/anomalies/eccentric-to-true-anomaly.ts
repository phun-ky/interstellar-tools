import type { Radians } from '@interstellar-tools/types';

/**
 * Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.
 *
 * **Mathematical Explanation:**
 *
 * The **eccentric anomaly** ($E$) and the **true anomaly** ($V$) are related through:
 * $$
 * \tan \frac{V}{2} = \sqrt{\frac{1+e}{1-e}} \tan \frac{E}{2}
 * $$
 * where:
 * - $E$ is the **eccentric anomaly** (in radians).
 * - $V$ is the **true anomaly** (in radians).
 * - $e$ is the **orbital eccentricity** ($0 \leq e < 1$ for elliptical orbits).
 *
 * This function handles:
 * - **Circular orbits** ($e = 0$): True anomaly is equal to eccentric anomaly.
 * - **Parabolic orbits** ($e = 1$): Uses the special case:
 *   $$
 *   V = 2 \tan^{-1} \left(\frac{E}{2}\right)
 *   $$
 * - **Elliptical orbits** ($0 < e < 1$): Uses the standard conversion equation.
 *
 * Additionally, numerical stability is ensured when $E \approx \pi$.
 *
 * @param {Radians} E - Eccentric anomaly ($E$) in radians.
 * @param {number} e - Orbital eccentricity ($0 \leq e < 1$).
 * @returns {Radians} True anomaly ($V$) in radians.
 *
 * @throws {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError | RangeError} If **eccentricity** is out of the range $0 \leq e \leq 1$.
 *
 * @example
 * ```ts
 * console.log(eccentricToTrueAnomaly(1.0, 0.5)); // Output: True anomaly in radians
 * console.log(eccentricToTrueAnomaly(Math.PI, 0)); // Output: Math.PI (circular orbit)
 * console.log(eccentricToTrueAnomaly(0, 1)); // Output: 0 (parabolic orbit)
 * ```
 *
 * @see [True Anomaly (Wikipedia)](https://en.wikipedia.org/wiki/True_anomaly)
 * @group Anomalies
 */
export const eccentricToTrueAnomaly = (E: Radians, e: number): Radians => {
  // Validate eccentricity range
  if (e < 0 || e > 1) {
    throw new RangeError(
      `Invalid eccentricity: ${e}. Eccentricity must be in the range [0, 1].`
    );
  }

  // Handle circular orbit (e = 0)
  if (e === 0) {
    return E; // True anomaly equals eccentric anomaly for circular orbits
  }

  // Handle parabolic orbit (e = 1)
  if (e === 1) {
    return (2 * Math.atan(E / 2)) as Radians; // Special formula for parabolic orbits
  }

  // Handle numerical instability near E = π
  const epsilon = 1e-10; // Small threshold for numerical stability

  if (Math.abs(Math.cos(E / 2)) < epsilon) {
    return Math.PI as Radians; // True anomaly is π when E = π
  }

  // Convert eccentric anomaly (E) to true anomaly (V) for elliptical orbits
  return (2 *
    Math.atan2(
      Math.sqrt(1 + e) * Math.sin(E / 2),
      Math.sqrt(1 - e) * Math.cos(E / 2)
    )) as Radians;
};
