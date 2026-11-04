import type { Radians, Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { geodeticToBodyFixed } from '../geodetic-to-body-fixed.js';
import { heightAboveEllipsoid } from '../height-above-ellipsoid.js';
import { heightAboveSphere } from '../height-above-sphere.js';
import { absClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;
// WGS84
const a = 6_378_137;
const eSquared = 0.00669437999014;
const latitude = fc.double({
  min: -Math.PI / 2,
  max: Math.PI / 2,
  noNaN: true
});
const longitude = fc.double({ min: -Math.PI, max: Math.PI, noNaN: true });

describe('heightAboveSphere', () => {
  test('is 0 on the surface, whatever the direction', () => {
    fc.assert(
      fc.property(latitude, longitude, (phi, lambda) => {
        const R = 1_737_400;
        const r: Vector3DTupleType = [
          R * Math.cos(phi) * Math.cos(lambda),
          R * Math.cos(phi) * Math.sin(lambda),
          R * Math.sin(phi)
        ];

        absClose(heightAboveSphere(r, R), 0, 1e-8);
      })
    );
  });

  test('is the distance from the centre less the radius', () => {
    assert.equal(heightAboveSphere([0, 0, 2_137_400], 1_737_400), 400_000);
    assert.equal(heightAboveSphere([3, 4, 0], 10), -5);
  });

  test('matches the docs example', () => {
    const lat = rad(32.502);
    const r = 6_563_041;

    absClose(
      heightAboveSphere([r * Math.cos(lat), 0, r * Math.sin(lat)], a),
      184_904,
      1e-6
    );
  });

  test('throws on bad inputs', () => {
    assert.throws(() => heightAboveSphere([NaN, 0, 0], 1), TypeError);
    assert.throws(() => heightAboveSphere([0, 0, 1], Infinity), TypeError);
    assert.throws(() => heightAboveSphere([0, 0, 1], 0), RangeError);
  });
});

describe('heightAboveEllipsoid', () => {
  test('gives back the height a point was placed at', () => {
    fc.assert(
      fc.property(
        latitude,
        longitude,
        fc.double({ min: -10_000, max: 1e8, noNaN: true }),
        (phi, lambda, h) => {
          const [x, y, z] = geodeticToBodyFixed(
            phi as Radians,
            lambda as Radians,
            h,
            a,
            eSquared
          );

          // A few nanometres per 1 000 km of distance from the centre
          absClose(
            heightAboveEllipsoid(x, y, z, a, eSquared),
            h,
            1e-9 * Math.max(1, Math.hypot(x, y, z) / 1e3)
          );
        }
      )
    );
  });

  test('differs from a sphere of the equatorial radius by 21.4 km at the poles', () => {
    const b = a * Math.sqrt(1 - eSquared);

    for (const z of [b, -b]) {
      absClose(heightAboveEllipsoid(0, 0, z, a, eSquared), 0, 1e-6);
      absClose(heightAboveSphere([0, 0, z], a), -21_384.686, 1e-3);
    }

    // At the equator they agree
    absClose(heightAboveEllipsoid(a + 500, 0, 0, a, eSquared), 500, 1e-6);
    absClose(heightAboveSphere([a + 500, 0, 0], a), 500, 1e-6);
  });

  test('agrees with heightAboveSphere on a sphere', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.double({ min: -1e7, max: 1e7, noNaN: true }),
          fc.double({ min: -1e7, max: 1e7, noNaN: true }),
          fc.double({ min: -1e7, max: 1e7, noNaN: true })
        ),
        (r) => {
          fc.pre(Math.hypot(...r) > 1);

          absClose(
            heightAboveEllipsoid(r[0], r[1], r[2], 3_389_500, 0),
            heightAboveSphere(r, 3_389_500),
            1e-8
          );
        }
      )
    );
  });

  test('matches the docs example', () => {
    const lat = rad(32.502);
    const r = 6_563_041;

    absClose(
      heightAboveEllipsoid(
        r * Math.cos(lat),
        0,
        r * Math.sin(lat),
        a,
        eSquared
      ),
      191_100,
      1
    );
  });

  test('throws on bad inputs', () => {
    assert.throws(() => heightAboveEllipsoid(0, 0, 0, a, eSquared), RangeError);
    assert.throws(
      () => heightAboveEllipsoid(1, 0, 0, -a, eSquared),
      RangeError
    );
    assert.throws(() => heightAboveEllipsoid(1, 0, 0, a, 1), RangeError);
    assert.throws(
      () => heightAboveEllipsoid(NaN, 0, 0, a, eSquared),
      TypeError
    );
  });
});
