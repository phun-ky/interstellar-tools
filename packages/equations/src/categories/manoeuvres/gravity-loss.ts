import type { Radians } from '@interstellar-tools/types';

/**
 * Compute the **gravity loss** of a burn from samples of gravity and flight-path angle.
 *
 * $$
 * \Delta v_g = \int_0^{t_b} g \sin\gamma \, dt
 * $$
 *
 * integrated with the trapezoidal rule over equally spaced samples.
 *
 * Where:
 * - $ g $ is the local gravitational acceleration (m/s²)
 * - $ \gamma $ is the flight-path angle above the local horizontal (rad)
 * - $ t_b $ is the burn time (s)
 *
 * **Units**
 * - Inputs: `g` in **m/s²**, `gamma` in **radians**, `dt` in **s**.
 * - Output: $ \Delta v_g $ in **m/s**.
 *
 * ::: info Notes
 *
 * - Thrust spent holding a rocket up against gravity doesn't speed it up. The loss is largest for a vertical climb ($ \gamma = 90° $) and zero for a horizontal burn ($ \gamma = 0 $).
 * - The delta-v a rocket must carry is its orbital delta-v plus its gravity, drag and steering losses.
 * - Pass `g` as one number when it's constant over the burn, or as samples matching `gamma`.
 *
 * :::
 *
 * @param g - Gravitational acceleration in **m/s²**: one value, or one sample per entry of `gamma` (finite, >= 0).
 * @param gamma - Flight-path angles $ \gamma $ in **radians**, sampled every `dt` seconds (at least 2 samples, each finite).
 * @param dt - Time between samples in **s** (finite, > 0).
 * @returns Gravity loss $ \Delta v_g $ in **m/s**. Negative when the vehicle is mostly descending.
 * @throws {TypeError} If any input is not a finite number, or `g` and `gamma` have different lengths.
 * @throws {RangeError} If `gamma` has fewer than 2 samples, `dt <= 0` or any `g < 0`.
 * @group Manoeuvres
 *
 * @example
 * ```ts
 * import type { Radians } from '@interstellar-tools/types';
 *
 * // A 10 s vertical climb in constant Earth gravity
 * const vertical = Array.from({ length: 11 }, () => (Math.PI / 2) as Radians);
 * gravityLoss(9.80665, vertical, 1); // ≈ 98.07 m/s
 * ```
 *
 * @see https://en.wikipedia.org/wiki/Gravity_drag Gravity drag
 */
export const gravityLoss = (
  g: number | readonly number[],
  gamma: readonly Radians[],
  dt: number
): number => {
  if (!Number.isFinite(dt))
    throw new TypeError(`dt must be a finite number. Received: ${dt}`);

  if (dt <= 0) throw new RangeError(`dt must be > 0. Received: ${dt}`);

  if (gamma.length < 2)
    throw new RangeError(
      `gamma must have at least 2 samples. Received: ${gamma.length}`
    );

  if (typeof g !== 'number' && g.length !== gamma.length)
    throw new TypeError(
      `g must be a number or have one sample per gamma. Received: ${g.length} for ${gamma.length}`
    );

  const at = (i: number) => {
    const gi = typeof g === 'number' ? g : g[i];

    if (!Number.isFinite(gi))
      throw new TypeError(`g must be finite. Received: ${gi} at ${i}`);

    if (gi < 0) throw new RangeError(`g must be >= 0. Received: ${gi} at ${i}`);

    if (!Number.isFinite(gamma[i]))
      throw new TypeError(
        `gamma must be finite. Received: ${gamma[i]} at ${i}`
      );

    return gi * Math.sin(gamma[i]);
  };

  let loss = 0;
  let previous = at(0);

  for (let i = 1; i < gamma.length; i++) {
    const current = at(i);

    loss += ((previous + current) / 2) * dt;
    previous = current;
  }

  return loss;
};
