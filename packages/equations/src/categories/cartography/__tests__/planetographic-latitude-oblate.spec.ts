import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { planetographicLatitudeOblate } from '../planetographic-latitude-oblate';
import { absClose, relClose } from 'packages/equations/src/__tests__/helpers';
import type { Radians } from '@interstellar-tools/types';

describe('planetographicLatitudeOblate', () => {
  test('reduces to planetocentric latitude when a === c (sphere)', () => {
    const a = 10;
    const c = 10;

    const x = 3;
    const y = 4;
    const z = 5;

    const phiG = planetographicLatitudeOblate(x, y, z, a, c);
    const expected = Math.atan2(z, Math.hypot(x, y)) as Radians; // oneMinusE2 = 1

    relClose(phiG, expected);
  });

  test('returns 0 on the equatorial plane (z=0, x/y not both 0)', () => {
    const a = 6378137.0;
    const c = 6356752.314245;

    absClose(planetographicLatitudeOblate(1, 0, 0, a, c), 0, 1e-12);
    absClose(planetographicLatitudeOblate(0, 2, 0, a, c), 0, 1e-12);
    absClose(planetographicLatitudeOblate(3, 4, 0, a, c), 0, 1e-12);
  });

  test('returns +π/2 on +Z axis and -π/2 on -Z axis (for valid ellipsoid)', () => {
    const a = 10;
    const c = 9;

    absClose(planetographicLatitudeOblate(0, 0, 1, a, c), Math.PI / 2, 1e-12);
    absClose(planetographicLatitudeOblate(0, 0, -1, a, c), -Math.PI / 2, 1e-12);
  });

  test('matches the explicit formula atan2(z/(c^2/a^2), hypot(x,y))', () => {
    const a = 10;
    const c = 9;

    const x = 1.2;
    const y = -3.4;
    const z = 5.6;

    const phi = planetographicLatitudeOblate(x, y, z, a, c);

    const oneMinusE2 = (c * c) / (a * a); // c²/a²
    const expected = Math.atan2(z / oneMinusE2, Math.hypot(x, y)) as Radians;

    relClose(phi, expected);
  });

  test('is invariant under scaling of (x,y,z) by a positive factor', () => {
    const a = 10;
    const c = 9;

    const x = 1.2;
    const y = -3.4;
    const z = 5.6;

    const phi1 = planetographicLatitudeOblate(x, y, z, a, c);
    const phi2 = planetographicLatitudeOblate(10 * x, 10 * y, 10 * z, a, c);

    relClose(phi2, phi1);
  });

  test('for an oblate spheroid (a > c), |φg| > |φc| when z ≠ 0 (same Cartesian point)', () => {
    const a = 10;
    const c = 9;

    const x = 3;
    const y = 4;
    const z = 1;

    const phiC = Math.atan2(z, Math.hypot(x, y)); // planetocentric latitude
    const phiG = planetographicLatitudeOblate(x, y, z, a, c);

    assert.ok(
      Math.abs(phiG) > Math.abs(phiC),
      `expected |phiG| > |phiC| for a>c; got phiC=${phiC}, phiG=${phiG}`
    );
  });

  test('returns within [-π/2, +π/2] for finite inputs', () => {
    const a = 10;
    const c = 9;

    const samples: Array<[number, number, number]> = [
      [1, 0, 0],
      [0, 1, 0],
      [1, 1, 1],
      [1, 1, -1],
      [3, -4, 5],
      [3, -4, -5]
    ];

    for (const [x, y, z] of samples) {
      const phi = planetographicLatitudeOblate(x, y, z, a, c);
      assert.ok(phi >= -Math.PI / 2 - 1e-15, `phi < -π/2: ${phi}`);
      assert.ok(phi <= Math.PI / 2 + 1e-15, `phi > +π/2: ${phi}`);
    }
  });

  test('handles origin: atan2(0,0) returns 0 in JS (documents behavior)', () => {
    const a = 10;
    const c = 9;

    absClose(planetographicLatitudeOblate(0, 0, 0, a, c), 0, 0);
  });

  test('throws TypeError when any input is not finite', () => {
    const a = 10;
    const c = 9;

    assert.throws(
      () => planetographicLatitudeOblate(Number.NaN, 0, 0, a, c),
      (err) =>
        err instanceof TypeError &&
        err.message === 'x must be finite. Received: NaN'
    );

    assert.throws(
      () => planetographicLatitudeOblate(0, Number.POSITIVE_INFINITY, 0, a, c),
      (err) =>
        err instanceof TypeError &&
        err.message === 'y must be finite. Received: Infinity'
    );

    assert.throws(
      () => planetographicLatitudeOblate(0, 0, Number.NEGATIVE_INFINITY, a, c),
      (err) =>
        err instanceof TypeError &&
        err.message === 'z must be finite. Received: -Infinity'
    );

    assert.throws(
      () => planetographicLatitudeOblate(0, 0, 0, Number.NaN, c),
      (err) =>
        err instanceof TypeError &&
        err.message === 'a must be finite. Received: NaN'
    );

    assert.throws(
      () => planetographicLatitudeOblate(0, 0, 0, a, Number.POSITIVE_INFINITY),
      (err) =>
        err instanceof TypeError &&
        err.message === 'c must be finite. Received: Infinity'
    );
  });

  test('throws RangeError when a <= 0 or c <= 0', () => {
    assert.throws(
      () => planetographicLatitudeOblate(0, 0, 0, 0, 1),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );

    assert.throws(
      () => planetographicLatitudeOblate(0, 0, 0, 1, 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'c must be > 0. Received: 0'
    );
  });
});
