[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonObservationsInterface

# Interface: MoonObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:183](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L183)

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
[celestial-bodies/body-observations.ts:193](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L193)

Activity seen: plumes, volcanism, geysers.

| Name             | Type                                                                                      | Defined in                                                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `facility?`      | `string`                                                                                  | [celestial-bodies/body-observations.ts:196](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L196) |
| `firstObserved?` | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | [celestial-bodies/body-observations.ts:195](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L195) |
| `kind`           |                                                                                           | `string` & { }                                                                                                                                                     | `"plumes"` | `"volcanism"` | `"geysers"` | [celestial-bodies/body-observations.ts:194](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L194) |

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

### group?

```ts
group?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L185)

Such as `'Galilean'`, `'Himalia group'` or `'co-orbital'`.

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

### impactExperiment?

```ts
impactExperiment?: ImpactExperimentInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:199](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L199)

A kinetic impact's results, for an asteroid's moon.

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

### resonances?

```ts
resonances?: string[];
```

Defined in:
[celestial-bodies/body-observations.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L187)

Its mean-motion resonances, such as
`['Laplace 1:2:4 with Europa and Ganymede']`.

---

### ringInteraction?

```ts
ringInteraction?: "source" | "shepherd" | "embedded";
```

Defined in:
[celestial-bodies/body-observations.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L189)

Its part in a ring system.

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

### subsurfaceOcean?

```ts
subsurfaceOcean?: "none" | "confirmed" | "likely" | "possible";
```

Defined in:
[celestial-bodies/body-observations.ts:191](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L191)

The evidence for an ocean under its surface.

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
