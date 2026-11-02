[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rotatingLaunchAzimuth

# Function: rotatingLaunchAzimuth()

```ts
function rotatingLaunchAzimuth(
  azimuth: Radians,
  v: number,
  vRot: number
): Radians;
```

Defined in:
[orbits/rotating-launch-azimuth.ts:51](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/rotating-launch-azimuth.ts#L51)

Compute the **azimuth over the ground** for an inertial launch azimuth, on a
rotating body.

$$
\tan\beta_\text{rot} = \frac{v \sin\beta - v_\text{rot}}{v \cos\beta}
$$

Where:

- $\beta$ is the inertial azimuth, clockwise from north (rad)
- $v$ is the inertial speed to reach, e.g. the orbital speed at insertion (m/s)
- $v_\text{rot}$ is the pad's eastward speed from the body's rotation (m/s)

**Units**

- Inputs: `azimuth` in **radians**, `v` and `vRot` in **m/s**.
- Output: $\beta_\text{rot}$ in **radians**, in \[0, 2π).

::: info Notes

- The pad is already moving east, so the rocket only has to add the difference:
  it steers a little further from east than the inertial azimuth.
- Get $v_\text{rot}$ from [surfaceRotationSpeed](surfaceRotationSpeed.md) and
  $\beta$ from [launchAzimuthForInclination](launchAzimuthForInclination.md).
- Uses a flat, local approximation: good for the azimuth at launch, not for the
  whole ascent.

:::

## Parameters

| Parameter | Type                                             | Description                                                             |
| --------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `azimuth` | [`Radians`](../../types/type-aliases/Radians.md) | Inertial azimuth $\beta$ in **radians**, clockwise from north (finite). |
| `v`       | `number`                                         | Inertial speed $v$ in **m/s** (finite, > 0).                            |
| `vRot`    | `number`                                         | Eastward surface speed $v_\text{rot}$ in **m/s** (finite).              |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Azimuth over the ground $\beta_\text{rot}$ in **radians**, in \[0, 2π).

## Throws

If any input is not a finite number.

## Throws

If `v <= 0`, or the speed over the ground is zero (the target velocity equals
the pad's).

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

const toRad = (deg: number) => ((deg * Math.PI) / 180) as Radians;

// Due north inertially at 7.8 km/s, from a pad moving east at 409 m/s
const beta = rotatingLaunchAzimuth(toRad(0), 7800, 409);
// beta ≈ 357.0°: aim slightly west of north to cancel the pad's eastward speed
```

## See

- [launchAzimuthForInclination](launchAzimuthForInclination.md)
- [surfaceRotationSpeed](surfaceRotationSpeed.md)
