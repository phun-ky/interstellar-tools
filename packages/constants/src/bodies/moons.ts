import { MoonsType, Radians } from '@interstellar-tools/types';

/**
 * Represents a dataset of natural satellites (moons) in the solar system.
 *
 *
 * ::: info
 *
 * - Units: `a` in astronomical units (au), `period` in days (d), `radius` in kilometers (km),
 *   `mu` in m³/s².
 * - `a` and `e` are JPL's mean elements; `orbit.angle` is the true anomaly at J2000, from the
 *   mean anomaly in JPL Horizons' osculating elements at J2000, converted with this dataset's `e`.
 *   For near-circular orbits (e < 0.001) it is close to the mean anomaly, since the periapsis
 *   is barely defined. Irregular moons are strongly perturbed by the Sun, so their elements
 *   describe J2000 only.
 * - `mu` is the moon's G·M from JPL's satellite physical parameters, where JPL publishes one.
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
      angle: 2.41 as Radians
    },
    /** Radius in km */
    radius: { value: 1737.4, unit: 'km' },
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
      angle: 3.307969 as Radians
    },
    radius: { value: 11, unit: 'km' },
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
      angle: 0.088942 as Radians
    },
    radius: { value: 6, unit: 'km' },
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
      angle: 5.846065 as Radians
    },
    radius: { value: 1821, unit: 'km' },
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
      angle: 6.02377 as Radians
    },
    radius: { value: 1560, unit: 'km' },
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
      angle: 4.832832 as Radians
    },
    radius: { value: 2634, unit: 'km' },
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
      angle: 1.500362 as Radians
    },
    radius: { value: 2410, unit: 'km' },
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
      angle: 5.866533 as Radians
    },
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
      angle: 1.686531 as Radians
    },
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
      angle: 6.248627 as Radians
    },
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
      angle: 3.183597 as Radians
    },
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
      angle: 4.08832 as Radians
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
      angle: 2.868371 as Radians
    },
    radius: { value: 2575, unit: 'km' },
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
      angle: 0.122504 as Radians
    },
    radius: { value: 252, unit: 'km' },
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
      angle: 3.610039 as Radians
    },
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
      angle: 3.604813 as Radians
    },
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
      angle: 1.437895 as Radians
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
      angle: 1.330749 as Radians
    },
    radius: { value: 106, unit: 'km' },
    mu: 5.5479e8,
    display: {
      color: '#483D8B'
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
      angle: 1.300938 as Radians
    },
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
      angle: 1.634613 as Radians
    },
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
      angle: 1.085483 as Radians
    },
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
      angle: 2.667861 as Radians
    },
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
      angle: 4.725942 as Radians
    },
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
      angle: 5.99451 as Radians // Consider updating based on actual epoch
    },
    radius: { value: 1353.4, unit: 'km' },
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
      angle: 3.278379 as Radians
    },
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
      angle: 4.949202 as Radians
    },
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
      angle: 3.476227 as Radians
    },
    radius: { value: 62, unit: 'km' },
    display: {
      color: '#A9A9A9'
    }
  }
] as const satisfies MoonsType;
