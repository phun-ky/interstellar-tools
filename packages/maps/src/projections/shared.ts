// Shared by the projections; not part of the public API.
import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertPositive } from '../validate.js';

/** Wrap a longitude to (-π, π], the range `atan2` gives. */
export const wrapLongitude = (lambda: number): Radians =>
  (lambda -
    2 * Math.PI * Math.ceil((lambda - Math.PI) / (2 * Math.PI))) as Radians;

/** Throw unless `value` is a finite latitude in [-π/2, π/2]. */
export const assertLatitude = (name: string, value: number) => {
  assertFinite([[name, value]]);

  if (Math.abs(value) > Math.PI / 2)
    throw new RangeError(`${name} must be in [-π/2, π/2]. Received: ${value}`);
};

/** Throw unless the radius and central meridian are usable. */
export const assertSphere = (R: number, lambda0: number) => {
  assertFinite([
    ['R', R],
    ['lambda0', lambda0]
  ]);
  assertPositive([['R', R]]);
};

/**
 * Throw unless `x` is within half a turn of the central meridian, on a
 * parallel `perRadian` metres long per radian of longitude. Allows for
 * rounding at the edge.
 */
export const assertOnMap = (x: number, perRadian: number) => {
  if (Math.abs(x) > Math.PI * perRadian * (1 + 1e-12))
    throw new RangeError(
      `x must be on the map: it is beyond the edge meridians. Received: ${x}`
    );
};
