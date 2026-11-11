import type {
  DegreesType,
  IauPeriodicTermInterface
} from '@interstellar-tools/types';

// Shared by the datasets. Not exported from the package.

/**
 * A periodic term of an IAU rotation model: its amplitude in degrees, and the
 * angle it's the sine or cosine of, $\theta = \theta_0 + \dot\theta T +
 * \ddot\theta T^2$, from its phase in degrees, its rate in degrees a Julian
 * century and, for Mars's moons' $M_5$, its acceleration in degrees a century
 * squared.
 */
export const iauTerm = (
  amplitude: number,
  phase: number,
  rate: number,
  acceleration?: number
): IauPeriodicTermInterface =>
  acceleration === undefined
    ? { amplitude, phase: phase as DegreesType, rate }
    : { amplitude, phase: phase as DegreesType, rate, acceleration };
