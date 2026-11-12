[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SolidBodyObservationsInterface

# Interface: SolidBodyObservationsInterface

Defined in:
[observations.ts:655](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L655)

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
[observations.ts:673](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L673)

Its atmosphere.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[observations.ts:659](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L659)

How it was discovered.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[observations.ts:657](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L657)

Catalogue identifiers.

---

### magnetosphere?

```ts
magnetosphere?: MagnetosphereInterface;
```

Defined in:
[observations.ts:677](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L677)

Its magnetic field.

---

### massProperties?

```ts
massProperties?: MassPropertiesInterface;
```

Defined in:
[observations.ts:667](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L667)

Its measured mass and gravity.

---

### orbitSolution?

```ts
orbitSolution?: OrbitSolutionInterface;
```

Defined in:
[observations.ts:661](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L661)

How well its orbit is known.

---

### reflectance?

```ts
reflectance?: ReflectanceInterface;
```

Defined in:
[observations.ts:669](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L669)

Its brightness and reflectance.

---

### rotation?

```ts
rotation?: RotationObservationsInterface;
```

Defined in:
[observations.ts:663](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L663)

Its measured spin.

---

### size?

```ts
size?: SizeObservationsInterface;
```

Defined in:
[observations.ts:665](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L665)

Its measured size and shape.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[observations.ts:679](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L679)

Sources for the record as a whole.

---

### surface?

```ts
surface?: SurfaceObservationsInterface;
```

Defined in:
[observations.ts:675](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L675)

Its surface.

---

### thermal?

```ts
thermal?: ThermalObservationsInterface;
```

Defined in:
[observations.ts:671](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L671)

Its temperatures and heat.
