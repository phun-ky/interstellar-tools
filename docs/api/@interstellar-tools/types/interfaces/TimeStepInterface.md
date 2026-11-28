[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TimeStepInterface

# Interface: TimeStepInterface

Defined in:
[temporal.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L156)

Represents a **time step measurement** in simulation, restricted to days.

## Example

```ts
const timeStep: TimeStepInterface = { value: 1, unit: 'd' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: 'd';
```

Defined in:
[temporal.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L157)

The unit is always **days** (`'d'`).

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
