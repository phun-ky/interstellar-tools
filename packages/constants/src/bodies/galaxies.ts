import { GalaxiesType } from '@interstellar-tools/types';

/**
 * Represents a collection of galaxies within the space visualization.
 *
 *
 * ::: info
 *
 * - Units: `diameter` and `distance` in light-years (ly); black hole `radius`, `x`, `y` in astronomical units (au).
 * - Black hole `mass` is in solar masses ($ M_\odot $).
 * - Values are mainly for visualization; not all are observationally exact.
 *
 * :::
 *
 * {@include ../../../../docs/partials/galaxies.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/galaxies.ts#datasetGalaxies}
 * @see {@link GalaxiesType}.
 * @group Datasets
 * @example
 * ```ts
 * console.log(GALAXIES[0].name); // "Milky Way"
 * ```
 */
export const GALAXIES: GalaxiesType = [
  // #region datasetGalaxies
  {
    name: 'Milky Way',
    type: 'Barred Spiral',
    /** Diameter of the galaxy in light-years. */
    diameter: { value: 105700, unit: 'ly' },
    /** Distance from the reference point (Milky Way itself). */
    distance: { value: 0, unit: 'ly' },
    /** Supermassive black hole at the center. */
    blackHole: {
      name: 'Sagittarius A*',
      /** Mass of the black hole in Solar Masses ($ M_\odot $). */
      mass: 4.154e6,
      /** Schwarzschild radius (approximate) in AU. */
      radius: { value: 0.08, unit: 'au' },
      /** Positional reference within the galaxy in AU. */
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' }
    }
  },
  // #endregion datasetGalaxies
  {
    name: 'Andromeda',
    type: 'Barred Spiral',
    diameter: { value: 220000, unit: 'ly' },
    distance: { value: 2537002537000, unit: 'ly' }, // Distance from the Milky Way in light-years
    blackHole: {
      name: 'Andromeda Central Black Hole',
      mass: 1.1e8,
      radius: { value: 5, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 160442417000, unit: 'au' }
    }
  },
  {
    name: 'Triangulum',
    type: 'Spiral',
    diameter: { value: 60000, unit: 'ly' },
    distance: { value: 3000003000000, unit: 'ly' }, // Distance in light-years
    blackHole: {
      name: 'Triangulum Central Black Hole',
      mass: 1.5e6,
      radius: { value: 0.1, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 189723000000, unit: 'au' }
    }
  }
] as const satisfies GalaxiesType;
