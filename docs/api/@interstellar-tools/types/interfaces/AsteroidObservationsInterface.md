[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidObservationsInterface

# Interface: AsteroidObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:263](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L263)

What is measured about an **asteroid**.

## Extends

- [`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md)

## Properties

### active?

```ts
active?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:275](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L275)

Shows activity like a comet's.

---

### atmosphere?

```ts
atmosphere?: PlanetaryAtmosphereInterface;
```

Defined in:
[observations.ts:672](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L672)

Its atmosphere.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`atmosphere`](SolidBodyObservationsInterface.md#atmosphere)

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[observations.ts:658](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L658)

How it was discovered.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`discovery`](SolidBodyObservationsInterface.md#discovery)

---

### family?

```ts
family?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:267](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L267)

Its collisional family, such as `'Vesta'` or `'Flora'`.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[observations.ts:656](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L656)

Catalogue identifiers.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`identifiers`](SolidBodyObservationsInterface.md#identifiers)

---

### impactRisk?

```ts
impactRisk?: ImpactRiskInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:273](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L273)

An impact risk assessment.

---

### magnetosphere?

```ts
magnetosphere?: MagnetosphereInterface;
```

Defined in:
[observations.ts:676](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L676)

Its magnetic field.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`magnetosphere`](SolidBodyObservationsInterface.md#magnetosphere)

---

### massProperties?

```ts
massProperties?: MassPropertiesInterface;
```

Defined in:
[observations.ts:666](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L666)

Its measured mass and gravity.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`massProperties`](SolidBodyObservationsInterface.md#massproperties)

---

### missions?

```ts
missions?: MissionVisitInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:277](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L277)

Spacecraft visits.

---

### nearEarthObject?

```ts
nearEarthObject?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:269](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L269)

A near-Earth object: perihelion closer than 1.3 au.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[observations.ts:660](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L660)

How well its orbit is known.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`orbitSolution`](SolidBodyObservationsInterface.md#orbitsolution)

---

### potentiallyHazardous?

```ts
potentiallyHazardous?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:271](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L271)

Potentially hazardous: an Earth MOID of 0.05 au or less, and H of 22 or less.

---

### reflectance?

```ts
reflectance?: ReflectanceInterface;
```

Defined in:
[observations.ts:668](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L668)

Its brightness and reflectance.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`reflectance`](SolidBodyObservationsInterface.md#reflectance)

---

### rotation?

```ts
rotation?: RotationObservationsInterface;
```

Defined in:
[observations.ts:662](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L662)

Its measured spin.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`rotation`](SolidBodyObservationsInterface.md#rotation)

---

### size?

```ts
size?: SizeObservationsInterface;
```

Defined in:
[observations.ts:664](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L664)

Its measured size and shape.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`size`](SolidBodyObservationsInterface.md#size)

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[observations.ts:678](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L678)

Sources for the record as a whole.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`sources`](SolidBodyObservationsInterface.md#sources)

---

### surface?

```ts
surface?: SurfaceObservationsInterface;
```

Defined in:
[observations.ts:674](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L674)

Its surface.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`surface`](SolidBodyObservationsInterface.md#surface)

---

### taxonomy?

```ts
taxonomy?: AsteroidTaxonomyInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:265](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L265)

Its spectral taxonomy.

---

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:670](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L670)

Its temperatures and heat.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`thermal`](SolidBodyObservationsInterface.md#thermal)
