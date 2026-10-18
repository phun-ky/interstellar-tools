[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MeasureInterface

# Interface: MeasureInterface

Defined in:
[distance.ts:153](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/distance.ts#L153)

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

Defined in:
[distance.ts:154](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/distance.ts#L154)

The unit of measurement.

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
