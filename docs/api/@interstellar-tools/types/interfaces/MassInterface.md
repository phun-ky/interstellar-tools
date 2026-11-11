[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MassInterface

# Interface: MassInterface

Defined in:
[quantities.ts:49](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L49)

A **mass** with its unit.

## Example

```ts
const jupiter: MassInterface = { value: 1.898e27, unit: 'kg' };
const hd189733b: MassInterface = { value: 1.13, unit: 'M_jup' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: MassUnitType;
```

Defined in:
[quantities.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L50)

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
