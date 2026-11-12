[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TransitObservationsInterface

# Interface: TransitObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L78)

**Transit** measurements of an exoplanet.

## Properties

### depth?

```ts
depth?: ObservedType<FractionInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L82)

How deep the dip is.

---

### duration?

```ts
duration?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:84](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L84)

From first to fourth contact.

---

### impactParameter?

```ts
impactParameter?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:86](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L86)

The impact parameter, b.

---

### midpoint?

```ts
midpoint?: EpochInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L80)

A reference time of mid-transit.

---

### radiusRatio?

```ts
radiusRatio?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:88](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L88)

The planet's radius over its star's, $R_p / R_\star$.

---

### scaledSemiMajorAxis?

```ts
scaledSemiMajorAxis?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:90](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L90)

The semi-major axis over the star's radius, $a / R_\star$.

---

### ttvAmplitude?

```ts
ttvAmplitude?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:92](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L92)

The amplitude of its transit timing variations.
