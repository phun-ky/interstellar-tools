import type {
  OdeRightHandSideType,
  OdeSolutionInterface
} from '@interstellar-tools/types';

/** Options for {@link rk45Integrate}. */
export interface Rk45IntegrateOptionsInterface {
  /** Relative tolerance on each step's error. Defaults to `1e-9`. */
  tolerance?: number;
  /** Absolute tolerance on each step's error, in the units of `y`. Defaults to `1e-9`. */
  absoluteTolerance?: number;
  /** The first step to try. Defaults to a hundredth of the interval. */
  initialStep?: number;
  /** The largest step to take. Defaults to the whole interval. */
  maxStep?: number;
  /** The most steps to take, accepted or rejected, before giving up. Defaults to `1e6`. */
  maxSteps?: number;
  /** Ends the integration early when it returns `true`, checked after every accepted step. */
  stop?: (t: number, y: readonly number[]) => boolean;
}

// The Dormand-Prince 5(4) tableau: the nodes, the stages, the fifth-order
// weights (the last stage row) and the error, fifth- minus fourth-order
const C = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
const A: readonly (readonly number[])[] = [
  [],
  [1 / 5],
  [3 / 40, 9 / 40],
  [44 / 45, -56 / 15, 32 / 9],
  [19_372 / 6561, -25_360 / 2187, 64_448 / 6561, -212 / 729],
  [9017 / 3168, -355 / 33, 46_732 / 5247, 49 / 176, -5103 / 18_656],
  [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
];
const E = [
  71 / 57_600,
  0,
  -71 / 16_695,
  71 / 1920,
  -17_253 / 339_200,
  22 / 525,
  -1 / 40
];

/**
 * **Integrate** a system of ODEs from `t0` to `t1` with **adaptive steps**:
 * the Dormand–Prince method, RK45, which takes long steps where the solution
 * is smooth and short ones where it changes fast, to keep each step's error
 * within a tolerance.
 *
 * Each step evaluates $ f $ six times (the seventh is the next step's first)
 * and gives two estimates, of fifth and fourth order. Their difference
 * estimates the step's error $ \mathbf e $, which sets the next step:
 *
 * $$
 * \text{err} = \sqrt{\frac{1}{n}\sum_i \left(\frac{e_i}{\text{atol} + \text{rtol}\,|y_i|}\right)^2},
 * \qquad
 * h_{\text{next}} = h \cdot \min\!\big(5, \max(0.2, 0.9\,\text{err}^{-1/5})\big)
 * $$
 *
 * A step with $ \text{err} > 1 $ is rejected and taken again, shorter.
 *
 * ::: info Notes
 *
 * - **Use it for orbits** that aren't circular: on an eccentric orbit, it
 *   steps quickly through apoapsis and slowly through periapsis, where
 *   {@link rk4Integrate} needs the short step everywhere.
 * - The tolerance bounds each step's error, not the total: errors add up over
 *   many steps. Tighten it until the answer stops changing.
 * - The solution holds the accepted steps, with `t1` exactly last. Their
 *   times are wherever the steps fell; for given times, integrate to each in
 *   turn.
 * - `t1` may be before `t0`, to integrate backwards.
 *
 * :::
 *
 * @param f - The right-hand side $ f(t, \mathbf y) $, returning an array as long as `y0`.
 * @param y0 - State at `t0` (finite components).
 * @param t0 - Start time (finite).
 * @param t1 - End time (finite, not equal to `t0`).
 * @param options - `tolerance` and `absoluteTolerance` (finite, > 0), `initialStep` and `maxStep` (finite, > 0), `maxSteps` (an integer >= 1), and `stop`.
 * @returns The times and states of the accepted steps, `t[k]` with `y[k]`, from `t0` to `t1`.
 * @throws {TypeError} If a number is not finite, `maxSteps` is not an integer, or `f` returns an array of the wrong length.
 * @throws {RangeError} If `t1 = t0`, an option is out of range, or the integration needs more than `maxSteps` steps, or a step too small to tell from rounding.
 * @group Helpers
 *
 * @example
 * ```ts
 * // A harmonic oscillator over one period: back where it started
 * const { t, y } = rk45Integrate((_t, [x, v]) => [v, -x], [1, 0], 0, 2 * Math.PI);
 *
 * y[y.length - 1]; // ≈ [1, 0], to 3e-9
 * t.length; // 94: the start, and the 93 steps it took
 * ```
 *
 * @see {@link rk4Integrate}
 * @see Dormand & Prince (1980), "A family of embedded Runge-Kutta formulae", _Journal of Computational and Applied Mathematics_ 6(1), 19-26
 * @see Hairer, Nørsett & Wanner, _Solving Ordinary Differential Equations I_, 2nd ed. (1993), section II.4
 */
export const rk45Integrate = (
  f: OdeRightHandSideType,
  y0: readonly number[],
  t0: number,
  t1: number,
  options: Rk45IntegrateOptionsInterface = {}
): OdeSolutionInterface => {
  const span = Math.abs(t1 - t0);
  const {
    tolerance = 1e-9,
    absoluteTolerance = 1e-9,
    initialStep = span / 100,
    maxStep = span,
    maxSteps = 1e6,
    stop
  } = options;

  for (const [name, x] of [
    ['t0', t0],
    ['t1', t1],
    ['tolerance', tolerance],
    ['absoluteTolerance', absoluteTolerance],
    ['initialStep', initialStep],
    ['maxStep', maxStep],
    ['maxSteps', maxSteps],
    ...y0.map((x, k) => [`y0[${k}]`, x] as const)
  ] as const)
    if (!Number.isFinite(x))
      throw new TypeError(`${name} must be a finite number. Received: ${x}`);

  if (!Number.isInteger(maxSteps))
    throw new TypeError(`maxSteps must be an integer. Received: ${maxSteps}`);

  if (t1 === t0) throw new RangeError('t1 must differ from t0.');

  for (const [name, x] of [
    ['tolerance', tolerance],
    ['absoluteTolerance', absoluteTolerance],
    ['initialStep', initialStep],
    ['maxStep', maxStep],
    ['maxSteps', maxSteps]
  ] as const)
    if (x <= 0) throw new RangeError(`${name} must be > 0. Received: ${x}`);

  const n = y0.length;
  const direction = Math.sign(t1 - t0);
  const call = (time: number, state: readonly number[]) => {
    const d = f(time, state);

    if (d.length !== n)
      throw new TypeError(
        `f must return ${n} components, one per state component. Received: ${d.length}`
      );

    return d;
  };
  const t = [t0];
  const y = [[...y0]];

  let time = t0;
  let state: readonly number[] = [...y0];
  let k1 = call(time, state);
  let h = Math.min(initialStep, maxStep);

  for (let step = 0; step < maxSteps; step++) {
    // The last step lands on t1
    const last = h >= Math.abs(t1 - time);

    if (last) h = Math.abs(t1 - time);

    if (h <= 4 * Number.EPSILON * Math.max(Math.abs(time), 1))
      throw new RangeError(
        `The step fell to ${h} at t = ${time}: the solution changes too fast to follow at this tolerance.`
      );

    const signed = direction * h;
    const k = [k1];

    let next: number[] = [];

    for (let stage = 1; stage < 7; stage++) {
      const row = A[stage]!;

      // The last stage's point is the fifth-order result
      next = state.map(
        (v, i) => v + signed * row.reduce((sum, a, j) => sum + a * k[j]![i]!, 0)
      );
      k.push(call(time + C[stage]! * signed, next));
    }

    const err = Math.sqrt(
      state.reduce((sum, v, i) => {
        const e = signed * E.reduce((acc, w, j) => acc + w * k[j]![i]!, 0);
        const scale =
          absoluteTolerance +
          tolerance * Math.max(Math.abs(v), Math.abs(next[i]!));

        return sum + (e / scale) ** 2;
      }, 0) / Math.max(n, 1)
    );

    if (err <= 1) {
      time = last ? t1 : time + signed;
      state = next;
      k1 = k[6]!;
      t.push(time);
      y.push([...next]);

      if (last || stop?.(time, state)) return { t, y };
    }

    h = Math.min(
      maxStep,
      h * (err === 0 ? 5 : Math.min(5, Math.max(0.2, 0.9 * err ** -0.2)))
    );
  }

  throw new RangeError(
    `The integration needs more than ${maxSteps} steps: loosen the tolerance, or raise maxSteps.`
  );
};
