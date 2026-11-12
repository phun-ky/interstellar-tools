[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometProductionRateInterface

# Interface: CometProductionRateInterface

Defined in:
[celestial-bodies/body-observations.ts:302](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L302)

How fast a comet gives off one **species**.

## Properties

### heliocentricDistance?

```ts
heliocentricDistance?: DistanceInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:308](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L308)

Its distance from the Sun when measured.

---

### rate

```ts
rate: ObservedType<ProductionRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:306](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L306)

In molecules a second.

---

### species

```ts
species: string;
```

Defined in:
[celestial-bodies/body-observations.ts:304](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L304)

Such as `'H2O'`, `'OH'`, `'CO'`, `'CO2'`, `'CN'`, `'C2'` or `'HCN'`.
