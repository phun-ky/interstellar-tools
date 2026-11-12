[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RotationObservationsInterface

# Interface: RotationObservationsInterface

Defined in:
[observations.ts:585](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L585)

**Light-curve results** that [RotationInterface](RotationInterface.md) has no
room for.

## Properties

### lightcurveAmplitude?

```ts
lightcurveAmplitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[observations.ts:589](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L589)

The light curve's peak-to-peak amplitude.

---

### period?

```ts
period?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:587](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L587)

`rotation.period` with its uncertainty.

---

### periodChange?

```ts
periodChange?: ObservedType<PeriodChangeInterface>;
```

Defined in:
[observations.ts:593](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L593)

How fast the period lengthens.

---

### pole?

```ts
pole?:
  | CelestialDirectionInterface
  | EclipticDirectionInterface;
```

Defined in:
[observations.ts:595](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L595)

The spin pole of a small body that has no IAU rotation model.

---

### spinAcceleration?

```ts
spinAcceleration?: ObservedType<SpinAccelerationInterface>;
```

Defined in:
[observations.ts:591](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L591)

How fast the spin speeds up, as YORP is given.
