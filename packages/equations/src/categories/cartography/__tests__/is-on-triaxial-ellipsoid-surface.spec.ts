import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { isOnTriaxialEllipsoidSurface } from '../is-on-triaxial-ellipsoid-surface';

describe('isOnTriaxialEllipsoidSurface', () => {
  test('returns true for axis points on the surface: (a,0,0), (0,b,0), (0,0,c)', () => {
    const a = 3;
    const b = 2;
    const c = 1;

    assert.equal(isOnTriaxialEllipsoidSurface(a, 0, 0, a, b, c), true);
    assert.equal(isOnTriaxialEllipsoidSurface(0, b, 0, a, b, c), true);
    assert.equal(isOnTriaxialEllipsoidSurface(0, 0, c, a, b, c), true);
  });

  test('returns true for a known on-surface point (scaled direction vector)', () => {
    // Pick a direction (u,v,w), then scale so that x²/a² + y²/b² + z²/c² = 1.
    const a = 3;
    const b = 2;
    const c = 1;

    const u = 0.3;
    const v = -0.4;
    const w = 0.5;

    // Scale factor s such that:
    // (s*u)²/a² + (s*v)²/b² + (s*w)²/c² = 1  =>  s = 1 / sqrt( u²/a² + v²/b² + w²/c² )
    const denom = (u * u) / (a * a) + (v * v) / (b * b) + (w * w) / (c * c);
    const s = 1 / Math.sqrt(denom);

    const x = s * u;
    const y = s * v;
    const z = s * w;

    assert.equal(isOnTriaxialEllipsoidSurface(x, y, z, a, b, c), true);
  });

  test('returns false for an interior point (0,0,0)', () => {
    assert.equal(isOnTriaxialEllipsoidSurface(0, 0, 0, 3, 2, 1), false);
  });

  test('returns false for an exterior point (2a,0,0)', () => {
    const a = 3;
    assert.equal(isOnTriaxialEllipsoidSurface(2 * a, 0, 0, a, 2, 1), false);
  });

  test('eps controls tolerance (near-surface point passes only with looser eps)', () => {
    const a = 3;
    const b = 2;
    const c = 1;

    // Slightly off the +X axis surface point
    const x = a * 1.0000001;

    // With default eps=1e-12, should be false
    assert.equal(isOnTriaxialEllipsoidSurface(x, 0, 0, a, b, c), false);

    // With looser eps, should be true
    assert.equal(isOnTriaxialEllipsoidSurface(x, 0, 0, a, b, c, 1e-6), true);
  });

  test('throws TypeError when any input is not finite', () => {
    assert.throws(
      () => isOnTriaxialEllipsoidSurface(Number.NaN, 0, 0, 3, 2, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'x must be finite. Received: NaN'
    );

    assert.throws(
      () =>
        isOnTriaxialEllipsoidSurface(0, Number.POSITIVE_INFINITY, 0, 3, 2, 1),
      (err) =>
        err instanceof TypeError &&
        err.message === 'y must be finite. Received: Infinity'
    );

    assert.throws(
      () =>
        isOnTriaxialEllipsoidSurface(
          0,
          0,
          0,
          3,
          2,
          1,
          Number.NEGATIVE_INFINITY
        ),
      (err) =>
        err instanceof TypeError &&
        err.message === 'eps must be finite. Received: -Infinity'
    );
  });

  test('throws RangeError when a <= 0', () => {
    assert.throws(
      () => isOnTriaxialEllipsoidSurface(0, 0, 0, 0, 2, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );
  });

  test('throws RangeError when b <= 0', () => {
    assert.throws(
      () => isOnTriaxialEllipsoidSurface(0, 0, 0, 3, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'b must be > 0. Received: 0'
    );
  });

  test('throws RangeError when c <= 0', () => {
    assert.throws(
      () => isOnTriaxialEllipsoidSurface(0, 0, 0, 3, 2, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'c must be > 0. Received: 0'
    );
  });

  test('throws RangeError when eps < 0', () => {
    assert.throws(
      () => isOnTriaxialEllipsoidSurface(0, 0, 0, 3, 2, 1, -1e-12),
      (err) =>
        err instanceof RangeError &&
        err.message === 'eps must be >= 0. Received: -1e-12'
    );
  });
});
