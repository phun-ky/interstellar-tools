[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
MeasureInterface

# Interface: MeasureInterface

Defined in: distance.ts:151

Represents a measurement with an associated unit.

## Example

```ts
const planetRadius: MeasureInterface = { value: 6371, unit: 'km' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: DistanceUnitType;
```

Defined in: distance.ts:152

The unit of measurement.

---

### value

```ts
value: number;
```

Defined in: numeric.ts:18

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
