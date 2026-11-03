[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
lambertReflectance

# Function: lambertReflectance()

```ts
function lambertReflectance(incidence: Radians): number;
```

Defined in:
[imaging/lambert-reflectance.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/imaging/lambert-reflectance.ts#L44)

Compute the relative brightness of a **Lambertian** surface: one that scatters
light equally in all directions.

$$
r \propto \cos i
$$

Where:

- $i$ is the incidence angle (rad), from
  [illuminationAngles](illuminationAngles.md)

**Units**

- Input: `incidence` in **radians**.
- Output: relative reflectance, from 1 with the Sun overhead to 0 at the horizon
  and beyond.

::: info Notes

- Doesn't depend on where it's seen from: a Lambertian surface looks equally
  bright from every direction. Snow and matte paint come close.
- Dark, dusty surfaces like the Moon's don't: their brightness depends on the
  viewing angle too, which
  [lommelSeeligerReflectance](lommelSeeligerReflectance.md) models.
- Returns 0 for an incidence past π/2, when the point is in shadow.

:::

## Parameters

| Parameter   | Type                                             | Description                                        |
| ----------- | ------------------------------------------------ | -------------------------------------------------- |
| `incidence` | [`Radians`](../../types/type-aliases/Radians.md) | Incidence angle $i$ in **radians** (finite, >= 0). |

## Returns

`number`

The relative reflectance, in \[0, 1].

## Throws

If `incidence` is not a finite number.

## Throws

If `incidence < 0`.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// The Sun 60° from overhead: half as bright as with the Sun overhead
lambertReflectance((Math.PI / 3) as Radians); // 0.5
```

## See

- [lommelSeeligerReflectance](lommelSeeligerReflectance.md)
- [illuminationAngles](illuminationAngles.md)
