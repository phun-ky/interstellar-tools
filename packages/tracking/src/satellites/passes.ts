import { sunPosition } from '@interstellar-tools/equations';
import type {
  GeodeticCoordinatesInterface,
  LookAnglesInterface,
  MeanElementsInterface,
  Radians,
  SatellitePassInterface
} from '@interstellar-tools/types';

import { temeToEarthFixed } from './earth-fixed.js';
import { lookAngles, lookAnglesFromEarthFixed } from './look-angles.js';
import { propagate } from './propagate.js';
import { earthShadow } from './shadow.js';

// Golden-section ratio, for the search for the highest point
const INV_PHI = (Math.sqrt(5) - 1) / 2;

/** Options for {@link predictPasses}. */
export interface PredictPassesOptionsInterface {
  /** The elevation that counts as rising and setting, in **radians**: 0 by default, the horizon. */
  minElevation?: Radians;
  /** The coarse step in **s**: a 180th of the orbital period by default, 31 s for the ISS. */
  step?: number;
}

/** Options for {@link isVisiblePass}. */
export interface IsVisiblePassOptionsInterface {
  /** The highest the Sun may be for the observer, in **radians**: -6° by default, the end of civil twilight. */
  sunElevation?: Radians;
}

// The moments a visible pass is checked at: every 10 s at most
const VISIBLE_STEP_MS = 10_000;
const assertDate = (name: string, date: Date): number => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new TypeError(
      `${name} must be a valid Date. Received: ${String(date)}`
    );

  return date.getTime();
};

/**
 * **Predict the passes** of a satellite over a ground observer between two
 * moments: when it rises above the horizon, when it's highest, and when it
 * sets. It's the first question a tracking app answers.
 *
 * Steps through the window in coarse steps, finds where the elevation from
 * {@link lookAngles} crosses the minimum, and refines each crossing by
 * bisection to the millisecond. The highest point is refined by a
 * golden-section search around the highest step.
 *
 * ::: info Notes
 *
 * - **Accuracy**: no better than the elements. Rise and set times are good to
 *   seconds with elements a day old, and drift by tens of seconds a day
 *   after that, more for low orbits. Use fresh elements.
 * - Only whole passes are returned: a pass already in progress at `from`, or
 *   still in progress at `to`, is left out. A geostationary satellite never
 *   rises or sets, so it has no passes, above the horizon or not.
 * - A pass shorter than the step, grazing the minimum elevation, can be
 *   missed. Pass a smaller `step` to catch those.
 * - The elevation is geometric: refraction makes a satellite visible about
 *   half a degree below the horizon, a few seconds earlier.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param observer - The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**.
 * @param from - Start of the window, as a `Date`.
 * @param to - End of the window, as a `Date` after `from`.
 * @param options - `minElevation` in **radians** (in (-π/2, π/2), default 0) and the coarse `step` in **s** (finite, > 0).
 * @returns The passes in the window, in order: see {@link SatellitePassInterface}.
 * @throws {TypeError} If `from` or `to` is not a valid `Date`, an option is not a finite number, or a value of `elements` or `observer` is not a finite number.
 * @throws {RangeError} If `to` is not after `from`, `minElevation` is outside (-π/2, π/2), `step <= 0`, or SGP4 fails within the window, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
 * const from = new Date('2026-11-04T12:00:00Z');
 * const to = new Date('2026-11-05T12:00:00Z');
 *
 * for (const pass of predictPasses(iss, oslo, from, to, { minElevation: toRad(10) }))
 *   console.log(pass.rise.toISOString(), toDeg(pass.maxElevation));
 * ```
 *
 * @see {@link lookAngles}
 */
export const predictPasses = (
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  from: Date,
  to: Date,
  options: PredictPassesOptionsInterface = {}
): SatellitePassInterface[] => {
  const start = assertDate('from', from);
  const end = assertDate('to', to);
  const min = options.minElevation ?? 0;
  const { step } = options;

  if (end <= start)
    throw new RangeError(
      `to must be after from. Received: ${to.toISOString()}, from ${from.toISOString()}`
    );

  for (const [name, value] of [
    ['minElevation', min],
    ['step', step ?? 1]
  ] as const)
    if (!Number.isFinite(value))
      throw new TypeError(
        `${name} must be a finite number. Received: ${value}`
      );

  if (Math.abs(min) >= Math.PI / 2)
    throw new RangeError(
      `minElevation must be in (-π/2, π/2). Received: ${min}`
    );

  if (step !== undefined && step <= 0)
    throw new RangeError(`step must be > 0. Received: ${step}`);

  const at = (ms: number): LookAnglesInterface =>
    lookAngles(elements, observer, new Date(ms));
  const above = (ms: number) => at(ms).elevation > min;
  // The edge between two moments either side of the minimum elevation: the
  // last millisecond on lo's side, and the first on hi's
  const edge = (lo: number, hi: number): [number, number] => {
    const loAbove = above(lo);

    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);

      if (above(mid) === loAbove) lo = mid;
      else hi = mid;
    }

    return [lo, hi];
  };
  // The highest point between a and b, to the millisecond
  const highest = (a: number, b: number): number => {
    let c = b - INV_PHI * (b - a);
    let d = a + INV_PHI * (b - a);
    let ec = at(c).elevation;
    let ed = at(d).elevation;

    while (b - a > 1) {
      if (ec > ed) {
        b = d;
        d = c;
        ed = ec;
        c = b - INV_PHI * (b - a);
        ec = at(c).elevation;
      } else {
        a = c;
        c = d;
        ec = ed;
        d = a + INV_PHI * (b - a);
        ed = at(d).elevation;
      }
    }

    return Math.round((a + b) / 2);
  };

  // The first look also checks the elements and the observer
  let up0 = above(start);

  // A 180th of the period, within 5 s and 5 min
  const period = (2 * Math.PI) / elements.meanMotion;
  const stepMs = Math.max(
    1,
    Math.round(1000 * (step ?? Math.min(Math.max(period / 180, 5), 300)))
  );
  const passes: SatellitePassInterface[] = [];

  let t0 = start;
  // A pass in progress at `from` has no rise: skip it
  let rise: number | undefined;
  let best = 0;
  let bestElevation = -Infinity;

  while (t0 < end) {
    const t1 = Math.min(t0 + stepMs, end);
    const elevation = at(t1).elevation;
    const up1 = elevation > min;

    if (!up0 && up1) {
      rise = edge(t0, t1)[1];
      best = t1;
      bestElevation = elevation;
    } else if (up1 && rise !== undefined && elevation > bestElevation) {
      best = t1;
      bestElevation = elevation;
    } else if (up0 && !up1 && rise !== undefined) {
      const set = edge(t0, t1)[0];
      const culmination = highest(
        Math.max(rise, best - stepMs),
        Math.min(set, best + stepMs)
      );
      const top = at(culmination);

      passes.push({
        rise: new Date(rise),
        riseAzimuth: at(rise).azimuth,
        culmination: new Date(culmination),
        culminationAzimuth: top.azimuth,
        maxElevation: top.elevation,
        set: new Date(set),
        setAzimuth: at(set).azimuth
      });
      rise = undefined;
    }

    t0 = t1;
    up0 = up1;
  }

  return passes;
};

/**
 * Whether a pass is a **visible pass**: the satellite lit by the Sun while the
 * sky is dark for the observer, so it can be seen with the eye, a bright star
 * moving steadily across the sky.
 *
 * Checks the pass every 10 s from rise to set. It's visible if, at any of
 * those moments, the Sun is below `sunElevation` for the observer and the
 * satellite is not in Earth's umbra ({@link earthShadow}).
 *
 * ::: info Notes
 *
 * - The default -6°, the end of civil twilight, is when the brightest stars
 *   come out. Pass -12° for a properly dark sky, or 0 to count any pass after
 *   sunset.
 * - A satellite is easiest to see shortly after sunset or before sunrise: high
 *   up, it's still in sunlight while the ground is dark. Around midnight in
 *   winter, it's usually in Earth's shadow.
 * - Whether it's bright enough depends on its size and how the Sun catches it.
 *   The ISS is among the brightest objects in the night sky.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param observer - The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**.
 * @param pass - A pass from {@link predictPasses}; only its `rise` and `set` are used.
 * @param options - `sunElevation` in **radians** (in [-π/2, π/2], default -6°).
 * @returns `true` if the satellite can be seen during the pass.
 * @throws {TypeError} If `rise` or `set` is not a valid `Date`, `sunElevation` is not a finite number, or a value of `elements` or `observer` is not a finite number.
 * @throws {RangeError} If `set` is before `rise`, `sunElevation` is outside [-π/2, π/2], or SGP4 fails during the pass, as in {@link propagate}.
 * @group Satellites
 *
 * @example
 * ```ts
 * const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
 * const from = new Date('2026-11-04T12:00:00Z');
 * const to = new Date('2026-11-11T12:00:00Z');
 * const visible = predictPasses(iss, oslo, from, to).filter((pass) =>
 *   isVisiblePass(iss, oslo, pass)
 * );
 * ```
 *
 * @see {@link predictPasses}
 * @see {@link earthShadow}
 */
export const isVisiblePass = (
  elements: MeanElementsInterface,
  observer: GeodeticCoordinatesInterface,
  pass: SatellitePassInterface,
  options: IsVisiblePassOptionsInterface = {}
): boolean => {
  const rise = assertDate('rise', pass?.rise);
  const set = assertDate('set', pass?.set);
  const maxSun = options.sunElevation ?? -Math.PI / 30;

  if (set < rise)
    throw new RangeError(
      `set must not be before rise. Received: ${pass.set.toISOString()}, rise ${pass.rise.toISOString()}`
    );

  if (!Number.isFinite(maxSun))
    throw new TypeError(
      `sunElevation must be a finite number. Received: ${maxSun}`
    );

  if (Math.abs(maxSun) > Math.PI / 2)
    throw new RangeError(
      `sunElevation must be in [-π/2, π/2]. Received: ${maxSun}`
    );

  const steps = Math.max(1, Math.ceil((set - rise) / VISIBLE_STEP_MS));

  for (let k = 0; k <= steps; k++) {
    const date = new Date(rise + Math.round(((set - rise) * k) / steps));
    const sun = sunPosition(date).r;
    const { elevation } = lookAnglesFromEarthFixed(
      temeToEarthFixed({ r: sun, v: [0, 0, 0] }, date),
      observer
    );

    if (
      elevation <= maxSun &&
      earthShadow(propagate(elements, date).r, sun) !== 'umbra'
    )
      return true;
  }

  return false;
};
