[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyObservationsInterface

# Interface: GalaxyObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:817](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L817)

What is measured about a **galaxy**.

## Properties

### absoluteMagnitudes?

```ts
absoluteMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:835](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L835)

Absolute magnitudes, by band.

---

### activeNucleus?

```ts
activeNucleus?: ActiveNucleusType;
```

Defined in:
[celestial-bodies/body-observations.ts:865](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L865)

The class of its active nucleus.

---

### angularSize?

```ts
angularSize?: {
  isophote?:   | string & {
   }
     | "D25"
     | "K20";
  major: ObservedType<AngleInterface>;
  minor: ObservedType<AngleInterface>;
};
```

Defined in:
[celestial-bodies/body-observations.ts:837](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L837)

Its apparent axes, at a named isophote.

| Name        | Type                                                                                     | Defined in                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isophote?` |                                                                                          | `string` & { }                                                                                                                                                     | `"D25"` | `"K20"` | [celestial-bodies/body-observations.ts:840](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L840) |
| `major`     | [`ObservedType`](../type-aliases/ObservedType.md)<[`AngleInterface`](AngleInterface.md)> | [celestial-bodies/body-observations.ts:838](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L838) |
| `minor`     | [`ObservedType`](../type-aliases/ObservedType.md)<[`AngleInterface`](AngleInterface.md)> | [celestial-bodies/body-observations.ts:839](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L839) |

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:833](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L833)

Apparent magnitudes, by band.

---

### astrometry?

```ts
astrometry?: AstrometryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:821](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L821)

Its ICRS position; its own `direction` is galactic.

---

### centralVelocityDispersion?

```ts
centralVelocityDispersion?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:863](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L863)

The velocity dispersion of its central stars, σ.

---

### distance?

```ts
distance?: DistanceInterface & ObservationMetaInterface & {
  method?: DistanceMethodType;
};
```

Defined in:
[celestial-bodies/body-observations.ts:829](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L829)

`distance`, with its uncertainty and method.

#### Type Declaration

| Name      | Type                                                          | Defined in                                                                                                                                                         |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `method?` | [`DistanceMethodType`](../type-aliases/DistanceMethodType.md) | [celestial-bodies/body-observations.ts:829](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L829) |

---

### distanceModulus?

```ts
distanceModulus?: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:831](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L831)

Its distance modulus, m − M.

---

### dynamicalMass?

```ts
dynamicalMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:853](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L853)

Its dynamical mass.

---

### effectiveRadius?

```ts
effectiveRadius?: ObservedType<
  | DistanceInterface
| AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:843](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L843)

Its half-light radius.

---

### environment?

```ts
environment?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:872](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L872)

Such as `'Local Group'` or `'Virgo Cluster'`.

---

### gasMetallicity?

```ts
gasMetallicity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:859](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L859)

Its gas's oxygen abundance, 12 + log(O/H).

---

### haloMass?

```ts
haloMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:855](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L855)

The mass of its dark matter halo.

---

### hiMass?

```ts
hiMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:849](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L849)

Its mass in neutral hydrogen.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:819](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L819)

Catalogue identifiers.

---

### molecularGasMass?

```ts
molecularGasMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:851](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L851)

Its mass in molecular gas.

---

### morphology?

```ts
morphology?: GalaxyMorphologyInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:823](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L823)

`type`, split into its parts.

---

### radioFluxes?

```ts
radioFluxes?: {
  flux: ObservedType<FluxDensityInterface>;
  frequencyGHz: number;
}[];
```

Defined in:
[celestial-bodies/body-observations.ts:867](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L867)

Radio flux densities.

| Name           | Type                                                                                                 | Defined in                                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `flux`         | [`ObservedType`](../type-aliases/ObservedType.md)<[`FluxDensityInterface`](FluxDensityInterface.md)> | [celestial-bodies/body-observations.ts:869](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L869) |
| `frequencyGHz` | `number`                                                                                             | [celestial-bodies/body-observations.ts:868](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L868) |

---

### recessionVelocity?

```ts
recessionVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:827](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L827)

Its heliocentric recession speed, cz.

---

### redshift?

```ts
redshift?: DimensionlessInterface & ObservationMetaInterface & {
  kind: "spectroscopic" | "photometric";
};
```

Defined in:
[celestial-bodies/body-observations.ts:825](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L825)

Its redshift, z.

#### Type Declaration

| Name   | Type              | Defined in      |
| ------ | ----------------- | --------------- |
| `kind` | `"spectroscopic"` | `"photometric"` | [celestial-bodies/body-observations.ts:825](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L825) |

---

### rotationVelocity?

```ts
rotationVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:861](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L861)

The flat part of its rotation curve.

---

### satelliteIds?

```ts
satelliteIds?: string[];
```

Defined in:
[celestial-bodies/body-observations.ts:874](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L874)

Ids of its satellite galaxies, such as `['large-magellanic-cloud']`.

---

### sersicIndex?

```ts
sersicIndex?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:845](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L845)

Its Sérsic index.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:876](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L876)

Sources for the record as a whole.

---

### starFormationRate?

```ts
starFormationRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:857](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L857)

How fast it forms stars.

---

### stellarMass?

```ts
stellarMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:847](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L847)

Its mass in stars.
