[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
VariabilityInterface

# Interface: VariabilityInterface

Defined in:
[celestial-bodies/body-observations.ts:487](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L487)

How a star's brightness **varies**.

## Properties

### amplitude?

```ts
amplitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:493](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L493)

The amplitude.

---

### band?

```ts
band?: PhotometricBandType;
```

Defined in:
[celestial-bodies/body-observations.ts:495](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L495)

The band the amplitude is measured in.

---

### period?

```ts
period?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:491](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L491)

The period, for a periodic variable.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/body-observations.ts:489](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L489)

The GCVS type, such as `'SRc'`, `'UV'`, `'DSCT'`, `'EA'` or `'DCEP'`.
