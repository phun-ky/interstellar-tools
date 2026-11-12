[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CloudLayerInterface

# Interface: CloudLayerInterface

Defined in:
[observations.ts:430](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L430)

An observed **cloud or haze layer**.

## Properties

### basePressure?

```ts
basePressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:436](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L436)

The pressure at its base.

---

### composition?

```ts
composition?: string;
```

Defined in:
[observations.ts:432](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L432)

What it's made of, such as `'NH3 ice'` or `'H2SO4'`.

---

### coverage?

```ts
coverage?: ObservedType<FractionInterface>;
```

Defined in:
[observations.ts:438](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L438)

The share of the globe it covers.

---

### topPressure?

```ts
topPressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:434](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L434)

The pressure at its top.
