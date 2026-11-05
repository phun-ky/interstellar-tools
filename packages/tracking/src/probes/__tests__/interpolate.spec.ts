import { AU_METERS } from '@interstellar-tools/constants';
import type {
  EphemerisInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { describe } from 'node:test';

import { parseHorizonsVectors } from '../horizons.js';
import { stateAt } from '../interpolate.js';

const horizons = (name: string) =>
  parseHorizonsVectors(
    readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8')
  );
const voyager1 = horizons('horizons-voyager1.txt');
// Parker Solar Probe through perihelion, every 6 hours and every hour
const coarse = horizons('horizons-psp-6h.txt');
const truth = horizons('horizons-psp-1h.txt');
const distance = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const HOUR = 3_600_000;
const START = Date.UTC(2026, 0, 1);
// A path whose coordinates are polynomials of a degree in hours from START, in
// m, and its velocity in m/s
const path = (degree: number, hours: number) => {
  const terms = (axis: number) =>
    Array.from({ length: degree + 1 }, (_, k) => ((axis + 1) * 1000) / (k + 1));
  const at = (f: (c: number, k: number) => number): Vector3DTupleType => {
    const [x, y, z] = [0, 1, 2].map((axis) =>
      terms(axis).reduce((sum, c, k) => sum + f(c, k), 0)
    );

    return [x!, y!, z!];
  };

  return {
    r: at((c, k) => c * hours ** k),
    v: at((c, k) => (k === 0 ? 0 : (c * k * hours ** (k - 1)) / 3600))
  };
};
// The path sampled every hour
const sampled = (degree: number, samples: number): EphemerisInterface => ({
  center: 'EARTH',
  frame: 'ICRF',
  timeScale: 'UTC',
  samples: Array.from({ length: samples }, (_, k) => ({
    epoch: new Date(START + k * HOUR),
    ...path(degree, k)
  }))
});

describe('stateAt', () => {
  test('returns a sample exactly at its epoch', () => {
    for (const sample of voyager1.samples)
      assert.deepEqual(stateAt(voyager1, sample.epoch), {
        r: sample.r,
        v: sample.v
      });
  });

  test('beats linear interpolation through a perihelion a thousandfold', () => {
    let hermite = 0;
    let linear = 0;
    let speed = 0;

    for (const sample of truth.samples) {
      const t = sample.epoch.getTime();
      const { r, v } = stateAt(coarse, sample.epoch);
      const next = coarse.samples.findIndex(
        ({ epoch }) => epoch.getTime() >= t
      );
      const a = coarse.samples[Math.max(next - 1, 0)]!;
      const b = coarse.samples[next]!;
      const f =
        b === a
          ? 0
          : (t - a.epoch.getTime()) / (b.epoch.getTime() - a.epoch.getTime());
      const straight: Vector3DTupleType = [
        a.r[0] + f * (b.r[0] - a.r[0]),
        a.r[1] + f * (b.r[1] - a.r[1]),
        a.r[2] + f * (b.r[2] - a.r[2])
      ];

      hermite = Math.max(hermite, distance(r, sample.r));
      linear = Math.max(linear, distance(straight, sample.r));
      speed = Math.max(speed, distance(v, sample.v));
    }

    // 137 km off at worst, at 190 km/s and 7 million km from the Sun, where
    // the straight line cuts 162 000 km inside the curve
    assert.ok(hermite < 200_000, `${hermite} m`);
    assert.ok(linear > 1000 * hermite, `${linear} m`);
    assert.ok(speed < 50, `${speed} m/s`);
  });

  test('follows the default of 4 samples better than fewer or more', () => {
    const worst = (points: number) =>
      Math.max(
        ...truth.samples.map((sample) =>
          distance(stateAt(coarse, sample.epoch, { points }).r, sample.r)
        )
      );

    for (const points of [2, 3, 6, 8]) assert.ok(worst(4) < worst(points));
  });

  test('reproduces a polynomial path of degree 2n - 1 through n samples', () => {
    fc.assert(
      fc.property(fc.double({ min: 0, max: 3, noNaN: true }), (hours) => {
        const date = new Date(START + hours * HOUR);
        const exact = (degree: number) =>
          path(degree, (date.getTime() - START) / HOUR);

        for (const [degree, points] of [
          [3, 2],
          [5, 3],
          [7, 4]
        ] as const) {
          const { r, v } = stateAt(sampled(degree, 4), date, { points });
          const expected = exact(degree);

          assert.ok(distance(r, expected.r) < 1e-6, `degree ${degree}: r`);
          assert.ok(distance(v, expected.v) < 1e-9, `degree ${degree}: v`);
        }
      })
    );
  });

  test('takes the velocity as the slope of the position', () => {
    const date = new Date('2026-01-05T06:00:00Z');
    const { v } = stateAt(voyager1, date);
    const before = stateAt(voyager1, new Date(date.getTime() - 1000)).r;
    const after = stateAt(voyager1, new Date(date.getTime() + 1000)).r;

    v.forEach((value, axis) =>
      assert.ok(Math.abs(value - (after[axis]! - before[axis]!) / 2) < 1e-3)
    );
    // Voyager 1, 169 au out, leaving at 17 km/s
    assert.ok(
      Math.abs(Math.hypot(...stateAt(voyager1, date).r) / AU_METERS - 169.2) <
        0.1
    );
    assert.ok(Math.abs(Math.hypot(...v) - 17_000) < 100);
  });

  test('interpolates to the ends of the ephemeris, and a single sample', () => {
    const first = voyager1.samples[0]!;
    const last = voyager1.samples[voyager1.samples.length - 1]!;
    const near = stateAt(voyager1, new Date(first.epoch.getTime() + 1000)).r;

    assert.ok(distance(near, first.r) < 20_000);
    assert.deepEqual(stateAt(voyager1, last.epoch).r, last.r);
    assert.deepEqual(
      stateAt({ ...voyager1, samples: [first] }, first.epoch).r,
      first.r
    );
  });

  test('rejects a date outside the ephemeris, or invalid input', () => {
    assert.throws(
      () => stateAt(voyager1, new Date('2026-01-12T00:00:00Z')),
      (err) =>
        err instanceof RangeError &&
        err.message ===
          'date must be within the ephemeris, 2025-12-31T23:58:50.816Z to 2026-01-10T23:58:50.816Z. Received: 2026-01-12T00:00:00.000Z'
    );
    assert.throws(
      () => stateAt(voyager1, new Date('2025-12-31T23:58:50.815Z')),
      RangeError
    );
    assert.throws(
      () => stateAt(voyager1, new Date(Number.NaN)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'date must be a valid Date. Received: Invalid Date'
    );
    assert.throws(
      () => stateAt({ ...voyager1, samples: [] }, new Date()),
      (err) =>
        err instanceof TypeError &&
        err.message === 'ephemeris must have samples.'
    );
    assert.throws(
      () => stateAt(voyager1, voyager1.samples[1]!.epoch, { points: 2.5 }),
      (err) =>
        err instanceof TypeError &&
        err.message === 'points must be an integer. Received: 2.5'
    );

    for (const points of [1, 9])
      assert.throws(
        () => stateAt(voyager1, voyager1.samples[1]!.epoch, { points }),
        (err) =>
          err instanceof RangeError &&
          err.message === `points must be from 2 to 8. Received: ${points}`
      );
  });
});
