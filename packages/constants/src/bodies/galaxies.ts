import { GalaxiesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of galaxies within the space visualization.
 *
 *
 * ::: info
 *
 * - Units: `diameter` and `distance` in light-years (ly); black hole `radius`, `x`, `y` in astronomical units (au).
 * - `distance` is from the Sun: Cepheids for Andromeda (Li et al. 2021) and Triangulum (Breuval et al. 2023).
 * - `diameter` is the D25 isophotal diameter, where the disk fades to 25 B-magnitudes per square arcsecond:
 *   from RC3 (de Vaucouleurs et al. 1991) and the distance for Andromeda and Triangulum, and an estimate from a
 *   model of its disk for the Milky Way (Goodwin, Gribbin & Hendry 1998). The stars reach further out.
 * - Black hole `mass` is in solar masses ($ M_\odot $), and `radius` is its Schwarzschild radius, $2GM/c^2$.
 *   Each black hole sits at its galaxy's centre, `x` and `y` 0. Sagittarius A* has an `id`, so the S-stars
 *   in `STARS` can orbit it, its `mu`, its distance from the Sun (GRAVITY Collaboration 2024), and the
 *   diameter of the ring the Event Horizon Telescope imaged (EHT 2022). Triangulum has none: observations limit its mass
 *   to 1500 $ M_\odot $ (Gebhardt et al. 2001).
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
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
    id: 'milky-way',
    name: 'Milky Way',
    type: 'SBbc', // Barred spiral (McConnachie 2012)
    /** D25 diameter in light-years: 26.8 kpc, an estimate from a model of its disk */
    diameter: { value: 87410, unit: 'ly' },
    /** Distance from the Sun: 0, the Sun is in it */
    distance: { value: 0, unit: 'ly' },
    /** Supermassive black hole at the center. */
    blackHole: {
      id: 'sagittarius-a-star',
      name: 'Sagittarius A*',
      /** Mass in solar masses: GRAVITY Collaboration 2024 */
      mass: 4.2996e6,
      /** G·M in m³/s², from its mass and the Sun's GM */
      mu: 5.70610407201485e26,
      /** Schwarzschild radius in au */
      radius: { value: 0.08488, unit: 'au' },
      /** Distance from the Sun in light-years: R₀ = 8275.9 ± 8.6 pc, fitted with its mass */
      distance: { value: 26992.38, unit: 'ly' },
      /** The ring the Event Horizon Telescope imaged: 51.8 ± 2.3 μas (EHT 2022) */
      ringDiameter: 2.511334868e-10 as Radians,
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' }
    }
  },
  // #endregion datasetGalaxies
  {
    id: 'andromeda',
    name: 'Andromeda',
    type: 'SA(s)b', // Spiral, unbarred (RC3)
    /** D25 diameter in light-years: 190.5′ at 761 kpc, 42.2 kpc */
    diameter: { value: 137570, unit: 'ly' },
    /** Distance from the Sun in light-years: 761 ± 11 kpc (Li et al. 2021) */
    distance: { value: 2482050, unit: 'ly' },
    blackHole: {
      name: 'M31*',
      /** Mass in solar masses: Bender et al. 2005, 1.1 to 2.3 × 10⁸ */
      mass: 1.4e8,
      /** Schwarzschild radius in au */
      radius: { value: 2.764, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' }
    }
  },
  {
    id: 'triangulum',
    name: 'Triangulum',
    type: 'SA(s)cd', // Spiral, unbarred (RC3)
    /** D25 diameter in light-years: 70.8′ at 840 kpc, 17.3 kpc */
    diameter: { value: 56420, unit: 'ly' },
    /** Distance from the Sun in light-years: 840 ± 11 kpc (Breuval et al. 2023). Other methods give up to 880 kpc */
    distance: { value: 2739714, unit: 'ly' }
    // No supermassive black hole: at most 1500 M☉ (Gebhardt et al. 2001)
  }
] as const satisfies GalaxiesType;
