[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StellarActivityInterface

# Interface: StellarActivityInterface

Defined in:
[celestial-bodies/body-observations.ts:514](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L514)

A star's **magnetic activity**.

## Properties

### cycleLength?

```ts
cycleLength?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:528](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L528)

The activity cycle, such as the Sun's 11 years.

---

### flareEnergyThreshold?

```ts
flareEnergyThreshold?: ObservedType<EnergyInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:522](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L522)

The energy `flareRate` counts flares above.

---

### flareRate?

```ts
flareRate?: ObservedType<EventRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:520](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L520)

How often it flares above `flareEnergyThreshold`.

---

### logRhk?

```ts
logRhk?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:516](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L516)

The chromospheric index, log R′HK.

---

### meanMagneticField?

```ts
meanMagneticField?: ObservedType<MagneticFieldInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:526](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L526)

The mean magnetic field at the surface.

---

### spotCoverage?

```ts
spotCoverage?: ObservedType<FractionInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:524](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L524)

The share of the surface covered by spots.

---

### xrayLuminosity?

```ts
xrayLuminosity?: ObservedType<LuminosityInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:518](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L518)

The X-ray luminosity.
