[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / centralAngleFromVectors

# Function: centralAngleFromVectors()

```ts
function centralAngleFromVectors(
  r1: Vector3DTupleType,
  r2: Vector3DTupleType
): Radians;
```

Defined in:
[cartography/central-angle-from-vectors.ts:43](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/cartography/central-angle-from-vectors.ts#L43)

Compute the **central angle** between two position vectors, without trigonometry
on latitude and longitude.

$$
\Delta\sigma = \operatorname{atan2}\big(\lVert\mathbf r_1 \times \mathbf r_2\rVert,\ \mathbf r_1 \cdot \mathbf r_2\big)
$$

Where:

- $\mathbf r_1$, $\mathbf r_2$ are the two positions, from the body's centre

**Units**

- Inputs: `r1`, `r2` in any length unit, the same for both.
- Output: $\Delta\sigma$ in **radians**, in \[0, π].

::: info Notes

- The `atan2` form is accurate at every angle, unlike $\arccos$ of the
  normalised dot product, which loses precision near 0 and π.
- The vectors' lengths don't matter, only their directions: the angle between a
  ground station and a satellite above another point is the angle between the
  points below them.
- Works with body-fixed positions from
  [geodeticToBodyFixed](geodeticToBodyFixed.md), giving the angle at the centre,
  not along the ellipsoid.

:::

## Parameters

| Parameter | Type                                                                 | Description                                           |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `r1`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | First position vector (finite components, not zero).  |
| `r2`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Second position vector (finite components, not zero). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The central angle $\Delta\sigma$ in **radians**.

## Throws

If a component is not a finite number.

## Throws

If either vector is zero.

## Example

```ts
// The x and y axes are a quarter turn apart
centralAngleFromVectors([1, 0, 0], [0, 5, 0]); // π/2
```

## See

- [centralAngle](centralAngle.md)
- [greatCircleDistance](greatCircleDistance.md)
