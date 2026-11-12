[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometObservationsInterface

# Interface: CometObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:371](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L371)

What is measured about a **comet**.

## Extended by

- [`InterstellarObjectObservationsInterface`](InterstellarObjectObservationsInterface.md)

## Properties

### activity?

```ts
activity?: CometActivityInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:387](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L387)

Its coma, tails and outgassing.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:375](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L375)

How it was discovered.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:373](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L373)

Catalogue identifiers.

---

### nuclearMagnitude?

```ts
nuclearMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:385](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L385)

Its nuclear magnitude law, M2 and K2.

---

### nucleus?

```ts
nucleus?: CometNucleusInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:381](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L381)

Its nucleus.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:377](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L377)

How well its orbit is known, with the non-gravitational parameters.

---

### originalInverseSemiMajorAxis?

```ts
originalInverseSemiMajorAxis?: ObservedType<InverseDistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:379](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L379)

For a long-period comet, its original $1/a$, before the planets pulled on it.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:389](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L389)

Sources for the record as a whole.

---

### totalMagnitude?

```ts
totalMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:383](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L383)

Its total magnitude law, M1 and K1.
