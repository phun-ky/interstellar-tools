[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / inclinationFromLaunchAzimuth

# Function: inclinationFromLaunchAzimuth()

```ts
function inclinationFromLaunchAzimuth(lat: Radians, azimuth: Radians): Radians;
```

Defined in:
[orbits/inclination-from-launch-azimuth.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/inclination-from-launch-azimuth.ts#L64)

Compute the **inclination** of the orbit reached by launching from a latitude on
an azimuth.

$$
\cos i = \cos\varphi \,\sin\beta
$$

Where:

- $i$ is the orbit's inclination (rad)
- $\varphi$ is the geocentric latitude of the point (rad)
- $\beta$ is the inertial azimuth or heading at that point, clockwise from north
  (rad)

**Units**

- Inputs: `lat` and `azimuth` in **radians**.
- Output: $i$ in **radians**, in \[0, π].

::: info Notes

- `lat` is the **geocentric** latitude. Published latitudes are usually
  geodetic, which on Earth differ by up to 0.19°, and the inclination by about
  as much. Convert first (see
  [#186](https://github.com/phun-ky/interstellar-tools/issues/186)).
- The relation holds at every point of the ground track, not only at launch: an
  orbit never reaches a latitude higher than its inclination.
- Launching due east ($\beta = 90°$) gives the lowest inclination a site can
  reach without a plane change: its own latitude.
- Azimuths between 180° and 360° head west, into retrograde orbits ($i > 90°$).
- `azimuth` is inertial. A rocket's azimuth over the ground differs, because the
  pad is moving east; see [rotatingLaunchAzimuth](rotatingLaunchAzimuth.md).

:::

::: practice Apollo 11, entering Earth orbit

**32.52°**

_At orbit insertion: 32.497° N geocentric, heading 88.848°_

The flown parking orbit was inclined 32.521°. Apollo 11 entered orbit near the
northernmost point of its track, heading almost due east. With the published
geodetic latitude, 32.672°, the result would be 32.69°.

```ts
inclinationFromLaunchAzimuth(toRad(32.497), toRad(88.848)); // ≈ 32.52°
```

:::

## Parameters

| Parameter | Type                                             | Description                                                             |
| --------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `lat`     | [`Radians`](../../types/type-aliases/Radians.md) | Geocentric latitude $\varphi$ in **radians** (finite, in \[-π/2, π/2]). |
| `azimuth` | [`Radians`](../../types/type-aliases/Radians.md) | Inertial azimuth $\beta$ in **radians**, clockwise from north (finite). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Inclination $i$ in **radians**, in \[0, π].

## Throws

If any input is not a finite number.

## Throws

If `lat` is outside \[-π/2, π/2].

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

// Baikonur (45.97° N), launching north-east at 63°
const i = inclinationFromLaunchAzimuth(toRad(45.97), toRad(63));
// i ≈ 51.7°
```

## See

- [launchAzimuthForInclination](launchAzimuthForInclination.md)
- https://en.wikipedia.org/wiki/Launch_azimuth Launch azimuth
