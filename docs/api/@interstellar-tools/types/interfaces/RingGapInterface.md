[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingGapInterface

# Interface: RingGapInterface

Defined in:
[observations.ts:524](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L524)

A named **gap** in a ring system, such as the Cassini Division.

## Properties

### innerRadius

```ts
innerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:528](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L528)

Its inner edge, from the planet's centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:526](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L526)

Its name.

---

### normalOpticalDepth?

```ts
normalOpticalDepth?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:532](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L532)

Its normal optical depth, τ: low, but rarely 0.

---

### outerRadius

```ts
outerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:530](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L530)

Its outer edge, from the planet's centre.
