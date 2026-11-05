import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { parseOem } from '../oem.js';

const fixture = (name: string) =>
  readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');
// A one-segment OEM with the given metadata and data lines
const oem = (meta: string, ...data: string[]) =>
  [
    'CCSDS_OEM_VERS = 3.0',
    'META_START',
    'OBJECT_NAME = PROBE',
    'OBJECT_ID = 2026-001A',
    'CENTER_NAME = SUN',
    'REF_FRAME = ICRF',
    meta,
    'META_STOP',
    ...data
  ].join('\n');
const line = '2026-01-01T00:00:00 1 2 3 0.1 0.2 0.3';
const rejects = (text: string, message: string) =>
  assert.throws(
    () => parseOem(text),
    (err) => err instanceof RangeError && err.message === message
  );

describe('parseOem', () => {
  test('reads the CCSDS example, figure G-11, as two segments', () => {
    const segments = parseOem(fixture('ccsds-oem-g11.oem'));

    assert.equal(segments.length, 2);

    for (const segment of segments) {
      assert.equal(segment.objectName, 'MARS GLOBAL SURVEYOR');
      assert.equal(segment.objectId, '1996-062A');
      assert.equal(segment.center, 'MARS BARYCENTER');
      assert.equal(segment.frame, 'EME2000');
      assert.equal(segment.timeScale, 'UTC');
      assert.equal(segment.samples.length, 4);
    }

    const [first] = segments[0]!.samples;

    assert.equal(first!.epoch.toISOString(), '2019-12-18T12:00:00.331Z');
    // km and km/s, in m and m/s
    assert.deepEqual(first!.r, [2_789_619, -280_045, -1_746_755]);
    [4733.72, -2495.86, -1041.95].forEach((expected, k) =>
      assert.ok(Math.abs(first!.v[k]! - expected) < 1e-9)
    );
    assert.equal(
      segments[1]!.samples[0]!.epoch.toISOString(),
      '2019-12-28T21:29:07.267Z'
    );
  });

  test('skips the accelerations (G-12) and covariance matrices (G-13)', () => {
    const [withAccelerations] = parseOem(fixture('ccsds-oem-g12.oem'));
    const [withCovariance] = parseOem(fixture('ccsds-oem-g13.oem'));

    assert.deepEqual(
      withAccelerations!.samples[0]!.r,
      [2_789_600, -280_000, -1_746_800]
    );
    assert.deepEqual(withAccelerations!.samples[0]!.v, [4730, -2500, -1040]);
    assert.equal(withCovariance!.samples.length, 4);
    assert.equal(
      withCovariance!.samples[3]!.epoch.toISOString(),
      '2019-12-30T01:28:02.267Z'
    );
  });

  test('reads epochs on the TIME_SYSTEM clock, and days of the year', () => {
    const at = (scale: string, epoch: string) =>
      parseOem(
        oem(`TIME_SYSTEM = ${scale}`, `${epoch} 1 2 3 0.1 0.2 0.3`)
      )[0]!.samples[0]!.epoch.toISOString();

    assert.equal(at('UTC', '2026-01-01T00:00:00Z'), '2026-01-01T00:00:00.000Z');
    // 69.184 s and TDB − TT behind
    assert.equal(at('TDB', '2026-01-01T00:00:00'), '2025-12-31T23:58:50.816Z');
    assert.equal(at('TT', '2026-01-01T00:00:00'), '2025-12-31T23:58:50.816Z');
    assert.equal(at('TAI', '2026-01-01T00:00:00'), '2025-12-31T23:59:23.000Z');
    assert.equal(at('GPS', '2026-01-01T00:00:00'), '2025-12-31T23:59:42.000Z');
    // Day 352 of 2019 is 18 December
    assert.equal(at('UTC', '2019-352T12:00:00.5'), '2019-12-18T12:00:00.500Z');
  });

  test('rejects anything but an OEM in KVN', () => {
    assert.throws(
      () => parseOem(42 as unknown as string),
      (err) =>
        err instanceof TypeError &&
        err.message === 'text must be a string. Received: number'
    );
    rejects('', 'OEM line 1: an OEM must start with CCSDS_OEM_VERS.');
    rejects(
      'META_START',
      'OEM line 1: an OEM must start with CCSDS_OEM_VERS. Received: "META_START"'
    );
    rejects(
      'CCSDS_OEM_VERS = 3.0\nhello',
      'OEM line 2: expected META_START. Received: "hello"'
    );
    rejects('CCSDS_OEM_VERS = 3.0', 'OEM line 1: an OEM must have a segment.');
  });

  test('rejects incomplete or unsupported metadata', () => {
    rejects(
      oem('TIME_SYSTEM = UTC').replace('OBJECT_ID = 2026-001A\n', ''),
      'OEM line 7: the metadata must have OBJECT_ID.'
    );
    rejects(
      oem('TIME_SYSTEM = TCB', line),
      'OEM line 8: TIME_SYSTEM must be one of UTC, TAI, TT, UT1, TDB, GPS. Received: "TCB"'
    );
    rejects(
      oem('TIME_SYSTEM UTC'),
      'OEM line 7: metadata must be KEYWORD = value. Received: "TIME_SYSTEM UTC"'
    );
    rejects(
      oem('TIME_SYSTEM = UTC').replace('META_STOP', ''),
      'OEM line 8: the metadata must end with META_STOP.'
    );
  });

  test('rejects malformed data lines', () => {
    const meta = 'TIME_SYSTEM = UTC';

    rejects(oem(meta), 'OEM line 8: a segment must have data lines.');
    rejects(
      oem(meta, '2026-01-01T00:00:00 1 2 3 0.1 0.2'),
      'OEM line 9: a data line must have an epoch, a position and a velocity, and optionally an acceleration. Received: "2026-01-01T00:00:00 1 2 3 0.1 0.2"'
    );
    rejects(
      oem(meta, '2026-01-01T00:00:00 1 2 x 0.1 0.2 0.3'),
      'OEM line 9: data must be numbers. Received: "2026-01-01T00:00:00 1 2 x 0.1 0.2 0.3"'
    );

    for (const epoch of [
      '2026-02-30T00:00:00',
      '2026-367T00:00:00',
      '2026-000T00:00:00',
      '2026-01-01T24:00:00',
      '2026-01-01T00:60:00',
      '2026-01-01T00:00:61',
      '26-01-01T00:00:00'
    ])
      rejects(
        oem(meta, `${epoch} 1 2 3 0.1 0.2 0.3`),
        `OEM line 9: invalid epoch. Received: "${epoch}"`
      );

    rejects(
      oem(meta, line, line),
      'OEM line 10: epochs must increase. Received: "2026-01-01T00:00:00"'
    );
  });

  test('rejects an unfinished covariance block', () => {
    const meta = 'TIME_SYSTEM = UTC';

    rejects(
      oem(meta, line, 'COVARIANCE_START', '1'),
      'OEM line 11: a covariance block must end with COVARIANCE_STOP.'
    );
    rejects(
      oem(meta, line, 'COVARIANCE_START', 'META_START'),
      'OEM line 11: a covariance block must end with COVARIANCE_STOP.'
    );
  });
});
