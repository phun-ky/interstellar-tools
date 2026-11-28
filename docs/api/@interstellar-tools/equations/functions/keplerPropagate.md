[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / keplerPropagate

# Function: keplerPropagate()

```ts
function keplerPropagate(
  r0: Vector3DTupleType,
  v0: Vector3DTupleType,
  dt: number,
  mu: number
): StateVectorInterface;
```

Defined in:
[orbits/kepler-propagate.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/kepler-propagate.ts#L87)

## Parameters

| Parameter | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `r0`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) |
| `v0`      | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) |
| `dt`      | `number`                                                             |
| `mu`      | `number`                                                             |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)
