[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SurfaceObservationsInterface

# Interface: SurfaceObservationsInterface

Defined in:
[observations.ts:489](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L489)

What a solid **surface** is made of, and looks like.

## Properties

### age?

```ts
age?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:497](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L497)

Its age, from crater counts.

---

### features?

```ts
features?: string[];
```

Defined in:
[observations.ts:495](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L495)

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
[observations.ts:493](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L493)

Liquids on the surface, such as water on Earth or methane on Titan.

| Name        | Type                                                                                           | Defined in                                                                                                             |
| ----------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `coverage?` | [`ObservedType`](../type-aliases/ObservedType.md)<[`FractionInterface`](FractionInterface.md)> | [observations.ts:493](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L493) |
| `substance` | `string`                                                                                       | [observations.ts:493](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L493) |

---

### materials?

```ts
materials?: SpeciesAbundanceInterface[];
```

Defined in:
[observations.ts:491](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L491)

Materials found by spectroscopy or on the spot.
