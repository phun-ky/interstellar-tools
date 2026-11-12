/**
 * The IAU's **nominal conversion constants** (2015 Resolution B3): exact
 * values to quote solar and planetary quantities in, such as a star's
 * luminosity in solar luminosities or an exoplanet's mass in Jupiter masses.
 *
 * ::: info
 *
 * - They're **units, not measurements**: the Sun's actual luminosity or
 *   Jupiter's actual GM may differ, and carries an uncertainty.
 * - The resolution defines no nominal masses. A mass in nominal solar,
 *   Jupiter or Earth masses is the ratio of GM values, $GM / (GM)^\mathrm{N}$;
 *   a mass in kg is $GM / G$, with {@link G_SI}.
 * - The nominal solar radius is {@link SOLAR_RADIUS_NOMINAL_KM}.
 *
 * :::
 *
 * @see https://arxiv.org/abs/1510.07674 Prša et al. 2016, AJ 152, 41: IAU 2015 Resolution B3
 * @module
 */

/**
 * Nominal **total solar irradiance**, $S^\mathrm{N}_\odot$: 1361 W/m².
 *
 * @group Nominal
 */
export const SOLAR_IRRADIANCE_NOMINAL_W_PER_M2 = 1361 as const;

/**
 * Nominal **solar luminosity**, $L^\mathrm{N}_\odot$: 3.828 × 10²⁶ W.
 *
 * @group Nominal
 */
export const SOLAR_LUMINOSITY_NOMINAL_W = 3.828e26 as const;

/**
 * Nominal **solar effective temperature**, $T^\mathrm{N}_{\mathrm{eff}\odot}$:
 * 5772 K.
 *
 * @group Nominal
 */
export const SOLAR_EFFECTIVE_TEMPERATURE_NOMINAL_K = 5772 as const;

/**
 * Nominal **solar mass parameter**, $(GM)^\mathrm{N}_\odot$:
 * 1.3271244 × 10²⁰ m³/s².
 *
 * @group Nominal
 */
export const SOLAR_GM_NOMINAL_M3_PER_S2 = 1.3271244e20 as const;

/**
 * Nominal **equatorial radius of Earth**, $R^\mathrm{N}_{eE}$: 6378.1 km,
 * zero tide.
 *
 * @group Nominal
 */
export const EARTH_EQUATORIAL_RADIUS_NOMINAL_KM = 6378.1 as const;

/**
 * Nominal **polar radius of Earth**, $R^\mathrm{N}_{pE}$: 6356.8 km, zero tide.
 *
 * @group Nominal
 */
export const EARTH_POLAR_RADIUS_NOMINAL_KM = 6356.8 as const;

/**
 * Nominal **mass parameter of Earth**, $(GM)^\mathrm{N}_E$:
 * 3.986004 × 10¹⁴ m³/s².
 *
 * @group Nominal
 */
export const EARTH_GM_NOMINAL_M3_PER_S2 = 3.986004e14 as const;

/**
 * Nominal **equatorial radius of Jupiter**, $R^\mathrm{N}_{eJ}$: 71 492 km, at
 * the 1-bar level.
 *
 * @group Nominal
 */
export const JUPITER_EQUATORIAL_RADIUS_NOMINAL_KM = 71_492 as const;

/**
 * Nominal **polar radius of Jupiter**, $R^\mathrm{N}_{pJ}$: 66 854 km, at the
 * 1-bar level.
 *
 * @group Nominal
 */
export const JUPITER_POLAR_RADIUS_NOMINAL_KM = 66_854 as const;

/**
 * Nominal **mass parameter of Jupiter**, $(GM)^\mathrm{N}_J$:
 * 1.2668653 × 10¹⁷ m³/s².
 *
 * @group Nominal
 */
export const JUPITER_GM_NOMINAL_M3_PER_S2 = 1.2668653e17 as const;
