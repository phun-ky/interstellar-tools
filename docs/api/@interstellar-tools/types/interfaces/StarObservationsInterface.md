[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarObservationsInterface

# Interface: StarObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:641](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L641)

What is measured about a **star**. Its own `mass` (M☉) and `radius` stay the
values the equations use; these carry uncertainties and methods.

## Example

```ts
const sun: StarObservationsInterface = {
  effectiveTemperature: {
    value: 5772,
    unit: 'K',
    uncertainty: { plus: 0.8, minus: 0.8 }
  },
  spectralClassification: {
    raw: 'G2V',
    spectralClass: 'G',
    subclass: 2,
    luminosityClass: 'V'
  }
};
```

## Properties

### absoluteMagnitudes?

```ts
absoluteMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:651](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L651)

Absolute magnitudes, by band, with `bol` for bolometric.

---

### activity?

```ts
activity?: StellarActivityInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:688](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L688)

Its magnetic activity.

---

### age?

```ts
age?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:673](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L673)

Its age.

---

### alphaEnhancement?

```ts
alphaEnhancement?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:663](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L663)

The alpha-element enhancement, \[α/Fe].

---

### angularDiameter?

```ts
angularDiameter?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:667](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L667)

Its limb-darkened angular diameter.

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:649](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L649)

Apparent magnitudes, by band.

---

### astrometry?

```ts
astrometry?: AstrometryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:647](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L647)

Its position, parallax and motion.

---

### astrosphere?

```ts
astrosphere?: AstrosphereInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:696](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L696)

The bubble its wind blows in the interstellar medium.

---

### colorIndices?

```ts
colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
```

Defined in:
[celestial-bodies/body-observations.ts:653](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L653)

Colour indices, such as `{ 'B-V': … }`.

---

### component?

```ts
component?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:698](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L698)

Its letter within its system, such as `'A'`.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:645](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L645)

How it was discovered, as for a companion.

---

### effectiveTemperature?

```ts
effectiveTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:657](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L657)

The effective temperature.

---

### evolutionaryStage?

```ts
evolutionaryStage?: StellarEvolutionaryStageType;
```

Defined in:
[celestial-bodies/body-observations.ts:692](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L692)

Where it is in its life.

---

### gravityDarkening?

```ts
gravityDarkening?: {
  equator: ObservedType<TemperatureInterface>;
  pole: ObservedType<TemperatureInterface>;
};
```

Defined in:
[celestial-bodies/body-observations.ts:681](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L681)

Its pole and equator temperatures, from gravity darkening.

| Name      | Type                                                                                                 | Defined in                                                                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `equator` | [`ObservedType`](../type-aliases/ObservedType.md)<[`TemperatureInterface`](TemperatureInterface.md)> | [celestial-bodies/body-observations.ts:683](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L683) |
| `pole`    | [`ObservedType`](../type-aliases/ObservedType.md)<[`TemperatureInterface`](TemperatureInterface.md)> | [celestial-bodies/body-observations.ts:682](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L682) |

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:643](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L643)

Catalogue identifiers.

---

### limbDarkening?

```ts
limbDarkening?: LimbDarkeningInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:686](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L686)

Fitted limb-darkening laws.

---

### logSurfaceGravity?

```ts
logSurfaceGravity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:659](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L659)

The surface gravity as log₁₀ g, in cgs.

---

### luminosity?

```ts
luminosity?: ObservedType<LuminosityInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:671](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L671)

Its luminosity.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:669](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L669)

Its mass, with uncertainty and method.

---

### massLossRate?

```ts
massLossRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:694](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L694)

How fast it loses mass.

---

### metallicity?

```ts
metallicity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:661](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L661)

The iron abundance, \[Fe/H].

---

### oblateness?

```ts
oblateness?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:679](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L679)

How flattened its spin makes it, as for Vega or Altair.

---

### projectedRotationalVelocity?

```ts
projectedRotationalVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:675](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L675)

Its projected rotation speed, v sin i.

---

### radius?

```ts
radius?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:665](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L665)

Its radius, with uncertainty and method.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:700](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L700)

Sources for the record as a whole.

---

### spectralClassification?

```ts
spectralClassification?: SpectralClassificationInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:655](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L655)

`type`, split into its parts.

---

### spinInclination?

```ts
spinInclination?: DegreesType;
```

Defined in:
[celestial-bodies/body-observations.ts:677](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L677)

The inclination of its spin axis to the line of sight.

---

### variability?

```ts
variability?: VariabilityInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:690](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L690)

How it varies.
