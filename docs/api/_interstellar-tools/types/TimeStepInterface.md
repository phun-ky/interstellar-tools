[Documentation](../../index.md) / [@interstellar-tools/types](../types.md) /
TimeStepInterface

# Interface: TimeStepInterface

Defined in: temporal.ts:153

Represents a **time step measurement** in simulation, restricted to days.

## Example

```ts
const timeStep: TimeStepInterface = { value: 1, unit: 'day' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: 'd';
```

Defined in: temporal.ts:154

The unit is always **days**.

---

### value

```ts
value: number;
```

Defined in: numeric.ts:18

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
