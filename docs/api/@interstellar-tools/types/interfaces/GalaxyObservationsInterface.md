[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GalaxyObservationsInterface

# Interface: GalaxyObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:727](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L727)

What is measured about a **galaxy**.

## Properties

### absoluteMagnitudes?

```ts
absoluteMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:745](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L745)

Absolute magnitudes, by band.

---

### activeNucleus?

```ts
activeNucleus?: ActiveNucleusType;
```

Defined in:
[celestial-bodies/body-observations.ts:775](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L775)

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
[celestial-bodies/body-observations.ts:747](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L747)

Its apparent axes, at a named isophote.

| Name        | Type                                                                                     | Defined in                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `isophote?` |                                                                                          | `string` & { }                                                                                                                                                     | `"D25"` | `"K20"` | [celestial-bodies/body-observations.ts:750](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L750) |
| `major`     | [`ObservedType`](../type-aliases/ObservedType.md)<[`AngleInterface`](AngleInterface.md)> | [celestial-bodies/body-observations.ts:748](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L748) |
| `minor`     | [`ObservedType`](../type-aliases/ObservedType.md)<[`AngleInterface`](AngleInterface.md)> | [celestial-bodies/body-observations.ts:749](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L749) |

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:743](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L743)

Apparent magnitudes, by band.

---

### astrometry?

```ts
astrometry?: AstrometryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:731](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L731)

Its ICRS position; its own `direction` is galactic.

---

### centralVelocityDispersion?

```ts
centralVelocityDispersion?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:773](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L773)

The velocity dispersion of its central stars, σ.

---

### distance?

```ts
distance?: DistanceInterface & ObservationMetaInterface & {
  method?: DistanceMethodType;
};
```

Defined in:
[celestial-bodies/body-observations.ts:739](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L739)

`distance`, with its uncertainty and method.

#### Type Declaration

| Name      | Type                                                          | Defined in                                                                                                                                                         |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `method?` | [`DistanceMethodType`](../type-aliases/DistanceMethodType.md) | [celestial-bodies/body-observations.ts:739](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L739) |

---

### distanceModulus?

```ts
distanceModulus?: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:741](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L741)

Its distance modulus, m − M.

---

### dynamicalMass?

```ts
dynamicalMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:763](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L763)

Its dynamical mass.

---

### effectiveRadius?

```ts
effectiveRadius?: ObservedType<
  | DistanceInterface
| AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:753](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L753)

Its half-light radius.

---

### environment?

```ts
environment?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:782](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L782)

Such as `'Local Group'` or `'Virgo Cluster'`.

---

### gasMetallicity?

```ts
gasMetallicity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:769](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L769)

Its gas's oxygen abundance, 12 + log(O/H).

---

### haloMass?

```ts
haloMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:765](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L765)

The mass of its dark matter halo.

---

### hiMass?

```ts
hiMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:759](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L759)

Its mass in neutral hydrogen.

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:729](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L729)

Catalogue identifiers.

---

### molecularGasMass?

```ts
molecularGasMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:761](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L761)

Its mass in molecular gas.

---

### morphology?

```ts
morphology?: GalaxyMorphologyInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:733](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L733)

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
[celestial-bodies/body-observations.ts:777](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L777)

Radio flux densities.

| Name           | Type                                                                                                 | Defined in                                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `flux`         | [`ObservedType`](../type-aliases/ObservedType.md)<[`FluxDensityInterface`](FluxDensityInterface.md)> | [celestial-bodies/body-observations.ts:779](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L779) |
| `frequencyGHz` | `number`                                                                                             | [celestial-bodies/body-observations.ts:778](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L778) |

---

### recessionVelocity?

```ts
recessionVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:737](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L737)

Its heliocentric recession speed, cz.

---

### redshift?

```ts
redshift?: DimensionlessInterface & ObservationMetaInterface & {
  kind: "spectroscopic" | "photometric";
};
```

Defined in:
[celestial-bodies/body-observations.ts:735](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L735)

Its redshift, z.

#### Type Declaration

| Name   | Type              | Defined in      |
| ------ | ----------------- | --------------- |
| `kind` | `"spectroscopic"` | `"photometric"` | [celestial-bodies/body-observations.ts:735](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L735) |

---

### rotationVelocity?

```ts
rotationVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:771](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L771)

The flat part of its rotation curve.

---

### satelliteIds?

```ts
satelliteIds?: string[];
```

Defined in:
[celestial-bodies/body-observations.ts:784](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L784)

Ids of its satellite galaxies, such as `['large-magellanic-cloud']`.

---

### sersicIndex?

```ts
sersicIndex?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:755](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L755)

Its Sérsic index.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:786](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L786)

Sources for the record as a whole.

---

### starFormationRate?

```ts
starFormationRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:767](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L767)

How fast it forms stars.

---

### stellarMass?

```ts
stellarMass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:757](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L757)

Its mass in stars.
