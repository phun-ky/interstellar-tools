[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingInterface

# Interface: RingInterface

Defined in:
[observations.ts:505](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L505)

One **ring** of a planet.

## Properties

### composition?

```ts
composition?: string;
```

Defined in:
[observations.ts:519](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L519)

Such as `'water ice'` or `'dark carbonaceous dust'`.

---

### geometricAlbedo?

```ts
geometricAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:515](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L515)

The geometric albedo of its particles.

---

### innerRadius

```ts
innerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:509](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L509)

Its inner edge, from the planet's centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:507](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L507)

Its name, such as `'A'` or `'ε'`.

---

### normalOpticalDepth?

```ts
normalOpticalDepth?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:513](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L513)

Its normal optical depth, τ.

---

### outerRadius

```ts
outerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:511](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L511)

Its outer edge, from the planet's centre.

---

### thickness?

```ts
thickness?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:517](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L517)

How thick it is.
