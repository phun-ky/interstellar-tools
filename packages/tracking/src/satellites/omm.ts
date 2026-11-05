import { JULIAN_DATE_UNIX_EPOCH } from '@interstellar-tools/constants';
import { julianDate } from '@interstellar-tools/temporal';
import type {
  MeanElementsInterface,
  OmmRecordInterface
} from '@interstellar-tools/types';

import {
  type NumericKey,
  toMeanElements,
  toPublishedElements
} from './mean-elements.js';

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

/**
 * Write mean elements as an **Orbit Mean-elements Message** (OMM) record, in
 * the JSON form CelesTrak publishes: the reverse of {@link parseOmm}. Unlike
 * a TLE, it keeps every digit, and has room for any catalogue number.
 *
 * ::: info Notes
 *
 * - `EPOCH` is in UTC, with six decimals of the second and no trailing `Z`,
 *   as CelesTrak writes it. It comes from `epochJulianDate`, which holds the
 *   epoch to about 40 µs, so the last digit or two can differ from a
 *   published OMM's.
 * - `JSON.stringify` the record for the text, or put several in an array for
 *   a file of them, as CelesTrak serves them.
 * - `OBJECT_NAME` and `OBJECT_ID` are left out when the elements have none.
 *
 * :::
 *
 * @param elements - The mean elements, from {@link parseTle}, {@link parseOmm} or {@link fitElements}.
 * @returns One OMM record, with the keywords CelesTrak uses, in its order.
 * @throws {TypeError} If a value of `elements` is not a finite number.
 * @group Satellites
 *
 * @example
 * ```ts
 * const omm = formatOmm(iss);
 *
 * omm.EPOCH; // '2026-11-04T08:52:07.404092'
 * JSON.stringify([omm]); // a file of one record
 * ```
 *
 * @see {@link parseOmm}
 * @see {@link formatTle}
 * @see https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak, "A new way to obtain GP data"
 */
export const formatOmm = (
  elements: MeanElementsInterface
): OmmRecordInterface => {
  if (typeof elements !== 'object' || elements === null)
    throw new TypeError(
      `elements must be mean elements. Received: ${String(elements)}`
    );

  const published = toPublishedElements(elements);

  for (const [key, value] of Object.entries(published))
    if (!Number.isFinite(value))
      throw new TypeError(
        `elements.${key} must be a finite number. Received: ${value}`
      );

  // The epoch to the microsecond, from the Julian date, which is finer than
  // the Date's millisecond
  const microseconds = Math.round(
    (published.epochJulianDate - JULIAN_DATE_UNIX_EPOCH) * DAY_S * 1e6
  );
  const seconds = Math.floor(microseconds / 1e6);
  const epoch = `${new Date(seconds * 1000).toISOString().slice(0, 19)}.${String(microseconds - seconds * 1e6).padStart(6, '0')}`;

  return {
    ...(elements.name ? { OBJECT_NAME: elements.name } : {}),
    ...(elements.objectId ? { OBJECT_ID: elements.objectId } : {}),
    EPOCH: epoch,
    MEAN_MOTION: published.meanMotion,
    ECCENTRICITY: published.eccentricity,
    INCLINATION: published.inclination,
    RA_OF_ASC_NODE: published.raan,
    ARG_OF_PERICENTER: published.argp,
    MEAN_ANOMALY: published.meanAnomaly,
    EPHEMERIS_TYPE: 0,
    CLASSIFICATION_TYPE: elements.classification ?? 'U',
    NORAD_CAT_ID: published.catalogNumber,
    ELEMENT_SET_NO: published.elementSetNumber,
    REV_AT_EPOCH: published.revolutionNumber,
    BSTAR: published.bstar,
    MEAN_MOTION_DOT: published.meanMotionDot,
    MEAN_MOTION_DDOT: published.meanMotionDdot
  };
};
