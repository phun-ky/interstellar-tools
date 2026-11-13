import type {
  ByBodyIdType,
  StarParametersType
} from '@interstellar-tools/types';

import { paper, sigma } from './sources.js';

// The papers the stars' temperatures, luminosities, gravities and metallicities are from
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

/**
 * What each star's **light** tells about it, keyed by star id: its spectral
 * class, effective temperature, luminosity, surface gravity and metallicity,
 * and for Vega and Altair, the temperatures at their poles and equators.
 *
 * Kept apart from {@link STARS}, so an app that shows a star's class and
 * temperature loads only these. {@link withObservations} puts them back on
 * the stars. Every value carries the DOI of its paper; see `STARS` for how
 * they were chosen.
 *
 * @group Observations
 * @example
 * ```ts
 * STAR_PARAMETERS.vega.luminosity?.value; // 40.12, in L☉
 * STAR_PARAMETERS.sun.effectiveTemperature?.value; // 5772, in K
 * ```
 */
export const STAR_PARAMETERS: ByBodyIdType<StarParametersType> = {
  sun: {
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
  },
  vega: {
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
    }
  },
  altair: {
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
    }
  },
  deneb: {
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
    }
  },
  'spica-a': {
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
    }
  },
  'spica-b': {
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
    }
  },
  'alpha-centauri-a': {
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
    }
  },
  'alpha-centauri-b': {
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
    }
  },
  'proxima-centauri': {
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
    }
  },
  'sirius-a': {
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
    }
  },
  'sirius-b': {
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
    spectralClassification: { raw: 'DA2', spectralClass: 'DA', subclass: 2 }
  },
  betelgeuse: {
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
    }
  },
  polaris: {
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
    }
  },
  arcturus: {
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
    }
  },
  rigel: {
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
    }
  },
  canopus: {
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
    }
  },
  'barnards-star': {
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
    }
  },
  'trappist-1a': {
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
    }
  },
  s1: {
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
  },
  s2: {
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
  },
  s4: {
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
  },
  s6: {
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
  },
  s8: {
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
  },
  s9: {
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
  },
  s12: {
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
};
