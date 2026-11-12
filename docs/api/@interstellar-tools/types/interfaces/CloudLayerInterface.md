[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CloudLayerInterface

# Interface: CloudLayerInterface

Defined in:
[observations.ts:427](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L427)

An observed **cloud or haze layer**.

## Properties

### basePressure?

```ts
basePressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:433](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L433)

The pressure at its base.

---

### composition?

```ts
composition?: string;
```

Defined in:
[observations.ts:429](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L429)

What it's made of, such as `'NH3 ice'` or `'H2SO4'`.

---

### coverage?

```ts
coverage?: ObservedType<FractionInterface>;
```

Defined in:
[observations.ts:435](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L435)

The share of the globe it covers.

---

### topPressure?

```ts
topPressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:431](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L431)

The pressure at its top.
