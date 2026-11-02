import type { Radians } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { centralAngle } from '../central-angle.js';
import { centralAngleFromVectors } from '../central-angle-from-vectors.js';
import { geodeticToBodyFixed } from '../geodetic-to-body-fixed.js';
import { greatCircleDistance } from '../great-circle-distance.js';
import { absClose, relClose } from '../../../__tests__/helpers/index.js';

const rad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

describe('centralAngle', () => {
  test('is 0 for the same point and π for antipodes', () => {
    assert.equal(centralAngle(rad(12), rad(34), rad(12), rad(34)), 0);
    relClose(centralAngle(rad(30), rad(10), rad(-30), rad(-170)), Math.PI);
    relClose(centralAngle(rad(90), rad(0), rad(-90), rad(0)), Math.PI);
  });

  test('is the longitude difference along the equator and the latitude difference along a meridian', () => {
    relClose(centralAngle(rad(0), rad(10), rad(0), rad(60)), rad(50));
    relClose(centralAngle(rad(-20), rad(45), rad(35), rad(45)), rad(55));
  });

  test('ignores longitude at a pole, and wraps across the date line', () => {
    relClose(
      centralAngle(rad(90), rad(0), rad(40), rad(123)),
      centralAngle(rad(90), rad(77), rad(40), rad(123))
    );
    relClose(centralAngle(rad(0), rad(179), rad(0), rad(-179)), rad(2));
  });

  test('stays accurate for points a metre apart', () => {
    const R = 6_371_000;
    const step = 1 / R; // one metre, in radians

    relClose(
      centralAngle(rad(10), rad(20), (rad(10) + step) as Radians, rad(20)) * R,
      1,
      1e-6
    );
  });

  test('agrees with the vector form for points on a sphere', () => {
    for (const [a, b, c, d] of [
      [51.5, -0.13, 40.71, -74.0],
      [-33.9, 151.2, 35.7, 139.7],
      [0.674, 23.47, -3.01, -23.42],
      [89, 0, -89, 180]
    ]) {
      const p = geodeticToBodyFixed(rad(a), rad(b), 0, 1, 0);
      const q = geodeticToBodyFixed(rad(c), rad(d), 0, 1, 0);

      relClose(
        centralAngle(rad(a), rad(b), rad(c), rad(d)),
        centralAngleFromVectors(p, q),
        1e-12
      );
    }
  });

  test('throws for non-finite inputs or a latitude past a pole', () => {
    assert.throws(
      () => centralAngle(rad(0), Number.NaN as Radians, rad(0), rad(0)),
      (err) =>
        err instanceof TypeError &&
        err.message === 'lon1 must be a finite number. Received: NaN'
    );
    assert.throws(
      () => centralAngle(rad(0), rad(0), -2 as Radians, rad(0)),
      (err) =>
        err instanceof RangeError &&
        err.message === 'lat2 must be in [-π/2, π/2]. Received: -2'
    );
  });
});

describe('centralAngleFromVectors', () => {
  test('ignores the vectors’ lengths', () => {
    relClose(centralAngleFromVectors([1, 0, 0], [0, 5, 0]), Math.PI / 2);
    relClose(centralAngleFromVectors([2, 2, 0], [-7, -7, 0]), Math.PI);
  });

  test('stays accurate at tiny angles, where acos would not', () => {
    relClose(centralAngleFromVectors([1, 0, 0], [1, 1e-9, 0]), 1e-9, 1e-9);
    absClose(centralAngleFromVectors([3, 4, 5], [3, 4, 5]), 0);
  });

  test('throws for non-finite components or a zero vector', () => {
    assert.throws(
      () => centralAngleFromVectors([1, Number.NaN, 0], [1, 0, 0]),
      (err) =>
        err instanceof TypeError &&
        err.message === 'r1 must have finite components. Received: NaN'
    );
    assert.throws(
      () => centralAngleFromVectors([1, 0, 0], [0, 0, 0]),
      (err) =>
        err instanceof RangeError &&
        err.message === 'r2 must not be the zero vector.'
    );
  });
});

describe('greatCircleDistance', () => {
  test('puts London about 5 570 km from New York on a 6 371 km Earth', () => {
    const d = greatCircleDistance(
      rad(51.5074),
      rad(-0.1278),
      rad(40.7128),
      rad(-74.006),
      6_371_000
    );

    assert.equal(Math.round(d / 1000), 5570);
  });

  test('is half the circumference for antipodes', () => {
    relClose(
      greatCircleDistance(rad(0), rad(0), rad(0), rad(180), 2),
      2 * Math.PI
    );
  });

  test('throws for a non-finite or non-positive radius, and passes angle checks on', () => {
    assert.throws(
      () => greatCircleDistance(rad(0), rad(0), rad(0), rad(1), Number.NaN),
      (err) =>
        err instanceof TypeError &&
        err.message === 'R must be a finite number. Received: NaN'
    );
    assert.throws(
      () => greatCircleDistance(rad(0), rad(0), rad(0), rad(1), 0),
      (err) =>
        err instanceof RangeError &&
        err.message === 'R must be > 0. Received: 0'
    );
    assert.throws(
      () => greatCircleDistance(3 as Radians, rad(0), rad(0), rad(1), 1),
      RangeError
    );
  });
});
