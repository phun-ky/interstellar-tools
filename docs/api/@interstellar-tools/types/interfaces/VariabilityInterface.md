[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
VariabilityInterface

# Interface: VariabilityInterface

Defined in:
[celestial-bodies/body-observations.ts:484](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L484)

How a star's brightness **varies**.

## Properties

### amplitude?

```ts
amplitude?: ObservedType<MagnitudeInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:490](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L490)

The amplitude.

---

### band?

```ts
band?: PhotometricBandType;
```

Defined in:
[celestial-bodies/body-observations.ts:492](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L492)

The band the amplitude is measured in.

---

### period?

```ts
period?: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:488](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L488)

The period, for a periodic variable.

---

### type

```ts
type: string;
```

Defined in:
[celestial-bodies/body-observations.ts:486](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L486)

The GCVS type, such as `'SRc'`, `'UV'`, `'DSCT'`, `'EA'` or `'DCEP'`.
