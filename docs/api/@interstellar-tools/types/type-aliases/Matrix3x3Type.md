[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Matrix3x3Type

# Type Alias: Matrix3x3Type

```ts
type Matrix3x3Type = readonly [
  readonly [number, number, number],
  readonly [number, number, number],
  readonly [number, number, number]
];
```

Defined in:
[math.ts:44](https://github.com/phun-ky/interstellar-tools/blob/079e297432574505029c4778a38f2852dffc7694/packages/types/src/math.ts#L44)

Immutable 3×3 matrix of numbers.

This type is typically used for **direction cosine matrices (DCMs)** / rotation
matrices and other small linear transforms in 3D Cartesian space.

Layout:

- Row-major: `M[row][col]`
- Each row is a 3-tuple `[x, y, z]` (i.e., column 0..2).

## Example

```ts
const I: Matrix3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];
```
