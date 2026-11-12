[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RotationObservationsInterface

# Interface: RotationObservationsInterface

Defined in:
[observations.ts:582](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L582)

**Light-curve results** that [RotationInterface](RotationInterface.md) has no
room for.

## Properties

### lightcurveAmplitude?

```ts
lightcurveAmplitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[observations.ts:586](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L586)

The light curve's peak-to-peak amplitude.

---

### period?

```ts
period?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:584](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L584)

`rotation.period` with its uncertainty.

---

### periodChange?

```ts
periodChange?: ObservedType<PeriodChangeInterface>;
```

Defined in:
[observations.ts:590](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L590)

How fast the period lengthens.

---

### pole?

```ts
pole?:
  | CelestialDirectionInterface
  | {
  eclipticLatitude: DegreesType;
  eclipticLongitude: DegreesType;
};
```

Defined in:
[observations.ts:592](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L592)

The spin pole of a small body that has no IAU rotation model.

---

### spinAcceleration?

```ts
spinAcceleration?: ObservedType<SpinAccelerationInterface>;
```

Defined in:
[observations.ts:588](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L588)

How fast the spin speeds up, as YORP is given.
