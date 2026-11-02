import type { Cr3bpState } from '@interstellar-tools/types';

/**
 * Compute the **Jacobi constant** of a state in the circular restricted three-body problem.
 *
 * $$
 * C_J = x^2 + y^2 + \frac{2(1 - \mu)}{r_1} + \frac{2\mu}{r_2} - \left(\dot x^2 + \dot y^2 + \dot z^2\right) = 2U - v^2
 * $$
 *
 * Where:
 * - $ r_1 $, $ r_2 $ are the distances to the two bodies, as in {@link cr3bpDerivatives}
 * - $ v $ is the speed in the rotating frame
 *
 * **Units**
 * - Input: `state` in normalised units, `mu` dimensionless.
 * - Output: $ C_J $, normalised.
 *
 * ::: info Notes
 *
 * - The only quantity the CR3BP keeps constant: an energy in the rotating frame. Watch it to check a numerical integration.
 * - Since $ v^2 \ge 0 $, a body can only go where $ 2U \ge C_J $. The boundaries, the zero-velocity curves, wall off regions of space: with a high $ C_J $, a spacecraft near Earth can't reach the Moon at all.
 * - The walls first open at L1. For Earth–Moon, $ C_J $ there is about 3.188; below that, the way to the Moon is open.
 *
 * :::
 *
 * ::: practice Apollo 11, the free return
 *
 * **1.778**
 *
 * _The Jacobi constant of a free return from Apollo 11's TLI_
 *
 * Well below the 3.188 at L1, so the zero-velocity curves leave the whole Earth–Moon region open. Apollo 11 left Earth with energy to spare, as far as the walls are concerned; reaching the Moon was a matter of aim.
 *
 * :::
 *
 * @param state - CR3BP state `[x, y, z, xDot, yDot, zDot]` (finite, not at either body).
 * @param mu - Mass ratio $ \mu $ (finite, in (0, 0.5]).
 * @returns The Jacobi constant $ C_J $.
 * @throws {TypeError} If `mu` or a state component is not finite.
 * @throws {RangeError} If `mu` is outside (0, 0.5], or the state is at the centre of either body.
 * @group Three-body
 *
 * @example
 * ```ts
 * import type { Cr3bpState } from '@interstellar-tools/types';
 *
 * // At rest at L4, C_J = 3 − μ(1 − μ)
 * const mu = 0.012151;
 * jacobiConstant([0.5 - mu, Math.sqrt(3) / 2, 0, 0, 0, 0], mu); // ≈ 2.98800
 * ```
 *
 * @see {@link cr3bpDerivatives}
 * @see https://en.wikipedia.org/wiki/Jacobi_integral Jacobi integral
 */
export const jacobiConstant = (state: Cr3bpState, mu: number): number => {
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

  return (
    x * x +
    y * y +
    (2 * (1 - mu)) / r1 +
    (2 * mu) / r2 -
    (xDot * xDot + yDot * yDot + zDot * zDot)
  );
};
