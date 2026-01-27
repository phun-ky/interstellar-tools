[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / sub

# Function: sub()

```ts
function sub(a: Vector3DTupleType, b: Vector3DTupleType): Vector3DTupleType;
```

Defined in:
[helpers/misc.ts:61](https://github.com/phun-ky/interstellar-tools/blob/eff06b9f9625e7af500504740b2185442c1f3c08/packages/equations/src/categories/helpers/misc.ts#L61)

Subtract two 3D vectors (`a - b`).

## Parameters

| Parameter | Type                                                                 | Description        |
| --------- | -------------------------------------------------------------------- | ------------------ |
| `a`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Minuend vector.    |
| `b`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Subtrahend vector. |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Difference vector `a - b`.

## Example

```ts
sub([3, 2, 1], [1, 1, 1]); // [2, 1, 0]
```
