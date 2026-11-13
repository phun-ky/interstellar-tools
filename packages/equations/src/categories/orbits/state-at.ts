import { convertTemporalUnit } from '@interstellar-tools/temporal';
import type {
  OrbitInterface,
  Radians,
  StateVectorInterface
} from '@interstellar-tools/types';

import { trueAnomalyAt } from '../anomalies/anomaly-at.js';
import { applyMatrix3 } from '../helpers/apply-matrix-3.js';
import { convertDistanceUnit } from '../helpers/convert-distance-unit.js';

import { elementsToState } from './elements-to-state.js';
import { orbitFrameToIcrf } from './orbit-frame-to-icrf.js';

const DEG = Math.PI / 180;

/**
 * Options for {@link stateAt}.
 *
 * @group Orbits
 */
export interface StateAtOptionsInterface {
  /**
   * The frame to give the state in:
   *
   * - `'icrf'` (the default): the ICRF, the J2000 equator and equinox, through
   *   {@link orbitFrameToIcrf}. The orbit needs a `frame` that can be placed
   *   there.
   * - `'reference'`: the coordinates of the orbit's own reference plane, `x` to
   *   where its `om` is counted from and `z` to its pole. An orbit without `i`
   *   is drawn flat in it, with `x` to its periapsis.
   */
  frame?: 'icrf' | 'reference';
}

/* node:coverage disable */
/**
 * The **position and velocity** of a body on its orbit at a given date, in 3D,
 * from a dataset orbit: its `a`, `e`, `period`, its true anomaly `angle` at
 * J2000, and its orientation `i`, `om` and `w` in its `frame`.
 *
 * ::: info
 *
 * - The true anomaly at `date` comes from {@link trueAnomalyAt}: the orbit's
 *   `angle` at J2000, moved on by its `period`.
 * - The state comes from {@link elementsToState}, with the gravitational
 *   parameter the orbit's own `a` and `period` imply, $\mu = 4\pi^2 a^3 / P^2$,
 *   so the speed agrees with the period. It's the parent's $\mu$ (and the
 *   body's, for a pair), for a body around its parent.
 * - It's relative to the orbit's parent: add the parent's own state to place
 *   a moon around the Sun, for example.
 * - A missing `om` or `w` counts as 0. An orbit without `i` is flat: in its
 *   reference plane, `retrograde: true` turns it backwards, as $i = 180°$.
 * - The orbit is a fixed ellipse: it doesn't precess. Good near J2000; the
 *   further from it, the more the real body has drifted.
 *
 * :::
 *
 * @param {OrbitInterface} orbit - An orbit, for example `body.orbit` from a dataset.
 * @param {Date} date - The date to find the body at.
 * @param {StateAtOptionsInterface} [options] - The frame to give the state in, `'icrf'` by default.
 * @returns {StateVectorInterface} The position `r` in metres and velocity `v` in metres per second,
 * relative to the orbit's parent.
 * @throws {TypeError} If `date` is not a valid `Date`.
 * @throws {RangeError} If the orbit's eccentricity is outside $0 \leq e < 1$.
 * @throws {RangeError} If `frame` is `'icrf'` and the orbit has no `frame`, or one that can't be
 * placed in the ICRF yet ({@link orbitFrameToIcrf}).
 *
 * @example
 * ```ts
 * import { AU_METERS, PLANETS } from '@interstellar-tools/constants';
 * import { stateAt } from '@interstellar-tools/equations';
 *
 * const mars = PLANETS.find((planet) => planet.id === 'mars')!;
 * const { r } = stateAt(mars.orbit!, new Date('2026-11-10T00:00:00Z'));
 *
 * r.map((m) => m / AU_METERS); // Mars from the Sun, in au, in the ICRF
 * ```
 *
 * @see {@link orbitFrameToIcrf} for the rotation to the ICRF.
 * @group Orbits
 */
/* node:coverage enable */
export const stateAt = (
  orbit: OrbitInterface,
  date: Date,
  options: StateAtOptionsInterface = {}
): StateVectorInterface => {
  const { frame = 'icrf' } = options;

  if (frame === 'icrf' && !orbit.frame)
    throw new RangeError(
      'This orbit has no frame, so it can only be placed in its own plane, with the reference frame option.'
    );

  const a = convertDistanceUnit(orbit.a, 'm').value;
  const period = convertTemporalUnit(orbit.period, 's').value;
  const mu = (4 * Math.PI ** 2 * a ** 3) / period ** 2;
  const flat = orbit.i === undefined;
  const i = flat ? (orbit.retrograde ? 180 : 0) : orbit.i!;
  const state = elementsToState(
    {
      a,
      e: orbit.e,
      i: (i * DEG) as Radians,
      raan: ((orbit.om ?? 0) * DEG) as Radians,
      argp: ((orbit.w ?? 0) * DEG) as Radians,
      nu: trueAnomalyAt(orbit, date)
    },
    mu
  );

  if (frame === 'reference') return state;

  const toIcrf = orbitFrameToIcrf(orbit.frame!);

  return { r: applyMatrix3(toIcrf, state.r), v: applyMatrix3(toIcrf, state.v) };
};
