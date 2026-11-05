// Shared by the projections; not part of the public API.
import type { Radians } from '@interstellar-tools/types';

import { assertFinite, assertPositive } from '../validate.js';

/** Wrap a longitude to (-π, π], the range `atan2` gives. */
export const wrapLongitude = (lambda: number): Radians => {
  // % is exact, so only the last step rounds, and only as far as ±π
  let wrapped = lambda % (2 * Math.PI);

  if (wrapped > Math.PI) wrapped -= 2 * Math.PI;
  else if (wrapped <= -Math.PI) wrapped += 2 * Math.PI;

  // -π and π are the same meridian
  return (wrapped === -Math.PI ? Math.PI : wrapped) as Radians;
};

/**
 * The longitude east of the central meridian, for placing a point on a map:
 * {@link wrapLongitude}, except that -π stays -π. They're the same meridian,
 * but on a map -π is the left edge and π the right: a line that ends at -π,
 * such as a ground track's segment split at the antimeridian, stays on its
 * side of the map instead of being drawn across it.
 */
export const mapLongitude = (lambda: number): Radians =>
  (lambda === -Math.PI ? lambda : wrapLongitude(lambda)) as Radians;

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

/**
 * The latitude `phi` that a map's `y` gives, clamped to the poles: throw if
 * it is beyond a pole by more than rounding.
 */
export const latitudeOnMap = (phi: number, y: number): Radians => {
  if (Math.abs(phi) > (Math.PI / 2) * (1 + 1e-12))
    throw new RangeError(
      `y must be on the map: it gives a latitude beyond a pole. Received: ${y}`
    );

  return Math.min(Math.PI / 2, Math.max(-Math.PI / 2, phi)) as Radians;
};
