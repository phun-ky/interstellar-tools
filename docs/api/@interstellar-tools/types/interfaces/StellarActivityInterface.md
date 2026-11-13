[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
StellarActivityInterface

# Interface: StellarActivityInterface

Defined in:
[celestial-bodies/body-observations.ts:517](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L517)

A star's **magnetic activity**.

## Properties

### cycleLength?

```ts
cycleLength?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:531](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L531)

The activity cycle, such as the Sun's 11 years.

---

### flareEnergyThreshold?

```ts
flareEnergyThreshold?: ObservedType<EnergyInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:525](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L525)

The energy `flareRate` counts flares above.

---

### flareRate?

```ts
flareRate?: ObservedType<EventRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:523](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L523)

How often it flares above `flareEnergyThreshold`.

---

### logRhk?

```ts
logRhk?: ObservedType<DexInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:519](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L519)

The chromospheric index, log R′HK.

---

### meanMagneticField?

```ts
meanMagneticField?: ObservedType<MagneticFieldInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:529](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L529)

The mean magnetic field at the surface.

---

### spotCoverage?

```ts
spotCoverage?: ObservedType<FractionInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:527](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L527)

The share of the surface covered by spots.

---

### xrayLuminosity?

```ts
xrayLuminosity?: ObservedType<LuminosityInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:521](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L521)

The X-ray luminosity.
