[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ImpactExperimentInterface

# Interface: ImpactExperimentInterface

Defined in:
[celestial-bodies/body-observations.ts:169](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L169)

What a **kinetic impact** did to a moon, as DART's did to Dimorphos.

## Properties

### date

```ts
date: Date;
```

Defined in:
[celestial-bodies/body-observations.ts:173](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L173)

When it hit.

---

### mission

```ts
mission: string;
```

Defined in:
[celestial-bodies/body-observations.ts:171](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L171)

The mission.

---

### momentumEnhancement?

```ts
momentumEnhancement?: ObservedType;
```

Defined in:
[celestial-bodies/body-observations.ts:177](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L177)

The momentum enhancement factor, β.

---

### periodChange

```ts
periodChange: ObservedType<TemporalInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:175](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L175)

How much the orbital period changed.
