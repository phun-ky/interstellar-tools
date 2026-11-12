[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
BlackHoleObservationsInterface

# Interface: BlackHoleObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:703](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L703)

What is measured about a **black hole**. Its own `mass` (M☉) and `ringDiameter`
stay the values the equations use.

## Properties

### accretionRate?

```ts
accretionRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:713](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L713)

How fast it accretes.

---

### eddingtonRatio?

```ts
eddingtonRatio?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:715](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L715)

Its luminosity over the Eddington luminosity.

---

### jet?

```ts
jet?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:717](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L717)

Whether a jet is seen.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:705](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L705)

Its mass, with uncertainty.

---

### massMethod?

```ts
massMethod?: BlackHoleMassMethodType;
```

Defined in:
[celestial-bodies/body-observations.ts:707](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L707)

How the mass was measured.

---

### ringDiameter?

```ts
ringDiameter?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:711](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L711)

The photon ring's diameter, with uncertainty.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:719](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L719)

Sources for the record as a whole.

---

### spin?

```ts
spin?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:709](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L709)

Its dimensionless spin, a\*.
