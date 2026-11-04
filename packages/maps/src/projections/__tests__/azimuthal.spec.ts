import type { Radians } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import type {
  AzimuthalOptionsInterface,
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from '../coordinates.js';
import {
  inverseLambertAzimuthalEqualArea,
  lambertAzimuthalEqualArea
} from '../lambert-azimuthal-equal-area.js';
import { inverseOrthographic, orthographic } from '../orthographic.js';
import { inverseStereographic, stereographic } from '../stereographic.js';

const close = (a: number, b: number, eps = 1e-12) =>
  assert.ok(Math.abs(a - b) <= eps, `${a} is not within ${eps} of ${b}`);
const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// Angles equal up to whole turns
const sameAngle = (a: number, b: number, eps = 1e-12) =>
  close(Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))), 0, eps);
// Cosine of the angular distance from the centre to the point
const cosDistance = (
  phi: number,
  lambda: number,
  phi0: number,
  lambda0: number
) =>
  Math.sin(phi0) * Math.sin(phi) +
  Math.cos(phi0) * Math.cos(phi) * Math.cos(lambda - lambda0);
const centre = fc.double({ min: -Math.PI / 2, max: Math.PI / 2, noNaN: true });
const latitude = fc.double({
  min: -Math.PI / 2 + 1e-3,
  max: Math.PI / 2 - 1e-3,
  noNaN: true
});
const longitude = fc.double({ min: -10, max: 10, noNaN: true });
const radius = fc.double({ min: 1, max: 1e8, noNaN: true });

type Projection = (
  phi: Radians,
  lambda: Radians,
  R: number,
  options?: AzimuthalOptionsInterface
) => ProjectedPointInterface;
type Inverse = (
  x: number,
  y: number,
  R: number,
  options?: AzimuthalOptionsInterface
) => GeographicCoordinatesInterface;

// Each projection, with how far from the centre the round trip is tested
for (const [name, project, inverse, minCosC] of [
  [
    'lambertAzimuthalEqualArea',
    lambertAzimuthalEqualArea,
    inverseLambertAzimuthalEqualArea,
    -0.9
  ],
  ['stereographic', stereographic, inverseStereographic, -0.9],
  ['orthographic', orthographic, inverseOrthographic, 0.1]
] as [string, Projection, Inverse, number][])
  describe(`${name} (shared)`, () => {
    test('maps the centre to the origin, and back', () => {
      fc.assert(
        fc.property(centre, longitude, radius, (phi0, lambda0, R) => {
          const options = {
            phi0: phi0 as Radians,
            lambda0: lambda0 as Radians
          };
          const { x, y } = project(
            phi0 as Radians,
            lambda0 as Radians,
            R,
            options
          );

          close(x / R, 0);
          close(y / R, 0);

          const back = inverse(0, 0, R, options);

          close(back.phi, phi0);
          sameAngle(back.lambda, lambda0);
        })
      );
    });

    test('round-trips through its inverse', () => {
      fc.assert(
        fc.property(
          latitude,
          longitude,
          centre,
          longitude,
          radius,
          (phi, lambda, phi0, lambda0, R) => {
            fc.pre(cosDistance(phi, lambda, phi0, lambda0) >= minCosC);

            const options = {
              phi0: phi0 as Radians,
              lambda0: lambda0 as Radians
            };
            const { x, y } = project(
              phi as Radians,
              lambda as Radians,
              R,
              options
            );
            const back = inverse(x, y, R, options);

            close(back.phi, phi, 1e-9);
            sameAngle(back.lambda, lambda, 1e-9);
            assert.ok(back.lambda > -Math.PI && back.lambda <= Math.PI);
          }
        )
      );
    });

    test('keeps true directions from the centre', () => {
      // Due north, east, south and west of a centre on the equator
      for (const [phi, lambda, dx, dy] of [
        [20, 30, 0, 1],
        [0, 50, 1, 0],
        [-20, 30, 0, -1],
        [0, 10, -1, 0]
      ]) {
        const { x, y } = project(rad(phi), rad(lambda), 2, {
          lambda0: rad(30)
        });
        const rho = Math.hypot(x, y);

        close(x / rho, dx);
        close(y / rho, dy);
      }
    });

    test('throws on bad inputs', () => {
      assert.throws(() => project(2 as Radians, 0 as Radians, 1), RangeError);
      assert.throws(
        () => project(0 as Radians, 0 as Radians, 1, { phi0: -2 as Radians }),
        RangeError
      );
      assert.throws(() => project(0 as Radians, 0 as Radians, 0), RangeError);
      assert.throws(
        () => project(0 as Radians, Infinity as Radians, 1),
        TypeError
      );
      assert.throws(
        () => project(0 as Radians, 0 as Radians, 1, { phi0: NaN as Radians }),
        TypeError
      );
      assert.throws(() => inverse(NaN, 0, 1), TypeError);
      assert.throws(() => inverse(0, 0, -1), RangeError);
      assert.throws(
        () => inverse(0, 0, 1, { lambda0: Infinity as Radians }),
        TypeError
      );
      assert.throws(() => inverse(0, 0, 1, { phi0: 2 as Radians }), RangeError);
    });
  });

describe('lambertAzimuthalEqualArea', () => {
  test('is equal-area: a small cell keeps its area on the sphere', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1.5, max: 1.5, noNaN: true }),
        fc.double({ min: -3, max: 3, noNaN: true }),
        centre,
        (phi, lambda, phi0) => {
          fc.pre(cosDistance(phi, lambda, phi0, 0) > -0.5);

          const h = 1e-6;
          const at = (p: number, l: number) =>
            lambertAzimuthalEqualArea(p as Radians, l as Radians, 1, {
              phi0: phi0 as Radians
            });
          const east = [at(phi, lambda + h), at(phi, lambda - h)] as const;
          const north = [at(phi + h, lambda), at(phi - h, lambda)] as const;
          const xl = (east[0].x - east[1].x) / (2 * h);
          const yl = (east[0].y - east[1].y) / (2 * h);
          const xp = (north[0].x - north[1].x) / (2 * h);
          const yp = (north[0].y - north[1].y) / (2 * h);

          // dA on the map over dλ dφ, against R² cos φ on the sphere
          close(Math.abs(xl * yp - xp * yl), Math.cos(phi), 1e-6);
        }
      )
    );
  });

  test('fits the whole sphere in a circle of radius 2R', () => {
    const limb = lambertAzimuthalEqualArea(0 as Radians, rad(90), 1);
    const nearAntipode = lambertAzimuthalEqualArea(rad(0.001), rad(180), 1);

    close(limb.x, Math.SQRT2);
    // 2R sin(c/2), with c 0.001° short of 180°
    close(
      Math.hypot(nearAntipode.x, nearAntipode.y),
      2 * Math.cos(rad(0.0005))
    );

    // The edge circle is the antipode
    const antipode = inverseLambertAzimuthalEqualArea(0, -2, 1, {
      phi0: rad(30)
    });

    close(antipode.phi, rad(-30));
    sameAngle(antipode.lambda, Math.PI);
  });

  test('throws at the antipode and beyond the edge circle', () => {
    assert.throws(
      () => lambertAzimuthalEqualArea(0 as Radians, Math.PI as Radians, 1),
      RangeError
    );
    // Within rounding of the antipode
    assert.throws(
      () =>
        lambertAzimuthalEqualArea(rad(-30), rad(190), 1, {
          phi0: rad(30),
          lambda0: rad(10)
        }),
      RangeError
    );
    assert.throws(
      () => inverseLambertAzimuthalEqualArea(0, 2.001, 1),
      RangeError
    );
  });

  test("matches Snyder's numerical example", () => {
    const options = { phi0: rad(40), lambda0: rad(-100) };
    const { x, y } = lambertAzimuthalEqualArea(rad(-20), rad(100), 3, options);

    close(x, -4.2339303, 1e-7);
    close(y, 4.0257775, 1e-7);

    const back = inverseLambertAzimuthalEqualArea(x, y, 3, options);

    close(back.phi, rad(-20));
    close(back.lambda, rad(100));
  });

  test('matches the docs example on the Moon', () => {
    const options = { lambda0: rad(180) };
    const { x, y } = lambertAzimuthalEqualArea(
      0 as Radians,
      rad(90),
      1_737_400,
      options
    );

    close(x, -2_457_054.643, 1e-3);
    close(y, 0, 1e-6);

    const back = inverseLambertAzimuthalEqualArea(
      -2_457_055,
      0,
      1_737_400,
      options
    );

    close(back.phi, 0);
    close(back.lambda, rad(90), 1e-6);
  });
});

describe('stereographic', () => {
  test('is conformal: the same scale k = 2/(1 + cos c) in every direction', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1.5, max: 1.5, noNaN: true }),
        fc.double({ min: -3, max: 3, noNaN: true }),
        centre,
        (phi, lambda, phi0) => {
          const cosC = cosDistance(phi, lambda, phi0, 0);

          fc.pre(cosC > -0.5);

          const h = 1e-6;
          const at = (p: number, l: number) =>
            stereographic(p as Radians, l as Radians, 1, {
              phi0: phi0 as Radians
            });
          const east = [at(phi, lambda + h), at(phi, lambda - h)] as const;
          const north = [at(phi + h, lambda), at(phi - h, lambda)] as const;
          // Map distance per unit of distance on the sphere, east and north
          const ex = (east[0].x - east[1].x) / (2 * h * Math.cos(phi));
          const ey = (east[0].y - east[1].y) / (2 * h * Math.cos(phi));
          const nx = (north[0].x - north[1].x) / (2 * h);
          const ny = (north[0].y - north[1].y) / (2 * h);
          const k = 2 / (1 + cosC);

          close(Math.hypot(ex, ey), k, 1e-6);
          close(Math.hypot(nx, ny), k, 1e-6);
          close(ex * nx + ey * ny, 0, 1e-6);
        }
      )
    );
  });

  test('puts a point 2R tan(c/2) from the centre', () => {
    // On a polar map, c is the distance from the pole
    const { x, y } = stereographic(rad(60), rad(123), 5, { phi0: rad(90) });

    close(Math.hypot(x, y), 10 * Math.tan(rad(15)));
  });

  test('throws at the antipode, and inverts any point on the plane', () => {
    assert.throws(
      () => stereographic(rad(-90), 0 as Radians, 1, { phi0: rad(90) }),
      RangeError
    );

    const far = inverseStereographic(1e200, 0, 1, { phi0: rad(90) });

    close(far.phi, rad(-90));
  });

  test("matches Snyder's numerical example", () => {
    const options = { phi0: rad(40), lambda0: rad(-100) };
    const { x, y } = stereographic(rad(30), rad(-75), 1, options);

    close(x, 0.3807224, 1e-7);
    close(y, -0.1263802, 1e-7);

    const back = inverseStereographic(x, y, 1, options);

    close(back.phi, rad(30));
    close(back.lambda, rad(-75));
  });

  test('matches the docs example on Mars', () => {
    const options = { phi0: rad(-90) };
    const { x, y } = stereographic(rad(-80), rad(45), 3_389_500, options);

    close(x, 419_374.885, 1e-3);
    close(y, 419_374.885, 1e-3);
    close(Math.hypot(x, y), 593_085.65, 1e-3);

    const back = inverseStereographic(419_375, 419_375, 3_389_500, options);

    close(back.phi, rad(-80), 1e-6);
    close(back.lambda, rad(45), 1e-6);
  });
});

describe('orthographic', () => {
  test('is the view from far away: the point at depth R cos c, R from the centre of the globe', () => {
    fc.assert(
      fc.property(
        latitude,
        longitude,
        centre,
        longitude,
        radius,
        (phi, lambda, phi0, lambda0, R) => {
          const cosC = cosDistance(phi, lambda, phi0, lambda0);

          fc.pre(cosC >= 0);

          const { x, y } = orthographic(phi as Radians, lambda as Radians, R, {
            phi0: phi0 as Radians,
            lambda0: lambda0 as Radians
          });

          close(Math.hypot(x / R, y / R, cosC), 1);
        }
      )
    );
  });

  test('shows the horizon, but not the far side', () => {
    const horizon = orthographic(0 as Radians, rad(90), 2);

    close(horizon.x, 2);
    close(horizon.y, 0);

    const edge = inverseOrthographic(0, 2, 2, { phi0: rad(-30) });

    close(edge.phi, rad(60));
    sameAngle(edge.lambda, 0);

    assert.throws(() => orthographic(0 as Radians, rad(100), 1), RangeError);
    assert.throws(
      () => orthographic(rad(-10), 0 as Radians, 1, { phi0: rad(85) }),
      RangeError
    );
    assert.throws(() => inverseOrthographic(1.001, 0, 1), RangeError);
  });

  test("matches Snyder's numerical example", () => {
    const options = { phi0: rad(40), lambda0: rad(-100) };
    const { x, y } = orthographic(rad(30), rad(-110), 1, options);

    close(x, -0.1503837, 1e-7);
    close(y, -0.1651911, 1e-7);

    const back = inverseOrthographic(x, y, 1, options);

    close(back.phi, rad(30));
    close(back.lambda, rad(-110));
  });

  test('matches the docs example on Mars', () => {
    const { x, y } = orthographic(rad(30), rad(60), 3_389_500);

    close(x, 2_542_125, 1e-6);
    close(y, 1_694_750, 1e-6);

    const back = inverseOrthographic(2_542_125, 1_694_750, 3_389_500);

    close(back.phi, rad(30));
    close(back.lambda, rad(60));
  });
});
