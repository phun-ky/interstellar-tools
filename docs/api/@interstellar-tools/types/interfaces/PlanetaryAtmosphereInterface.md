[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PlanetaryAtmosphereInterface

# Interface: PlanetaryAtmosphereInterface

Defined in:
[observations.ts:465](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L465)

A body's **atmosphere**, as observed. Not
[AtmosphereInterface](AtmosphereInterface.md), which is Earth's upper atmosphere
from a model.

## Properties

### clouds?

```ts
clouds?: CloudLayerInterface[];
```

Defined in:
[observations.ts:477](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L477)

Cloud and haze layers.

---

### composition?

```ts
composition?: SpeciesAbundanceInterface[];
```

Defined in:
[observations.ts:475](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L475)

Its gases, and how much of each.

---

### features?

```ts
features?: AtmosphericFeatureInterface[];
```

Defined in:
[observations.ts:479](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L479)

Lasting features, such as storms.

---

### meanMolecularWeight?

```ts
meanMolecularWeight?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:473](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L473)

The mean molecular weight, in g/mol.

---

### presence

```ts
presence: 'substantial' | 'thin' | 'exosphere' | 'none' | 'unconstrained';
```

Defined in:
[observations.ts:467](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L467)

Whether there is one, and how much.

---

### scaleHeight?

```ts
scaleHeight?: ObservedType<DistanceInterface>;
```

Defined in:
[observations.ts:471](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L471)

The pressure scale height.

---

### surfacePressure?

```ts
surfacePressure?: ObservedType<PressureInterface>;
```

Defined in:
[observations.ts:469](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L469)

The pressure at a solid body's surface.

---

### variability?

```ts
variability?: string;
```

Defined in:
[observations.ts:481](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L481)

How it changes with the seasons or over the years, as Pluto's does.
