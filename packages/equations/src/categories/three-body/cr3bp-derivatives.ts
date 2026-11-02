import type {
  Cr3bpState,
  Cr3bpStateDerivative
} from '@interstellar-tools/types';

/**
 * Compute the **time derivative** of a state in the circular restricted three-body problem (right-hand side for ODE integration).
 *
 * In the rotating frame, normalised so the separation, $ G(m_1 + m_2) $ and the angular rate are 1:
 *
 * $$
 * \ddot x - 2\dot y = \frac{\partial U}{\partial x}, \quad
 * \ddot y + 2\dot x = \frac{\partial U}{\partial y}, \quad
 * \ddot z = \frac{\partial U}{\partial z}
 * $$
 *
 * $$
 * U = \frac{x^2 + y^2}{2} + \frac{1 - \mu}{r_1} + \frac{\mu}{r_2}, \quad
 * r_1 = \lVert(x + \mu,\ y,\ z)\rVert, \quad
 * r_2 = \lVert(x - 1 + \mu,\ y,\ z)\rVert
 * $$
 *
 * Where:
 * - $ \mu $ is the mass ratio, from {@link cr3bpMassRatio}
 * - $ r_1 $, $ r_2 $ are the distances to the larger body, at $ x = -\mu $, and the smaller, at $ x = 1 - \mu $
 * - $ 2\dot y $ and $ -2\dot x $ are the Coriolis terms, and $ x $, $ y $ in $ U $ the centrifugal ones
 *
 * **Units**
 * - Input: `state` `[x, y, z, xDot, yDot, zDot]` in normalised units (see {@link cr3bpUnits}), `mu` dimensionless.
 * - Output: `[xDot, yDot, zDot, xDDot, yDDot, zDDot]` in normalised units.
 *
 * ::: info Notes
 *
 * - "Restricted": the third body is too light to move the other two, which circle their centre of mass. It fits a spacecraft between Earth and Moon far better than two patched conics, but the Moon's real orbit is slightly elliptic and the Sun pulls on everything.
 * - Integrate it with {@link rk4Integrate}, and check the result with {@link jacobiConstant}, which this motion keeps constant.
 * - Same layout and style as {@link cwHillDerivatives}.
 *
 * :::
 *
 * ::: practice Apollo 11, the free return
 *
 * **+3.7 m/s**
 *
 * _On top of Apollo 11's 10 834.3 m/s at TLI, for a free return in the Earth–Moon plane_
 *
 * Integrated from the TLI point, 334.4 km up at 7.367° above the horizontal, a trajectory 242.27° round from the Earth–Moon line passes 114 km behind the Moon 68.6 h later and comes back to a 38.5 km perigee, inside the atmosphere, 137.4 h after TLI. That's the figure-eight that would have brought the crew home if the service module's engine had failed.
 *
 * :::
 *
 * @param state - CR3BP state `[x, y, z, xDot, yDot, zDot]` (finite, not at either body).
 * @param mu - Mass ratio $ \mu $ (finite, in (0, 0.5]).
 * @returns The time derivative `[xDot, yDot, zDot, xDDot, yDDot, zDDot]`.
 * @throws {TypeError} If `mu` or a state component is not finite.
 * @throws {RangeError} If `mu` is outside (0, 0.5], or the state is at the centre of either body.
 * @group Three-body
 *
 * @example
 * ```ts
 * import type { Cr3bpState } from '@interstellar-tools/types';
 *
 * // At rest at L4: the forces balance, so the acceleration is zero
 * const mu = 0.012151;
 * const l4: Cr3bpState = [0.5 - mu, Math.sqrt(3) / 2, 0, 0, 0, 0];
 * cr3bpDerivatives(l4, mu); // ≈ [0, 0, 0, 0, 0, 0]
 * ```
 *
 * @see {@link jacobiConstant}
 * @see {@link rk4Integrate}
 * @see https://en.wikipedia.org/wiki/Three-body_problem#Circular_restricted_three-body_problem Circular restricted three-body problem
 */
export const cr3bpDerivatives = (
  state: Cr3bpState,
  mu: number
): Cr3bpStateDerivative => {
  if (!Number.isFinite(mu))
    throw new TypeError(`mu must be a finite number. Received: ${mu}`);

  if (mu <= 0 || mu > 0.5)
    throw new RangeError(`mu must be in (0, 0.5]. Received: ${mu}`);

  const [x, y, z, xDot, yDot, zDot] = state;

  for (const [name, v] of [
    ['x', x],
    ['y', y],
    ['z', z],
    ['xDot', xDot],
    ['yDot', yDot],
    ['zDot', zDot]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  const r1 = Math.hypot(x + mu, y, z);
  const r2 = Math.hypot(x - 1 + mu, y, z);

  if (r1 === 0 || r2 === 0)
    throw new RangeError('The state must not be at the centre of either body.');

  const a1 = (1 - mu) / r1 ** 3;
  const a2 = mu / r2 ** 3;

  return [
    xDot,
    yDot,
    zDot,
    x + 2 * yDot - a1 * (x + mu) - a2 * (x - 1 + mu),
    y - 2 * xDot - (a1 + a2) * y,
    -(a1 + a2) * z
  ];
};
