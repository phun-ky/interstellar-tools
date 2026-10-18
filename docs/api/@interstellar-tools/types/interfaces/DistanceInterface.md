[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DistanceInterface

# Interface: DistanceInterface

Defined in:
[distance.ts:169](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/distance.ts#L169)

Represents a distance measurement with an associated unit.

## Example

```ts
const distanceToAlphaCentauri: DistanceInterface = { value: 4.367, unit: 'ly' };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: DistanceUnitType;
```

Defined in:
[distance.ts:170](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/distance.ts#L170)

The unit of distance measurement.

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
