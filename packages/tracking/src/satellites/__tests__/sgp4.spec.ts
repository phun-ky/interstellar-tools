import type { MeanElementsInterface, Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { propagate, propagateMinutes } from '../propagate.js';
import { parseTle, tleChecksum } from '../tle.js';

const fixture = (name: string) =>
  readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');
// Set the checksum again: the error cases at the end of the set don't match
const fix = (line: string) => line.slice(0, 68) + tleChecksum(line);
const TLE_LINES = fixture('sgp4-ver.tle')
  .split(/\r?\n/)
  .filter((line) => /^[12] /.test(line))
  .map((line) => fix(line.slice(0, 69)));
const SETS = TLE_LINES.flatMap((line, index) =>
  index % 2 ? [] : [parseTle(line, TLE_LINES[index + 1]!)]
);
// Each run in the reference output: catalogue number, then rows of minutes,
// position in km and velocity in km/s
const RUNS = fixture('tcppver.out')
  .split('\n')
  .reduce<{ id: number; rows: number[][] }[]>((runs, line) => {
    const header = /^(\d+) xx/.exec(line);

    if (header) runs.push({ id: Number(header[1]), rows: [] });
    else if (line.trim())
      runs[runs.length - 1]!.rows.push(line.trim().split(/\s+/).map(Number));

    return runs;
  }, []);
// km and km/s, as the reference prints them
const KM = 1e-6;
const KM_S = 1e-9;
const sgp4Error = (message: RegExp) => (err: unknown) =>
  err instanceof RangeError && message.test(err.message);
const iss = parseTle(
  '1 25544U 98067A   26308.36953014  .00005228  00000+0  10236-3 0  9991',
  '2 25544  51.6329 326.3987 0007186 346.7494  13.3304 15.49173979593483'
);

describe('propagateMinutes', () => {
  test("matches Vallado's verification set to 1 mm and 1 µm/s", () => {
    let compared = 0;

    assert.equal(RUNS.length, SETS.length);

    RUNS.forEach(({ id, rows }, index) => {
      const sat = SETS[index]!;

      assert.equal(sat.catalogNumber, id);

      // The reference fails on this one at once, and prints stale values
      if (id === 33334) return;

      for (const [minutes, ...expected] of rows) {
        const { r, v } = propagateMinutes(sat, minutes!);

        r.forEach((x, axis) =>
          assert.ok(
            Math.abs(x / 1000 - expected[axis]!) <= KM,
            `${id} at ${minutes} min, r[${axis}]: ${x / 1000} km ≉ ${expected[axis]} km`
          )
        );
        v.forEach((x, axis) =>
          assert.ok(
            Math.abs(x / 1000 - expected[axis + 3]!) <= KM_S,
            `${id} at ${minutes} min, v[${axis}]: ${x / 1000} km/s ≉ ${expected[axis + 3]} km/s`
          )
        );
        compared++;
      }
    });

    // Every row but 33334's
    assert.equal(compared, 666);
  });

  test('reports a satellite that has decayed', () => {
    const minotaur = SETS.find((sat) => sat.catalogNumber === 28872)!;
    const sl14 = SETS.find((sat) => sat.catalogNumber === 29141)!;

    // The reference stops after 50 min, and 420 min
    assert.doesNotThrow(() => propagateMinutes(minotaur, 50));
    assert.throws(
      () => propagateMinutes(minotaur, 55),
      sgp4Error(
        /^SGP4 can't propagate these elements to 55 min from epoch: the satellite has decayed: its distance from Earth's centre fell to 635\d\.\d km$/
      )
    );
    assert.doesNotThrow(() => propagateMinutes(sl14, 420));
    assert.throws(
      () => propagateMinutes(sl14, 440),
      sgp4Error(/the satellite has decayed/)
    );
  });

  test("reports the model's other errors, as the reference does", () => {
    const at = (id: number) => SETS.find((sat) => sat.catalogNumber === id)!;

    // 33333: eccentricity 0.995, until the semi-latus rectum goes negative
    assert.doesNotThrow(() => propagateMinutes(at(33333), 20));
    assert.throws(
      () => propagateMinutes(at(33333), 25),
      sgp4Error(/to 25 min from epoch: the semi-latus rectum fell to -/)
    );
    // 33334: a period of 400 years
    assert.throws(
      () => propagateMinutes(at(33334), 0),
      sgp4Error(/to 0 min from epoch: the perturbed eccentricity reached -/)
    );
  });

  test('reports a mean eccentricity driven out of range by drag', () => {
    assert.throws(
      () => propagateMinutes({ ...iss, bstar: 10 }, 60),
      sgp4Error(
        /^SGP4 can't propagate these elements to 60 min from epoch: the mean eccentricity reached -0\.003/
      )
    );
  });

  test('handles equatorial and retrograde equatorial orbits', () => {
    // No division by sin i or 1 + cos i at 0° and 180°
    const geo = SETS.find((sat) => sat.catalogNumber === 28626)!;

    for (const i of [0, Math.PI])
      for (const minutes of [0, 720, 1440]) {
        const { r, v } = propagateMinutes({ ...geo, i: i as Radians }, minutes);

        // The Moon and Sun tilt it a little out of the equator
        assert.ok(Math.abs(Math.hypot(...r) / 1000 - 42_164) < 5);
        assert.ok(Math.abs(r[2] / 1000) < 4000);
        assert.ok(Math.abs(Math.hypot(...v) - 3075) < 1);
      }

    for (const i of [0, Math.PI]) {
      const { r } = propagateMinutes({ ...iss, i: i as Radians }, 45);

      assert.ok(Math.abs(r[2]) < 1e-6);
    }
  });

  test('takes a node given as a negative angle, near the equator', () => {
    // Below 0.2 rad of inclination, the lunar and solar periodics wrap the
    // node. The report's form adds cos i times the node to the argument of
    // perigee, so a node 2π lower moves the satellite a few metres, not 0
    const geo = SETS.find((sat) => sat.catalogNumber === 28626)!;

    for (const raan of [1, 5]) {
      const a = propagateMinutes({ ...geo, raan: raan as Radians }, 720).r;
      const b = propagateMinutes(
        { ...geo, raan: (raan - 2 * Math.PI) as Radians },
        720
      ).r;

      assert.ok(Math.hypot(...a.map((x, k) => x - b[k]!)) < 50);
    }
  });

  test('goes back in time from the epoch', () => {
    const at = propagateMinutes(iss, -45);
    const period = (2 * Math.PI) / iss.meanMotion / 60;

    assert.ok(Math.abs(Math.hypot(...at.r) / 1000 - 6790) < 20);
    // One orbit back is near the epoch position
    const back = propagateMinutes(iss, -period);
    const now = propagateMinutes(iss, 0);

    assert.ok(Math.hypot(...back.r.map((x, k) => x - now.r[k]!)) < 50_000);
  });

  test('rejects invalid input', () => {
    assert.throws(
      () => propagateMinutes(iss, Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'minutes must be a finite number. Received: NaN'
    );
    assert.throws(
      () => propagateMinutes(null as unknown as MeanElementsInterface, 0),
      (err) =>
        err instanceof TypeError &&
        err.message ===
          'elements must be mean elements from parseTle or parseOmm. Received: null'
    );
    assert.throws(
      () => propagateMinutes({ ...iss, bstar: Number.NaN }, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'elements.bstar must be a finite number. Received: NaN'
    );
    assert.throws(
      () => propagateMinutes({ ...iss, meanMotion: 0 }, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'elements.meanMotion must be > 0. Received: 0'
    );
    assert.throws(
      () => propagateMinutes({ ...iss, e: 1 }, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'elements.e must be in [0, 1). Received: 1'
    );
  });
});

describe('propagate', () => {
  test('propagates to a date, counting minutes from the epoch', () => {
    const sat = SETS[0]!;
    const { r } = propagate(sat, new Date(sat.epoch.getTime() + 360 * 60_000));
    const expected = propagateMinutes(sat, 360).r;

    // The epoch Date is rounded to the millisecond: under 8 m at 7.5 km/s
    assert.ok(Math.hypot(...r.map((x, k) => x - expected[k]!)) < 8);
  });

  test('puts the ISS about 6 790 km from the centre, at 7.66 km/s', () => {
    const { r, v } = propagate(iss, new Date('2026-11-04T12:00:00Z'));

    assert.ok(Math.abs(Math.hypot(...r) / 1000 - 6790) < 20);
    assert.ok(Math.abs(Math.hypot(...v) - 7660) < 30);
  });

  test('rejects an invalid date', () => {
    assert.throws(() => propagate(iss, new Date('nope')), TypeError);
  });
});
