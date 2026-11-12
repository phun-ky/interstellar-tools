[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ImpactRiskInterface

# Interface: ImpactRiskInterface

Defined in:
[celestial-bodies/body-observations.ts:223](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L223)

An **impact risk** assessment of a near-Earth object.

## Properties

### assessedAt

```ts
assessedAt: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:233](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L233)

When it was assessed.

---

### assessedBy

```ts
assessedBy: string;
```

Defined in:
[celestial-bodies/body-observations.ts:231](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L231)

Who assessed it, such as `'JPL Sentry'` or `'ESA NEOCC'`.

---

### cumulativeProbability

```ts
cumulativeProbability: number;
```

Defined in:
[celestial-bodies/body-observations.ts:225](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L225)

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
[celestial-bodies/body-observations.ts:235](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L235)

The next close approach.

| Name       | Type                                                                                      | Description                                      | Defined in                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bodyId`   | `string`                                                                                  | The id of the body it passes, such as `'earth'`. | [celestial-bodies/body-observations.ts:239](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L239) |
| `date`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | -                                                | [celestial-bodies/body-observations.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L236) |
| `distance` | [`DistanceInterface`](DistanceInterface.md)                                               | -                                                | [celestial-bodies/body-observations.ts:237](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L237) |

---

### palermoScale?

```ts
palermoScale?: number;
```

Defined in:
[celestial-bodies/body-observations.ts:227](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L227)

The Palermo technical scale.

---

### torinoScale?

```ts
torinoScale?: 0 | 7 | 3 | 6 | 1 | 2 | 4 | 5 | 8 | 9 | 10;
```

Defined in:
[celestial-bodies/body-observations.ts:229](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L229)

The Torino scale.
