import type { ValueInterface } from './numeric.js';

/**
 * Unit-carrying **quantities** beyond distance and time, shaped like
 * {@link DistanceInterface} and {@link TemporalInterface}: a `value` and the
 * canonical `unit` it's given in.
 *
 * Catalogues give the same quantity in different units, a planet's mass in
 * kg, an exoplanet's in Jupiter masses and a star's in solar masses, so the
 * unit travels with the number instead of living in a doc comment.
 *
 * ::: info
 *
 * - **Canonical symbols only**, in ASCII where SI allows it (`kg/m3`, `m/s2`),
 *   as {@link DistanceUnitType} does.
 * - **Micro** is the Greek letter `μ` (U+03BC), as in {@link TemporalUnitType}'s
 *   `μs`, not the micro sign `µ` (U+00B5).
 * - The **nominal** units, `M_earth`, `M_jup`, `M_sun`, `L_sun` and `S_earth`,
 *   are the IAU's 2015 Resolution B3 values.
 *
 * :::
 *
 * @module
 */

/**
 * Canonical **mass unit symbols**.
 *
 * - `kg`: the SI base.
 * - `M_earth`, `M_jup`, `M_sun`: Earth's, Jupiter's and the Sun's masses, as
 *   exoplanet and stellar catalogues give them: the IAU's 2015 nominal
 *   $(GM)^\mathrm{N}$, 3.986004 × 10¹⁴, 1.2668653 × 10¹⁷ and 1.3271244 ×
 *   10²⁰ m³/s², over $G$.
 *
 * @group Quantities
 */
export type MassUnitType = 'kg' | 'M_earth' | 'M_jup' | 'M_sun';

/**
 * A **mass** with its unit.
 *
 * @example
 * ```ts
 * const jupiter: MassInterface = { value: 1.898e27, unit: 'kg' };
 * const hd189733b: MassInterface = { value: 1.13, unit: 'M_jup' };
 * ```
 * @group Quantities
 */
export interface MassInterface extends ValueInterface {
  unit: MassUnitType;
}

/**
 * Canonical **density unit symbols**: SI `kg/m3`, or `g/cm3`, as planetary
 * fact sheets give bulk density. 1 g/cm³ = 1000 kg/m³.
 *
 * @group Quantities
 */
export type DensityUnitType = 'kg/m3' | 'g/cm3';

/**
 * A **mass density** with its unit.
 *
 * @example
 * ```ts
 * const saturn: DensityInterface = { value: 0.687, unit: 'g/cm3' };
 * ```
 * @group Quantities
 */
export interface DensityInterface extends ValueInterface {
  unit: DensityUnitType;
}

/**
 * Canonical **speed unit symbols**.
 *
 * @group Quantities
 */
export type SpeedUnitType = 'm/s' | 'km/s';

/**
 * A scalar **speed** with its unit: an escape speed, a radial-velocity
 * semi-amplitude, a galaxy's rotation speed. For a velocity in 3D, see
 * {@link VelocityInterface}.
 *
 * @example
 * ```ts
 * const earthEscape: SpeedInterface = { value: 11.186, unit: 'km/s' };
 * ```
 * @group Quantities
 */
export interface SpeedInterface extends ValueInterface {
  unit: SpeedUnitType;
}

/**
 * Canonical **acceleration unit symbols**: SI `m/s2`, cgs `cm/s2`, and
 * `au/d2`, the unit JPL gives comets' and asteroids' non-gravitational
 * parameters in.
 *
 * @group Quantities
 */
export type AccelerationUnitType = 'm/s2' | 'cm/s2' | 'au/d2';

/**
 * An **acceleration** with its unit.
 *
 * @example
 * ```ts
 * // ʻOumuamua's radial non-gravitational parameter A1, from JPL
 * const a1: AccelerationInterface = { value: 2.79e-7, unit: 'au/d2' };
 * ```
 * @group Quantities
 */
export interface AccelerationInterface extends ValueInterface {
  unit: AccelerationUnitType;
}

/**
 * Canonical **gravitational parameter unit symbols**. The bodies' own `mu` is
 * in `m3/s2`; JPL gives GM in `km3/s2`.
 *
 * @group Quantities
 */
export type GravitationalParameterUnitType = 'm3/s2' | 'km3/s2';

/**
 * A **standard gravitational parameter** $\mu = GM$ with its unit.
 *
 * @group Quantities
 */
export interface GravitationalParameterInterface extends ValueInterface {
  unit: GravitationalParameterUnitType;
}

/**
 * A **temperature**, in kelvin.
 *
 * @group Quantities
 */
export interface TemperatureInterface extends ValueInterface {
  unit: 'K';
}

/**
 * Canonical **pressure unit symbols**, from Venus's 92 `bar` down to Pluto's
 * 10 `μbar`. 1 bar = 10⁵ Pa.
 *
 * @group Quantities
 */
export type PressureUnitType = 'Pa' | 'hPa' | 'bar' | 'mbar' | 'μbar' | 'nbar';

/**
 * A **pressure** with its unit.
 *
 * @group Quantities
 */
export interface PressureInterface extends ValueInterface {
  unit: PressureUnitType;
}

/**
 * Canonical **angle unit symbols** for measured angles, including the small
 * ones on the sky: parallaxes, angular diameters, the sizes of galaxies.
 *
 * For an angle in degrees without a unit attached, use {@link DegreesType};
 * for computing, {@link Radians}.
 *
 * @group Quantities
 */
export type AngleUnitType = 'rad' | 'deg' | 'arcmin' | 'arcsec' | 'mas' | 'μas';

/**
 * A measured **angle** with its unit.
 *
 * @example
 * ```ts
 * const proximaParallax: AngleInterface = { value: 768.07, unit: 'mas' };
 * ```
 * @group Quantities
 */
export interface AngleInterface extends ValueInterface {
  unit: AngleUnitType;
}

/**
 * An astronomical **magnitude**: apparent, absolute, or a colour index.
 *
 * @group Quantities
 */
export interface MagnitudeInterface extends ValueInterface {
  unit: 'mag';
}

/**
 * Canonical **luminosity unit symbols**: `W`, `erg/s`, and `L_sun`, the IAU's
 * 2015 nominal solar luminosity, 3.828 × 10²⁶ W.
 *
 * @group Quantities
 */
export type LuminosityUnitType = 'W' | 'erg/s' | 'L_sun';

/**
 * A **luminosity** with its unit.
 *
 * @group Quantities
 */
export interface LuminosityInterface extends ValueInterface {
  unit: LuminosityUnitType;
}

/**
 * Canonical **energy unit symbols**, for example for flare energies.
 *
 * @group Quantities
 */
export type EnergyUnitType = 'J' | 'erg';

/**
 * An **energy** with its unit.
 *
 * @group Quantities
 */
export interface EnergyInterface extends ValueInterface {
  unit: EnergyUnitType;
}

/**
 * Canonical **irradiance unit symbols**: SI `W/m2`, or `S_earth`, the light
 * Earth gets from the Sun, as exoplanet insolation is given: the IAU's 2015
 * nominal total solar irradiance, 1361 W/m².
 *
 * @group Quantities
 */
export type IrradianceUnitType = 'W/m2' | 'S_earth';

/**
 * An **energy flux** through a surface: insolation, or heat flowing out of a
 * body.
 *
 * @group Quantities
 */
export interface IrradianceInterface extends ValueInterface {
  unit: IrradianceUnitType;
}

/**
 * Canonical **flux density unit symbols**, for radio astronomy.
 *
 * @group Quantities
 */
export type FluxDensityUnitType = 'Jy' | 'mJy' | 'μJy';

/**
 * A **spectral flux density** with its unit.
 *
 * @group Quantities
 */
export interface FluxDensityInterface extends ValueInterface {
  unit: FluxDensityUnitType;
}

/**
 * Canonical **mass rate unit symbols**: dust from comets, mass lost by stars,
 * stars formed in galaxies.
 *
 * @group Quantities
 */
export type MassRateUnitType = 'kg/s' | 'M_sun/yr';

/**
 * A **mass flow rate** with its unit.
 *
 * @group Quantities
 */
export interface MassRateInterface extends ValueInterface {
  unit: MassRateUnitType;
}

/**
 * A comet's **molecular production rate**, in molecules a second.
 *
 * @group Quantities
 */
export interface ProductionRateInterface extends ValueInterface {
  unit: 'molecules/s';
}

/**
 * Canonical **event rate unit symbols**, for example for flare rates.
 *
 * @group Quantities
 */
export type EventRateUnitType = '1/h' | '1/d' | '1/yr';

/**
 * How often something happens, with its unit.
 *
 * @group Quantities
 */
export interface EventRateInterface extends ValueInterface {
  unit: EventRateUnitType;
}

/**
 * A **logarithmic quantity**, in dex: a metallicity [Fe/H], log g, log R′HK,
 * 12 + log(O/H).
 *
 * @group Quantities
 */
export interface DexInterface extends ValueInterface {
  unit: 'dex';
}

/**
 * Canonical **fraction unit symbols**, for abundances, coverages and transit
 * depths.
 *
 * @group Quantities
 */
export type FractionUnitType = 'fraction' | '%' | 'ppm' | 'ppb';

/**
 * A **share of a whole** with its unit.
 *
 * @group Quantities
 */
export interface FractionInterface extends ValueInterface {
  unit: FractionUnitType;
}

/**
 * Canonical **magnetic field unit symbols**: `T`, `nT`, and gauss, `G`,
 * 10⁻⁴ T.
 *
 * @group Quantities
 */
export type MagneticFieldUnitType = 'T' | 'nT' | 'G';

/**
 * A **magnetic flux density** with its unit.
 *
 * @group Quantities
 */
export interface MagneticFieldInterface extends ValueInterface {
  unit: MagneticFieldUnitType;
}

/**
 * A **magnetic dipole moment**, in A m².
 *
 * @group Quantities
 */
export interface MagneticMomentInterface extends ValueInterface {
  unit: 'A m2';
}

/**
 * **Thermal inertia**, in thermal inertia units: 1 TIU = 1 J m⁻² K⁻¹ s⁻½.
 *
 * @group Quantities
 */
export interface ThermalInertiaInterface extends ValueInterface {
  unit: 'TIU';
}

/**
 * An **inverse distance**, such as a long-period comet's original $1/a$.
 *
 * @group Quantities
 */
export interface InverseDistanceInterface extends ValueInterface {
  unit: '1/au';
}

/**
 * Canonical **spin acceleration unit symbols**: how fast a spin speeds up,
 * as the YORP effect is given.
 *
 * @group Quantities
 */
export type SpinAccelerationUnitType = 'rad/d2' | 'deg/d2';

/**
 * A **spin acceleration**, $d\omega/dt$, with its unit: positive when the
 * body spins up.
 *
 * @example
 * ```ts
 * // Bennu's YORP spin-up (Nolan et al. 2019)
 * const yorp: SpinAccelerationInterface = { value: 3.63e-6, unit: 'deg/d2' };
 * ```
 * @group Quantities
 */
export interface SpinAccelerationInterface extends ValueInterface {
  unit: SpinAccelerationUnitType;
}

/**
 * Canonical **period change unit symbols**: how fast a period lengthens.
 *
 * @group Quantities
 */
export type PeriodChangeUnitType = 's/yr' | 'ms/yr';

/**
 * A **change in a period**, $dP/dt$, with its unit: positive when the period
 * lengthens. Turning it into a {@link SpinAccelerationInterface} needs the
 * period itself, $d\omega/dt = -2\pi\,\dot P / P^2$.
 *
 * @group Quantities
 */
export interface PeriodChangeInterface extends ValueInterface {
  unit: PeriodChangeUnitType;
}

/**
 * A **pure number**: an albedo, an axis ratio, a Sérsic index, a redshift.
 * It has no `unit`.
 *
 * @example
 * ```ts
 * const saturnAlbedo: DimensionlessInterface = { value: 0.499 };
 * ```
 * @group Quantities
 */
export interface DimensionlessInterface extends ValueInterface {
  unit?: undefined;
}
