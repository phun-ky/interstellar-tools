[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DensityInterface

# Interface: DensityInterface

Defined in:
[quantities.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L70)

A **mass density** with its unit.

## Example

```ts
const saturn: DensityInterface = { value: 0.687, unit: 'g/cm3' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: DensityUnitType;
```

Defined in:
[quantities.ts:71](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L71)

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
