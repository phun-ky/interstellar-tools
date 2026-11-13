import {
  GALAXIES,
  SUN_GALACTOCENTRIC_DISTANCE
} from '@interstellar-tools/constants';
import type {
  DegreesType,
  DistanceInterface,
  GalacticDirectionInterface,
  PositionInterface
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { galactocentricPosition } from '../galactocentric-position.js';

const toward = (l: number, b: number): GalacticDirectionInterface => ({
  l: l as DegreesType,
  b: b as DegreesType
});
const kpc = (value: number): DistanceInterface => ({ value, unit: 'kpc' });
const values = ({ x, y, z }: PositionInterface): [number, number, number] => [
  x.value,
  y.value,
  z.value
];
const assertPosition = (
  actual: PositionInterface,
  expected: [number, number, number],
  eps: number,
  name: string
) =>
  values(actual).forEach((value, k) =>
    absClose(value, expected[k]!, eps, `${name}[${k}]: ${value}`)
  );

describe('galactocentricPosition', () => {
  // Astropy 8.0.2, Galactocentric(galcen_distance=8.2759 kpc, z_sun=20.8 pc,
  // roll=0), from NED's right ascension and declination
  const astropy: {
    name: string;
    direction: GalacticDirectionInterface;
    distance: number;
    position: [number, number, number];
  }[] = [
    {
      name: 'Andromeda',
      direction: toward(121.1744, -21.573),
      distance: 761,
      position: [-375.3101, 605.4987, -278.8665]
    },
    {
      name: 'Large Magellanic Cloud',
      direction: toward(280.4652, -32.8884),
      distance: 49.59,
      position: [-0.7797, -40.9495, -26.9258]
    },
    {
      name: 'M87',
      direction: toward(283.7777, 74.4912),
      distance: 16_800,
      position: [1102.2032, -4362.8766, 16185.5744]
    }
  ];

  test('matches Astropy to a few parts in a million of the distance', () => {
    for (const { name, direction, distance, position } of astropy) {
      const actual = galactocentricPosition(direction, kpc(distance));

      assert.equal(actual.frame, 'galactocentric', name);
      assert.ok(
        [actual.x, actual.y, actual.z].every(({ unit }) => unit === 'kpc'),
        name
      );
      assertPosition(actual, position, 5e-6 * distance, name);
    }
  });

  test('puts the Sun z☉ above the plane, √(R0² − z☉²) from the centre’s axis', () => {
    const sun = galactocentricPosition(toward(0, 0), kpc(0));

    assertPosition(sun, [-8.275873861412, 0, 0.0208], 1e-9, 'Sun');
  });

  test('keeps the distance from the Sun', () => {
    const sun = values(galactocentricPosition(toward(0, 0), kpc(0)));

    for (const { name, direction, distance } of astropy) {
      const position = values(galactocentricPosition(direction, kpc(distance)));

      absClose(
        Math.hypot(...position.map((value, k) => value - sun[k]!)),
        distance,
        1e-9 * distance,
        name
      );
    }
  });

  test('puts Sagittarius A* 10.5 pc from the centre, which is the IAU’s', () => {
    // Sagittarius A*: l 359.9443°, b −0.0462° (Reid & Brunthaler 2004)
    const position = values(
      galactocentricPosition(
        toward(359.9443, -0.0462),
        SUN_GALACTOCENTRIC_DISTANCE
      )
    );

    absClose(Math.hypot(...position), 10.5, 0.1, `${position}`);
  });

  test('places the dataset’s galaxies, in their own unit or another', () => {
    const andromeda = GALAXIES.find(({ id }) => id === 'andromeda')!;
    const inLy = galactocentricPosition(
      andromeda.direction!,
      andromeda.distance
    );
    const inKpc = galactocentricPosition(
      andromeda.direction!,
      andromeda.distance,
      { unit: 'kiloparsecs' }
    );

    assert.equal(inLy.x.unit, 'ly');
    assert.equal(inKpc.x.unit, 'kpc');
    assertPosition(inKpc, [-375.3101, 605.4987, -278.8665], 5e-3, 'Andromeda');
    values(inLy).forEach((value, k) =>
      absClose(value / 3261.563777, values(inKpc)[k]!, 1e-6)
    );

    for (const { name, direction, distance } of GALAXIES) {
      if (!direction) continue;

      const position = galactocentricPosition(direction, distance);

      assert.ok(values(position).every(Number.isFinite), name);
    }
  });

  test('takes the Sun’s place as options, such as Astropy’s defaults', () => {
    // Astropy’s defaults: 8.122 kpc (GRAVITY 2018) and 20.8 pc
    const sun = galactocentricPosition(toward(0, 0), kpc(0), {
      sunDistance: kpc(8.122),
      sunHeight: { value: 20.8, unit: 'pc' }
    });

    assertPosition(
      sun,
      [-Math.sqrt(8.122 ** 2 - 0.0208 ** 2), 0, 0.0208],
      1e-12,
      'Sun'
    );
  });

  test('throws RangeError for impossible input', () => {
    const north = toward(0, 0);

    assert.throws(
      () => galactocentricPosition(toward(Number.NaN, 0), kpc(1)),
      RangeError
    );
    assert.throws(
      () => galactocentricPosition(north, kpc(Number.POSITIVE_INFINITY)),
      RangeError
    );
    assert.throws(
      () => galactocentricPosition(toward(0, 90.5), kpc(1)),
      RangeError
    );
    assert.throws(
      () => galactocentricPosition(toward(0, -90.5), kpc(1)),
      RangeError
    );
    assert.throws(() => galactocentricPosition(north, kpc(-1)), RangeError);
    assert.throws(
      () =>
        galactocentricPosition(north, kpc(1), {
          sunDistance: kpc(1),
          sunHeight: kpc(1)
        }),
      RangeError
    );
  });
});
