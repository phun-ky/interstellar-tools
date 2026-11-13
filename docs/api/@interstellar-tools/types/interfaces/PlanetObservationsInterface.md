[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetObservationsInterface

# Interface: PlanetObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:155](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L155)

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

### exoplanet?

```ts
exoplanet?: ExoplanetObservationsInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:159](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L159)

Given for a planet outside the Solar System.

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

### rings?

```ts
rings?: RingSystemInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L157)

Its rings.

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

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:671](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L671)

Its temperatures and heat.

#### Inherited from

[`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md).[`thermal`](SolidBodyObservationsInterface.md#thermal)
