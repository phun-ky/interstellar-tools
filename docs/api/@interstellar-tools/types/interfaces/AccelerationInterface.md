[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AccelerationInterface

# Interface: AccelerationInterface

Defined in:
[quantities.ts:115](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L115)

An **acceleration** with its unit.

## Example

```ts
// ʻOumuamua's radial non-gravitational parameter A1, from JPL
const a1: AccelerationInterface = { value: 2.79e-7, unit: 'au/d2' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: AccelerationUnitType;
```

Defined in:
[quantities.ts:116](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L116)

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
