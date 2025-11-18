[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DistanceInterface

# Interface: DistanceInterface

Defined in:
[distance.ts:167](https://github.com/phun-ky/interstellar-tools/blob/40019b531e6770232cbea0121ab22939e620782e/packages/types/src/distance.ts#L167)

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

Defined in:
[distance.ts:168](https://github.com/phun-ky/interstellar-tools/blob/40019b531e6770232cbea0121ab22939e620782e/packages/types/src/distance.ts#L168)

The unit of distance measurement.

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/40019b531e6770232cbea0121ab22939e620782e/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
