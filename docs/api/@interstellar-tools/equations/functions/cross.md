[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / cross

# Function: cross()

```ts
function cross(a: Vector3DTupleType, b: Vector3DTupleType): Vector3DTupleType;
```

Defined in:
[helpers/misc.ts:106](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/misc.ts#L106)

Compute the **cross product** of two 3D vectors.

$$
\mathbf{a}\times\mathbf{b} = \begin{pmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{pmatrix}
$$

## Parameters

| Parameter | Type                                                                 | Description    |
| --------- | -------------------------------------------------------------------- | -------------- |
| `a`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | First vector.  |
| `b`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Second vector. |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

Cross product, perpendicular to both (units: product of the input component
units).

## Example

```ts
cross([1, 0, 0], [0, 1, 0]); // [0, 0, 1]
```
