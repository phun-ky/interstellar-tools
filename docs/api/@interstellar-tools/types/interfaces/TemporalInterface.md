[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TemporalInterface

# Interface: TemporalInterface

Defined in:
[temporal.ts:136](https://github.com/phun-ky/interstellar-tools/blob/f613425043c94828d8fadf35a707105a661f469f/packages/types/src/temporal.ts#L136)

Typed container for a scalar **duration**, combining a numeric `value` (from
[ValueInterface](ValueInterface.md)) with a canonical
[TemporalUnitType](../type-aliases/TemporalUnitType.md) `unit`.

## Conventions

- **Durations only** (not timestamps or "ago" semantics).
- `unit` must be a **canonical symbol** (e.g., `'s'`, `'min'`, `'h'`, `'d'`,
  `'yr'`, `'Myr'`). If you accept user-friendly aliases (e.g., `"seconds"`,
  `"hours"`), normalize them **before** constructing this type.
- Day is the **SI day** (86 400 s) and year-family uses the **Julian year**
  (365.25 d).

$$
\text{seconds} \;=\; \text{value} \times \mathrm{SECONDS\_PER}[\text{unit}]
$$

## See

[TemporalUnitType](../type-aliases/TemporalUnitType.md)

## Extends

- [`ValueInterface`](ValueInterface.md)

## Properties

### unit

```ts
unit: TemporalUnitType;
```

Defined in:
[temporal.ts:138](https://github.com/phun-ky/interstellar-tools/blob/f613425043c94828d8fadf35a707105a661f469f/packages/types/src/temporal.ts#L138)

Canonical temporal unit symbol (case-sensitive).

---

### value

```ts
value: number;
```

Defined in:
[numeric.ts:18](https://github.com/phun-ky/interstellar-tools/blob/f613425043c94828d8fadf35a707105a661f469f/packages/types/src/numeric.ts#L18)

The numeric value of the measurement.

#### Inherited from

[`ValueInterface`](ValueInterface.md).[`value`](ValueInterface.md#value)
