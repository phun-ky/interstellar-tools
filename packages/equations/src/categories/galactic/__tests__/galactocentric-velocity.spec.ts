import { GALAXIES } from '@interstellar-tools/constants';
import type { DegreesType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { galactocentricPosition } from '../galactocentric-position.js';
import { galactocentricVelocity } from '../galactocentric-velocity.js';

const galaxy = (id: string) => GALAXIES.find((entry) => entry.id === id)!;
const here = { l: 0 as DegreesType, b: 0 as DegreesType };
const still = { value: 0, unit: 'kpc' as const };

describe('galactocentricVelocity', () => {
  test('matches Astropy, with the same Sun', () => {
    // Astropy 8.0.2 Galactocentric(galcen_distance=8.2759 kpc, z_sun=20.8 pc,
    // galcen_v_sun=(12.9, 251.51, 8.56) km/s), from NED's right ascension and
    // declination and the dataset's distances and motions, in km/s
    const astropy: Record<string, [number, number, number]> = {
      andromeda: [37.108, -119.807, -10.863],
      triangulum: [42.22, 88.382, 127.747],
      'large-magellanic-cloud': [-72.426, -216.114, 212.921],
      'small-magellanic-cloud': [3.992, -177.445, 164.453],
      'sagittarius-dwarf': [237.702, -17.834, 208.65]
    };

    for (const [id, expected] of Object.entries(astropy)) {
      const { direction, distance, motion } = galaxy(id);
      const v = galactocentricVelocity(direction!, distance, motion!);

      assert.equal(v.frame, 'galactocentric');
      [v.x, v.y, v.z].forEach((value, k) =>
        absClose(value, expected[k]!, 0.002, `${id}[${k}]: ${value}`)
      );
    }
  });

  test('brings Andromeda towards the centre at 109 km/s (van der Marel et al. 2012: 109.3 ± 4.4)', () => {
    const { direction, distance, motion } = galaxy('andromeda');
    const r = galactocentricPosition(direction!, distance);
    const v = galactocentricVelocity(direction!, distance, motion!);
    const radial =
      (r.x.value * v.x + r.y.value * v.y + r.z.value * v.z) /
      Math.hypot(r.x.value, r.y.value, r.z.value);

    absClose(radial, -109.07, 0.01);
  });

  test('gives the Sun its own velocity, and something still at the centre none', () => {
    const sun = galactocentricVelocity(here, still, { radialVelocity: 0 });

    assert.deepEqual(sun, {
      frame: 'galactocentric',
      x: 12.9,
      y: 251.51,
      z: 8.56
    });

    // Sagittarius A* (l 359.9443°, b −0.0462°) at R0, with the Sun's reflex:
    // radial −12.9 km/s and μ (−3.156, −5.585) mas/yr (Reid & Brunthaler 2020)
    const centre = galactocentricVelocity(
      { l: 359.9443 as DegreesType, b: -0.0462 as DegreesType },
      { value: 8275.9, unit: 'pc' },
      {
        radialVelocity: -12.9,
        properMotion: { rightAscension: -3.156, declination: -5.585 }
      }
    );

    [centre.x, centre.y, centre.z].forEach((value) =>
      absClose(value, 0, 0.6, `${value}`)
    );
  });

  test('takes the proper motion as 0 where it isn’t measured', () => {
    const m87 = galaxy('m87');
    const v = galactocentricVelocity(m87.direction!, m87.distance, {
      radialVelocity: 1284
    });

    absClose(Math.hypot(v.x - 12.9, v.y - 251.51, v.z - 8.56), 1284, 1e-9);
  });

  test('takes the Sun’s place and velocity as options', () => {
    const v = galactocentricVelocity(
      here,
      still,
      { radialVelocity: 0 },
      {
        sunDistance: { value: 8.122, unit: 'kpc' },
        sunHeight: { value: 20.8, unit: 'pc' },
        sunVelocity: { frame: 'galactocentric', x: 12.9, y: 245.6, z: 7.78 }
      }
    );

    assert.deepEqual([v.x, v.y, v.z], [12.9, 245.6, 7.78]);
  });

  test('throws RangeError for impossible input', () => {
    const { direction, distance } = galaxy('andromeda');

    assert.throws(
      () =>
        galactocentricVelocity(direction!, distance, {
          radialVelocity: Number.NaN
        }),
      RangeError
    );
    assert.throws(
      () =>
        galactocentricVelocity(direction!, distance, {
          radialVelocity: 0,
          properMotion: {
            rightAscension: Number.POSITIVE_INFINITY,
            declination: 0
          }
        }),
      RangeError
    );
    assert.throws(
      () =>
        galactocentricVelocity(
          direction!,
          distance,
          { radialVelocity: 0 },
          {
            sunVelocity: { frame: 'galactocentric', x: 0, y: Number.NaN, z: 0 }
          }
        ),
      RangeError
    );
    assert.throws(
      () =>
        galactocentricVelocity(
          direction!,
          { value: -1, unit: 'kpc' },
          {
            radialVelocity: 0
          }
        ),
      RangeError
    );
    assert.throws(
      () =>
        galactocentricVelocity(
          { l: 0 as DegreesType, b: 91 as DegreesType },
          distance,
          {
            radialVelocity: 0
          }
        ),
      RangeError
    );
  });
});
