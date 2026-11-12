[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AsteroidObservationsInterface

# Interface: AsteroidObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:266](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L266)

What is measured about an **asteroid**.

## Extends

- [`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md)

## Properties

### active?

```ts
active?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:278](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L278)

Shows activity like a comet's.

---

### atmosphere?

```ts
atmosphere?: PlanetaryAtmosphereInterface;
```

Defined in:
[observations.ts:673](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L673)

Its atmosphere.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`atmosphere`](SolidBodyObservationsInterface.md#atmosphere)

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[observations.ts:659](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L659)

How it was discovered.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`discovery`](SolidBodyObservationsInterface.md#discovery)

---

### family?

```ts
family?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:270](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L270)

Its collisional family, such as `'Vesta'` or `'Flora'`.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[observations.ts:657](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L657)

Catalogue identifiers.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`identifiers`](SolidBodyObservationsInterface.md#identifiers)

---

### impactRisk?

```ts
impactRisk?: ImpactRiskInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:276](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L276)

An impact risk assessment.

---

### magnetosphere?

```ts
magnetosphere?: MagnetosphereInterface;
```

Defined in:
[observations.ts:677](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L677)

Its magnetic field.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`magnetosphere`](SolidBodyObservationsInterface.md#magnetosphere)

---

### massProperties?

```ts
massProperties?: MassPropertiesInterface;
```

Defined in:
[observations.ts:667](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L667)

Its measured mass and gravity.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`massProperties`](SolidBodyObservationsInterface.md#massproperties)

---

### missions?

```ts
missions?: MissionVisitInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:280](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L280)

Spacecraft visits.

---

### nearEarthObject?

```ts
nearEarthObject?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:272](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L272)

A near-Earth object: perihelion closer than 1.3 au.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[observations.ts:661](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L661)

How well its orbit is known.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`orbitSolution`](SolidBodyObservationsInterface.md#orbitsolution)

---

### potentiallyHazardous?

```ts
potentiallyHazardous?: boolean;
```

Defined in:
[celestial-bodies/body-observations.ts:274](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L274)

Potentially hazardous: an Earth MOID of 0.05 au or less, and H of 22 or less.

---

### reflectance?

```ts
reflectance?: ReflectanceInterface;
```

Defined in:
[observations.ts:669](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L669)

Its brightness and reflectance.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`reflectance`](SolidBodyObservationsInterface.md#reflectance)

---

### rotation?

```ts
rotation?: RotationObservationsInterface;
```

Defined in:
[observations.ts:663](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L663)

Its measured spin.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`rotation`](SolidBodyObservationsInterface.md#rotation)

---

### size?

```ts
size?: SizeObservationsInterface;
```

Defined in:
[observations.ts:665](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L665)

Its measured size and shape.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`size`](SolidBodyObservationsInterface.md#size)

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[observations.ts:679](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L679)

Sources for the record as a whole.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`sources`](SolidBodyObservationsInterface.md#sources)

---

### surface?

```ts
surface?: SurfaceObservationsInterface;
```

Defined in:
[observations.ts:675](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L675)

Its surface.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`surface`](SolidBodyObservationsInterface.md#surface)

---

### taxonomy?

```ts
taxonomy?: AsteroidTaxonomyInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:268](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L268)

Its spectral taxonomy.

---

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:671](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L671)

Its temperatures and heat.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`thermal`](SolidBodyObservationsInterface.md#thermal)
