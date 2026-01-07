[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / norm

# Function: norm()

```ts
function norm(v: Vector3DTupleType): number;
```

Defined in:
[helpers/misc.ts:22](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/helpers/misc.ts#L22)

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
