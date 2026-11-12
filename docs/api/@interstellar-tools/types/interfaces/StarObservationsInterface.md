[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StarObservationsInterface

# Interface: StarObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:553](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L553)

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
[celestial-bodies/body-observations.ts:563](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L563)

Absolute magnitudes, by band, with `bol` for bolometric.

---

### activity?

```ts
activity?: StellarActivityInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:600](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L600)

Its magnetic activity.

---

### age?

```ts
age?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:585](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L585)

Its age.

---

### alphaEnhancement?

```ts
alphaEnhancement?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:575](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L575)

The alpha-element enhancement, \[α/Fe].

---

### angularDiameter?

```ts
angularDiameter?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:579](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L579)

Its limb-darkened angular diameter.

---

### apparentMagnitudes?

```ts
apparentMagnitudes?: Partial<Record<PhotometricBandType, ObservedType<MagnitudeInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:561](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L561)

Apparent magnitudes, by band.

---

### astrometry?

```ts
astrometry?: AstrometryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:559](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L559)

Its position, parallax and motion.

---

### colorIndices?

```ts
colorIndices?: Record<string, ObservedType<MagnitudeInterface>>;
```

Defined in:
[celestial-bodies/body-observations.ts:565](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L565)

Colour indices, such as `{ 'B-V': … }`.

---

### component?

```ts
component?: string;
```

Defined in:
[celestial-bodies/body-observations.ts:608](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L608)

Its letter within its system, such as `'A'`.

---

### discovery?

```ts
discovery?: DiscoveryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:557](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L557)

How it was discovered, as for a companion.

---

### effectiveTemperature?

```ts
effectiveTemperature?: ObservedType<TemperatureInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:569](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L569)

The effective temperature.

---

### evolutionaryStage?

```ts
evolutionaryStage?: StellarEvolutionaryStageType;
```

Defined in:
[celestial-bodies/body-observations.ts:604](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L604)

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
[celestial-bodies/body-observations.ts:593](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L593)

Its pole and equator temperatures, from gravity darkening.

| Name      | Type                                                                                                 | Defined in                                                                                                                                                         |
| --------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `equator` | [`ObservedType`](../type-aliases/ObservedType.md)<[`TemperatureInterface`](TemperatureInterface.md)> | [celestial-bodies/body-observations.ts:595](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L595) |
| `pole`    | [`ObservedType`](../type-aliases/ObservedType.md)<[`TemperatureInterface`](TemperatureInterface.md)> | [celestial-bodies/body-observations.ts:594](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L594) |

---

### identifiers?

```ts
identifiers?: IdentifiersInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:555](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L555)

Catalogue identifiers.

---

### limbDarkening?

```ts
limbDarkening?: LimbDarkeningInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:598](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L598)

Fitted limb-darkening laws.

---

### logSurfaceGravity?

```ts
logSurfaceGravity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:571](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L571)

The surface gravity as log₁₀ g, in cgs.

---

### luminosity?

```ts
luminosity?: ObservedType<LuminosityInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:583](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L583)

Its luminosity.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:581](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L581)

Its mass, with uncertainty and method.

---

### massLossRate?

```ts
massLossRate?: ObservedType<MassRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:606](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L606)

How fast it loses mass.

---

### metallicity?

```ts
metallicity?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:573](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L573)

The iron abundance, \[Fe/H].

---

### oblateness?

```ts
oblateness?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:591](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L591)

How flattened its spin makes it, as for Vega or Altair.

---

### projectedRotationalVelocity?

```ts
projectedRotationalVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:587](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L587)

Its projected rotation speed, v sin i.

---

### radius?

```ts
radius?: ObservedType<DistanceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:577](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L577)

Its radius, with uncertainty and method.

---

### sources?

```ts
sources?: ObservationSourceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:610](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L610)

Sources for the record as a whole.

---

### spectralClassification?

```ts
spectralClassification?: SpectralClassificationInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:567](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L567)

`type`, split into its parts.

---

### spinInclination?

```ts
spinInclination?: DegreesType;
```

Defined in:
[celestial-bodies/body-observations.ts:589](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L589)

The inclination of its spin axis to the line of sight.

---

### variability?

```ts
variability?: VariabilityInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:602](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L602)

How it varies.
