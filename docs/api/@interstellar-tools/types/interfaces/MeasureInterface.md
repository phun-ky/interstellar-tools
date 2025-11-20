[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MeasureInterface

# Interface: MeasureInterface

Defined in:
[distance.ts:151](https://github.com/phun-ky/interstellar-tools/blob/8e4fe75a07b42cadc88954820349dccaa19bbbc8/packages/types/src/distance.ts#L151)

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
[distance.ts:152](https://github.com/phun-ky/interstellar-tools/blob/8e4fe75a07b42cadc88954820349dccaa19bbbc8/packages/types/src/distance.ts#L152)

The unit of measurement.

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/8e4fe75a07b42cadc88954820349dccaa19bbbc8/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
