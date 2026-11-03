[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
hillshadeAt

# Function: hillshadeAt()

```ts
function hillshadeAt(
  slope: Radians,
  aspect: Radians,
  sunAzimuth: Radians,
  sunElevation: Radians
): number;
```

Defined in:
[terrain/hillshade.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/hillshade.ts#L93)

Compute the **hillshade** of a patch of terrain: how brightly the Sun lights it,
from its slope and aspect.

$$
\cos i = \sin\alpha\cos s + \cos\alpha\sin s\cos(\psi - A),
\qquad
\text{hillshade} = \max(0, \cos i)
$$

Where:

- $s$ is the slope and $A$ the aspect, clockwise from north (rad), from
  [slopeAt](slopeAt.md) and [aspectAt](aspectAt.md)
- $\psi$ is the Sun's azimuth, clockwise from north, and $\alpha$ its elevation
  above the horizon (rad)
- $i$ is the angle between the Sun and the ground's normal: the incidence angle

**Units**

- Inputs: all angles in **radians**.
- Output: brightness in \[0, 1]: 1 facing the Sun squarely, 0 facing away from
  it.

::: info Notes

- It's [lambertReflectance](lambertReflectance.md) for the ground's normal: what
  shaded relief maps show. Level ground gets $\sin\alpha$; a slope facing the
  Sun gets more, one facing away less.
- The Sun's azimuth uses the same convention as the aspect, so a slope faces the
  Sun when $\psi = A$.
- Only the patch's own orientation counts: it doesn't know about shadows cast by
  other terrain, such as a crater's rim. A slope can be lit while the Sun is
  below the horizon, if it faces it steeply enough.
- Level ground has no aspect: with `slope` 0, `aspect` is ignored and may be
  `NaN`. A `NaN` slope, from the edge of a grid or a missing cell, gives `NaN`.

:::

::: practice Apollo 11, morning at Tranquility Base

**0.19**

_Level ground, with the Sun 10.8° above the eastern horizon_

A 10° slope facing the Sun was almost twice as bright, 0.36, and one facing away
almost black, 0.01. That contrast is why Apollo landings came in with the Sun
low behind them: craters and boulders stood out.

```ts
const sun = toRad(10.8);
const east = toRad(90);
hillshadeAt(0 as Radians, NaN as Radians, east, sun); // ≈ 0.19
hillshadeAt(toRad(10), east, east, sun); // ≈ 0.36
hillshadeAt(toRad(10), toRad(270), east, sun); // ≈ 0.01
```

:::

## Parameters

| Parameter      | Type                                             | Description                                                                          |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `slope`        | [`Radians`](../../types/type-aliases/Radians.md) | Slope $s$ in **radians** (in \[0, π/2], or `NaN`).                                   |
| `aspect`       | [`Radians`](../../types/type-aliases/Radians.md) | Aspect $A$ in **radians**, clockwise from north (finite; ignored when `slope` is 0). |
| `sunAzimuth`   | [`Radians`](../../types/type-aliases/Radians.md) | Sun's azimuth $\psi$ in **radians**, clockwise from north (finite).                  |
| `sunElevation` | [`Radians`](../../types/type-aliases/Radians.md) | Sun's elevation $\alpha$ above the horizon in **radians** (in \[−π/2, π/2]).         |

## Returns

`number`

The hillshade in \[0, 1], or `NaN` for a `NaN` slope.

## Throws

If `sunAzimuth`, `sunElevation` or a sloping cell's `aspect` is not finite, or
`slope` is infinite.

## Throws

If `slope` is outside \[0, π/2], or `sunElevation` outside \[−π/2, π/2].

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// A 30° slope facing south, the Sun 45° up in the south
hillshadeAt(
  (Math.PI / 6) as Radians,
  Math.PI as Radians,
  Math.PI as Radians,
  (Math.PI / 4) as Radians
); // sin 75° ≈ 0.97
```

## See

- [hillshadeGrid](hillshadeGrid.md)
- [lambertReflectance](lambertReflectance.md)
- https://doi.org/10.1109/PROC.1981.11918 Horn (1981), Hill shading and the
  reflectance map
