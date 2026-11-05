import { AU_METERS } from '@interstellar-tools/constants';
import type { Vector3DTupleType } from '@interstellar-tools/types';
import fc from 'fast-check';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { sunPosition } from '../../cartography/sun-position.js';
import { solarRadiationPressureAcceleration } from '../solar-radiation-pressure-acceleration.js';

// Sunlight's pressure at 1 au: the IAU's 1361 W/m² over the speed of light
const P = 1361 / 299_792_458;
const throwsWith = (
  fn: () => unknown,
  type: typeof TypeError | typeof RangeError,
  message: string
) =>
  assert.throws(fn, (err) => {
    assert.ok(err instanceof type);
    assert.equal(err.message, message);

    return true;
  });

describe('solarRadiationPressureAcceleration', () => {
  test('pushes a sail square on at 1 au by P C_R A/m, away from the Sun', () => {
    const [ax, ay, az] = solarRadiationPressureAcceleration(
      [AU_METERS, 0, 0],
      [0, 0, 0],
      2,
      32
    );

    assert.ok(Math.abs(ax - P * 2 * 32) < 1e-18);
    assert.equal(ax.toExponential(1), '2.9e-4');
    assert.equal((ax * 86_400).toFixed(0), '25');
    assert.equal(Math.abs(ay) + Math.abs(az), 0);
  });

  test('pushes a 1U CubeSat by 3.4e-8 m/s²', () => {
    const sun = sunPosition(new Date('2026-03-20T12:00:00Z')).r;
    const a = solarRadiationPressureAcceleration(
      [6_778_137, 0, 0],
      sun,
      1,
      0.01 / 1.33
    );
    const away = a.map((x, k) => x * ([6_778_137, 0, 0][k]! - sun[k]!));

    assert.equal(Math.hypot(...a).toExponential(1), '3.4e-8');
    assert.ok(away.reduce((sum, x) => sum + x, 0) > 0);
  });

  test('falls with the square of the distance, and scales with C_R, A/m and the light', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.3, max: 40, noNaN: true }),
        fc.double({ min: 0, max: 2, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (au, Cr, areaToMass, illumination) => {
          const [ax] = solarRadiationPressureAcceleration(
            [au * AU_METERS, 0, 0],
            [0, 0, 0],
            Cr,
            areaToMass,
            illumination
          );

          assert.ok(
            Math.abs(ax - (illumination * P * Cr * areaToMass) / au ** 2) <=
              1e-12 * Math.max(ax, 1e-30)
          );
        }
      )
    );
  });

  test('is zero in shadow', () => {
    assert.deepEqual(
      solarRadiationPressureAcceleration(
        [7e6, 0, 0],
        [AU_METERS, 0, 0],
        1.5,
        0.02,
        0
      ).map(Math.abs),
      [0, 0, 0]
    );
  });

  test('rejects invalid input', () => {
    const sun: Vector3DTupleType = [AU_METERS, 0, 0];

    throwsWith(
      () => solarRadiationPressureAcceleration([1, Number.NaN, 0], sun, 1, 1),
      TypeError,
      'r must be three finite numbers. Received: 1,NaN,0'
    );
    throwsWith(
      () =>
        solarRadiationPressureAcceleration(
          [1, 0, 0],
          [1, 0] as unknown as Vector3DTupleType,
          1,
          1
        ),
      TypeError,
      'rSun must be three finite numbers. Received: 1,0'
    );
    throwsWith(
      () => solarRadiationPressureAcceleration([1, 0, 0], sun, Number.NaN, 1),
      TypeError,
      'Cr must be a finite number. Received: NaN'
    );
    throwsWith(
      () =>
        solarRadiationPressureAcceleration(
          [1, 0, 0],
          sun,
          1,
          1,
          Number.POSITIVE_INFINITY
        ),
      TypeError,
      'illumination must be a finite number. Received: Infinity'
    );
    throwsWith(
      () => solarRadiationPressureAcceleration([1, 0, 0], sun, -1, 1),
      RangeError,
      'Cr must be >= 0. Received: -1'
    );
    throwsWith(
      () => solarRadiationPressureAcceleration([1, 0, 0], sun, 1, -1),
      RangeError,
      'areaToMass must be >= 0. Received: -1'
    );
    throwsWith(
      () => solarRadiationPressureAcceleration([1, 0, 0], sun, 1, 1, 1.5),
      RangeError,
      'illumination must be in [0, 1]. Received: 1.5'
    );
    throwsWith(
      () => solarRadiationPressureAcceleration(sun, sun, 1, 1),
      RangeError,
      'rSun must not be at r.'
    );
  });
});
