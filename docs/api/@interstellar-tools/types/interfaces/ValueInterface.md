[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ValueInterface

# Interface: ValueInterface

Defined in:
[numeric.ts:17](https://github.com/phun-ky/interstellar-tools/blob/2cdf06cf02aaf939d94f5ce03954115548b3bf5b/packages/types/src/numeric.ts#L17)

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
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/2cdf06cf02aaf939d94f5ce03954115548b3bf5b/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.
