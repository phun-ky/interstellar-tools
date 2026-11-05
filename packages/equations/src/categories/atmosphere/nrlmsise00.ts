import type {
  AtmosphereInterface,
  Radians,
  SpaceWeatherInterface
} from '@interstellar-tools/types';

import { assertFinite, assertLatitude } from '../cartography/validate.js';

import { gtd7 } from './nrlmsise00-gtd7.js';

const DAY_MS = 86_400_000;

/**
 * The **NRLMSISE-00** model of Earth's atmosphere: the density, temperature
 * and make-up of the air at any height from the ground to the exosphere, at
 * a place and a moment, for given solar and geomagnetic activity. It's the
 * standard model for satellite drag.
 *
 * Above about 120 km the temperature follows the Bates profile, rising from
 * its value at the lower boundary towards the exospheric temperature
 * $ T_\infty $:
 *
 * $$
 * T(z) = T_\infty - (T_\infty - T_{lb})\, e^{-s\,\zeta(z)}
 * $$
 *
 * and each gas is in diffusive equilibrium: it thins out with its own scale
 * height, the lighter ones (He, H) more slowly, so they take over high up.
 * Below the turbopause, near 100 km, the gases are mixed instead; lower
 * still, the temperature is a spline through fitted nodes. $ T_\infty $ and
 * the densities at the lower boundary vary as sums of spherical harmonics in
 * latitude, local time, season and longitude, scaled by solar (F10.7) and
 * geomagnetic (Ap) activity.
 *
 * Where:
 * - $ T_{lb} $ is the temperature at the lower boundary, 120 km
 * - $ s $ sets how fast the temperature approaches $ T_\infty $
 * - $ \zeta(z) $ is the geopotential height above the lower boundary
 *
 * A port of NRL's original Fortran (GTD7 and GTD7D), without its switches.
 *
 * **Units**
 * - Inputs: `date` in UTC; `h` in **m**; `phi`, `lambda` in **rad**; `weather` in solar flux units and Ap.
 * - Output: densities in **kg/m³**, number densities in **m⁻³**, temperatures in **K**: see {@link AtmosphereInterface}.
 *
 * ::: info Notes
 *
 * - Valid from the ground to the exosphere, about 1000 km.
 * - F10.7 is the Sun's radio flux at 10.7 cm, a measure of its ultraviolet
 *   output; Ap measures geomagnetic activity: see
 *   {@link SpaceWeatherInterface}. The library fetches nothing: NOAA's Space
 *   Weather Prediction Center and CelesTrak publish both, observed and
 *   forecast.
 * - For drag above 500 km use `effectiveDensity`, which adds anomalous
 *   oxygen; below it the two are nearly the same.
 * - O, H and N are 0 below 72.5 km, and the exospheric temperature is the
 *   global average below about 120 km.
 * - The local solar time is taken as UT plus longitude / 15 h, without the
 *   equation of time, as NRL recommends.
 * - **Extreme storms break the model.** At Ap in the hundreds, near the
 *   poles, its lower thermosphere, around 110 to 125 km, can give negative
 *   temperatures and densities: NRL's own code does the same. Rather than
 *   return those, it throws.
 *
 * :::
 *
 * @param date - The moment, in UTC (a valid `Date`).
 * @param h - Geodetic height in **m** (finite, >= 0).
 * @param phi - Geodetic latitude in **rad** (finite, in [-π/2, π/2]).
 * @param lambda - Geodetic longitude in **rad** (finite), east positive.
 * @param weather - F10.7, its 81-day average and Ap: see {@link SpaceWeatherInterface}. With `apHistory`, its 3-hour Ap values are used instead of `ap`.
 * @returns The state of the atmosphere: see {@link AtmosphereInterface}.
 * @throws {TypeError} If `date` is not a valid `Date`, or a number is not finite.
 * @throws {RangeError} If `h < 0`, `|phi| > π/2`, `f107 <= 0`, `f107a <= 0`, `ap < 0`, or `apHistory` isn't 7 finite numbers >= 0; or if the model has no physical result there, at extreme geomagnetic activity.
 * @group Atmosphere
 *
 * @example
 * ```ts
 * // 400 km above Oslo at noon on midsummer's day, moderate solar activity
 * const air = nrlmsise00(
 *   new Date('2026-06-21T12:00:00Z'),
 *   400_000,
 *   (59.91 * Math.PI) / 180,
 *   (10.75 * Math.PI) / 180,
 *   { f107: 150, f107a: 150, ap: 4 }
 * );
 *
 * air.density; // ≈ 4.6e-12 kg/m³
 * air.temperature; // ≈ 1188 K
 * ```
 *
 * @see Picone, J. M., Hedin, A. E., Drob, D. P. & Aikin, A. C. (2002). NRLMSISE-00 empirical model of the atmosphere: Statistical comparisons and scientific issues. *J. Geophys. Res.* 107(A12), 1468. [doi:10.1029/2002JA009430](https://doi.org/10.1029/2002JA009430)
 * @see {@link atmosphericDragAcceleration}
 */
export const nrlmsise00 = (
  date: Date,
  h: number,
  phi: Radians,
  lambda: Radians,
  weather: SpaceWeatherInterface
): AtmosphereInterface => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime()))
    throw new TypeError(`date must be a valid Date. Received: ${date}`);

  const { f107, f107a, ap, apHistory } = weather;

  assertFinite([
    ['h', h],
    ['phi', phi],
    ['lambda', lambda],
    ['weather.f107', f107],
    ['weather.f107a', f107a],
    ['weather.ap', ap]
  ]);

  if (h < 0) throw new RangeError(`h must be >= 0. Received: ${h}`);

  assertLatitude('phi', phi);

  if (f107 <= 0)
    throw new RangeError(`weather.f107 must be > 0. Received: ${f107}`);

  if (f107a <= 0)
    throw new RangeError(`weather.f107a must be > 0. Received: ${f107a}`);

  if (ap < 0) throw new RangeError(`weather.ap must be >= 0. Received: ${ap}`);

  if (
    apHistory !== undefined &&
    (!Array.isArray(apHistory) ||
      apHistory.length !== 7 ||
      !apHistory.every((x) => Number.isFinite(x) && x >= 0))
  )
    throw new RangeError(
      `weather.apHistory must be 7 finite numbers >= 0. Received: ${apHistory}`
    );

  // Day of the year and seconds of the UT day
  const ms = date.getTime();
  const midnight = Math.floor(ms / DAY_MS) * DAY_MS;
  const newYear = new Date(midnight);

  newYear.setUTCMonth(0, 1);

  const day = Math.round((midnight - newYear.getTime()) / DAY_MS) + 1;
  const sec = (ms - midnight) / 1000;
  // Longitude in [-180, 180) degrees, and local solar time in [0, 24) hours
  const lon = (((((lambda * 180) / Math.PI + 180) % 360) + 360) % 360) - 180;
  const stl = (((sec / 3600 + lon / 15) % 24) + 24) % 24;
  const out = gtd7({
    day,
    sec,
    alt: h / 1000,
    lat: (phi * 180) / Math.PI,
    lon,
    stl,
    f107a,
    f107,
    ap: apHistory ?? ap
  });

  // In extreme storms the model's lower thermosphere breaks down, with
  // negative temperatures and densities, NaN where they meet a logarithm
  if (
    !(out.t > 0) ||
    ![
      out.rho,
      out.rhoEffective,
      out.he,
      out.o,
      out.n2,
      out.o2,
      out.ar,
      out.h,
      out.n,
      out.anomalousO
    ].every((x) => x >= 0)
  )
    throw new RangeError(
      `NRLMSISE-00 has no physical result at h = ${h} m, phi = ${phi} rad with this space weather: the model breaks down in extreme geomagnetic storms. Received a temperature of ${out.t} K.`
    );

  // cgs to SI: cm⁻³ to m⁻³, g/cm³ to kg/m³
  return {
    density: out.rho * 1e3,
    effectiveDensity: out.rhoEffective * 1e3,
    temperature: out.t,
    exosphericTemperature: out.tinf,
    numberDensities: {
      He: out.he * 1e6,
      O: out.o * 1e6,
      N2: out.n2 * 1e6,
      O2: out.o2 * 1e6,
      Ar: out.ar * 1e6,
      H: out.h * 1e6,
      N: out.n * 1e6,
      anomalousO: out.anomalousO * 1e6
    }
  };
};
