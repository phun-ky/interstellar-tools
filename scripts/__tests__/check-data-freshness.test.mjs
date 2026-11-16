import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import {
  findProblems,
  lastIersLeapSecond,
  lastTableLeapSecond,
  probeWindowEnd
} from '../check-data-freshness.mjs';

const IERS = `#  File expiration date: 28 June 2027
#
    MJD        Date        TAI-UTC (s)
           day month year
    ---    --------------   ------
    57204.0    1  7 2015       36
    57754.0    1  1 2017       37
`;
const DATE_TS = `[
        ['2015-07-01', 36],
        ['2017-01-01', 37]
      ] as const`;
const PROBES = `export const PROBE_SAMPLES = {
  'voyager-1': [
    [
      1798761600000, 1, 2, 3,
      4, 5, 6
    ],
    [
      1830297600000, 1, 2, 3,
      4, 5, 6
    ]
  ],
  'juno': [
    [
      1798761600000, 1, 2, 3, 4, 5, 6
    ],
    [
      1814400000000, 1, 2, 3, 4, 5, 6
    ]
  ]
};`;
const current = {
  iers: { date: '2017-01-01', taiMinusUtc: 37 },
  table: { date: '2017-01-01', taiMinusUtc: 37 },
  windowEnd: new Date('2027-12-31'),
  now: new Date('2026-11-16')
};

describe('check-data-freshness', () => {
  test('reads the last IERS leap second', () => {
    assert.deepEqual(lastIersLeapSecond(IERS), {
      date: '2017-01-01',
      taiMinusUtc: 37
    });
  });

  test('reads the last LEAP_SECONDS row', () => {
    assert.deepEqual(lastTableLeapSecond(DATE_TS), {
      date: '2017-01-01',
      taiMinusUtc: 37
    });
  });

  test('the window ends with the first probe to run out', () => {
    assert.equal(
      probeWindowEnd(PROBES).toISOString(),
      new Date(1814400000000).toISOString()
    );
  });

  test('nothing to do when both are current', () => {
    assert.deepEqual(findProblems(current), []);
  });

  test('a new IERS leap second is a problem', () => {
    const problems = findProblems({
      ...current,
      iers: { date: '2027-07-01', taiMinusUtc: 38 }
    });

    assert.equal(problems.length, 1);
    assert.match(problems[0], /IERS lists 2027-07-01/);
  });

  test('a window ending within 90 days is a problem', () => {
    const problems = findProblems({ ...current, now: new Date('2027-11-01') });

    assert.equal(problems.length, 1);
    assert.match(problems[0], /end on 2027-12-31, 60 days from now/);
  });
});
