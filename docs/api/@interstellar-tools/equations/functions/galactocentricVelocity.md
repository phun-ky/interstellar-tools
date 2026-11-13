[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galactocentricVelocity

# Function: galactocentricVelocity()

```ts
function galactocentricVelocity(
  direction: GalacticDirectionInterface,
  distance: DistanceInterface,
  motion: ObservedMotionInterface,
  options?: GalactocentricVelocityOptionsInterface
): VelocityInterface;
```

Defined in:
[galactic/galactocentric-velocity.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-velocity.ts#L99)

The **velocity around the Milky Way's centre** of something seen from the Sun,
in km/s, in the `'galactocentric'` frame: from its direction, distance and
motion, as `GALAXIES` in `@interstellar-tools/constants` gives them.

With $\hat{r}$ the direction from the Sun and $\hat{p}$, $\hat{q}$ east and
north on the sky there, the velocity from the Sun is

$$
\vec{v}_\odot = v_r \hat{r} + k\, d \left(\mu_{\alpha*} \hat{p} + \mu_\delta \hat{q}\right),
\qquad k = 4.74047\ \text{km/s per kpc·mas/yr}
$$

It's turned into galactic coordinates, tilted into the frame's axes as
[galactocentricPosition](galactocentricPosition.md) does, and the Sun's own
velocity is added.

::: info Notes

- It matches Astropy's `Galactocentric` frame to about 0.01 km/s, given the same
  Sun.
- Where the proper motion isn't measured, as for M87 and Centaurus A, it's taken
  as 0, so only the motion along the line of sight counts. At their distances, a
  sideways speed of hundreds of km/s is a few µas/yr, too small to measure yet.
- A proper motion of 10 µas/yr is 36 km/s at Andromeda's distance: its sideways
  speed is uncertain by about 40 km/s.

:::

## Parameters

| Parameter   | Type                                                                                                | Description                                                                   |
| ----------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `direction` | [`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md)                | The direction from the Sun, in galactic coordinates.                          |
| `distance`  | [`DistanceInterface`](../../types/interfaces/DistanceInterface.md)                                  | The distance from the Sun.                                                    |
| `motion`    | [`ObservedMotionInterface`](../../types/interfaces/ObservedMotionInterface.md)                      | The radial velocity in km/s and, where measured, the proper motion in mas/yr. |
| `options?`  | [`GalactocentricVelocityOptionsInterface`](../interfaces/GalactocentricVelocityOptionsInterface.md) | The Sun's place and velocity, if not the defaults.                            |

## Returns

[`VelocityInterface`](../../types/interfaces/VelocityInterface.md)

The velocity in the `'galactocentric'` frame, in km/s.

## Throws

If the direction, distance or motion isn't finite, `b` is outside −90° to 90°,
the distance is negative, or the Sun's height isn't less than its distance from
the centre.

## Example

```ts
import { GALAXIES } from '@interstellar-tools/constants';

const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
const v = galactocentricVelocity(
  andromeda.direction!,
  andromeda.distance,
  andromeda.motion!
); // { frame: 'galactocentric', x: 37.11, y: -119.81, z: -10.86 }
```

## See

[galactocentricPosition](galactocentricPosition.md), for where it is.
