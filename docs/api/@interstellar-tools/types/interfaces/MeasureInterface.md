[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MeasureInterface

# ~~Interface: MeasureInterface~~

Defined in:
[distance.ts:155](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/distance.ts#L155)

Represents a measurement with an associated unit.

## Deprecated

Use [DistanceInterface](DistanceInterface.md), which is identical.
`MeasureInterface` will be removed in 2.0.

## Example

```ts
const planetRadius: MeasureInterface = { value: 6371, unit: 'km' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### ~~unit~~

```ts
unit: DistanceUnitType;
```

Defined in:
[distance.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/distance.ts#L156)

The unit of measurement.

---

### ~~value~~

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
