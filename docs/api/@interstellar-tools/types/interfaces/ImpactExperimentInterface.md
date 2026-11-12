[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ImpactExperimentInterface

# Interface: ImpactExperimentInterface

Defined in:
[celestial-bodies/body-observations.ts:166](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L166)

What a **kinetic impact** did to a moon, as DART's did to Dimorphos.

## Properties

### date

```ts
date: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:170](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L170)

When it hit.

---

### mission

```ts
mission: string;
```

Defined in:
[celestial-bodies/body-observations.ts:168](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L168)

The mission.

---

### momentumEnhancement?

```ts
momentumEnhancement?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:174](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L174)

The momentum enhancement factor, β.

---

### periodChange

```ts
periodChange: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:172](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L172)

How much the orbital period changed.
