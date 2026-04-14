[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ValueInterface

# Interface: ValueInterface

Defined in:
[numeric.ts:17](https://github.com/phun-ky/interstellar-tools/blob/f0a6e0ee96b44e433c7fed0071fb6b1240ddf668/packages/types/src/numeric.ts#L17)

Represents a numerical value.

## Example

```ts
const distance: ValueInterface = { value: 100 };
```

## Extended by

- [`MeasureInterface`](MeasureInterface.md)
- [`DistanceInterface`](DistanceInterface.md)
- [`TemporalInterface`](TemporalInterface.md)
- [`TimeStepInterface`](TimeStepInterface.md)

## Properties

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/f0a6e0ee96b44e433c7fed0071fb6b1240ddf668/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.
