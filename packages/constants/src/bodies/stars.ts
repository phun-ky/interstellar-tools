import { DegreesType, Radians, StarsType } from '@interstellar-tools/types';

/**
 * Represents a dataset of well-known stars within the Milky Way.
 *
 * ::: info
 *
 * - Each star names its `parent` (a galaxy, a system barycenter, or Sagittarius A* for the S-stars)
 *   and its `orbit` around it.
 * - Units: `radius` (km). Orbits around the galaxy: `a` and `x`,`y`,`z` in ly, `period` in Myr.
 *   Orbits within a system or around Sagittarius A*: `a` in au, `period` in d, yr or kyr. `angle` in radians. `mass` in M☉.
 * - Orbits within a system or around Sagittarius A* that have an `i` are on the sky,
 *   `frame: { plane: 'sky' }`: `i` to
 *   the plane of the sky, `om` the position angle of the node from north through east.
 * - `color` is for visualization only.
 * - `period` is always positive; retrograde orbits have `retrograde: true`.
 * - `rotation.period` is the rotation, from interferometry, spectroscopy or starspots, where one is
 *   published: none for Deneb, Sirius, Rigel and Canopus. The Sun's is the IAU's Carrington period, with its faster equator
 *   and slower poles in `equatorialPeriod` and `polarPeriod`. A star's spin direction is unknown.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
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
  {
    id: 'sun',
    name: 'Sun',
    type: 'G2V', // Yellow Dwarf, Main Sequence
    category: 'star',
    /** Bound to the Solar System barycenter, which carries the galactic orbit */
    parent: 'solar-system',
    // No orbit: the Sun's wobble around the barycenter is the sum of the planets' pulls, not a Kepler orbit
    /** Mass in solar masses */
    mass: 1,
    /**
     * Sidereal rotation in days: the IAU's, the Carrington period its
     * coordinates turn with. Its gas turns faster at the equator than at the
     * poles (Snodgrass & Ulrich 1990), and the pole's is extrapolated
     */
    rotation: {
      period: { value: 25.379995, unit: 'd' },
      equatorialPeriod: { value: 24.47, unit: 'd' },
      polarPeriod: { value: 34.16, unit: 'd' }
    },
    /** Radius in km */
    radius: { value: 696340, unit: 'km' },
    mu: 1.3271244004127942e20, // DE440: 1.32712440041279419e20, to double precision
    display: {
      /** Visual representation color */
      color: '#fff5f1'
    }
  },
  // #region datasetStars
  {
    id: 'vega',
    name: 'Vega',
    type: 'A0V', // White-Blue Main Sequence
    category: 'star',
    /** A single star orbits the galaxy directly */
    parent: 'milky-way',
    orbit: {
      /** Semi-major axis in light-years */
      a: { value: 27230.011753394454, unit: 'ly' },
      /** Orbital eccentricity */
      e: 0.005,
      /** Orbital period in million years (Myr) */
      period: { value: 480, unit: 'Myr' },
      /** Initial angle in orbit */
      angle: 1.569867205171707 as Radians
    },
    /** Equatorial rotation in days: Monnier et al. 2012, from interferometry. Seen nearly pole-on */
    rotation: { period: { value: 0.71, unit: 'd' } },
    /** Radius in km */
    mass: 2.135, // Yoon et al. 2010
    radius: { value: 2600000, unit: 'km' },
    display: {
      /** Visual representation color */
      color: 'blue'
    },
    /** Galactic position in light-years (relative to Milky Way center) */
    x: { value: 25.3, unit: 'ly' },
    y: { value: 27230.011753394454, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  // #endregion datasetStars
  {
    id: 'altair',
    name: 'Altair',
    type: 'A7V', // White Main Sequence
    category: 'star',
    parent: 'milky-way',
    orbit: {
      a: { value: 27050.005155082687, unit: 'ly' },
      e: 0.004,
      period: { value: 410, unit: 'Myr' },
      angle: 1.5701789517599378 as Radians
    },
    /** Equatorial rotation in hours, 7 h 46 m: Bouchaud et al. 2020, from interferometry */
    rotation: { period: { value: 7.766667, unit: 'h' } },
    mass: 1.791, // Peterson et al. 2006
    radius: { value: 1700000, unit: 'km' },
    display: {
      color: 'white'
    },
    x: { value: 16.7, unit: 'ly' },
    y: { value: 27050.005155082687, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'deneb',
    name: 'Deneb',
    type: 'A2Ia', // White-Blue Supergiant
    category: 'star',
    parent: 'milky-way',
    orbit: {
      a: { value: 27375.280016832705, unit: 'ly' },
      e: 0.009,
      period: { value: 720, unit: 'Myr' },
      angle: 1.475524958596149 as Radians
    },
    mass: 19, // Schiller & Przybilla 2008
    radius: { value: 108000000, unit: 'km' },
    display: {
      color: '#cad7ff' // A-type (blue-white)
    },
    x: { value: 2616, unit: 'ly' },
    y: { value: 27375.280016832705, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  // Spica: a close binary of A and B around the spica barycenter (see SYSTEMS). Orbit, masses
  // and radii: Tkachenko et al. 2016, Tables 2 and 7 (P 4.0145 d, e 0.133, a 28.20 R☉ = 0.1311 au,
  // i 63.1°). The orbit precesses (apsidal period 117.9 yr, Harrington et al. 2016), so `w` is
  // its value at J2000 from Harrington's fit, and `angle` is illustrative: J2000 is 659 orbits
  // from the measured periastron, which leaves it uncertain by tens of degrees.
  {
    id: 'spica-a',
    name: 'Spica A',
    type: 'B1III-IV', // Blue Giant/Subgiant, a β Cephei variable
    category: 'star',
    parent: 'spica',
    orbit: {
      a: { value: 0.050727, unit: 'au' }, // 0.1311 au × m_B / (m_A + m_B)
      e: 0.133,
      period: { value: 4.0145, unit: 'd' },
      angle: 2.3899 as Radians,
      i: 63.1 as DegreesType,
      w: 233.9 as DegreesType,
      frame: { plane: 'sky' }
    },
    /** Rotation in days: two turns each 4.0145 d orbit, in Tkachenko et al. 2016's model of the pair */
    rotation: { period: { value: 2.007, unit: 'd' } },
    mass: 11.43,
    radius: { value: 5196879, unit: 'km' }, // 7.47 R☉
    display: {
      color: 'blue'
    }
  },
  {
    id: 'spica-b',
    name: 'Spica B',
    type: 'B2V', // Blue Dwarf, Main Sequence
    category: 'star',
    parent: 'spica',
    orbit: {
      a: { value: 0.080417, unit: 'au' }, // 0.1311 au × m_A / (m_A + m_B)
      e: 0.133,
      period: { value: 4.0145, unit: 'd' },
      angle: 2.3899 as Radians,
      i: 63.1 as DegreesType,
      w: 53.9 as DegreesType, // opposite A's periapsis
      frame: { plane: 'sky' }
    },
    /** Rotation in days: 1.5 turns each 4.0145 d orbit, in Tkachenko et al. 2016's model of the pair */
    rotation: { period: { value: 2.676, unit: 'd' } },
    mass: 7.21,
    radius: { value: 2601918, unit: 'km' }, // 3.74 R☉
    display: {
      color: '#cad7ff' // B-type (blue-white)
    }
  },
  // Alpha Centauri: A and B orbit the AB barycenter; the AB pair and Proxima orbit the
  // system barycenter (see SYSTEMS). Each pair shares e, period and angle, and splits its
  // separation by mass ratio, a₁ = a·m₂/(m₁ + m₂).
  // A-B orbit, masses and radii: Akeson et al. 2021, Table 8 (P, e, periastron 1955.564, and a
  // separation of 17.4930 arcsec at a parallax of 750.81 mas = 23.30 au).
  // Orientation of the A-B orbit: Akeson et al. 2021, Table 8 (i 79.243°, Ω 205.073°, ω 231.519°
  // for B), with ω measured in the orbital plane from the ascending node on the sky, and Ω from
  // north through east. A's periapsis points the other way, so its w is 180° less.
  // Proxima's orbit and mass: Kervella et al. 2017, Tables 1 and 3 (a 8.7 kau, e 0.50, P 547 kyr,
  // next periastron in 283 kyr). Proxima's radius from Ribas et al. 2017. R☉ = 695 700 km.
  {
    id: 'alpha-centauri-a',
    name: 'Alpha Centauri A',
    type: 'G2V', // Yellow Dwarf, Main Sequence
    category: 'star',
    parent: 'alpha-centauri-ab',
    orbit: {
      a: { value: 10.66, unit: 'au' }, // 23.30 au × m_B / (m_A + m_B)
      e: 0.51947,
      period: { value: 79.762, unit: 'yr' },
      angle: 3.275243601437025 as Radians, // true anomaly at J2000
      i: 79.243 as DegreesType,
      w: 51.519 as DegreesType,
      om: 205.073 as DegreesType,
      frame: { plane: 'sky' }
    },
    /** Rotation in days: Hallam et al. 1991, from its ultraviolet activity. Uncertain: Bazot et al. 2007 find 22.5 ± 5.9 d */
    rotation: { period: { value: 28.8, unit: 'd' } },
    mass: 1.0788,
    radius: { value: 847015, unit: 'km' }, // 1.2175 R☉
    display: {
      color: '#fff4ea' // G-type
    }
  },
  {
    id: 'alpha-centauri-b',
    name: 'Alpha Centauri B',
    type: 'K1V', // Orange Dwarf, Main Sequence
    category: 'star',
    parent: 'alpha-centauri-ab',
    orbit: {
      a: { value: 12.64, unit: 'au' }, // 23.30 au × m_A / (m_A + m_B)
      e: 0.51947,
      period: { value: 79.762, unit: 'yr' },
      angle: 3.275243601437025 as Radians,
      i: 79.243 as DegreesType,
      w: 231.519 as DegreesType,
      om: 205.073 as DegreesType,
      frame: { plane: 'sky' }
    },
    /** Rotation in days: DeWarf et al. 2010, from its activity */
    rotation: { period: { value: 36.2, unit: 'd' } },
    mass: 0.9092,
    radius: { value: 597676, unit: 'km' }, // 0.8591 R☉
    display: {
      color: '#ffd2a1' // K-type
    }
  },
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    type: 'M5.5Ve', // Red Dwarf, flare star
    category: 'star',
    parent: 'alpha-centauri',
    orbit: {
      a: { value: 8197, unit: 'au' }, // 8700 au × m_AB / (m_AB + m_P)
      e: 0.5,
      period: { value: 547, unit: 'kyr' },
      angle: 3.099566485428788 as Radians // near apastron, 13.0 kau from AB
    },
    /** Rotation in days: Benedict et al. 1998, from its starspots. Suárez Mascareño et al. 2020: 87 ± 12 d */
    rotation: { period: { value: 83, unit: 'd' } },
    mass: 0.1221,
    radius: { value: 107277, unit: 'km' }, // 0.1542 R☉
    display: {
      color: '#ffcc6f' // M-type
    }
  },
  // Sirius: A and its white dwarf B orbit the sirius barycenter (see SYSTEMS). Orbit of B
  // around A, masses and parallax: Bond et al. 2017, Tables 4 to 6 (P 50.1284 yr, a 7.4957″,
  // e 0.59142, i 136.336°, Ω 45.400°, ω 149.161° for B, periastron 1994.5715, parallax
  // 378.9 mas = 19.7828 au). Each star's a splits it by mass, as for Alpha Centauri. A's
  // radius: Davis et al. 2011, at Bond's parallax; B's: Bond et al. 2017.
  {
    id: 'sirius-a',
    name: 'Sirius A',
    type: 'A1V', // White Main Sequence, the brightest star in the night sky
    category: 'star',
    parent: 'sirius',
    orbit: {
      a: { value: 6.5365, unit: 'au' }, // 19.7828 au × m_B / (m_A + m_B)
      e: 0.59142,
      period: { value: 50.1284, unit: 'yr' },
      angle: 1.906838 as Radians, // true anomaly at J2000
      i: 136.336 as DegreesType,
      w: 329.161 as DegreesType,
      om: 45.4 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 2.063,
    radius: { value: 1192708, unit: 'km' }, // 1.7144 R☉
    display: {
      color: '#b5c7ff' // A-type
    }
  },
  {
    id: 'sirius-b',
    name: 'Sirius B',
    type: 'DA2', // White dwarf, hydrogen atmosphere
    category: 'star',
    parent: 'sirius',
    orbit: {
      a: { value: 13.2463, unit: 'au' }, // 19.7828 au × m_A / (m_A + m_B)
      e: 0.59142,
      period: { value: 50.1284, unit: 'yr' },
      angle: 1.906838 as Radians,
      i: 136.336 as DegreesType,
      w: 149.161 as DegreesType,
      om: 45.4 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 1.018,
    radius: { value: 5634, unit: 'km' }, // 0.008098 R☉: Earth-sized
    display: {
      color: '#a8bdff' // White dwarf, 25 200 K
    }
  },
  // Single stars, like Alpha Centauri, are placed at their distance along x, with the
  // Sun's galactic orbit. R☉ = 695 700 km. 1 pc = 3.261563777 ly
  {
    id: 'betelgeuse',
    name: 'Betelgeuse',
    type: 'M1-M2Ia-Iab', // Red Supergiant
    category: 'star',
    parent: 'milky-way',
    // 168 pc, from its pulsations (Joyce et al. 2020): Hipparcos's parallax is unreliable for a star this big
    orbit: {
      a: { value: 27005.560612584955, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.5505028167596557 as Radians
    },
    /** Rotation in years: Kervella et al. 2018, from ALMA, for an inclination of 60° */
    rotation: { period: { value: 31, unit: 'yr' } },
    mass: 18, // 16.5 to 19 M☉, Joyce et al. 2020
    radius: { value: 531514800, unit: 'km' }, // 764 R☉, Joyce et al. 2020
    display: {
      color: '#ffca8a' // M-type supergiant
    },
    x: { value: 548, unit: 'ly' },
    y: { value: 27230.011753394454, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'polaris',
    name: 'Polaris',
    type: 'F7Ib', // Yellow Supergiant, a Cepheid; Polaris Aa
    category: 'star',
    parent: 'milky-way',
    // 136.90 pc, Gaia DR3 for its companion Polaris B, as Evans et al. 2024 adopt
    orbit: {
      a: { value: 27003.691641144178, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.554260796991538 as Radians
    },
    /** Rotation in days: Lee et al. 2008 */
    rotation: { period: { value: 119, unit: 'd' } },
    mass: 5.13, // Evans et al. 2024
    radius: { value: 32190039, unit: 'km' }, // 46.27 R☉, Evans et al. 2024
    display: {
      color: '#fffcf7' // F-type supergiant
    },
    x: { value: 446.5, unit: 'ly' },
    y: { value: 27003.691641144178, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'arcturus',
    name: 'Arcturus',
    type: 'K1.5III', // Orange Giant
    category: 'star',
    parent: 'milky-way',
    // 88.83 mas (Hipparcos, van Leeuwen 2007)
    orbit: {
      a: { value: 27000.024969588456, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.569436327633381 as Radians
    },
    /** Rotation in years: Gray & Brown 2006, from its magnetic activity */
    rotation: { period: { value: 2, unit: 'yr' } },
    mass: 1.08, // Ramírez & Allende Prieto 2011
    radius: { value: 17670780, unit: 'km' }, // 25.4 R☉, Ramírez & Allende Prieto 2011
    display: {
      color: '#ffdfb5' // K-type giant
    },
    x: { value: 36.72, unit: 'ly' },
    y: { value: 27000.024969588456, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'rigel',
    name: 'Rigel',
    type: 'B8Ia', // Blue Supergiant; Rigel A
    category: 'star',
    parent: 'milky-way',
    // 3.78 mas (Hipparcos, van Leeuwen 2007)
    orbit: {
      a: { value: 27013.782109138294, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.538851641798522 as Radians
    },
    mass: 23, // Przybilla et al. 2010, from evolutionary tracks
    radius: { value: 54890730, unit: 'km' }, // 78.9 R☉, Moravveji et al. 2012
    display: {
      color: '#b6ceff' // B-type supergiant
    },
    x: { value: 862.8, unit: 'ly' },
    y: { value: 27013.782109138294, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'canopus',
    name: 'Canopus',
    type: 'A9II', // White Bright Giant
    category: 'star',
    parent: 'milky-way',
    // 10.55 mas (Hipparcos, van Leeuwen 2007)
    orbit: {
      a: { value: 27001.77039825352, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.5593449755210198 as Radians
    },
    mass: 9.81, // Domiciano de Souza et al. 2021
    radius: { value: 50994810, unit: 'km' }, // 73.3 R☉, Domiciano de Souza et al. 2021
    display: {
      color: '#cbd9ff' // A/F-type giant
    },
    x: { value: 309.2, unit: 'ly' },
    y: { value: 27001.77039825352, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'barnards-star',
    // eslint-disable-next-line @stylistic/quotes
    name: "Barnard's Star",
    type: 'M4V', // Red Dwarf, the fastest-moving star in our sky
    category: 'star',
    parent: 'milky-way',
    // 546.98 mas (Gaia DR3)
    orbit: {
      a: { value: 27000.00065846979, unit: 'ly' },
      e: 0.07,
      period: { value: 230, unit: 'Myr' },
      angle: 1.5705754749466354 as Radians
    },
    /** Rotation in days: González Hernández et al. 2024, from its activity */
    rotation: { period: { value: 142, unit: 'd' } },
    mass: 0.162, // Schweitzer et al. 2019
    radius: { value: 128705, unit: 'km' }, // 0.185 R☉, Schweitzer et al. 2019
    display: {
      color: '#ffc97f' // M-type
    },
    x: { value: 5.963, unit: 'ly' },
    y: { value: 27000.00065846979, unit: 'ly' },
    z: { value: 0, unit: 'ly' }
  },
  {
    id: 'trappist-1a',
    name: 'TRAPPIST-1',
    type: 'M8V', // Ultracool Red Dwarf, with seven Earth-sized planets
    category: 'star',
    /** Bound to the TRAPPIST-1 barycenter, which carries the galactic orbit */
    parent: 'trappist-1',
    /** Rotation in days: Vida et al. 2017, from its starspots */
    rotation: { period: { value: 3.295, unit: 'd' } },
    mass: 0.0898, // Mann et al. 2019, as Agol et al. 2021 adopt
    radius: { value: 82927, unit: 'km' }, // 0.1192 R☉, Agol et al. 2021
    mu: 1.19176e19, // its mass × the Sun's GM
    display: {
      color: '#ffa24c' // 2566 K
    }
  },
  // The S-stars: young B stars on Kepler orbits around Sagittarius A*, which name it
  // as their parent. Orbits on the sky (i to the plane of the sky, Ω the position angle
  // of the ascending node, ω in the orbital plane): S2's from GRAVITY Collaboration 2024,
  // Table B.1, and its period from GRAVITY Collaboration 2022; the others' from
  // Gillessen et al. 2017, Table 3. a in au is the angular a × R₀, 8275.9 pc (GRAVITY 2024),
  // and `angle` the true anomaly at J2000 from the time of periapsis. i > 90° is a
  // clockwise orbit on the sky, not a retrograde one. Masses and radii: Habibi et al. 2017,
  // from their spectra. R☉ = 695 700 km.
  {
    id: 's1',
    name: 'S1',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 4924.2, unit: 'au' },
      e: 0.556,
      period: { value: 166.0, unit: 'yr' }, // Gillessen et al. 2017
      angle: 5.998693 as Radians, // Periapsis in 2001.8
      i: 119.14 as DegreesType,
      w: 122.3 as DegreesType,
      om: 342.04 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 12.4,
    radius: { value: 3610683, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's2',
    name: 'S2',
    type: 'B0V', // Most probably B0 (Habibi et al. 2017)
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 1034.7, unit: 'au' },
      e: 0.88444,
      period: { value: 16.046, unit: 'yr' }, // GRAVITY Collaboration 2024
      angle: 3.537946 as Radians, // Periapsis in 2018.3789
      i: 134.67 as DegreesType,
      w: 66.279 as DegreesType,
      om: 228.21 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 13.6,
    radius: { value: 3847221, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's4',
    name: 'S4',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 2954.5, unit: 'au' },
      e: 0.3905,
      period: { value: 77.0, unit: 'yr' }, // Gillessen et al. 2017
      angle: 3.301758 as Radians, // Periapsis in 1957.4
      i: 80.33 as DegreesType,
      w: 290.8 as DegreesType,
      om: 258.84 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 12.2,
    radius: { value: 3638511, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's6',
    name: 'S6',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 5440.6, unit: 'au' },
      e: 0.84,
      period: { value: 192.0, unit: 'yr' }, // Gillessen et al. 2017
      angle: 3.074946 as Radians, // Periapsis in 2108.61
      i: 87.24 as DegreesType,
      w: 116.23 as DegreesType,
      om: 85.07 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 9.2,
    radius: { value: 3137607, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's8',
    name: 'S8',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 3349.3, unit: 'au' },
      e: 0.8031,
      period: { value: 92.9, unit: 'yr' }, // Gillessen et al. 2017
      angle: 2.66468 as Radians, // Periapsis in 1983.64
      i: 74.37 as DegreesType,
      w: 346.7 as DegreesType,
      om: 315.43 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 13.2,
    radius: { value: 3555027, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's9',
    name: 'S9',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 2254.4, unit: 'au' },
      e: 0.644,
      period: { value: 51.3, unit: 'yr' }, // Gillessen et al. 2017
      angle: 3.059443 as Radians, // Periapsis in 1976.71
      i: 82.41 as DegreesType,
      w: 150.6 as DegreesType,
      om: 156.6 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 8.2,
    radius: { value: 2706273, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  },
  {
    id: 's12',
    name: 'S12',
    type: 'B0-B3V', // Early B, main sequence
    category: 'star',
    parent: 'sagittarius-a-star',
    orbit: {
      a: { value: 2472.0, unit: 'au' },
      e: 0.8883,
      period: { value: 58.9, unit: 'yr' }, // Gillessen et al. 2017
      angle: 2.542369 as Radians, // Periapsis in 1995.59
      i: 33.56 as DegreesType,
      w: 317.9 as DegreesType,
      om: 230.1 as DegreesType,
      frame: { plane: 'sky' }
    },
    mass: 7.6,
    radius: { value: 2831499, unit: 'km' },
    display: {
      color: '#cad7ff' // B-type
    }
  }
] as const satisfies StarsType;
