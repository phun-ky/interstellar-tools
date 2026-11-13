[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ImpactRiskInterface

# Interface: ImpactRiskInterface

Defined in:
[celestial-bodies/body-observations.ts:226](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L226)

An **impact risk** assessment of a near-Earth object.

## Properties

### assessedAt

```ts
assessedAt: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L236)

When it was assessed.

---

### assessedBy

```ts
assessedBy: string;
```

Defined in:
[celestial-bodies/body-observations.ts:234](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L234)

Who assessed it, such as `'JPL Sentry'` or `'ESA NEOCC'`.

---

### cumulativeProbability

```ts
cumulativeProbability: number;
```

Defined in:
[celestial-bodies/body-observations.ts:228](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L228)

The cumulative impact probability over the span assessed.

---

### nextCloseApproach?

```ts
nextCloseApproach?: {
  bodyId: string;
  date: Date;
  distance: DistanceInterface;
};
```

Defined in:
[celestial-bodies/body-observations.ts:238](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L238)

The next close approach.

| Name       | Type                                                                                      | Description                                      | Defined in                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bodyId`   | `string`                                                                                  | The id of the body it passes, such as `'earth'`. | [celestial-bodies/body-observations.ts:242](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L242) |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | -                                                | [celestial-bodies/body-observations.ts:239](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L239) |
| `distance` | [`DistanceInterface`](DistanceInterface.md)                                               | -                                                | [celestial-bodies/body-observations.ts:240](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L240) |

---

### palermoScale?

```ts
palermoScale?: number;
```

Defined in:
[celestial-bodies/body-observations.ts:230](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L230)

The Palermo technical scale.

---

### torinoScale?

```ts
torinoScale?: 0 | 7 | 3 | 6 | 1 | 2 | 4 | 5 | 8 | 9 | 10;
```

Defined in:
[celestial-bodies/body-observations.ts:232](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L232)

The Torino scale.
