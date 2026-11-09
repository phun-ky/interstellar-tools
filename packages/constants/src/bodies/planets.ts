import { DegreesType, PlanetsType, Radians } from '@interstellar-tools/types';

/**
 * Represents a dataset of planets and planetoids in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` (au), `period` (days), `radius` (km); coordinates `x`,`y`,`z` in au.
 * - `orbit.angle` is the true anomaly at J2000 (2000-01-01 12:00 TT). `x`,`y`,`z` are the heliocentric
 *   position at J2000 in the J2000 ecliptic frame, x towards the equinox.
 * - For the planets, both are computed from the J2000 elements in JPL's "Approximate Positions of the
 *   Planets" (Table 1), using this dataset's `a` and `e`. For the dwarf planets, the orbit and position
 *   are JPL Horizons' osculating heliocentric elements and state at J2000; Pluto's are its system
 *   barycenter's, which Charon also circles. Sedna's orbit around the Solar System's barycenter is
 *   longer, about 506 au and 11 400 years.
 * - `i`, `w` and `om`, in degrees, are against the J2000 ecliptic, `frame`, from the same sources.
 *   Earth's orbit defines the ecliptic, so its `i` and `om` are 0, and `w` is its longitude of
 *   perihelion.
 * - TRAPPIST-1's seven planets orbit their star, `trappist-1a`, with `i` and `w` on the sky,
 *   `frame: { plane: 'sky' }`, and have no `x`,`y`,`z`, which are heliocentric.
 * - `period` is always positive; retrograde orbits have `retrograde: true`.
 * - `rotation.period` is the sidereal rotation in days: 360° over the IAU's rotation rate
 *   (Archinal et al. 2018), and for Earth the IERS's Earth rotation angle. The IAU gives no rate
 *   for the other dwarf planets, so theirs is a light curve's. Venus, Uranus and Pluto spin
 *   backwards, `retrograde: true`. TRAPPIST-1's planets' spins aren't measured.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 *
 * {@include ../../../../docs/partials/planets.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/planets.ts#datasetPlanets}
 * @see {@link PlanetsType}.
 * @group Datasets
 * @example
 * ```ts
 * console.log(PLANETS[0].name); // "Mercury"
 * ```
 */
export const PLANETS: PlanetsType = [
  // #region datasetPlanets
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      /** Semi-major axis in AU */
      a: { value: 0.387, unit: 'au' },
      /** Orbital eccentricity */
      e: 0.2056,
      /** Orbital period in days */
      period: { value: 87.969, unit: 'd' },
      /** True anomaly at J2000 */
      angle: 3.080377 as Radians,
      i: 7.00497902 as DegreesType,
      w: 29.12703035 as DegreesType,
      om: 48.33076593 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 58.6461459, unit: 'd' } },
    /** Radius in km */
    radius: { value: 2439.4, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 2439.4, unit: 'km' },
      polarRadius: { value: 2439.4, unit: 'km' }
    },
    mu: 2.2031868551e13,
    display: {
      /** Visual representation color */
      color: '#8B8B8B'
    },
    /** Heliocentric position at J2000 (J2000 ecliptic frame) in au */
    x: { value: -0.1301, unit: 'au' },
    y: { value: -0.4472, unit: 'au' },
    z: { value: -0.0246, unit: 'au' }
  },
  // #endregion datasetPlanets
  {
    id: 'venus',
    name: 'Venus',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 0.723, unit: 'au' },
      e: 0.0068,
      period: { value: 224.701, unit: 'd' },
      angle: 0.88977 as Radians,
      i: 3.39467605 as DegreesType,
      w: 54.92262463 as DegreesType,
      om: 76.67984255 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IAU, backwards against the Sun's spin */
    rotation: { period: { value: 243.018484, unit: 'd' }, retrograde: true },
    radius: { value: 6051.8, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 6051.8, unit: 'km' },
      polarRadius: { value: 6051.8, unit: 'km' }
    },
    mu: 3.24858592e14,
    display: {
      color: '#E49B0F'
    },
    x: { value: -0.718, unit: 'au' },
    y: { value: -0.0327, unit: 'au' },
    z: { value: 0.041, unit: 'au' }
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'silicate planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 1.0, unit: 'au' },
      e: 0.0167,
      period: { value: 365.256, unit: 'd' },
      angle: 6.238549 as Radians,
      i: 0 as DegreesType,
      w: 102.93768193 as DegreesType,
      om: 0 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IERS, from the Earth rotation angle, 23 h 56 m 4.0989 s */
    rotation: { period: { value: 0.9972696632, unit: 'd' } },
    radius: { value: 6371.0084, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 6378.1366, unit: 'km' },
      polarRadius: { value: 6356.7519, unit: 'km' }
    },
    mu: 3.98600435507e14,
    display: {
      color: '#1E90FF'
    },
    x: { value: -0.1772, unit: 'au' },
    y: { value: 0.9672, unit: 'au' },
    z: { value: 0, unit: 'au' }
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'desert planet',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 1.524, unit: 'au' },
      e: 0.0934,
      period: { value: 686.98, unit: 'd' },
      angle: 0.408015 as Radians,
      i: 1.84969142 as DegreesType,
      w: 286.4968315 as DegreesType,
      om: 49.55953891 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.025956756, unit: 'd' } },
    radius: { value: 3389.5, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 3396.19, unit: 'km' },
      polarRadius: { value: 3376.2, unit: 'km' }
    },
    mu: 4.282837362e13,
    display: {
      color: '#D14A28'
    },
    x: { value: 1.3909, unit: 'au' },
    y: { value: -0.0134, unit: 'au' },
    z: { value: -0.0345, unit: 'au' }
  },
  {
    id: 'ceres',
    name: 'Ceres',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 2.7665, unit: 'au' },
      e: 0.07838,
      period: { value: 1680.7, unit: 'd' },
      angle: 0.126478 as Radians,
      i: 10.58336046 as DegreesType,
      w: 73.92286274 as DegreesType,
      om: 80.49435747 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.3780904165, unit: 'd' } },
    radius: { value: 469.7, unit: 'km' },
    mu: 6.26284e10,
    display: {
      color: '#C0C0C0'
    },
    x: { value: -2.3793, unit: 'au' },
    y: { value: 0.7955, unit: 'au' },
    z: { value: 0.463, unit: 'au' }
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'gas giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 5.203, unit: 'au' },
      e: 0.0489,
      period: { value: 4332.59, unit: 'd' },
      angle: 0.378185 as Radians,
      i: 1.30439695 as DegreesType,
      w: 274.25457074 as DegreesType,
      om: 100.47390909 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.4135383258, unit: 'd' } },
    radius: { value: 69911, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 71492, unit: 'km' },
      polarRadius: { value: 66854, unit: 'km' }
    },
    mu: 1.266865319e17,
    display: {
      color: '#C08850'
    },
    x: { value: 3.9953, unit: 'au' },
    y: { value: 2.9459, unit: 'au' },
    z: { value: -0.1016, unit: 'au' }
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'gas giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 9.537, unit: 'au' },
      e: 0.0565,
      period: { value: 10759.22, unit: 'd' },
      angle: 5.458247 as Radians,
      i: 2.48599187 as DegreesType,
      w: 338.93645383 as DegreesType,
      om: 113.66242448 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IAU System III, 10 h 39 m 22.4 s, from Voyager's radio signals; ring seismology gives 10 h 33 m 38 s */
    rotation: { period: { value: 0.4440092592, unit: 'd' } },
    radius: { value: 58232, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 60268, unit: 'km' },
      polarRadius: { value: 54364, unit: 'km' }
    },
    mu: 3.793120623e16,
    display: {
      color: '#D2B48C'
    },
    x: { value: 6.4288, unit: 'au' },
    y: { value: 6.5083, unit: 'au' },
    z: { value: -0.3691, unit: 'au' }
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'ice giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 19.191, unit: 'au' },
      e: 0.0463,
      period: { value: 30687.15, unit: 'd' },
      angle: 2.537459 as Radians,
      i: 0.77263783 as DegreesType,
      w: 96.93735127 as DegreesType,
      om: 74.01692503 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IAU, backwards against the Sun's spin */
    rotation: { period: { value: 0.7183333333, unit: 'd' }, retrograde: true },
    radius: { value: 25362, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 25559, unit: 'km' },
      polarRadius: { value: 24973, unit: 'km' }
    },
    mu: 5.7939513e15,
    display: {
      color: '#78D6FF'
    },
    x: { value: 14.4012, unit: 'au' },
    y: { value: -13.7439, unit: 'au' },
    z: { value: -0.2377, unit: 'au' }
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'ice giant',
    category: 'planet',
    parent: 'sun',
    orbit: {
      a: { value: 30.069, unit: 'au' },
      e: 0.0086,
      period: { value: 60190.03, unit: 'd' },
      angle: 4.519475 as Radians,
      i: 1.77004347 as DegreesType,
      w: 273.18053653 as DegreesType,
      om: 131.78422574 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IAU, 15.9663 h, from Karkoschka (2011); Voyager's radio period was 16.11 h */
    rotation: { period: { value: 0.6652625, unit: 'd' } },
    radius: { value: 24622, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 24764, unit: 'km' },
      polarRadius: { value: 24341, unit: 'km' }
    },
    mu: 6.83509997e15,
    display: {
      color: '#0053D6'
    },
    x: { value: 16.8038, unit: 'au' },
    y: { value: -24.9923, unit: 'au' },
    z: { value: 0.1274, unit: 'au' }
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 39.2643, unit: 'au' },
      e: 0.24467,
      period: { value: 89866.1, unit: 'd' },
      angle: 0.440001 as Radians,
      i: 17.1513644 as DegreesType,
      w: 113.76290249 as DegreesType,
      om: 110.28692974 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: IAU, backwards against the Sun's spin */
    rotation: { period: { value: 6.387222999, unit: 'd' }, retrograde: true },
    radius: { value: 1188.3, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 1188.3, unit: 'km' },
      polarRadius: { value: 1188.3, unit: 'km' }
    },
    mu: 8.693e11,
    display: {
      color: '#B0A99F'
    },
    x: { value: -9.8754, unit: 'au' },
    y: { value: -27.9588, unit: 'au' },
    z: { value: 5.8504, unit: 'au' }
  },
  {
    id: 'eris',
    name: 'Eris',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 68.1399, unit: 'au' },
      e: 0.432505,
      period: { value: 205447.3, unit: 'd' },
      angle: 3.251515 as Radians,
      i: 43.74050564 as DegreesType,
      w: 150.84480964 as DegreesType,
      om: 36.12852074 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: Bernstein et al. 2023. It turns once each orbit of Dysnomia, which keeps one face to it */
    rotation: { period: { value: 15.771, unit: 'd' } },
    radius: { value: 1163, unit: 'km' },
    mu: 1.0935e12, // Holler et al. 2021's system, less Dysnomia's 0.5 %
    display: {
      color: '#F2F0EC' // Nearly white, one of the most reflective bodies known
    },
    x: { value: 88.3933, unit: 'au' },
    y: { value: 30.7652, unit: 'au' },
    z: { value: -26.0944, unit: 'au' }
  },
  {
    id: 'haumea',
    name: 'Haumea',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 42.9093, unit: 'au' },
      e: 0.199921,
      period: { value: 102665.6, unit: 'd' },
      angle: 3.255681 as Radians,
      i: 28.20614177 as DegreesType,
      w: 240.59077767 as DegreesType,
      om: 121.93323859 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: 3.915341 h (Lellouch et al. 2010). The spin stretches it to 1161 × 852 × 513 km */
    rotation: { period: { value: 0.163139208, unit: 'd' } },
    radius: { value: 797.6, unit: 'km' },
    mu: 2.63798e11,
    display: {
      color: '#F4F5F7' // White, crystalline water ice
    },
    x: { value: -45.9898, unit: 'au' },
    y: { value: -5.1205, unit: 'au' },
    z: { value: 22.3856, unit: 'au' }
  },
  {
    id: 'makemake',
    name: 'Makemake',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 45.3721, unit: 'au' },
      e: 0.164523,
      period: { value: 111630.1, unit: 'd' },
      angle: 2.621343 as Radians,
      i: 29.00018554 as DegreesType,
      w: 296.28099919 as DegreesType,
      om: 79.27490607 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: 22.8266 h (Hromakina et al. 2019) */
    rotation: { period: { value: 0.9511083333, unit: 'd' } },
    radius: { value: 714, unit: 'km' },
    display: {
      color: '#D9B48F' // Reddish-brown
    },
    x: { value: -43.5785, unit: 'au' },
    y: { value: 11.4783, unit: 'au' },
    z: { value: 24.9182, unit: 'au' }
  },
  {
    id: 'gonggong',
    name: 'Gonggong',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 67.0513, unit: 'au' },
      e: 0.499574,
      period: { value: 200543.7, unit: 'd' },
      angle: 2.487949 as Radians,
      i: 30.71461209 as DegreesType,
      w: 206.94098704 as DegreesType,
      om: 336.87541406 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: 44.81 h (Pál et al. 2016); half of it, 22.40 h, is not ruled out */
    rotation: { period: { value: 1.867083333, unit: 'd' } },
    radius: { value: 615, unit: 'km' },
    mu: 1.168e11,
    display: {
      color: '#B5553A' // Red
    },
    x: { value: 70.2665, unit: 'au' },
    y: { value: -44.2264, unit: 'au' },
    z: { value: -7.7691, unit: 'au' }
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 43.133, unit: 'au' },
      e: 0.03951,
      period: { value: 103469.7, unit: 'd' },
      angle: 4.442872 as Radians,
      i: 8.00508947 as DegreesType,
      w: 163.78548728 as DegreesType,
      om: 189.07999041 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: 17.6788 h (Ortiz et al. 2003) */
    rotation: { period: { value: 0.7366166667, unit: 'd' } },
    radius: { value: 545, unit: 'km' },
    mu: 8.0626e10,
    display: {
      color: '#A86E52' // Reddish
    },
    x: { value: -16.7665, unit: 'au' },
    y: { value: -39.8317, unit: 'au' },
    z: { value: 5.1593, unit: 'au' }
  },
  {
    id: 'sedna',
    name: 'Sedna',
    type: 'ice planet',
    category: 'planetoid',
    parent: 'sun',
    orbit: {
      a: { value: 549.8733, unit: 'au' },
      e: 0.86098,
      period: { value: 4709690.2, unit: 'd' },
      angle: 5.428088 as Radians,
      i: 11.92524942 as DegreesType,
      w: 310.73286356 as DegreesType,
      om: 144.31692861 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Rotation in days: 10.273 h (Gaudi et al. 2005) */
    rotation: { period: { value: 0.4280416667, unit: 'd' } },
    radius: { value: 497.5, unit: 'km' },
    display: {
      color: '#B0472F' // Deep red, one of the reddest bodies known
    },
    x: { value: 61.9508, unit: 'au' },
    y: { value: 63.8763, unit: 'au' },
    z: { value: -18.5892, unit: 'au' }
  },
  // TRAPPIST-1's seven planets, around its star. Agol et al. 2021: a (Table 6), e and ω from
  // e cos ω and e sin ω (Table 2), i on the sky (Table 5), radii and masses (Table 6, with
  // the equatorial Earth radius). Periods are the mean ones of Ducrot et al. 2020 (Table 4):
  // their transit times put each at its true anomaly at J2000, to a few degrees. The orbits
  // are nearly circular, so ω is uncertain, ±111° for c: ν and ω together give the position.
  {
    id: 'trappist-1b',
    name: 'TRAPPIST-1b',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.01154, unit: 'au' },
      e: 0.0031,
      period: { value: 1.51088432, unit: 'd' },
      angle: 5.951573 as Radians,
      i: 89.728 as DegreesType,
      w: 134.7 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 7119, unit: 'km' },
    mu: 547680000000000.0,
    display: {
      color: '#8A7566'
    }
  },
  {
    id: 'trappist-1c',
    name: 'TRAPPIST-1c',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.0158, unit: 'au' },
      e: 0.0006,
      period: { value: 2.42179346, unit: 'd' },
      angle: 0.039794 as Radians,
      i: 89.778 as DegreesType,
      w: 1.0 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 6995, unit: 'km' },
    mu: 521370000000000.0,
    display: {
      color: '#968779'
    }
  },
  {
    id: 'trappist-1d',
    name: 'TRAPPIST-1d',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.02227, unit: 'au' },
      e: 0.0056,
      period: { value: 4.04978035, unit: 'd' },
      angle: 2.310118 as Radians,
      i: 89.896 as DegreesType,
      w: 151.7 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 5026, unit: 'km' },
    mu: 154660000000000.0,
    display: {
      color: '#8F9190'
    }
  },
  {
    id: 'trappist-1e',
    name: 'TRAPPIST-1e',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.02925, unit: 'au' },
      e: 0.0063,
      period: { value: 6.09956479, unit: 'd' },
      angle: 4.937536 as Radians,
      i: 89.793 as DegreesType,
      w: 313.2 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 5868, unit: 'km' },
    mu: 275830000000000.0,
    display: {
      color: '#7F8F99'
    }
  },
  {
    id: 'trappist-1f',
    name: 'TRAPPIST-1f',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.03849, unit: 'au' },
      e: 0.0084,
      period: { value: 9.20659399, unit: 'd' },
      angle: 1.961925 as Radians,
      i: 89.74 as DegreesType,
      w: 183.5 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 6664, unit: 'km' },
    mu: 414150000000000.0,
    display: {
      color: '#8C9BA6'
    }
  },
  {
    id: 'trappist-1g',
    name: 'TRAPPIST-1g',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.04683, unit: 'au' },
      e: 0.004,
      period: { value: 12.3535557, unit: 'd' },
      angle: 4.790929 as Radians,
      i: 89.742 as DegreesType,
      w: 18.6 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 7204, unit: 'km' },
    mu: 526550000000000.0,
    display: {
      color: '#A1AEB8'
    }
  },
  {
    id: 'trappist-1h',
    name: 'TRAPPIST-1h',
    type: 'terrestrial planet',
    category: 'planet',
    parent: 'trappist-1a',
    orbit: {
      a: { value: 0.06189, unit: 'au' },
      e: 0.0037,
      period: { value: 18.7672745, unit: 'd' },
      angle: 4.893554 as Radians,
      i: 89.805 as DegreesType,
      w: 180.3 as DegreesType,
      frame: { plane: 'sky' }
    },
    radius: { value: 4817, unit: 'km' },
    mu: 129940000000000.0,
    display: {
      color: '#B8C1C7'
    }
  }
] as const satisfies PlanetsType;
