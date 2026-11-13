[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / galactocentricToGalactic

# Function: galactocentricToGalactic()

```ts
function galactocentricToGalactic(
  position: PositionInterface,
  options?: GalactocentricToGalacticOptionsInterface
): GalacticDirectionAndDistanceInterface;
```

Defined in:
[galactic/galactocentric-to-galactic.ts:90](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/galactic/galactocentric-to-galactic.ts#L90)

The **direction and distance from the Sun of a galactocentric position**: the
inverse of [galactocentricPosition](galactocentricPosition.md). It untilts the
plane by $\theta = \arcsin(z_\odot / R_0)$, moves the origin back to the Sun,
and reads off the galactic longitude, latitude and distance:

$$
X = x \cos\theta - z \sin\theta + R_0, \quad Y = y, \quad Z = x \sin\theta + z \cos\theta
$$

$$
d = \sqrt{X^2 + Y^2 + Z^2}, \quad l = \operatorname{atan2}(Y, X), \quad b = \operatorname{atan2}\left(Z, \sqrt{X^2 + Y^2}\right)
$$

::: info Notes

- Use the same `sunDistance` and `sunHeight` as the position was made with.
- At the Sun itself, distance 0, the direction means nothing.

:::

## Parameters

| Parameter  | Type                                                                                                    | Description                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `position` | [`PositionInterface`](../../types/interfaces/PositionInterface.md)                                      | A position in the `'galactocentric'` frame.                         |
| `options?` | [`GalactocentricToGalacticOptionsInterface`](../interfaces/GalactocentricToGalacticOptionsInterface.md) | The unit of the distance, and the Sun's place, if not the defaults. |

## Returns

[`GalacticDirectionAndDistanceInterface`](../interfaces/GalacticDirectionAndDistanceInterface.md)

The direction from the Sun, `l` from 0° up to 360°, and the distance.

## Throws

If the position isn't in the `'galactocentric'` frame, a coordinate isn't
finite, or the Sun's height isn't less than its distance from the centre.

## Example

```ts
// The origin, the Milky Way's centre: R0 from the Sun, towards l = b = 0
const { direction, distance } = galactocentricToGalactic({
  frame: 'galactocentric',
  x: { value: 0, unit: 'pc' },
  y: { value: 0, unit: 'pc' },
  z: { value: 0, unit: 'pc' }
}); // direction { l: 0, b: 0 }, distance { value: 8275.9, unit: 'pc' }
```

## See

[galactocentricPosition](galactocentricPosition.md), its inverse.
