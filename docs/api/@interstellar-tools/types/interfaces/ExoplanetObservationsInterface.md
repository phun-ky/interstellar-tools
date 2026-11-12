[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ExoplanetObservationsInterface

# Interface: ExoplanetObservationsInterface

Defined in:
[celestial-bodies/body-observations.ts:107](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L107)

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
[celestial-bodies/body-observations.ts:109](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L109)

How it was found.

---

### eclipseDepths?

```ts
eclipseDepths?: Partial<Record<PhotometricBandType, ObservedType<FractionInterface>>>;
```

Defined in:
[celestial-bodies/body-observations.ts:117](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L117)

Secondary-eclipse depths, by band.

---

### insolation?

```ts
insolation?: ObservedType<IrradianceInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:121](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L121)

The light it gets from its star.

---

### massKind?

```ts
massKind?: "true" | "minimum" | "mass-radius relation";
```

Defined in:
[celestial-bodies/body-observations.ts:111](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L111)

Whether `massProperties.mass` is a true mass, a minimum mass or an estimate.

---

### radialVelocitySemiAmplitude?

```ts
radialVelocitySemiAmplitude?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:113](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L113)

The radial-velocity semi-amplitude, K.

---

### rotationBasis?

```ts
rotationBasis?: "measured" | "assumed tidally locked";
```

Defined in:
[celestial-bodies/body-observations.ts:127](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L127)

Whether `rotation` is measured, or assumed tidally locked.

---

### spectroscopicDetections?

```ts
spectroscopicDetections?: SpeciesAbundanceInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:125](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L125)

Species found by spectroscopy.

---

### spinOrbitAngle?

```ts
spinOrbitAngle?: ObservedType<AngleInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:123](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L123)

The projected spin–orbit angle λ, from the Rossiter–McLaughlin effect.

---

### transit?

```ts
transit?: TransitObservationsInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:115](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L115)

Its transits.
