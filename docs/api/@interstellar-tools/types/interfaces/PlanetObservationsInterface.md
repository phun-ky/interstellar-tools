[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetObservationsInterface

# Interface: PlanetObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:152](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L152)

What is measured about a **planet** or planetoid.

## Example

```ts
const saturn: PlanetObservationsInterface = {
  massProperties: { bulkDensity: { value: 0.687, unit: 'g/cm3' } },
  thermal: { oneBarTemperature: { value: 134, unit: 'K' } },
  rings: {
    rings: [
      {
        name: 'A',
        innerRadius: { value: 122170, unit: 'km' },
        outerRadius: { value: 136775, unit: 'km' }
      }
    ]
  }
};
```

## Extends

- [`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md)

## Properties

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

### exoplanet?

```ts
exoplanet?: ExoplanetObservationsInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L156)

Given for a planet outside the Solar System.

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

### rings?

```ts
rings?: RingSystemInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L154)

Its rings.

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

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:670](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L670)

Its temperatures and heat.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`thermal`](SolidBodyObservationsInterface.md#thermal)
