import type {
  EphemerisInterface,
  EphemerisSampleInterface,
  TimeScaleType
} from '@interstellar-tools/types';

import { fromScale, SCALES } from './epoch.js';

const KVN = /^([A-Z][A-Z0-9_]*)\s*=(.*)$/;
const EPOCH =
  /^(\d{4})-(?:(\d{2})-(\d{2})|(\d{3}))T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)Z?$/;
const REQUIRED = [
  'OBJECT_NAME',
  'OBJECT_ID',
  'CENTER_NAME',
  'REF_FRAME',
  'TIME_SYSTEM'
] as const;
// Unix ms on the clock the epoch is read on, or NaN if it isn't a valid epoch
const readEpoch = (text: string): number => {
  const match = EPOCH.exec(text);

  if (!match) return Number.NaN;

  const [, year, month, day, dayOfYear, hours, minutes, seconds] = match;
  const y = Number(year);
  // A day of the year counts from 1 January, which Date.UTC takes as day 1
  const midnight = dayOfYear
    ? Date.UTC(y, 0, Number(dayOfYear))
    : Date.UTC(y, Number(month) - 1, Number(day));
  const date = new Date(midnight);
  const valid = dayOfYear
    ? Number(dayOfYear) >= 1 && date.getUTCFullYear() === y
    : date.getUTCMonth() === Number(month) - 1 &&
      date.getUTCDate() === Number(day);

  // 60 s only in a leap second
  if (
    !valid ||
    Number(hours) > 23 ||
    Number(minutes) > 59 ||
    Number(seconds) >= 61
  )
    return Number.NaN;

  return (
    midnight +
    Number(hours) * 3_600_000 +
    Number(minutes) * 60_000 +
    Number(seconds) * 1000
  );
};

/**
 * Parse a CCSDS **Orbit Ephemeris Message** (OEM) in its key-value (KVN)
 * form: the standard space agencies exchange spacecraft ephemerides in, a
 * table of positions and velocities over time.
 *
 * ```text
 * CCSDS_OEM_VERS = 3.0
 * CREATION_DATE = 1996-11-04T17:22:31
 * ORIGINATOR = NASA/JPL
 *
 * META_START
 * OBJECT_NAME = MARS GLOBAL SURVEYOR
 * OBJECT_ID = 1996-062A
 * CENTER_NAME = MARS BARYCENTER
 * REF_FRAME = EME2000
 * TIME_SYSTEM = UTC
 * START_TIME = 2019-12-18T12:00:00.331
 * STOP_TIME = 2019-12-28T21:28:00.331
 * META_STOP
 *
 * 2019-12-18T12:00:00.331 2789.619 -280.045 -1746.755 4.73372 -2.49586 -1.04195
 * 2019-12-18T12:01:00.331 2783.419 -308.143 -1877.071 5.18604 -2.42124 -1.99608
 * ```
 *
 * ::: info Notes
 *
 * - **One ephemeris per segment.** Each `META_START` block starts a segment,
 *   and the standard forbids interpolating across them: they often split an
 *   ephemeris at a manoeuvre. Pass each segment to {@link stateAt} on its own.
 * - Positions and velocities are read in km and km/s, as the standard has
 *   them, and returned in m and m/s. Accelerations, when present, and
 *   covariance blocks are skipped.
 * - Epochs are read on the `TIME_SYSTEM` clock and returned as UTC `Date`s,
 *   rounded to the millisecond. UTC, TAI, TT, UT1, TDB and GPS are read;
 *   mission-elapsed and spacecraft clocks, TCB and TCG aren't.
 * - Epochs can be calendar dates or days of the year, as in
 *   `2019-352T12:00:00`. The XML form of OEM isn't read.
 *
 * :::
 *
 * @param text - The OEM, in KVN.
 * @returns The segments, in order: see {@link EphemerisInterface}.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If the OEM is malformed: it doesn't start with `CCSDS_OEM_VERS`, a required keyword is missing, the time system isn't one of those read, a segment has no data, or a data line has the wrong number of values, an invalid epoch or epochs out of order. The message names the line.
 * @group Probes
 *
 * @example
 * ```ts
 * const [segment] = parseOem(text);
 *
 * segment.objectName; // 'MARS GLOBAL SURVEYOR'
 * stateAt(segment, new Date('2019-12-18T12:00:30Z')); // { r, v } in m and m/s
 * ```
 *
 * @see {@link stateAt}
 * @see {@link parseHorizonsVectors}
 * @see https://ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages, section 5
 */
export const parseOem = (text: string): EphemerisInterface[] => {
  if (typeof text !== 'string')
    throw new TypeError(`text must be a string. Received: ${typeof text}`);

  const segments: EphemerisInterface[] = [];

  let section: 'start' | 'header' | 'meta' | 'data' | 'covariance' = 'start';
  let meta: Record<string, string> = {};
  let timeScale: TimeScaleType = 'UTC';
  let samples: EphemerisSampleInterface[] = [];
  let line = 0;

  const fail = (message: string) =>
    new RangeError(`OEM line ${line}: ${message}`);
  const finish = () => {
    if (samples.length === 0) throw fail('a segment must have data lines.');

    segments.push({
      objectName: meta['OBJECT_NAME']!,
      objectId: meta['OBJECT_ID']!,
      center: meta['CENTER_NAME']!,
      frame: meta['REF_FRAME']!,
      timeScale,
      samples
    });
    samples = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const content = raw.trim();

    line++;

    if (content === '' || /^COMMENT(?:\s|$)/.test(content)) continue;

    if (section === 'start') {
      if (!/^CCSDS_OEM_VERS\s*=/.test(content))
        throw fail(
          `an OEM must start with CCSDS_OEM_VERS. Received: "${content}"`
        );

      section = 'header';
    } else if (section === 'meta') {
      if (content === 'META_STOP') {
        const missing = REQUIRED.find((keyword) => !meta[keyword]);

        if (missing) throw fail(`the metadata must have ${missing}.`);

        timeScale = meta['TIME_SYSTEM'] as TimeScaleType;

        if (!SCALES.includes(timeScale))
          throw fail(
            `TIME_SYSTEM must be one of ${SCALES.join(', ')}. Received: "${timeScale}"`
          );

        section = 'data';
      } else {
        const match = KVN.exec(content);

        if (!match)
          throw fail(
            `metadata must be KEYWORD = value. Received: "${content}"`
          );

        meta[match[1]!] = match[2]!.trim();
      }
    } else if (section === 'covariance') {
      if (content === 'META_START')
        throw fail('a covariance block must end with COVARIANCE_STOP.');

      if (content === 'COVARIANCE_STOP') section = 'data';
    } else if (content === 'META_START') {
      if (section === 'data') finish();

      meta = {};
      section = 'meta';
    } else if (section === 'header') {
      if (!KVN.exec(content))
        throw fail(`expected META_START. Received: "${content}"`);
    } else if (content === 'COVARIANCE_START') {
      section = 'covariance';
    } else {
      const values = content.split(/\s+/);
      const [epoch, ...rest] = values;
      const numbers = rest.map(Number);

      if (values.length !== 7 && values.length !== 10)
        throw fail(
          `a data line must have an epoch, a position and a velocity, and optionally an acceleration. Received: "${content}"`
        );

      if (!numbers.every(Number.isFinite))
        throw fail(`data must be numbers. Received: "${content}"`);

      const ms = readEpoch(epoch!);

      if (!Number.isFinite(ms))
        throw fail(`invalid epoch. Received: "${epoch}"`);

      const date = fromScale(ms, timeScale);
      const previous = samples[samples.length - 1];

      if (previous && date.getTime() <= previous.epoch.getTime())
        throw fail(`epochs must increase. Received: "${epoch}"`);

      const [x, y, z, vx, vy, vz] = numbers.map((value) => value * 1000) as [
        number,
        number,
        number,
        number,
        number,
        number
      ];

      samples.push({ epoch: date, r: [x, y, z], v: [vx, vy, vz] });
    }
  }

  if (section === 'start') throw fail('an OEM must start with CCSDS_OEM_VERS.');

  if (section === 'meta') throw fail('the metadata must end with META_STOP.');

  if (section === 'header') throw fail('an OEM must have a segment.');

  if (section === 'covariance')
    throw fail('a covariance block must end with COVARIANCE_STOP.');

  finish();

  return segments;
};
