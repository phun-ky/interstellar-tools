[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / applyMatrix3

# Function: applyMatrix3()

```ts
function applyMatrix3(
  M: Matrix3x3Type,
  v: Vector3DTupleType
): Vector3DTupleType;
```

Defined in:
[helpers/apply-matrix-3.ts:38](https://github.com/phun-ky/interstellar-tools/blob/079e297432574505029c4778a38f2852dffc7694/packages/equations/src/categories/helpers/apply-matrix-3.ts#L38)

Apply a **3×3 matrix** to a **3D vector** (matrix–vector multiplication).

Computes:

$$
\mathbf{y} = \mathbf{M}\,\mathbf{v}
$$

With row-major indexing:

- `M[row][col]`
- `v = [x, y, z]`

This is commonly used for:

- Applying a **direction cosine matrix (DCM)** / rotation matrix to transform
  vectors between frames (e.g., inertial → body-fixed).
- Small 3D linear transforms in geometry and mapping pipelines.

## Parameters

| Parameter | Type                                                                 | Description                          |
| --------- | -------------------------------------------------------------------- | ------------------------------------ |
| `M`       | [`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)         | 3×3 matrix (row-major) (all finite). |
| `v`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | 3D vector `[x, y, z]` (all finite).  |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

The transformed vector `M * v` as a 3D tuple.

## Example

```ts
const M: Matrix3x3Type = [
  [1, 0, 0],
  [0, 0, -1],
  [0, 1, 0]
];

const v: Vector3DTupleType = [1, 2, 3];
const out = applyMatrix3(M, v);
// out === [1, -3, 2]
```
