import type { DistanceInterface } from '../distance.js';
import type { DegreesType } from '../numeric.js';
import type {
  AstrometryInterface,
  DiscoveryInterface,
  EpochInterface,
  IdentifiersInterface,
  MagnitudesByBandType,
  MassPropertiesInterface,
  ObservationSourceInterface,
  ObservedType,
  OrbitSolutionInterface,
  PhotometricBandType,
  ReflectanceInterface,
  RingSystemInterface,
  RotationObservationsInterface,
  SizeObservationsInterface,
  SolidBodyObservationsInterface,
  SpeciesAbundanceInterface,
  SurfaceObservationsInterface
} from '../observations.js';
import type { CelestialDirectionInterface } from '../orbits.js';
import type {
  AccelerationInterface,
  AngleInterface,
  DexInterface,
  EnergyInterface,
  EventRateInterface,
  FluxDensityInterface,
  FractionInterface,
  InverseDistanceInterface,
  IrradianceInterface,
  LuminosityInterface,
  MagneticFieldInterface,
  MagnitudeInterface,
  MassInterface,
  MassRateInterface,
  ProductionRateInterface,
  SpeedInterface,
  TemperatureInterface
} from '../quantities.js';
import type { TemporalInterface } from '../temporal.js';

/**
 * What is **measured** about each kind of body in this package: the type of
 * each body interface's optional `observations`.
 *
 * Lists of other bodies, such as a planet's moons, aren't kept here: they
 * follow from the datasets' `parent`s.
 *
 * @module
 */

/* Planets */

/**
 * How an **exoplanet** was found.
 *
 * @group Observations
 */
export type ExoplanetDetectionMethodType =
  | 'transit'
  | 'radial velocity'
  | 'imaging'
  | 'microlensing'
  | 'transit timing variations'
  | 'eclipse timing variations'
  | 'astrometry'
  | 'pulsar timing'
  | 'orbital brightness modulation'
  | 'disk kinematics';

/**
 * **Transit** measurements of an exoplanet.
 *
 * @group Observations
 */
export interface TransitObservationsInterface {
  /** A reference time of mid-transit. */
  midpoint?: EpochInterface;
  /** How deep the dip is. */
  depth?: ObservedType<FractionInterface>;
  /** From first to fourth contact. */
  duration?: ObservedType<TemporalInterface>;
  /** The impact parameter, b. */
  impactParameter?: ObservedType;
  /** The planet's radius over its star's, $R_p / R_\star$. */
  radiusRatio?: ObservedType;
  /** The semi-major axis over the star's radius, $a / R_\star$. */
  scaledSemiMajorAxis?: ObservedType;
  /** The amplitude of its transit timing variations. */
  ttvAmplitude?: ObservedType<TemporalInterface>;
}

/**
 * What is measured about a planet **outside the Solar System**.
 *
 * @example
 * ```ts
 * const trappist1e: ExoplanetObservationsInterface = {
 *   detectionMethod: 'transit',
 *   massKind: 'true'
 * };
 * ```
 * @group Observations
 */
export interface ExoplanetObservationsInterface {
  /** How it was found. */
  detectionMethod: ExoplanetDetectionMethodType;
  /** Whether `massProperties.mass` is a true mass, a minimum mass or an estimate. */
  massKind?: 'true' | 'minimum' | 'mass-radius relation';
  /** The radial-velocity semi-amplitude, K. */
  radialVelocitySemiAmplitude?: ObservedType<SpeedInterface>;
  /** Its transits. */
  transit?: TransitObservationsInterface;
  /** Secondary-eclipse depths, by band. */
  eclipseDepths?: Partial<
    Record<PhotometricBandType, ObservedType<FractionInterface>>
  >;
  /** The light it gets from its star. */
  insolation?: ObservedType<IrradianceInterface>;
  /** The projected spin–orbit angle λ, from the Rossiter–McLaughlin effect. */
  spinOrbitAngle?: ObservedType<AngleInterface>;
  /** Species found by spectroscopy. */
  spectroscopicDetections?: SpeciesAbundanceInterface[];
  /** Whether `rotation` is measured, or assumed tidally locked. */
  rotationBasis?: 'measured' | 'assumed tidally locked';
}

/**
 * What is measured about a **planet** or planetoid.
 *
 * @example
 * ```ts
 * const saturn: PlanetObservationsInterface = {
 *   massProperties: { bulkDensity: { value: 0.687, unit: 'g/cm3' } },
 *   thermal: { oneBarTemperature: { value: 134, unit: 'K' } },
 *   rings: {
 *     rings: [
 *       {
 *         name: 'A',
 *         innerRadius: { value: 122170, unit: 'km' },
 *         outerRadius: { value: 136775, unit: 'km' }
 *       }
 *     ]
 *   }
 * };
 * ```
 * @group Observations
 */
// eslint-disable-next-line @stylistic/max-len
export interface PlanetObservationsInterface extends SolidBodyObservationsInterface {
  /** Its rings. */
  rings?: RingSystemInterface;
  /** Given for a planet outside the Solar System. */
  exoplanet?: ExoplanetObservationsInterface;
}

/* Moons */

/**
 * What a **kinetic impact** did to a moon, as DART's did to Dimorphos.
 *
 * @group Observations
 */
export interface ImpactExperimentInterface {
  /** The mission. */
  mission: string;
  /** When it hit. */
  date: Date;
  /** How much the orbital period changed. */
  periodChange: ObservedType<TemporalInterface>;
  /** The momentum enhancement factor, β. */
  momentumEnhancement?: ObservedType;
}

/**
 * What is measured about a **moon**.
 *
 * @group Observations
 */
// eslint-disable-next-line @stylistic/max-len
export interface MoonObservationsInterface extends SolidBodyObservationsInterface {
  /** Such as `'Galilean'`, `'Himalia group'` or `'co-orbital'`. */
  group?: string;
  /** Its mean-motion resonances, such as `['Laplace 1:2:4 with Europa and Ganymede']`. */
  resonances?: string[];
  /** Its part in a ring system. */
  ringInteraction?: 'shepherd' | 'embedded' | 'source';
  /** The evidence for an ocean under its surface. */
  subsurfaceOcean?: 'confirmed' | 'likely' | 'possible' | 'none';
  /** Activity seen: plumes, volcanism, geysers. */
  activity?: {
    kind: 'plumes' | 'volcanism' | 'geysers' | (string & {});
    firstObserved?: Date;
    facility?: string;
  }[];
  /** A kinetic impact's results, for an asteroid's moon. */
  impactExperiment?: ImpactExperimentInterface;
}

/* Asteroids */

/**
 * **Spectral taxonomy** finer than {@link AsteroidSpectralType}.
 *
 * @group Observations
 */
export interface AsteroidTaxonomyInterface {
  /** The Tholen class, such as `'S'`, `'C'` or `'M'`. */
  tholen?: string;
  /** The Bus–DeMeo class, such as `'Sq'` or `'Xk'`. */
  busDeMeo?: string;
  /** The SMASSII class. */
  smassII?: string;
}

/**
 * An **impact risk** assessment of a near-Earth object.
 *
 * @group Observations
 */
export interface ImpactRiskInterface {
  /** The cumulative impact probability over the span assessed. */
  cumulativeProbability: number;
  /** The Palermo technical scale. */
  palermoScale?: number;
  /** The Torino scale. */
  torinoScale?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /** Who assessed it, such as `'JPL Sentry'` or `'ESA NEOCC'`. */
  assessedBy: string;
  /** When it was assessed. */
  assessedAt: Date;
  /** The next close approach. */
  nextCloseApproach?: {
    date: Date;
    distance: DistanceInterface;
    /** The id of the body it passes, such as `'earth'`. */
    bodyId: string;
  };
}

/**
 * A **spacecraft's visit** to a small body.
 *
 * @group Observations
 */
export interface MissionVisitInterface {
  /** The mission, such as `'OSIRIS-REx'`. */
  name: string;
  /** What it did there. */
  kind: 'flyby' | 'orbiter' | 'lander' | 'impactor' | 'sample return';
  /** When it arrived or passed. */
  date: Date;
}

/**
 * What is measured about an **asteroid**.
 *
 * @group Observations
 */
// eslint-disable-next-line @stylistic/max-len
export interface AsteroidObservationsInterface extends SolidBodyObservationsInterface {
  /** Its spectral taxonomy. */
  taxonomy?: AsteroidTaxonomyInterface;
  /** Its collisional family, such as `'Vesta'` or `'Flora'`. */
  family?: string;
  /** A near-Earth object: perihelion closer than 1.3 au. */
  nearEarthObject?: boolean;
  /** Potentially hazardous: an Earth MOID of 0.05 au or less, and H of 22 or less. */
  potentiallyHazardous?: boolean;
  /** An impact risk assessment. */
  impactRisk?: ImpactRiskInterface;
  /** Shows activity like a comet's. */
  active?: boolean;
  /** Spacecraft visits. */
  missions?: MissionVisitInterface[];
}

/* Comets and interstellar objects */

/**
 * A comet's **magnitude law**: $m = M + 5\log_{10}\Delta + K\log_{10} r$.
 *
 * @group Observations
 */
export interface MagnitudeLawInterface {
  /** M1 (total) or M2 (nuclear). */
  absolute: ObservedType<MagnitudeInterface>;
  /** K1 (total) or K2 (nuclear). */
  slope: ObservedType;
}

/**
 * How fast a comet gives off one **species**.
 *
 * @group Observations
 */
export interface CometProductionRateInterface {
  /** Such as `'H2O'`, `'OH'`, `'CO'`, `'CO2'`, `'CN'`, `'C2'` or `'HCN'`. */
  species: string;
  /** In molecules a second. */
  rate: ObservedType<ProductionRateInterface>;
  /** Its distance from the Sun when measured. */
  heliocentricDistance?: DistanceInterface;
}

/**
 * One observed **comet tail**.
 *
 * @group Observations
 */
export interface CometTailInterface {
  /** What kind. */
  kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
  /** How long, in space or on the sky. */
  length?: ObservedType<DistanceInterface | AngleInterface>;
}

/**
 * A comet's **activity**: its coma, tails and outgassing.
 *
 * @group Observations
 */
export interface CometActivityInterface {
  /** A'Hearn's dust proxy, Afρ. */
  afRho?: ObservedType<DistanceInterface>;
  /** How much dust it gives off. */
  dustProduction?: ObservedType<MassRateInterface>;
  /** How much gas, by species. */
  productionRates?: CometProductionRateInterface[];
  /** How wide its coma is. */
  comaDiameter?: ObservedType<DistanceInterface>;
  /** Its tails. */
  tails?: CometTailInterface[];
  /** Its distance from the Sun when activity was first seen. */
  activityOnset?: DistanceInterface;
  /** Its outbursts. */
  outbursts?: { date: Date; amplitude?: ObservedType<MagnitudeInterface> }[];
  /** Its breakups. */
  fragmentations?: { date: Date; fragmentCount?: number }[];
  /** Isotope ratios, such as `{ 'D/H': … }`. */
  isotopeRatios?: Record<string, ObservedType>;
}

/**
 * A comet's **nucleus**.
 *
 * @group Observations
 */
export interface CometNucleusInterface {
  /** Its size and shape. */
  size?: SizeObservationsInterface;
  /** Its mass and density. */
  massProperties?: MassPropertiesInterface;
  /** Its albedo and brightness. */
  reflectance?: ReflectanceInterface;
  /** Its spin. */
  rotation?: RotationObservationsInterface;
  /** The share of its surface that outgasses. */
  activeFraction?: ObservedType<FractionInterface>;
  /** Its surface. */
  surface?: SurfaceObservationsInterface;
}

/**
 * What is measured about a **comet**.
 *
 * @group Observations
 */
export interface CometObservationsInterface {
  /** Catalogue identifiers. */
  identifiers?: IdentifiersInterface;
  /** How it was discovered. */
  discovery?: DiscoveryInterface;
  /** How well its orbit is known, with the non-gravitational parameters. */
  orbitSolution?: OrbitSolutionInterface;
  /** For a long-period comet, its original $1/a$, before the planets pulled on it. */
  originalInverseSemiMajorAxis?: ObservedType<InverseDistanceInterface>;
  /** Its nucleus. */
  nucleus?: CometNucleusInterface;
  /** Its total magnitude law, M1 and K1. */
  totalMagnitude?: MagnitudeLawInterface;
  /** Its nuclear magnitude law, M2 and K2. */
  nuclearMagnitude?: MagnitudeLawInterface;
  /** Its coma, tails and outgassing. */
  activity?: CometActivityInterface;
  /** Sources for the record as a whole. */
  sources?: ObservationSourceInterface[];
}

/**
 * What is measured about an **interstellar object**.
 *
 * @group Observations
 */
// eslint-disable-next-line @stylistic/max-len
export interface InterstellarObjectObservationsInterface extends CometObservationsInterface {
  /** `orbit.excessSpeed`, with its uncertainty. */
  excessSpeed?: ObservedType<SpeedInterface>;
  /** The direction it came from, its radiant, in the ICRS. */
  incomingRadiant?: CelestialDirectionInterface;
  /** A push beyond gravity without a coma, as ʻOumuamua had. */
  anomalousAcceleration?: ObservedType<AccelerationInterface>;
}

/* Stars */

/**
 * The MK **luminosity classes**.
 *
 * @group Observations
 */
export type LuminosityClassType =
  '0' | 'Ia' | 'Iab' | 'Ib' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';

/**
 * {@link StarInterface.type} **split into its parts**. A class given as a
 * range, such as Spica's `'B1III-IV'` or Betelgeuse's `'M1-M2Ia-Iab'`, takes
 * both ends.
 *
 * @example
 * ```ts
 * const betelgeuse: SpectralClassificationInterface = {
 *   raw: 'M1-M2Ia-Iab',
 *   spectralClass: 'M',
 *   subclass: [1, 2],
 *   luminosityClass: ['Ia', 'Iab']
 * };
 * ```
 * @group Observations
 */
export interface SpectralClassificationInterface {
  /** As published: `StarInterface.type`, such as `'G2V'`. */
  raw: string;
  /** The spectral class letter. */
  spectralClass?:
    | 'O'
    | 'B'
    | 'A'
    | 'F'
    | 'G'
    | 'K'
    | 'M'
    | 'L'
    | 'T'
    | 'Y'
    | 'W'
    | 'C'
    | 'S'
    | 'D'
    | (string & {});
  /** The subclass, such as `2` in G2V, or a range, `[1, 2]` in M1-M2. */
  subclass?: number | readonly [number, number];
  /** The luminosity class, or a range, `['III', 'IV']` in B1III-IV. */
  luminosityClass?:
    LuminosityClassType | readonly [LuminosityClassType, LuminosityClassType];
  /** Peculiarity codes, such as `'e'`, `'m'`, `'p'` or `'n'`. */
  peculiarities?: string[];
}

/**
 * Where a star is in its **life**.
 *
 * @group Observations
 */
export type StellarEvolutionaryStageType =
  | 'pre-main-sequence'
  | 'main sequence'
  | 'subgiant'
  | 'red giant branch'
  | 'horizontal branch'
  | 'asymptotic giant branch'
  | 'supergiant'
  | 'white dwarf'
  | 'neutron star'
  | 'brown dwarf';

/**
 * How a star's brightness **varies**.
 *
 * @group Observations
 */
export interface VariabilityInterface {
  /** The GCVS type, such as `'SRc'`, `'UV'`, `'DSCT'`, `'EA'` or `'DCEP'`. */
  type: string;
  /** The period, for a periodic variable. */
  period?: ObservedType<TemporalInterface>;
  /** The amplitude. */
  amplitude?: ObservedType<MagnitudeInterface>;
  /** The band the amplitude is measured in. */
  band?: PhotometricBandType;
}

/**
 * A fitted **limb-darkening** law, in one band.
 *
 * @group Observations
 */
export interface LimbDarkeningInterface {
  /** The law the coefficients belong to. */
  law: 'linear' | 'quadratic' | 'square-root' | 'nonlinear' | 'power-2';
  /** The band they were fitted in. */
  band: PhotometricBandType;
  /** The coefficients, in the law's order. */
  coefficients: ObservedType[];
}

/**
 * A star's **magnetic activity**.
 *
 * @group Observations
 */
export interface StellarActivityInterface {
  /** The chromospheric index, log R′HK. */
  logRhk?: ObservedType<DexInterface>;
  /** The X-ray luminosity. */
  xrayLuminosity?: ObservedType<LuminosityInterface>;
  /** How often it flares above `flareEnergyThreshold`. */
  flareRate?: ObservedType<EventRateInterface>;
  /** The energy `flareRate` counts flares above. */
  flareEnergyThreshold?: ObservedType<EnergyInterface>;
  /** The share of the surface covered by spots. */
  spotCoverage?: ObservedType<FractionInterface>;
  /** The mean magnetic field at the surface. */
  meanMagneticField?: ObservedType<MagneticFieldInterface>;
  /** The activity cycle, such as the Sun's 11 years. */
  cycleLength?: ObservedType<TemporalInterface>;
}

/**
 * What is measured about a **star**. Its own `mass` (M☉) and `radius` stay
 * the values the equations use; these carry uncertainties and methods.
 *
 * @example
 * ```ts
 * const sun: StarObservationsInterface = {
 *   effectiveTemperature: {
 *     value: 5772,
 *     unit: 'K',
 *     uncertainty: { plus: 0.8, minus: 0.8 }
 *   },
 *   spectralClassification: {
 *     raw: 'G2V',
 *     spectralClass: 'G',
 *     subclass: 2,
 *     luminosityClass: 'V'
 *   }
 * };
 * ```
 * @group Observations
 */
export interface StarObservationsInterface {
  /** Catalogue identifiers. */
  identifiers?: IdentifiersInterface;
  /** How it was discovered, as for a companion. */
  discovery?: DiscoveryInterface;
  /** Its position, parallax and motion. */
  astrometry?: AstrometryInterface;
  /** Apparent magnitudes, by band. */
  apparentMagnitudes?: MagnitudesByBandType;
  /** Absolute magnitudes, by band, with `bol` for bolometric. */
  absoluteMagnitudes?: MagnitudesByBandType;
  /** Colour indices, such as `{ 'B-V': … }`. */
  colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
  /** `type`, split into its parts. */
  spectralClassification?: SpectralClassificationInterface;
  /** The effective temperature. */
  effectiveTemperature?: ObservedType<TemperatureInterface>;
  /** The surface gravity as log₁₀ g, in cgs. */
  logSurfaceGravity?: ObservedType<DexInterface>;
  /** The iron abundance, [Fe/H]. */
  metallicity?: ObservedType<DexInterface>;
  /** The alpha-element enhancement, [α/Fe]. */
  alphaEnhancement?: ObservedType<DexInterface>;
  /** Its radius, with uncertainty and method. */
  radius?: ObservedType<DistanceInterface>;
  /** Its limb-darkened angular diameter. */
  angularDiameter?: ObservedType<AngleInterface>;
  /** Its mass, with uncertainty and method. */
  mass?: ObservedType<MassInterface>;
  /** Its luminosity. */
  luminosity?: ObservedType<LuminosityInterface>;
  /** Its age. */
  age?: ObservedType<TemporalInterface>;
  /** Its projected rotation speed, v sin i. */
  projectedRotationalVelocity?: ObservedType<SpeedInterface>;
  /** The inclination of its spin axis to the line of sight. */
  spinInclination?: DegreesType;
  /** How flattened its spin makes it, as for Vega or Altair. */
  oblateness?: ObservedType;
  /** Its pole and equator temperatures, from gravity darkening. */
  gravityDarkening?: {
    pole: ObservedType<TemperatureInterface>;
    equator: ObservedType<TemperatureInterface>;
  };
  /** Fitted limb-darkening laws. */
  limbDarkening?: LimbDarkeningInterface[];
  /** Its magnetic activity. */
  activity?: StellarActivityInterface;
  /** How it varies. */
  variability?: VariabilityInterface[];
  /** Where it is in its life. */
  evolutionaryStage?: StellarEvolutionaryStageType;
  /** How fast it loses mass. */
  massLossRate?: ObservedType<MassRateInterface>;
  /** Its letter within its system, such as `'A'`. */
  component?: string;
  /** Sources for the record as a whole. */
  sources?: ObservationSourceInterface[];
}

/* Galaxies and black holes */

/**
 * {@link GalaxyInterface.type} **split into its parts**.
 *
 * @group Observations
 */
export interface GalaxyMorphologyInterface {
  /** As published: `GalaxyInterface.type`, such as `'SBbc'`. */
  raw: string;
  /** The Hubble stage. */
  hubbleType?:
    | 'E'
    | 'S0'
    | 'Sa'
    | 'Sab'
    | 'Sb'
    | 'Sbc'
    | 'Sc'
    | 'Scd'
    | 'Sd'
    | 'Sm'
    | 'Im'
    | 'Irr'
    | 'dSph'
    | 'dE'
    | (string & {});
  /** How strong its bar is. */
  bar?: 'strong' | 'weak' | 'none';
  /** Its ring structure. */
  ring?: 'inner' | 'outer' | 'nuclear' | 'none';
  /** de Vaucouleurs's numerical T-type. */
  tType?: ObservedType;
  /** Peculiar in shape. */
  peculiar?: boolean;
  /** Visibly interacting with a neighbour. */
  interacting?: boolean;
}

/**
 * How a galaxy's **distance** was measured.
 *
 * @group Observations
 */
export type DistanceMethodType =
  | 'parallax'
  | 'Cepheids'
  | 'TRGB'
  | 'RR Lyrae'
  | 'eclipsing binaries'
  | 'SN Ia'
  | 'Tully-Fisher'
  | 'surface brightness fluctuations'
  | 'masers'
  | 'redshift';

/**
 * The class of an **active galactic nucleus**.
 *
 * @group Observations
 */
export type ActiveNucleusType =
  | 'none'
  | 'Seyfert 1'
  | 'Seyfert 2'
  | 'LINER'
  | 'quasar'
  | 'blazar'
  | 'radio galaxy';

/**
 * How a **black hole's mass** was measured.
 *
 * @group Observations
 */
export type BlackHoleMassMethodType =
  | 'stellar orbits'
  | 'stellar dynamics'
  | 'gas dynamics'
  | 'masers'
  | 'reverberation mapping'
  | 'M-sigma relation'
  | 'EHT shadow';

/**
 * What is measured about a **black hole**. Its own `mass` (M☉) and
 * `ringDiameter` stay the values the equations use.
 *
 * @group Observations
 */
export interface BlackHoleObservationsInterface {
  /** Its mass, with uncertainty. */
  mass?: ObservedType<MassInterface>;
  /** How the mass was measured. */
  massMethod?: BlackHoleMassMethodType;
  /** Its dimensionless spin, a*. */
  spin?: ObservedType;
  /** The photon ring's diameter, with uncertainty. */
  ringDiameter?: ObservedType<AngleInterface>;
  /** How fast it accretes. */
  accretionRate?: ObservedType<MassRateInterface>;
  /** Its luminosity over the Eddington luminosity. */
  eddingtonRatio?: ObservedType;
  /** Whether a jet is seen. */
  jet?: boolean;
  /** Sources for the record as a whole. */
  sources?: ObservationSourceInterface[];
}

/**
 * What is measured about a **galaxy**.
 *
 * @group Observations
 */
export interface GalaxyObservationsInterface {
  /** Catalogue identifiers. */
  identifiers?: IdentifiersInterface;
  /** Its ICRS position; its own `direction` is galactic. */
  astrometry?: AstrometryInterface;
  /** `type`, split into its parts. */
  morphology?: GalaxyMorphologyInterface;
  /** Its redshift, z. */
  redshift?: ObservedType & { kind: 'spectroscopic' | 'photometric' };
  /** Its heliocentric recession speed, cz. */
  recessionVelocity?: ObservedType<SpeedInterface>;
  /** `distance`, with its uncertainty and method. */
  distance?: ObservedType<DistanceInterface> & { method?: DistanceMethodType };
  /** Its distance modulus, m − M. */
  distanceModulus?: ObservedType<MagnitudeInterface>;
  /** Apparent magnitudes, by band. */
  apparentMagnitudes?: MagnitudesByBandType;
  /** Absolute magnitudes, by band. */
  absoluteMagnitudes?: MagnitudesByBandType;
  /** Its apparent axes, at a named isophote. */
  angularSize?: {
    major: ObservedType<AngleInterface>;
    minor: ObservedType<AngleInterface>;
    isophote?: 'D25' | 'K20' | (string & {});
  };
  /** Its half-light radius. */
  effectiveRadius?: ObservedType<DistanceInterface | AngleInterface>;
  /** Its Sérsic index. */
  sersicIndex?: ObservedType;
  /** Its mass in stars. */
  stellarMass?: ObservedType<MassInterface>;
  /** Its mass in neutral hydrogen. */
  hiMass?: ObservedType<MassInterface>;
  /** Its mass in molecular gas. */
  molecularGasMass?: ObservedType<MassInterface>;
  /** Its dynamical mass. */
  dynamicalMass?: ObservedType<MassInterface>;
  /** The mass of its dark matter halo. */
  haloMass?: ObservedType<MassInterface>;
  /** How fast it forms stars. */
  starFormationRate?: ObservedType<MassRateInterface>;
  /** Its gas's oxygen abundance, 12 + log(O/H). */
  gasMetallicity?: ObservedType<DexInterface>;
  /** The flat part of its rotation curve. */
  rotationVelocity?: ObservedType<SpeedInterface>;
  /** The velocity dispersion of its central stars, σ. */
  centralVelocityDispersion?: ObservedType<SpeedInterface>;
  /** The class of its active nucleus. */
  activeNucleus?: ActiveNucleusType;
  /** Radio flux densities. */
  radioFluxes?: {
    frequencyGHz: number;
    flux: ObservedType<FluxDensityInterface>;
  }[];
  /** Such as `'Local Group'` or `'Virgo Cluster'`. */
  environment?: string;
  /** Ids of its satellite galaxies, such as `['large-magellanic-cloud']`. */
  satelliteIds?: string[];
  /** Sources for the record as a whole. */
  sources?: ObservationSourceInterface[];
}
