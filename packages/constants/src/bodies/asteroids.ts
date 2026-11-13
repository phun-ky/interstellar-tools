import { AsteroidsType, DegreesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of well-known asteroids within the solar system simulation.
 *
 * ::: info
 *
 * - Units: `a` in astronomical units (au); `period` in days (d); `radius` in km.
 * - Orbital angles `i`, `w`, and `om` are in degrees, against the J2000 ecliptic, `frame`.
 * - `display.color` and `display.size` are rendering hints only.
 * - `rotation.period` is the sidereal rotation in hours: 360° over the IAU's rotation rate
 *   (Archinal et al. 2018) where it gives one, else from the shape and pole models of each
 *   asteroid's light curves. Pallas, Hygiea, Psyche, Eunomia, Bennu, Ryugu, Itokawa, Ida, Šteins,
 *   Didymos and Apophis spin backwards against the Sun's spin, `retrograde: true`. Apophis tumbles,
 *   `tumbling: true`. Lutetia's and Arrokoth's poles lie too near 90° from the Sun's to tell.
 * - `rotation.iau` is the IAU's rotation model (Archinal et al. 2018) where it gives one: Vesta,
 *   Eros, Pallas, Davida, 52 Europa, Itokawa, Lutetia, Ida, Gaspra and Šteins. Their poles are
 *   `'positive'`, by the right-hand rule. Itokawa's and Lutetia's prime meridians are arbitrary,
 *   and Šteins's turns at the IAU's rounded 6.05 h, 0.75° a day slower than its `period`.
 * - The asteroids spacecraft visited, from Bennu to Apophis, have JPL Horizons' osculating
 *   elements at J2000, and `mu` where a spacecraft or a moon weighed them.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 * {@include ../../../../docs/partials/asteroids.md}
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/asteroids.ts#datasetAsteroids}
 * @group Datasets
 * @see {@link AsteroidsType}.
 * @example
 * ```ts
 * console.log(ASTEROIDS[0].name); // "Ceres"
 * ```
 */
export const ASTEROIDS: AsteroidsType = [
  // #region datasetAsteroids
  {
    id: '4-vesta',
    name: 'Vesta',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'v-type', // vesta has a unique basaltic surface
    parent: 'sun',
    orbit: {
      a: { value: 2.362, unit: 'au' },
      e: 0.09,
      i: 7.1 as DegreesType,
      w: 151.2 as DegreesType,
      om: 103.8 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 5.527458 as Radians,
      period: { value: 1325.2, unit: 'd' },
      q: { value: 2.151, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU */
    rotation: {
      period: { value: 5.342128248, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 309.031 as DegreesType,
        rightAscensionRate: 0,
        declination: 42.235 as DegreesType,
        declinationRate: 0,
        primeMeridian: 285.39 as DegreesType,
        primeMeridianRate: 1617.3329428
      }
    },
    radius: { value: 262.7, unit: 'km' },
    display: {
      color: '#999999',
      size: 1
    }
  },
  // #endregion datasetAsteroids
  {
    id: '433-eros',
    name: 'Eros',
    type: 'near-earth asteroid',
    category: 'amor group',
    spectralType: 's-type',
    parent: 'sun',
    orbit: {
      a: { value: 1.458, unit: 'au' },
      e: 0.223,
      i: 10.8 as DegreesType,
      w: 178.9 as DegreesType,
      om: 304.3 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.553343 as Radians,
      period: { value: 643.2, unit: 'd' },
      q: { value: 1.134, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU. It spins on its side */
    rotation: {
      period: { value: 5.270257308, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 11.35 as DegreesType,
        rightAscensionRate: 0,
        declination: 17.22 as DegreesType,
        declinationRate: 0,
        primeMeridian: 326.07 as DegreesType,
        primeMeridianRate: 1639.38864745
      }
    },
    radius: { value: 8.4, unit: 'km' },
    display: {
      color: '#aaaaaa',
      size: 1
    }
  },
  {
    id: '2-pallas',
    name: 'Pallas',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'b-type',
    parent: 'sun',
    orbit: {
      a: { value: 2.773, unit: 'au' },
      e: 0.231,
      i: 34.8 as DegreesType,
      w: 310.2 as DegreesType,
      om: 173.1 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 0.579449 as Radians,
      period: { value: 1684.9, unit: 'd' },
      q: { value: 2.13, unit: 'au' }
    },
    /**
     * Sidereal rotation in hours: IAU. Its pole (Carry et al. 2010) is 100°
     * from the Sun's, so against the Sun's spin, though forwards around its
     * own steeply tilted orbit
     */
    rotation: {
      period: { value: 7.813322366, unit: 'h' },
      retrograde: true,
      iau: {
        pole: 'positive',
        rightAscension: 33 as DegreesType,
        rightAscensionRate: 0,
        declination: -3 as DegreesType,
        declinationRate: 0,
        primeMeridian: 38 as DegreesType,
        primeMeridianRate: 1105.8036
      }
    },
    radius: { value: 256, unit: 'km' },
    display: {
      color: '#888888',
      size: 1
    }
  },
  {
    id: '10-hygiea',
    name: 'Hygiea',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'c-type',
    parent: 'sun',
    orbit: {
      a: { value: 3.141, unit: 'au' },
      e: 0.112,
      i: 3.8 as DegreesType,
      w: 312.3 as DegreesType,
      om: 283.2 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 2.656391 as Radians,
      period: { value: 2033.8, unit: 'd' },
      q: { value: 2.788, unit: 'au' }
    },
    /** Sidereal rotation in hours: Vernazza et al. 2020, backwards against the Sun's spin */
    rotation: { period: { value: 13.82559, unit: 'h' }, retrograde: true },
    radius: { value: 216.5, unit: 'km' },
    display: {
      color: '#666666',
      size: 1
    }
  },
  {
    id: '704-interamnia',
    name: 'Interamnia',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'f-type',
    parent: 'sun',
    orbit: {
      a: { value: 3.062, unit: 'au' },
      e: 0.127,
      i: 17.3 as DegreesType,
      w: 339.4 as DegreesType,
      om: 73.1 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 0.788889 as Radians,
      period: { value: 1960.9, unit: 'd' },
      q: { value: 2.671, unit: 'au' }
    },
    /** Sidereal rotation in hours: Hanuš et al. 2020 */
    rotation: { period: { value: 8.71234, unit: 'h' } },
    radius: { value: 166, unit: 'km' },
    display: {
      color: '#777777',
      size: 1
    }
  },
  {
    id: '31-euphrosyne',
    name: 'Euphrosyne',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'c-type',
    parent: 'sun',
    orbit: {
      a: { value: 3.155, unit: 'au' },
      e: 0.223,
      i: 26.3 as DegreesType,
      w: 34.8 as DegreesType,
      om: 359.2 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 3.150319 as Radians,
      period: { value: 2045.5, unit: 'd' },
      q: { value: 2.451, unit: 'au' }
    },
    /** Sidereal rotation in hours: Yang et al. 2020 */
    rotation: { period: { value: 5.529595, unit: 'h' } },
    radius: { value: 134, unit: 'km' },
    display: {
      color: '#555555',
      size: 1
    }
  },
  {
    id: '16-psyche',
    name: 'Psyche',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'm-type',
    parent: 'sun',
    orbit: {
      a: { value: 2.924, unit: 'au' },
      e: 0.14,
      i: 3.1 as DegreesType,
      w: 228.0 as DegreesType,
      om: 150.2 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.520182 as Radians,
      period: { value: 1820.1, unit: 'd' },
      q: { value: 2.515, unit: 'au' }
    },
    /** Sidereal rotation in hours: Viikinkoski et al. 2018. On its side, just past backwards: its pole is 94° from the Sun's */
    rotation: { period: { value: 4.195948, unit: 'h' }, retrograde: true },
    radius: { value: 111, unit: 'km' },
    display: {
      color: '#999999',
      size: 1
    }
  },
  {
    id: '511-davida',
    name: 'Davida',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'c-type',
    parent: 'sun',
    orbit: {
      a: { value: 3.168, unit: 'au' },
      e: 0.195,
      i: 15.9 as DegreesType,
      w: 308.2 as DegreesType,
      om: 296.1 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 2.099631 as Radians,
      period: { value: 2059.6, unit: 'd' },
      q: { value: 2.549, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU */
    rotation: {
      period: { value: 5.129364, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 297 as DegreesType,
        rightAscensionRate: 0,
        declination: 5 as DegreesType,
        declinationRate: 0,
        primeMeridian: 268.1 as DegreesType,
        primeMeridianRate: 1684.4193549
      }
    },
    radius: { value: 149, unit: 'km' },
    display: {
      color: '#444444',
      size: 1
    }
  },
  {
    id: '52-europa',
    name: 'Europa',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 'c-type',
    parent: 'sun',
    orbit: {
      a: { value: 3.101, unit: 'au' },
      e: 0.101,
      i: 7.5 as DegreesType,
      w: 87.7 as DegreesType,
      om: 304.4 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 3.675663 as Radians,
      period: { value: 1977.9, unit: 'd' },
      q: { value: 2.788, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU */
    rotation: {
      period: { value: 5.6299584, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 257 as DegreesType,
        rightAscensionRate: 0,
        declination: 12 as DegreesType,
        declinationRate: 0,
        primeMeridian: 55 as DegreesType,
        primeMeridianRate: 1534.6472187
      }
    },
    radius: { value: 156.5, unit: 'km' },
    display: {
      color: '#555555',
      size: 1
    }
  },
  {
    id: '3-juno',
    name: 'Juno',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 's-type',
    parent: 'sun',
    orbit: {
      a: { value: 2.67, unit: 'au' },
      e: 0.257,
      i: 12.9 as DegreesType,
      w: 248.3 as DegreesType,
      om: 169.8 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.74882 as Radians,
      period: { value: 1594.4, unit: 'd' },
      q: { value: 1.986, unit: 'au' }
    },
    /** Sidereal rotation in hours: Viikinkoski et al. 2015 */
    rotation: { period: { value: 7.20953091, unit: 'h' } },
    radius: { value: 117, unit: 'km' },
    display: {
      color: '#aaaaaa',
      size: 1
    }
  },
  {
    id: '15-eunomia',
    name: 'Eunomia',
    type: 'main-belt asteroid',
    category: 'large asteroid',
    spectralType: 's-type',
    parent: 'sun',
    orbit: {
      a: { value: 2.643, unit: 'au' },
      e: 0.186,
      i: 11.7 as DegreesType,
      w: 97.5 as DegreesType,
      om: 293.3 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.054179 as Radians,
      period: { value: 1567.6, unit: 'd' },
      q: { value: 2.153, unit: 'au' }
    },
    /** Sidereal rotation in hours: Viikinkoski et al. 2017, backwards against the Sun's spin */
    rotation: { period: { value: 6.082753, unit: 'h' }, retrograde: true },
    radius: { value: 136, unit: 'km' },
    display: {
      color: '#bbbbbb',
      size: 1
    }
  },
  {
    id: '101955-bennu',
    name: 'Bennu',
    type: 'near-earth asteroid',
    category: 'apollo group',
    spectralType: 'b-type', // OSIRIS-REx sampled it
    parent: 'sun',
    orbit: {
      a: { value: 1.128923, unit: 'au' },
      e: 0.204652,
      i: 6.026 as DegreesType,
      w: 65.672 as DegreesType,
      om: 2.179 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 0.912594 as Radians,
      period: { value: 438.1, unit: 'd' },
      q: { value: 0.8979, unit: 'au' }
    },
    /** Sidereal rotation in hours: Hergenrother et al. 2019, at J2000. Sunlight speeds it up. Backwards against the Sun's spin */
    rotation: { period: { value: 4.296061, unit: 'h' }, retrograde: true },
    radius: { value: 0.24467, unit: 'km' },
    mu: 4.89045, // OSIRIS-REx, Scheeres et al. 2020
    display: {
      color: '#46484C',
      size: 1
    }
  },
  {
    id: '162173-ryugu',
    name: 'Ryugu',
    type: 'near-earth asteroid',
    category: 'apollo group',
    spectralType: 'c-type', // Cb; Hayabusa2 sampled it
    parent: 'sun',
    orbit: {
      a: { value: 1.189054, unit: 'au' },
      e: 0.190016,
      i: 5.884 as DegreesType,
      w: 211.272 as DegreesType,
      om: 251.727 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 4.657822 as Radians,
      period: { value: 473.6, unit: 'd' },
      q: { value: 0.9631, unit: 'au' }
    },
    /** Sidereal rotation in hours: Watanabe et al. 2019. Backwards against the Sun's spin */
    rotation: { period: { value: 7.63262, unit: 'h' }, retrograde: true },
    radius: { value: 0.4481, unit: 'km' },
    mu: 30.0, // Hayabusa2, Watanabe et al. 2019
    display: {
      color: '#3B3936',
      size: 1
    }
  },
  {
    id: '25143-itokawa',
    name: 'Itokawa',
    type: 'near-earth asteroid',
    category: 'apollo group',
    spectralType: 's-type', // Hayabusa sampled it
    parent: 'sun',
    orbit: {
      a: { value: 1.324946, unit: 'au' },
      e: 0.280528,
      i: 1.717 as DegreesType,
      w: 160.138 as DegreesType,
      om: 71.614 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.267064 as Radians,
      period: { value: 557.1, unit: 'd' },
      q: { value: 0.9533, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU. Backwards against the Sun's spin */
    rotation: {
      period: { value: 12.132395, unit: 'h' },
      retrograde: true,
      iau: {
        pole: 'positive',
        rightAscension: 90.53 as DegreesType,
        rightAscensionRate: 0,
        declination: -66.3 as DegreesType,
        declinationRate: 0,
        primeMeridian: 0 as DegreesType,
        primeMeridianRate: 712.143
      }
    },
    radius: { value: 0.1638, unit: 'km' },
    mu: 2.343, // Hayabusa, Fujiwara et al. 2006
    display: {
      color: '#8A7D69',
      size: 1
    }
  },
  {
    id: '21-lutetia',
    name: 'Lutetia',
    type: 'main-belt asteroid',
    category: 'small asteroid',
    spectralType: 'm-type', // Xc
    parent: 'sun',
    orbit: {
      a: { value: 2.435733, unit: 'au' },
      e: 0.161713,
      i: 3.066 as DegreesType,
      w: 250.117 as DegreesType,
      om: 80.947 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 5.222118 as Radians,
      period: { value: 1388.5, unit: 'd' },
      q: { value: 2.0418, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU. Its pole lies within the error of 90° from the Sun's, so the spin direction is unknown */
    rotation: {
      period: { value: 8.1682701, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 52 as DegreesType,
        rightAscensionRate: 0,
        declination: 12 as DegreesType,
        declinationRate: 0,
        primeMeridian: 94 as DegreesType,
        primeMeridianRate: 1057.7515
      }
    },
    radius: { value: 49, unit: 'km' },
    mu: 113460000.0, // Rosetta, Pätzold et al. 2011
    display: {
      color: '#8A8781',
      size: 1
    }
  },
  {
    id: '243-ida',
    name: 'Ida',
    type: 'main-belt asteroid',
    category: 'small asteroid',
    spectralType: 's-type', // Galileo found its moon, Dactyl
    parent: 'sun',
    orbit: {
      a: { value: 2.85969, unit: 'au' },
      e: 0.045755,
      i: 1.137 as DegreesType,
      w: 112.291 as DegreesType,
      om: 324.38 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 4.183909 as Radians,
      period: { value: 1766.4, unit: 'd' },
      q: { value: 2.7288, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU. Backwards against the Sun's spin */
    rotation: {
      period: { value: 4.633632, unit: 'h' },
      retrograde: true,
      iau: {
        pole: 'positive',
        rightAscension: 168.76 as DegreesType,
        rightAscensionRate: 0,
        declination: -87.12 as DegreesType,
        declinationRate: 0,
        primeMeridian: 274.05 as DegreesType,
        primeMeridianRate: 1864.628007
      }
    },
    radius: { value: 15.7, unit: 'km' },
    mu: 2800000.0, // from its moon Dactyl's orbit (Belton et al. 1995), ±14 %
    display: {
      color: '#8E8575',
      size: 1
    }
  },
  {
    id: '951-gaspra',
    name: 'Gaspra',
    type: 'main-belt asteroid',
    category: 'small asteroid',
    spectralType: 's-type', // The first asteroid a spacecraft flew past, Galileo in 1991
    parent: 'sun',
    orbit: {
      a: { value: 2.209421, unit: 'au' },
      e: 0.173562,
      i: 4.103 as DegreesType,
      w: 129.307 as DegreesType,
      om: 253.322 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 2.014811 as Radians,
      period: { value: 1199.5, unit: 'd' },
      q: { value: 1.8259, unit: 'au' }
    },
    /** Sidereal rotation in hours: IAU */
    rotation: {
      period: { value: 7.0420728, unit: 'h' },
      iau: {
        pole: 'positive',
        rightAscension: 9.47 as DegreesType,
        rightAscensionRate: 0,
        declination: 26.7 as DegreesType,
        declinationRate: 0,
        primeMeridian: 83.67 as DegreesType,
        primeMeridianRate: 1226.911485
      }
    },
    radius: { value: 6.1, unit: 'km' },
    display: {
      color: '#93806B',
      size: 1
    }
  },
  {
    id: '2867-steins',
    name: 'Šteins',
    type: 'main-belt asteroid',
    category: 'small asteroid',
    spectralType: 'e-type',
    parent: 'sun',
    orbit: {
      a: { value: 2.362505, unit: 'au' },
      e: 0.146995,
      i: 9.945 as DegreesType,
      w: 250.154 as DegreesType,
      om: 55.642 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 3.113031 as Radians,
      period: { value: 1326.3, unit: 'd' },
      q: { value: 2.0152, unit: 'au' }
    },
    /** Sidereal rotation in hours: Lamy et al. 2008. The IAU's 2015 rate rounds it to 6.05 h. Backwards against the Sun's spin */
    rotation: {
      period: { value: 6.04681, unit: 'h' },
      retrograde: true,
      iau: {
        pole: 'positive',
        rightAscension: 91 as DegreesType,
        rightAscensionRate: 0,
        declination: -62 as DegreesType,
        declinationRate: 0,
        primeMeridian: 321.76 as DegreesType,
        primeMeridianRate: 1428.09917
      }
    },
    radius: { value: 2.65, unit: 'km' },
    display: {
      color: '#A7A5A1',
      size: 1
    }
  },
  {
    id: '486958-arrokoth',
    name: 'Arrokoth',
    type: 'trans-neptunian object',
    category: 'cubewano',
    spectralType: 'other', // Ultra-red; New Horizons flew past it in 2019
    parent: 'sun',
    orbit: {
      a: { value: 44.073713, unit: 'au' },
      e: 0.039717,
      i: 2.448 as DegreesType,
      w: 189.443 as DegreesType,
      om: 159.203 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 4.774426 as Radians,
      period: { value: 106873, unit: 'd' },
      q: { value: 42.3232, unit: 'au' }
    },
    /** Rotation in hours: Buie et al. 2020. Its pole lies within the error of 90° from the Sun's, so the spin direction is unknown */
    rotation: { period: { value: 15.938, unit: 'h' } },
    radius: { value: 9.15, unit: 'km' },
    display: {
      color: '#9A5A3E',
      size: 1
    }
  },
  {
    id: '65803-didymos',
    name: 'Didymos',
    type: 'near-earth asteroid',
    category: 'apollo group',
    spectralType: 's-type', // DART hit its moon, Dimorphos
    parent: 'sun',
    orbit: {
      a: { value: 1.642078, unit: 'au' },
      e: 0.383188,
      i: 3.397 as DegreesType,
      w: 318.886 as DegreesType,
      om: 73.448 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 1.926507 as Radians,
      period: { value: 768.6, unit: 'd' },
      q: { value: 1.0129, unit: 'au' }
    },
    /** Rotation in hours: Pravec et al. 2022. Backwards against the Sun's spin */
    rotation: { period: { value: 2.26, unit: 'h' }, retrograde: true },
    radius: { value: 0.3805, unit: 'km' },
    mu: 35.13, // Naidu et al. 2024: the system, less Dimorphos
    display: {
      color: '#8A8279',
      size: 1
    }
  },
  {
    id: '99942-apophis',
    name: 'Apophis',
    type: 'near-earth asteroid',
    category: 'aten group',
    spectralType: 's-type', // Sq; passes Earth in 2029
    parent: 'sun',
    orbit: {
      a: { value: 0.922342, unit: 'au' },
      e: 0.191393,
      i: 3.331 as DegreesType,
      w: 126.065 as DegreesType,
      om: 204.657 as DegreesType,
      frame: { plane: 'ecliptic' },
      angle: 3.791688 as Radians,
      period: { value: 323.5, unit: 'd' },
      q: { value: 0.7458, unit: 'au' }
    },
    /** Rotation in hours: Apophis tumbles. It precesses every 27.38 h and rotates every 263 h, and its light curve repeats every 30.56 h (Pravec et al. 2014). Backwards against the Sun's spin */
    rotation: {
      period: { value: 30.56, unit: 'h' },
      retrograde: true,
      tumbling: true
    },
    radius: { value: 0.17, unit: 'km' },
    display: {
      color: '#9A9184',
      size: 1
    }
  }
] as const satisfies AsteroidsType;
