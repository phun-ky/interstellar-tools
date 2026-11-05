[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / nrlmsise00

# Function: nrlmsise00()

```ts
function nrlmsise00(
  date: Date,
  h: number,
  phi: Radians,
  lambda: Radians,
  weather: SpaceWeatherInterface
): AtmosphereInterface;
```

Defined in:
[atmosphere/nrlmsise00.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/atmosphere/nrlmsise00.ts#L95)

The **NRLMSISE-00** model of Earth's atmosphere: the density, temperature and
make-up of the air at any height from the ground to the exosphere, at a place
and a moment, for given solar and geomagnetic activity. It's the standard model
for satellite drag.

Above about 120 km the temperature follows the Bates profile, rising from its
value at the lower boundary towards the exospheric temperature $T_\infty$:

$$
T(z) = T_\infty - (T_\infty - T_{lb})\, e^{-s\,\zeta(z)}
$$

and each gas is in diffusive equilibrium: it thins out with its own scale
height, the lighter ones (He, H) more slowly, so they take over high up. Below
the turbopause, near 100 km, the gases are mixed instead; lower still, the
temperature is a spline through fitted nodes. $T_\infty$ and the densities at
the lower boundary vary as sums of spherical harmonics in latitude, local time,
season and longitude, scaled by solar (F10.7) and geomagnetic (Ap) activity.

Where:

- $T_{lb}$ is the temperature at the lower boundary, 120 km
- $s$ sets how fast the temperature approaches $T_\infty$
- $\zeta(z)$ is the geopotential height above the lower boundary

A port of NRL's original Fortran (GTD7 and GTD7D), without its switches.

**Units**

- Inputs: `date` in UTC; `h` in **m**; `phi`, `lambda` in **rad**; `weather` in
  solar flux units and Ap.
- Output: densities in **kg/m³**, number densities in **m⁻³**, temperatures in
  **K**: see
  [AtmosphereInterface](../../types/interfaces/AtmosphereInterface.md).

::: info Notes

- Valid from the ground to the exosphere, about 1000 km.
- F10.7 is the Sun's radio flux at 10.7 cm, a measure of its ultraviolet output;
  Ap measures geomagnetic activity: see
  [SpaceWeatherInterface](../../types/interfaces/SpaceWeatherInterface.md). The
  library fetches nothing: NOAA's Space Weather Prediction Center and CelesTrak
  publish both, observed and forecast.
- For drag above 500 km use `effectiveDensity`, which adds anomalous oxygen;
  below it the two are nearly the same.
- O, H and N are 0 below 72.5 km, and the exospheric temperature is the global
  average below about 120 km.
- The local solar time is taken as UT plus longitude / 15 h, without the
  equation of time, as NRL recommends.
- **Extreme storms break the model.** At Ap in the hundreds, near the poles, its
  lower thermosphere, around 110 to 125 km, can give negative temperatures and
  densities: NRL's own code does the same. Rather than return those, it throws.

:::

## Parameters

| Parameter | Type                                                                                      | Description                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment, in UTC (a valid `Date`).                                                                                                                                             |
| `h`       | `number`                                                                                  | Geodetic height in **m** (finite, >= 0).                                                                                                                                         |
| `phi`     | [`Radians`](../../types/type-aliases/Radians.md)                                          | Geodetic latitude in **rad** (finite, in \[-π/2, π/2]).                                                                                                                          |
| `lambda`  | [`Radians`](../../types/type-aliases/Radians.md)                                          | Geodetic longitude in **rad** (finite), east positive.                                                                                                                           |
| `weather` | [`SpaceWeatherInterface`](../../types/interfaces/SpaceWeatherInterface.md)                | F10.7, its 81-day average and Ap: see [SpaceWeatherInterface](../../types/interfaces/SpaceWeatherInterface.md). With `apHistory`, its 3-hour Ap values are used instead of `ap`. |

## Returns

[`AtmosphereInterface`](../../types/interfaces/AtmosphereInterface.md)

The state of the atmosphere: see
[AtmosphereInterface](../../types/interfaces/AtmosphereInterface.md).

## Throws

If `date` is not a valid `Date`, or a number is not finite.

## Throws

If `h < 0`, `|phi| > π/2`, `f107 <= 0`, `f107a <= 0`, `ap < 0`, or `apHistory`
isn't 7 finite numbers >= 0; or if the model has no physical result there, at
extreme geomagnetic activity.

## Example

```ts
// 400 km above Oslo at noon on midsummer's day, moderate solar activity
const air = nrlmsise00(
  new Date('2026-06-21T12:00:00Z'),
  400_000,
  (59.91 * Math.PI) / 180,
  (10.75 * Math.PI) / 180,
  { f107: 150, f107a: 150, ap: 4 }
);

air.density; // ≈ 4.6e-12 kg/m³
air.temperature; // ≈ 1188 K
```

## See

- Picone, J. M., Hedin, A. E., Drob, D. P. & Aikin, A. C. (2002). NRLMSISE-00
  empirical model of the atmosphere: Statistical comparisons and scientific
  issues. _J. Geophys. Res._ 107(A12), 1468.
  [doi:10.1029/2002JA009430](https://doi.org/10.1029/2002JA009430)
- [atmosphericDragAcceleration](atmosphericDragAcceleration.md)
