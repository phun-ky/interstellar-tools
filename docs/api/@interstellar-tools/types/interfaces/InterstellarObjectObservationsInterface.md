[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
InterstellarObjectObservationsInterface

# Interface: InterstellarObjectObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:401](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L401)

What is measured about an **interstellar object**.

## Extends

- [`CometObservationsInterface`](CometObservationsInterface.md)

## Properties

### activity?

```ts
activity?: CometActivityInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:390](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L390)

Its coma, tails and outgassing.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`activity`](CometObservationsInterface.md#activity)

---

### anomalousAcceleration?

```ts
anomalousAcceleration?: ObservedType<AccelerationInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:407](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L407)

A push beyond gravity without a coma, as ʻOumuamua had.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:378](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L378)

How it was discovered.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`discovery`](CometObservationsInterface.md#discovery)

---

### excessSpeed?

```ts
excessSpeed?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:403](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L403)

`orbit.excessSpeed`, with its uncertainty.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:376](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L376)

Catalogue identifiers.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`identifiers`](CometObservationsInterface.md#identifiers)

---

### incomingRadiant?

```ts
incomingRadiant?: CelestialDirectionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:405](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L405)

The direction it came from, its radiant, in the ICRS.

---

### nuclearMagnitude?

```ts
nuclearMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:388](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L388)

Its nuclear magnitude law, M2 and K2.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`nuclearMagnitude`](CometObservationsInterface.md#nuclearmagnitude)

---

### nucleus?

```ts
nucleus?: CometNucleusInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:384](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L384)

Its nucleus.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`nucleus`](CometObservationsInterface.md#nucleus)

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:380](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L380)

How well its orbit is known, with the non-gravitational parameters.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`orbitSolution`](CometObservationsInterface.md#orbitsolution)

---

### originalInverseSemiMajorAxis?

```ts
originalInverseSemiMajorAxis?: ObservedType<InverseDistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:382](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L382)

For a long-period comet, its original $1/a$, before the planets pulled on it.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`originalInverseSemiMajorAxis`](CometObservationsInterface.md#originalinversesemimajoraxis)

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:392](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L392)

Sources for the record as a whole.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`sources`](CometObservationsInterface.md#sources)

---

### totalMagnitude?

```ts
totalMagnitude?: MagnitudeLawInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:386](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L386)

Its total magnitude law, M1 and K1.

#### Inherited from

[`CometObservationsInterface`](CometObservationsInterface.md).[`totalMagnitude`](CometObservationsInterface.md#totalmagnitude)
