[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PeriodChangeInterface

# Interface: PeriodChangeInterface

Defined in:
[quantities.ts:413](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L413)

A **change in a period**, $dP/dt$, with its unit: positive when the period
lengthens. Turning it into a
[SpinAccelerationInterface](SpinAccelerationInterface.md) needs the period
itself, $d\omega/dt = -2\pi\,\dot P / P^2$.

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: PeriodChangeUnitType;
```

Defined in:
[quantities.ts:414](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L414)

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
