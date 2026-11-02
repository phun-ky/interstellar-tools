import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { geodeticToBodyFixed } from '../geodetic-to-body-fixed.js';
import { absClose, relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
const A = 6_378_137; // m, WGS84
const E2 = 0.00669437999014;
const B = A * Math.sqrt(1 - E2);

describe('geodeticToBodyFixed', () => {
  test('puts the equator at the prime meridian on the x axis', () => {
    const [x, y, z] = geodeticToBodyFixed(rad(0), rad(0), 100, A, E2);

    relClose(x, A + 100);
    absClose(y, 0);
    absClose(z, 0);
  });

  test('puts 90° E on the y axis', () => {
    const [x, y] = geodeticToBodyFixed(rad(0), rad(90), 0, A, E2);

    absClose(x, 0, 1e-6);
    relClose(y, A);
  });

  test('puts the poles at the polar radius, plus the height', () => {
    const [x, y, z] = geodeticToBodyFixed(rad(90), rad(0), 0, A, E2);

    absClose(Math.hypot(x, y), 0, 1e-6);
    relClose(z, B);
    relClose(geodeticToBodyFixed(rad(-90), rad(0), 500, A, E2)[2], -(B + 500));
  });

  test('is a sphere of radius a + h when e² = 0', () => {
    const p = geodeticToBodyFixed(rad(37), rad(-122), 250, A, 0);

    relClose(Math.hypot(...p), A + 250);
  });

  test('moves the point along the ellipsoid normal for h, also below it', () => {
    const phi = rad(45);
    const surface = geodeticToBodyFixed(phi, rad(10), 0, A, E2);
    const below = geodeticToBodyFixed(phi, rad(10), -1000, A, E2);
    const d = surface.map((c, i) => c - below[i]);

    relClose(Math.hypot(...d), 1000, 1e-9);

    // The normal's direction is the geodetic latitude
    relClose(Math.atan2(d[2], Math.hypot(d[0], d[1])), phi, 1e-9);
  });

  test('gives the surface geocentric latitude tan ψ = (1 − e²) tan φ', () => {
    const phi = rad(28.608422);
    const [x, y, z] = geodeticToBodyFixed(phi, rad(-80.604133), 0, A, E2);

    relClose(
      Math.tan(Math.atan2(z, Math.hypot(x, y))),
      (1 - E2) * Math.tan(phi),
      1e-12
    );
  });

  test('puts Pad 39A 6 373 266 m from the centre at 28.447° N geocentric', () => {
    const [x, y, z] = geodeticToBodyFixed(
      rad(28.608422),
      rad(-80.604133),
      0,
      A,
      E2
    );

    assert.equal(Math.round(Math.hypot(x, y, z)), 6_373_266);
    assert.equal(
      ((Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI).toFixed(3),
      '28.447'
    );
  });

  test('throws TypeError when any input is not finite', () => {
    for (const [i, name] of [
      [0, 'phi'],
      [1, 'lambda'],
      [2, 'h'],
      [3, 'a'],
      [4, 'eSquared']
    ] as const) {
      const args = [0, 0, 0, A, E2];

      args[i] = Number.NaN;
      assert.throws(
        () =>
          geodeticToBodyFixed(
            args[0] as Radians,
            args[1] as Radians,
            args[2],
            args[3],
            args[4]
          ),
        (err) =>
          err instanceof TypeError &&
          err.message === `${name} must be a finite number. Received: NaN`
      );
    }
  });

  test('throws RangeError for a latitude past a pole, a <= 0 or e² outside [0, 1)', () => {
    assert.throws(
      () => geodeticToBodyFixed(2 as Radians, rad(0), 0, A, E2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'phi must be in [-π/2, π/2]. Received: 2'
    );
    assert.throws(
      () => geodeticToBodyFixed(rad(0), rad(0), 0, 0, E2),
      (err) =>
        err instanceof RangeError &&
        err.message === 'a must be > 0. Received: 0'
    );

    for (const e2 of [-0.1, 1]) {
      assert.throws(
        () => geodeticToBodyFixed(rad(0), rad(0), 0, A, e2),
        (err) =>
          err instanceof RangeError &&
          err.message === `eSquared must be in [0, 1). Received: ${e2}`
      );
    }
  });
});
