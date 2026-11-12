[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonObservationsInterface

# Interface: MoonObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:186](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L186)

What is measured about a **moon**.

## Extends

- [`SolidBodyObservationsInterface`](SolidBodyObservationsInterface.md)

## Properties

### activity?

```ts
activity?: {
  facility?: string;
  firstObserved?: Date;
  kind:   | string & {
   }
     | "plumes"
     | "volcanism"
     | "geysers";
}[];
```

Defined in:
[celestial-bodies/body-observations.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L196)

Activity seen: plumes, volcanism, geysers.

| Name             | Type                                                                                      | Defined in                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `facility?`      | `string`                                                                                  | [celestial-bodies/body-observations.ts:199](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L199) |
| `firstObserved?` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [celestial-bodies/body-observations.ts:198](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L198) |
| `kind`           |                                                                                           | `string` & { }                                                                                                                                                     | `"plumes"` | `"volcanism"` | `"geysers"` | [celestial-bodies/body-observations.ts:197](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L197) |

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

### group?

```ts
group?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:188](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L188)

Such as `'Galilean'`, `'Himalia group'` or `'co-orbital'`.

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

### impactExperiment?

```ts
impactExperiment?: ImpactExperimentInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:202](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L202)

A kinetic impact's results, for an asteroid's moon.

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

### resonances?

```ts
resonances?: string[];
```

Defined in:
[celestial-bodies/body-observations.ts:190](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L190)

Its mean-motion resonances, such as
`['Laplace 1:2:4 with Europa and Ganymede']`.

---

### ringInteraction?

```ts
ringInteraction?: "source" | "shepherd" | "embedded";
```

Defined in:
[celestial-bodies/body-observations.ts:192](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L192)

Its part in a ring system.

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

### subsurfaceOcean?

```ts
subsurfaceOcean?: "none" | "confirmed" | "likely" | "possible";
```

Defined in:
[celestial-bodies/body-observations.ts:194](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L194)

The evidence for an ocean under its surface.

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
