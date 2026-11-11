import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { matAbsClose } from '../../../__tests__/helpers/index.js';
import { det3 } from '../../helpers/det-3.js';
import { matMul3 } from '../../helpers/mat-mul3.js';
import {
  GALACTIC_TO_ICRS,
  ICRS_TO_GALACTIC,
  sunPlacement,
  wrapDegrees
} from '../galactic-frame.js';

describe('the galactic frame', () => {
  test('is the Hipparcos matrix A_G (ESA 1997, Vol. 1, §1.5.3)', () => {
    matAbsClose(
      ICRS_TO_GALACTIC,
      [
        [-0.0548755604, -0.8734370902, -0.4838350155],
        [0.4941094279, -0.44482963, 0.7469822445],
        [-0.867666149, -0.1980763734, 0.4559837762]
      ],
      1e-10
    );
  });

  test('is a rotation, and its transpose the way back', () => {
    matAbsClose(
      matMul3(ICRS_TO_GALACTIC, GALACTIC_TO_ICRS),
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],
      1e-15
    );
    assert.ok(Math.abs(det3(ICRS_TO_GALACTIC) - 1) < 1e-15);
  });

  test('wraps degrees to 0 up to 360', () => {
    assert.equal(wrapDegrees(0), 0);
    assert.equal(wrapDegrees(360), 0);
    assert.equal(wrapDegrees(-90), 270);
    assert.equal(wrapDegrees(725), 5);
    assert.ok(wrapDegrees(-1e-14) < 360);
  });

  test('places the Sun, or throws RangeError', () => {
    const { r0, cos, sin } = sunPlacement({}, 'pc');

    assert.equal(r0, 8275.9);
    assert.ok(Math.abs(Math.asin(sin) - Math.asin(20.8 / 8275.9)) < 1e-15);
    assert.ok(Math.abs(cos ** 2 + sin ** 2 - 1) < 1e-15);
    assert.throws(
      () =>
        sunPlacement({ sunDistance: { value: Number.NaN, unit: 'pc' } }, 'pc'),
      RangeError
    );
    assert.throws(
      () =>
        sunPlacement(
          { sunHeight: { value: Number.POSITIVE_INFINITY, unit: 'pc' } },
          'pc'
        ),
      RangeError
    );
    assert.throws(
      () =>
        sunPlacement(
          {
            sunDistance: { value: 1, unit: 'pc' },
            sunHeight: { value: -1, unit: 'pc' }
          },
          'pc'
        ),
      RangeError
    );
  });
});
