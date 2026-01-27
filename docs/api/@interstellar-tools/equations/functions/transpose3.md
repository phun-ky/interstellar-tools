[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / transpose3

# Function: transpose3()

```ts
function transpose3(A: Matrix3x3Type): Matrix3x3Type;
```

Defined in:
[helpers/transpose-3.ts:51](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/helpers/transpose-3.ts#L51)

Transpose a **3×3 matrix** (row-major).

For a matrix:

$$
\mathbf{A} =
\begin{bmatrix}
a_{00} & a_{01} & a_{02} \\
a_{10} & a_{11} & a_{12} \\
a_{20} & a_{21} & a_{22}
\end{bmatrix}
$$

the transpose is:

$$
\mathbf{A}^\mathsf{T} =
\begin{bmatrix}
a_{00} & a_{10} & a_{20} \\
a_{01} & a_{11} & a_{21} \\
a_{02} & a_{12} & a_{22}
\end{bmatrix}
$$

Notes:

- Matrices are treated as **row-major**: `A[row][col]`.
- For rotation matrices / DCMs, the transpose is also the inverse:
  $\mathbf{R}^{-1} = \mathbf{R}^\mathsf{T}$.

## Parameters

| Parameter | Type                                                         | Description             |
| --------- | ------------------------------------------------------------ | ----------------------- |
| `A`       | [`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md) | 3×3 matrix (row-major). |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

Transposed matrix `Aᵀ` (row-major).

## Example

```ts
const A: Matrix3x3Type = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

const AT = transpose3(A);
// [
//   [1, 4, 7],
//   [2, 5, 8],
//   [3, 6, 9]
// ]
```
