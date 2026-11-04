import type { Radians } from '@interstellar-tools/types';

import { assertFinite } from '../validate.js';

import type {
  AzimuthalOptionsInterface,
  GeographicCoordinatesInterface,
  ProjectedPointInterface
} from './coordinates.js';
import { assertLatitude, assertSphere, wrapLongitude } from './shared.js';

/**
 * Whether 1 + cos c puts a point within rounding of the centre's antipode,
 * about 1e-15 rad away.
 */
export const atAntipode = (onePlusCosC: number) => onePlusCosC < 1e-30;

/**
 * Project a point on an azimuthal map centred on (φ0, λ0): `scale` turns
 * 1 + cos c, with c the point's angular distance from the centre, into the
 * projection's k′, or NaN if the point can't be shown, for the reason `hidden`.
 */
export const azimuthal = (
  phi: Radians,
  lambda: Radians,
  R: number,
  { lambda0 = 0 as Radians, phi0 = 0 as Radians }: AzimuthalOptionsInterface,
  scale: (onePlusCosC: number) => number,
  hidden: string
): ProjectedPointInterface => {
  assertLatitude('phi', phi);
  assertFinite([['lambda', lambda]]);
  assertSphere(R, lambda0);
  assertLatitude('phi0', phi0);

  const dLambda = lambda - lambda0;
  // 1 + cos c in haversine form, which keeps its digits near the antipode
  const onePlusCosC =
    2 *
    (Math.sin((phi + phi0) / 2) ** 2 +
      Math.cos(phi) * Math.cos(phi0) * Math.cos(dLambda / 2) ** 2);
  const k = R * scale(onePlusCosC);

  if (Number.isNaN(k))
    throw new RangeError(
      `phi and lambda must be a point the map can show: ${hidden}. Received: ${phi}, ${lambda}`
    );

  return {
    x: k * Math.cos(phi) * Math.sin(dLambda),
    y:
      k *
      (Math.cos(phi0) * Math.sin(phi) -
        Math.sin(phi0) * Math.cos(phi) * Math.cos(dLambda))
  };
};

/**
 * Find the point on the sphere for a point on an azimuthal map: `distance`
 * turns ρ/R, the distance from the centre on a unit sphere's map, into cos c
 * and sin c / (ρ/R), or undefined if the point is beyond the map's `edge`.
 */
export const inverseAzimuthal = (
  x: number,
  y: number,
  R: number,
  { lambda0 = 0 as Radians, phi0 = 0 as Radians }: AzimuthalOptionsInterface,
  distance: (rho: number) => { cosC: number; sinCPerRho: number } | undefined,
  edge = ''
): GeographicCoordinatesInterface => {
  assertFinite([
    ['x', x],
    ['y', y]
  ]);
  assertSphere(R, lambda0);
  assertLatitude('phi0', phi0);

  const onMap = distance(Math.hypot(x, y) / R);

  if (!onMap)
    throw new RangeError(
      `x and y must be on the map: ${edge}. Received: ${x}, ${y}`
    );

  const { cosC, sinCPerRho } = onMap;
  // The point east, north and up from the centre, rotated back to the
  // sphere's axes: atan2 keeps the digits that arcsin loses near the poles
  const east = (x / R) * sinCPerRho;
  const north = (y / R) * sinCPerRho;
  const sinPhi = cosC * Math.sin(phi0) + north * Math.cos(phi0);
  const cosPhiCosDLambda = cosC * Math.cos(phi0) - north * Math.sin(phi0);

  return {
    phi: Math.atan2(sinPhi, Math.hypot(east, cosPhiCosDLambda)) as Radians,
    lambda: wrapLongitude(lambda0 + Math.atan2(east, cosPhiCosDLambda))
  };
};
