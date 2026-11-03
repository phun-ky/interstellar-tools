[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
lommelSeeligerReflectance

# Function: lommelSeeligerReflectance()

```ts
function lommelSeeligerReflectance(
  incidence: Radians,
  emission: Radians
): number;
```

Defined in:
[imaging/lommel-seeliger-reflectance.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/imaging/lommel-seeliger-reflectance.ts#L46)

Compute the relative brightness of a **Lommel–Seeliger** surface: a dark, dusty
one, like the Moon or an asteroid.

$$
r \propto \frac{\cos i}{\cos i + \cos e}
$$

Where:

- $i$ is the incidence angle and $e$ the emission angle (rad), from
  [illuminationAngles](illuminationAngles.md)

**Units**

- Inputs: `incidence` and `emission` in **radians**.
- Output: relative reflectance, in \[0, 1].

::: info Notes

- Light that enters a dark, porous surface is mostly absorbed before it can
  scatter twice, so what comes back depends on the path in and the path out.
  That's why the full Moon looks evenly lit to its edge, instead of fading like
  a Lambertian ball.
- Equals 1/2 whenever $i = e$, and grows towards 1 as the observer looks closer
  to the horizon.
- Returns 0 when the point is in shadow ($i \ge \pi/2$) or out of sight ($e \ge
  \pi/2$).
- Doesn't model the opposition surge near zero phase; see
  [illuminationAngles](illuminationAngles.md).

:::

## Parameters

| Parameter   | Type                                             | Description                                        |
| ----------- | ------------------------------------------------ | -------------------------------------------------- |
| `incidence` | [`Radians`](../../types/type-aliases/Radians.md) | Incidence angle $i$ in **radians** (finite, >= 0). |
| `emission`  | [`Radians`](../../types/type-aliases/Radians.md) | Emission angle $e$ in **radians** (finite, >= 0).  |

## Returns

`number`

The relative reflectance, in \[0, 1].

## Throws

If any input is not a finite number.

## Throws

If any input is negative.

## Example

```ts
import type { Radians } from '@interstellar-tools/types';

// Lit and seen from the same angle
lommelSeeligerReflectance((Math.PI / 4) as Radians, (Math.PI / 4) as Radians); // 0.5
```

## See

- [lambertReflectance](lambertReflectance.md)
- [illuminationAngles](illuminationAngles.md)
