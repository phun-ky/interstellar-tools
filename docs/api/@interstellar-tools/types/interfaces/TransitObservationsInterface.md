[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TransitObservationsInterface

# Interface: TransitObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L81)

**Transit** measurements of an exoplanet.

## Properties

### depth?

```ts
depth?: ObservedType<FractionInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L85)

How deep the dip is.

---

### duration?

```ts
duration?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L87)

From first to fourth contact.

---

### impactParameter?

```ts
impactParameter?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:89](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L89)

The impact parameter, b.

---

### midpoint?

```ts
midpoint?: EpochInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:83](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L83)

A reference time of mid-transit.

---

### radiusRatio?

```ts
radiusRatio?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:91](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L91)

The planet's radius over its star's, $R_p / R_\star$.

---

### scaledSemiMajorAxis?

```ts
scaledSemiMajorAxis?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L93)

The semi-major axis over the star's radius, $a / R_\star$.

---

### ttvAmplitude?

```ts
ttvAmplitude?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L95)

The amplitude of its transit timing variations.
