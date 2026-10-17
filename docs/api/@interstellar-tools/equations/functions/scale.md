[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / scale

# Function: scale()

```ts
function scale(v: Vector3DTupleType, s: number): Vector3DTupleType;
```

Defined in:
[helpers/misc.ts:44](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/equations/src/categories/helpers/misc.ts#L44)

Scale a 3D vector by a scalar.

Computes:

$$
s\mathbf{v} = [sx, sy, sz]
$$

## Parameters

| Parameter | Type                                                                 | Description            |
| --------- | -------------------------------------------------------------------- | ---------------------- |
| `v`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | 3D vector `[x, y, z]`. |
| `s`       | `number`                                                             | Scalar multiplier.     |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Scaled vector `s * v`.

## Example

```ts
scale([1, -2, 3], 10); // [10, -20, 30]
```
