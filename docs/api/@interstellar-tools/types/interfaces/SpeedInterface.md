[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SpeedInterface

# Interface: SpeedInterface

Defined in:
[quantities.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L92)

A scalar **speed** with its unit: an escape speed, a radial-velocity
semi-amplitude, a galaxy's rotation speed. For a velocity in 3D, see
[VelocityInterface](VelocityInterface.md).

## Example

```ts
const earthEscape: SpeedInterface = { value: 11.186, unit: 'km/s' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: SpeedUnitType;
```

Defined in:
[quantities.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L93)

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
