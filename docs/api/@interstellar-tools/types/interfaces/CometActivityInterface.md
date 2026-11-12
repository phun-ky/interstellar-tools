[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometActivityInterface

# Interface: CometActivityInterface

Defined in:
[celestial-bodies/body-observations.ts:325](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L325)

A comet's **activity**: its coma, tails and outgassing.

## Properties

### activityOnset?

```ts
activityOnset?: DistanceInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:337](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L337)

Its distance from the Sun when activity was first seen.

---

### afRho?

```ts
afRho?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:327](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L327)

A'Hearn's dust proxy, Afρ.

---

### comaDiameter?

```ts
comaDiameter?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:333](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L333)

How wide its coma is.

---

### dustProduction?

```ts
dustProduction?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:329](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L329)

How much dust it gives off.

---

### fragmentations?

```ts
fragmentations?: {
  date: Date;
  fragmentCount?: number;
}[];
```

Defined in:
[celestial-bodies/body-observations.ts:341](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L341)

Its breakups.

| Name             | Type                                                                                      | Defined in                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`           | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [celestial-bodies/body-observations.ts:341](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L341) |
| `fragmentCount?` | `number`                                                                                  | [celestial-bodies/body-observations.ts:341](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L341) |

---

### isotopeRatios?

```ts
isotopeRatios?: Record<string, ObservedType>;
```

Defined in:
[celestial-bodies/body-observations.ts:343](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L343)

Isotope ratios, such as `{ 'D/H': … }`.

---

### outbursts?

```ts
outbursts?: {
  amplitude?: ObservedType<MagnitudeInterface>;
  date: Date;
}[];
```

Defined in:
[celestial-bodies/body-observations.ts:339](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L339)

Its outbursts.

| Name         | Type                                                                                             | Defined in                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `amplitude?` | [`ObservedType`](../type-aliases/ObservedType.md)<[`MagnitudeInterface`](MagnitudeInterface.md)> | [celestial-bodies/body-observations.ts:339](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L339) |
| `date`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)        | [celestial-bodies/body-observations.ts:339](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L339) |

---

### productionRates?

```ts
productionRates?: CometProductionRateInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:331](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L331)

How much gas, by species.

---

### tails?

```ts
tails?: CometTailInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:335](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L335)

Its tails.
