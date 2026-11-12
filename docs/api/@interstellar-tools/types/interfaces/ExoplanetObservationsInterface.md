[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ExoplanetObservationsInterface

# Interface: ExoplanetObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:110](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L110)

What is measured about a planet **outside the Solar System**.

## Example

```ts
const trappist1e: ExoplanetObservationsInterface = {
  detectionMethod: 'transit',
  massKind: 'true'
};
```

## Properties

### detectionMethod

```ts
detectionMethod: ExoplanetDetectionMethodType;
```

Defined in:
[celestial-bodies/body-observations.ts:112](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L112)

How it was found.

---

### eclipseDepths?

```ts
eclipseDepths?: Partial<Record<PhotometricBandType, ObservedType<FractionInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:120](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L120)

Secondary-eclipse depths, by band.

---

### insolation?

```ts
insolation?: ObservedType<IrradianceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:124](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L124)

The light it gets from its star.

---

### massKind?

```ts
massKind?: "true" | "minimum" | "mass-radius relation";
```

Defined in:
[celestial-bodies/body-observations.ts:114](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L114)

Whether `massProperties.mass` is a true mass, a minimum mass or an estimate.

---

### radialVelocitySemiAmplitude?

```ts
radialVelocitySemiAmplitude?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:116](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L116)

The radial-velocity semi-amplitude, K.

---

### rotationBasis?

```ts
rotationBasis?: "measured" | "assumed tidally locked";
```

Defined in:
[celestial-bodies/body-observations.ts:130](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L130)

Whether `rotation` is measured, or assumed tidally locked.

---

### spectroscopicDetections?

```ts
spectroscopicDetections?: SpeciesAbundanceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:128](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L128)

Species found by spectroscopy.

---

### spinOrbitAngle?

```ts
spinOrbitAngle?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:126](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L126)

The projected spin–orbit angle λ, from the Rossiter–McLaughlin effect.

---

### transit?

```ts
transit?: TransitObservationsInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:118](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L118)

Its transits.
