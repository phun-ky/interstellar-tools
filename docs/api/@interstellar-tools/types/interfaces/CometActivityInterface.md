[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometActivityInterface

# Interface: CometActivityInterface

Defined in:
[celestial-bodies/body-observations.ts:328](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L328)

A comet's **activity**: its coma, tails and outgassing.

## Properties

### activityOnset?

```ts
activityOnset?: DistanceInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:340](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L340)

Its distance from the Sun when activity was first seen.

---

### afRho?

```ts
afRho?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:330](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L330)

A'Hearn's dust proxy, Afρ.

---

### comaDiameter?

```ts
comaDiameter?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:336](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L336)

How wide its coma is.

---

### dustProduction?

```ts
dustProduction?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:332](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L332)

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
[celestial-bodies/body-observations.ts:344](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L344)

Its breakups.

| Name             | Type                                                                                      | Defined in                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `date`           | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [celestial-bodies/body-observations.ts:344](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L344) |
| `fragmentCount?` | `number`                                                                                  | [celestial-bodies/body-observations.ts:344](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L344) |

---

### isotopeRatios?

```ts
isotopeRatios?: Record<string, ObservedType>;
```

Defined in:
[celestial-bodies/body-observations.ts:346](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L346)

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
[celestial-bodies/body-observations.ts:342](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L342)

Its outbursts.

| Name         | Type                                                                                             | Defined in                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `amplitude?` | [`ObservedType`](../type-aliases/ObservedType.md)<[`MagnitudeInterface`](MagnitudeInterface.md)> | [celestial-bodies/body-observations.ts:342](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L342) |
| `date`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)        | [celestial-bodies/body-observations.ts:342](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L342) |

---

### productionRates?

```ts
productionRates?: CometProductionRateInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:334](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L334)

How much gas, by species.

---

### tails?

```ts
tails?: CometTailInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:338](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L338)

Its tails.
