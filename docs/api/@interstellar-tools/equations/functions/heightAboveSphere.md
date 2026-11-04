[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / heightAboveSphere

# Function: heightAboveSphere()

```ts
function heightAboveSphere(r: Vector3DTupleType, R: number): number;
```

Defined in:
[cartography/height-above-sphere.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/height-above-sphere.ts#L62)

Compute a point's **height above a spherical body**: its distance from the
centre less the radius.

$$
h = \lVert\mathbf r\rVert - R
$$

Where:

- $\mathbf r$ is the point's position from the body's centre (m)
- $R$ is the sphere's radius (m)

**Units**

- Inputs: `r` and `R` in **m**.
- Output: $h$ in **m**, negative below the surface.

::: info Notes

- The quick altitude readout for a position vector, in any frame centred on the
  body: the frame's orientation doesn't matter.
- On an oblate body the sphere is only an approximation. On Earth, a sphere of
  the equatorial radius puts the poles **21.4 km** too low, since the polar
  radius is that much shorter; the mean radius, 6 371 km, is 7.1 km off at the
  equator and 14.2 km at the poles. Use
  [heightAboveEllipsoid](heightAboveEllipsoid.md) for the height a map or GPS
  receiver gives.

:::

::: practice Apollo 11, in Earth orbit

**184.9 km up, on a sphere**

_At orbit insertion: 6 563.0 km from Earth's centre, at 32.502° N_

Above a sphere of Earth's equatorial radius, 6 378.137 km. The WGS84 ellipsoid
is lower at that latitude, so [heightAboveEllipsoid](heightAboveEllipsoid.md)
gives 191.1 km.

```ts
const lat = toRad(32.502);
const r = 6_563_041;
heightAboveSphere([r * Math.cos(lat), 0, r * Math.sin(lat)], 6_378_137);
// ≈ 184 904 m
```

:::

## Parameters

| Parameter | Type                                                                 | Description                                                               |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Position $\mathbf r$ from the body's centre in **m** (finite components). |
| `R`       | `number`                                                             | Radius $R$ of the sphere in **m** (finite, > 0).                          |

## Returns

`number`

The height $h$ in **m**.

## Throws

If any input is not a finite number.

## Throws

If `R <= 0`.

## Example

```ts
// 400 km above the Moon's north pole, on a 1 737.4 km sphere
heightAboveSphere([0, 0, 2_137_400], 1_737_400); // 400 000 m
```

## See

- [heightAboveEllipsoid](heightAboveEllipsoid.md)
- [horizonDistance](horizonDistance.md)
