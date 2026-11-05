import type { LagrangePointsInterface } from '@interstellar-tools/types';

import { cr3bpMassRatio } from './cr3bp-mass-ratio.js';

// Routh's critical mass ratio: L4 and L5 are stable below it
const ROUTH = (1 - Math.sqrt(23 / 27)) / 2;
// A root of a quintic by Newton's method. From the Hill approximation it
// converges in at most 6 steps for every mass ratio up to 0.5; past that, the
// steps only move it by the last digit
const root = (coefficients: readonly number[], start: number): number => {
  let g = start;

  for (let k = 0; k < 12; k++) {
    let p = 0;
    let dp = 0;

    for (const c of coefficients) {
      dp = dp * g + p;
      p = p * g + c;
    }

    g -= p / dp;
  }

  return g;
};

/**
 * The five **Lagrange points** of two bodies circling each other: where a
 * third, small body can stay put relative to them. JWST, Gaia and SOHO are
 * parked at Sun-Earth L1 and L2, and the Trojan asteroids gather at
 * Sun-Jupiter L4 and L5.
 *
 * L4 and L5 sit at the corners of equilateral triangles with the two bodies.
 * L1, L2 and L3 lie on the line through them, at distances $ \gamma $ that
 * solve the quintics of the collinear equilibrium, in the mass ratio
 * $ \mu = m_2 / (m_1 + m_2) $:
 *
 * $$
 * \begin{aligned}
 * \text{L1:}\quad & \gamma^5 - (3-\mu)\gamma^4 + (3-2\mu)\gamma^3 - \mu\gamma^2 + 2\mu\gamma - \mu = 0 \\
 * \text{L2:}\quad & \gamma^5 + (3-\mu)\gamma^4 + (3-2\mu)\gamma^3 - \mu\gamma^2 - 2\mu\gamma - \mu = 0 \\
 * \text{L3:}\quad & \gamma^5 + (2+\mu)\gamma^4 + (1+2\mu)\gamma^3 - (1-\mu)\gamma^2 - 2(1-\mu)\gamma - (1-\mu) = 0
 * \end{aligned}
 * $$
 *
 * solved with Newton's method from the Hill approximation
 * $ \gamma \approx \sqrt[3]{\mu/3} $ for L1 and L2, and
 * $ \gamma \approx 1 - 7\mu/12 $ for L3.
 *
 * Where:
 * - $ \gamma $ is the distance, in units of the separation, of L1 and L2 from the smaller body, and of L3 from the larger
 * - $ m_1 $, $ m_2 $ are the larger and the smaller body's masses
 *
 * **Units**
 * - Inputs: `m1` and `m2` in the same unit, kg or gravitational parameters in m³/s²; `separation` in **m**.
 * - Output: positions in **m**, in the frame turning with the bodies, from their barycentre: see {@link LagrangePointsInterface}.
 *
 * ::: info Notes
 *
 * - The larger body is at $ x = -\mu a $ and the smaller at $ x = (1 - \mu) a $, as in {@link cr3bpDerivatives} scaled by the separation $ a $.
 * - L1, L2 and L3 are unstable: a spacecraft there needs small manoeuvres
 *   every few weeks to stay. L4 and L5 are stable when the mass ratio is
 *   small enough: see {@link areTrojanPointsStable}.
 * - Spacecraft "at" L1 or L2, such as JWST, fly halo orbits around them,
 *   hundreds of thousands of kilometres across.
 *
 * :::
 *
 * ::: practice Sun-Earth L2, where JWST orbits
 *
 * **1.5 million km**
 *
 * _From Earth, straight away from the Sun_
 *
 * Four times the Moon's distance, where Earth's pull and the Sun's let a
 * spacecraft keep pace with Earth around the Sun, in Earth's shadow side.
 *
 * ```ts
 * const { L2 } = lagrangePoints(1.32712440041e20, 4.0350323e14, 1.495978707e11);
 *
 * L2[0] - (1 - 3.04e-6) * 1.495978707e11; // ≈ 1.5e9 m beyond Earth
 * ```
 *
 * :::
 *
 * @param m1 - Mass (or gravitational parameter) of the larger body (finite, > 0).
 * @param m2 - Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`).
 * @param separation - Distance between the two bodies in **m** (finite, > 0).
 * @returns L1 to L5 in **m**: see {@link LagrangePointsInterface}.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `m1 <= 0`, `m2 <= 0`, `m2 > m1` or `separation <= 0`.
 * @group Three-body
 *
 * @example
 * ```ts
 * // Earth and the Moon, 384 400 km apart
 * const { L1 } = lagrangePoints(3.986004418e14, 4.9028e12, 384_400_000);
 *
 * L1[0]; // ≈ 321 710 km from the barycentre: 326 381 km from Earth
 * ```
 *
 * @see {@link areTrojanPointsStable}
 * @see {@link cr3bpMassRatio}
 * @see {@link jacobiConstant}
 */
export const lagrangePoints = (
  m1: number,
  m2: number,
  separation: number
): LagrangePointsInterface => {
  const mu = cr3bpMassRatio(m1, m2);

  if (!Number.isFinite(separation))
    throw new TypeError(
      `separation must be a finite number. Received: ${separation}`
    );

  if (separation <= 0)
    throw new RangeError(`separation must be > 0. Received: ${separation}`);

  const hill = Math.cbrt(mu / 3);
  // L1 lies between the bodies: no further than halfway, for equal masses
  const g1 = root(
    [1, -(3 - mu), 3 - 2 * mu, -mu, 2 * mu, -mu],
    Math.min(hill, 0.5)
  );
  const g2 = root([1, 3 - mu, 3 - 2 * mu, -mu, -2 * mu, -mu], hill);
  const g3 = root(
    [1, 2 + mu, 1 + 2 * mu, -(1 - mu), -2 * (1 - mu), -(1 - mu)],
    1 - (7 * mu) / 12
  );
  const a = separation;
  const corner = (Math.sqrt(3) / 2) * a;

  return {
    L1: [(1 - mu - g1) * a, 0, 0],
    L2: [(1 - mu + g2) * a, 0, 0],
    L3: [(-mu - g3) * a, 0, 0],
    L4: [(0.5 - mu) * a, corner, 0],
    L5: [(0.5 - mu) * a, -corner, 0]
  };
};

/**
 * Whether the **Trojan points** L4 and L5 of two bodies are stable: whether a
 * small body there, nudged, circles the point rather than drifting off. It's
 * why Jupiter has thousands of Trojan asteroids.
 *
 * $$
 * \mu < \mu_R = \frac{1}{2}\left(1 - \sqrt{\frac{23}{27}}\right) \approx 0.03852
 * $$
 *
 * Where:
 * - $ \mu = m_2 / (m_1 + m_2) $ is the mass ratio, from {@link cr3bpMassRatio}
 * - $ \mu_R $ is Routh's critical mass ratio
 *
 * **Units**
 * - Inputs: `m1` and `m2` in the same unit, kg or gravitational parameters in m³/s².
 * - Output: `true` if L4 and L5 are stable.
 *
 * ::: info Notes
 *
 * - Every planet with the Sun, and the Moon with Earth ($ \mu \approx 0.012 $),
 *   is below the limit: the larger body must outweigh the smaller about 25
 *   times. Pluto and Charon ($ \mu \approx 0.11 $) are above it.
 * - L1, L2 and L3 are unstable for every mass ratio.
 * - Linear stability in the circular problem: the Sun's pull makes Earth-Moon
 *   L4 and L5 hold dust clouds at most, not a body.
 *
 * :::
 *
 * @param m1 - Mass (or gravitational parameter) of the larger body (finite, > 0).
 * @param m2 - Mass (or gravitational parameter) of the smaller body (finite, > 0, <= `m1`).
 * @returns `true` if L4 and L5 are linearly stable.
 * @throws {TypeError} If any input is not a finite number.
 * @throws {RangeError} If `m1 <= 0`, `m2 <= 0` or `m2 > m1`.
 * @group Three-body
 *
 * @example
 * ```ts
 * areTrojanPointsStable(1.32712440041e20, 1.26686534e17); // true: Sun and Jupiter
 * areTrojanPointsStable(8.69e11, 1.06e11); // false: Pluto and Charon
 * ```
 *
 * @see {@link lagrangePoints}
 */
export const areTrojanPointsStable = (m1: number, m2: number): boolean =>
  cr3bpMassRatio(m1, m2) < ROUTH;
