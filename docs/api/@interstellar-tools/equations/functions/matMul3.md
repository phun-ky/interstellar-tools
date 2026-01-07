[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / matMul3

# Function: matMul3()

```ts
function matMul3(A: Matrix3x3Type, B: Matrix3x3Type): Matrix3x3Type;
```

Defined in:
[helpers/mat-mul3.ts:46](https://github.com/phun-ky/interstellar-tools/blob/079e297432574505029c4778a38f2852dffc7694/packages/equations/src/categories/helpers/mat-mul3.ts#L46)

Multiply two **3×3 matrices** (row-major).

Computes:

$$
\mathbf{C} = \mathbf{A}\mathbf{B}
$$

Using standard matrix multiplication:

$$
C_{r,c} = \sum_{k=0}^{2} A_{r,k}\,B_{k,c}
$$

Layout:

- Matrices are treated as **row-major**: `M[row][col]`.

Common usage:

- Compose rotations / direction cosine matrices (DCMs), e.g. `R = R3 * R1 * R3`.
- Compose linear transforms in 3D geometry and mapping pipelines.

## Parameters

| Parameter | Type                                                         | Description                    |
| --------- | ------------------------------------------------------------ | ------------------------------ |
| `A`       | [`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md) | Left matrix (3×3, row-major).  |
| `B`       | [`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md) | Right matrix (3×3, row-major). |

## Returns

[`Matrix3x3Type`](../../types/type-aliases/Matrix3x3Type.md)

The product matrix `A * B` (3×3, row-major).

## Example

```ts
const A: Matrix3x3Type = [
  [1, 2, 3],
  [0, 1, 4],
  [5, 6, 0]
];

const B: Matrix3x3Type = [
  [-2, 1, 0],
  [3, 0, 0],
  [4, 5, 1]
];

const C = matMul3(A, B);
// C is A*B
```
