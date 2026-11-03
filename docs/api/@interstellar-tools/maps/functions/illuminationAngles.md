[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
illuminationAngles

# Function: illuminationAngles()

```ts
function illuminationAngles(
  normal: Vector3DTupleType,
  toSun: Vector3DTupleType,
  toObserver: Vector3DTupleType
): IlluminationAnglesInterface;
```

Defined in:
[imaging/illumination-angles.ts:73](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/imaging/illumination-angles.ts#L73)

Compute the **illumination angles** at a point on a surface: incidence, emission
and phase.

$$
\cos i = \hat n\cdot\hat s, \qquad \cos e = \hat n\cdot\hat o, \qquad \cos g = \hat s\cdot\hat o
$$

Where:

- $\hat n$ is the surface normal, pointing out of the ground
- $\hat s$ is the direction from the point to the Sun
- $\hat o$ is the direction from the point to the observer

**Units**

- Inputs: three direction vectors in any frame, the same for all three; their
  lengths don't matter.
- Output: the incidence, emission and phase angles in **radians**, each in \[0,
  π].

::: info Notes

- Each angle is computed as $\operatorname{atan2}(\lVert a \times b\rVert, a
  \cdot b)$, accurate at every angle, not as $\arccos$ of the dot product.
- An incidence above π/2 means the Sun is below the local horizon: the point is
  in shadow. An emission above π/2 means the observer can't see it.
- A low phase angle, with the Sun behind the observer, hides the shadows that
  show relief, and surfaces like the Moon's brighten sharply (the opposition
  effect). Mapping cameras prefer a moderate phase and a high incidence, so
  shadows bring out the terrain.
- Feed the angles to [lambertReflectance](lambertReflectance.md) or
  [lommelSeeligerReflectance](lommelSeeligerReflectance.md).

:::

::: practice Apollo 11, the approach to Tranquility Base

**5.2°**

_The phase angle at the landing site, seen from Eagle on its 16° descent path,
with the Sun 10.8° up behind it_

Apollo 11 launched on the day and in the window that put the Sun 10.8° above
Tranquility Base at landing. Planners wanted the Sun low, so craters cast
shadows, but not near the descent angle: as the phase angle closes on zero, the
shadows disappear and the ground washes out. The incidence was 79.2° and the
emission 74.0°.

```ts
const up: Vector3DTupleType = [0, 0, 1];
const sun = [Math.cos(toRad(10.8)), 0, Math.sin(toRad(10.8))] as const;
const eagle = [Math.cos(toRad(16)), 0, Math.sin(toRad(16))] as const;
illuminationAngles(up, sun, eagle).phase; // ≈ 5.2°
```

:::

## Parameters

| Parameter    | Type                                                                 | Description                                                       |
| ------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `normal`     | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Surface normal $\hat n$ (finite components, not zero).            |
| `toSun`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Direction to the Sun $\hat s$ (finite components, not zero).      |
| `toObserver` | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Direction to the observer $\hat o$ (finite components, not zero). |

## Returns

[`IlluminationAnglesInterface`](../../types/interfaces/IlluminationAnglesInterface.md)

The incidence, emission and phase angles.

## Throws

If a component is not a finite number.

## Throws

If a vector is zero.

## Example

```ts
// Sun 30° from overhead, looking straight down
illuminationAngles([0, 0, 1], [0.5, 0, Math.sqrt(3) / 2], [0, 0, 1]);
// { incidence: π/6, emission: 0, phase: π/6 }
```

## See

- [lambertReflectance](lambertReflectance.md)
- [lommelSeeligerReflectance](lommelSeeligerReflectance.md)
