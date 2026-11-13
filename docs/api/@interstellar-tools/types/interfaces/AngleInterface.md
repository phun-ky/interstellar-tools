[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AngleInterface

# Interface: AngleInterface

Defined in:
[quantities.ts:182](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L182)

A measured **angle** with its unit.

## Example

```ts
const proximaParallax: AngleInterface = { value: 768.07, unit: 'mas' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: AngleUnitType;
```

Defined in:
[quantities.ts:183](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L183)

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
