import type { DistanceInterface } from './distance.js';
import type { DegreesType, ValueInterface } from './numeric.js';
import type { CelestialDirectionInterface } from './orbits.js';
import type {
  GalacticDirectionInterface,
  ProperMotionInterface
} from './positions.js';
import type {
  AccelerationInterface,
  AngleInterface,
  DensityInterface,
  DexInterface,
  DimensionlessInterface,
  FractionInterface,
  GravitationalParameterInterface,
  IrradianceInterface,
  MagneticFieldInterface,
  MagneticMomentInterface,
  MagnitudeInterface,
  MassInterface,
  PeriodChangeInterface,
  PressureInterface,
  SpeedInterface,
  SpinAccelerationInterface,
  TemperatureInterface,
  ThermalInertiaInterface
} from './quantities.js';
import type { TemporalInterface, TimeScaleType } from './temporal.js';

/**
 * What telescopes and spacecraft **measure** about a body, kept apart from
 * the model the equations use (`orbit`, `rotation`, `radius`, `mu`) and from
 * how it's drawn (`display`).
 *
 * Every measured value can carry its uncertainty, where it came from, and
 * whether it was measured or assumed, through {@link ObservedType}.
 *
 * @module
 */

/**
 * How a value was obtained.
 *
 * - `'measured'`: observed directly.
 * - `'derived'`: computed from other measured values.
 * - `'modelled'`: the output of a model fit.
 * - `'estimated'`: a catalogue estimate, such as a diameter from H and an
 *   assumed albedo.
 * - `'assumed'`: a convention or placeholder, such as tidal locking.
 *
 * @group Observations
 */
export type ProvenanceType =
  'measured' | 'derived' | 'modelled' | 'estimated' | 'assumed';

/**
 * The **catalogues** the datasets in `@interstellar-tools/constants` draw on.
 * Any other name is accepted too.
 *
 * @group Observations
 */
export type ObservationCatalogType =
  | 'JPL SSD'
  | 'JPL SBDB'
  | 'JPL Horizons'
  | 'MPC'
  | 'IAU WGCCRE'
  | 'NASA Exoplanet Archive'
  | 'Gaia DR3'
  | 'Hipparcos'
  | 'SIMBAD'
  | 'NED'
  | 'HyperLEDA'
  | 'PDS'
  | (string & {});

/**
 * Where a value **came from**.
 *
 * @example
 * ```ts
 * const source: ObservationSourceInterface = {
 *   catalog: 'NASA Exoplanet Archive',
 *   reference: '10.1088/2041-8205/772/2/L16'
 * };
 * ```
 * @group Observations
 */
export interface ObservationSourceInterface {
  /** The catalogue or archive the value was taken from. */
  catalog: ObservationCatalogType;
  /** The DOI or ADS bibcode of the paper behind the value. */
  reference?: string;
  /** The page the value was read from. */
  url?: string;
  /** When the value was taken from the catalogue. */
  retrievedAt?: Date;
}

/**
 * A moment as a **Julian date on a named time scale**, as catalogues give
 * osculating epochs and transit times.
 *
 * @example
 * ```ts
 * // J2000, as JPL gives element epochs
 * const epoch: EpochInterface = { jd: 2451545, timeScale: 'TDB' };
 * ```
 * @group Observations
 */
export interface EpochInterface {
  /** The Julian date. */
  jd: number;
  /** The time scale it counts in, `'TDB'` for JPL's elements. */
  timeScale: TimeScaleType;
}

/**
 * An **uncertainty**, in the value's own unit. Equal `plus` and `minus` is a
 * symmetric ±σ.
 *
 * @group Observations
 */
export interface UncertaintyInterface {
  /** The upper error bar. */
  plus: number;
  /** The lower error bar, as a positive number. */
  minus: number;
  /** How many σ the interval is wide. Left out, 1σ, 68.3 %. */
  sigma?: 1 | 2 | 3;
}

/**
 * What can travel with any **measured value**.
 *
 * @group Observations
 */
export interface ObservationMetaInterface {
  /** The error bars, in the value's unit. */
  uncertainty?: UncertaintyInterface;
  /** Set when the value is only a bound, not a detection. */
  limit?: 'upper' | 'lower';
  /** How the value was obtained. */
  provenance?: ProvenanceType;
  /** Where the value came from. */
  source?: ObservationSourceInterface;
  /** When the value holds, for one that changes. */
  epoch?: EpochInterface;
  /** How it was measured, such as `'stellar occultation'` or `'radar'`. */
  method?: string;
  /** A remark. */
  note?: string;
}

/**
 * Any unit-carrying value with **measurement metadata**. A plain value of
 * the same kind fits too.
 *
 * @example
 * ```ts
 * const radius: ObservedType<DistanceInterface> = {
 *   value: 58232,
 *   unit: 'km',
 *   uncertainty: { plus: 6, minus: 6 },
 *   source: { catalog: 'JPL SSD' }
 * };
 * const albedo: ObservedType = { value: 0.499, provenance: 'measured' };
 * ```
 * @group Observations
 */
export type ObservedType<T extends ValueInterface = DimensionlessInterface> =
  T & ObservationMetaInterface;

/**
 * A quantity given as a **range**, such as a surface's day and night
 * temperatures.
 *
 * @group Observations
 */
export interface ObservedRangeInterface<T extends ValueInterface> {
  /** The lowest value. */
  min: ObservedType<T>;
  /** The highest value. */
  max: ObservedType<T>;
  /** The mean, where one is given. */
  mean?: ObservedType<T>;
}

/**
 * **Catalogue identifiers**, besides the body's own `id` and `name`.
 *
 * @group Observations
 */
export interface IdentifiersInterface {
  /** JPL's SPK ID, as Horizons and SPICE use. */
  spkId?: number;
  /** The Minor Planet Center's designation, packed or unpacked. */
  mpcDesignation?: string;
  /** The minor planet number, such as `433` for Eros. */
  minorPlanetNumber?: number;
  /** The Gaia DR3 source ID. */
  gaiaDr3?: string;
  /** The Hipparcos catalogue number. */
  hip?: number;
  /** The Henry Draper catalogue number. */
  hd?: number;
  /** The TESS Input Catalog ID. */
  tic?: number;
  /** Other catalogue IDs, such as `{ NGC: '224', PGC: '2557' }`. */
  catalogs?: Record<string, string>;
  /** Other names the body goes by. */
  aliases?: string[];
}

/**
 * How and when a body was **discovered**.
 *
 * @group Observations
 */
export interface DiscoveryInterface {
  /** The date, where the day is known. */
  date?: Date;
  /** The year. */
  year?: number;
  /** The people credited. */
  discoverers?: string[];
  /** The observatory, mission or survey, such as `'Pan-STARRS1'`. */
  facility?: string;
  /** How it was found, such as `'transit'` or `'photographic plates'`. */
  method?: string;
}

/**
 * **Photometric bands**: Johnson–Cousins, 2MASS, Gaia, SDSS, WISE and GALEX.
 * Any other band is accepted too.
 *
 * @group Observations
 */
export type PhotometricBandType =
  | 'U'
  | 'B'
  | 'V'
  | 'R'
  | 'I'
  | 'J'
  | 'H'
  | 'K'
  | 'Ks'
  | 'G'
  | 'BP'
  | 'RP'
  | 'u'
  | 'g'
  | 'r'
  | 'i'
  | 'z'
  | 'W1'
  | 'W2'
  | 'W3'
  | 'W4'
  | 'FUV'
  | 'NUV'
  | (string & {});

/**
 * **Magnitudes** by photometric band.
 *
 * @group Observations
 */
export type MagnitudesByBandType = Partial<
  Record<PhotometricBandType, ObservedType<MagnitudeInterface>>
>;

/**
 * A **proper motion** with an uncertainty for each component, in mas/yr.
 *
 * @group Observations
 */
export interface ObservedProperMotionInterface
  extends ProperMotionInterface, Omit<ObservationMetaInterface, 'uncertainty'> {
  /** The error bars of each component, in mas/yr. */
  uncertainty?: {
    rightAscension: UncertaintyInterface;
    declination: UncertaintyInterface;
  };
}

/**
 * Where a body outside the Solar System is **on the sky**, and how it moves.
 *
 * @group Observations
 */
export interface AstrometryInterface {
  /** The ICRS position. */
  direction: CelestialDirectionInterface;
  /** The epoch of `direction`, such as J2016.0 for Gaia DR3. */
  epoch?: EpochInterface;
  /** The same position in galactic coordinates. */
  galactic?: GalacticDirectionInterface;
  /** The trigonometric parallax. */
  parallax?: ObservedType<AngleInterface>;
  /** The proper motion, μα* and μδ. */
  properMotion?: ObservedProperMotionInterface;
  /** The velocity along the line of sight, positive moving away. */
  radialVelocity?: ObservedType<SpeedInterface>;
  /** The distance from the Sun. */
  distance?: ObservedType<DistanceInterface>;
}

/**
 * Measured **mass and gravity**. The body's own `mu` stays the value the
 * equations use.
 *
 * @group Observations
 */
export interface MassPropertiesInterface {
  /** The mass. */
  mass?: ObservedType<MassInterface>;
  /** $GM$ with its uncertainty, usually better known than the mass. */
  gm?: ObservedType<GravitationalParameterInterface>;
  /** The bulk density. */
  bulkDensity?: ObservedType<DensityInterface>;
  /** The gravity at the surface, on the equator. */
  surfaceGravity?: ObservedType<AccelerationInterface>;
  /** The escape speed from the surface. */
  escapeVelocity?: ObservedType<SpeedInterface>;
  /** The normalised moment of inertia, $C / MR^2$. */
  momentOfInertiaFactor?: ObservedType;
  /** The second zonal gravity harmonic, $J_2$. */
  j2?: ObservedType;
}

/**
 * Measured **size and shape**, with uncertainties. The body's `radius` and
 * `ellipsoid` stay the values the equations use.
 *
 * @group Observations
 */
export interface SizeObservationsInterface {
  /** The mean radius, with its uncertainty and method. */
  meanRadius?: ObservedType<DistanceInterface>;
  /** The volume-equivalent diameter, as small bodies are usually given. */
  effectiveDiameter?: ObservedType<DistanceInterface>;
  /** The triaxial semi-axes, a ≥ b ≥ c. */
  triaxialRadii?: readonly [
    a: ObservedType<DistanceInterface>,
    b: ObservedType<DistanceInterface>,
    c: ObservedType<DistanceInterface>
  ];
  /** The flattening, $(a - c) / a$. */
  flattening?: ObservedType;
  /** The shape model, such as a PDS or DAMIT model ID. */
  shapeModel?: string;
}

/**
 * How **bright** a body is, and how it reflects light.
 *
 * @group Observations
 */
export interface ReflectanceInterface {
  /** The geometric albedo. */
  geometricAlbedo?: ObservedType;
  /** The Bond albedo. */
  bondAlbedo?: ObservedType;
  /** H for small bodies, V(1,0) for planets and moons. */
  absoluteMagnitude?: ObservedType<MagnitudeInterface>;
  /** The IAU's H–G phase slope, G. */
  slopeG?: ObservedType;
  /** G1, of the H–G1–G2 system. */
  slopeG1?: ObservedType;
  /** G2, of the H–G1–G2 system. */
  slopeG2?: ObservedType;
  /** Colour indices, such as `{ 'B-V': …, 'g-r': … }`. */
  colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
  /** Apparent magnitudes, at their `epoch`. */
  apparentMagnitudes?: MagnitudesByBandType;
}

/**
 * Measured **temperatures** and heat.
 *
 * @group Observations
 */
export interface ThermalObservationsInterface {
  /** The blackbody equilibrium temperature. */
  equilibriumTemperature?: ObservedType<TemperatureInterface>;
  /** A solid body's surface temperature, or its range. */
  surfaceTemperature?:
    | ObservedType<TemperatureInterface>
    | ObservedRangeInterface<TemperatureInterface>;
  /** A giant planet's temperature at the 1-bar level. */
  oneBarTemperature?: ObservedType<TemperatureInterface>;
  /** An exoplanet's dayside brightness temperature, from its secondary eclipse. */
  daysideTemperature?: ObservedType<TemperatureInterface>;
  /** An exoplanet's nightside brightness temperature, from its phase curve. */
  nightsideTemperature?: ObservedType<TemperatureInterface>;
  /** Emitted over absorbed power: above 1, the body has heat of its own. */
  energyBalance?: ObservedType;
  /** Internal or tidal heat flowing out through the surface. */
  heatFlow?: ObservedType<IrradianceInterface>;
  /** The surface's thermal inertia. */
  thermalInertia?: ObservedType<ThermalInertiaInterface>;
}

/**
 * A **chemical species**, and how much of it there is.
 *
 * @group Observations
 */
export interface SpeciesAbundanceInterface {
  /** A formula or name, such as `'N2'`, `'CH4'`, `'H2O'` or `'Na'`. */
  species: string;
  /** How much, as a share or in dex. */
  abundance?: ObservedType<FractionInterface | DexInterface>;
  /** `true` when it's detected without an amount. */
  detectedOnly?: boolean;
  /** How, such as `'transmission spectroscopy'`. */
  method?: string;
}

/**
 * An observed **cloud or haze layer**.
 *
 * @group Observations
 */
export interface CloudLayerInterface {
  /** What it's made of, such as `'NH3 ice'` or `'H2SO4'`. */
  composition?: string;
  /** The pressure at its top. */
  topPressure?: ObservedType<PressureInterface>;
  /** The pressure at its base. */
  basePressure?: ObservedType<PressureInterface>;
  /** The share of the globe it covers. */
  coverage?: ObservedType<FractionInterface>;
}

/**
 * A lasting **feature of an atmosphere**, such as a storm.
 *
 * @group Observations
 */
export interface AtmosphericFeatureInterface {
  /** Its name, such as `'Great Red Spot'`. */
  name: string;
  /** The planetographic latitude of its centre. */
  latitude?: DegreesType;
  /** Its size, east to west. */
  size?: ObservedType<DistanceInterface>;
  /** When it was first seen. */
  firstObserved?: Date;
  /** When it was last seen, set once it has gone. */
  lastObserved?: Date;
}

/**
 * A body's **atmosphere**, as observed. Not {@link AtmosphereInterface}, which
 * is Earth's upper atmosphere from a model.
 *
 * @group Observations
 */
export interface PlanetaryAtmosphereInterface {
  /** Whether there is one, and how much. */
  presence: 'substantial' | 'thin' | 'exosphere' | 'none' | 'unconstrained';
  /** The pressure at a solid body's surface. */
  surfacePressure?: ObservedType<PressureInterface>;
  /** The pressure scale height. */
  scaleHeight?: ObservedType<DistanceInterface>;
  /** The mean molecular weight, in g/mol. */
  meanMolecularWeight?: ObservedType;
  /** Its gases, and how much of each. */
  composition?: SpeciesAbundanceInterface[];
  /** Cloud and haze layers. */
  clouds?: CloudLayerInterface[];
  /** Lasting features, such as storms. */
  features?: AtmosphericFeatureInterface[];
  /** How it changes with the seasons or over the years, as Pluto's does. */
  variability?: string;
}

/**
 * What a solid **surface** is made of, and looks like.
 *
 * @group Observations
 */
export interface SurfaceObservationsInterface {
  /** Materials found by spectroscopy or on the spot. */
  materials?: SpeciesAbundanceInterface[];
  /** Liquids on the surface, such as water on Earth or methane on Titan. */
  liquids?: { substance: string; coverage?: ObservedType<FractionInterface> }[];
  /** Such as `['impact craters', 'cryovolcanism', 'tholins']`. */
  features?: string[];
  /** Its age, from crater counts. */
  age?: ObservedType<TemporalInterface>;
}

/**
 * One **ring** of a planet.
 *
 * @group Observations
 */
export interface RingInterface {
  /** Its name, such as `'A'` or `'ε'`. */
  name: string;
  /** Its inner edge, from the planet's centre. */
  innerRadius: ObservedType<DistanceInterface>;
  /** Its outer edge, from the planet's centre. */
  outerRadius: ObservedType<DistanceInterface>;
  /** Its normal optical depth, τ. */
  normalOpticalDepth?: ObservedType;
  /** The geometric albedo of its particles. */
  geometricAlbedo?: ObservedType;
  /** How thick it is. */
  thickness?: ObservedType<DistanceInterface>;
  /** Such as `'water ice'` or `'dark carbonaceous dust'`. */
  composition?: string;
}

/**
 * A named **gap** in a ring system, such as the Cassini Division.
 *
 * @group Observations
 */
export interface RingGapInterface {
  /** Its name. */
  name: string;
  /** Its inner edge, from the planet's centre. */
  innerRadius: ObservedType<DistanceInterface>;
  /** Its outer edge, from the planet's centre. */
  outerRadius: ObservedType<DistanceInterface>;
  /** Its normal optical depth, τ: low, but rarely 0. */
  normalOpticalDepth?: ObservedType;
}

/**
 * A planet's **ring system**, in its equator's plane.
 *
 * @example
 * ```ts
 * const saturn: RingSystemInterface = {
 *   rings: [
 *     {
 *       name: 'A',
 *       innerRadius: { value: 122170, unit: 'km' },
 *       outerRadius: { value: 136775, unit: 'km' }
 *     }
 *   ]
 * };
 * ```
 * @group Observations
 */
export interface RingSystemInterface {
  /** Its rings, from the inside out. */
  rings: RingInterface[];
  /** Its named gaps. */
  gaps?: RingGapInterface[];
  /** Ids of the moons that shepherd or shape it. */
  shepherdIds?: string[];
}

/**
 * A body's **magnetic field**.
 *
 * @group Observations
 */
export interface MagnetosphereInterface {
  /** Where the field comes from. */
  origin: 'intrinsic' | 'induced' | 'remanent' | 'none' | 'unknown';
  /** The dipole moment. */
  dipoleMoment?: ObservedType<MagneticMomentInterface>;
  /** The field at the surface, on the equator. */
  equatorialSurfaceField?: ObservedType<MagneticFieldInterface>;
  /** The angle between the dipole and the spin axis. */
  dipoleTilt?: DegreesType;
}

/**
 * **Light-curve results** that {@link RotationInterface} has no room for.
 *
 * @group Observations
 */
export interface RotationObservationsInterface {
  /** `rotation.period` with its uncertainty. */
  period?: ObservedType<TemporalInterface>;
  /** The light curve's peak-to-peak amplitude. */
  lightcurveAmplitude?: ObservedType<MagnitudeInterface>;
  /** How fast the spin speeds up, as YORP is given. */
  spinAcceleration?: ObservedType<SpinAccelerationInterface>;
  /** How fast the period lengthens. */
  periodChange?: ObservedType<PeriodChangeInterface>;
  /** The spin pole of a small body that has no IAU rotation model. */
  pole?:
    | CelestialDirectionInterface
    | { eclipticLongitude: DegreesType; eclipticLatitude: DegreesType };
}

/**
 * The **non-gravitational** parameters of Marsden's model.
 *
 * @group Observations
 */
export interface NonGravitationalInterface {
  /** The radial component, A1. */
  a1?: ObservedType<AccelerationInterface>;
  /** The transverse component, A2: for an asteroid, its Yarkovsky drift. */
  a2?: ObservedType<AccelerationInterface>;
  /** The normal component, A3. */
  a3?: ObservedType<AccelerationInterface>;
  /** How long after perihelion outgassing peaks, ΔT. */
  dt?: ObservedType<TemporalInterface>;
}

/**
 * The **orbit determination** behind `orbit`: how well its elements are
 * known.
 *
 * @group Observations
 */
export interface OrbitSolutionInterface {
  /** The catalogue solution's osculating epoch. */
  epoch?: EpochInterface;
  /** JPL's condition code, 0 (best) to 9, or the MPC's U parameter. */
  conditionCode?: number;
  /** The time from the first observation used to the last. */
  observationArc?: TemporalInterface;
  /** How many observations were used. */
  observationCount?: number;
  /** The first observation used. */
  firstObservation?: Date;
  /** The last observation used. */
  lastObservation?: Date;
  /** The elements' 1σ uncertainties, in the units `orbit` gives them in. */
  sigma?: Partial<
    Record<'a' | 'e' | 'i' | 'w' | 'om' | 'q' | 'period', number>
  >;
  /** The minimum orbit intersection distance with Earth. */
  earthMoid?: DistanceInterface;
  /** The minimum orbit intersection distance with Jupiter. */
  jupiterMoid?: DistanceInterface;
  /** The Tisserand parameter with respect to Jupiter. */
  tisserandJupiter?: number;
  /** The non-gravitational parameters fitted with the orbit. */
  nonGravitational?: NonGravitationalInterface;
  /** Where the solution came from. */
  source?: ObservationSourceInterface;
}

/**
 * What every **solid or planetary body** can have measured: planets, moons
 * and small bodies.
 *
 * @group Observations
 */
export interface SolidBodyObservationsInterface {
  /** Catalogue identifiers. */
  identifiers?: IdentifiersInterface;
  /** How it was discovered. */
  discovery?: DiscoveryInterface;
  /** How well its orbit is known. */
  orbitSolution?: OrbitSolutionInterface;
  /** Its measured spin. */
  rotation?: RotationObservationsInterface;
  /** Its measured size and shape. */
  size?: SizeObservationsInterface;
  /** Its measured mass and gravity. */
  massProperties?: MassPropertiesInterface;
  /** Its brightness and reflectance. */
  reflectance?: ReflectanceInterface;
  /** Its temperatures and heat. */
  thermal?: ThermalObservationsInterface;
  /** Its atmosphere. */
  atmosphere?: PlanetaryAtmosphereInterface;
  /** Its surface. */
  surface?: SurfaceObservationsInterface;
  /** Its magnetic field. */
  magnetosphere?: MagnetosphereInterface;
  /** Sources for the record as a whole. */
  sources?: ObservationSourceInterface[];
}
