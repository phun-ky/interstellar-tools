[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AtmosphereInterface

# Interface: AtmosphereInterface

Defined in:
[atmosphere.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L81)

The **state of the atmosphere** at a place and a moment: its density,
temperature and make-up.

Returned by `nrlmsise00` in `@interstellar-tools/equations`.

::: info

- `density` sums helium, oxygen, nitrogen, argon and hydrogen.
  `effectiveDensity` adds "anomalous oxygen", hot and ionised oxygen that
  matters for drag above about 500 km: use it for drag.
- Oxygen atoms, hydrogen and nitrogen atoms are 0 below 72.5 km.

:::

## Example

```ts
// 400 km up, at moderate solar activity
const air: AtmosphereInterface = {
  density: 4.07e-12,
  effectiveDensity: 4.08e-12,
  temperature: 1241,
  exosphericTemperature: 1251,
  numberDensities: {
    He: 6.67e11,
    O: 1.14e14,
    N2: 2.0e13,
    O2: 4.0e11,
    Ar: 3.56e9,
    H: 3.48e10,
    N: 4.1e12,
    anomalousO: 2.67e10
  }
};
```

## Properties

### density

```ts
density: number;
```

Defined in:
[atmosphere.ts:83](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L83)

Total mass density in kg/m³, without anomalous oxygen.

---

### effectiveDensity

```ts
effectiveDensity: number;
```

Defined in:
[atmosphere.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L85)

Total mass density for drag in kg/m³, with anomalous oxygen.

---

### exosphericTemperature

```ts
exosphericTemperature: number;
```

Defined in:
[atmosphere.ts:89](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L89)

Exospheric temperature, the temperature far above, in K.

---

### numberDensities

```ts
numberDensities: {
  anomalousO: number;
  Ar: number;
  H: number;
  He: number;
  N: number;
  N2: number;
  O: number;
  O2: number;
}
```

Defined in:
[atmosphere.ts:91](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L91)

Number densities in m⁻³.

| Name         | Type     | Description                                      | Defined in                                                                                                         |
| ------------ | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `anomalousO` | `number` | Anomalous oxygen: hot atomic and ionised oxygen. | [atmosphere.ts:107](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L107) |
| `Ar`         | `number` | Argon.                                           | [atmosphere.ts:101](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L101) |
| `H`          | `number` | Atomic hydrogen.                                 | [atmosphere.ts:103](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L103) |
| `He`         | `number` | Helium.                                          | [atmosphere.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L93)   |
| `N`          | `number` | Atomic nitrogen.                                 | [atmosphere.ts:105](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L105) |
| `N2`         | `number` | Molecular nitrogen.                              | [atmosphere.ts:97](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L97)   |
| `O`          | `number` | Atomic oxygen.                                   | [atmosphere.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L95)   |
| `O2`         | `number` | Molecular oxygen.                                | [atmosphere.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L99)   |

---

### temperature

```ts
temperature: number;
```

Defined in:
[atmosphere.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/atmosphere.ts#L87)

Temperature at the height, in K.
