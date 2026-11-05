import type { Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { thirdBodyAcceleration } from '../third-body-acceleration.js';

const MU_MOON = 4.9028e12;
const MU_SUN = 1.32712440018e20;
const AU = 1.495978707e11;
// The tidal pull as a textbook writes it, which loses digits far away
const direct = (r: readonly number[], s: readonly number[], mu: number) => {
  const d = s.map((x, k) => x - r[k]!);
  const dn = Math.hypot(...d);
  const sn = Math.hypot(...s);

  return d.map((x, k) => mu * (x / dn ** 3 - s[k]! / sn ** 3));
};
const vector = (min: number, max: number) =>
  fc
    .tuple(
      fc.double({ min, max, noNaN: true }),
      fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true }),
      fc.double({ min: -Math.PI, max: Math.PI, noNaN: true })
    )
    .map(([r, lat, lon]): Vector3DTupleType => [
      r * Math.cos(lat) * Math.cos(lon),
      r * Math.cos(lat) * Math.sin(lon),
      r * Math.sin(lat)
    ]);
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });

describe('thirdBodyAcceleration', () => {
  test('pulls a satellite under the Moon toward it', () => {
    const [ax, ay, az] = thirdBodyAcceleration(
      [6_778_137, 0, 0],
      [3.844e8, 0, 0],
      MU_MOON
    );

    assert.equal(ax.toExponential(1), '1.2e-6');
    assert.equal(Math.abs(ay), 0);
    assert.equal(Math.abs(az), 0);
  });

  test('matches the textbook form where it keeps its digits', () => {
    fc.assert(
      fc.property(vector(6.5e6, 5e7), vector(1e8, 5e8), (r, s) => {
        const a = thirdBodyAcceleration(r, s, MU_MOON);
        const b = direct(r, s, MU_MOON);

        for (let k = 0; k < 3; k++)
          assert.ok(Math.abs(a[k]! - b[k]!) <= 1e-9 * Math.hypot(...b));
      })
    );
  });

  test("keeps its digits for the Sun's tide, where the textbook form doesn't", () => {
    fc.assert(
      fc.property(vector(6.5e6, 5e7), vector(0.98 * AU, 1.02 * AU), (r, s) => {
        const a = thirdBodyAcceleration(r, s, MU_SUN);
        const sn = Math.hypot(...s);
        const rs = (r[0] * s[0] + r[1] * s[1] + r[2] * s[2]) / sn;
        // The tide to first order in r/s: (μ/s³)(3 (r·ŝ) ŝ − r)
        const tide = r.map(
          (x, k) => (MU_SUN / sn ** 3) * ((3 * rs * s[k]!) / sn - x)
        );
        const size = Math.hypot(...tide);

        // The next order is r/s smaller: 3e-4 at most here
        for (let k = 0; k < 3; k++)
          assert.ok(Math.abs(a[k]! - tide[k]!) <= 1e-3 * size + 1e-20);
      })
    );
  });

  test('is zero for a massless body, and for a satellite at the centre', () => {
    assert.deepEqual(
      thirdBodyAcceleration([7e6, 0, 0], [3.844e8, 0, 0], 0).map(Math.abs),
      [0, 0, 0]
    );
    assert.deepEqual(
      thirdBodyAcceleration([0, 0, 0], [3.844e8, 1e8, 0], MU_MOON).map(
        Math.abs
      ),
      [0, 0, 0]
    );
  });

  test('rejects invalid input', () => {
    throwsWith(
      () => thirdBodyAcceleration([1, 2, Number.NaN], [1e8, 0, 0], MU_MOON),
      TypeError,
      'r must be three finite numbers. Received: 1,2,NaN'
    );
    throwsWith(
      () =>
        thirdBodyAcceleration(
          [7e6, 0, 0],
          [1e8, 0] as unknown as Vector3DTupleType,
          MU_MOON
        ),
      TypeError,
      'rBody must be three finite numbers. Received: 100000000,0'
    );
    throwsWith(
      () => thirdBodyAcceleration([7e6, 0, 0], [1e8, 0, 0], Number.NaN),
      TypeError,
      'muBody must be a finite number. Received: NaN'
    );
    throwsWith(
      () => thirdBodyAcceleration([7e6, 0, 0], [1e8, 0, 0], -1),
      RangeError,
      'muBody must be >= 0. Received: -1'
    );
    throwsWith(
      () => thirdBodyAcceleration([7e6, 0, 0], [0, 0, 0], MU_MOON),
      RangeError,
      'rBody must not be zero.'
    );
    throwsWith(
      () => thirdBodyAcceleration([7e6, 0, 0], [7e6, 0, 0], MU_MOON),
      RangeError,
      'rBody must not be at r.'
    );
  });
});
