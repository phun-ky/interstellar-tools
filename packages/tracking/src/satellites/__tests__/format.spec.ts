import type { MeanElementsInterface, Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { formatOmm, parseOmm } from '../omm.js';
import { formatTle, parseTle } from '../tle.js';

const LINE_1 =
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991';
const LINE_2 =
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483';
const iss = parseTle(LINE_1, LINE_2, 'ISS (ZARYA)');
// Every TLE in Vallado et al.'s verification set with a valid checksum
const VERIFICATION = readFileSync(
  new URL('fixtures/sgp4-ver.tle', import.meta.url),
  'utf8'
)
  .split('\n')
  .filter((line) => /^[12] /.test(line))
  .map((line) => line.slice(0, 69));
const verification: MeanElementsInterface[] = [];

for (let k = 0; k < VERIFICATION.length; k += 2) {
  try {
    verification.push(parseTle(VERIFICATION[k]!, VERIFICATION[k + 1]!));
  } catch {
    // Three of the set test bad checksums
  }
}

const throwsRange = (fn: () => unknown, message: string) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof RangeError);
    assert.equal(err.message, message);

    return true;
  });
// The ISS with one value changed
const with_ = (changes: Partial<MeanElementsInterface>) => ({
  ...iss,
  ...changes
});
const field = (line: string, from: number, to: number) =>
  line.slice(from - 1, to);

describe('formatTle', () => {
  test('writes the ISS TLE as published', () => {
    assert.deepEqual(formatTle(iss), [LINE_1, LINE_2]);
  });

  test('round-trips every TLE in the verification set', () => {
    assert.equal(verification.length, 30);

    for (const elements of verification) {
      const [line1, line2] = formatTle(elements);

      assert.deepEqual(parseTle(line1, line2), elements);
    }
  });

  test('writes negative derivatives, as in the verification set', () => {
    const [line1] = formatTle(
      parseTle(
        '1 04632U 70093B   04031.91070959 -.00000084  00000-0  10000-3 0  9955',
        '2 04632  11.4628 273.1101 1450506 207.6000 143.9350  1.20231981 44145'
      )
    );

    assert.equal(field(line1, 34, 43), '-.00000084');
  });

  test('writes the exponent format: sign, five digits and a power of ten', () => {
    const bstar = (value: number) =>
      field(formatTle(with_({ bstar: value }))[0], 54, 61);

    assert.equal(bstar(0), ' 00000+0');
    assert.equal(bstar(-0.11606e-4), '-11606-4');
    assert.equal(bstar(0.13519), ' 13519+0');
    assert.equal(bstar(1.5), ' 15000+1');
    // Rounding up to the next power of ten
    assert.equal(bstar(0.999996e-3), ' 10000-2');
    // Below 1e-9, fewer significant digits
    assert.equal(bstar(1.234e-12), ' 00123-9');
    assert.equal(bstar(1e-15), ' 00000+0');
    throwsRange(
      () => formatTle(with_({ bstar: 2e9 })),
      'elements.bstar must be below 1e9 to fit in a TLE. Received: 2000000000'
    );
  });

  test('writes the second derivative of the mean motion', () => {
    const elements = parseTle(
      '1 16925U 86065D   06151.67415771  .02550794 -30915-6  18784-3 0  4486',
      '2 16925  62.0906 295.0239 5596327 245.1593  47.9690  4.88511875148616'
    );

    assert.equal(field(formatTle(elements)[0], 45, 52), '-30915-6');
  });

  test('writes Alpha-5 catalogue numbers', () => {
    const catalog = (catalogNumber: number) =>
      field(formatTle(with_({ catalogNumber }))[0], 3, 7);

    assert.equal(catalog(5), '00005');
    assert.equal(catalog(99_999), '99999');
    assert.equal(catalog(100_001), 'A0001');
    assert.equal(catalog(339_999), 'Z9999');
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 339_999 }), (catalogNumber) => {
        const [line1, line2] = formatTle(with_({ catalogNumber }));

        assert.equal(parseTle(line1, line2).catalogNumber, catalogNumber);
      })
    );
  });

  test('writes the designator, or leaves it blank', () => {
    assert.equal(field(LINE_1, 10, 17), field(formatTle(iss)[0], 10, 17));
    assert.equal(
      field(formatTle(with_({ objectId: '1958-002B' }))[0], 10, 17),
      '58002B  '
    );
    assert.equal(
      field(formatTle(with_({ objectId: '1985-108AA' }))[0], 10, 17),
      '85108AA '
    );
    assert.equal(
      field(formatTle(with_({ objectId: '2056-999ZZZ' }))[0], 10, 17),
      '56999ZZZ'
    );

    const { objectId: _, ...anonymous } = iss;

    assert.equal(field(formatTle(anonymous)[0], 10, 17), ' '.repeat(8));
  });

  test('wraps an angle that rounds to 360° to 0', () => {
    const [, line2] = formatTle(
      with_({ meanAnomaly: ((359.99996 * Math.PI) / 180) as Radians })
    );

    assert.equal(field(line2, 44, 51), '  0.0000');
  });

  test('writes the epoch as a year and a day, into the next year when it rounds up', () => {
    const at = (iso: string, extraDays = 0) => {
      const date = new Date(iso);

      return field(
        formatTle(
          with_({
            epoch: date,
            epochJulianDate: date.getTime() / 86_400_000 + 2440587.5 + extraDays
          })
        )[0],
        19,
        32
      );
    };

    assert.equal(at('2026-01-01T00:00:00Z'), '26001.00000000');
    assert.equal(at('2024-12-31T12:00:00Z'), '24366.50000000');
    // A billionth of a day before 2000, which rounds up to it
    assert.equal(at('2000-01-01T00:00:00Z', -2e-9), '00001.00000000');
    assert.equal(at('1957-10-04T19:28:34Z'), '57277.81150463');
  });

  test('keeps the last digits of the bookkeeping', () => {
    const [line1, line2] = formatTle(
      with_({ elementSetNumber: 12_345, revolutionNumber: 159_348 })
    );

    assert.equal(field(line1, 65, 68), '2345');
    assert.equal(field(line2, 64, 68), '59348');
  });

  test('defaults the classification to U', () => {
    const { classification: _, ...unclassified } = iss;

    assert.equal(formatTle(unclassified as MeanElementsInterface)[0][7], 'U');
    assert.equal(formatTle(with_({ classification: 'S' }))[0][7], 'S');
  });

  describe('rejects', () => {
    test('a value that does not fit in a TLE, naming it', () => {
      throwsRange(
        () => formatTle(with_({ catalogNumber: 340_000 })),
        'elements.catalogNumber must be a whole number in [0, 339 999] to fit in a TLE; use formatOmm for larger ones. Received: 340000'
      );
      throwsRange(
        () => formatTle(with_({ objectId: '98067A' })),
        'elements.objectId must be a launch year from 1957 to 2056, a launch number and a piece, like 1998-067A. Received: "98067A"'
      );
      throwsRange(
        () => formatTle(with_({ objectId: '1956-001A' })),
        'elements.objectId must be a launch year from 1957 to 2056, a launch number and a piece, like 1998-067A. Received: "1956-001A"'
      );
      throwsRange(
        () => formatTle(with_({ objectId: '2057-001A' })),
        'elements.objectId must be a launch year from 1957 to 2056, a launch number and a piece, like 1998-067A. Received: "2057-001A"'
      );
      throwsRange(
        () =>
          formatTle(
            with_({ epochJulianDate: 2_435_473.5, epoch: new Date(1956, 0, 1) })
          ),
        'elements.epoch must be from 1957 to 2056 to fit in a TLE. Received: the year 1956'
      );
      throwsRange(
        () => formatTle(with_({ meanMotionDot: 2e-9 })),
        'elements.meanMotionDot must be below 2 revolutions a day² to fit in a TLE. Received: 2e-9 rad/s²'
      );
      throwsRange(
        () => formatTle(with_({ e: 0.99999996 })),
        'elements.e must be in [0, 0.99999995) to fit in a TLE. Received: 0.99999996'
      );
      throwsRange(
        () => formatTle(with_({ meanMotion: (100 * 2 * Math.PI) / 86_400 })),
        'elements.meanMotion must be > 0 and below 100 revolutions a day to fit in a TLE. Received: 100 revolutions a day'
      );
    });

    test('a value that is not a finite number, or no elements', () => {
      assert.throws(
        () => formatTle(with_({ bstar: Number.NaN })),
        (err) =>
          err instanceof TypeError &&
          err.message ===
            'elements.bstar must be a finite number. Received: NaN'
      );
      assert.throws(
        () => formatTle(null as unknown as MeanElementsInterface),
        (err) =>
          err instanceof TypeError &&
          err.message === 'elements must be mean elements. Received: null'
      );
    });
  });
});

describe('formatOmm', () => {
  test('writes an OMM that parses to the same elements', () => {
    for (const elements of [iss, ...verification]) {
      const parsed = parseOmm(JSON.stringify(formatOmm(elements)));

      for (const [key, value] of Object.entries(elements)) {
        const back = parsed[key as keyof MeanElementsInterface];

        if (value instanceof Date)
          // The Date rounds the epoch to the millisecond, either way
          assert.ok(Math.abs((back as Date).getTime() - value.getTime()) <= 1);
        else if (typeof value !== 'number') assert.deepEqual(back, value);
        else if (key === 'epochJulianDate')
          // The Julian date holds the epoch to about 40 µs
          assert.ok(Math.abs((back as number) - value) <= 5e-10);
        else
          assert.ok(
            Math.abs((back as number) - value) <= 1e-15 * Math.abs(value),
            `${key}: ${back} ≉ ${value}`
          );
      }
    }
  });

  test("writes CelesTrak's keywords and epoch format", () => {
    assert.deepEqual(formatOmm(iss), {
      OBJECT_NAME: 'ISS (ZARYA)',
      OBJECT_ID: '1998-067A',
      EPOCH: formatOmm(iss).EPOCH,
      MEAN_MOTION: formatOmm(iss).MEAN_MOTION,
      ECCENTRICITY: 0.0007186,
      INCLINATION: formatOmm(iss).INCLINATION,
      RA_OF_ASC_NODE: formatOmm(iss).RA_OF_ASC_NODE,
      ARG_OF_PERICENTER: formatOmm(iss).ARG_OF_PERICENTER,
      MEAN_ANOMALY: formatOmm(iss).MEAN_ANOMALY,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 25544,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 59348,
      BSTAR: 0.00010236,
      MEAN_MOTION_DOT: formatOmm(iss).MEAN_MOTION_DOT,
      MEAN_MOTION_DDOT: 0
    });

    const omm = formatOmm(iss);

    // The TLE's 26308.36953014, to the 40 µs of a Julian date
    assert.match(omm.EPOCH, /^2026-11-04T08:52:07\.4040\d\d$/);

    for (const [value, expected] of [
      [omm.MEAN_MOTION, 15.49173979],
      [omm.INCLINATION, 51.6329],
      [omm.RA_OF_ASC_NODE, 326.3987],
      [omm.ARG_OF_PERICENTER, 346.7494],
      [omm.MEAN_ANOMALY, 13.3304],
      [omm.MEAN_MOTION_DOT, 0.00005228]
    ] as const)
      assert.ok(Math.abs(value - expected) < 1e-12 * expected);
  });

  test('leaves out a missing name and designator, and defaults the classification', () => {
    const { name: _, objectId: __, classification: ___, ...anonymous } = iss;
    const omm = formatOmm(anonymous as MeanElementsInterface);

    assert.equal('OBJECT_NAME' in omm, false);
    assert.equal('OBJECT_ID' in omm, false);
    assert.equal(omm.CLASSIFICATION_TYPE, 'U');
  });

  test('takes catalogue numbers a TLE has no room for', () => {
    assert.equal(
      formatOmm(with_({ catalogNumber: 800_000 })).NORAD_CAT_ID,
      800_000
    );
  });

  test('rejects a value that is not a finite number, or no elements', () => {
    assert.throws(
      () => formatOmm(with_({ e: Number.POSITIVE_INFINITY })),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'elements.eccentricity must be a finite number. Received: Infinity'
    );
    assert.throws(
      () => formatOmm(undefined as unknown as MeanElementsInterface),
      (err) =>
        err instanceof TypeError &&
        err.message === 'elements must be mean elements. Received: undefined'
    );
  });
});
