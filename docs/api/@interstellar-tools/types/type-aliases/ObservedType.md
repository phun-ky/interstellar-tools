[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ObservedType

# Type Alias: ObservedType\<T _extends_ [`ValueInterface`](../interfaces/ValueInterface.md) = [`DimensionlessInterface`](../interfaces/DimensionlessInterface.md)>

```ts
type ObservedType<T extends ValueInterface = DimensionlessInterface> = T &
  ObservationMetaInterface;
```

Defined in:
[observations.ts:171](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L171)

Any unit-carrying value with **measurement metadata**. A plain value of the same
kind fits too.

## Type Parameters

| Type Parameter                                                                                  | Default type                                                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| <a id="type-parameter-t"></a> `T` _extends_ [`ValueInterface`](../interfaces/ValueInterface.md) | [`DimensionlessInterface`](../interfaces/DimensionlessInterface.md) |

## Example

```ts
const radius: ObservedType<DistanceInterface> = {
  value: 58232,
  unit: 'km',
  uncertainty: { plus: 6, minus: 6 },
  source: { catalog: 'JPL SSD' }
};
const albedo: ObservedType = { value: 0.499, provenance: 'measured' };
```
