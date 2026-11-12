[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
BlackHoleObservationsInterface

# Interface: BlackHoleObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:793](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L793)

What is measured about a **black hole**. Its own `mass` (M☉) and `ringDiameter`
stay the values the equations use.

## Properties

### accretionRate?

```ts
accretionRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:803](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L803)

How fast it accretes.

---

### eddingtonRatio?

```ts
eddingtonRatio?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:805](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L805)

Its luminosity over the Eddington luminosity.

---

### jet?

```ts
jet?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:807](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L807)

Whether a jet is seen.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:795](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L795)

Its mass, with uncertainty.

---

### massMethod?

```ts
massMethod?: BlackHoleMassMethodType;
```

Defined in:
[celestial-bodies/body-observations.ts:797](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L797)

How the mass was measured.

---

### ringDiameter?

```ts
ringDiameter?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:801](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L801)

The photon ring's diameter, with uncertainty.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:809](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L809)

Sources for the record as a whole.

---

### spin?

```ts
spin?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:799](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L799)

Its dimensionless spin, a\*.
