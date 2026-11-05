import type { TemporalInterface } from '../temporal.js';

/**
 * How a planet or moon **spins**: its sidereal rotation period, one turn
 * against the stars.
 *
 * ::: info
 *
 * - **Direction**: like an orbit's, `period` is always a positive duration. A
 *   backwards spin, against its parent's, has `retrograde: true`: Venus,
 *   Uranus and Pluto against the Sun's spin, and Triton, which keeps one face
 *   to Neptune on its backwards orbit.
 * - **Synchronous**: a moon that keeps one face to its planet, like the Moon,
 *   has `synchronous: true`. Its `period` is its orbital period, and its
 *   `retrograde` is its orbit's.
 * - **Not a day**: one turn against the stars is not sunrise to sunrise. The
 *   body moves along its orbit as it turns, so a solar day also depends on
 *   the orbital period: Earth turns in 23 h 56 m, and its day is 24 h.
 *
 * :::
 *
 * @example
 * ```ts
 * const mars: RotationInterface = {
 *   period: { value: 24.623, unit: 'h' }
 * };
 * const moon: RotationInterface = {
 *   period: { value: 27.321661, unit: 'd' },
 *   synchronous: true
 * };
 * const venus: RotationInterface = {
 *   period: { value: 243.0226, unit: 'd' },
 *   retrograde: true
 * };
 * ```
 * @group Celestial Bodies
 */
export interface RotationInterface {
  /** Sidereal rotation period, always positive. See `retrograde` for the direction. */
  period: TemporalInterface;
  /** `true` for a spin against the parent's. Omitted for the usual prograde spin. */
  retrograde?: boolean;
  /** `true` for a moon that keeps one face to its planet. Omitted otherwise. */
  synchronous?: boolean;
}
