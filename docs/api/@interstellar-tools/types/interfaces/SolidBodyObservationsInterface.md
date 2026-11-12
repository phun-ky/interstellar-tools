[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SolidBodyObservationsInterface

# Interface: SolidBodyObservationsInterface

Defined in:
[observations.ts:654](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L654)

What every **solid or planetary body** can have measured: planets, moons and
small bodies.

## Extended by

- [`PlanetObservationsInterface`](PlanetObservationsInterface.md)
- [`MoonObservationsInterface`](MoonObservationsInterface.md)
- [`AsteroidObservationsInterface`](AsteroidObservationsInterface.md)

## Properties

### atmosphere?

```ts
atmosphere?: PlanetaryAtmosphereInterface;
```

Defined in:
[observations.ts:672](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L672)

Its atmosphere.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[observations.ts:658](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L658)

How it was discovered.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[observations.ts:656](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L656)

Catalogue identifiers.

---

### magnetosphere?

```ts
magnetosphere?: MagnetosphereInterface;
```

Defined in:
[observations.ts:676](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L676)

Its magnetic field.

---

### massProperties?

```ts
massProperties?: MassPropertiesInterface;
```

Defined in:
[observations.ts:666](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L666)

Its measured mass and gravity.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[observations.ts:660](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L660)

How well its orbit is known.

---

### reflectance?

```ts
reflectance?: ReflectanceInterface;
```

Defined in:
[observations.ts:668](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L668)

Its brightness and reflectance.

---

### rotation?

```ts
rotation?: RotationObservationsInterface;
```

Defined in:
[observations.ts:662](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L662)

Its measured spin.

---

### size?

```ts
size?: SizeObservationsInterface;
```

Defined in:
[observations.ts:664](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L664)

Its measured size and shape.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[observations.ts:678](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L678)

Sources for the record as a whole.

---

### surface?

```ts
surface?: SurfaceObservationsInterface;
```

Defined in:
[observations.ts:674](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L674)

Its surface.

---

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:670](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L670)

Its temperatures and heat.
