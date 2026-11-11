import { GALAXIES } from '@interstellar-tools/constants';
import type {
  DegreesType,
  GalaxyDiskInterface
} from '@interstellar-tools/types';
import assert from 'node:assert/strict';
import test, { describe } from 'node:test';

import { absClose } from '../../../__tests__/helpers/index.js';
import { galactocentricPosition } from '../galactocentric-position.js';
import { galaxyDiskAxis } from '../galaxy-disk-axis.js';

const galaxy = (id: string) => GALAXIES.find((entry) => entry.id === id)!;
const deg = (value: number) => value as DegreesType;

describe('galaxyDiskAxis', () => {
  test('matches the spin axes worked out from Astropy’s frame', () => {
    // From the same inclinations and angles, in Astropy's Galactocentric axes.
    // The Large Magellanic Cloud's from Luri et al.'s 34.08° and 309.92°,
    // which the dataset rounds
    const expected: Record<string, [[number, number, number], number]> = {
      andromeda: [[-0.4186, -0.75438, -0.50565], 1e-4],
      'large-magellanic-cloud': [[-0.32763, -0.91918, -0.21855], 1e-3]
    };

    for (const [id, [axis, eps]] of Object.entries(expected)) {
      const { direction, disk } = galaxy(id);
      const actual = galaxyDiskAxis(direction!, disk!);

      absClose(Math.hypot(...actual), 1, 1e-12, id);
      actual.forEach((value, k) =>
        absClose(value, axis[k]!, eps, `${id}[${k}]: ${value}`)
      );
    }
  });

  test('turns Andromeda counter-clockwise and the Large Magellanic Cloud clockwise, seen from the Sun', () => {
    // van der Marel et al. 2019, and van der Marel & Kallivayalil 2014
    const sun = galactocentricPosition(
      { l: deg(0), b: deg(0) },
      { value: 0, unit: 'kpc' }
    );
    const towardsUs = (id: string) => {
      const { direction, distance, disk } = galaxy(id);
      const at = galactocentricPosition(direction!, distance, { unit: 'kpc' });
      const axis = galaxyDiskAxis(direction!, disk!);
      const away = [
        at.x.value - sun.x.value,
        at.y.value - sun.y.value,
        at.z.value - sun.z.value
      ];

      return axis.reduce((sum, value, k) => sum - value * away[k]!, 0) > 0;
    };

    assert.equal(towardsUs('andromeda'), true);
    assert.equal(towardsUs('large-magellanic-cloud'), false);
  });

  test('points a face-on disk straight at us, or away', () => {
    const direction = { l: deg(30), b: deg(20) };
    // Receding to the north, with the east side near, its north edge moves
    // west: clockwise on the sky, so it spins away from us
    const away = galaxyDiskAxis(direction, {
      inclination: deg(0),
      positionAngle: deg(0),
      nearSide: deg(90)
    });
    const towards = galaxyDiskAxis(direction, {
      inclination: deg(0),
      positionAngle: deg(0),
      nearSide: deg(270)
    });
    const at = galactocentricPosition(direction, { value: 1, unit: 'pc' });
    const sun = galactocentricPosition(direction, { value: 0, unit: 'pc' });
    const line = [
      at.x.value - sun.x.value,
      at.y.value - sun.y.value,
      at.z.value - sun.z.value
    ];

    towards.forEach((value, k) => absClose(value, -line[k]!, 1e-9));
    away.forEach((value, k) => absClose(value, line[k]!, 1e-9));
  });

  test('throws RangeError without a near side, or with impossible angles', () => {
    const direction = galaxy('triangulum').direction!;
    const disk = (overrides: Partial<GalaxyDiskInterface>) => ({
      inclination: deg(45),
      positionAngle: deg(10),
      nearSide: deg(100),
      ...overrides
    });

    assert.throws(
      () => galaxyDiskAxis(direction, galaxy('triangulum').disk!),
      RangeError
    );
    assert.throws(
      () => galaxyDiskAxis(direction, disk({ inclination: deg(Number.NaN) })),
      RangeError
    );
    assert.throws(
      () => galaxyDiskAxis(direction, disk({ inclination: deg(91) })),
      RangeError
    );
    assert.throws(
      () => galaxyDiskAxis(direction, disk({ inclination: deg(-1) })),
      RangeError
    );
    assert.throws(
      () => galaxyDiskAxis(direction, disk({ nearSide: deg(50) })),
      RangeError
    );
  });
});
