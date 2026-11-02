import type {
  OdeRightHandSideType,
  OdeSolutionInterface
} from '@interstellar-tools/types';

/**
 * Take one **fourth-order Runge–Kutta** step of a system of ODEs, $ \dot{\mathbf y} = f(t, \mathbf y) $.
 *
 * $$
 * \mathbf y_{n+1} = \mathbf y_n + \frac{h}{6}\left(\mathbf k_1 + 2\mathbf k_2 + 2\mathbf k_3 + \mathbf k_4\right)
 * $$
 *
 * with $ \mathbf k_1 = f(t, \mathbf y) $, $ \mathbf k_2 = f(t + h/2, \mathbf y + h\mathbf k_1/2) $,
 * $ \mathbf k_3 = f(t + h/2, \mathbf y + h\mathbf k_2/2) $ and $ \mathbf k_4 = f(t + h, \mathbf y + h\mathbf k_3) $.
 *
 * ::: info Notes
 *
 * - The error per step shrinks as $ h^5 $, and over a fixed interval as $ h^4 $: halving the step makes the result about 16 times more accurate.
 * - A fixed step suits smooth problems. Close passes, where the forces change quickly, need a step small enough for the closest one.
 * - `h` may be negative, to integrate backwards.
 *
 * :::
 *
 * @param f - The right-hand side $ f(t, \mathbf y) $, returning an array as long as `y`.
 * @param t - Time $ t $ at the start of the step (finite).
 * @param y - State $ \mathbf y $ at `t` (finite components).
 * @param h - Step size $ h $ (finite, non-zero).
 * @returns The state at `t + h`.
 * @throws {TypeError} If `t`, `h` or a component of `y` is not finite, or `f` returns an array of the wrong length.
 * @throws {RangeError} If `h` is zero.
 * @group Helpers
 *
 * @example
 * ```ts
 * // dy/dt = y from y = 1: one step of 0.1 gives e^0.1 to 7 digits
 * rk4Step((_t, [y]) => [y], 0, [1], 0.1); // [1.1051708...]
 * ```
 *
 * @see {@link rk4Integrate}
 * @see https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods Runge–Kutta methods
 */
export const rk4Step = (
  f: OdeRightHandSideType,
  t: number,
  y: readonly number[],
  h: number
): number[] => {
  if (!Number.isFinite(t))
    throw new TypeError(`t must be a finite number. Received: ${t}`);

  if (!Number.isFinite(h))
    throw new TypeError(`h must be a finite number. Received: ${h}`);

  if (h === 0) throw new RangeError('h must not be zero.');

  for (const v of y)
    if (!Number.isFinite(v))
      throw new TypeError(`y must have finite components. Received: ${v}`);

  const n = y.length;
  const call = (time: number, state: readonly number[]) => {
    const d = f(time, state);

    if (d.length !== n)
      throw new TypeError(
        `f must return ${n} components, one per state component. Received: ${d.length}`
      );

    return d;
  };
  const along = (k: readonly number[], s: number) =>
    y.map((v, i) => v + s * k[i]);
  const k1 = call(t, y);
  const k2 = call(t + h / 2, along(k1, h / 2));
  const k3 = call(t + h / 2, along(k2, h / 2));
  const k4 = call(t + h, along(k3, h));

  return y.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
};

/**
 * **Integrate** a system of ODEs from `t0` to `t1` in fixed fourth-order Runge–Kutta steps.
 *
 * Takes `steps` steps of $ h = (t_1 - t_0)/\text{steps} $ with {@link rk4Step}, and returns the
 * state after each, starting with `y0` at `t0`.
 *
 * ::: info Notes
 *
 * - `stop(t, y)`, if given, is checked after every step; when it returns `true` the integration ends there, and the last sample is the state that triggered it. Use it to catch a crash into a body, or a crossing.
 * - `every` keeps only every n-th sample (the last one is always kept), to save memory on long runs.
 * - `t1` may be before `t0`, to integrate backwards.
 *
 * :::
 *
 * @param f - The right-hand side $ f(t, \mathbf y) $.
 * @param y0 - State at `t0` (finite components).
 * @param t0 - Start time (finite).
 * @param t1 - End time (finite, not equal to `t0`).
 * @param steps - Number of steps (integer, >= 1).
 * @param options - `stop`, a function that ends the integration early, and `every`, the sampling interval (integer, >= 1; default 1).
 * @returns The times and states, `t[k]` with `y[k]`.
 * @throws {TypeError} If a number is not finite, or `steps` or `every` is not an integer.
 * @throws {RangeError} If `t1 = t0`, `steps < 1` or `every < 1`.
 * @group Helpers
 *
 * @example
 * ```ts
 * // A harmonic oscillator over one period: back where it started
 * const { y } = rk4Integrate((_t, [x, v]) => [v, -x], [1, 0], 0, 2 * Math.PI, 1000);
 * y[y.length - 1]; // ≈ [1, 0]
 * ```
 *
 * @see {@link rk4Step}
 */
export const rk4Integrate = (
  f: OdeRightHandSideType,
  y0: readonly number[],
  t0: number,
  t1: number,
  steps: number,
  options: {
    stop?: (t: number, y: readonly number[]) => boolean;
    every?: number;
  } = {}
): OdeSolutionInterface => {
  const { stop, every = 1 } = options;

  for (const [name, v] of [
    ['t0', t0],
    ['t1', t1],
    ['steps', steps],
    ['every', every]
  ] as const) {
    if (!Number.isFinite(v))
      throw new TypeError(`${name} must be a finite number. Received: ${v}`);
  }

  if (!Number.isInteger(steps))
    throw new TypeError(`steps must be an integer. Received: ${steps}`);

  if (!Number.isInteger(every))
    throw new TypeError(`every must be an integer. Received: ${every}`);

  if (t1 === t0) throw new RangeError('t1 must differ from t0.');

  if (steps < 1) throw new RangeError(`steps must be >= 1. Received: ${steps}`);

  if (every < 1) throw new RangeError(`every must be >= 1. Received: ${every}`);

  const h = (t1 - t0) / steps;
  const t = [t0];
  const y = [[...y0]];

  let state: number[] = [...y0];

  for (let k = 1; k <= steps; k++) {
    state = rk4Step(f, t0 + (k - 1) * h, state, h);

    const time = k === steps ? t1 : t0 + k * h;
    const done = stop?.(time, state) ?? false;

    if (k % every === 0 || k === steps || done) {
      t.push(time);
      y.push(state);
    }

    if (done) break;
  }

  return { t, y };
};
