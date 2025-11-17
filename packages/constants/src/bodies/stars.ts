import { StarsType } from '@interstellar-tools/types';

/**
 * Represents a dataset of well-known stars within the Milky Way.
 *
 * ::: info
 *
 * - Units: `radius` (km); galactocentric coordinates `x`,`y`,`z` (ly); orbital semi-major axis `a` (ly);
 *   `period` in million years (Myr); orbital angles are unitless here (radians) if provided.
 * - `color` is for visualization only.
 * - Negative `period` may encode integration direction; the table shows raw values.
 *
 * :::
 *
 * {@include ../../../../docs/partials/stars.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/stars.ts#datasetStars}
 * @group Datasets
 * @see {@link StarsType}.
 * @example
 * ```ts
 * console.log(STARS[0].name); // "Sun"
 * ```
 */
export const STARS: StarsType = [
  // #region datasetStars
  {
    name: 'Sun',
    type: 'G2V', // Yellow Dwarf, Main Sequence
    category: 'star',
    system: { name: 'Solar System', type: 'planetary system' },
    /** Radius in km */
    radius: { value: 696340, unit: 'km' },
    /** Visual representation color */
    color: '#fff5f1',
    /** Galactic position in light-years (relative to Milky Way center) */
    x: { value: 0, unit: 'ly' },
    y: { value: 27000, unit: 'ly' },
    z: { value: 20, unit: 'ly' },
    /** Semi-major axis in light-years */
    a: { value: 27000, unit: 'ly' },
    /** Orbital eccentricity */
    e: 0.07,
    /** Initial angle in orbit */
    angle: 1.5707963267948966,
    /** Orbital period in million years (Myr) */
    period: { value: -230, unit: 'Myr' }
  },
  // #endregion datasetStars
  {
    name: 'Vega',
    type: 'A0V', // White-Blue Main Sequence
    category: 'star',
    system: { name: 'Lyra', type: 'stellar system' },
    radius: { value: 2600000, unit: 'km' },
    color: 'blue',
    x: { value: 25.3, unit: 'ly' },
    y: { value: 27230.011753394454, unit: 'ly' },
    z: { value: 0, unit: 'ly' },
    e: 0.005,
    a: { value: 27230.011753394454, unit: 'ly' },
    angle: 1.569867205171707,
    period: { value: -480, unit: 'Myr' }
  },
  {
    name: 'Altair',
    type: 'A7V', // White Main Sequence
    category: 'star',
    system: { name: 'Aquila', type: 'stellar system' },
    radius: { value: 1700000, unit: 'km' },
    color: 'white',
    x: { value: 16.7, unit: 'ly' },
    y: { value: 27050.005155082687, unit: 'ly' },
    z: { value: 0, unit: 'ly' },
    e: 0.004,
    a: { value: 27050.005155082687, unit: 'ly' },
    angle: 1.5701789517599378,
    period: { value: -410, unit: 'Myr' }
  },
  {
    name: 'Deneb',
    type: 'A2Ia', // White-Blue Supergiant
    category: 'star',
    system: { name: 'Cygnus', type: 'stellar system' },
    radius: { value: 108000000, unit: 'km' },
    color: 'blue-white',
    x: { value: 2616, unit: 'ly' },
    y: { value: 27375.280016832705, unit: 'ly' },
    z: { value: 0, unit: 'ly' },
    e: 0.009,
    a: { value: 27375.280016832705, unit: 'ly' },
    angle: 1.475524958596149,
    period: { value: -720, unit: 'Myr' }
  },
  {
    name: 'Spica',
    type: 'B1III-IV', // Blue Giant/Subgiant
    category: 'star',
    system: { name: 'Virgo', type: 'stellar system' },
    radius: { value: 73500000, unit: 'km' },
    color: 'blue',
    x: { value: 250, unit: 'ly' },
    y: { value: 27201.148872795795, unit: 'ly' },
    z: { value: 0, unit: 'ly' },
    e: 0.006,
    a: { value: 27201.148872795795, unit: 'ly' },
    angle: 1.5616057972952029,
    period: { value: -550, unit: 'Myr' }
  }
] as const satisfies StarsType;
