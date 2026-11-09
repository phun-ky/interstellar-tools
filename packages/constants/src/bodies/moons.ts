import { DegreesType, MoonsType, Radians } from '@interstellar-tools/types';

/**
 * Represents a dataset of natural satellites (moons) in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` in astronomical units (au), `period` in days (d), `radius` in kilometers (km),
 *   `mu` in m³/s².
 * - `a`, `e`, `i`, `w` and `om` are JPL's mean elements, in the plane JPL gives them in, `frame`:
 *   the ecliptic for the Moon and the irregular moons Himalia, Pasiphae, Nereid and Halimede, a
 *   Laplace plane for Mars's, Jupiter's and Saturn's regular moons, and the planet's equator for
 *   Uranus's, Neptune's and Pluto's, with each plane's pole. Dysnomia's are Holler et al. 2021's,
 *   against the ICRF equator, and Dimorphos's from JPL Horizons, against Didymos's equator, before
 *   DART hit it.
 * - `orbit.angle` is the true anomaly at J2000 that, with `w`, puts the moon where JPL Horizons has
 *   it at J2000, within its plane. For a near-circular orbit the periapsis is barely defined, so
 *   only `w + angle` matters. Irregular moons are strongly perturbed by the Sun, so their elements
 *   describe J2000 only.
 * - Moons orbit a planet, a dwarf planet, or an asteroid: Dimorphos orbits Didymos.
 * - `mu` is the moon's G·M from JPL's satellite physical parameters, where JPL publishes one.
 * - `rotation.period` is the sidereal rotation in days: 360° over the IAU's rotation rate
 *   (Archinal et al. 2018), or a light curve's period for Himalia, Nereid and Pluto's small moons,
 *   which spin chaotically. Most moons keep one face to their planet, `synchronous: true`. Hyperion
 *   tumbles, and Pasiphae's, Halimede's and Dysnomia's spins aren't known, so they have none.
 * - Colors are hex strings used only for visual representation.
 *
 * - Sources: compiled from public references, mainly NASA, NASA JPL, ESA and Wikipedia. See [data sources](https://github.com/phun-ky/interstellar-tools/blob/main/NOTICE.md#data).
 * :::
 *
 * {@include ../../../../docs/partials/moons.md}
 *
 * @see {@link MoonsType}.
 *
 * **Example item in dataset:**
 *
 * {@includeCode ../bodies/moons.ts#datasetMoons}
 * @group Datasets
 * @example
 * ```ts
 * console.log(MOONS[0].name); // "Moon"
 * ```
 */
export const MOONS: MoonsType = [
  // **Earth**
  // #region datasetMoons
  {
    id: 'moon',
    name: 'Moon',
    category: 'natural satellite',
    parent: 'earth',
    orbit: {
      /** Semi-major axis in AU */
      a: { value: 0.00257, unit: 'au' },
      /** Eccentricity (0 = circular orbit, 1 = parabolic trajectory) */
      e: 0.0549,
      /** Orbital period in days */
      period: { value: 27.322, unit: 'd' },
      /** Initial angle in orbit at J2000 */
      angle: 2.4345 as Radians,
      i: 5.16 as DegreesType,
      w: 318.15 as DegreesType,
      om: 125.08 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: the IAU's 2009 rate, 13.17635815° a day */
    rotation: { period: { value: 27.32166171, unit: 'd' }, synchronous: true },
    /** Radius in km */
    radius: { value: 1737.4, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 1737.4, unit: 'km' },
      polarRadius: { value: 1737.4, unit: 'km' }
    },
    mu: 4.902800118e12,
    display: {
      /** Visual representation color */
      color: '#BFBFBF' // Light gray (realistic lunar appearance)
    }
  },
  // #endregion datasetMoons
  // **Mars**
  {
    id: 'phobos',
    name: 'Phobos',
    category: 'natural satellite',
    parent: 'mars',
    orbit: {
      a: { value: 0.000062668, unit: 'au' },
      e: 0.0151,
      period: { value: 0.3189, unit: 'd' },
      angle: 3.307969 as Radians,
      i: 1.1 as DegreesType,
      w: 216.3 as DegreesType,
      om: 169.2 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 317.7 as DegreesType,
          declination: 52.9 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.3189101044, unit: 'd' }, synchronous: true },
    radius: { value: 11.08, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 13.0, unit: 'km' },
      polarRadius: { value: 9.1, unit: 'km' },
      alongOrbitRadius: { value: 11.4, unit: 'km' }
    },
    mu: 7.087e5,
    display: {
      color: '#888888' // Darker gray (rocky, low albedo)
    }
  },
  {
    id: 'deimos',
    name: 'Deimos',
    category: 'natural satellite',
    parent: 'mars',
    orbit: {
      a: { value: 0.0001568, unit: 'au' },
      e: 0.0002,
      period: { value: 1.2624, unit: 'd' },
      angle: 3.5778 as Radians,
      i: 1.8 as DegreesType,
      w: 0 as DegreesType,
      om: 54.3 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 316.6 as DegreesType,
          declination: 53.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.262440789, unit: 'd' }, synchronous: true },
    radius: { value: 6.2, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 7.8, unit: 'km' },
      polarRadius: { value: 5.1, unit: 'km' },
      alongOrbitRadius: { value: 6.0, unit: 'km' }
    },
    mu: 9.62e4,
    display: {
      color: '#A0A0A0' // Lighter gray (less cratered surface)
    }
  },

  // **Jupiter (Galilean Moons + Minor Moons)**
  {
    id: 'io',
    name: 'Io',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.00282, unit: 'au' },
      e: 0.0041,
      period: { value: 1.769, unit: 'd' },
      angle: 5.7713 as Radians,
      i: 0 as DegreesType,
      w: 49.1 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.1 as DegreesType,
          declination: 64.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.7691378, unit: 'd' }, synchronous: true },
    radius: { value: 1821.49, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 1829.4, unit: 'km' },
      polarRadius: { value: 1815.7, unit: 'km' },
      alongOrbitRadius: { value: 1819.4, unit: 'km' }
    },
    mu: 5.95991547e12,
    display: {
      color: '#FF8C00' // Volcanic orange (due to sulphur deposits)
    }
  },
  {
    id: 'europa',
    name: 'Europa',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.00448, unit: 'au' },
      e: 0.0094,
      period: { value: 3.551, unit: 'd' },
      angle: 6.02377 as Radians,
      i: 0.5 as DegreesType,
      w: 45 as DegreesType,
      om: 184 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.1 as DegreesType,
          declination: 64.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 3.551181079, unit: 'd' }, synchronous: true },
    radius: { value: 1560.8, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 1562.6, unit: 'km' },
      polarRadius: { value: 1559.5, unit: 'km' },
      alongOrbitRadius: { value: 1560.3, unit: 'km' }
    },
    mu: 3.2027121e12,
    display: {
      color: '#E6E6E6' // Icy white (smooth ice-covered surface)
    }
  },
  {
    id: 'ganymede',
    name: 'Ganymede',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.00715, unit: 'au' },
      e: 0.0013,
      period: { value: 7.155, unit: 'd' },
      angle: 5.6673 as Radians,
      i: 0.2 as DegreesType,
      w: 198.3 as DegreesType,
      om: 58.5 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.2 as DegreesType,
          declination: 64.6 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 7.15455312, unit: 'd' }, synchronous: true },
    radius: { value: 2631.2, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 2631.2, unit: 'km' },
      polarRadius: { value: 2631.2, unit: 'km' }
    },
    mu: 9.88783275e12,
    display: {
      color: '#8B4513' // Brownish (mixture of ice and rock)
    }
  },
  {
    id: 'callisto',
    name: 'Callisto',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.01258, unit: 'au' },
      e: 0.0074,
      period: { value: 16.689, unit: 'd' },
      angle: 1.5402 as Radians,
      i: 0.3 as DegreesType,
      w: 43.8 as DegreesType,
      om: 309.1 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.7 as DegreesType,
          declination: 64.8 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 16.68901797, unit: 'd' }, synchronous: true },
    radius: { value: 2410.3, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 2410.3, unit: 'km' },
      polarRadius: { value: 2410.3, unit: 'km' }
    },
    mu: 7.1792834e12,
    display: {
      color: '#696969' // Dark gray (heavily cratered)
    }
  },
  {
    id: 'amalthea',
    name: 'Amalthea',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.00121258, unit: 'au' },
      e: 0.003,
      period: { value: 0.498, unit: 'd' },
      angle: 5.4164 as Radians,
      i: 0.4 as DegreesType,
      w: 180.1 as DegreesType,
      om: 282.9 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.1 as DegreesType,
          declination: 64.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.4981792545, unit: 'd' }, synchronous: true },
    radius: { value: 83, unit: 'km' },
    mu: 1.6456e8,
    display: {
      color: '#A0522D'
    }
  },
  {
    id: 'himalia',
    name: 'Himalia',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.076465, unit: 'au' },
      e: 0.16,
      period: { value: 250.2, unit: 'd' },
      angle: 1.6994 as Radians,
      i: 28.4 as DegreesType,
      w: 321.1 as DegreesType,
      om: 64.2 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: 7.7819 h, from its light curve (Pilcher et al. 2012); its direction isn't known */
    rotation: { period: { value: 0.324246, unit: 'd' } },
    radius: { value: 85, unit: 'km' },
    mu: 1.5155e8, // poorly constrained (±38 %)
    display: {
      color: '#A9A9A9' // Neutral gray (small irregular moon)
    }
  },
  {
    id: 'metis',
    name: 'Metis',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.000855627, unit: 'au' },
      e: 0.0002,
      period: { value: 0.295, unit: 'd' },
      angle: 2.8973 as Radians,
      i: 0 as DegreesType,
      w: 0 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.1 as DegreesType,
          declination: 64.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.2947787969, unit: 'd' }, synchronous: true },
    radius: { value: 21, unit: 'km' },
    mu: 2.5e6, // estimate, likely from an assumed density of 0.9 g/cm³
    display: {
      color: '#CD853F'
    }
  },
  {
    id: 'thebe',
    name: 'Thebe',
    category: 'natural satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.00148331, unit: 'au' },
      e: 0.0176,
      period: { value: 0.675, unit: 'd' },
      angle: 3.183597 as Radians,
      i: 1.1 as DegreesType,
      w: 26.6 as DegreesType,
      om: 340.4 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 268.1 as DegreesType,
          declination: 64.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 0.6745357381, unit: 'd' }, synchronous: true },
    radius: { value: 49, unit: 'km' },
    mu: 3.015e7, // estimate, likely from an assumed density of 0.9 g/cm³
    display: {
      color: '#B87333'
    }
  },
  {
    id: 'pasiphae',
    name: 'Pasiphae',
    category: 'irregular satellite',
    parent: 'jupiter',
    orbit: {
      a: { value: 0.157, unit: 'au' },
      e: 0.407,
      period: { value: 735, unit: 'd' },
      retrograde: true,
      angle: 4.1307 as Radians,
      i: 148.3 as DegreesType,
      w: 172.8 as DegreesType,
      om: 315.7 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    radius: { value: 30, unit: 'km' },
    display: {
      color: '#8B0000'
    }
  },

  // **Saturn (Large & Small Moons)**
  {
    id: 'titan',
    name: 'Titan',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00817, unit: 'au' },
      e: 0.0288,
      period: { value: 15.945, unit: 'd' },
      angle: 3.7651 as Radians,
      i: 0.3 as DegreesType,
      w: 78.3 as DegreesType,
      om: 78.6 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 36.4 as DegreesType,
          declination: 84.0 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 15.94544758, unit: 'd' }, synchronous: true },
    radius: { value: 2575, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 2575.15, unit: 'km' },
      polarRadius: { value: 2574.47, unit: 'km' },
      alongOrbitRadius: { value: 2574.78, unit: 'km' }
    },
    mu: 8.9781371e12,
    display: {
      color: '#D4A017' // Gold/amber (thick haze-rich atmosphere)
    }
  },
  {
    id: 'enceladus',
    name: 'Enceladus',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00159, unit: 'au' },
      e: 0.0047,
      period: { value: 1.37, unit: 'd' },
      angle: 1.0989 as Radians,
      i: 0 as DegreesType,
      w: 119.5 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.6 as DegreesType,
          declination: 83.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.370218084, unit: 'd' }, synchronous: true },
    radius: { value: 252.1, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 256.6, unit: 'km' },
      polarRadius: { value: 248.3, unit: 'km' },
      alongOrbitRadius: { value: 251.4, unit: 'km' }
    },
    mu: 7.21037e9,
    display: {
      color: '#F0FFFF' // Ice-blue white (brightest moon in the Solar System)
    }
  },
  {
    id: 'rhea',
    name: 'Rhea',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00352411, unit: 'au' },
      e: 0.0012,
      period: { value: 4.518, unit: 'd' },
      angle: 4.0861 as Radians,
      i: 0.3 as DegreesType,
      w: 44.3 as DegreesType,
      om: 133.7 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.6 as DegreesType,
          declination: 83.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 4.517502623, unit: 'd' }, synchronous: true },
    radius: { value: 764, unit: 'km' },
    mu: 1.5394175e11,
    display: {
      color: '#C0C0C0' // Silvery gray (icy and cratered)
    }
  },
  {
    id: 'iapetus',
    name: 'Iapetus',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.0238, unit: 'au' },
      e: 0.0283,
      period: { value: 79.33, unit: 'd' },
      angle: 3.8026 as Radians,
      i: 7.6 as DegreesType,
      w: 254.5 as DegreesType,
      om: 86.5 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 288.7 as DegreesType,
          declination: 78.9 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 79.33084957, unit: 'd' }, synchronous: true },
    radius: { value: 735, unit: 'km' },
    mu: 1.2051511e11,
    display: {
      color: '#2F4F4F' // Dark gray-green (two-tone color due to one dark side)
    }
  },
  {
    id: 'hyperion',
    name: 'Hyperion',
    category: 'irregular satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00990322, unit: 'au' },
      e: 0.105,
      period: { value: 21.3, unit: 'd' },
      angle: 0.2053 as Radians,
      i: 0.6 as DegreesType,
      w: 214 as DegreesType,
      om: 87.1 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.2 as DegreesType,
          declination: 83.6 as DegreesType
        }
      }
    },
    radius: { value: 135, unit: 'km' },
    mu: 3.7049e8,
    display: {
      color: '#CDAA7D'
    }
  },
  {
    id: 'phoebe',
    name: 'Phoebe',
    category: 'retrograde satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.0865, unit: 'au' },
      e: 0.1634,
      period: { value: 550, unit: 'd' },
      retrograde: true,
      angle: 2.1829 as Radians,
      i: 175.2 as DegreesType,
      w: 240.3 as DegreesType,
      om: 192.7 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 276.0 as DegreesType,
          declination: 67.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: IAU, 9.274 h, not synchronous */
    rotation: { period: { value: 0.3864157683, unit: 'd' } },
    radius: { value: 106, unit: 'km' },
    mu: 5.5479e8,
    display: {
      color: '#483D8B'
    }
  },
  {
    id: 'mimas',
    name: 'Mimas',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00124333, unit: 'au' },
      e: 0.02,
      period: { value: 0.942422, unit: 'd' },
      angle: 5.642 as Radians,
      i: 1.6 as DegreesType,
      w: 160.4 as DegreesType,
      om: 66.2 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.6 as DegreesType,
          declination: 83.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: IAU */
    rotation: { period: { value: 0.9424218102, unit: 'd' }, synchronous: true },
    radius: { value: 198.2, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 207.8, unit: 'km' },
      polarRadius: { value: 190.6, unit: 'km' },
      alongOrbitRadius: { value: 196.7, unit: 'km' }
    },
    mu: 2.50349e9,
    display: {
      color: '#C9C9C6' // Grey, with the great crater Herschel
    }
  },
  {
    id: 'tethys',
    name: 'Tethys',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00197195, unit: 'au' },
      e: 0.001,
      period: { value: 1.887802, unit: 'd' },
      angle: 5.2137 as Radians,
      i: 1.1 as DegreesType,
      w: 335.3 as DegreesType,
      om: 273 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.6 as DegreesType,
          declination: 83.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: IAU */
    rotation: { period: { value: 1.887802561, unit: 'd' }, synchronous: true },
    radius: { value: 531.1, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 538.4, unit: 'km' },
      polarRadius: { value: 526.3, unit: 'km' },
      alongOrbitRadius: { value: 528.3, unit: 'km' }
    },
    mu: 4.121353e10,
    display: {
      color: '#E8E8E6' // Bright icy white
    }
  },
  {
    id: 'dione',
    name: 'Dione',
    category: 'natural satellite',
    parent: 'saturn',
    orbit: {
      a: { value: 0.00252477, unit: 'au' },
      e: 0.002,
      period: { value: 2.736916, unit: 'd' },
      angle: 1.0601 as Radians,
      i: 0 as DegreesType,
      w: 116 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'laplace',
        pole: {
          rightAscension: 40.6 as DegreesType,
          declination: 83.5 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: IAU */
    rotation: { period: { value: 2.736915553, unit: 'd' }, synchronous: true },
    radius: { value: 561.4, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 563.4, unit: 'km' },
      polarRadius: { value: 559.6, unit: 'km' },
      alongOrbitRadius: { value: 561.3, unit: 'km' }
    },
    mu: 7.311607e10,
    display: {
      color: '#D5D3CF' // Icy grey, with bright wispy cliffs
    }
  },

  // **Uranus (Major Moons)**
  {
    id: 'titania',
    name: 'Titania',
    category: 'natural satellite',
    parent: 'uranus',
    orbit: {
      a: { value: 0.00292, unit: 'au' },
      e: 0.0011,
      period: { value: 8.706, unit: 'd' },
      angle: 1.1906 as Radians,
      i: 0.1 as DegreesType,
      w: 184 as DegreesType,
      om: 29.5 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 77.311 as DegreesType,
          declination: 15.175 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 8.705865458, unit: 'd' }, synchronous: true },
    radius: { value: 788, unit: 'km' },
    mu: 2.269e11,
    display: {
      color: '#8B8886' // Gray-brown (heavily cratered with bright ice patches)
    }
  },
  {
    id: 'oberon',
    name: 'Oberon',
    category: 'natural satellite',
    parent: 'uranus',
    orbit: {
      a: { value: 0.00390053, unit: 'au' },
      e: 0.0014,
      period: { value: 13.46, unit: 'd' },
      angle: 2.508 as Radians,
      i: 0.1 as DegreesType,
      w: 132.2 as DegreesType,
      om: 76.8 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 77.311 as DegreesType,
          declination: 15.175 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 13.46323198, unit: 'd' }, synchronous: true },
    radius: { value: 761, unit: 'km' },
    mu: 2.053e11,
    display: {
      color: '#6E6E6E' // Dark gray (icy and rocky)
    }
  },
  {
    id: 'miranda',
    name: 'Miranda',
    category: 'natural satellite',
    parent: 'uranus',
    orbit: {
      a: { value: 0.000867967, unit: 'au' },
      e: 0.0013,
      period: { value: 1.41, unit: 'd' },
      angle: 1.2569 as Radians,
      i: 4.4 as DegreesType,
      w: 154.8 as DegreesType,
      om: 100.9 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 77.311 as DegreesType,
          declination: 15.175 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.413479233, unit: 'd' }, synchronous: true },
    radius: { value: 235, unit: 'km' },
    mu: 4.3e9,
    display: {
      color: '#CCCCCC' // Light gray (fractured terrain)
    }
  },
  {
    id: 'ariel',
    name: 'Ariel',
    category: 'natural satellite',
    parent: 'uranus',
    orbit: {
      a: { value: 0.00127628, unit: 'au' },
      e: 0.0012,
      period: { value: 2.52, unit: 'd' },
      angle: 3.3767 as Radians,
      i: 0 as DegreesType,
      w: 9.6 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 77.311 as DegreesType,
          declination: 15.175 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 2.520378872, unit: 'd' }, synchronous: true },
    radius: { value: 578, unit: 'km' },
    mu: 8.35e10,
    display: {
      color: '#A9A9A9'
    }
  },
  {
    id: 'umbriel',
    name: 'Umbriel',
    category: 'natural satellite',
    parent: 'uranus',
    orbit: {
      a: { value: 0.00177801, unit: 'au' },
      e: 0.0039,
      period: { value: 4.14, unit: 'd' },
      angle: 4.4082 as Radians,
      i: 0.1 as DegreesType,
      w: 183.4 as DegreesType,
      om: 174.8 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 77.311 as DegreesType,
          declination: 15.175 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 4.144176246, unit: 'd' }, synchronous: true },
    radius: { value: 584, unit: 'km' },
    mu: 8.51e10,
    display: {
      color: '#5F9EA0'
    }
  },

  // **Neptune (Major Moons)**
  {
    id: 'triton',
    name: 'Triton',
    category: 'retrograde satellite',
    parent: 'neptune',
    orbit: {
      a: { value: 0.002375, unit: 'au' },
      e: 0.000016,
      period: { value: 5.87685, unit: 'd' },
      retrograde: true,
      angle: 1.0196 as Radians,
      i: 157.3 as DegreesType,
      w: 0 as DegreesType,
      om: 177.7 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 299.334 as DegreesType,
          declination: 42.95 as DegreesType
        }
      } // Consider updating based on actual epoch
    },
    /** Sidereal rotation in days: IAU, synchronous on its backwards orbit */
    rotation: {
      period: { value: 5.876854078, unit: 'd' },
      retrograde: true,
      synchronous: true
    },
    radius: { value: 1352.6, unit: 'km' },
    mu: 1.42849546e12,
    display: {
      color: '#C2A17C' // More accurate pale pinkish-brown hue
    }
  },
  {
    id: 'nereid',
    name: 'Nereid',
    category: 'natural satellite',
    parent: 'neptune',
    orbit: {
      a: { value: 0.0369, unit: 'au' },
      e: 0.75,
      period: { value: 360.14, unit: 'd' },
      angle: 3.278379 as Radians,
      i: 5.1 as DegreesType,
      w: 296.8 as DegreesType,
      om: 319.5 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    /** Sidereal rotation in days: 11.594 h, from its light curve (Kiss et al. 2016); its direction isn't known */
    rotation: { period: { value: 0.483083, unit: 'd' } },
    radius: { value: 170, unit: 'km' },
    display: {
      color: '#87CEFA' // Light blue (possibly icy)
    }
  },
  {
    id: 'proteus',
    name: 'Proteus',
    category: 'natural satellite',
    parent: 'neptune',
    orbit: {
      a: { value: 0.000786107, unit: 'au' },
      e: 0.0005,
      period: { value: 1.12, unit: 'd' },
      angle: 4.9109 as Radians,
      i: 0.6 as DegreesType,
      w: 357.2 as DegreesType,
      om: 355.5 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 299.334 as DegreesType,
          declination: 42.95 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days */
    rotation: { period: { value: 1.122315482, unit: 'd' }, synchronous: true },
    radius: { value: 210, unit: 'km' },
    mu: 2.58342e9, // poorly constrained (±94 %)
    display: {
      color: '#708090'
    }
  },
  {
    id: 'halimede',
    name: 'Halimede',
    category: 'irregular satellite',
    parent: 'neptune',
    orbit: {
      a: { value: 0.110901, unit: 'au' },
      e: 0.521,
      period: { value: 1879, unit: 'd' }, // Retrograde orbit (i ≈ 120° to the ecliptic)
      retrograde: true,
      angle: 3.5101 as Radians,
      i: 119.6 as DegreesType,
      w: 157.9 as DegreesType,
      om: 198.5 as DegreesType,
      frame: { plane: 'ecliptic' }
    },
    radius: { value: 62, unit: 'km' },
    display: {
      color: '#A9A9A9'
    }
  },

  // **Pluto**: Charon's elements are Plutocentric, the small moons' are around
  // the Pluto–Charon barycenter (Brozović & Jacobson 2024), in Charon's orbit
  // plane. The small moons' `a` and `e` are the paper's Table 11, which matches
  // their period; the JPL page's come from its Table 10. Styx, Nix and Kerberos
  // move on circles, so their `angle` is measured from the plane's node. Their spins are chaotic (Showalter & Hamilton 2015), so
  // they have a light curve's period and no direction (Weaver et al. 2016).
  {
    id: 'charon',
    name: 'Charon',
    category: 'natural satellite',
    parent: 'pluto',
    orbit: {
      a: { value: 0.000131018, unit: 'au' },
      e: 0,
      period: { value: 6.387222, unit: 'd' },
      angle: 5.3075 as Radians,
      i: 0 as DegreesType,
      w: 0 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 132.993 as DegreesType,
          declination: -6.163 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: IAU. Pluto and Charon face each other */
    rotation: { period: { value: 6.387222999, unit: 'd' }, synchronous: true },
    radius: { value: 606, unit: 'km' },
    ellipsoid: {
      equatorialRadius: { value: 606, unit: 'km' },
      polarRadius: { value: 606, unit: 'km' }
    },
    mu: 1.061e11,
    display: {
      color: '#9A9590' // Grey, with a reddish north pole
    }
  },
  {
    id: 'styx',
    name: 'Styx',
    category: 'natural satellite',
    parent: 'pluto',
    orbit: {
      a: { value: 0.000283493, unit: 'au' },
      e: 0,
      period: { value: 20.16, unit: 'd' },
      angle: 3.3313 as Radians,
      i: 0 as DegreesType,
      w: 0 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 132.993 as DegreesType,
          declination: -6.163 as DegreesType
        }
      }
    },
    /** Rotation in days: a light curve's, 3.24 d */
    rotation: { period: { value: 3.24, unit: 'd' } },
    radius: { value: 5.2, unit: 'km' },
    display: {
      color: '#D4D4D2'
    }
  },
  {
    id: 'nix',
    name: 'Nix',
    category: 'natural satellite',
    parent: 'pluto',
    orbit: {
      a: { value: 0.000325466, unit: 'au' },
      e: 0,
      period: { value: 24.85, unit: 'd' },
      angle: 1.6034 as Radians,
      i: 0 as DegreesType,
      w: 0 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 132.993 as DegreesType,
          declination: -6.163 as DegreesType
        }
      }
    },
    /** Rotation in days: a light curve's, 43.9 h */
    rotation: { period: { value: 1.829, unit: 'd' } },
    radius: { value: 18, unit: 'km' },
    mu: 1.5e8,
    display: {
      color: '#D2CFCB'
    }
  },
  {
    id: 'kerberos',
    name: 'Kerberos',
    category: 'natural satellite',
    parent: 'pluto',
    orbit: {
      a: { value: 0.000386028, unit: 'au' },
      e: 0,
      period: { value: 32.17, unit: 'd' },
      angle: 5.4723 as Radians,
      i: 0.4 as DegreesType,
      w: 0 as DegreesType,
      om: 314.3 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 132.993 as DegreesType,
          declination: -6.163 as DegreesType
        }
      }
    },
    /** Rotation in days: a light curve's, 5.31 d */
    rotation: { period: { value: 5.31, unit: 'd' } },
    radius: { value: 6, unit: 'km' },
    display: {
      color: '#CCCCCA'
    }
  },
  {
    id: 'hydra',
    name: 'Hydra',
    category: 'natural satellite',
    parent: 'pluto',
    orbit: {
      a: { value: 0.00043262, unit: 'au' },
      e: 0.006,
      period: { value: 38.2, unit: 'd' },
      angle: 5.9181 as Radians,
      i: 0.3 as DegreesType,
      w: 139.3 as DegreesType,
      om: 114.3 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 132.993 as DegreesType,
          declination: -6.163 as DegreesType
        }
      }
    },
    /** Rotation in days: a light curve's, 10.3 h */
    rotation: { period: { value: 0.4295, unit: 'd' } },
    radius: { value: 18.5, unit: 'km' },
    mu: 2.01e8,
    display: {
      color: '#E4E4E2'
    }
  },

  // **Eris**
  {
    id: 'dysnomia',
    name: 'Dysnomia',
    category: 'natural satellite',
    parent: 'eris',
    orbit: {
      a: { value: 0.000249155, unit: 'au' },
      e: 0.0062,
      period: { value: 15.785899, unit: 'd' },
      angle: 1.9488 as Radians,
      i: 45.49 as DegreesType,
      w: 180.8 as DegreesType,
      om: 126.17 as DegreesType,
      frame: { plane: 'equator' }
    },
    radius: { value: 307.5, unit: 'km' },
    display: {
      color: '#4A4542' // Very dark
    }
  },

  // **Didymos**: Dimorphos's orbit before DART hit it in 2022 (Naidu et al. 2024), the
  // one at J2000. It's circular, so `angle` is its argument of latitude at J2000, from
  // JPL's ephemeris back to 2000. DART shortened its period to 11.367 h
  {
    id: 'dimorphos',
    name: 'Dimorphos',
    category: 'natural satellite',
    parent: '65803-didymos',
    orbit: {
      a: { value: 7.948e-9, unit: 'au' },
      e: 0,
      period: { value: 0.4967289, unit: 'd' },
      angle: 4.4223 as Radians,
      i: 0 as DegreesType,
      w: 0 as DegreesType,
      om: 0 as DegreesType,
      frame: {
        plane: 'parent-equator',
        pole: {
          rightAscension: 69.7 as DegreesType,
          declination: -72.7 as DegreesType
        }
      }
    },
    /** Sidereal rotation in days: it keeps one face to Didymos (Naidu et al. 2024) */
    rotation: { period: { value: 0.4967289, unit: 'd' }, synchronous: true },
    radius: { value: 0.0755, unit: 'km' },
    mu: 0.287, // Daly et al. 2023, from an assumed density
    display: {
      color: '#8A8279'
    }
  }
] as const satisfies MoonsType;
