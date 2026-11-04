import type { MeanElementsInterface } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { parseOmm } from '../omm.js';
import { parseTle, tleChecksum } from '../tle.js';

const REVOLUTIONS_PER_DAY = (2 * Math.PI) / 86_400;
const rad = (deg: number) => (deg * Math.PI) / 180;
const close = (actual: number, expected: number, tol = 1e-15) =>
  assert.ok(
    Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)),
    `expected ${expected} ± ${tol}, got ${actual}`
  );
// Replace the text from a 1-indexed column, then set the checksum again
const edit = (line: string, column: number, text: string) => {
  const edited =
    line.slice(0, column - 1) + text + line.slice(column - 1 + text.length);

  return edited.slice(0, 68) + tleChecksum(edited);
};
const throwsRange = (fn: () => unknown, message: string) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof RangeError);
    assert.equal(err.message, message);

    return true;
  });
// Vallado, Crawford, Hujsak & Kelso (2006), SGP4-VER.TLE: the first 69
// columns of each line
const VALLADO = {
  teme: [
    '1 00005U 58002B   00179.78495062  .00000023  00000-0  28098-4 0  4753',
    '2 00005  34.2682 348.7242 1859667 331.7664  19.3264 10.82419157413667'
  ],
  negativeDot: [
    '1 04632U 70093B   04031.91070959 -.00000084  00000-0  10000-3 0  9955',
    '2 04632  11.4628 273.1101 1450506 207.6000 143.9350  1.20231981 44145'
  ],
  noDesignator: [
    '1 11801U          80230.29629788  .01431103  00000-0  14311-1      13',
    '2 11801  46.7916 230.4354 7318036  47.4722  10.4117  2.28537848    13'
  ],
  negativeDdot: [
    '1 16925U 86065D   06151.67415771  .02550794 -30915-6  18784-3 0  4486',
    '2 16925  62.0906 295.0239 5596327 245.1593  47.9690  4.88511875148616'
  ],
  threeLetterPiece: [
    '1 29141U 85108AA  06170.26783845  .99999999  00000-0  13519-0 0   718',
    '2 29141  82.4288 273.4882 0015848 277.2124  83.9133 15.93343074  6828'
  ],
  str3: [
    '1 88888U          80275.98708465  .00073094  13844-3  66816-4 0    87',
    '2 88888  72.8435 115.9689 0086731  52.6988 110.5714 16.05824518  1058'
  ]
} as const;
// The ISS from CelesTrak on 2026-11-04, as a TLE and as an OMM
const ISS_TLE = [
  'ISS (ZARYA)             ',
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
] as const;
const ISS_OMM = {
  OBJECT_NAME: 'ISS (ZARYA)',
  OBJECT_ID: '1998-067A',
  EPOCH: '2026-11-04T08:52:07.404096',
  MEAN_MOTION: 15.49173979,
  ECCENTRICITY: 0.0007186,
  INCLINATION: 51.6329,
  RA_OF_ASC_NODE: 326.3987,
  ARG_OF_PERICENTER: 346.7494,
  MEAN_ANOMALY: 13.3304,
  EPHEMERIS_TYPE: 0,
  CLASSIFICATION_TYPE: 'U',
  NORAD_CAT_ID: 25544,
  ELEMENT_SET_NO: 999,
  REV_AT_EPOCH: 59348,
  BSTAR: 0.00010236,
  MEAN_MOTION_DOT: 5.228e-5,
  MEAN_MOTION_DDOT: 0
};
const [ISS_1, ISS_2] = [ISS_TLE[1], ISS_TLE[2]];
const iss = () => parseTle(ISS_1, ISS_2, ISS_TLE[0]);
const withoutEpoch = ({
  epoch: _epoch,
  epochJulianDate: _epochJulianDate,
  ...rest
}: MeanElementsInterface) => rest;
const assertSameElements = (
  actual: MeanElementsInterface,
  expected: MeanElementsInterface
) => {
  assert.deepEqual(withoutEpoch(actual), withoutEpoch(expected));
  // An OMM rounds the epoch to the microsecond
  close(actual.epochJulianDate, expected.epochJulianDate, 1e-17);
  assert.ok(
    Math.abs(actual.epoch.getTime() - expected.epoch.getTime()) <= 1,
    `${actual.epoch.toISOString()} ≉ ${expected.epoch.toISOString()}`
  );
};

describe('tleChecksum', () => {
  test('sums the digits, with 1 for a minus sign, modulo 10', () => {
    assert.equal(tleChecksum(ISS_1), 1);
    assert.equal(tleChecksum(ISS_2), 3);
    assert.equal(tleChecksum(VALLADO.negativeDot[0]), 5);
    assert.equal(tleChecksum('-'), 1);
    assert.equal(tleChecksum('AZ +.'), 0);
  });

  test('ignores everything past column 68', () => {
    assert.equal(tleChecksum(`${ISS_1}9999`), tleChecksum(ISS_1));
  });

  test('rejects a non-string', () => {
    assert.throws(
      () => tleChecksum(42 as unknown as string),
      (err) =>
        err instanceof TypeError &&
        err.message === 'line must be a string. Received: number'
    );
  });
});

describe('parseTle', () => {
  test("reads Vallado's TEME example", () => {
    const sat = parseTle(...VALLADO.teme);

    assert.equal(sat.name, undefined);
    assert.equal(sat.objectId, '1958-002B');
    assert.equal(sat.catalogNumber, 5);
    assert.equal(sat.classification, 'U');
    // 2000 day 179.78495062: 2000 January 0.0 is JD 2451543.5
    assert.equal(sat.epochJulianDate, 2451543.5 + 179.78495062);
    assert.equal(sat.epoch.toISOString(), '2000-06-27T18:50:19.734Z');
    close(sat.meanMotion, 10.82419157 * REVOLUTIONS_PER_DAY);
    close(sat.meanMotionDot, (2 * 0.00000023 * REVOLUTIONS_PER_DAY) / 86_400);
    assert.equal(sat.meanMotionDdot, 0);
    assert.equal(sat.e, 0.1859667);
    close(sat.i, rad(34.2682));
    close(sat.raan, rad(348.7242));
    close(sat.argp, rad(331.7664));
    close(sat.meanAnomaly, rad(19.3264));
    assert.equal(sat.bstar, 0.28098e-4);
    assert.equal(sat.elementSetNumber, 475);
    assert.equal(sat.revolutionNumber, 41366);
  });

  test('reads negative derivatives', () => {
    close(
      parseTle(...VALLADO.negativeDot).meanMotionDot,
      (2 * -0.00000084 * REVOLUTIONS_PER_DAY) / 86_400
    );
    close(
      parseTle(...VALLADO.negativeDdot).meanMotionDdot,
      (6 * -0.30915e-6 * REVOLUTIONS_PER_DAY) / 86_400 ** 2
    );
  });

  test('reads a revolution number with leading blanks', () => {
    assert.equal(parseTle(...VALLADO.negativeDot).revolutionNumber, 4414);
  });

  test('reads a blank designator and ephemeris type, as in the original Spacetrack Report #3 tests', () => {
    const sat = parseTle(...VALLADO.noDesignator);

    assert.equal(sat.objectId, undefined);
    assert.equal(sat.elementSetNumber, 1);
    assert.equal(sat.revolutionNumber, 1);
    assert.equal(sat.epochJulianDate, 2444238.5 + 230.29629788);

    const str3 = parseTle(...VALLADO.str3);

    assert.equal(
      str3.meanMotionDdot,
      (6 * 0.13844e-3 * REVOLUTIONS_PER_DAY) / 86_400 ** 2
    );
    assert.equal(str3.bstar, 0.66816e-4);
  });

  test('reads a three-letter piece and a B* with no power of ten', () => {
    const sat = parseTle(...VALLADO.threeLetterPiece);

    assert.equal(sat.objectId, '1985-108AA');
    assert.equal(sat.bstar, 0.13519);
  });

  test('puts two-digit years from 57 in the 1900s', () => {
    assert.equal(
      parseTle(edit(ISS_1, 10, '05037B'), ISS_2).objectId,
      '2005-037B'
    );
    assert.equal(parseTle(...VALLADO.teme).epoch.getUTCFullYear(), 2000);
    assert.equal(
      parseTle(
        edit(VALLADO.teme[0], 19, '57'),
        VALLADO.teme[1]
      ).epoch.getUTCFullYear(),
      1957
    );
    assert.equal(
      parseTle(
        edit(VALLADO.teme[0], 19, '56'),
        VALLADO.teme[1]
      ).epoch.getUTCFullYear(),
      2056
    );
  });

  test('takes a name, with or without the 0 of a three-line file', () => {
    assert.equal(iss().name, 'ISS (ZARYA)');
    assert.equal(parseTle(ISS_1, ISS_2, '0 ISS (ZARYA)').name, 'ISS (ZARYA)');
    assert.equal(parseTle(ISS_1, ISS_2, '   ').name, undefined);
    assert.throws(
      () => parseTle(ISS_1, ISS_2, 7 as unknown as string),
      (err) =>
        err instanceof TypeError &&
        err.message === 'name must be a string. Received: number'
    );
  });

  test('ignores trailing spaces and carriage returns', () => {
    assertSameElements(
      parseTle(`${ISS_1}  \r`, `${ISS_2}\r`, ISS_TLE[0]),
      iss()
    );
  });

  describe('Alpha-5 catalogue numbers', () => {
    const alpha5 = (catalog: string) =>
      parseTle(edit(ISS_1, 3, catalog), edit(ISS_2, 3, catalog));

    test('read a letter as 10 to 33, skipping I and O', () => {
      assert.equal(alpha5('A0001').catalogNumber, 100_001);
      assert.equal(alpha5('H0000').catalogNumber, 170_000);
      assert.equal(alpha5('J0000').catalogNumber, 180_000);
      assert.equal(alpha5('P0000').catalogNumber, 230_000);
      assert.equal(alpha5('Z9999').catalogNumber, 339_999);
    });

    test('round-trip every catalogue number up to 339 999', () => {
      const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

      fc.assert(
        fc.property(fc.integer({ min: 0, max: 339_999 }), (n) => {
          const text =
            n < 100_000
              ? String(n).padStart(5, '0')
              : letters[Math.floor(n / 10_000) - 10] +
                String(n % 10_000).padStart(4, '0');

          assert.equal(alpha5(text).catalogNumber, n);
        })
      );
    });

    test('reject I, O and lower case', () => {
      for (const catalog of ['I0001', 'O0001', 'a0001'])
        throwsRange(
          () => alpha5(catalog),
          `TLE line 1, columns 3-7 (catalog number) must be a catalogue number: 5 digits, or a letter and 4 digits (Alpha-5). Received: "${catalog}"`
        );
    });
  });

  describe('rejects', () => {
    test('a corrupted checksum', () => {
      throwsRange(
        () => parseTle(`${ISS_1.slice(0, 68)}2`, ISS_2),
        'TLE line 1, column 69 (checksum) must be 1, the checksum of columns 1-68. Received: "2"'
      );
      throwsRange(
        () => parseTle(ISS_1, ISS_2.replace('51.6329', '51.6339')),
        'TLE line 2, column 69 (checksum) must be 4, the checksum of columns 1-68. Received: "3"'
      );
    });

    test('any one digit changed in columns 2-68', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(ISS_1, ISS_2),
          fc.integer({ min: 1, max: 67 }),
          fc.integer({ min: 1, max: 9 }),
          (line, index, shift) => {
            fc.pre(/\d/.test(line[index]!));

            const digit = (Number(line[index]) + shift) % 10;
            const corrupted =
              line.slice(0, index) + digit + line.slice(index + 1);

            assert.throws(
              () =>
                line === ISS_1
                  ? parseTle(corrupted, ISS_2)
                  : parseTle(ISS_1, corrupted),
              (err) =>
                err instanceof RangeError && /\(checksum\)/.test(err.message)
            );
          }
        )
      );
    });

    test('a misaligned line', () => {
      // Shifted a column right, still 69 long
      const shifted = edit(`2  ${ISS_2.slice(2, 68)}`, 69, '');

      throwsRange(
        () => parseTle(ISS_1, shifted),
        'TLE line 2, column 8 must be blank: the fields are out of line. Received: "4"'
      );
      throwsRange(
        () => parseTle(`${ISS_1.slice(0, 33)} ${ISS_1.slice(33)}`, ISS_2),
        'TLE line 1 must be 69 characters long. Received: 70 characters'
      );
      throwsRange(
        () => parseTle(` ${ISS_1}`, ISS_2),
        'TLE line 1 must be 69 characters long. Received: 70 characters'
      );
    });

    test('lines in the wrong order', () => {
      throwsRange(
        () => parseTle(ISS_2, ISS_1),
        'TLE line 1, column 1 (line number) must be "1". Received: "2"'
      );
    });

    test('lines from two satellites', () => {
      throwsRange(
        () => parseTle(ISS_1, VALLADO.teme[1]),
        'TLE line 2, columns 3-7 (catalog number) must match line 1, 25544. Received: 5'
      );
    });

    test('a malformed field, naming it', () => {
      throwsRange(
        () => parseTle(edit(ISS_1, 8, 'X'), ISS_2),
        'TLE line 1, column 8 (classification) must be U, C or S. Received: "X"'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 10, '98O67A'), ISS_2),
        'TLE line 1, columns 10-17 (international designator) must be blank, or a launch year, launch number and piece, like 98067A. Received: "98O67A  "'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 21, '308,36953014'), ISS_2),
        'TLE line 1, columns 21-32 (epoch day) must be a day of the year. Received: "308,36953014"'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 54, ' 10236 3'), ISS_2),
        'TLE line 1, columns 54-61 (B* drag term) must be a number with an assumed decimal point and a power of ten, like -11606-4. Received: " 10236 3"'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 63, 'x'), ISS_2),
        'TLE line 1, column 63 (ephemeris type) must be a digit or blank. Received: "x"'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 65, ' 9x9'), ISS_2),
        'TLE line 1, columns 65-68 (element set number) must be a whole number. Received: " 9x9"'
      );
      throwsRange(
        () => parseTle(ISS_1, edit(ISS_2, 27, '000.186')),
        'TLE line 2, columns 27-33 (eccentricity) must be digits after an assumed decimal point. Received: "000.186"'
      );
      throwsRange(
        () => parseTle(ISS_1, edit(ISS_2, 35, '346.74 4')),
        'TLE line 2, columns 35-42 (argument of perigee) must be a decimal number. Received: "346.74 4"'
      );
    });

    test('a value out of range, naming it', () => {
      throwsRange(
        () => parseTle(ISS_1, edit(ISS_2, 9, '190.0000')),
        'TLE line 2, columns 9-16 (inclination) must be in [0, 180]. Received: 190'
      );
      throwsRange(
        () => parseTle(ISS_1, edit(ISS_2, 53, ' 0.00000000')),
        'TLE line 2, columns 53-63 (mean motion) must be > 0. Received: 0'
      );
      throwsRange(
        () => parseTle(ISS_1, edit(ISS_2, 18, '360.0001')),
        'TLE line 2, columns 18-25 (right ascension of the ascending node) must be in [0, 360]. Received: 360.0001'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 21, '000.50000000'), ISS_2),
        'TLE line 1, columns 21-32 (epoch day) must be in [1, 366) for 2026. Received: 0.5'
      );
      throwsRange(
        () => parseTle(edit(ISS_1, 21, '366.50000000'), ISS_2),
        'TLE line 1, columns 21-32 (epoch day) must be in [1, 366) for 2026. Received: 366.5'
      );
      // 2024 has a 366th day
      assert.equal(
        parseTle(edit(ISS_1, 19, '24366.50000000'), ISS_2).epoch.toISOString(),
        '2024-12-31T12:00:00.000Z'
      );
    });

    test('a non-string line', () => {
      assert.throws(
        () => parseTle(undefined as unknown as string, ISS_2),
        (err) =>
          err instanceof TypeError &&
          err.message === 'TLE line 1 must be a string. Received: undefined'
      );
    });
  });
});

describe('parseOmm', () => {
  test('parses an OMM to the same elements as its TLE', () => {
    assertSameElements(parseOmm(ISS_OMM), iss());
  });

  test('takes the JSON text', () => {
    assertSameElements(parseOmm(JSON.stringify(ISS_OMM)), iss());
  });

  test("takes Space-Track's numbers as strings, and a trailing Z", () => {
    const strings = Object.fromEntries(
      Object.entries(ISS_OMM).map(([key, value]) => [key, String(value)])
    );

    assertSameElements(
      parseOmm({ ...strings, EPOCH: `${ISS_OMM.EPOCH}Z` }),
      iss()
    );
  });

  test('keeps the microseconds of the epoch in the Julian date', () => {
    const sat = parseOmm({ ...ISS_OMM, EPOCH: '2000-01-01T12:00:00.000001' });

    close(sat.epochJulianDate, 2451545 + 1e-6 / 86_400, 1e-17);
    assert.equal(sat.epoch.toISOString(), '2000-01-01T12:00:00.000Z');
  });

  test('takes catalogue numbers that a TLE has no room for', () => {
    assert.equal(
      parseOmm({ ...ISS_OMM, NORAD_CAT_ID: 800_000_123 }).catalogNumber,
      800_000_123
    );
  });

  test('defaults the bookkeeping and leaves out blank names', () => {
    const {
      ELEMENT_SET_NO: _set,
      REV_AT_EPOCH: _rev,
      CLASSIFICATION_TYPE: _class,
      OBJECT_NAME: _name,
      ...rest
    } = ISS_OMM;
    const sat = parseOmm({ ...rest, OBJECT_ID: ' ' });

    assert.equal(sat.elementSetNumber, 0);
    assert.equal(sat.revolutionNumber, 0);
    assert.equal(sat.classification, 'U');
    assert.equal('name' in sat, false);
    assert.equal('objectId' in sat, false);
  });

  describe('rejects', () => {
    const typeError = (fn: () => unknown, message: string) =>
      assert.throws(
        fn,
        (err) => err instanceof TypeError && err.message === message
      );

    test('a missing or non-numeric value, naming it', () => {
      const { MEAN_MOTION: _n, ...rest } = ISS_OMM;

      typeError(
        () => parseOmm(rest),
        'OMM MEAN_MOTION must be a number. Received: undefined'
      );
      typeError(
        () => parseOmm({ ...ISS_OMM, BSTAR: '' }),
        'OMM BSTAR must be a number. Received: ""'
      );
      typeError(
        () => parseOmm({ ...ISS_OMM, INCLINATION: 'high' }),
        'OMM INCLINATION must be a number. Received: "high"'
      );
      typeError(
        () => parseOmm({ ...ISS_OMM, ECCENTRICITY: null }),
        'OMM ECCENTRICITY must be a number. Received: null'
      );
      typeError(
        () => parseOmm({ ...ISS_OMM, OBJECT_NAME: 42 }),
        'OMM OBJECT_NAME must be a string. Received: 42'
      );
    });

    test('a value out of range, naming it', () => {
      throwsRange(
        () => parseOmm({ ...ISS_OMM, ECCENTRICITY: 1.2 }),
        'OMM ECCENTRICITY must be in [0, 1). Received: 1.2'
      );
      throwsRange(
        () => parseOmm({ ...ISS_OMM, NORAD_CAT_ID: 25544.5 }),
        'OMM NORAD_CAT_ID must be a whole number ≥ 0. Received: 25544.5'
      );
      throwsRange(
        () => parseOmm({ ...ISS_OMM, MEAN_ANOMALY: -1 }),
        'OMM MEAN_ANOMALY must be in [0, 360]. Received: -1'
      );
      throwsRange(
        () => parseOmm({ ...ISS_OMM, CLASSIFICATION_TYPE: 'X' }),
        'OMM CLASSIFICATION_TYPE must be U, C or S. Received: "X"'
      );
    });

    test('an invalid epoch', () => {
      for (const epoch of [
        '2026-02-30T00:00:00',
        '2026-13-01T00:00:00',
        '2026-11-04T24:00:00',
        '2026-11-04T08:60:00',
        '2026-11-04T08:52:60',
        '2026-11-04 08:52:07',
        '2026-11-04T08:52:07+01:00'
      ])
        throwsRange(
          () => parseOmm({ ...ISS_OMM, EPOCH: epoch }),
          `OMM EPOCH must be a UTC date and time, like 2026-11-04T08:52:07.404096. Received: "${epoch}"`
        );

      const { EPOCH: _epoch, ...rest } = ISS_OMM;

      throwsRange(
        () => parseOmm(rest),
        'OMM EPOCH must be a UTC date and time, like 2026-11-04T08:52:07.404096. Received: undefined'
      );
    });

    test('an array, or anything but a record', () => {
      typeError(
        () => parseOmm([ISS_OMM]),
        'omm must be one OMM record, not an array: pass each record in it.'
      );
      typeError(
        () => parseOmm('[]'),
        'omm must be one OMM record, not an array: pass each record in it.'
      );
      typeError(
        () => parseOmm('null'),
        'omm must be an OMM record or its JSON text. Received: null'
      );
      typeError(
        () => parseOmm(42 as unknown as object),
        'omm must be an OMM record or its JSON text. Received: 42'
      );
      assert.throws(() => parseOmm('{'), SyntaxError);
    });
  });
});
