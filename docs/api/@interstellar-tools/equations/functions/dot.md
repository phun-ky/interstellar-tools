[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / dot

# Function: dot()

```ts
function dot(a: Vector3DTupleType, b: Vector3DTupleType): number;
```

Defined in:
[helpers/misc.ts:85](https://github.com/phun-ky/interstellar-tools/blob/dcd3a66d393fbe7b89573e26e1161f598ed5d4fd/packages/equations/src/categories/helpers/misc.ts#L85)

Compute the **dot product** of two 3D vectors.

$$
\mathbf{a}\cdot\mathbf{b} = a_x b_x + a_y b_y + a_z b_z
$$

## Parameters

| Parameter | Type                                                                 | Description    |
| --------- | -------------------------------------------------------------------- | -------------- |
| `a`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | First vector.  |
| `b`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Second vector. |

## Returns

`number`

Dot product (units: product of the input component units).

## Example

```ts
dot([1, 2, 3], [4, 5, 6]); // 32
```
