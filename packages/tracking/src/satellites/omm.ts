import { julianDate } from '@interstellar-tools/temporal';
import type { MeanElementsInterface } from '@interstellar-tools/types';

import { type NumericKey, toMeanElements } from './mean-elements.js';

// The OMM keyword of each value
const KEYWORDS: Record<NumericKey, string> = {
  catalogNumber: 'NORAD_CAT_ID',
  meanMotion: 'MEAN_MOTION',
  meanMotionDot: 'MEAN_MOTION_DOT',
  meanMotionDdot: 'MEAN_MOTION_DDOT',
  eccentricity: 'ECCENTRICITY',
  inclination: 'INCLINATION',
  raan: 'RA_OF_ASC_NODE',
  argp: 'ARG_OF_PERICENTER',
  meanAnomaly: 'MEAN_ANOMALY',
  bstar: 'BSTAR',
  elementSetNumber: 'ELEMENT_SET_NO',
  revolutionNumber: 'REV_AT_EPOCH'
};
// Bookkeeping, which SGP4 doesn't need: 0 when missing
const OPTIONAL: readonly string[] = ['ELEMENT_SET_NO', 'REV_AT_EPOCH'];
const EPOCH = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)Z?$/;
const DAY_S = 86_400;

/**
 * Parse an **Orbit Mean-elements Message** (OMM) in JSON: the CCSDS format
 * CelesTrak and Space-Track publish SGP4 elements in, next to TLEs. Unlike a
 * TLE, it has room for catalogue numbers above 339 999.
 *
 * ```json
 * {
 *   "OBJECT_NAME": "ISS (ZARYA)",
 *   "OBJECT_ID": "1998-067A",
 *   "EPOCH": "2026-11-04T08:52:07.404096",
 *   "MEAN_MOTION": 15.49173979,
 *   "ECCENTRICITY": 0.0007186,
 *   "INCLINATION": 51.6329,
 *   "RA_OF_ASC_NODE": 326.3987,
 *   "ARG_OF_PERICENTER": 346.7494,
 *   "MEAN_ANOMALY": 13.3304,
 *   "EPHEMERIS_TYPE": 0,
 *   "CLASSIFICATION_TYPE": "U",
 *   "NORAD_CAT_ID": 25544,
 *   "ELEMENT_SET_NO": 999,
 *   "REV_AT_EPOCH": 59348,
 *   "BSTAR": 0.00010236,
 *   "MEAN_MOTION_DOT": 5.228e-5,
 *   "MEAN_MOTION_DDOT": 0
 * }
 * ```
 *
 * ::: info Notes
 *
 * - **One record at a time.** CelesTrak and Space-Track return an array of
 *   records: parse it, then pass each one, as in the example.
 * - Numbers can be JSON numbers, as CelesTrak gives them, or strings, as
 *   Space-Track does.
 * - `EPOCH` is in UTC, with or without a trailing `Z`. `epochJulianDate` keeps
 *   all its decimals; `epoch`, a `Date`, rounds to the millisecond.
 * - `ELEMENT_SET_NO` and `REV_AT_EPOCH` are 0 when missing, and
 *   `CLASSIFICATION_TYPE` is `U`. Everything else SGP4 needs is required.
 * - The XML and key-value forms of OMM aren't read.
 *
 * :::
 *
 * @param omm - One OMM record: an object, or its JSON text.
 * @returns The mean elements, in radians and rad/s: see {@link MeanElementsInterface}.
 * @throws {SyntaxError} If `omm` is text that isn't valid JSON.
 * @throws {TypeError} If `omm` isn't one record, or a required value is missing or not a number.
 * @throws {RangeError} If `EPOCH` isn't a valid date and time, `CLASSIFICATION_TYPE` isn't U, C or S, or a value is out of range; the message names the keyword.
 * @group Satellites
 *
 * @example
 * ```ts
 * const response = await fetch(
 *   'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=JSON'
 * );
 * const [iss] = (await response.json()).map(parseOmm);
 *
 * iss.objectId; // '1998-067A'
 * ```
 *
 * @see {@link parseTle}
 * @see https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak, "A new way to obtain GP data"
 * @see https://ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages
 */
export const parseOmm = (omm: string | object): MeanElementsInterface => {
  const record: unknown = typeof omm === 'string' ? JSON.parse(omm) : omm;

  if (typeof record !== 'object' || record === null || Array.isArray(record))
    throw new TypeError(
      Array.isArray(record)
        ? 'omm must be one OMM record, not an array: pass each record in it.'
        : `omm must be an OMM record or its JSON text. Received: ${JSON.stringify(record)}`
    );

  const value = (keyword: string): unknown =>
    (record as Record<string, unknown>)[keyword];
  const number = (key: NumericKey): number => {
    const keyword = KEYWORDS[key];
    const raw = value(keyword);

    if (raw === undefined && OPTIONAL.includes(keyword)) return 0;

    const parsed =
      typeof raw === 'number'
        ? raw
        : typeof raw === 'string' && raw.trim() !== ''
          ? Number(raw)
          : Number.NaN;

    if (!Number.isFinite(parsed))
      throw new TypeError(
        `OMM ${keyword} must be a number. Received: ${JSON.stringify(raw)}`
      );

    return parsed;
  };
  const text = (keyword: string): string | undefined => {
    const raw = value(keyword);

    if (raw !== undefined && typeof raw !== 'string')
      throw new TypeError(
        `OMM ${keyword} must be a string. Received: ${JSON.stringify(raw)}`
      );

    return raw?.trim() || undefined;
  };
  const epoch = value('EPOCH');
  const match = typeof epoch === 'string' ? EPOCH.exec(epoch) : null;
  const invalidEpoch = () =>
    new RangeError(
      `OMM EPOCH must be a UTC date and time, like 2026-11-04T08:52:07.404096. Received: ${JSON.stringify(epoch)}`
    );

  if (!match) throw invalidEpoch();

  const [year, month, day, hours, minutes, seconds] = match
    .slice(1)
    .map(Number) as [number, number, number, number, number, number];
  const midnight = Date.UTC(year, month - 1, day);
  const date = new Date(midnight);

  // Date.UTC rolls 31 April over into May: check it didn't
  if (
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    hours > 23 ||
    minutes > 59 ||
    seconds >= 60
  )
    throw invalidEpoch();

  const classification = text('CLASSIFICATION_TYPE') ?? 'U';

  if (
    classification !== 'U' &&
    classification !== 'C' &&
    classification !== 'S'
  )
    throw new RangeError(
      `OMM CLASSIFICATION_TYPE must be U, C or S. Received: "${classification}"`
    );

  const secondsOfDay = hours * 3600 + minutes * 60 + seconds;
  const name = text('OBJECT_NAME');
  const objectId = text('OBJECT_ID');

  return toMeanElements(
    {
      ...(name ? { name } : {}),
      ...(objectId ? { objectId } : {}),
      catalogNumber: number('catalogNumber'),
      classification,
      epoch: new Date(midnight + Math.round(secondsOfDay * 1000)),
      epochJulianDate: julianDate(new Date(midnight)) + secondsOfDay / DAY_S,
      meanMotion: number('meanMotion'),
      meanMotionDot: number('meanMotionDot'),
      meanMotionDdot: number('meanMotionDdot'),
      eccentricity: number('eccentricity'),
      inclination: number('inclination'),
      raan: number('raan'),
      argp: number('argp'),
      meanAnomaly: number('meanAnomaly'),
      bstar: number('bstar'),
      elementSetNumber: number('elementSetNumber'),
      revolutionNumber: number('revolutionNumber')
    },
    (key) => `OMM ${KEYWORDS[key]}`
  );
};
