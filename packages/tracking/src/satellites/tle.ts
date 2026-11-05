import { julianDate } from '@interstellar-tools/temporal';
import type { MeanElementsInterface } from '@interstellar-tools/types';

import { toMeanElements } from './mean-elements.js';

type FieldType = readonly [line: 1 | 2, from: number, to: number, name: string];

// The fields of a TLE, by line and 1-indexed columns
const FIELDS = {
  lineNumber1: [1, 1, 1, 'line number'],
  catalogNumber: [1, 3, 7, 'catalog number'],
  classification: [1, 8, 8, 'classification'],
  objectId: [1, 10, 17, 'international designator'],
  epochYear: [1, 19, 20, 'epoch year'],
  epochDay: [1, 21, 32, 'epoch day'],
  meanMotionDot: [1, 34, 43, 'first derivative of mean motion'],
  meanMotionDdot: [1, 45, 52, 'second derivative of mean motion'],
  bstar: [1, 54, 61, 'B* drag term'],
  ephemerisType: [1, 63, 63, 'ephemeris type'],
  elementSetNumber: [1, 65, 68, 'element set number'],
  checksum1: [1, 69, 69, 'checksum'],
  lineNumber2: [2, 1, 1, 'line number'],
  catalogNumber2: [2, 3, 7, 'catalog number'],
  inclination: [2, 9, 16, 'inclination'],
  raan: [2, 18, 25, 'right ascension of the ascending node'],
  eccentricity: [2, 27, 33, 'eccentricity'],
  argp: [2, 35, 42, 'argument of perigee'],
  meanAnomaly: [2, 44, 51, 'mean anomaly'],
  meanMotion: [2, 53, 63, 'mean motion'],
  revolutionNumber: [2, 64, 68, 'revolution number'],
  checksum2: [2, 69, 69, 'checksum']
} as const satisfies Record<string, FieldType>;
// The columns between the fields, which must be blank
const BLANKS = {
  1: [2, 9, 18, 33, 44, 53, 62, 64],
  2: [2, 8, 17, 26, 34, 43, 52]
};
const DECIMAL = /^ *[+-]?(?:\d+\.?\d*|\.\d+)$/;
// A decimal point assumed before the digits, and a power of ten: -11606-4 is -0.11606e-4
const EXPONENT = /^ *([+-]?)(\d{1,5})([+-]\d)$/;
const WHOLE = /^ *\d*$/;
const CATALOG = /^(?: *\d{1,5}|[A-HJ-NP-Z]\d{4})$/;
const DESIGNATOR = /^(?:(\d{2})(\d{3})([A-Z]{1,3}) *| {8})$/;
// Alpha-5: A is 10, skipping I and O, which look like 1 and 0
const ALPHA_5 = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const DAY_MS = 86_400_000;
const where = ([line, from, to, name]: FieldType) =>
  `TLE line ${line}, ${from === to ? `column ${from}` : `columns ${from}-${to}`} (${name})`;
const read = (
  lines: readonly [string, string],
  field: FieldType,
  pattern: RegExp,
  expected: string
): RegExpExecArray => {
  const [line, from, to] = field;
  const text = lines[line - 1]!.slice(from - 1, to);
  const match = pattern.exec(text);

  if (!match)
    throw new RangeError(
      `${where(field)} must be ${expected}. Received: "${text}"`
    );

  return match;
};
const catalogNumber = (text: string): number => {
  const alpha = ALPHA_5.indexOf(text[0]!);

  return alpha === -1
    ? Number(text)
    : (alpha + 10) * 10_000 + Number(text.slice(1));
};
const checkLine = (text: string, line: 1 | 2): string => {
  if (typeof text !== 'string')
    throw new TypeError(
      `TLE line ${line} must be a string. Received: ${typeof text}`
    );

  // Files often end lines with spaces or a carriage return
  const trimmed = text.trimEnd();

  if (trimmed.length !== 69)
    throw new RangeError(
      `TLE line ${line} must be 69 characters long. Received: ${trimmed.length} characters`
    );

  if (trimmed[0] !== String(line))
    throw new RangeError(
      `${where([line, 1, 1, 'line number'])} must be "${line}". Received: "${trimmed[0]}"`
    );

  for (const column of BLANKS[line])
    if (trimmed[column - 1] !== ' ')
      throw new RangeError(
        `TLE line ${line}, column ${column} must be blank: the fields are out of line. Received: "${trimmed[column - 1]}"`
      );

  const checksum = tleChecksum(trimmed);

  if (trimmed[68] !== String(checksum))
    throw new RangeError(
      `${where([line, 69, 69, 'checksum'])} must be ${checksum}, the checksum of columns 1-68. Received: "${trimmed[68]}"`
    );

  return trimmed;
};

/**
 * The **checksum** of a TLE line: the sum of its digits, with 1 for each minus
 * sign, modulo 10. It's the last column of each line, and catches most typos.
 *
 * $$
 * c = \Big(\sum_{k=1}^{68} d_k\Big) \bmod 10
 * $$
 *
 * Where:
 * - $ d_k $ is the digit in column $ k $, 1 for a minus sign and 0 for anything else
 *
 * @param line - A TLE line; only its first 68 columns count.
 * @returns The checksum, from 0 to 9.
 * @throws {TypeError} If `line` is not a string.
 * @group Satellites
 *
 * @example
 * ```ts
 * tleChecksum(
 *   '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991'
 * ); // 1
 * ```
 *
 * @see {@link parseTle}
 */
export const tleChecksum = (line: string): number => {
  if (typeof line !== 'string')
    throw new TypeError(`line must be a string. Received: ${typeof line}`);

  let sum = 0;

  for (const c of line.slice(0, 68))
    sum += c === '-' ? 1 : c >= '0' && c <= '9' ? Number(c) : 0;

  return sum % 10;
};

/**
 * Parse a **two-line element set** (TLE): the format NORAD has published
 * satellite orbits in since the 1960s, for SGP4.
 *
 * ```text
 * ISS (ZARYA)
 * 1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991
 * 2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483
 * ```
 *
 * Each line is checked before it's read: its length, line number, the blank
 * columns between the fields, and the checksum. An error names the line, the
 * columns and the field.
 *
 * ::: info Notes
 *
 * - **Alpha-5 catalogue numbers** are read: with five digits running out, a
 *   letter in the first column stands for 10 to 33, skipping I and O, so
 *   `A0001` is 100 001 and `Z9999` is 339 999. Larger numbers only fit in an
 *   OMM: see {@link parseOmm}.
 * - A two-digit epoch year from 57 is 19xx, and below 57 is 20xx.
 * - The epoch is in UTC. `epochJulianDate` keeps all eight decimals of the day,
 *   a resolution of 0.9 ms; `epoch`, a `Date`, rounds to the millisecond.
 * - A name line from a three-line file can be passed as `name`, with or
 *   without the `0 ` that some files start it with.
 *
 * :::
 *
 * @param line1 - The first line of the TLE, 69 characters; trailing spaces are ignored.
 * @param line2 - The second line, 69 characters.
 * @param name - The satellite's name, from the line before the TLE (optional).
 * @returns The mean elements, in radians and rad/s: see {@link MeanElementsInterface}.
 * @throws {TypeError} If a line or `name` is not a string.
 * @throws {RangeError} If a line is malformed, its checksum is wrong, the lines' catalogue numbers differ, or a value is out of range; the message names the field.
 * @group Satellites
 *
 * @example
 * ```ts
 * const iss = parseTle(
 *   '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
 *   '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483',
 *   'ISS (ZARYA)'
 * );
 *
 * iss.catalogNumber; // 25544
 * iss.epoch.toISOString(); // '2026-11-04T08:52:07.404Z'
 * (iss.meanMotion * 86_400) / (2 * Math.PI); // 15.49173979 revolutions a day
 * ```
 *
 * @see {@link parseOmm}
 * @see {@link tleChecksum}
 * @see https://celestrak.org/columns/v04n03/ Kelso, "Frequently asked questions: two-line element set format"
 * @see https://celestrak.org/publications/AIAA/2006-6753/ Vallado et al. (2006), Revisiting Spacetrack Report #3
 */
export const parseTle = (
  line1: string,
  line2: string,
  name?: string
): MeanElementsInterface => {
  const lines = [checkLine(line1, 1), checkLine(line2, 2)] as const;
  const field = (f: FieldType, pattern: RegExp, expected: string) =>
    read(lines, f, pattern, expected);
  const number = (f: FieldType) =>
    Number(field(f, DECIMAL, 'a decimal number')[0]);
  const whole = (f: FieldType) => Number(field(f, WHOLE, 'a whole number')[0]);
  const exponent = (f: FieldType) => {
    const [, sign, digits, power] = field(
      f,
      EXPONENT,
      'a number with an assumed decimal point and a power of ten, like -11606-4'
    );

    return Number(`${sign}0.${digits!.padStart(5, '0')}e${power}`);
  };
  const catalog = (f: FieldType) =>
    catalogNumber(
      field(
        f,
        CATALOG,
        'a catalogue number: 5 digits, or a letter and 4 digits (Alpha-5)'
      )[0]
    );

  if (name !== undefined && typeof name !== 'string')
    throw new TypeError(`name must be a string. Received: ${typeof name}`);

  const catalogNumber1 = catalog(FIELDS.catalogNumber);
  const catalogNumber2 = catalog(FIELDS.catalogNumber2);

  if (catalogNumber2 !== catalogNumber1)
    throw new RangeError(
      `${where(FIELDS.catalogNumber2)} must match line 1, ${catalogNumber1}. Received: ${catalogNumber2}`
    );

  const [classification] = field(FIELDS.classification, /^[UCS]$/, 'U, C or S');
  const [, launchYear, launchNumber, piece] = field(
    FIELDS.objectId,
    DESIGNATOR,
    'blank, or a launch year, launch number and piece, like 98067A'
  );
  const yy = Number(field(FIELDS.epochYear, /^\d{2}$/, 'two digits')[0]);
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  const day = Number(
    field(FIELDS.epochDay, /^ *\d{1,3}\.\d+$/, 'a day of the year')[0]
  );
  const startOfYear = Date.UTC(year, 0, 1);
  const daysInYear = (Date.UTC(year + 1, 0, 1) - startOfYear) / DAY_MS;

  if (day < 1 || day >= daysInYear + 1)
    throw new RangeError(
      `${where(FIELDS.epochDay)} must be in [1, ${daysInYear + 1}) for ${year}. Received: ${day}`
    );

  field(FIELDS.ephemerisType, /^[\d ]$/, 'a digit or blank');

  // Two-digit launch years follow the same rule as the epoch year
  const launch = launchYear === undefined ? undefined : Number(launchYear);
  const label = name?.replace(/^0 /, '').trim();

  return toMeanElements(
    {
      ...(label ? { name: label } : {}),
      ...(launch === undefined
        ? {}
        : {
            objectId: `${launch < 57 ? 2000 + launch : 1900 + launch}-${launchNumber}${piece}`
          }),
      catalogNumber: catalogNumber1,
      classification: classification as 'U' | 'C' | 'S',
      epoch: new Date(startOfYear + Math.round((day - 1) * DAY_MS)),
      epochJulianDate: julianDate(new Date(startOfYear)) + (day - 1),
      meanMotion: number(FIELDS.meanMotion),
      meanMotionDot: number(FIELDS.meanMotionDot),
      meanMotionDdot: exponent(FIELDS.meanMotionDdot),
      eccentricity: Number(
        `0.${field(FIELDS.eccentricity, /^ *\d+$/, 'digits after an assumed decimal point')[0].replace(/ /g, '0')}`
      ),
      inclination: number(FIELDS.inclination),
      raan: number(FIELDS.raan),
      argp: number(FIELDS.argp),
      meanAnomaly: number(FIELDS.meanAnomaly),
      bstar: exponent(FIELDS.bstar),
      elementSetNumber: whole(FIELDS.elementSetNumber),
      revolutionNumber: whole(FIELDS.revolutionNumber)
    },
    (key) => where(FIELDS[key])
  );
};
