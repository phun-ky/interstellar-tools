import type {
  ByBodyIdType,
  DegreesType,
  EpochInterface,
  ObservationSourceInterface,
  StarAstrometryType
} from '@interstellar-tools/types';

import { sigma } from './sources.js';

// The catalogues the stars' identifiers, positions and motions come from
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

/**
 * Where each star **is on the sky**, keyed by star id: its catalogue
 * identifiers, its ICRS position at J2000, parallax, proper motion and radial
 * velocity, its V magnitude, and its letter within its system. Given for every
 * star but the Sun and the S-stars, from SIMBAD, Hipparcos and Gaia DR3.
 *
 * Kept apart from {@link STARS}, so an app loads these only when it needs
 * them. {@link withObservations} puts them on the stars.
 *
 * @group Observations
 * @example
 * ```ts
 * STAR_ASTROMETRY['proxima-centauri'].astrometry?.parallax?.value; // 768.0665, in mas
 * ```
 */
export const STAR_ASTROMETRY: ByBodyIdType<StarAstrometryType> = {
  vega: {
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
  },
  altair: {
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
  },
  deneb: {
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
  },
  'spica-a': {
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
  },
  'spica-b': {
    component: 'B'
  },
  'alpha-centauri-a': {
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
  },
  'alpha-centauri-b': {
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
  },
  'proxima-centauri': {
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
  },
  'sirius-a': {
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
  },
  'sirius-b': {
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
  },
  betelgeuse: {
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
  },
  polaris: {
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
  },
  arcturus: {
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
  },
  rigel: {
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
  },
  canopus: {
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
  },
  'barnards-star': {
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
  },
  'trappist-1a': {
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
};
