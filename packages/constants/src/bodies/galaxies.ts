import { DegreesType, GalaxiesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of galaxies within the space visualization.
 *
 *
 * ::: info
 *
 * - Units: `diameter` and `distance` in light-years (ly); black hole `radius`, `x`, `y`, `z` in astronomical units (au).
 * - `distance` is from the Sun: Cepheids for Andromeda (Li et al. 2021) and Triangulum (Breuval et al. 2023),
 *   eclipsing binaries for the Large and Small Magellanic Clouds (Pietrzyński et al. 2019, Graczyk et al. 2020),
 *   Vasiliev & Belokurov 2020 for the Sagittarius dwarf, the EHT's 16.8 Mpc for M87, and red giants for
 *   Centaurus A (Harris et al. 2010).
 * - `direction` is the galactic longitude `l` and latitude `b` of its centre, seen from the Sun, from
 *   [NED](https://ned.ipac.caltech.edu/). The Milky Way has none: the Sun is in it. For the Large Magellanic
 *   Cloud it's the optical centre of its bar, 0.9° from the centre its stars and gas turn about. For the
 *   Sagittarius dwarf it's the centre of Ibata, Gilmore & Irwin (1994), 5.3′ from M54, the cluster at its heart.
 * - Both `distance` and `direction` are from the Sun, where they're measured. To draw the galaxies around the
 *   Milky Way's centre, convert them with `galactocentricPosition` in `@interstellar-tools/equations`, which uses
 *   {@link SUN_GALACTOCENTRIC_DISTANCE} and {@link SUN_HEIGHT_ABOVE_GALACTIC_PLANE}.
 * - `disk` is how a disk galaxy's disk is turned on the sky, from the motions of its gas or stars: its inclination,
 *   the position angle of its receding half, and of its nearer side where that's known. Andromeda's inclination
 *   is 77.7° (Corbelli et al. 2010); Chemin et al. (2009) measure 74.3°, from H I further in, and Corbelli et al.
 *   find theirs closer to the optical shape. Which side of Triangulum is nearer isn't settled, and the Small
 *   Magellanic Cloud's stars don't form a clear disk, so neither has a `nearSide`. The Sagittarius dwarf, M87 and
 *   Centaurus A have no disk to turn: Centaurus A's dust disk is warped, and crosses edge-on.
 * - `motion` is the velocity along the line of sight, in km/s, positive moving away, and for the Local Group, the
 *   proper motion across the sky in mas/yr: from Gaia and HST, measured against distant quasars. Combined with the
 *   Sun's own motion, {@link SUN_GALACTOCENTRIC_VELOCITY}, they give each galaxy's 3D velocity around the Milky
 *   Way's centre. Across the sky, 10 µas/yr is 36 km/s at Andromeda's distance, so its sideways speed is uncertain
 *   by about 40 km/s; the Magellanic Clouds' and the Sagittarius dwarf's by a few km/s.
 * - `diameter` is the D25 isophotal diameter, where the disk fades to 25 B-magnitudes per square arcsecond:
 *   from RC3 (de Vaucouleurs et al. 1991) and the distance, and an estimate from a model of its disk for the
 *   Milky Way (Goodwin, Gribbin & Hendry 1998). The stars reach further out. The Sagittarius dwarf, which
 *   the Milky Way is tearing apart, has no such edge: its diameter is its half-light diameter (McConnachie 2012).
 * - Black hole `mass` is in solar masses ($ M_\odot $), and `radius` is its Schwarzschild radius, $2GM/c^2$.
 *   Each black hole sits at its galaxy's centre, `x`, `y` and `z` 0. Sagittarius A* has an `id`, so the S-stars
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
      y: { value: 0, unit: 'au' },
      z: { value: 0, unit: 'au' }
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
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED, from 2MASS: its nucleus) */
    direction: { l: 121.1744 as DegreesType, b: -21.573 as DegreesType },
    /**
     * Its disk, from H I at 10 to 25 kpc (Corbelli et al. 2010): the north-east half recedes, the
     * north-west side is nearer. Chemin et al. 2009 measure 74.3° from H I at 6 to 27 kpc, with the same position angle
     */
    disk: {
      inclination: 77.7 as DegreesType,
      positionAngle: 38 as DegreesType,
      nearSide: 308 as DegreesType
    },
    /**
     * Its motion: towards us at 300 km/s (Chemin et al. 2009), and across the sky in mas/yr, from Gaia EDR3
     * (Salomon et al. 2021)
     */
    motion: {
      radialVelocity: -300,
      properMotion: { rightAscension: 0.0489, declination: -0.0369 }
    },
    blackHole: {
      name: 'M31*',
      /** Mass in solar masses: Bender et al. 2005, 1.1 to 2.3 × 10⁸ */
      mass: 1.4e8,
      /** Schwarzschild radius in au */
      radius: { value: 2.764, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' },
      z: { value: 0, unit: 'au' }
    }
  },
  {
    id: 'triangulum',
    name: 'Triangulum',
    type: 'SA(s)cd', // Spiral, unbarred (RC3)
    /** D25 diameter in light-years: 70.8′ at 840 kpc, 17.3 kpc */
    diameter: { value: 56420, unit: 'ly' },
    /** Distance from the Sun in light-years: 840 ± 11 kpc (Breuval et al. 2023). Other methods give up to 880 kpc */
    distance: { value: 2739714, unit: 'ly' },
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED) */
    direction: { l: 133.6101 as DegreesType, b: -31.3306 as DegreesType },
    /** Its disk, from H I inside 7 kpc (Kam et al. 2017): the southern half recedes. Which side is nearer isn't settled */
    disk: {
      inclination: 54 as DegreesType,
      positionAngle: 201.3 as DegreesType
    },
    /** Its motion: towards us at 180 km/s (Kam et al. 2017), and across the sky from Gaia DR2 and its masers (van der Marel et al. 2019) */
    motion: {
      radialVelocity: -180,
      properMotion: { rightAscension: 0.024, declination: 0.003 }
    }
    // No supermassive black hole: at most 1500 M☉ (Gebhardt et al. 2001)
  },
  {
    id: 'large-magellanic-cloud',
    name: 'Large Magellanic Cloud',
    type: 'SB(s)m', // Barred Magellanic irregular (RC3)
    /** D25 diameter in light-years: 645.65′ at 49.59 kpc, 9.3 kpc */
    diameter: { value: 30377.1, unit: 'ly' },
    /** Distance from the Sun in light-years: 49.59 ± 0.55 kpc, from eclipsing binaries (Pietrzyński et al. 2019) */
    distance: { value: 161740.95, unit: 'ly' },
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED: the optical centre of its bar. Its stars and gas turn about a centre 0.9° away) */
    direction: { l: 280.4652 as DegreesType, b: -32.8884 as DegreesType },
    /**
     * Its disk, from the motions of its stars in Gaia EDR3 (Luri et al. 2021): the north-west half recedes, and
     * the north-east side is nearer (van der Marel & Kallivayalil 2014)
     */
    disk: {
      inclination: 34.1 as DegreesType,
      positionAngle: 309.9 as DegreesType,
      nearSide: 39.9 as DegreesType
    },
    /**
     * Its motion: away from us at 262.2 km/s (van der Marel et al. 2002, as Luri et al. 2021 give it, from its stars;
     * its gas gives 278), and across the sky from Gaia EDR3 (Luri et al. 2021)
     */
    motion: {
      radialVelocity: 262.2,
      properMotion: { rightAscension: 1.858, declination: 0.385 }
    }
    // No black hole detected: hypervelocity stars hint at one of about 6 × 10⁵ M☉ (Han et al. 2025), unconfirmed
  },
  {
    id: 'small-magellanic-cloud',
    name: 'Small Magellanic Cloud',
    type: 'SB(s)m pec', // Barred Magellanic irregular, disturbed (RC3)
    /** D25 diameter in light-years: 316.23′ at 62.44 kpc, 5.7 kpc */
    diameter: { value: 18733.3, unit: 'ly' },
    /** Distance from the Sun in light-years: 62.44 ± 0.94 kpc, from eclipsing binaries (Graczyk et al. 2020) */
    distance: { value: 203652.04, unit: 'ly' },
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED) */
    direction: { l: 302.797 as DegreesType, b: -44.2993 as DegreesType },
    /**
     * Its gas disk, from H I (Di Teodoro et al. 2019): the north-east half recedes. Its stars don't form a clear
     * disk, and which side is nearer isn't known
     */
    disk: { inclination: 51 as DegreesType, positionAngle: 66 as DegreesType },
    /**
     * Its motion: away from us at 145.6 km/s (Harris & Zaritsky 2006, as Zivick et al. 2018 give it), and across
     * the sky from HST (Zivick et al. 2018)
     */
    motion: {
      radialVelocity: 145.6,
      properMotion: { rightAscension: 0.82, declination: -1.21 }
    }
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
    distance: { value: 86431.44, unit: 'ly' },
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED and McConnachie 2012, from Ibata et al. 1994. M54, the cluster at its heart, is 5.3′ away) */
    direction: { l: 5.5689 as DegreesType, b: -14.1664 as DegreesType },
    /** Its motion, at M54: away from us at 142 km/s, and across the sky from Gaia (Vasiliev & Belokurov 2020). No disk: the Milky Way is tearing it apart */
    motion: {
      radialVelocity: 142,
      properMotion: { rightAscension: -2.69, declination: -1.35 }
    }
  },
  {
    id: 'm87',
    name: 'Messier 87',
    type: 'E+0-1 pec', // Giant elliptical, with a jet (RC3)
    /** D25 diameter in light-years: 8.32′ at 16.8 Mpc, 40.6 kpc */
    diameter: { value: 132574.9, unit: 'ly' },
    /** Distance from the Sun in light-years: 16.8 Mpc (Event Horizon Telescope Collaboration 2019, from SBF and TRGB) */
    distance: { value: 54794271.45, unit: 'ly' },
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED: its radio nucleus) */
    direction: { l: 283.7777 as DegreesType, b: 74.4912 as DegreesType },
    /** Its motion: away from us at 1284 km/s (NED, from Cappellari et al. 2011). An elliptical, it has no disk */
    motion: { radialVelocity: 1284 },
    blackHole: {
      name: 'M87*',
      /** Mass in solar masses: EHT Collaboration 2019, from the ring at 16.8 Mpc. Stars give 5.4 × 10⁹ (Liepold et al. 2023) */
      mass: 6.5e9,
      /** Schwarzschild radius in au */
      radius: { value: 128.318, unit: 'au' },
      /** The first black hole imaged: a ring of 42 μas (EHT Collaboration 2019) */
      ringDiameter: 2.03622e-10 as Radians,
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' },
      z: { value: 0, unit: 'au' }
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
    /** Direction from the Sun, galactic longitude and latitude in degrees (NED) */
    direction: { l: 309.5159 as DegreesType, b: 19.4173 as DegreesType },
    /** Its motion: away from us at 547 km/s (NED). Its dust disk is warped, crossing edge-on, so it has no single orientation */
    motion: { radialVelocity: 547 },
    blackHole: {
      name: 'Centaurus A*',
      /** Mass in solar masses: Cappellari et al. 2009, from its stars, ± 3.0 × 10⁷ */
      mass: 5.5e7,
      /** Schwarzschild radius in au */
      radius: { value: 1.08577, unit: 'au' },
      x: { value: 0, unit: 'au' },
      y: { value: 0, unit: 'au' },
      z: { value: 0, unit: 'au' }
    }
  }
] as const satisfies GalaxiesType;
