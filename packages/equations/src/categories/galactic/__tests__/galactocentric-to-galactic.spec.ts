import { GALAXIES } from '@interstellar-tools/constants';
import type { DegreesType, PositionInterface } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { galactocentricPosition } from '../galactocentric-position.js';
import { galactocentricToGalactic } from '../galactocentric-to-galactic.js';

// The difference between two angles in degrees, across 0°/360°
const apart = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const toward = (l: number, b: number) => ({
  l: l as DegreesType,
  b: b as DegreesType
});
const at = (x: number, y: number, z: number): PositionInterface => ({
  frame: 'galactocentric',
  x: { value: x, unit: 'pc' },
  y: { value: y, unit: 'pc' },
  z: { value: z, unit: 'pc' }
});

describe('galactocentricToGalactic', () => {
  test('gives back the galaxies’ direction and distance', () => {
    for (const { id, direction, distance } of GALAXIES) {
      if (!direction) continue;

      const back = galactocentricToGalactic(
        galactocentricPosition(direction, distance)
      );

      assert.equal(back.distance.unit, distance.unit, id);
      absClose(back.distance.value, distance.value, 1e-9 * distance.value, id);
      absClose(apart(back.direction.l, direction.l), 0, 1e-9, `${id}: l`);
      absClose(back.direction.b, direction.b, 1e-9, `${id}: b`);
    }
  });

  test('is the inverse of galactocentricPosition, all around the sky', () => {
    for (let l = 0; l < 360; l += 30)
      for (let b = -60; b <= 60; b += 30) {
        const back = galactocentricToGalactic(
          galactocentricPosition(toward(l, b), { value: 5, unit: 'kpc' })
        );

        absClose(apart(back.direction.l, l), 0, 1e-9, `l ${l}, b ${b}`);
        absClose(back.direction.b, b, 1e-9, `l ${l}, b ${b}`);
        absClose(back.distance.value, 5, 1e-12, `l ${l}, b ${b}`);
      }
  });

  test('puts the origin R0 away, towards l = b = 0, and the Sun at distance 0', () => {
    const origin = galactocentricToGalactic(at(0, 0, 0));

    assert.deepEqual(origin, {
      direction: { l: 0, b: 0 },
      distance: { value: 8275.9, unit: 'pc' }
    });

    const sun = galactocentricToGalactic(
      galactocentricPosition(toward(0, 0), { value: 0, unit: 'pc' })
    );

    absClose(sun.distance.value, 0, 1e-9);
  });

  test('takes coordinates in mixed units, and gives the distance in any', () => {
    const position: PositionInterface = {
      frame: 'galactocentric',
      x: { value: -8.275873861412, unit: 'kpc' },
      y: { value: 1000, unit: 'pc' },
      z: { value: 20.8, unit: 'pc' }
    };
    const inKpc = galactocentricToGalactic(position);
    const inLy = galactocentricToGalactic(position, { unit: 'lightyears' });

    assert.equal(inKpc.distance.unit, 'kpc');
    assert.equal(inLy.distance.unit, 'ly');
    absClose(inKpc.distance.value, 1, 1e-9);
    absClose(inKpc.direction.l, 90, 1e-6);
    absClose(inLy.distance.value / 1000, 3.261563777, 1e-8);
  });

  test('takes the Sun’s place as options', () => {
    const options = {
      sunDistance: { value: 8.122, unit: 'kpc' as const },
      sunHeight: { value: 20.8, unit: 'pc' as const }
    };
    const back = galactocentricToGalactic(
      galactocentricPosition(
        toward(45, 10),
        { value: 3, unit: 'kpc' },
        options
      ),
      options
    );

    absClose(back.direction.l, 45, 1e-9);
    absClose(back.direction.b, 10, 1e-9);
    absClose(back.distance.value, 3, 1e-12);
  });

  test('throws RangeError for impossible input', () => {
    assert.throws(
      () =>
        galactocentricToGalactic({
          ...at(0, 0, 0),
          frame: 'heliocentric' as 'galactocentric'
        }),
      RangeError
    );
    assert.throws(
      () => galactocentricToGalactic(at(Number.NaN, 0, 0)),
      RangeError
    );
    assert.throws(
      () =>
        galactocentricToGalactic(at(0, 0, 0), {
          sunDistance: { value: 10, unit: 'pc' },
          sunHeight: { value: 10, unit: 'pc' }
        }),
      RangeError
    );
  });
});
