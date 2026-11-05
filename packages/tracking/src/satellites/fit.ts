import {
  JULIAN_DATE_UNIX_EPOCH,
  MILLISECONDS_PER_DAY
} from '@interstellar-tools/constants';
import { stateToElements } from '@interstellar-tools/equations';
import type {
  EphemerisSampleInterface,
  MeanElementsInterface,
  Radians
} from '@interstellar-tools/types';

import { propagateMinutes } from './propagate.js';
import { assertDate, assertVector } from './validate.js';

/** Options for {@link fitElements}. */
export interface FitElementsOptionsInterface {
  /** Elements to start from, such as the last published TLE: the fit converges faster, and keeps their catalogue number, name, designator and bookkeeping. */
  initial?: MeanElementsInterface;
  /** Hold B* at this value, in **1/R⊕**, instead of fitting it: for arcs shorter than a day or so, which drag hasn't had time to shape. */
  bstar?: number;
}

/** How far a fitted element set is from one of the states it was fitted to. */
export interface ElementFitResidualInterface {
  /** The moment of the state. */
  epoch: Date;
  /** The distance between SGP4's position and the state's, in **m**. */
  position: number;
  /** The difference between the velocities, in **m/s**. */
  velocity: number;
}

/** The result of {@link fitElements}. */
export interface ElementFitInterface {
  /** The fitted mean elements, for {@link propagate}, {@link formatTle} and {@link formatOmm}. */
  elements: MeanElementsInterface;
  /** The root mean square of the residuals: `position` in **m**, `velocity` in **m/s**. */
  rms: { position: number; velocity: number };
  /** The residual at each state, in time order. */
  residuals: ElementFitResidualInterface[];
  /** The number of least-squares steps taken, over all stages. */
  iterations: number;
  /** Whether the last stage converged within 50 steps. If not, the elements are the best found, and the residuals say how good they are. */
  converged: boolean;
}

// WGS-72's gravitational parameter, which SGP4 uses, in m³/s²
const MU = 3.986008e14;
const TWO_PI = 2 * Math.PI;
const MAX_ITERATIONS = 50;
// The fit has converged when a step improves the sum of squares by less than
// this fraction
const TOLERANCE = 1e-10;
const wrap = (angle: number) => ((angle % TWO_PI) + TWO_PI) % TWO_PI;

// The fit works in equinoctial elements, which stay smooth for the circular
// and equatorial orbits classical elements are singular at: mean motion,
// the eccentricity vector (f, g), the mean longitude L, the node vector
// (χ, ψ), and B*
type ParametersType = [
  n: number,
  f: number,
  g: number,
  L: number,
  chi: number,
  psi: number,
  bstar: number
];

const toParameters = (elements: MeanElementsInterface): ParametersType => {
  const periapsis = elements.raan + elements.argp;
  const t = Math.tan(elements.i / 2);

  return [
    elements.meanMotion,
    elements.e * Math.cos(periapsis),
    elements.e * Math.sin(periapsis),
    periapsis + elements.meanAnomaly,
    t * Math.sin(elements.raan),
    t * Math.cos(elements.raan),
    elements.bstar
  ];
};
const toElements = (
  [n, f, g, L, chi, psi, bstar]: ParametersType,
  template: MeanElementsInterface
): MeanElementsInterface | undefined => {
  const e = Math.hypot(f, g);

  if (!(n > 0 && e < 1)) return undefined;

  const periapsis = Math.atan2(g, f);
  const raan = Math.atan2(chi, psi);

  return {
    ...template,
    meanMotion: n,
    meanMotionDot: 0,
    meanMotionDdot: 0,
    e,
    i: (2 * Math.atan(Math.hypot(chi, psi))) as Radians,
    raan: wrap(raan) as Radians,
    argp: wrap(periapsis - raan) as Radians,
    meanAnomaly: wrap(L - periapsis) as Radians,
    bstar
  };
};
// Mean elements near the states, from the osculating elements of the one
// nearest the epoch
const firstGuess = (
  sample: EphemerisSampleInterface,
  template: MeanElementsInterface,
  epochMs: number,
  bstar: number
): ParametersType => {
  const { a, e, i, raan, argp, nu } = stateToElements(sample.r, sample.v, MU);

  if (!(e < 1))
    throw new RangeError(
      `states must be of a closed orbit around Earth. Received: e = ${e} at ${sample.epoch.toISOString()}`
    );

  const n = Math.sqrt(MU / a ** 3);
  const E =
    2 *
    Math.atan2(
      Math.sqrt(1 - e) * Math.sin(nu / 2),
      Math.sqrt(1 + e) * Math.cos(nu / 2)
    );
  const meanAnomaly =
    E - e * Math.sin(E) + (n * (epochMs - sample.epoch.getTime())) / 1000;

  return toParameters({
    ...template,
    meanMotion: n,
    e,
    i,
    raan,
    argp,
    meanAnomaly: wrap(meanAnomaly) as Radians,
    bstar
  });
};
// Solve the small system A x = b by Gaussian elimination. A is symmetric and
// positive definite, so it needs no pivoting; a singular one gives NaN, which
// the fit rejects
const solve = (A: number[][], b: number[]): number[] => {
  const size = b.length;
  const m = A.map((row, k) => [...row, b[k]!]);

  for (let col = 0; col < size; col++)
    for (let row = col + 1; row < size; row++) {
      const factor = m[row]![col]! / m[col]![col]!;

      for (let k = col; k <= size; k++) m[row]![k]! -= factor * m[col]![k]!;
    }

  const x = new Array<number>(size).fill(0);

  for (let row = size - 1; row >= 0; row--) {
    let sum = m[row]![size]!;

    for (let k = row + 1; k < size; k++) sum -= m[row]![k]! * x[k]!;

    x[row] = sum / m[row]![row]!;
  }

  return x;
};

/**
 * **Fit SGP4 mean elements** to a satellite's positions and velocities: turn
 * a team's own orbit predictions, or the GPS fixes from on board, into a TLE
 * or OMM that standard tools and ground station networks can use.
 *
 * It's a **differential correction**, the way element sets are made: start
 * from a guess, propagate it with SGP4 to each state, and adjust the elements
 * by least squares until SGP4's positions and velocities match the states
 * best.
 *
 * $$
 * \min_{\mathbf x} \sum_k \lVert \mathbf r_{\text{SGP4}}(t_k; \mathbf x) - \mathbf r_k \rVert^2
 * + \frac{1}{n^2}\,\lVert \mathbf v_{\text{SGP4}}(t_k; \mathbf x) - \mathbf v_k \rVert^2
 * $$
 *
 * Where:
 * - $ \mathbf x $ are the elements: mean motion, eccentricity, inclination, node, argument of perigee, mean anomaly and B*
 * - $ \mathbf r_k, \mathbf v_k $ is the state at time $ t_k $
 * - $ 1/n $, the inverse of the mean motion, weighs a velocity error like the position error it grows into over a radian of orbit
 *
 * **Units**
 * - Inputs: `r` in **m** and `v` in **m/s**, in the **TEME** frame.
 * - Output: mean elements in radians and rad/s; residuals in **m** and **m/s**.
 *
 * ::: info Notes
 *
 * - **The states must be in TEME**, the frame SGP4 works in. Turn Earth-fixed
 *   GPS fixes into it with {@link earthFixedToTeme} first.
 * - **Use a day or more of states** to fit B*, the drag term: over a shorter
 *   arc, drag hasn't had time to show. Fitted to two hours of the ISS with
 *   10 m of noise, B* comes out tens of percent off, and the position a day
 *   later hundreds of metres to kilometres; fitted to two days, a few
 *   metres. Pass a fixed `bstar`, such as the last published one, for a
 *   short arc.
 * - **Cover at least a whole orbit**: from part of one, the period and
 *   eccentricity are hard to tell apart.
 * - **The residuals show the quality**. States from SGP4 itself fit to
 *   micrometres, and noisy ones to their noise. States from a more accurate
 *   model leave residuals, as SGP4 is an approximation: typically a few
 *   hundred metres to a few kilometres over days. Much larger residuals mean
 *   bad states, or an orbit SGP4 can't follow, such as one with a manoeuvre
 *   in it.
 * - **Put the epoch at the end of the arc** to predict ahead: the elements
 *   are best near their epoch, and that's where the next passes are.
 * - The fit starts on the states within an orbit of the epoch, and widens the
 *   arc fourfold at a time, so a rough first guess still converges.
 * - **Check `converged`**: a fit that doesn't settle within 50 steps returns
 *   the best elements it found. That happens for nearly equatorial orbits,
 *   below about 0.01°, where SGP4 flips the node as the inclination crosses
 *   zero.
 * - The derivatives of the mean motion are set to 0: SGP4 doesn't use them.
 * - Without `initial`, the catalogue number and bookkeeping are 0 and the
 *   classification `U`: set your own before exporting, as in the example.
 *
 * :::
 *
 * @param states - The positions `r` in **m** and velocities `v` in **m/s** in TEME, with their `epoch`s: at least 2, of one satellite.
 * @param epoch - The epoch of the fitted elements, as a `Date`.
 * @param options - `initial`, elements to start from; `bstar`, a fixed B* in **1/R⊕**.
 * @returns The fitted `elements`, the `rms` and per-state `residuals`, the number of `iterations`, and whether the fit `converged`.
 * @throws {TypeError} If `states` is not an array of states with a valid `Date` and three finite numbers each, `epoch` is not a valid `Date`, or `bstar` is not a finite number.
 * @throws {RangeError} If there are fewer than 2 states, they aren't of a closed orbit, or SGP4 fails on the first guess: give `initial` elements then.
 * @group Satellites
 *
 * @example
 * ```ts
 * // Two days of the team's own predictions, every minute, in TEME
 * const fit = fitElements(states, new Date('2026-11-06T00:00:00Z'));
 *
 * fit.converged; // true
 * fit.rms.position; // in m: how far SGP4 is from the states
 * formatTle({ ...fit.elements, catalogNumber: 99_999, objectId: '2026-123A' });
 * ```
 *
 * @see {@link propagate}
 * @see {@link formatTle}
 * @see {@link formatOmm}
 * @see https://celestrak.org/publications/AIAA/2008-6770/ Vallado & Crawford (2008), SGP4 Orbit Determination
 */
export const fitElements = (
  states: readonly EphemerisSampleInterface[],
  epoch: Date,
  options: FitElementsOptionsInterface = {}
): ElementFitInterface => {
  if (!Array.isArray(states))
    throw new TypeError(
      `states must be an array of states. Received: ${String(states)}`
    );

  if (states.length < 2)
    throw new RangeError(
      `states must hold at least 2 states. Received: ${states.length}`
    );

  states.forEach((state, k) => {
    assertDate(`states[${k}].epoch`, state?.epoch);
    assertVector(`states[${k}].r`, state.r);
    assertVector(`states[${k}].v`, state.v);
  });

  const epochMs = assertDate('epoch', epoch);
  const { initial, bstar } = options;

  if (bstar !== undefined && !Number.isFinite(bstar))
    throw new TypeError(`bstar must be a finite number. Received: ${bstar}`);

  // Check the initial elements by propagating them
  if (initial !== undefined) propagateMinutes(initial, 0);

  const sorted = [...states].sort(
    (a, b) => a.epoch.getTime() - b.epoch.getTime()
  );
  const template: MeanElementsInterface = {
    catalogNumber: 0,
    classification: 'U',
    elementSetNumber: 0,
    revolutionNumber: 0,
    ...initial,
    epoch: new Date(epochMs),
    epochJulianDate: JULIAN_DATE_UNIX_EPOCH + epochMs / MILLISECONDS_PER_DAY,
    meanMotion: 0,
    meanMotionDot: 0,
    meanMotionDdot: 0,
    e: 0,
    i: 0 as Radians,
    raan: 0 as Radians,
    argp: 0 as Radians,
    meanAnomaly: 0 as Radians,
    bstar: 0
  };
  const distance = (state: EphemerisSampleInterface) =>
    Math.abs(state.epoch.getTime() - epochMs);
  const nearest = sorted.reduce((a, b) => (distance(b) < distance(a) ? b : a));

  // From initial elements, move the mean anomaly on to the epoch
  let parameters: ParametersType = initial
    ? toParameters({
        ...initial,
        meanAnomaly: wrap(
          initial.meanAnomaly +
            (initial.meanMotion *
              (epochMs -
                (initial.epochJulianDate - JULIAN_DATE_UNIX_EPOCH) *
                  MILLISECONDS_PER_DAY)) /
              1000
        ) as Radians,
        bstar: bstar ?? initial.bstar
      })
    : firstGuess(nearest, template, epochMs, bstar ?? 0);

  // Velocity errors count like the position error they grow into over a
  // radian of orbit
  const weight = 1 / parameters[0];
  // The residuals of every state, in m: 3 for the position, then 3 for the
  // weighted velocity; undefined if SGP4 fails on the elements
  const residualsOf = (
    p: ParametersType,
    arc: readonly EphemerisSampleInterface[]
  ): number[] | undefined => {
    const elements = toElements(p, template);

    if (!elements) return undefined;

    const out: number[] = [];

    try {
      for (const state of arc) {
        const { r, v } = propagateMinutes(
          elements,
          (state.epoch.getTime() - epochMs) / 60_000
        );

        out.push(
          r[0] - state.r[0],
          r[1] - state.r[1],
          r[2] - state.r[2],
          (v[0] - state.v[0]) * weight,
          (v[1] - state.v[1]) * weight,
          (v[2] - state.v[2]) * weight
        );
      }
    } catch {
      return undefined;
    }

    return out;
  };
  const sumOfSquares = (residuals: readonly number[]) =>
    residuals.reduce((sum, x) => sum + x * x, 0);

  let iterations = 0;

  const free = bstar === undefined ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5];
  // One least-squares fit by Levenberg-Marquardt, on an arc of the states:
  // whether it converged
  const fit = (arc: readonly EphemerisSampleInterface[]): boolean => {
    let residuals = residualsOf(parameters, arc);

    if (!residuals)
      throw new RangeError(
        'SGP4 fails on the first guess: give initial elements closer to the orbit.'
      );

    let cost = sumOfSquares(residuals);
    let lambda = 1e-3;

    for (let step = 0; step < MAX_ITERATIONS; step++) {
      iterations++;

      // The Jacobian, column by column, from central differences
      const jacobian = free.map((j) => {
        const h =
          j === 0
            ? 1e-7 * parameters[0]
            : j === 6
              ? Math.max(1e-5 * Math.abs(parameters[6]), 1e-9)
              : 1e-7;
        const plus = [...parameters] as ParametersType;
        const minus = [...parameters] as ParametersType;

        plus[j] += h;
        minus[j] -= h;

        const up = residualsOf(plus, arc);
        const down = residualsOf(minus, arc);

        // At the edge of what SGP4 can propagate, hold the parameter this step
        return up && down
          ? up.map((x, k) => (x - down[k]!) / (2 * h))
          : new Array<number>(residuals!.length).fill(0);
      });
      // A parameter the states don't depend on at all, such as B* far above
      // the air, stays as it is
      const active = free.filter((_, k) => jacobian[k]!.some((x) => x !== 0));
      const columns = jacobian.filter((column) => column.some((x) => x !== 0));
      // The normal equations, JᵀJ δ = -Jᵀr
      const normal = columns.map((a) =>
        columns.map((b) => a.reduce((sum, x, k) => sum + x * b[k]!, 0))
      );
      const gradient = columns.map(
        (a) => -a.reduce((sum, x, k) => sum + x * residuals![k]!, 0)
      );

      let improved = false;

      // Damp the step until it lowers the sum of squares
      while (lambda < 1e12) {
        const damped = normal.map((row, k) =>
          row.map((x, l) => (k === l ? x * (1 + lambda) : x))
        );
        const delta = solve(damped, gradient);
        const trial = [...parameters] as ParametersType;

        active.forEach((j, k) => (trial[j] += delta[k]!));

        const trialResiduals = residualsOf(trial, arc);
        const trialCost = trialResiduals
          ? sumOfSquares(trialResiduals)
          : Infinity;

        if (trialCost < cost) {
          const gain = (cost - trialCost) / cost;

          parameters = trial;
          residuals = trialResiduals!;
          cost = trialCost;
          lambda = Math.max(lambda / 10, 1e-12);
          improved = true;

          if (gain < TOLERANCE) return true;

          break;
        }

        lambda *= 10;
      }

      // No step lowers it any more: at the minimum
      if (!improved) return true;
    }

    return false;
  };
  const orbit = (TWO_PI / parameters[0]) * 1000;

  // Widen the arc around the epoch fourfold at a time, so a rough guess
  // converges before it has to match states far from the epoch
  for (let width = orbit; ; width *= 4) {
    const arc = sorted.filter(
      (state) =>
        Math.abs(state.epoch.getTime() - nearest.epoch.getTime()) <= width
    );

    if (arc.length === sorted.length) break;

    if (arc.length >= 2) fit(arc);
  }

  const converged = fit(sorted);
  const elements = toElements(parameters, template)!;
  const residuals = sorted.map((state) => {
    const { r, v } = propagateMinutes(
      elements,
      (state.epoch.getTime() - epochMs) / 60_000
    );

    return {
      epoch: state.epoch,
      position: Math.hypot(
        r[0] - state.r[0],
        r[1] - state.r[1],
        r[2] - state.r[2]
      ),
      velocity: Math.hypot(
        v[0] - state.v[0],
        v[1] - state.v[1],
        v[2] - state.v[2]
      )
    };
  });
  const rms = (key: 'position' | 'velocity') =>
    Math.sqrt(
      residuals.reduce((sum, x) => sum + x[key] ** 2, 0) / residuals.length
    );

  return {
    elements,
    rms: { position: rms('position'), velocity: rms('velocity') },
    residuals,
    iterations,
    converged
  };
};
