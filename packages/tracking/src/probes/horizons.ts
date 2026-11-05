import {
  AU_METERS,
  JULIAN_DATE_UNIX_EPOCH
} from '@interstellar-tools/constants';
import type {
  EphemerisInterface,
  EphemerisSampleInterface,
  TimeScaleType
} from '@interstellar-tools/types';

import { fromScale } from './epoch.js';

const DAY_S = 86_400;
// Metres and metres per second in each of Horizons' output units
const UNITS: Record<string, readonly [number, number]> = {
  'KM-S': [1000, 1000],
  'KM-D': [1000, 1000 / DAY_S],
  'AU-D': [AU_METERS, AU_METERS / DAY_S]
};
// The time scale of each Julian date column
const COLUMNS: Record<string, TimeScaleType> = {
  JDTDB: 'TDB',
  JDTT: 'TT',
  JDUT: 'UTC'
};
const NUMBER = String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`;
const POSITION = new RegExp(
  String.raw`^\s*X\s*=\s*${NUMBER}\s+Y\s*=\s*${NUMBER}\s+Z\s*=\s*${NUMBER}\s*$`
);
const VELOCITY = new RegExp(
  String.raw`^\s*VX\s*=\s*${NUMBER}\s+VY\s*=\s*${NUMBER}\s+VZ\s*=\s*${NUMBER}\s*$`
);
const RECORD = /^\s*(\d+(?:\.\d*)?)\s*=\s*A\.D\./;

/**
 * Parse a **JPL Horizons vector table**: the positions and velocities Horizons
 * gives for a spacecraft, planet or small body, as text or CSV. It's the
 * easiest way to an ephemeris of a deep-space probe, such as Voyager 1 or
 * Parker Solar Probe.
 *
 * Ask Horizons for vectors with velocities (`EPHEM_TYPE=VECTORS`,
 * `VEC_TABLE=2`), for example through its API. `REF_PLANE=FRAME` gives the
 * ICRF's equatorial axes; Horizons' default is the ecliptic:
 *
 * ```text
 * https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=-31
 *   &EPHEM_TYPE=VECTORS&VEC_TABLE=2&REF_PLANE=FRAME&CENTER=500@10
 *   &START_TIME=2026-01-01&STOP_TIME=2026-01-11&STEP_SIZE=1d
 * ```
 *
 * ::: info Notes
 *
 * - **Pass the whole output**, header included: the target, centre, frame,
 *   units and time scale are read from it. With `format=json`, pass the
 *   response's `result`.
 * - Units can be `KM-S`, `KM-D` or `AU-D`; positions and velocities are
 *   returned in m and m/s.
 * - Times can be TDB, the default, TT or UT, which is read as UTC. They're
 *   returned as UTC `Date`s, rounded to the millisecond.
 * - `objectName`, `center` and `frame` are Horizons' names, such as
 *   `'Voyager 1 (spacecraft)'`, `'Sun'` and `'ICRF'` or
 *   `'Ecliptic of J2000.0'`, and `objectId` is its id, such as `'-31'`.
 * - Horizons is a free service of JPL's Solar System Dynamics group. The
 *   library fetches nothing: fetch the table, then parse it.
 *
 * :::
 *
 * @param text - The Horizons output, with its header and the table between `$$SOE` and `$$EOE`.
 * @returns The ephemeris: see {@link EphemerisInterface}.
 * @throws {TypeError} If `text` is not a string.
 * @throws {RangeError} If the table, the target, centre or frame is missing, the units or time scale aren't read, a record has no velocity (`VEC_TABLE=1`), or the times don't increase.
 * @group Probes
 *
 * @example
 * ```ts
 * const response = await fetch(
 *   'https://ssd.jpl.nasa.gov/api/horizons.api?format=text&COMMAND=-31&EPHEM_TYPE=VECTORS&VEC_TABLE=2&REF_PLANE=FRAME&CENTER=500@10&START_TIME=2026-01-01&STOP_TIME=2026-01-11&STEP_SIZE=1d'
 * );
 * const voyager1 = parseHorizonsVectors(await response.text());
 *
 * stateAt(voyager1, new Date('2026-01-05T06:00:00Z')); // { r, v } from the Sun, in m and m/s
 * ```
 *
 * @see {@link stateAt}
 * @see {@link parseOem}
 * @see https://ssd-api.jpl.nasa.gov/doc/horizons.html The Horizons API
 */
export const parseHorizonsVectors = (text: string): EphemerisInterface => {
  if (typeof text !== 'string')
    throw new TypeError(`text must be a string. Received: ${typeof text}`);

  const start = text.indexOf('$$SOE');
  const end = text.indexOf('$$EOE');

  if (start === -1 || end < start)
    throw new RangeError(
      'Horizons vectors must have a table between $$SOE and $$EOE: pass the whole output.'
    );

  const header = text.slice(0, start);
  const field = (label: string): string => {
    const match = new RegExp(
      String.raw`^${label}\s*:\s*(.*?)\s*(?:\{.*)?$`,
      'm'
    ).exec(header);

    if (!match?.[1])
      throw new RangeError(`Horizons vectors must have a "${label}" line.`);

    return match[1];
  };
  // "Voyager 1 (spacecraft) (-31)": the name, and the id in the last brackets
  const [, objectName, objectId] = /^(.*?)\s*\(([^()]+)\)$/.exec(
    field('Target body name')
  ) ?? [undefined, field('Target body name'), undefined];
  const center = field('Center body name').replace(/\s*\([^()]+\)$/, '');
  const frame = field('Reference frame');
  const units = field('Output units');
  const scales = UNITS[units];

  if (!scales)
    throw new RangeError(
      `Horizons units must be KM-S, KM-D or AU-D. Received: "${units}"`
    );

  const column = /^\s*(JD[A-Z]+)\b/m.exec(header)?.[1] ?? '';
  const timeScale = COLUMNS[column];

  if (!timeScale)
    throw new RangeError(
      `Horizons times must be TDB, TT or UT. Received: "${column}"`
    );

  const [distance, speed] = scales;
  const lines = text
    .slice(start + 5, end)
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');
  const samples: EphemerisSampleInterface[] = [];
  const add = (jd: number, values: readonly number[]) => {
    const epoch = fromScale(
      (jd - JULIAN_DATE_UNIX_EPOCH) * DAY_S * 1000,
      timeScale
    );
    const previous = samples[samples.length - 1];

    if (previous && epoch.getTime() <= previous.epoch.getTime())
      throw new RangeError(`Horizons times must increase. Received: JD ${jd}`);

    const [x, y, z, vx, vy, vz] = values as [
      number,
      number,
      number,
      number,
      number,
      number
    ];

    samples.push({
      epoch,
      r: [x * distance, y * distance, z * distance],
      v: [vx * speed, vy * speed, vz * speed]
    });
  };
  const noVelocity = () =>
    new RangeError(
      'Horizons vectors must have velocities: ask for VEC_TABLE=2 or 3.'
    );

  if (lines[0]?.includes(',')) {
    // JD, calendar date, X, Y, Z, VX, VY, VZ, and maybe LT, RG, RR
    for (const line of lines) {
      const [jd, , ...values] = line.split(',').map((value) => value.trim());
      const numbers = values.slice(0, 6).map(Number);

      if (numbers.length < 6) throw noVelocity();

      if (![Number(jd), ...numbers].every(Number.isFinite))
        throw new RangeError(
          `Horizons values must be numbers. Received: "${line.trim()}"`
        );

      add(Number(jd), numbers);
    }
  } else {
    // A line with the date, then X Y Z, VX VY VZ, and maybe LT RG RR
    for (let k = 0; k < lines.length; k++) {
      const jd = RECORD.exec(lines[k]!)?.[1];

      if (jd === undefined) continue;

      const [, next = '', after = ''] = lines.slice(k, k + 3);
      const position = POSITION.exec(next);
      const velocity = VELOCITY.exec(after);

      if (!position)
        throw new RangeError(
          `Horizons vectors must give X, Y and Z after each date. Received: "${next.trim()}"`
        );

      if (!velocity) throw noVelocity();

      add(Number(jd), [...position.slice(1), ...velocity.slice(1)].map(Number));
    }
  }

  if (samples.length === 0)
    throw new RangeError('Horizons vectors must have at least one record.');

  return {
    objectName: objectName!,
    ...(objectId ? { objectId } : {}),
    center,
    frame,
    timeScale,
    samples
  };
};
