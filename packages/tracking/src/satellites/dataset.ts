import type { SatelliteRecordInterface } from '@interstellar-tools/types';

/**
 * A small **snapshot of well-known satellites**, with their elements as OMM
 * records from CelesTrak, dated 4 November 2026. Examples, tests and demos
 * work with it without the network.
 *
 * Twelve satellites across the orbit regimes, so both SGP4 and SDP4 are
 * exercised:
 *
 * - **Low Earth orbit**: the ISS, Tiangong, Hubble, a Starlink, Landsat 9,
 *   NOAA-20 and Envisat, a large defunct satellite.
 * - **Medium Earth orbit**: a GPS and a Galileo navigation satellite.
 * - **Geostationary**: the weather satellites GOES-19 and Meteosat-11.
 * - **Highly elliptical**: Molniya 1-29, a 12-hour Molniya orbit.
 *
 * ::: warning The elements go stale within days
 *
 * SGP4 positions from elements a few days old are off by kilometres, more for
 * low orbits, and a manoeuvre or reboost changes the orbit outright. This
 * snapshot is for examples, not for tracking: for live data, fetch fresh
 * elements from CelesTrak, for example
 * `https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=json`, and
 * follow its usage policy: no more than once every 2 hours.
 *
 * :::
 *
 * ::: info Notes
 *
 * - Each entry's epoch is in `omm.EPOCH`.
 * - Data from [CelesTrak](https://celestrak.org/), from the US Space Force's
 *   public catalogue.
 *
 * :::
 *
 * @group Satellites
 *
 * @example
 * ```ts
 * const hubble = SATELLITES.find(({ id }) => id === 'hubble');
 * const elements = parseOmm(hubble.omm);
 *
 * subSatellitePoint(elements, elements.epoch); // where Hubble was, at the epoch
 * ```
 *
 * @see {@link parseOmm}
 * @see https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak's GP data formats and usage
 */
export const SATELLITES: readonly SatelliteRecordInterface[] = [
  {
    id: 'iss',
    name: 'International Space Station',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'ISS (ZARYA)',
      OBJECT_ID: '1998-067A',
      EPOCH: '2026-11-04T21:15:15.204960',
      MEAN_MOTION: 15.49180468,
      ECCENTRICITY: 0.00072122,
      INCLINATION: 51.6327,
      RA_OF_ASC_NODE: 323.8448,
      ARG_OF_PERICENTER: 348.649,
      MEAN_ANOMALY: 11.4335,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 25544,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 59356,
      BSTAR: 0.00010456704,
      MEAN_MOTION_DOT: 5.352e-5,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'tiangong',
    name: 'Tiangong space station',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'CSS (TIANHE)',
      OBJECT_ID: '2021-035A',
      EPOCH: '2026-11-04T21:46:39.576864',
      MEAN_MOTION: 15.61399302,
      ECCENTRICITY: 0.00044949,
      INCLINATION: 41.4685,
      RA_OF_ASC_NODE: 186.988,
      ARG_OF_PERICENTER: 260.0378,
      MEAN_ANOMALY: 99.9954,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 48274,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 31514,
      BSTAR: 0.00023141307,
      MEAN_MOTION_DOT: 0.00020029,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'hubble',
    name: 'Hubble Space Telescope',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'HST',
      OBJECT_ID: '1990-037B',
      EPOCH: '2026-11-04T21:36:20.531232',
      MEAN_MOTION: 15.32175786,
      ECCENTRICITY: 0.00016831,
      INCLINATION: 28.4724,
      RA_OF_ASC_NODE: 197.8091,
      ARG_OF_PERICENTER: 284.115,
      MEAN_ANOMALY: 75.9259,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 20580,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 81016,
      BSTAR: 0.0001506489,
      MEAN_MOTION_DOT: 5.053e-5,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'starlink-32000',
    name: 'Starlink 32000',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'STARLINK-32000',
      OBJECT_ID: '2024-132M',
      EPOCH: '2026-11-04T21:32:54.892320',
      MEAN_MOTION: 15.3170135,
      ECCENTRICITY: 0.00010143,
      INCLINATION: 53.1601,
      RA_OF_ASC_NODE: 14.825,
      ARG_OF_PERICENTER: 85.7246,
      MEAN_ANOMALY: 274.3871,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 60289,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 12836,
      BSTAR: 4.2618704e-5,
      MEAN_MOTION_DOT: 9.58e-6,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'landsat-9',
    name: 'Landsat 9',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'LANDSAT 9',
      OBJECT_ID: '2021-088A',
      EPOCH: '2026-11-04T18:19:32.614752',
      MEAN_MOTION: 14.57105159,
      ECCENTRICITY: 0.00011796,
      INCLINATION: 98.214,
      RA_OF_ASC_NODE: 17.1253,
      ARG_OF_PERICENTER: 85.399,
      MEAN_ANOMALY: 274.7343,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 49260,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 27147,
      BSTAR: 5.6028793e-5,
      MEAN_MOTION_DOT: 2.07e-6,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'noaa-20',
    name: 'NOAA-20',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'NOAA 20 (JPSS-1)',
      OBJECT_ID: '2017-073A',
      EPOCH: '2026-11-04T21:39:33.503040',
      MEAN_MOTION: 14.1953488,
      ECCENTRICITY: 7.937e-5,
      INCLINATION: 98.7908,
      RA_OF_ASC_NODE: 247.1807,
      ARG_OF_PERICENTER: 137.8448,
      MEAN_ANOMALY: 222.2789,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 43013,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 46443,
      BSTAR: 4.4501284e-5,
      MEAN_MOTION_DOT: 5e-7,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'envisat',
    name: 'Envisat',
    regime: 'LEO',
    omm: {
      OBJECT_NAME: 'ENVISAT',
      OBJECT_ID: '2002-009A',
      EPOCH: '2026-11-04T19:56:50.857152',
      MEAN_MOTION: 14.39092116,
      ECCENTRICITY: 0.00012803,
      INCLINATION: 98.4025,
      RA_OF_ASC_NODE: 257.125,
      ARG_OF_PERICENTER: 83.1274,
      MEAN_ANOMALY: 307.1265,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 27386,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 29371,
      BSTAR: 3.2423517e-5,
      MEAN_MOTION_DOT: 5.7e-7,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'gps-iii-sv01',
    name: 'GPS III SV01 Vespucci',
    regime: 'MEO',
    omm: {
      OBJECT_NAME: 'NAVSTAR 77 (USA 289)',
      OBJECT_ID: '2018-109A',
      EPOCH: '2026-11-04T20:28:49.503072',
      MEAN_MOTION: 2.00566582,
      ECCENTRICITY: 0.00413481,
      INCLINATION: 55.7792,
      RA_OF_ASC_NODE: 86.6397,
      ARG_OF_PERICENTER: 197.0016,
      MEAN_ANOMALY: 335.1638,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 43873,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 5789,
      BSTAR: 0,
      MEAN_MOTION_DOT: 1.4e-7,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'galileo-gsat0101',
    name: 'Galileo GSAT0101',
    regime: 'MEO',
    omm: {
      OBJECT_NAME: 'GSAT0101 (GALILEO-PFM)',
      OBJECT_ID: '2011-060A',
      EPOCH: '2026-11-03T10:56:05.731296',
      MEAN_MOTION: 1.7047556,
      ECCENTRICITY: 0.00019057,
      INCLINATION: 56.9376,
      RA_OF_ASC_NODE: 337.9787,
      ARG_OF_PERICENTER: 306.2693,
      MEAN_ANOMALY: 53.765,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 37846,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 9349,
      BSTAR: 0,
      MEAN_MOTION_DOT: -7.7e-7,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'goes-19',
    name: 'GOES-19',
    regime: 'GEO',
    omm: {
      OBJECT_NAME: 'GOES 19',
      OBJECT_ID: '2024-119A',
      EPOCH: '2026-11-04T21:04:47.215200',
      MEAN_MOTION: 1.00268619,
      ECCENTRICITY: 8.57e-5,
      INCLINATION: 0.0127,
      RA_OF_ASC_NODE: 91.8365,
      ARG_OF_PERICENTER: 203.4762,
      MEAN_ANOMALY: 349.82,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 60133,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 837,
      BSTAR: 0,
      MEAN_MOTION_DOT: 0,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'meteosat-11',
    name: 'Meteosat-11',
    regime: 'GEO',
    omm: {
      OBJECT_NAME: 'METEOSAT-11 (MSG-4)',
      OBJECT_ID: '2015-034A',
      EPOCH: '2026-11-04T21:28:52.406400',
      MEAN_MOTION: 1.00273334,
      ECCENTRICITY: 9.008e-5,
      INCLINATION: 3.5521,
      RA_OF_ASC_NODE: 70.063,
      ARG_OF_PERICENTER: 80.1736,
      MEAN_ANOMALY: 225.3702,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 40732,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 862,
      BSTAR: 0,
      MEAN_MOTION_DOT: 6e-7,
      MEAN_MOTION_DDOT: 0
    }
  },
  {
    id: 'molniya-1-29',
    name: 'Molniya 1-29',
    regime: 'HEO',
    omm: {
      OBJECT_NAME: 'MOLNIYA 1-29',
      OBJECT_ID: '1975-036A',
      EPOCH: '2026-11-04T07:32:36.746016',
      MEAN_MOTION: 2.00618504,
      ECCENTRICITY: 0.69563278,
      INCLINATION: 64.2476,
      RA_OF_ASC_NODE: 44.963,
      ARG_OF_PERICENTER: 277.797,
      MEAN_ANOMALY: 14.7375,
      EPHEMERIS_TYPE: 0,
      CLASSIFICATION_TYPE: 'U',
      NORAD_CAT_ID: 7780,
      ELEMENT_SET_NO: 999,
      REV_AT_EPOCH: 37773,
      BSTAR: 0.0069427125,
      MEAN_MOTION_DOT: -5.4e-7,
      MEAN_MOTION_DDOT: 0
    }
  }
];
