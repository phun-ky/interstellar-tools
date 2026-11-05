/**
 * The **space weather** an atmosphere model needs: how strongly the Sun heats
 * the upper atmosphere, and how stirred up Earth's magnetic field is. Above
 * about 200 km they change the air density tenfold.
 *
 * Taken by `nrlmsise00` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - **F10.7** is the Sun's radio flux at 10.7 cm, in solar flux units
 *   (10⁻²² W/m²/Hz), a measure of its ultraviolet output: about 70 at solar
 *   minimum and 200 or more at maximum.
 * - **Ap** measures geomagnetic activity: 4 on a quiet day, 40 or more in a
 *   storm.
 * - The library fetches nothing: NOAA's Space Weather Prediction Center and
 *   CelesTrak publish both, observed and forecast.
 *
 * :::
 *
 * @example
 * ```ts
 * // Moderate solar activity, a quiet day
 * const weather: SpaceWeatherInterface = { f107: 150, f107a: 150, ap: 4 };
 * ```
 * @group Atmosphere
 */
export interface SpaceWeatherInterface {
  /** Daily F10.7 for the previous day, in solar flux units, at Earth's distance from the Sun. */
  f107: number;
  /** 81-day average of F10.7, centred on the day, in solar flux units. */
  f107a: number;
  /** Daily Ap index. */
  ap: number;
  /**
   * The 3-hour Ap history, for storms: daily Ap; the 3-hour Ap now, 3, 6 and
   * 9 hours before; and the averages of the eight 3-hour values 12 to 33 and
   * 36 to 57 hours before. When given, it's used instead of `ap`.
   */
  apHistory?: readonly [
    daily: number,
    now: number,
    hours3: number,
    hours6: number,
    hours9: number,
    hours12To33: number,
    hours36To57: number
  ];
}

/**
 * The **state of the atmosphere** at a place and a moment: its density,
 * temperature and make-up.
 *
 * Returned by `nrlmsise00` in `@interstellar-tools/equations`.
 *
 * ::: info
 *
 * - `density` sums helium, oxygen, nitrogen, argon and hydrogen.
 *   `effectiveDensity` adds "anomalous oxygen", hot and ionised oxygen that
 *   matters for drag above about 500 km: use it for drag.
 * - Oxygen atoms, hydrogen and nitrogen atoms are 0 below 72.5 km.
 *
 * :::
 *
 * @example
 * ```ts
 * // 400 km up, at moderate solar activity
 * const air: AtmosphereInterface = {
 *   density: 4.07e-12,
 *   effectiveDensity: 4.08e-12,
 *   temperature: 1241,
 *   exosphericTemperature: 1251,
 *   numberDensities: {
 *     He: 6.67e11, O: 1.14e14, N2: 2.0e13, O2: 4.0e11,
 *     Ar: 3.56e9, H: 3.48e10, N: 4.1e12, anomalousO: 2.67e10
 *   }
 * };
 * ```
 * @group Atmosphere
 */
export interface AtmosphereInterface {
  /** Total mass density in kg/m³, without anomalous oxygen. */
  density: number;
  /** Total mass density for drag in kg/m³, with anomalous oxygen. */
  effectiveDensity: number;
  /** Temperature at the height, in K. */
  temperature: number;
  /** Exospheric temperature, the temperature far above, in K. */
  exosphericTemperature: number;
  /** Number densities in m⁻³. */
  numberDensities: {
    /** Helium. */
    He: number;
    /** Atomic oxygen. */
    O: number;
    /** Molecular nitrogen. */
    N2: number;
    /** Molecular oxygen. */
    O2: number;
    /** Argon. */
    Ar: number;
    /** Atomic hydrogen. */
    H: number;
    /** Atomic nitrogen. */
    N: number;
    /** Anomalous oxygen: hot atomic and ionised oxygen. */
    anomalousO: number;
  };
}
