import type { DegreesType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { equatorialToGalactic } from '../equatorial-to-galactic.js';
import { galacticToEquatorial } from '../galactic-to-equatorial.js';

// The difference between two angles in degrees, across 0°/360°
const apart = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const toward = (l: number, b: number) => ({
  l: l as DegreesType,
  b: b as DegreesType
});

describe('galacticToEquatorial', () => {
  test('puts l = b = 0 and the north galactic pole where the IAU defines them', () => {
    const centre = galacticToEquatorial(toward(0, 0));

    absClose(centre.rightAscension, 266.405, 1e-3);
    absClose(centre.declination, -28.936, 1e-3);

    const pole = galacticToEquatorial(toward(0, 90));

    absClose(pole.rightAscension, 192.85948, 1e-7);
    absClose(pole.declination, 27.12825, 1e-7);
  });

  test('is the inverse of equatorialToGalactic', () => {
    for (let l = 0; l < 360; l += 20)
      for (let b = -80; b <= 80; b += 20) {
        const there = galacticToEquatorial(toward(l, b));
        const back = equatorialToGalactic(there);

        assert.ok(
          there.rightAscension >= 0 && there.rightAscension < 360,
          `${there.rightAscension}`
        );
        absClose(apart(back.l, l), 0, 1e-9, `l ${l}, b ${b}: ${back.l}`);
        absClose(back.b, b, 1e-9, `l ${l}, b ${b}: ${back.b}`);
      }
  });

  test('throws RangeError for impossible input', () => {
    assert.throws(
      () => galacticToEquatorial(toward(Number.NaN, 0)),
      RangeError
    );
    assert.throws(
      () => galacticToEquatorial(toward(0, Number.NEGATIVE_INFINITY)),
      RangeError
    );
    assert.throws(() => galacticToEquatorial(toward(0, 91)), RangeError);
    assert.throws(() => galacticToEquatorial(toward(0, -91)), RangeError);
  });
});
