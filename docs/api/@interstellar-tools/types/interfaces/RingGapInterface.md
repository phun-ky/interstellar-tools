[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingGapInterface

# Interface: RingGapInterface

Defined in:
[observations.ts:527](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L527)

A named **gap** in a ring system, such as the Cassini Division.

## Properties

### innerRadius

```ts
innerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:531](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L531)

Its inner edge, from the planet's centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:529](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L529)

Its name.

---

### normalOpticalDepth?

```ts
normalOpticalDepth?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:535](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L535)

Its normal optical depth, τ: low, but rarely 0.

---

### outerRadius

```ts
outerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:533](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L533)

Its outer edge, from the planet's centre.
