import { GalaxiesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of galaxies within the space visualization.
 *
 *
 * ::: info
 *
 * - Units: `diameter` and `distance` in light-years (ly); black hole `radius`, `x`, `y` in astronomical units (au).
 * - `distance` is from the Sun: Cepheids for Andromeda (Li et al. 2021) and Triangulum (Breuval et al. 2023),
 *   eclipsing binaries for the Large and Small Magellanic Clouds (Pietrzyński et al. 2019, Graczyk et al. 2020),
 *   Vasiliev & Belokurov 2020 for the Sagittarius dwarf, the EHT's 16.8 Mpc for M87, and red giants for
 *   Centaurus A (Harris et al. 2010).
 * - `diameter` is the D25 isophotal diameter, where the disk fades to 25 B-magnitudes per square arcsecond:
 *   from RC3 (de Vaucouleurs et al. 1991) and the distance, and an estimate from a model of its disk for the
 *   Milky Way (Goodwin, Gribbin & Hendry 1998). The stars reach further out. The Sagittarius dwarf, which
 *   the Milky Way is tearing apart, has no such edge: its diameter is its half-light diameter (McConnachie 2012).
 * - Black hole `mass` is in solar masses ($ M_\odot $), and `radius` is its Schwarzschild radius, $2GM/c^2$.
 *   Each black hole sits at its galaxy's centre, `x` and `y` 0. Sagittarius A* has an `id`, so the S-stars
 *   in `STARS` can orbit it, its `mu`, its distance from the Sun (GRAVITY Collaboration 2024), and the
 *   diameter of the ring the Event Horizon Telescope imaged (EHT 2022). M87*, the first black hole it imaged,
 *   has its ring's diameter too (EHT 2019). Triangulum has none: observations limit its mass to 1500 $ M_\odot $ (Gebhardt et al.
 *   2001). None is detected in the Magellanic Clouds or the Sagittarius dwarf.
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
  },
  {
    id: 'large-magellanic-cloud',
    name: 'Large Magellanic Cloud',
    type: 'SB(s)m', // Barred Magellanic irregular (RC3)
    /** D25 diameter in light-years: 645.65′ at 49.59 kpc, 9.3 kpc */
    diameter: { value: 30377.1, unit: 'ly' },
    /** Distance from the Sun in light-years: 49.59 ± 0.55 kpc, from eclipsing binaries (Pietrzyński et al. 2019) */
    distance: { value: 161740.95, unit: 'ly' }
    // No black hole detected: hypervelocity stars hint at one of about 6 × 10⁵ M☉ (Han et al. 2025), unconfirmed
  },
  {
    id: 'small-magellanic-cloud',
    name: 'Small Magellanic Cloud',
    type: 'SB(s)m pec', // Barred Magellanic irregular, disturbed (RC3)
    /** D25 diameter in light-years: 316.23′ at 62.44 kpc, 5.7 kpc */
    diameter: { value: 18733.3, unit: 'ly' },
    /** Distance from the Sun in light-years: 62.44 ± 0.94 kpc, from eclipsing binaries (Graczyk et al. 2020) */
    distance: { value: 203652.04, unit: 'ly' }
  },
  {
    id: 'sagittarius-dwarf',
    name: 'Sagittarius Dwarf Spheroidal Galaxy',
    type: 'dSph(t)', // Dwarf spheroidal, tidally disrupted (NED)
    /**
     * Half-light diameter in light-years: 2 × 342′ at 26.5 kpc (McConnachie 2012).
     * The Milky Way is tearing it apart, so it has no D25 edge, and its stream circles the sky
     */
    diameter: { value: 17197.1, unit: 'ly' },
    /** Distance from the Sun in light-years: 26.5 kpc (Vasiliev & Belokurov 2020) */
    distance: { value: 86431.44, unit: 'ly' }
  },
  {
    id: 'm87',
    name: 'Messier 87',
    type: 'E+0-1 pec', // Giant elliptical, with a jet (RC3)
    /** D25 diameter in light-years: 8.32′ at 16.8 Mpc, 40.6 kpc */
    diameter: { value: 132574.9, unit: 'ly' },
    /** Distance from the Sun in light-years: 16.8 Mpc (Event Horizon Telescope Collaboration 2019, from SBF and TRGB) */
    distance: { value: 54794271.45, unit: 'ly' },
    blackHole: {
      name: 'M87*',
      /** Mass in solar masses: EHT Collaboration 2019, from the ring at 16.8 Mpc. Stars give 5.4 × 10⁹ (Liepold et al. 2023) */
      mass: 6.5e9,
      /** Schwarzschild radius in au */
      radius: { value: 128.318, unit: 'au' },
      /** The first black hole imaged: a ring of 42 μas (EHT Collaboration 2019) */
      ringDiameter: 2.03622e-10 as Radians,
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' }
    }
  },
  {
    id: 'centaurus-a',
    name: 'Centaurus A',
    type: 'S0 pec', // Lenticular, with a dust lane from a merger (RC3)
    /** D25 diameter in light-years: 25.70′ at 3.8 Mpc, 28.4 kpc */
    diameter: { value: 92669.2, unit: 'ly' },
    /** Distance from the Sun in light-years: 3.8 ± 0.1 Mpc, from its red giants (Harris et al. 2010) */
    distance: { value: 12393942.35, unit: 'ly' },
    blackHole: {
      name: 'Centaurus A*',
      /** Mass in solar masses: Cappellari et al. 2009, from its stars, ± 3.0 × 10⁷ */
      mass: 5.5e7,
      /** Schwarzschild radius in au */
      radius: { value: 1.08577, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' }
    }
  }
] as const satisfies GalaxiesType;
