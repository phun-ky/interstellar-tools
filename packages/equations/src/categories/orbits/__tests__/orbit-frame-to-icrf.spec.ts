import type {
  DegreesType,
  OrbitFrameInterface,
  Vector3DTupleType
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { applyMatrix3 } from '../../helpers/apply-matrix-3.js';
import { det3 } from '../../helpers/det-3.js';
import { matMul3 } from '../../helpers/mat-mul3.js';
import { transpose3 } from '../../helpers/transpose-3.js';
import { orbitFrameToIcrf } from '../orbit-frame-to-icrf.js';

const DEG = Math.PI / 180;
const deg = (value: number) => value as DegreesType;
// A unit vector toward a right ascension and declination, in degrees
const toward = (ra: number, dec: number): Vector3DTupleType => [
  Math.cos(dec * DEG) * Math.cos(ra * DEG),
  Math.cos(dec * DEG) * Math.sin(ra * DEG),
  Math.sin(dec * DEG)
];
const assertVector = (
  actual: Vector3DTupleType,
  expected: Vector3DTupleType,
  eps = 1e-12
) => actual.forEach((value, k) => absClose(value, expected[k]!, eps));

describe('orbitFrameToIcrf', () => {
  test('tilts the ecliptic by 23.4393° about the equinox', () => {
    const M = orbitFrameToIcrf({ plane: 'ecliptic' });

    assertVector(applyMatrix3(M, [1, 0, 0]), [1, 0, 0]);
    // The ecliptic's north pole, at RA 270° and Dec 90° − ε
    assertVector(
      applyMatrix3(M, [0, 0, 1]),
      toward(270, 90 - 84_381.448 / 3600)
    );
  });

  test('leaves the ICRF equator as it is', () => {
    const M = orbitFrameToIcrf({ plane: 'equator' });

    assertVector(applyMatrix3(M, [0.3, -0.4, 0.5]), [0.3, -0.4, 0.5]);
  });

  test("points a Laplace plane's z to its pole and x to its node on the equator", () => {
    for (const plane of ['laplace', 'parent-equator'] as const) {
      const frame: OrbitFrameInterface = {
        plane,
        pole: { rightAscension: deg(40.6), declination: deg(83.5) }
      };
      const M = orbitFrameToIcrf(frame);

      assertVector(applyMatrix3(M, [0, 0, 1]), toward(40.6, 83.5));
      assertVector(applyMatrix3(M, [1, 0, 0]), toward(40.6 + 90, 0));
    }
  });

  test('is a rotation: orthonormal, with a determinant of 1', () => {
    for (const frame of [
      { plane: 'ecliptic' },
      { plane: 'equator' },
      {
        plane: 'laplace',
        pole: { rightAscension: deg(317.7), declination: deg(52.9) }
      },
      {
        plane: 'parent-equator',
        pole: { rightAscension: deg(132.993), declination: deg(-6.163) }
      }
    ] satisfies OrbitFrameInterface[]) {
      const M = orbitFrameToIcrf(frame);
      const I = matMul3(M, transpose3(M));

      I.forEach((row, r) =>
        row.forEach((value, c) => absClose(value, r === c ? 1 : 0, 1e-12))
      );
      absClose(det3(M), 1, 1e-12);
    }
  });

  test('needs the pole of a Laplace plane or a parent equator', () => {
    assert.throws(
      () => orbitFrameToIcrf({ plane: 'laplace' }),
      /A 'laplace' frame needs its pole/
    );
    assert.throws(
      () => orbitFrameToIcrf({ plane: 'parent-equator' }),
      RangeError
    );
  });

  test("can't place the sky or the galaxy's disk yet", () => {
    for (const plane of ['sky', 'galactic'] as const)
      assert.throws(
        () => orbitFrameToIcrf({ plane }),
        new RegExp(`A '${plane}' frame can't be placed in the ICRF yet`)
      );
  });
});
