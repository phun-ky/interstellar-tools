[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DimensionlessInterface

# Interface: DimensionlessInterface

Defined in:
[quantities.ts:427](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L427)

A **pure number**: an albedo, an axis ratio, a Sérsic index, a redshift. It has
no `unit`.

## Example

```ts
const saturnAlbedo: DimensionlessInterface = { value: 0.499 };
```

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit?

```ts
unit?: undefined;
```

Defined in:
[quantities.ts:428](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L428)

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
