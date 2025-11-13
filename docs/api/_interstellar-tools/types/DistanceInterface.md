[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
DistanceInterface

# Interface: DistanceInterface

Defined in: distance.ts:167

Represents a distance measurement with an associated unit.

## Example

```ts
const distanceToAlphaCentauri: DistanceInterface = {
  value: 4.367,
  unit: 'lightyears'
};
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: DistanceUnitType;
```

Defined in: distance.ts:168

The unit of distance measurement.

---

### value

```ts
value: number;
```

Defined in: numeric.ts:18

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
