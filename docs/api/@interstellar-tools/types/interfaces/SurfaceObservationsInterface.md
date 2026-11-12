[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SurfaceObservationsInterface

# Interface: SurfaceObservationsInterface

Defined in:
[observations.ts:486](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L486)

What a solid **surface** is made of, and looks like.

## Properties

### age?

```ts
age?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:494](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L494)

Its age, from crater counts.

---

### features?

```ts
features?: string[];
```

Defined in:
[observations.ts:492](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L492)

Such as `['impact craters', 'cryovolcanism', 'tholins']`.

---

### liquids?

```ts
liquids?: {
  coverage?: ObservedType<FractionInterface>;
  substance: string;
}[];
```

Defined in:
[observations.ts:490](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L490)

Liquids on the surface, such as water on Earth or methane on Titan.

| Name        | Type                                                                                           | Defined in                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `coverage?` | [`ObservedType`](../type-aliases/ObservedType.md)<[`FractionInterface`](FractionInterface.md)> | [observations.ts:490](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L490) |
| `substance` | `string`                                                                                       | [observations.ts:490](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L490) |

---

### materials?

```ts
materials?: SpeciesAbundanceInterface[];
```

Defined in:
[observations.ts:488](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L488)

Materials found by spectroscopy or on the spot.
