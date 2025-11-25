[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Vector3DTupleType

# Type Alias: Vector3DTupleType

```ts
type Vector3DTupleType = readonly [number, number, number];
```

Defined in:
[math.ts:23](https://github.com/phun-ky/interstellar-tools/blob/9c13350dafd209031a6cfebe54b6883c404a0515/packages/types/src/math.ts#L23)

A read-only 3D vector tuple `[x, y, z]`.

Immutable container for Cartesian coordinates or any 3-component quantity (e.g.,
position in meters, velocity in m/s, acceleration in m/s²). The `readonly`
modifier prevents in-place mutation.

## Example

```ts
// Declaring a point/vector
const p: Vector3DTupleType = [1, 2, 3];
// p[0] = 9; // Error: cannot assign to read-only element

// Using with functions
const dot = (a: Vector3DTupleType, b: Vector3DTupleType) =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const v = [4, 5, 6] as const; // const assertion yields a readonly tuple
console.log(dot(p, v)); // 32
```

## See

- https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
