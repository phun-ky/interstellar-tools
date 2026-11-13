import { GALAXIES } from '@interstellar-tools/constants';
import type { DegreesType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { equatorialToGalactic } from '../equatorial-to-galactic.js';

const sky = (rightAscension: number, declination: number) => ({
  rightAscension: rightAscension as DegreesType,
  declination: declination as DegreesType
});

describe('equatorialToGalactic', () => {
  test('gives the galaxies in GALAXIES their direction, from NED’s positions', () => {
    // NED’s J2000 right ascension and declination, in degrees
    const ned: Record<string, [number, number]> = {
      andromeda: [10.68479292, 41.269065],
      triangulum: [23.46204167, 30.66022222],
      'large-magellanic-cloud': [80.89416667, -69.75611111],
      'small-magellanic-cloud': [13.18666667, -72.82861111],
      'sagittarius-dwarf': [283.83125, -30.545278],
      m87: [187.7059308, 12.39112326],
      'centaurus-a': [201.3650625, -43.01911278]
    };

    for (const { id, direction } of GALAXIES) {
      if (!direction) continue;

      const { l, b } = equatorialToGalactic(sky(...ned[id]!));

      absClose(l, direction.l, 1e-4, `${id}: l ${l}`);
      absClose(b, direction.b, 1e-4, `${id}: b ${b}`);
    }
  });

  test('puts the poles and the centre where the IAU defines them', () => {
    // The north galactic pole
    absClose(equatorialToGalactic(sky(192.85948, 27.12825)).b, 90, 1e-9);

    // The north celestial pole is at l = 90° + 32.93192°
    const pole = equatorialToGalactic(sky(0, 90));

    absClose(pole.l, 122.93192, 1e-7);
    absClose(pole.b, 27.12825, 1e-7);

    // Astropy’s galactic centre (Reid & Brunthaler 2004), 0.3″ from l = b = 0
    const centre = equatorialToGalactic(sky(266.4051, -28.936175));

    absClose(Math.min(centre.l, 360 - centre.l), 0, 1e-4);
    absClose(centre.b, 0, 1e-4);
  });

  test('gives l from 0 up to 360', () => {
    for (let ra = 0; ra < 360; ra += 15)
      for (let dec = -75; dec <= 75; dec += 15) {
        const { l, b } = equatorialToGalactic(sky(ra, dec));

        assert.ok(l >= 0 && l < 360, `l ${l}`);
        assert.ok(b >= -90 && b <= 90, `b ${b}`);
      }
  });

  test('throws RangeError for impossible input', () => {
    assert.throws(() => equatorialToGalactic(sky(Number.NaN, 0)), RangeError);
    assert.throws(
      () => equatorialToGalactic(sky(0, Number.POSITIVE_INFINITY)),
      RangeError
    );
    assert.throws(() => equatorialToGalactic(sky(0, 90.1)), RangeError);
    assert.throws(() => equatorialToGalactic(sky(0, -90.1)), RangeError);
  });
});
