import type {
  AstrosphereInterface,
  DegreesType,
  DisplayAstrosphereInterface
} from '@interstellar-tools/types';

import { paper, sigma } from './sources.js';

const STONE_2005 = paper('Stone et al. 2005', '10.1126/science.1117684');
const BURLAGA_2008 = paper('Burlaga et al. 2008', '10.1038/nature07029');
const BURLAGA_2019 = paper('Burlaga et al. 2019', '10.1038/s41550-019-0920-y');
const MCCOMAS_2015 = paper('McComas et al. 2015', '10.1088/0067-0049/220/2/22');
const REISENFELD_2021 = paper(
  'Reisenfeld et al. 2021',
  '10.3847/1538-4365/abf658'
);

/**
 * The Sun's **heliosphere**, the bubble the solar wind blows into the
 * interstellar medium: the heliopause's distance towards the nose, on the
 * flanks and down the tail, the interstellar wind's direction and speed, and
 * the Voyagers' crossings of its boundaries.
 *
 * Kept apart from {@link STARS}, so an app loads it only when it draws it. It
 * is also the Sun's `observations.astrosphere`; see `STARS` for its sources.
 *
 * @group Observations
 * @example
 * ```ts
 * HELIOSPHERE.astropause?.nose?.value; // 115, in au
 * HELIOSPHERE.crossings?.length; // 4
 * ```
 */
export const HELIOSPHERE: AstrosphereInterface = {
  astropause: {
    nose: {
      value: 115,
      unit: 'au',
      uncertainty: sigma(10),
      provenance: 'derived',
      note: 'The middle of 110 to 120 au, its nearest, just south of the nose',
      source: REISENFELD_2021
    },
    flank: {
      value: 170,
      unit: 'au',
      uncertainty: sigma(15),
      provenance: 'derived',
      note: 'The middle of 160 to 180 au, towards the flanks and poles',
      source: REISENFELD_2021
    },
    tail: {
      value: 350,
      unit: 'au',
      uncertainty: sigma(50),
      limit: 'lower',
      note: 'At least: as far as the technique reaches',
      source: REISENFELD_2021
    }
  },
  /** Opposite McComas et al.'s inflow direction, 75.7°, −5.1°, which is where the wind goes */
  upwind: {
    eclipticLongitude: 255.7 as DegreesType,
    eclipticLatitude: 5.1 as DegreesType
  },
  inflowSpeed: {
    value: 25.4,
    unit: 'km/s',
    note: 'IBEX’s working value, 1000 au out',
    source: MCCOMAS_2015
  },
  /** Where each Voyager was, from JPL Horizons */
  crossings: [
    {
      probeId: 'voyager-1',
      boundary: 'termination shock',
      date: new Date('2004-12-16'),
      distance: { value: 94.01, unit: 'au', source: STONE_2005 },
      direction: {
        eclipticLongitude: 253 as DegreesType,
        eclipticLatitude: 34.71 as DegreesType
      }
    },
    {
      probeId: 'voyager-2',
      boundary: 'termination shock',
      date: new Date('2007-08-31'),
      distance: {
        value: 83.7,
        unit: 'au',
        note: 'Crossed several times, 31 August to 1 September 2007',
        source: BURLAGA_2008
      },
      direction: {
        eclipticLongitude: 288.65 as DegreesType,
        eclipticLatitude: -31.61 as DegreesType
      }
    },
    {
      probeId: 'voyager-1',
      boundary: 'astropause',
      date: new Date('2012-08-25'),
      distance: { value: 121.6, unit: 'au', source: BURLAGA_2019 },
      direction: {
        eclipticLongitude: 254.88 as DegreesType,
        eclipticLatitude: 34.95 as DegreesType
      }
    },
    {
      probeId: 'voyager-2',
      boundary: 'astropause',
      date: new Date('2018-11-05'),
      distance: { value: 119, unit: 'au', source: BURLAGA_2019 },
      direction: {
        eclipticLongitude: 290.08 as DegreesType,
        eclipticLatitude: -36.5 as DegreesType
      }
    }
  ]
};

/**
 * How to **draw the heliosphere**: hidden until a renderer offers to show it,
 * as it has no colour of its own. It is also the Sun's `display.astrosphere`.
 *
 * @group Observations
 */
export const HELIOSPHERE_DISPLAY: DisplayAstrosphereInterface = {
  color: '#5b8fd9',
  opacity: 0.15
};
