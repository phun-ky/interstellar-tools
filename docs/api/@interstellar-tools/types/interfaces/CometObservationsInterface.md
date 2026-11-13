[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometObservationsInterface

# Interface: CometObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:374](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L374)

What is measured about a **comet**.

## Extended by

- [`InterstellarObjectObservationsInterface`](InterstellarObjectObservationsInterface.md)

## Properties

### activity?

```ts
activity?: CometActivityInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:390](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L390)

Its coma, tails and outgassing.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:378](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L378)

How it was discovered.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:376](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L376)

Catalogue identifiers.

---

### nuclearMagnitude?

```ts
nuclearMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:388](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L388)

Its nuclear magnitude law, M2 and K2.

---

### nucleus?

```ts
nucleus?: CometNucleusInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:384](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L384)

Its nucleus.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:380](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L380)

How well its orbit is known, with the non-gravitational parameters.

---

### originalInverseSemiMajorAxis?

```ts
originalInverseSemiMajorAxis?: ObservedType<InverseDistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:382](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L382)

For a long-period comet, its original $1/a$, before the planets pulled on it.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:392](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L392)

Sources for the record as a whole.

---

### totalMagnitude?

```ts
totalMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:386](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L386)

Its total magnitude law, M1 and K1.
