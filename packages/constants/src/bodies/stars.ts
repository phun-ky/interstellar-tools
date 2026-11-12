import {
  DegreesType,
  EpochInterface,
  ObservationSourceInterface,
  Radians,
  StarsType
} from '@interstellar-tools/types';

// The catalogues the stars' observations come from
const HIPPARCOS: ObservationSourceInterface = {
  catalog: 'Hipparcos',
  reference: '2007A&A...474..653V'
};
const GAIA_DR3: ObservationSourceInterface = {
  catalog: 'Gaia DR3',
  reference: '2023A&A...674A...1G'
};
// SIMBAD's value for a star, from the paper it cites
const simbad = (
  identifier: string,
  reference?: string
): ObservationSourceInterface => ({
  catalog: 'SIMBAD',
  url: `https://simbad.cds.unistra.fr/simbad/sim-id?Ident=${encodeURIComponent(identifier)}`,
  ...(reference && { reference })
});
// The epoch of the positions, J2000.0
const J2000: EpochInterface = { jd: 2451545, timeScale: 'TT' };
// A symmetric 1σ uncertainty
const sigma = (value: number) => ({ plus: value, minus: value });
// The papers the stars' temperatures, luminosities, gravities and metallicities are from
const paper = (citation: string, doi: string): ObservationSourceInterface => ({
  catalog: citation,
  reference: doi
});
const IAU_2015_B3 = paper('Prša et al. 2016', '10.3847/0004-6256/152/2/41');
const YOON_2010 = paper('Yoon et al. 2010', '10.1088/0004-637X/708/1/71');
const PETERSON_2006 = paper('Peterson et al. 2006', '10.1086/497981');
const SCHILLER_PRZYBILLA_2008 = paper(
  'Schiller & Przybilla 2008',
  '10.1051/0004-6361:20078590'
);
const TKACHENKO_2016 = paper('Tkachenko et al. 2016', '10.1093/mnras/stw255');
const AKESON_2021 = paper('Akeson et al. 2021', '10.3847/1538-3881/abfaff');
const KERVELLA_2017 = paper(
  'Kervella et al. 2017',
  '10.1051/0004-6361/201629505'
);
const PORTO_DE_MELLO_2008 = paper(
  'Porto de Mello et al. 2008',
  '10.1051/0004-6361:200810031'
);
const RIBAS_2017 = paper('Ribas et al. 2017', '10.1051/0004-6361/201730582');
const PASSEGGER_2016 = paper(
  'Passegger et al. 2016',
  '10.1051/0004-6361/201322261'
);
const BOND_2017 = paper('Bond et al. 2017', '10.3847/1538-4357/aa6af8');
const LEVESQUE_MASSEY_2020 = paper(
  'Levesque & Massey 2020',
  '10.3847/2041-8213/ab7935'
);
const JOYCE_2020 = paper('Joyce et al. 2020', '10.3847/1538-4357/abb8db');
const USENKO_2005 = paper(
  'Usenko et al. 2005',
  '10.1111/j.1365-2966.2005.09353.x'
);
const RAMIREZ_ALLENDE_PRIETO_2011 = paper(
  'Ramírez & Allende Prieto 2011',
  '10.1088/0004-637X/743/2/135'
);
const HEITER_2015 = paper('Heiter et al. 2015', '10.1051/0004-6361/201526319');
const PRZYBILLA_2006 = paper(
  'Przybilla et al. 2006',
  '10.1051/0004-6361:20053832'
);
const PRZYBILLA_2010 = paper(
  'Przybilla et al. 2010',
  '10.1051/0004-6361/201014164'
);
const MORAVVEJI_2012 = paper(
  'Moravveji et al. 2012',
  '10.1088/0004-637X/747/2/108'
);
const DOMICIANO_DE_SOUZA_2021 = paper(
  'Domiciano de Souza et al. 2021',
  '10.1051/0004-6361/202140478'
);
const SCHWEITZER_2019 = paper(
  'Schweitzer et al. 2019',
  '10.1051/0004-6361/201834965'
);
const AGOL_2021 = paper('Agol et al. 2021', '10.3847/PSJ/abd022');
const HABIBI_2017 = paper('Habibi et al. 2017', '10.3847/1538-4357/aa876f');
// The heliosphere's
const STONE_2005 = paper('Stone et al. 2005', '10.1126/science.1117684');
const BURLAGA_2008 = paper('Burlaga et al. 2008', '10.1038/nature07029');
const BURLAGA_2019 = paper('Burlaga et al. 2019', '10.1038/s41550-019-0920-y');
const MCCOMAS_2015 = paper('McComas et al. 2015', '10.1088/0067-0049/220/2/22');
const REISENFELD_2021 = paper(
  'Reisenfeld et al. 2021',
  '10.3847/1538-4365/abf658'
);

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
 * - The Sun's `rotation.iau` is the IAU's rotation model (Archinal et al. 2018), turning with the
 *   Carrington period.
 *
 * - `observations.spectralClassification` is each star's `type` split into its parts.
 * - `observations.identifiers`, `astrometry` and `apparentMagnitudes` are given for every star but
 *   the Sun and the S-stars, as SIMBAD has them: the ICRS position at J2000, and the parallax and
 *   proper motion from the Hipparcos new reduction (van Leeuwen 2007), or from Gaia DR3 for
 *   Sirius B, Proxima Centauri, Barnard's Star and TRAPPIST-1. α Centauri's parallax is Pourbaix
 *   et al.'s (1997), and the radial velocities and V magnitudes credit the paper each is from.
 *   SIMBAD lists Spica as one star, so Spica A carries the pair's values.
 * - `observations.effectiveTemperature`, `luminosity` (L☉), `logSurfaceGravity` and `metallicity`
 *   ([Fe/H]) are from the papers each credits, chosen to agree with the star's `mass` and
 *   `radius`: with `radius`, the temperature and luminosity meet L = (R/R☉)² (T/T☉)⁴ within 12 %
 *   for every star but the S-stars, whose radii aren't Habibi et al.'s. A luminosity given as
 *   log L/L☉ is converted, error bars and all. Vega and Altair spin fast enough to be hotter at
 *   their poles, so their temperatures are in `gravityDarkening`, and their gravities are the
 *   pole's. The Sun's are the IAU's nominal values (Prša et al. 2016). A metallicity is left out
 *   where no bulk [Fe/H] is measured, as for Altair, Spica and Sirius A; Deneb's and Rigel's are
 *   [M/H]. Deneb's `radius` is Schiller & Przybilla's 203 R☉, like its mass.
 * - The Sun's `observations.astrosphere` is the heliosphere. Its heliopause is IBEX's map
 *   (Reisenfeld et al. 2021): nearest just south of the nose, flaring towards the flanks, and at
 *   least 350 au down the tail. Its nose faces `upwind`, where the interstellar wind comes from,
 *   opposite the inflow direction McComas et al. 2015 give. `crossings` are the Voyagers'
 *   termination shock and heliopause crossings, from the papers each credits, with the direction
 *   each was in from JPL Horizons; Horizons puts them within 0.03 au of the papers' distances.
 *   Whether the heliosphere has a bow shock is disputed, so it has none here. The Sun's
 *   `display.astrosphere` keeps it hidden until a renderer offers to show it.
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
      polarPeriod: { value: 34.16, unit: 'd' },
      iau: {
        pole: 'north',
        rightAscension: 286.13 as DegreesType,
        rightAscensionRate: 0,
        declination: 63.87 as DegreesType,
        declinationRate: 0,
        primeMeridian: 84.176 as DegreesType,
        primeMeridianRate: 14.1844
      }
    },
    /** Radius in km */
    radius: { value: 696340, unit: 'km' },
    mu: 1.3271244004127942e20, // DE440: 1.32712440041279419e20, to double precision
    display: {
      /** Visual representation color */
      color: '#fff5f1',
      /** The heliosphere has no colour of its own: kept hidden unless asked for */
      astrosphere: { color: '#5b8fd9', opacity: 0.15 }
    },
    observations: {
      /** The heliosphere, the bubble the solar wind blows */
      astrosphere: {
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
      },
      effectiveTemperature: {
        value: 5772,
        unit: 'K',
        note: 'The IAU’s nominal value',
        source: IAU_2015_B3
      },
      luminosity: {
        value: 1,
        unit: 'L_sun',
        note: 'The IAU’s nominal solar luminosity, 3.828 × 10²⁶ W',
        source: IAU_2015_B3
      },
      logSurfaceGravity: {
        value: 4.438,
        unit: 'dex',
        provenance: 'derived',
        note: 'From the IAU’s nominal GM☉ and radius, 695 700 km',
        source: IAU_2015_B3
      },
      metallicity: {
        value: 0,
        unit: 'dex',
        provenance: 'assumed',
        note: 'The zero point of [Fe/H]',
        source: IAU_2015_B3
      },
      spectralClassification: {
        raw: 'G2V',
        spectralClass: 'G',
        subclass: 2,
        luminosityClass: 'V'
      }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      gravityDarkening: {
        pole: {
          value: 10059,
          unit: 'K',
          uncertainty: sigma(13),
          source: YOON_2010
        },
        equator: {
          value: 8152,
          unit: 'K',
          uncertainty: sigma(42),
          source: YOON_2010
        }
      },
      luminosity: {
        value: 40.12,
        unit: 'L_sun',
        uncertainty: { plus: 0.46, minus: 0.45 },
        provenance: 'derived',
        note: 'From log L/L☉ = 1.6034 ± 0.0049',
        source: YOON_2010
      },
      logSurfaceGravity: {
        value: 4.021,
        unit: 'dex',
        uncertainty: sigma(0.014),
        note: 'At its pole: 3.655 ± 0.021 at its equator',
        source: YOON_2010
      },
      spectralClassification: {
        raw: 'A0V',
        spectralClass: 'A',
        subclass: 0,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 91262,
        hd: 172167,
        catalogs: { HR: '7001', GJ: '721' },
        aliases: ['α Lyr']
      },
      astrometry: {
        direction: {
          rightAscension: 279.23473479 as DegreesType,
          declination: 38.78368896 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 130.23,
          unit: 'mas',
          uncertainty: sigma(0.36),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 200.94,
          declination: 286.23,
          uncertainty: { rightAscension: sigma(0.32), declination: sigma(0.4) },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -13.5,
          unit: 'km/s',
          uncertainty: sigma(0.4),
          source: simbad('* alf Lyr', '2004A&A...420..183A')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.03,
          unit: 'mag',
          source: simbad('* alf Lyr', '2002yCat.2237....0D')
        }
      }
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      gravityDarkening: {
        pole: {
          value: 8740,
          unit: 'K',
          uncertainty: sigma(140),
          source: PETERSON_2006
        },
        equator: {
          value: 6890,
          unit: 'K',
          uncertainty: sigma(60),
          source: PETERSON_2006
        }
      },
      luminosity: {
        value: 10.64,
        unit: 'L_sun',
        uncertainty: { plus: 0.27, minus: 0.27 },
        provenance: 'derived',
        note: 'From log L/L☉ = 1.027 ± 0.011',
        source: PETERSON_2006
      },
      logSurfaceGravity: {
        value: 4.266,
        unit: 'dex',
        uncertainty: sigma(0.012),
        note: 'At its pole: 3.851 ± 0.035 at its equator',
        source: PETERSON_2006
      },
      spectralClassification: {
        raw: 'A7V',
        spectralClass: 'A',
        subclass: 7,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 97649,
        hd: 187642,
        catalogs: { HR: '7557', GJ: '768' },
        aliases: ['α Aql']
      },
      astrometry: {
        direction: {
          rightAscension: 297.6958273 as DegreesType,
          declination: 8.8683212 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 194.95,
          unit: 'mas',
          uncertainty: sigma(0.57),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 536.23,
          declination: 385.29,
          uncertainty: {
            rightAscension: sigma(0.51),
            declination: sigma(0.47)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -26.6,
          unit: 'km/s',
          uncertainty: sigma(0.4),
          source: simbad('* alf Aql', '2006AstL...32..759G')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.76,
          unit: 'mag',
          source: simbad('* alf Aql', '2002yCat.2237....0D')
        }
      }
    }
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
    radius: { value: 141227100, unit: 'km' }, // 203 R☉, Schiller & Przybilla 2008
    display: {
      color: '#cad7ff' // A-type (blue-white)
    },
    x: { value: 2616, unit: 'ly' },
    y: { value: 27375.280016832705, unit: 'ly' },
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 8525,
        unit: 'K',
        uncertainty: sigma(75),
        source: SCHILLER_PRZYBILLA_2008
      },
      luminosity: {
        value: 196000,
        unit: 'L_sun',
        uncertainty: sigma(32000),
        source: SCHILLER_PRZYBILLA_2008
      },
      logSurfaceGravity: {
        value: 1.1,
        unit: 'dex',
        uncertainty: sigma(0.05),
        source: SCHILLER_PRZYBILLA_2008
      },
      metallicity: {
        value: -0.2,
        unit: 'dex',
        uncertainty: sigma(0.04),
        note: '[M/H], its overall metallicity',
        source: SCHILLER_PRZYBILLA_2008
      },
      spectralClassification: {
        raw: 'A2Ia',
        spectralClass: 'A',
        subclass: 2,
        luminosityClass: 'Ia'
      },
      identifiers: {
        hip: 102098,
        hd: 197345,
        catalogs: { HR: '7924' },
        aliases: ['α Cyg']
      },
      astrometry: {
        direction: {
          rightAscension: 310.35797975 as DegreesType,
          declination: 45.28033881 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 2.31,
          unit: 'mas',
          uncertainty: sigma(0.32),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 2.01,
          declination: 1.85,
          uncertainty: {
            rightAscension: sigma(0.34),
            declination: sigma(0.27)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -4.9,
          unit: 'km/s',
          uncertainty: sigma(0.3),
          source: simbad('* alf Cyg', '2006AstL...32..759G')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 1.25,
          unit: 'mag',
          source: simbad('* alf Cyg', '2002yCat.2237....0D')
        }
      }
    }
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
    },
    observations: {
      effectiveTemperature: {
        value: 25300,
        unit: 'K',
        uncertainty: sigma(500),
        source: TKACHENKO_2016
      },
      luminosity: {
        value: 20500,
        unit: 'L_sun',
        uncertainty: { plus: 5000, minus: 4000 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.312 ± 0.095',
        source: TKACHENKO_2016
      },
      logSurfaceGravity: {
        value: 3.71,
        unit: 'dex',
        uncertainty: sigma(0.1),
        source: TKACHENKO_2016
      },
      spectralClassification: {
        raw: 'B1III-IV',
        spectralClass: 'B',
        subclass: 1,
        luminosityClass: ['III', 'IV']
      },
      identifiers: {
        hip: 65474,
        hd: 116658,
        catalogs: { HR: '5056' },
        aliases: ['α Vir']
      },
      astrometry: {
        direction: {
          rightAscension: 201.29824736 as DegreesType,
          declination: -11.16131949 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 13.06,
          unit: 'mas',
          uncertainty: sigma(0.7),
          source: HIPPARCOS,
          note: 'Of Spica A and B together'
        },
        properMotion: {
          rightAscension: -42.35,
          declination: -30.67,
          uncertainty: {
            rightAscension: sigma(0.62),
            declination: sigma(0.37)
          },
          source: HIPPARCOS,
          note: 'Of Spica A and B together'
        },
        radialVelocity: {
          value: -3.31,
          unit: 'km/s',
          uncertainty: sigma(0.78),
          source: simbad('* alf Vir', '2023ApJS..266...11B'),
          note: 'Of Spica A and B together'
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.97,
          unit: 'mag',
          source: simbad('* alf Vir', '2002yCat.2237....0D'),
          note: 'Of Spica A and B together'
        }
      },
      component: 'A'
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
    },
    observations: {
      effectiveTemperature: {
        value: 20900,
        unit: 'K',
        uncertainty: sigma(800),
        source: TKACHENKO_2016
      },
      luminosity: {
        value: 2250,
        unit: 'L_sun',
        uncertainty: { plus: 1200, minus: 770 },
        provenance: 'derived',
        note: 'From log L/L☉ = 3.353 ± 0.181',
        source: TKACHENKO_2016
      },
      logSurfaceGravity: {
        value: 4.15,
        unit: 'dex',
        uncertainty: sigma(0.15),
        source: TKACHENKO_2016
      },
      spectralClassification: {
        raw: 'B2V',
        spectralClass: 'B',
        subclass: 2,
        luminosityClass: 'V'
      },
      component: 'B'
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
    },
    observations: {
      effectiveTemperature: {
        value: 5795,
        unit: 'K',
        uncertainty: sigma(19),
        source: KERVELLA_2017
      },
      luminosity: {
        value: 1.5059,
        unit: 'L_sun',
        uncertainty: sigma(0.0019),
        source: AKESON_2021
      },
      logSurfaceGravity: {
        value: 4.34,
        unit: 'dex',
        uncertainty: sigma(0.12),
        source: PORTO_DE_MELLO_2008
      },
      metallicity: {
        value: 0.24,
        unit: 'dex',
        uncertainty: sigma(0.03),
        source: PORTO_DE_MELLO_2008
      },
      spectralClassification: {
        raw: 'G2V',
        spectralClass: 'G',
        subclass: 2,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 71683,
        hd: 128620,
        catalogs: { HR: '5459', GJ: '559 A' },
        aliases: ['α Cen A', 'Rigil Kentaurus']
      },
      astrometry: {
        direction: {
          rightAscension: 219.90205833 as DegreesType,
          declination: -60.83399269 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 742.12,
          unit: 'mas',
          uncertainty: sigma(1.4),
          source: simbad('* alf Cen A', '1997A&A...323L..49P')
        },
        properMotion: {
          rightAscension: -3679.25,
          declination: 473.67,
          uncertainty: {
            rightAscension: sigma(3.89),
            declination: sigma(3.24)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -15.252,
          unit: 'km/s',
          uncertainty: sigma(0.167),
          source: simbad('* alf Cen A', '2021MNRAS.506..150B')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.01,
          unit: 'mag',
          source: simbad('* alf Cen A', '2002yCat.2237....0D')
        }
      },
      component: 'A'
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
    },
    observations: {
      effectiveTemperature: {
        value: 5231,
        unit: 'K',
        uncertainty: sigma(21),
        source: KERVELLA_2017
      },
      luminosity: {
        value: 0.4981,
        unit: 'L_sun',
        uncertainty: sigma(0.0007),
        source: AKESON_2021
      },
      logSurfaceGravity: {
        value: 4.44,
        unit: 'dex',
        uncertainty: sigma(0.15),
        source: PORTO_DE_MELLO_2008
      },
      metallicity: {
        value: 0.25,
        unit: 'dex',
        uncertainty: sigma(0.04),
        source: PORTO_DE_MELLO_2008
      },
      spectralClassification: {
        raw: 'K1V',
        spectralClass: 'K',
        subclass: 1,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 71681,
        hd: 128621,
        catalogs: { HR: '5460', GJ: '559 B' },
        aliases: ['α Cen B', 'Toliman']
      },
      astrometry: {
        direction: {
          rightAscension: 219.89609629 as DegreesType,
          declination: -60.83752757 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 742.12,
          unit: 'mas',
          uncertainty: sigma(1.4),
          source: simbad('* alf Cen B', '1997A&A...323L..49P')
        },
        properMotion: {
          rightAscension: -3614.39,
          declination: 802.98,
          uncertainty: {
            rightAscension: sigma(20.48),
            declination: sigma(19.52)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -22.586,
          unit: 'km/s',
          uncertainty: sigma(0.0001),
          source: simbad('* alf Cen B', '2018A&A...616A...7S')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 1.33,
          unit: 'mag',
          source: simbad('* alf Cen B', '2002yCat.2237....0D')
        }
      },
      component: 'B'
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
    },
    observations: {
      effectiveTemperature: {
        value: 2980,
        unit: 'K',
        uncertainty: sigma(80),
        source: RIBAS_2017
      },
      luminosity: {
        value: 0.00151,
        unit: 'L_sun',
        uncertainty: sigma(8e-5),
        source: RIBAS_2017
      },
      logSurfaceGravity: {
        value: 5.02,
        unit: 'dex',
        uncertainty: sigma(0.18),
        source: PASSEGGER_2016
      },
      metallicity: {
        value: -0.07,
        unit: 'dex',
        uncertainty: sigma(0.14),
        source: PASSEGGER_2016
      },
      spectralClassification: {
        raw: 'M5.5Ve',
        spectralClass: 'M',
        subclass: 5.5,
        luminosityClass: 'V',
        peculiarities: ['e']
      },
      identifiers: {
        hip: 70890,
        gaiaDr3: '5853498713190525696',
        catalogs: { GJ: '551' },
        aliases: ['α Cen C', 'V645 Cen']
      },
      astrometry: {
        direction: {
          rightAscension: 217.42894222 as DegreesType,
          declination: -62.67949019 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 768.0665,
          unit: 'mas',
          uncertainty: sigma(0.0499),
          source: GAIA_DR3
        },
        properMotion: {
          rightAscension: -3781.741,
          declination: 769.465,
          uncertainty: {
            rightAscension: sigma(0.031),
            declination: sigma(0.051)
          },
          source: GAIA_DR3
        },
        radialVelocity: {
          value: -20.578199,
          unit: 'km/s',
          uncertainty: sigma(0.004684),
          source: simbad('NAME Proxima Centauri', '2020AJ....160..120J')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 11.13,
          unit: 'mag',
          source: simbad('NAME Proxima Centauri', '2014AJ....147...21J')
        }
      },
      component: 'C'
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
    },
    observations: {
      effectiveTemperature: {
        value: 9845,
        unit: 'K',
        uncertainty: sigma(64),
        source: BOND_2017
      },
      luminosity: {
        value: 24.74,
        unit: 'L_sun',
        uncertainty: sigma(0.7),
        source: BOND_2017
      },
      spectralClassification: {
        raw: 'A1V',
        spectralClass: 'A',
        subclass: 1,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 32349,
        hd: 48915,
        catalogs: { HR: '2491', GJ: '244 A' },
        aliases: ['α CMa A']
      },
      astrometry: {
        direction: {
          rightAscension: 101.28715533 as DegreesType,
          declination: -16.71611586 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 379.21,
          unit: 'mas',
          uncertainty: sigma(1.58),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: -546.01,
          declination: -1223.07,
          uncertainty: {
            rightAscension: sigma(1.33),
            declination: sigma(1.24)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -5.5,
          unit: 'km/s',
          uncertainty: sigma(0.4),
          source: simbad('* alf CMa', '2006AstL...32..759G')
        }
      },
      apparentMagnitudes: {
        V: {
          value: -1.46,
          unit: 'mag',
          source: simbad('* alf CMa', '2002yCat.2237....0D')
        }
      },
      component: 'A'
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
    },
    observations: {
      effectiveTemperature: {
        value: 25369,
        unit: 'K',
        uncertainty: sigma(46),
        source: BOND_2017
      },
      luminosity: {
        value: 0.02448,
        unit: 'L_sun',
        uncertainty: sigma(0.00033),
        source: BOND_2017
      },
      logSurfaceGravity: {
        value: 8.591,
        unit: 'dex',
        uncertainty: sigma(0.016),
        note: 'From its spectrum (Barstow et al. 2017): its mass and radius give 8.629 ± 0.007',
        source: BOND_2017
      },
      spectralClassification: { raw: 'DA2', spectralClass: 'DA', subclass: 2 },
      identifiers: {
        gaiaDr3: '2947050466531873024',
        catalogs: { GJ: '244 B', WD: '0642-166' },
        aliases: ['α CMa B']
      },
      astrometry: {
        direction: {
          rightAscension: 101.28876747 as DegreesType,
          declination: -16.71686798 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 374.4896,
          unit: 'mas',
          uncertainty: sigma(0.2313),
          source: GAIA_DR3
        },
        properMotion: {
          rightAscension: -461.571,
          declination: -914.52,
          uncertainty: {
            rightAscension: sigma(0.278),
            declination: sigma(0.332)
          },
          source: GAIA_DR3
        }
      },
      apparentMagnitudes: {
        V: { value: 8.44, unit: 'mag', source: simbad('* alf CMa B') }
      },
      component: 'B'
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 3600,
        unit: 'K',
        uncertainty: sigma(25),
        note: 'In February 2020, during its Great Dimming: 3650 ± 25 K in 2004',
        source: LEVESQUE_MASSEY_2020
      },
      luminosity: {
        value: 87100,
        unit: 'L_sun',
        uncertainty: { plus: 13000, minus: 7700 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.94 +0.06/−0.04',
        source: JOYCE_2020
      },
      spectralClassification: {
        raw: 'M1-M2Ia-Iab',
        spectralClass: 'M',
        subclass: [1, 2],
        luminosityClass: ['Ia', 'Iab']
      },
      identifiers: {
        hip: 27989,
        hd: 39801,
        catalogs: { HR: '2061' },
        aliases: ['α Ori']
      },
      astrometry: {
        direction: {
          rightAscension: 88.79293899 as DegreesType,
          declination: 7.407064 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 6.55,
          unit: 'mas',
          uncertainty: sigma(0.83),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 27.54,
          declination: 11.3,
          uncertainty: {
            rightAscension: sigma(1.03),
            declination: sigma(0.65)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: 21.91,
          unit: 'km/s',
          uncertainty: sigma(0.51),
          source: simbad('* alf Ori', '2005A&A...430..165F')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.42,
          unit: 'mag',
          source: simbad('* alf Ori', '1966CoLPL...4...99J')
        }
      }
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 6015,
        unit: 'K',
        note: 'From its 2001 to 2004 spectra, ΔTeff = 170 K',
        source: USENKO_2005
      },
      logSurfaceGravity: {
        value: 2.2,
        unit: 'dex',
        note: 'Δlog g = 0.3',
        source: USENKO_2005
      },
      metallicity: { value: 0.07, unit: 'dex', source: USENKO_2005 },
      spectralClassification: {
        raw: 'F7Ib',
        spectralClass: 'F',
        subclass: 7,
        luminosityClass: 'Ib'
      },
      identifiers: {
        hip: 11767,
        hd: 8890,
        catalogs: { HR: '424' },
        aliases: ['α UMi', 'North Star']
      },
      astrometry: {
        direction: {
          rightAscension: 37.95456067 as DegreesType,
          declination: 89.26410897 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 7.54,
          unit: 'mas',
          uncertainty: sigma(0.11),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 44.48,
          declination: -11.85,
          uncertainty: {
            rightAscension: sigma(0.11),
            declination: sigma(0.13)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -16.42,
          unit: 'km/s',
          uncertainty: sigma(0.03),
          source: simbad('* alf UMi', '2004A&A...424..727P')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 2.02,
          unit: 'mag',
          source: simbad('* alf UMi', '2002yCat.2237....0D')
        }
      },
      component: 'Aa'
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 4286,
        unit: 'K',
        uncertainty: sigma(30),
        source: RAMIREZ_ALLENDE_PRIETO_2011
      },
      luminosity: {
        value: 197.2,
        unit: 'L_sun',
        uncertainty: { plus: 5.1, minus: 4.9 },
        provenance: 'derived',
        note: 'From log L/L☉ = 2.295 ± 0.011',
        source: HEITER_2015
      },
      logSurfaceGravity: {
        value: 1.66,
        unit: 'dex',
        uncertainty: sigma(0.05),
        source: RAMIREZ_ALLENDE_PRIETO_2011
      },
      metallicity: {
        value: -0.52,
        unit: 'dex',
        uncertainty: sigma(0.04),
        source: RAMIREZ_ALLENDE_PRIETO_2011
      },
      spectralClassification: {
        raw: 'K1.5III',
        spectralClass: 'K',
        subclass: 1.5,
        luminosityClass: 'III'
      },
      identifiers: {
        hip: 69673,
        hd: 124897,
        catalogs: { HR: '5340', GJ: '541' },
        aliases: ['α Boo']
      },
      astrometry: {
        direction: {
          rightAscension: 213.91530029 as DegreesType,
          declination: 19.18240916 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 88.83,
          unit: 'mas',
          uncertainty: sigma(0.54),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: -1093.39,
          declination: -2000.06,
          uncertainty: {
            rightAscension: sigma(0.44),
            declination: sigma(0.39)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: -5.229,
          unit: 'km/s',
          uncertainty: sigma(0.0002),
          source: simbad('* alf Boo', '2018A&A...616A...7S')
        }
      },
      apparentMagnitudes: {
        V: {
          value: -0.05,
          unit: 'mag',
          source: simbad('* alf Boo', '2002yCat.2237....0D')
        }
      }
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 12100,
        unit: 'K',
        uncertainty: sigma(150),
        source: PRZYBILLA_2010
      },
      luminosity: {
        value: 120000,
        unit: 'L_sun',
        uncertainty: { plus: 21000, minus: 25000 },
        provenance: 'derived',
        note: 'From log L/L☉ = 5.08 +0.07/−0.10',
        source: MORAVVEJI_2012
      },
      logSurfaceGravity: {
        value: 1.75,
        unit: 'dex',
        uncertainty: sigma(0.1),
        source: PRZYBILLA_2010
      },
      metallicity: {
        value: -0.06,
        unit: 'dex',
        uncertainty: sigma(0.1),
        note: '[M/H], from O, Mg, S, Ti and Fe',
        source: PRZYBILLA_2006
      },
      spectralClassification: {
        raw: 'B8Ia',
        spectralClass: 'B',
        subclass: 8,
        luminosityClass: 'Ia'
      },
      identifiers: {
        hip: 24436,
        hd: 34085,
        catalogs: { HR: '1713' },
        aliases: ['β Ori']
      },
      astrometry: {
        direction: {
          rightAscension: 78.63446707 as DegreesType,
          declination: -8.20163836 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 3.78,
          unit: 'mas',
          uncertainty: sigma(0.34),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 1.31,
          declination: 0.5,
          uncertainty: { rightAscension: sigma(0.4), declination: sigma(0.3) },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: 17.8,
          unit: 'km/s',
          uncertainty: sigma(0.4),
          source: simbad('* bet Ori', '2006AstL...32..759G')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 0.13,
          unit: 'mag',
          source: simbad('* bet Ori', '2002yCat.2237....0D')
        }
      },
      component: 'A'
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 7657,
        unit: 'K',
        uncertainty: sigma(161),
        source: DOMICIANO_DE_SOUZA_2021
      },
      luminosity: {
        value: 16630,
        unit: 'L_sun',
        uncertainty: { plus: 700, minus: 680 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.221 ± 0.018',
        source: DOMICIANO_DE_SOUZA_2021
      },
      logSurfaceGravity: {
        value: 1.7,
        unit: 'dex',
        uncertainty: sigma(0.05),
        source: DOMICIANO_DE_SOUZA_2021
      },
      spectralClassification: {
        raw: 'A9II',
        spectralClass: 'A',
        subclass: 9,
        luminosityClass: 'II'
      },
      identifiers: {
        hip: 30438,
        hd: 45348,
        catalogs: { HR: '2326' },
        aliases: ['α Car']
      },
      astrometry: {
        direction: {
          rightAscension: 95.98795783 as DegreesType,
          declination: -52.69566138 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 10.55,
          unit: 'mas',
          uncertainty: sigma(0.56),
          source: HIPPARCOS
        },
        properMotion: {
          rightAscension: 19.93,
          declination: 23.24,
          uncertainty: {
            rightAscension: sigma(0.52),
            declination: sigma(0.69)
          },
          source: HIPPARCOS
        },
        radialVelocity: {
          value: 20.3,
          unit: 'km/s',
          uncertainty: sigma(0.5),
          source: simbad('* alf Car', '2006AstL...32..759G')
        }
      },
      apparentMagnitudes: {
        V: {
          value: -0.74,
          unit: 'mag',
          source: simbad('* alf Car', '2002yCat.2237....0D')
        }
      }
    }
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
    z: { value: 0, unit: 'ly' },
    observations: {
      effectiveTemperature: {
        value: 3273,
        unit: 'K',
        uncertainty: sigma(51),
        source: SCHWEITZER_2019
      },
      luminosity: {
        value: 0.00356,
        unit: 'L_sun',
        uncertainty: sigma(7e-5),
        source: SCHWEITZER_2019
      },
      logSurfaceGravity: {
        value: 5.11,
        unit: 'dex',
        uncertainty: sigma(0.07),
        source: SCHWEITZER_2019
      },
      metallicity: {
        value: -0.15,
        unit: 'dex',
        uncertainty: sigma(0.16),
        source: SCHWEITZER_2019
      },
      spectralClassification: {
        raw: 'M4V',
        spectralClass: 'M',
        subclass: 4,
        luminosityClass: 'V'
      },
      identifiers: {
        hip: 87937,
        gaiaDr3: '4472832130942575872',
        catalogs: { GJ: '699' },
        aliases: ['V2500 Oph']
      },
      astrometry: {
        direction: {
          rightAscension: 269.45207696 as DegreesType,
          declination: 4.69336497 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 546.9759,
          unit: 'mas',
          uncertainty: sigma(0.0401),
          source: GAIA_DR3
        },
        properMotion: {
          rightAscension: -801.551,
          declination: 10362.394,
          uncertainty: {
            rightAscension: sigma(0.032),
            declination: sigma(0.036)
          },
          source: GAIA_DR3
        },
        radialVelocity: {
          value: -110.11,
          unit: 'km/s',
          uncertainty: sigma(0.0002),
          source: simbad('GJ 699', '2018MNRAS.475.1960F')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 9.511,
          unit: 'mag',
          source: simbad('GJ 699', '2010MNRAS.403.1949K')
        }
      }
    }
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
    },
    observations: {
      effectiveTemperature: {
        value: 2566,
        unit: 'K',
        uncertainty: sigma(26),
        source: AGOL_2021
      },
      luminosity: {
        value: 0.000553,
        unit: 'L_sun',
        uncertainty: sigma(1.9e-5),
        note: 'From Ducrot et al. 2020, as Agol et al. adopt',
        source: AGOL_2021
      },
      logSurfaceGravity: {
        value: 5.2396,
        unit: 'dex',
        uncertainty: { plus: 0.0056, minus: 0.0073 },
        source: AGOL_2021
      },
      spectralClassification: {
        raw: 'M8V',
        spectralClass: 'M',
        subclass: 8,
        luminosityClass: 'V'
      },
      identifiers: {
        gaiaDr3: '2635476908753563008',
        catalogs: { '2MASS': 'J23062928-0502285' }
      },
      astrometry: {
        direction: {
          rightAscension: 346.62236873 as DegreesType,
          declination: -5.04139925 as DegreesType
        },
        epoch: J2000,
        parallax: {
          value: 80.2123,
          unit: 'mas',
          uncertainty: sigma(0.0716),
          source: GAIA_DR3
        },
        properMotion: {
          rightAscension: 930.788,
          declination: -479.038,
          uncertainty: {
            rightAscension: sigma(0.087),
            declination: sigma(0.07)
          },
          source: GAIA_DR3
        },
        radialVelocity: {
          value: -52.003101,
          unit: 'km/s',
          uncertainty: sigma(0.134416),
          source: simbad('TRAPPIST-1', '2020AJ....160..120J')
        }
      },
      apparentMagnitudes: {
        V: {
          value: 18.798,
          unit: 'mag',
          uncertainty: sigma(0.082),
          source: simbad('TRAPPIST-1', '2006AJ....132.1234C')
        }
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 27450,
        unit: 'K',
        uncertainty: { plus: 2239, minus: 2569 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 15500,
        unit: 'L_sun',
        uncertainty: { plus: 8500, minus: 5300 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.19 +0.19/−0.18',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.11,
        unit: 'dex',
        uncertainty: { plus: 0.13, minus: 0.16 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 28513,
        unit: 'K',
        uncertainty: { plus: 2388, minus: 2923 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 22400,
        unit: 'L_sun',
        uncertainty: { plus: 11000, minus: 7900 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.35 +0.18/−0.19',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.1,
        unit: 'dex',
        uncertainty: { plus: 0.13, minus: 0.24 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0V',
        spectralClass: 'B',
        subclass: 0,
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 27288,
        unit: 'K',
        uncertainty: { plus: 2224, minus: 2823 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 15500,
        unit: 'L_sun',
        uncertainty: { plus: 7400, minus: 5700 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.19 +0.17/−0.20',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.11,
        unit: 'dex',
        uncertainty: { plus: 0.14, minus: 0.19 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 22932,
        unit: 'K',
        uncertainty: { plus: 2725, minus: 2851 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 7100,
        unit: 'L_sun',
        uncertainty: { plus: 5800, minus: 3300 },
        provenance: 'derived',
        note: 'From log L/L☉ = 3.85 +0.26/−0.27',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.11,
        unit: 'dex',
        uncertainty: { plus: 0.13, minus: 0.29 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 28274,
        unit: 'K',
        uncertainty: { plus: 2461, minus: 2374 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 18600,
        unit: 'L_sun',
        uncertainty: { plus: 9600, minus: 6600 },
        provenance: 'derived',
        note: 'From log L/L☉ = 4.27 +0.18/−0.19',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.15,
        unit: 'dex',
        uncertainty: { plus: 0.1, minus: 0.18 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 22202,
        unit: 'K',
        uncertainty: { plus: 2463, minus: 2416 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 4300,
        unit: 'L_sun',
        uncertainty: { plus: 3100, minus: 2000 },
        provenance: 'derived',
        note: 'From log L/L☉ = 3.63 +0.24/−0.27',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.21,
        unit: 'dex',
        uncertainty: { plus: 0.08, minus: 0.2 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
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
    },
    observations: {
      effectiveTemperature: {
        value: 20882,
        unit: 'K',
        uncertainty: { plus: 2348, minus: 2760 },
        source: HABIBI_2017
      },
      luminosity: {
        value: 3600,
        unit: 'L_sun',
        uncertainty: { plus: 2700, minus: 1800 },
        provenance: 'derived',
        note: 'From log L/L☉ = 3.56 +0.24/−0.29',
        source: HABIBI_2017
      },
      logSurfaceGravity: {
        value: 4.11,
        unit: 'dex',
        uncertainty: { plus: 0.16, minus: 0.24 },
        source: HABIBI_2017
      },
      spectralClassification: {
        raw: 'B0-B3V',
        spectralClass: 'B',
        subclass: [0, 3],
        luminosityClass: 'V'
      }
    }
  }
] as const satisfies StarsType;
