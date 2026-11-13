import type { StarObservationsInterface } from './body-observations.js';
import type { DisplayInterface } from './display.js';

/**
 * Observations and drawing groups **apart from the bodies**, keyed by body
 * id, as `@interstellar-tools/constants` exports them: `STAR_PARAMETERS`,
 * `PLANET_RINGS` and the like.
 *
 * Kept apart, an app loads only the groups it imports: a bundler leaves the
 * rest out.
 *
 * @example
 * ```ts
 * const luminosities: ByBodyIdType<number> = { sun: 1, vega: 40.12 };
 *
 * luminosities.vega; // 40.12
 * ```
 * @group Observations
 */
export type ByBodyIdType<T> = Readonly<Record<string, T>>;

/**
 * What a star's **light** tells about it: its spectral class, temperature,
 * luminosity, surface gravity and metallicity. A part of
 * {@link StarObservationsInterface}.
 *
 * @example
 * ```ts
 * const sun: StarParametersType = {
 *   spectralClassification: { raw: 'G2V', spectralClass: 'G', subclass: 2 },
 *   effectiveTemperature: { value: 5772, unit: 'K' },
 *   luminosity: { value: 1, unit: 'L_sun' }
 * };
 * ```
 * @group Observations
 */
export type StarParametersType = Pick<
  StarObservationsInterface,
  | 'spectralClassification'
  | 'effectiveTemperature'
  | 'luminosity'
  | 'logSurfaceGravity'
  | 'metallicity'
  | 'gravityDarkening'
>;

/**
 * Where a star **is on the sky** and which catalogues list it: its
 * identifiers, position, motion and apparent magnitudes, and its letter within
 * its system. A part of {@link StarObservationsInterface}.
 *
 * @example
 * ```ts
 * const proxima: StarAstrometryType = {
 *   identifiers: { hip: 70890, gaiaDr3: '5853498713190525696' },
 *   component: 'C'
 * };
 * ```
 * @group Observations
 */
export type StarAstrometryType = Pick<
  StarObservationsInterface,
  'identifiers' | 'astrometry' | 'apparentMagnitudes' | 'component'
>;

/**
 * How to **draw a planet's rings**, and why the values are what they are. A
 * part of {@link DisplayInterface}.
 *
 * @example
 * ```ts
 * const saturn: RingDisplayType = {
 *   rings: { color: '#cabcba', opacity: 0.93, shadows: true }
 * };
 * ```
 * @group Celestial Bodies
 */
export type RingDisplayType = Pick<DisplayInterface, 'rings' | 'derivation'>;
