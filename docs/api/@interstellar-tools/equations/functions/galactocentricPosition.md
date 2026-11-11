[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galactocentricPosition

# Function: galactocentricPosition()

```ts
function galactocentricPosition(
  direction: GalacticDirectionInterface,
  distance: DistanceInterface,
  options?: GalactocentricPositionOptionsInterface
): PositionInterface;
```

Defined in:
[galactic/galactocentric-position.ts:94](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-position.ts#L94)

The **position around the Milky Way's centre** of something seen from the Sun:
turns a direction in galactic coordinates and a distance, as `GALAXIES` in
`@interstellar-tools/constants` gives them, into $x$, $y$, $z$ in the
`'galactocentric'` frame.

The frame is Astropy's `Galactocentric`: `x` points from the Sun towards the
centre, `y` in the direction the Sun moves around it (galactic longitude 90°),
and `z` to the galaxy's north pole. From the Sun's position in galactic
coordinates,

$$
X = d \cos b \cos l - R_0, \quad Y = d \cos b \sin l, \quad Z = d \sin b
$$

the plane is tilted by $\theta = \arcsin(z_\odot / R_0)$, because the Sun is
$z_\odot$ above it:

$$
x = X \cos\theta + Z \sin\theta, \quad y = Y, \quad z = -X \sin\theta + Z \cos\theta
$$

::: info Notes

- The centre is where Astropy puts it: at $R_0$ towards galactic longitude and
  latitude 0°, the IAU's galactic centre, 4.3′ (10.5 pc) from Sagittarius A\*.
- It matches Astropy's transform from right ascension and declination to about 2
  parts in a million of the distance, the size of the difference between the
  IAU's galactic coordinates and Astropy's centre.
- The Sun itself, at distance 0, is at $(-\sqrt{R_0^2 - z_\odot^2}, 0,
  z_\odot)$.

:::

## Parameters

| Parameter   | Type                                                                                                | Description                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `direction` | [`GalacticDirectionInterface`](../../types/interfaces/GalacticDirectionInterface.md)                | The direction from the Sun: galactic longitude `l` and latitude `b`, in degrees. |
| `distance`  | [`DistanceInterface`](../../types/interfaces/DistanceInterface.md)                                  | The distance from the Sun.                                                       |
| `options?`  | [`GalactocentricPositionOptionsInterface`](../interfaces/GalactocentricPositionOptionsInterface.md) | The unit of the result, and the Sun's place, if not the defaults.                |

## Returns

[`PositionInterface`](../../types/interfaces/PositionInterface.md)

The position in the `'galactocentric'` frame, in `options.unit` or the unit of
`distance`.

## Throws

If an angle or a distance isn't finite, `b` is outside −90° to 90°, `distance`
is negative, or the Sun's height isn't less than its distance from the centre.

## Example

```ts
import { GALAXIES } from '@interstellar-tools/constants';
import { galactocentricPosition } from '@interstellar-tools/equations';

const andromeda = GALAXIES.find((galaxy) => galaxy.id === 'andromeda')!;
const position = galactocentricPosition(
  andromeda.direction!,
  andromeda.distance,
  { unit: 'kpc' }
);

console.log(position.x.value, position.y.value, position.z.value); // ≈ -375.31 605.50 -278.87
```

## See

https://docs.astropy.org/en/stable/coordinates/galactocentric.html Astropy: the
Galactocentric frame
