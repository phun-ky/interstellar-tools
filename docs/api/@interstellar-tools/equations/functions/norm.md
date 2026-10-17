[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / norm

# Function: norm()

```ts
function norm(v: Vector3DTupleType): number;
```

Defined in:
[helpers/misc.ts:22](https://github.com/phun-ky/interstellar-tools/blob/2097e53acceb41ae322e6aa3a44460924fa066e2/packages/equations/src/categories/helpers/misc.ts#L22)

Compute the **Euclidean norm** (length / magnitude) of a 3D vector.

$$
\lVert \mathbf{v} \rVert = \sqrt{x^2 + y^2 + z^2}
$$

Uses `Math.hypot` for numerical stability.

## Parameters

| Parameter | Type                                                                 | Description            |
| --------- | -------------------------------------------------------------------- | ---------------------- |
| `v`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | 3D vector `[x, y, z]`. |

## Returns

`number`

Vector magnitude (same units as the components of `v`).

## Example

```ts
norm([3, 4, 12]); // 13
```
