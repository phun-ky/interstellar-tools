import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { planetocentricLatitude } from '../planetocentric-latitude';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';

describe('planetocentricLatitude', () => {
  test('returns 0 on the equatorial plane (z=0, x/y not both 0)', () => {
    const phi1 = planetocentricLatitude(1, 0, 0);
    const phi2 = planetocentricLatitude(0, 2, 0);
    const phi3 = planetocentricLatitude(3, 4, 0);

    absClose(phi1, 0, 1e-12);
    absClose(phi2, 0, 1e-12);
    absClose(phi3, 0, 1e-12);
  });

  test('returns +π/2 on +Z axis and -π/2 on -Z axis', () => {
    absClose(planetocentricLatitude(0, 0, 1), Math.PI / 2, 1e-12);
    absClose(planetocentricLatitude(0, 0, 10), Math.PI / 2, 1e-12);

    absClose(planetocentricLatitude(0, 0, -1), -Math.PI / 2, 1e-12);
    absClose(planetocentricLatitude(0, 0, -10), -Math.PI / 2, 1e-12);
  });

  test('matches atan2(z, hypot(x,y)) identity for a generic point', () => {
    const x = 3;
    const y = -4;
    const z = 5;

    const phi = planetocentricLatitude(x, y, z);
    const expected = Math.atan2(z, Math.hypot(x, y));

    relClose(phi, expected);
  });

  test('is invariant under scaling of (x,y,z) by a positive factor', () => {
    const x = 1.2;
    const y = -3.4;
    const z = 5.6;

    const phi = planetocentricLatitude(x, y, z);
    const phiScaled = planetocentricLatitude(10 * x, 10 * y, 10 * z);

    relClose(phiScaled, phi);
  });

  test('returns within [-π/2, +π/2] for finite inputs', () => {
    const samples: Array<[number, number, number]> = [
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 1],
      [1, 1, -1],
      [3, -4, 5],
      [3, -4, -5]
    ];

    for (const [x, y, z] of samples) {
      const phi = planetocentricLatitude(x, y, z);
      assert.ok(phi >= -Math.PI / 2 - 1e-15, `phi < -π/2: ${phi}`);
      assert.ok(phi <= Math.PI / 2 + 1e-15, `phi > +π/2: ${phi}`);
    }
  });

  test('handles origin: atan2(0,0) returns 0 in JS', () => {
    // This documents JS behavior; mathematically latitude at origin is undefined,
    // but this function will return 0 due to atan2(0,0) === 0.
    absClose(planetocentricLatitude(0, 0, 0), 0, 0);
  });

  test('throws TypeError when x is not finite', () => {
    assert.throws(
      () => planetocentricLatitude(Number.NaN, 0, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'x must be finite. Received: NaN'
    );
  });

  test('throws TypeError when y is not finite', () => {
    assert.throws(
      () => planetocentricLatitude(0, Number.POSITIVE_INFINITY, 0),
      (err) =>
        err instanceof TypeError &&
        err.message === 'y must be finite. Received: Infinity'
    );
  });

  test('throws TypeError when z is not finite', () => {
    assert.throws(
      () => planetocentricLatitude(0, 0, Number.NEGATIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'z must be finite. Received: -Infinity'
    );
  });
});
