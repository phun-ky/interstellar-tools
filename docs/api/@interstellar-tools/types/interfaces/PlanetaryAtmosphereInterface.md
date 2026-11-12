[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetaryAtmosphereInterface

# Interface: PlanetaryAtmosphereInterface

Defined in:
[observations.ts:462](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L462)

A body's **atmosphere**, as observed. Not
[AtmosphereInterface](AtmosphereInterface.md), which is Earth's upper atmosphere
from a model.

## Properties

### clouds?

```ts
clouds?: CloudLayerInterface[];
```

Defined in:
[observations.ts:474](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L474)

Cloud and haze layers.

---

### composition?

```ts
composition?: SpeciesAbundanceInterface[];
```

Defined in:
[observations.ts:472](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L472)

Its gases, and how much of each.

---

### features?

```ts
features?: AtmosphericFeatureInterface[];
```

Defined in:
[observations.ts:476](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L476)

Lasting features, such as storms.

---

### meanMolecularWeight?

```ts
meanMolecularWeight?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:470](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L470)

The mean molecular weight, in g/mol.

---

### presence

```ts
presence: 'substantial' | 'thin' | 'exosphere' | 'none' | 'unconstrained';
```

Defined in:
[observations.ts:464](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L464)

Whether there is one, and how much.

---

### scaleHeight?

```ts
scaleHeight?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:468](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L468)

The pressure scale height.

---

### surfacePressure?

```ts
surfacePressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:466](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L466)

The pressure at a solid body's surface.

---

### variability?

```ts
variability?: string;
```

Defined in:
[observations.ts:478](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L478)

How it changes with the seasons or over the years, as Pluto's does.
