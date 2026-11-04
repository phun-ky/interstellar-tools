import {
  JULIAN_DATE_UNIX_EPOCH,
  MILLISECONDS_PER_DAY
} from '@interstellar-tools/constants';
import type {
  MeanElementsInterface,
  StateVectorInterface
} from '@interstellar-tools/types';

import { sgp4, sgp4Init, type Sgp4Model } from './sgp4/model.js';

// Setting up the model is most of the work for a single position: do it once
// per element set
const MODELS = new WeakMap<MeanElementsInterface, Sgp4Model>();
const REQUIRED = [
  'epochJulianDate',
  'meanMotion',
  'e',
  'i',
  'raan',
  'argp',
  'meanAnomaly',
  'bstar'
] as const;
const modelFor = (elements: MeanElementsInterface): Sgp4Model => {
  const cached = MODELS.get(elements);

  if (cached) return cached;

  if (typeof elements !== 'object' || elements === null)
    throw new TypeError(
      `elements must be mean elements from parseTle or parseOmm. Received: ${String(elements)}`
    );

  for (const key of REQUIRED)
    if (!Number.isFinite(elements[key]))
      throw new TypeError(
        `elements.${key} must be a finite number. Received: ${elements[key]}`
      );

  if (elements.meanMotion <= 0)
    throw new RangeError(
      `elements.meanMotion must be > 0. Received: ${elements.meanMotion}`
    );

  if (elements.e < 0 || elements.e >= 1)
    throw new RangeError(
      `elements.e must be in [0, 1). Received: ${elements.e}`
    );

  const model = sgp4Init(elements);

  MODELS.set(elements, model);

  return model;
};

/**
 * Propagate a satellite's mean elements with **SGP4** to a number of minutes
 * from their epoch: its position and velocity in the TEME frame.
 *
 * SGP4 is the model TLEs and OMMs are fitted with, so it's the only one that
 * gives correct positions from them. For periods of 225 minutes or more it
 * runs as **SDP4**, adding the pull of the Moon and Sun and the resonances of
 * 12- and 24-hour orbits.
 *
 * ::: info Notes
 *
 * - **TEME** (true equator, mean equinox) is the frame SGP4 works in: Earth
 *   centred, with z along the true rotation axis of the moment and x towards
 *   the mean equinox. Turn it by Greenwich mean sidereal time to get Earth-fixed
 *   coordinates.
 * - **In SI units**: the model works in kilometres and km/s, and the result is
 *   converted to m and m/s like the rest of the library. Divide by 1000 to
 *   compare with other SGP4 implementations.
 * - **Accuracy**: about 1 km at the epoch, growing by a few kilometres a day,
 *   faster for low orbits in a busy solar cycle. Use fresh elements.
 * - The model uses the WGS-72 constants the elements were fitted with, not
 *   WGS-84, and the "improved" mode of Vallado et al. (2006), which matches
 *   their verification set.
 * - The model is set up once per elements object and reused, so treat the
 *   elements as read-only.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param minutes - Time since the epoch in **minutes** (finite); negative goes back in time.
 * @returns The position `r` in **m** and velocity `v` in **m/s**, in the TEME frame.
 * @throws {TypeError} If `minutes` or a value of `elements` is not a finite number.
 * @throws {RangeError} If the elements are out of range, or SGP4 fails at that time: the satellite has decayed, or its eccentricity or mean motion left the model's range.
 * @group Satellites
 *
 * @example
 * ```ts
 * const iss = parseTle(
 *   '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
 *   '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
 * );
 * const { r, v } = propagateMinutes(iss, 90);
 *
 * Math.hypot(...r) / 1000; // ≈ 6 790 km from Earth's centre
 * Math.hypot(...v); // ≈ 7 660 m/s
 * ```
 *
 * @see {@link propagate}
 * @see https://celestrak.org/publications/AIAA/2006-6753/ Vallado, Crawford, Hujsak & Kelso (2006), Revisiting Spacetrack Report #3
 */
export const propagateMinutes = (
  elements: MeanElementsInterface,
  minutes: number
): StateVectorInterface => {
  if (!Number.isFinite(minutes))
    throw new TypeError(
      `minutes must be a finite number. Received: ${minutes}`
    );

  const { r, v } = sgp4(modelFor(elements), minutes);

  return {
    r: [r[0] * 1000, r[1] * 1000, r[2] * 1000],
    v: [v[0] * 1000, v[1] * 1000, v[2] * 1000]
  };
};

/**
 * Propagate a satellite's mean elements with **SGP4** to a moment: its
 * position and velocity in the TEME frame. See {@link propagateMinutes}.
 *
 * ::: info Notes
 *
 * - The time since the epoch is taken in UTC, which SGP4 treats as UT1.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle} or {@link parseOmm}.
 * @param date - The moment, as a `Date`.
 * @returns The position `r` in **m** and velocity `v` in **m/s**, in the TEME frame.
 * @throws {TypeError} If `date` is not a valid `Date`, or a value of `elements` is not a finite number.
 * @throws {RangeError} If the elements are out of range, or SGP4 fails at that time: the satellite has decayed, or its eccentricity or mean motion left the model's range.
 * @group Satellites
 *
 * @example
 * ```ts
 * const iss = parseTle(
 *   '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
 *   '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
 * );
 *
 * propagate(iss, new Date('2026-11-04T12:00:00Z')); // { r: [...], v: [...] }
 * ```
 *
 * @see {@link propagateMinutes}
 */
export const propagate = (
  elements: MeanElementsInterface,
  date: Date
): StateVectorInterface => {
  // Check the elements before reading their epoch
  modelFor(elements);

  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new TypeError(`date must be a valid Date. Received: ${String(date)}`);

  // Subtract in Unix ms: a Julian date only resolves 40 µs, and the difference
  // of two would jump by that much from one millisecond to the next
  const epochMs =
    (elements.epochJulianDate - JULIAN_DATE_UNIX_EPOCH) * MILLISECONDS_PER_DAY;

  return propagateMinutes(elements, (date.getTime() - epochMs) / 60_000);
};
