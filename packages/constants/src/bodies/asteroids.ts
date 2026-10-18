import { AsteroidsType, DegreesType, Radians } from '@interstellar-tools/types';

/**
 * Represents a collection of well-known asteroids within the solar system simulation.
 *
 * ::: info
 *
 * - Units: `a` in astronomical units (au); `period` in days (d); `radius` in km.
 * - Orbital angles `i`, `w`, and `om` are in degrees.
 * - `display.color` and `display.size` are rendering hints only.
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
      angle: 5.527458 as Radians,
      period: { value: 1325.2, unit: 'd' },
      q: { value: 2.151, unit: 'au' }
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
      angle: 1.553343 as Radians,
      period: { value: 643.2, unit: 'd' },
      q: { value: 1.134, unit: 'au' }
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
      angle: 0.579449 as Radians,
      period: { value: 1684.9, unit: 'd' },
      q: { value: 2.13, unit: 'au' }
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
      angle: 2.656391 as Radians,
      period: { value: 2033.8, unit: 'd' },
      q: { value: 2.788, unit: 'au' }
    },
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
      angle: 0.788889 as Radians,
      period: { value: 1960.9, unit: 'd' },
      q: { value: 2.671, unit: 'au' }
    },
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
      angle: 3.150319 as Radians,
      period: { value: 2045.5, unit: 'd' },
      q: { value: 2.451, unit: 'au' }
    },
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
      angle: 1.520182 as Radians,
      period: { value: 1820.1, unit: 'd' },
      q: { value: 2.515, unit: 'au' }
    },
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
      angle: 2.099631 as Radians,
      period: { value: 2059.6, unit: 'd' },
      q: { value: 2.549, unit: 'au' }
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
      angle: 3.675663 as Radians,
      period: { value: 1977.9, unit: 'd' },
      q: { value: 2.788, unit: 'au' }
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
      angle: 1.74882 as Radians,
      period: { value: 1594.4, unit: 'd' },
      q: { value: 1.986, unit: 'au' }
    },
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
      angle: 1.054179 as Radians,
      period: { value: 1567.6, unit: 'd' },
      q: { value: 2.153, unit: 'au' }
    },
    radius: { value: 136, unit: 'km' },
    display: {
      color: '#bbbbbb',
      size: 1
    }
  }
] as const satisfies AsteroidsType;
