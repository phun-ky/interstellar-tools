import type {
  EphemerisInterface,
  StateVectorInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';

/** Options for {@link stateAt}. */
export interface StateAtOptionsInterface {
  /** How many samples around the date to interpolate through, from 2 to 8: 4 by default, a polynomial of degree 7. */
  points?: number;
}

/**
 * The **state of a spacecraft at any moment** of an ephemeris: its position and
 * velocity, interpolated between the samples.
 *
 * Fits the Hermite polynomial through the positions and velocities of the
 * `points` samples around the date, a polynomial of degree $ 2n - 1 $ for
 * $ n $ samples, and evaluates it and its derivative:
 *
 * $$
 * \mathbf{r}(t) = \sum_{k=0}^{2n-1} c_k \prod_{j<k} (t - z_j), \qquad
 * \mathbf{v}(t) = \dot{\mathbf{r}}(t)
 * $$
 *
 * Where:
 * - $ z_0 = z_1 = t_0,\ z_2 = z_3 = t_1, \dots $ are the sample times, each twice
 * - $ c_k $ are the divided differences of the positions, with the velocities as the first differences at each sample
 *
 * **Units**
 * - Inputs: the ephemeris from {@link parseOem} or {@link parseHorizonsVectors}, and a `Date`.
 * - Output: `r` in **m** and `v` in **m/s**, from the ephemeris's centre, on its frame's axes.
 *
 * ::: info Notes
 *
 * - **Using the velocities** matches the slope as well as the position at each
 *   sample: the default 4 samples interpolate to degree 7, as the OEM standard's
 *   own example recommends, and follow a sharp perihelion that linear
 *   interpolation cuts across.
 * - At a sample's epoch, the sample is returned exactly.
 * - Only within the ephemeris: outside the first and last samples, it throws
 *   rather than extrapolate. Near either end, the samples are taken from the
 *   one side.
 * - The samples should be close enough to follow the motion: for a probe in
 *   cruise, a day apart; near a planet or the Sun, hours or minutes.
 *
 * :::
 *
 * @param ephemeris - The ephemeris, from {@link parseOem} or {@link parseHorizonsVectors}.
 * @param date - The moment, as a `Date`, within the ephemeris.
 * @param options - `points`, the number of samples to interpolate through (an integer from 2 to 8, default 4).
 * @returns The position `r` in **m** and velocity `v` in **m/s**: see {@link StateVectorInterface}.
 * @throws {TypeError} If `date` is not a valid `Date`, the ephemeris has no samples, or `points` is not an integer.
 * @throws {RangeError} If `date` is outside the ephemeris, or `points` is outside 2 to 8.
 * @group Probes
 *
 * @example
 * ```ts
 * const voyager1 = parseHorizonsVectors(text);
 * const { r, v } = stateAt(voyager1, new Date('2026-01-05T06:00:00Z'));
 *
 * Math.hypot(...r) / AU_METERS; // ≈ 169: au from the Sun
 * ```
 *
 * @see {@link parseOem}
 * @see {@link parseHorizonsVectors}
 */
export const stateAt = (
  ephemeris: EphemerisInterface,
  date: Date,
  options: StateAtOptionsInterface = {}
): StateVectorInterface => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new TypeError(`date must be a valid Date. Received: ${String(date)}`);

  const samples = ephemeris?.samples;

  if (!Array.isArray(samples) || samples.length === 0)
    throw new TypeError('ephemeris must have samples.');

  const { points = 4 } = options;

  if (!Number.isInteger(points))
    throw new TypeError(`points must be an integer. Received: ${points}`);

  if (points < 2 || points > 8)
    throw new RangeError(`points must be from 2 to 8. Received: ${points}`);

  const t = date.getTime();
  const first = samples[0]!.epoch;
  const last = samples[samples.length - 1]!.epoch;

  if (t < first.getTime() || t > last.getTime())
    throw new RangeError(
      `date must be within the ephemeris, ${first.toISOString()} to ${last.toISOString()}. Received: ${date.toISOString()}`
    );

  // The last sample at or before the date
  let lo = 0;
  let hi = samples.length - 1;

  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);

    if (samples[mid]!.epoch.getTime() <= t) lo = mid;
    else hi = mid - 1;
  }

  const at = samples[lo]!;

  if (at.epoch.getTime() === t)
    return {
      r: [at.r[0], at.r[1], at.r[2]],
      v: [at.v[0], at.v[1], at.v[2]]
    };

  // The samples around the date, as many before as after where they can be
  const n = Math.min(points, samples.length);
  const from = Math.min(
    Math.max(lo - Math.floor((n - 1) / 2), 0),
    samples.length - n
  );
  const window = samples.slice(from, from + n);
  // Time in units of the window's span, from the date: well scaled for the
  // divided differences
  const span =
    (window[n - 1]!.epoch.getTime() - window[0]!.epoch.getTime()) / 1000;
  const z = window.flatMap(({ epoch }) => {
    const tau = (epoch.getTime() - t) / 1000 / span;

    return [tau, tau];
  });
  const component = (k: 0 | 1 | 2): [number, number] => {
    const c = window.flatMap(({ r }) => [r[k], r[k]]);

    // Divided differences in place; at a repeated time, the first difference
    // is the velocity, in metres per span
    for (let j = 1; j < 2 * n; j++)
      for (let i = 2 * n - 1; i >= j; i--)
        c[i] =
          j === 1 && i % 2 === 1
            ? window[(i - 1) / 2]!.v[k] * span
            : (c[i]! - c[i - 1]!) / (z[i]! - z[i - j]!);

    // The polynomial and its derivative at the date, tau = 0
    let p = c[2 * n - 1]!;
    let dp = 0;

    for (let i = 2 * n - 2; i >= 0; i--) {
      dp = dp * -z[i]! + p;
      p = p * -z[i]! + c[i]!;
    }

    return [p, dp / span];
  };
  const [x, vx] = component(0);
  const [y, vy] = component(1);
  const [zz, vz] = component(2);
  const r: Vector3DTupleType = [x, y, zz];
  const v: Vector3DTupleType = [vx, vy, vz];

  return { r, v };
};
