import { WGS84 } from '@interstellar-tools/constants';

// The WGS 84 ellipsoid in the form the geodesy functions take
export const A = WGS84.equatorialRadius.value;

const F = 1 / WGS84.inverseFlattening;

export const E_SQUARED = F * (2 - F);
