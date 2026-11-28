[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
inverseMercator

# Function: inverseMercator()

```ts
function inverseMercator(
  x: number,
  y: number,
  R: number,
  __namedParameters?: ProjectionOptionsInterface
): GeographicCoordinatesInterface;
```

Defined in:
[projections/mercator.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/mercator.ts#L131)

## Parameters

| Parameter            | Type                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| `x`                  | `number`                                                                    |
| `y`                  | `number`                                                                    |
| `R`                  | `number`                                                                    |
| `__namedParameters?` | [`ProjectionOptionsInterface`](../interfaces/ProjectionOptionsInterface.md) |

## Returns

[`GeographicCoordinatesInterface`](../interfaces/GeographicCoordinatesInterface.md)
