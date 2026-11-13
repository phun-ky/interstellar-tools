import { GALAXIES } from '@interstellar-tools/constants';
import type { DegreesType } from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose, matAbsClose } from '../../../__tests__/helpers/index.js';
import { GALACTIC_TO_SUPERGALACTIC } from '../galactic-frame.js';
import { galacticToSupergalactic } from '../galactic-to-supergalactic.js';
import { supergalacticToGalactic } from '../supergalactic-to-galactic.js';

const toward = (l: number, b: number) => ({
  l: l as DegreesType,
  b: b as DegreesType
});
// The difference between two angles in degrees, across 0°/360°
const apart = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);

describe('galacticToSupergalactic', () => {
  test('is Astropy’s rotation', () => {
    matAbsClose(
      GALACTIC_TO_SUPERGALACTIC,
      [
        [-0.735742574804, 0.677261296414, 0],
        [-0.074553778365, -0.080991471307, 0.9939225904],
        [0.673145302109, 0.731271165817, 0.110081262225]
      ],
      1e-12
    );
  });

  test('gives the galaxies Astropy’s supergalactic coordinates', () => {
    // Astropy 8.0.2, from NED's right ascension and declination
    const astropy: Record<string, [number, number]> = {
      andromeda: [336.1933, 12.5521],
      triangulum: [328.4675, -0.0898],
      'large-magellanic-cloud': [215.7951, -34.122],
      'small-magellanic-cloud': [224.2315, -14.825],
      'sagittarius-dwarf': [206.5423, 43.7457],
      m87: [102.8806, -2.3479],
      'centaurus-a': [159.7533, -5.2499]
    };

    for (const { id, direction } of GALAXIES) {
      if (!direction) continue;

      const { sgl, sgb } = galacticToSupergalactic(direction);

      absClose(apart(sgl, astropy[id]![0]), 0, 2e-4, `${id}: sgl ${sgl}`);
      absClose(sgb, astropy[id]![1], 2e-4, `${id}: sgb ${sgb}`);
    }
  });

  test('puts the pole and the origin where they’re defined', () => {
    absClose(galacticToSupergalactic(toward(47.37, 6.32)).sgb, 90, 1e-9);

    const origin = galacticToSupergalactic(toward(137.37, 0));

    absClose(origin.sgl, 0, 1e-9);
    absClose(origin.sgb, 0, 1e-9);
  });

  test('throws RangeError for impossible input', () => {
    assert.throws(
      () => galacticToSupergalactic(toward(Number.NaN, 0)),
      RangeError
    );
    assert.throws(
      () => galacticToSupergalactic(toward(0, Number.POSITIVE_INFINITY)),
      RangeError
    );
    assert.throws(() => galacticToSupergalactic(toward(0, 91)), RangeError);
    assert.throws(() => galacticToSupergalactic(toward(0, -91)), RangeError);
  });
});

describe('supergalacticToGalactic', () => {
  const sky = (sgl: number, sgb: number) => ({
    sgl: sgl as DegreesType,
    sgb: sgb as DegreesType
  });

  test('is the inverse of galacticToSupergalactic', () => {
    for (let l = 0; l < 360; l += 20)
      for (let b = -80; b <= 80; b += 20) {
        const back = supergalacticToGalactic(
          galacticToSupergalactic(toward(l, b))
        );

        absClose(apart(back.l, l), 0, 1e-9, `l ${l}, b ${b}: ${back.l}`);
        absClose(back.b, b, 1e-9, `l ${l}, b ${b}: ${back.b}`);
      }

    const pole = supergalacticToGalactic(sky(0, 90));

    absClose(pole.l, 47.37, 1e-9);
    absClose(pole.b, 6.32, 1e-9);
  });

  test('throws RangeError for impossible input', () => {
    assert.throws(
      () => supergalacticToGalactic(sky(Number.NaN, 0)),
      RangeError
    );
    assert.throws(
      () => supergalacticToGalactic(sky(0, Number.NEGATIVE_INFINITY)),
      RangeError
    );
    assert.throws(() => supergalacticToGalactic(sky(0, 91)), RangeError);
    assert.throws(() => supergalacticToGalactic(sky(0, -91)), RangeError);
  });
});
