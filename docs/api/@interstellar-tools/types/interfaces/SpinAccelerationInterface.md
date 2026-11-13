[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpinAccelerationInterface

# Interface: SpinAccelerationInterface

Defined in:
[quantities.ts:395](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L395)

A **spin acceleration**, $d\omega/dt$, with its unit: positive when the body
spins up.

## Example

```ts
// Bennu's YORP spin-up (Nolan et al. 2019)
const yorp: SpinAccelerationInterface = { value: 3.63e-6, unit: 'deg/d2' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: SpinAccelerationUnitType;
```

Defined in:
[quantities.ts:396](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L396)

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
