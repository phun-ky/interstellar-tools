import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { meridionalRadiusOfCurvature } from '../meridional-radius-of-curvature.js';
import { primeVerticalRadiusOfCurvature } from '../prime-vertical-radius-of-curvature.js';
import { relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const A = 6_378_137; // m, WGS 84
const E2 = 0.00669437999014;
const M = meridionalRadiusOfCurvature;
const N = primeVerticalRadiusOfCurvature;

describe('meridionalRadiusOfCurvature and primeVerticalRadiusOfCurvature', () => {
  test('give N = a and M = a(1 − e²) at the equator', () => {
    assert.equal(N(rad(0), A, E2), A);
    relClose(M(rad(0), A, E2), A * (1 - E2));
    assert.equal(Math.round(M(rad(0), A, E2)), 6_335_439);
  });

  test('meet at a / √(1 − e²) at the poles', () => {
    for (const pole of [90, -90]) {
      relClose(M(rad(pole), A, E2), A / Math.sqrt(1 - E2), 1e-14);
      relClose(N(rad(pole), A, E2), A / Math.sqrt(1 - E2), 1e-14);
    }

    assert.equal(Math.round(N(rad(90), A, E2)), 6_399_594);
  });

  test('are both a on a sphere', () => {
    assert.equal(M(rad(37), A, 0), A);
    assert.equal(N(rad(37), A, 0), A);
  });

  test('keep M <= N, both growing towards the poles', () => {
    let last = { m: 0, n: 0 };

    for (let deg = 0; deg <= 90; deg += 5) {
      const m = M(rad(deg), A, E2);
      const n = N(rad(deg), A, E2);

      assert.ok(m <= n * (1 + 1e-15));
      assert.ok(m >= last.m && n >= last.n);
      last = { m, n };
    }
  });

  test('are symmetric about the equator', () => {
    assert.equal(M(rad(45), A, E2), M(rad(-45), A, E2));
    assert.equal(N(rad(45), A, E2), N(rad(-45), A, E2));
  });

  test('make a degree of latitude 110.57 km at the equator and 111.69 km at the poles', () => {
    const degree = Math.PI / 180;

    assert.equal(((M(rad(0), A, E2) * degree) / 1000).toFixed(2), '110.57');
    assert.equal(((M(rad(90), A, E2) * degree) / 1000).toFixed(2), '111.69');
    assert.equal(((N(rad(0), A, E2) * degree) / 1000).toFixed(2), '111.32');
  });

  test('throw for non-finite inputs, a latitude past a pole, a <= 0 or e² outside [0, 1)', () => {
    for (const f of [M, N]) {
      assert.throws(
        () => f(Number.NaN as Radians, A, E2),
        (err) =>
          err instanceof TypeError &&
          err.message === 'phi must be a finite number. Received: NaN'
      );
      assert.throws(
        () => f(2 as Radians, A, E2),
        (err) =>
          err instanceof RangeError &&
          err.message === 'phi must be in [-π/2, π/2]. Received: 2'
      );
      assert.throws(
        () => f(rad(0), 0, E2),
        (err) =>
          err instanceof RangeError &&
          err.message === 'a must be > 0. Received: 0'
      );
      assert.throws(
        () => f(rad(0), A, 1),
        (err) =>
          err instanceof RangeError &&
          err.message === 'eSquared must be in [0, 1). Received: 1'
      );
    }
  });
});
