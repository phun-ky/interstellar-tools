import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { equirectangular, inverseEquirectangular } from '../equirectangular.js';
import { inverseMercator, mercator } from '../mercator.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// Angles equal up to whole turns
const sameAngle = (a: number, b: number, eps = 1e-12) =>
  close(Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))), 0, eps);
const WEB_R = 6_378_137;
const latitude = fc.double({
  min: -Math.PI / 2 + 1e-6,
  max: Math.PI / 2 - 1e-6,
  noNaN: true
}) as fc.Arbitrary<Radians>;
const longitude = fc.double({
  min: -10,
  max: 10,
  noNaN: true
}) as fc.Arbitrary<Radians>;
const radius = fc.double({ min: 1, max: 1e8, noNaN: true });

describe('mercator', () => {
  test('round-trips through inverseMercator', () => {
    fc.assert(
      fc.property(
        latitude,
        longitude,
        longitude,
        radius,
        (phi, lambda, lambda0, R) => {
          const { x, y } = mercator(phi, lambda, R, { lambda0 });
          const back = inverseMercator(x, y, R, { lambda0 });

          close(back.phi, phi, 1e-9);
          sameAngle(back.lambda, lambda, 1e-9);
          assert.ok(back.lambda > -Math.PI && back.lambda <= Math.PI);
        }
      )
    );
  });

  test('maps the equator to y = 0 and the central meridian to x = 0', () => {
    assert.deepEqual(
      mercator(0 as Radians, rad(30), 10, { lambda0: rad(30) }),
      {
        x: 0,
        y: 0
      }
    );
  });

  test('has the same scale, sec φ, in both directions', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1.4, max: 1.4, noNaN: true }),
        fc.double({ min: -3, max: 3, noNaN: true }),
        (phi, lambda) => {
          const h = 1e-6;
          const R = 1000;
          const north =
            (mercator((phi + h) as Radians, lambda as Radians, R).y -
              mercator((phi - h) as Radians, lambda as Radians, R).y) /
            (2 * h * R);
          const east =
            (mercator(phi as Radians, (lambda + h) as Radians, R).x -
              mercator(phi as Radians, (lambda - h) as Radians, R).x) /
            (2 * h * R * Math.cos(phi));

          close(north, 1 / Math.cos(phi), 1e-6);
          close(east, 1 / Math.cos(phi), 1e-6);
        }
      )
    );
  });

  test('reaches the corner of a square web map at 85.0511°, 180°', () => {
    const corner = mercator(rad(85.0511287798066), rad(180), WEB_R);

    close(corner.x, 20_037_508.342789244, 1e-6);
    close(corner.y, 20_037_508.342789244, 1e-3);
    close(
      inverseMercator(0, Math.PI * WEB_R, WEB_R).phi,
      rad(85.0511287798066),
      1e-13
    );
  });

  test('wraps longitudes to (−π, π] around the central meridian', () => {
    for (const lambda of [Math.PI, -Math.PI, 3 * Math.PI])
      close(mercator(0 as Radians, lambda as Radians, 1).x, Math.PI);

    close(
      mercator(0 as Radians, rad(-170), 1, { lambda0: rad(170) }).x,
      rad(20)
    );
    close(inverseMercator(Math.PI * 1.5, 0, 1).lambda, -Math.PI / 2);
  });

  test('throws at the poles and on bad inputs', () => {
    for (const phi of [Math.PI / 2, -Math.PI / 2, 2])
      assert.throws(
        () => mercator(phi as Radians, 0 as Radians, 1),
        RangeError
      );

    assert.throws(() => mercator(0 as Radians, 0 as Radians, 0), RangeError);
    assert.throws(() => inverseMercator(0, 0, -1), RangeError);
    assert.throws(() => mercator(NaN as Radians, 0 as Radians, 1), TypeError);
    assert.throws(
      () =>
        mercator(0 as Radians, 0 as Radians, 1, {
          lambda0: Infinity as Radians
        }),
      TypeError
    );
    assert.throws(() => inverseMercator(0, Infinity, 1), TypeError);
  });
});

describe('equirectangular', () => {
  test('round-trips through inverseEquirectangular', () => {
    fc.assert(
      fc.property(
        fc.double({
          min: -Math.PI / 2,
          max: Math.PI / 2,
          noNaN: true
        }) as fc.Arbitrary<Radians>,
        longitude,
        longitude,
        latitude,
        latitude,
        radius,
        (phi, lambda, lambda0, phi0, phi1, R) => {
          const options = { lambda0, phi0, phi1 };
          const { x, y } = equirectangular(phi, lambda, R, options);
          const back = inverseEquirectangular(x, y, R, options);

          close(back.phi, phi, 1e-9);
          sameAngle(back.lambda, lambda, 1e-6);
          assert.ok(back.lambda > -Math.PI && back.lambda <= Math.PI);
        }
      )
    );
  });

  test('spaces latitude and longitude evenly', () => {
    // 10° N, 20° E on Mars, true to scale at 45°
    const R = 3_389_500;
    const { x, y } = equirectangular(rad(10), rad(20), R, { phi1: rad(45) });

    close(x, R * rad(20) * Math.SQRT1_2, 1e-6);
    close(y, R * rad(10), 1e-6);
    close(x, 836_619.54, 0.01);

    const back = inverseEquirectangular(836_620, 591_579, R, { phi1: rad(45) });

    close(back.phi, rad(10), 1e-6);
    close(back.lambda, rad(20), 1e-6);
  });

  test('is twice as wide as tall on the equator, the plate carrée', () => {
    const corner = equirectangular(rad(90), rad(180), 1);

    close(corner.x, Math.PI);
    close(corner.y, Math.PI / 2);
  });

  test('puts the origin at (λ0, φ0)', () => {
    const origin = equirectangular(rad(-45), rad(100), 2, {
      lambda0: rad(100),
      phi0: rad(-45),
      phi1: rad(30)
    });

    close(origin.x, 0);
    close(origin.y, 0);
  });

  test('is true to scale along meridians and the standard parallel', () => {
    const R = 1000;
    const options = { phi1: rad(40) };
    // Linear in both, so a wide step is exact
    const h = 1;
    const north =
      (equirectangular(rad(40 + h), rad(5), R, options).y -
        equirectangular(rad(40 - h), rad(5), R, options).y) /
      (2 * R * rad(h));
    const east =
      (equirectangular(rad(40), rad(5 + h), R, options).x -
        equirectangular(rad(40), rad(5 - h), R, options).x) /
      (2 * R * rad(h) * Math.cos(rad(40)));

    close(north, 1, 1e-9);
    close(east, 1, 1e-9);
  });

  test('throws beyond the poles and on bad inputs', () => {
    assert.throws(
      () => equirectangular(2 as Radians, 0 as Radians, 1),
      RangeError
    );
    assert.throws(
      () =>
        equirectangular(0 as Radians, 0 as Radians, 1, {
          phi1: (Math.PI / 2) as Radians
        }),
      RangeError
    );
    assert.throws(
      () =>
        equirectangular(0 as Radians, 0 as Radians, 1, { phi0: -2 as Radians }),
      RangeError
    );
    assert.throws(() => inverseEquirectangular(0, 1.6, 1), RangeError);
    assert.throws(
      () => inverseEquirectangular(0, -0.1, 1, { phi0: rad(-90) }),
      RangeError
    );
    close(
      inverseEquirectangular(0, 0.1, 1, { phi0: rad(-90) }).phi,
      0.1 - Math.PI / 2
    );
    assert.throws(() => inverseEquirectangular(0, 0, 0), RangeError);
    assert.throws(() => inverseEquirectangular(NaN, 0, 1), TypeError);
  });
});
