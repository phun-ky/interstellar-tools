[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TimeStepInterface

# Interface: TimeStepInterface

Defined in:
[temporal.ts:153](https://github.com/phun-ky/interstellar-tools/blob/ff0caf6b6530d3c273826ec4e8273e6792a27186/packages/types/src/temporal.ts#L153)

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

Defined in:
[temporal.ts:154](https://github.com/phun-ky/interstellar-tools/blob/ff0caf6b6530d3c273826ec4e8273e6792a27186/packages/types/src/temporal.ts#L154)

The unit is always **days**.

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/ff0caf6b6530d3c273826ec4e8273e6792a27186/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
