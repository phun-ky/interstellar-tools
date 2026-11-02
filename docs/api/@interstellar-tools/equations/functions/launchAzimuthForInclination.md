[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / launchAzimuthForInclination

# Function: launchAzimuthForInclination()

```ts
function launchAzimuthForInclination(
  lat: Radians,
  i: Radians
): LaunchAzimuthsInterface;
```

Defined in:
[orbits/launch-azimuth-for-inclination.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/launch-azimuth-for-inclination.ts#L74)

Compute the **inertial launch azimuths** that reach an inclination from a
latitude.

$$
\sin\beta = \frac{\cos i}{\cos\varphi}
$$

Where:

- $\beta$ is the inertial azimuth, clockwise from north (rad)
- $i$ is the target inclination (rad)
- $\varphi$ is the geocentric launch latitude (rad)

Two azimuths reach every reachable inclination: one heading north ($\beta$) and
one heading south ($\pi - \beta$).

**Units**

- Inputs: `lat` and `i` in **radians**.
- Output: both azimuths in **radians**, in \[0, 2π).

::: info Notes

- `lat` is the **geocentric** latitude. Published latitudes are usually
  geodetic, which on Earth differ by up to 0.19°, and the inclination by about
  as much. Convert first (see
  [#186](https://github.com/phun-ky/interstellar-tools/issues/186)).
- A site can only reach inclinations between $|\varphi|$ and $\pi - |\varphi|$
  directly. Anything else needs a plane change, or a dogleg during ascent.
- The azimuths are inertial. Over the ground, the rocket flies a slightly
  different heading; see [rotatingLaunchAzimuth](rotatingLaunchAzimuth.md).
- At $i = |\varphi|$ the two solutions meet, due east (or due west for
  retrograde orbits).

:::

::: practice To the ISS from Cape Canaveral

**44.9°**

_Inertial azimuth from Pad 39A, 28.447° N geocentric, to an orbit inclined
51.64°_

Over the ground the rocket flies 42.7°, because the pad is already moving east
at 409 m/s.

```ts
launchAzimuthForInclination(toRad(28.447), toRad(51.64)).northbound; // ≈ 44.9°
```

:::

## Parameters

| Parameter | Type                                             | Description                                                                   |
| --------- | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `lat`     | [`Radians`](../../types/type-aliases/Radians.md) | Geocentric launch latitude $\varphi$ in **radians** (finite, in (-π/2, π/2)). |
| `i`       | [`Radians`](../../types/type-aliases/Radians.md) | Target inclination $i$ in **radians** (finite, in \[0, π]).                   |

## Returns

[`LaunchAzimuthsInterface`](../interfaces/LaunchAzimuthsInterface.md)

The northbound and southbound inertial azimuths, in **radians**.

## Throws

If any input is not a finite number.

## Throws

If `lat` is not in (-π/2, π/2), `i` is not in \[0, π], or `i` can't be reached
from `lat` (`i < |lat|` or `i > π - |lat|`).

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

// A sun-synchronous orbit (97.8°) from Vandenberg (34.7° N)
const { southbound } = launchAzimuthForInclination(toRad(34.7), toRad(97.8));
// southbound ≈ 189.5°: south, slightly west
```

## See

- [inclinationFromLaunchAzimuth](inclinationFromLaunchAzimuth.md)
- https://en.wikipedia.org/wiki/Launch_azimuth Launch azimuth
