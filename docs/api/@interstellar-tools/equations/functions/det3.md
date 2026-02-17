[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / det3

# Function: det3()

```ts
function det3(A: Matrix3x3Type): number;
```

Defined in:
[helpers/det-3.ts:52](https://github.com/phun-ky/interstellar-tools/blob/0d7df195ae500c345b1c6ecb00826679455e45ef/packages/equations/src/categories/helpers/det-3.ts#L52)

Compute the **determinant** of a **3×3** matrix (row-major).

For:

$$
\mathbf{A}=
\begin{bmatrix}
a & b & c \\
d & e & f \\
g & h & i
\end{bmatrix}
$$

This returns:

$$
\det(\mathbf{A}) = a(ei - fh) - b(di - fg) + c(dh - eg)
$$

Notes:

- Matrices are treated as **row-major**: `A[row][col]`.
- For a proper rotation matrix / DCM, `det(A) ≈ +1`.
- A determinant of `0` indicates the matrix is singular (non-invertible).

## Parameters

| Parameter | Type                                                         | Description             |
| --------- | ------------------------------------------------------------ | ----------------------- |
| `A`       | [`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md) | 3×3 matrix (row-major). |

## Returns

`number`

Determinant `det(A)`.

## Examples

```ts
const I: Matrix3x3Type = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];

det3(I); // 1
```

```ts
const A: Matrix3x3Type = [
  [1, 2, 3],
  [0, 1, 4],
  [5, 6, 0]
];

det3(A); // 1
```
