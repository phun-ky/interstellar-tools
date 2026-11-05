import type { Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { zonalHarmonicsAcceleration } from '../zonal-harmonics-acceleration.js';

const MU = 3.986004415e14;
const R = 6_378_136.3;
// EGM2008's J2 to J6
const J = [1.0826e-3, -2.5324e-6, -1.6199e-6, -2.2775e-7, 5.4067e-7];
// The Legendre polynomials of degree 2 to 6, written out
const LEGENDRE = [
  (u: number) => (3 * u ** 2 - 1) / 2,
  (u: number) => (5 * u ** 3 - 3 * u) / 2,
  (u: number) => (35 * u ** 4 - 30 * u ** 2 + 3) / 8,
  (u: number) => (63 * u ** 5 - 70 * u ** 3 + 15 * u) / 8,
  (u: number) => (231 * u ** 6 - 315 * u ** 4 + 105 * u ** 2 - 5) / 16
];
// The zonal part of the potential, whose gradient is the acceleration
const potential = ([x, y, z]: readonly number[], coefficients: number[]) => {
  const r = Math.hypot(x!, y!, z!);

  return coefficients.reduce(
    (sum, Jn, k) =>
      sum - (MU / r) * Jn * (R / r) ** (k + 2) * LEGENDRE[k]!(z! / r),
    0
  );
};
const position = fc
  .tuple(
    fc.double({ min: 6.6e6, max: 4.5e7, noNaN: true }),
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

describe('zonalHarmonicsAcceleration', () => {
  test('is the gradient of the zonal potential, J2 to J6', () => {
    fc.assert(
      fc.property(position, (r) => {
        const a = zonalHarmonicsAcceleration(r, MU, R, J);
        const h = 1;

        for (let axis = 0; axis < 3; axis++) {
          const up = [...r];
          const down = [...r];

          up[axis]! += h;
          down[axis]! -= h;

          const gradient = (potential(up, J) - potential(down, J)) / (2 * h);

          assert.ok(
            Math.abs(a[axis]! - gradient) <= 1e-9 + 1e-6 * Math.hypot(...a),
            `${a[axis]} ≉ ${gradient}`
          );
        }
      })
    );
  });

  test('matches the closed form for J2 alone', () => {
    fc.assert(
      fc.property(position, ([x, y, z]) => {
        const r = Math.hypot(x, y, z);
        const k = (-1.5 * J[0]! * MU * R ** 2) / r ** 5;
        const u2 = (z / r) ** 2;
        const expected = [
          k * x * (1 - 5 * u2),
          k * y * (1 - 5 * u2),
          k * z * (3 - 5 * u2)
        ];
        const a = zonalHarmonicsAcceleration([x, y, z], MU, R, [J[0]!]);

        for (let axis = 0; axis < 3; axis++)
          assert.ok(
            Math.abs(a[axis]! - expected[axis]!) <= 1e-12 * Math.hypot(...a)
          );
      })
    );
  });

  test('pulls toward the equator, and inward over it', () => {
    const [ax, ay, az] = zonalHarmonicsAcceleration(
      [7_000_000, 0, 0],
      MU,
      R,
      J
    );

    assert.equal(ax.toFixed(4), '-0.0110');
    assert.equal(Math.abs(ay), 0);
    // Only the odd zonals reach the equator's z: tiny
    assert.ok(Math.abs(az) < 1e-4);
    assert.ok(zonalHarmonicsAcceleration([0, 5e6, 5e6], MU, R, [J[0]!])[2] < 0);
  });

  test('is mirrored across the equator by the even zonals, and flipped by the odd ones', () => {
    fc.assert(
      fc.property(position, ([x, y, z]) => {
        const even = [J[0]!, 0, J[2]!, 0, J[4]!];
        const odd = [0, J[1]!, 0, J[3]!];
        const north = zonalHarmonicsAcceleration([x, y, z], MU, R, even);
        const south = zonalHarmonicsAcceleration([x, y, -z], MU, R, even);
        const oddNorth = zonalHarmonicsAcceleration([x, y, z], MU, R, odd);
        const oddSouth = zonalHarmonicsAcceleration([x, y, -z], MU, R, odd);
        const tol = 1e-15;

        assert.ok(Math.abs(north[0] - south[0]) <= tol);
        assert.ok(Math.abs(north[2] + south[2]) <= tol);
        assert.ok(Math.abs(oddNorth[0] + oddSouth[0]) <= tol);
        assert.ok(Math.abs(oddNorth[2] - oddSouth[2]) <= tol);
      })
    );
  });

  test('is zero without coefficients', () => {
    assert.deepEqual(
      zonalHarmonicsAcceleration([7e6, 1e6, 2e6], MU, R, []),
      [0, 0, 0]
    );
  });

  test('rejects invalid input', () => {
    throwsWith(
      () => zonalHarmonicsAcceleration([1, 2, Number.NaN], MU, R, J),
      TypeError,
      'r must be three finite numbers. Received: 1,2,NaN'
    );
    throwsWith(
      () =>
        zonalHarmonicsAcceleration(
          [1, 2] as unknown as Vector3DTupleType,
          MU,
          R,
          J
        ),
      TypeError,
      'r must be three finite numbers. Received: 1,2'
    );
    throwsWith(
      () =>
        zonalHarmonicsAcceleration(
          [7e6, 0, 0],
          MU,
          R,
          'J2' as unknown as number[]
        ),
      TypeError,
      'J must be an array of numbers. Received: J2'
    );
    throwsWith(
      () => zonalHarmonicsAcceleration([7e6, 0, 0], MU, R, [1e-3, Number.NaN]),
      TypeError,
      'J[1] must be a finite number. Received: NaN'
    );
    throwsWith(
      () => zonalHarmonicsAcceleration([7e6, 0, 0], Number.NaN, R, J),
      TypeError,
      'mu must be a finite number. Received: NaN'
    );
    throwsWith(
      () => zonalHarmonicsAcceleration([7e6, 0, 0], 0, R, J),
      RangeError,
      'mu must be > 0. Received: 0'
    );
    throwsWith(
      () => zonalHarmonicsAcceleration([7e6, 0, 0], MU, -1, J),
      RangeError,
      'Re must be > 0. Received: -1'
    );
    throwsWith(
      () => zonalHarmonicsAcceleration([0, 0, 0], MU, R, J),
      RangeError,
      'r must not be zero.'
    );
  });
});
