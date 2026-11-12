[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CometProductionRateInterface

# Interface: CometProductionRateInterface

Defined in:
[celestial-bodies/body-observations.ts:299](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L299)

How fast a comet gives off one **species**.

## Properties

### heliocentricDistance?

```ts
heliocentricDistance?: DistanceInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:305](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L305)

Its distance from the Sun when measured.

---

### rate

```ts
rate: ObservedType<ProductionRateInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:303](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L303)

In molecules a second.

---

### species

```ts
species: string;
```

Defined in:
[celestial-bodies/body-observations.ts:301](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L301)

Such as `'H2O'`, `'OH'`, `'CO'`, `'CO2'`, `'CN'`, `'C2'` or `'HCN'`.
