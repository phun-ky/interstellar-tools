[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RingInterface

# Interface: RingInterface

Defined in:
[observations.ts:502](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L502)

One **ring** of a planet.

## Properties

### composition?

```ts
composition?: string;
```

Defined in:
[observations.ts:516](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L516)

Such as `'water ice'` or `'dark carbonaceous dust'`.

---

### geometricAlbedo?

```ts
geometricAlbedo?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:512](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L512)

The geometric albedo of its particles.

---

### innerRadius

```ts
innerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:506](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L506)

Its inner edge, from the planet's centre.

---

### name

```ts
name: string;
```

Defined in:
[observations.ts:504](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L504)

Its name, such as `'A'` or `'ε'`.

---

### normalOpticalDepth?

```ts
normalOpticalDepth?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:510](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L510)

Its normal optical depth, τ.

---

### outerRadius

```ts
outerRadius: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:508](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L508)

Its outer edge, from the planet's centre.

---

### thickness?

```ts
thickness?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:514](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L514)

How thick it is.
