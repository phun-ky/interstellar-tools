import {
  AU_METERS,
  EARTH_GM_NOMINAL_M3_PER_S2,
  G_SI,
  JULIAN_YEAR_SECONDS,
  JUPITER_GM_NOMINAL_M3_PER_S2,
  SECONDS_PER_DAY,
  SOLAR_GM_NOMINAL_M3_PER_S2,
  SOLAR_IRRADIANCE_NOMINAL_W_PER_M2,
  SOLAR_LUMINOSITY_NOMINAL_W
} from '@interstellar-tools/constants';
import type {
  AccelerationInterface,
  AngleInterface,
  DensityInterface,
  DexInterface,
  EnergyInterface,
  EventRateInterface,
  FluxDensityInterface,
  FractionInterface,
  GravitationalParameterInterface,
  InverseDistanceInterface,
  IrradianceInterface,
  LuminosityInterface,
  MagneticFieldInterface,
  MagneticMomentInterface,
  MagnitudeInterface,
  MassInterface,
  MassRateInterface,
  PeriodChangeInterface,
  PressureInterface,
  ProductionRateInterface,
  SpeedInterface,
  SpinAccelerationInterface,
  TemperatureInterface,
  ThermalInertiaInterface,
  UncertaintyInterface
} from '@interstellar-tools/types';

/**
 * Any **unit-carrying quantity** from `@interstellar-tools/types`' quantities,
 * as {@link convertQuantity} takes it.
 *
 * @group Helpers
 */
export type QuantityType =
  | MassInterface
  | DensityInterface
  | SpeedInterface
  | AccelerationInterface
  | GravitationalParameterInterface
  | TemperatureInterface
  | PressureInterface
  | AngleInterface
  | MagnitudeInterface
  | LuminosityInterface
  | EnergyInterface
  | IrradianceInterface
  | FluxDensityInterface
  | MassRateInterface
  | ProductionRateInterface
  | EventRateInterface
  | DexInterface
  | FractionInterface
  | MagneticFieldInterface
  | MagneticMomentInterface
  | ThermalInertiaInterface
  | InverseDistanceInterface
  | SpinAccelerationInterface
  | PeriodChangeInterface;

const SOLAR_MASS_KG = SOLAR_GM_NOMINAL_M3_PER_S2 / G_SI;
const RADIAN = Math.PI / 180;
/**
 * Each unit's kind and its size in that kind's base unit: the SI unit, or
 * the only unit for a kind that has one.
 */
const UNITS: Readonly<
  Record<QuantityType['unit'], readonly [kind: string, factor: number]>
> = Object.freeze({
  // Masses: the nominal units are the IAU's (GM)ᴺ over G
  kg: ['mass', 1],
  M_earth: ['mass', EARTH_GM_NOMINAL_M3_PER_S2 / G_SI],
  M_jup: ['mass', JUPITER_GM_NOMINAL_M3_PER_S2 / G_SI],
  M_sun: ['mass', SOLAR_MASS_KG],
  'kg/m3': ['density', 1],
  'g/cm3': ['density', 1e3],
  'm/s': ['speed', 1],
  'km/s': ['speed', 1e3],
  'm/s2': ['acceleration', 1],
  'cm/s2': ['acceleration', 1e-2],
  'au/d2': ['acceleration', AU_METERS / SECONDS_PER_DAY ** 2],
  'm3/s2': ['gravitational parameter', 1],
  'km3/s2': ['gravitational parameter', 1e9],
  K: ['temperature', 1],
  Pa: ['pressure', 1],
  hPa: ['pressure', 1e2],
  bar: ['pressure', 1e5],
  mbar: ['pressure', 1e2],
  μbar: ['pressure', 1e-1],
  nbar: ['pressure', 1e-4],
  rad: ['angle', 1],
  deg: ['angle', RADIAN],
  arcmin: ['angle', RADIAN / 60],
  arcsec: ['angle', RADIAN / 3600],
  mas: ['angle', RADIAN / 3.6e6],
  μas: ['angle', RADIAN / 3.6e9],
  mag: ['magnitude', 1],
  W: ['luminosity', 1],
  'erg/s': ['luminosity', 1e-7],
  L_sun: ['luminosity', SOLAR_LUMINOSITY_NOMINAL_W],
  J: ['energy', 1],
  erg: ['energy', 1e-7],
  'W/m2': ['irradiance', 1],
  S_earth: ['irradiance', SOLAR_IRRADIANCE_NOMINAL_W_PER_M2],
  Jy: ['flux density', 1],
  mJy: ['flux density', 1e-3],
  μJy: ['flux density', 1e-6],
  'kg/s': ['mass rate', 1],
  'M_sun/yr': ['mass rate', SOLAR_MASS_KG / JULIAN_YEAR_SECONDS],
  'molecules/s': ['production rate', 1],
  '1/h': ['event rate', 1 / 3600],
  '1/d': ['event rate', 1 / SECONDS_PER_DAY],
  '1/yr': ['event rate', 1 / JULIAN_YEAR_SECONDS],
  dex: ['dex', 1],
  fraction: ['fraction', 1],
  '%': ['fraction', 1e-2],
  ppm: ['fraction', 1e-6],
  ppb: ['fraction', 1e-9],
  T: ['magnetic field', 1],
  nT: ['magnetic field', 1e-9],
  G: ['magnetic field', 1e-4],
  'A m2': ['magnetic moment', 1],
  TIU: ['thermal inertia', 1],
  '1/au': ['inverse distance', 1],
  'rad/d2': ['spin acceleration', 1],
  'deg/d2': ['spin acceleration', RADIAN],
  's/yr': ['period change', 1],
  'ms/yr': ['period change', 1e-3]
});

/* node:coverage disable */
/**
 * Convert a **quantity** to another unit of the same kind: a mass from kg to
 * Jupiter masses, a pressure from bar to Pa, a parallax from mas to arcsec.
 *
 * $$
 * \text{value}_\text{target} = \text{value} \cdot \frac{f(u_\text{in})}{f(u_\text{out})}
 * $$
 *
 * where $f(u)$ is the unit's size in its kind's SI unit.
 *
 * ::: info Notes
 *
 * - **Nominal units** are the IAU's 2015 Resolution B3 values: `M_sun`,
 *   `M_jup` and `M_earth` are the nominal $(GM)^\mathrm{N}$ over {@link G_SI},
 *   `L_sun` 3.828 × 10²⁶ W, and `S_earth` 1361 W/m².
 * - The rest of the quantity, such as an observation's `source`, is kept, and
 *   an `uncertainty` is converted with the value.
 * - Only a quantity's own kind of unit is accepted, by type and at runtime:
 *   a mass can't become a speed. Kinds with a single unit, such as `K` or
 *   `dex`, convert to themselves.
 * - Distances and times have their own converters: `convertDistanceUnit`, and
 *   `convertTemporalUnit` in `@interstellar-tools/temporal`.
 *
 * :::
 *
 * @param quantity - A quantity `{ value, unit }`, from `@interstellar-tools/types`' quantities, or an observed one.
 * @param unit - The unit to convert to, of the same kind.
 * @returns A copy of `quantity` in `unit`, with its `uncertainty` converted too.
 * @throws {RangeError} If either unit isn't known, or they're different kinds.
 * @group Helpers
 *
 * @example
 * ```ts
 * convertQuantity({ value: 1, unit: 'M_jup' }, 'M_earth');
 * // → { value: 317.8284, unit: 'M_earth' }
 * convertQuantity({ value: 92, unit: 'bar' }, 'Pa');
 * // → { value: 9_200_000, unit: 'Pa' }
 * // ʻOumuamua's non-gravitational A1 from JPL, in m/s²
 * convertQuantity({ value: 2.79e-7, unit: 'au/d2' }, 'm/s2');
 * // → { value: 5.591e-6, unit: 'm/s2' }
 * ```
 *
 * @see convertDistanceUnit
 */
/* node:coverage enable */
export const convertQuantity = <
  Q extends QuantityType & { uncertainty?: UncertaintyInterface }
>(
  quantity: Q,
  unit: Q['unit']
): Q => {
  const from = UNITS[quantity.unit];
  const to = UNITS[unit];

  if (!from || !to)
    throw new RangeError(
      `Unknown unit. Received: ${String(quantity.unit)} to ${String(unit)}`
    );

  if (from[0] !== to[0])
    throw new RangeError(
      `Can't convert a ${from[0]} to a ${to[0]}. Received: ${quantity.unit} to ${unit}`
    );

  const factor = from[1] / to[1];
  const { uncertainty } = quantity;

  return {
    ...quantity,
    value: quantity.value * factor,
    unit,
    ...(uncertainty && {
      uncertainty: {
        ...uncertainty,
        plus: uncertainty.plus * factor,
        minus: uncertainty.minus * factor
      }
    })
  };
};
