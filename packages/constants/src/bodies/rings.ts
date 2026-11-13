import type {
  ByBodyIdType,
  DistanceInterface,
  ObservationMetaInterface,
  ObservationSourceInterface,
  ObservedType,
  PlanetObservationsInterface,
  RingGapInterface,
  RingInterface,
  RingSystemInterface
} from '@interstellar-tools/types';

type RingDetailsType = Omit<
  RingInterface,
  'name' | 'innerRadius' | 'outerRadius'
>;
// A value, or the range a source gives for a value that varies across a ring
type AmountType = number | readonly [min: number, max: number];

/** The PDS Ring-Moon Systems Node's vital statistics for a planet's rings. */
const pds = (
  planet: string,
  reference?: string
): ObservationSourceInterface => ({
  catalog: 'PDS',
  url: `https://pds-rings.seti.org/${planet}/${planet}_tables.html`,
  ...(reference && { reference })
});
/** NASA NSSDCA's fact sheet for a planet's rings. */
const nssdca = (planet: string): ObservationSourceInterface => ({
  catalog: 'NSSDCA',
  url: `https://nssdc.gsfc.nasa.gov/planetary/factsheet/${planet}ringfact.html`
});
const km = (
  value: number,
  source: ObservationSourceInterface,
  meta: ObservationMetaInterface = {}
): ObservedType<DistanceInterface> => ({ value, unit: 'km', ...meta, source });
/** A value, or a range's middle, with the range in its note. */
const amount = (
  value: AmountType,
  source: ObservationSourceInterface,
  meta: ObservationMetaInterface = {}
): ObservedType =>
  typeof value === 'number'
    ? { value, ...meta, source }
    : {
        // Rounded, so 0.05 to 0.35 gives 0.2, not 0.19999999999999998
        value: Number(((value[0] + value[1]) / 2).toPrecision(12)),
        provenance: 'derived',
        note: `The middle of ${value[0]} to ${value[1]}, its range across the ring`,
        ...meta,
        source
      };
const thickness = (
  value: AmountType,
  unit: 'm' | 'km',
  source: ObservationSourceInterface,
  meta?: ObservationMetaInterface
): ObservedType<DistanceInterface> => ({
  ...amount(value, source, meta),
  unit
});
/** A ring from its inner and outer edges. */
const ring = (
  name: string,
  inner: number,
  outer: number,
  source: ObservationSourceInterface,
  details: RingDetailsType = {}
): RingInterface => ({
  name,
  innerRadius: km(inner, source),
  outerRadius: km(outer, source),
  ...details
});
/**
 * A ring from its middle radius and width, as the source gives Uranus's and
 * Neptune's: its edges are half its width either side, or half its mean width
 * for an eccentric ring whose width changes around it.
 */
const byMiddle = (
  name: string,
  middle: number,
  width: AmountType,
  source: ObservationSourceInterface,
  details: RingDetailsType = {},
  note?: string
): RingInterface => {
  const [min, max] = typeof width === 'number' ? [width, width] : width;
  const half = (min + max) / 4;
  const meta: ObservationMetaInterface = {
    provenance: 'derived',
    note:
      note ??
      (min === max
        ? `From its middle, ${middle} km, and its width, ${min} km`
        : `From its middle, ${middle} km, and its mean width: ${min} to ${max} km around the ring`)
  };

  return {
    name,
    innerRadius: km(middle - half, source, meta),
    outerRadius: km(middle + half, source, meta),
    ...details
  };
};
/** A gap from its inner and outer edges. */
const gap = (
  name: string,
  inner: number,
  outer: number,
  source: ObservationSourceInterface,
  normalOpticalDepth?: AmountType
): RingGapInterface => ({
  name,
  innerRadius: km(inner, source),
  outerRadius: km(outer, source),
  ...(normalOpticalDepth !== undefined && {
    normalOpticalDepth: amount(normalOpticalDepth, source)
  })
});
// The papers the PDS tables cite for each feature
const BURNS_1999 = '10.1126/science.284.5417.1146';
const MURRAY_DERMOTT_1999 = '10.1017/CBO9781139174817';
const NICHOLSON_2014_B_RING = '10.1016/j.icarus.2013.09.002';
const NICHOLSON_2014_C_RING = '10.1016/j.icarus.2014.06.024';
const FRENCH_2016 = '10.1016/j.icarus.2016.03.017';
const FRENCH_2017 = '10.1016/j.icarus.2017.02.007';
const COOPER_2013 = '10.1088/0004-6256/145/6/161';
const VERBISCER_2009 = '10.1038/nature08515';
const SHOWALTER_LISSAUER_2006 = '10.1126/science.1122882';
const JUPITER = pds('jupiter');
const GOSSAMER = pds('jupiter', BURNS_1999);
const SATURN = pds('saturn');
const SATURN_EDGES = pds('saturn', FRENCH_2017);
const SATURN_C_RING = pds('saturn', NICHOLSON_2014_C_RING);
const SATURN_CASSINI_DIVISION = pds('saturn', FRENCH_2016);
const SATURN_DUST = pds('saturn', MURRAY_DERMOTT_1999);
const SATURN_THICKNESS = nssdca('sat');
const URANUS = pds('uranus');
const URANUS_DUST = pds('uranus', SHOWALTER_LISSAUER_2006);
const NEPTUNE = pds('neptune');
/** Jupiter's faint, dusty rings: the halo, the main ring and the gossamer rings. */
const JUPITER_RINGS: RingSystemInterface = {
  rings: [
    ring('Halo', 89_400, 123_000, JUPITER, {
      normalOpticalDepth: amount(3e-6, JUPITER),
      thickness: thickness(10_000, 'km', JUPITER)
    }),
    ring('Main', 123_000, 128_940, JUPITER, {
      normalOpticalDepth: amount(5e-6, JUPITER),
      thickness: thickness(100, 'km', JUPITER, { limit: 'upper' })
    }),
    ring('Amalthea gossamer', 128_940, 181_350, GOSSAMER, {
      normalOpticalDepth: amount(1e-7, GOSSAMER),
      thickness: thickness(2600, 'km', GOSSAMER)
    }),
    ring('Thebe gossamer', 128_940, 221_900, GOSSAMER, {
      normalOpticalDepth: amount(1e-7, GOSSAMER),
      thickness: thickness(8800, 'km', GOSSAMER)
    }),
    ring('Thebe extension', 221_900, 280_000, GOSSAMER, {
      normalOpticalDepth: amount(1e-8, GOSSAMER),
      thickness: thickness(8800, 'km', GOSSAMER)
    })
  ],
  // Their dust is knocked off Metis, Adrastea, Amalthea and Thebe by impacts
  // (Burns et al. 1999). Adrastea isn't in MOONS
  shepherdIds: ['metis', 'amalthea', 'thebe']
};
/** Saturn's main rings, its faint dust rings and its named gaps. */
const SATURN_RINGS: RingSystemInterface = {
  rings: [
    ring('D', 66_900, 74_491, SATURN_EDGES, {
      normalOpticalDepth: amount([1e-5, 1e-3], SATURN_EDGES)
    }),
    ring('C', 74_491, 91_975, SATURN_EDGES, {
      normalOpticalDepth: amount([0.05, 0.35], SATURN_EDGES),
      thickness: thickness(5, 'm', SATURN_THICKNESS)
    }),
    ring('B', 91_975, 117_570, pds('saturn', NICHOLSON_2014_B_RING), {
      normalOpticalDepth: amount(
        [0.4, 5],
        pds('saturn', NICHOLSON_2014_B_RING)
      ),
      thickness: thickness([5, 10], 'm', SATURN_THICKNESS)
    }),
    ring('A', 122_050, 136_770, SATURN_EDGES, {
      normalOpticalDepth: amount([0.4, 1], SATURN_EDGES),
      thickness: thickness([10, 30], 'm', SATURN_THICKNESS)
    }),
    ring('F', 139_826, 140_612, pds('saturn', COOPER_2013), {
      normalOpticalDepth: amount([0.01, 0.2], pds('saturn', COOPER_2013))
    }),
    ring('Janus/Epimetheus', 149_000, 154_000, SATURN, {
      normalOpticalDepth: amount(1e-7, SATURN)
    }),
    ring('G', 166_000, 173_200, SATURN_DUST, {
      normalOpticalDepth: amount(1e-6, SATURN_DUST),
      thickness: thickness(1e5, 'm', SATURN_THICKNESS)
    }),
    ring('E', 180_000, 480_000, SATURN_DUST, {
      normalOpticalDepth: amount(5e-6, SATURN_DUST),
      thickness: thickness(30_000, 'km', SATURN_DUST, { limit: 'upper' })
    }),
    ring('Phoebe', 7_720_000, 12_500_000, pds('saturn', VERBISCER_2009), {
      normalOpticalDepth: amount(2e-8, pds('saturn', VERBISCER_2009)),
      thickness: thickness(2_400_000, 'km', pds('saturn', VERBISCER_2009))
    })
  ],
  gaps: [
    gap('Colombo Gap', 77_748, 77_926, SATURN_C_RING),
    gap('Maxwell Gap', 87_343, 87_610, SATURN_C_RING),
    gap('Bond Gap', 88_686, 88_723, SATURN_C_RING),
    gap('Dawes Gap', 90_200, 90_221, SATURN_C_RING),
    gap('Cassini Division', 117_500, 122_050, SATURN_EDGES, [0, 0.2]),
    gap('Huygens Gap', 117_500, 117_930, SATURN_CASSINI_DIVISION),
    gap('Herschel Gap', 118_188, 118_284, SATURN_CASSINI_DIVISION),
    gap('Russell Gap', 118_590, 118_628, SATURN_CASSINI_DIVISION),
    gap('Jeffreys Gap', 118_930, 118_967, SATURN_CASSINI_DIVISION),
    gap('Kuiper Gap', 119_402, 119_406, SATURN_CASSINI_DIVISION),
    gap('Laplace Gap', 119_845, 120_086, SATURN_CASSINI_DIVISION),
    gap('Bessel Gap', 120_231, 120_244, SATURN_CASSINI_DIVISION),
    gap('Barnard Gap', 120_304, 120_316, SATURN_CASSINI_DIVISION),
    gap('Encke Gap', 133_423, 133_745, SATURN_EDGES),
    gap('Keeler Gap', 136_487, 136_522, SATURN_EDGES),
    gap('Roche Division', 136_770, 139_380, SATURN, 1e-4)
  ],
  // Mimas's 2:1 resonance holds the B ring's edge and clears the Cassini
  // Division; Enceladus feeds the E ring, and Phoebe its own
  shepherdIds: ['mimas', 'enceladus', 'phoebe']
};
/** Uranus's narrow rings, and its two faint outer dust rings. */
const URANUS_RINGS: RingSystemInterface = {
  rings: [
    byMiddle('6', 41_837, 1.5, URANUS, {
      normalOpticalDepth: amount(0.3, URANUS)
    }),
    byMiddle('5', 42_234, 2, URANUS, {
      normalOpticalDepth: amount(0.5, URANUS)
    }),
    byMiddle('4', 42_571, 2, URANUS, {
      normalOpticalDepth: amount(0.3, URANUS)
    }),
    byMiddle('α', 44_718, [4, 10], URANUS, {
      normalOpticalDepth: amount(0.4, URANUS)
    }),
    byMiddle('β', 45_661, [5, 11], URANUS, {
      normalOpticalDepth: amount(0.3, URANUS)
    }),
    byMiddle('η', 47_176, 1.6, URANUS, {
      normalOpticalDepth: amount(0.4, URANUS, { limit: 'upper' })
    }),
    byMiddle('γ', 47_627, [1, 4], URANUS, {
      normalOpticalDepth: amount(0.3, URANUS, { limit: 'lower' })
    }),
    byMiddle('δ', 48_300, [3, 7], URANUS, {
      normalOpticalDepth: amount(0.5, URANUS)
    }),
    byMiddle('λ', 50_024, 2, URANUS, {
      normalOpticalDepth: amount(0.1, URANUS)
    }),
    byMiddle('ε', 51_149, [20, 96], URANUS, {
      normalOpticalDepth: amount([0.5, 2.3], URANUS)
    }),
    // R/2003 U 2, between Portia and Rosalind
    byMiddle('ν', 67_300, 3800, URANUS_DUST, {
      normalOpticalDepth: amount(6e-6, URANUS_DUST)
    }),
    // R/2003 U 1, brightest at Mab's orbit
    byMiddle('μ', 97_700, 17_000, URANUS_DUST, {
      normalOpticalDepth: amount(8e-6, URANUS_DUST)
    })
  ]
};
/** Neptune's rings. The Adams ring's arcs and the faint Arago ring aren't included. */
const NEPTUNE_RINGS: RingSystemInterface = {
  rings: [
    byMiddle('Galle', 42_000, 2000, NEPTUNE, {
      normalOpticalDepth: amount(1e-4, NEPTUNE)
    }),
    byMiddle(
      'Le Verrier',
      53_200,
      100,
      NEPTUNE,
      { normalOpticalDepth: amount(1e-2, NEPTUNE) },
      'From its middle, 53200 km: it is narrower than 100 km, so its edges are at most 50 km either side'
    ),
    byMiddle('Lassell', 55_200, 4000, NEPTUNE, {
      normalOpticalDepth: amount(1e-4, NEPTUNE)
    }),
    byMiddle('Adams', 62_933, 15, NEPTUNE, {
      normalOpticalDepth: amount([0.01, 0.1], NEPTUNE)
    })
  ]
};

/**
 * The **rings** of Jupiter, Saturn, Uranus and Neptune, keyed by planet id:
 * each ring's edges and optical depth, and Saturn's named gaps, from the PDS
 * Ring-Moon Systems Node and NASA NSSDCA.
 *
 * Kept apart from {@link PLANETS}, so an app loads them only when it shows
 * them. {@link withObservations} puts them on the planets, as their
 * `observations.rings`; see `PLANETS` for how they were chosen.
 *
 * @group Observations
 * @example
 * ```ts
 * PLANET_RINGS.saturn.rings?.rings.length; // 9
 * ```
 */
export const PLANET_RINGS: ByBodyIdType<
  Pick<PlanetObservationsInterface, 'rings'>
> = {
  jupiter: { rings: JUPITER_RINGS },
  saturn: { rings: SATURN_RINGS },
  uranus: { rings: URANUS_RINGS },
  neptune: { rings: NEPTUNE_RINGS }
};
