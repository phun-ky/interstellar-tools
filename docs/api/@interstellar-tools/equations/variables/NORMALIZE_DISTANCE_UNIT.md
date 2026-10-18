[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / NORMALIZE_DISTANCE_UNIT

# Variable: NORMALIZE_DISTANCE_UNIT

```ts
const NORMALIZE_DISTANCE_UNIT: Readonly<{
  astronomical unit: "au";
  astronomical units: "au";
  astronomical-unit: "au";
  astronomical-units: "au";
  au: "au";
  Au: "au";
  AU: "au";
  gigalightyear: "Gly";
  gigalightyears: "Gly";
  gigaparsec: "Gpc";
  gigaparsecs: "Gpc";
  Gly: "Gly";
  Gpc: "Gpc";
  kilolightyear: "kly";
  kilolightyears: "kly";
  kilometer: "km";
  kilometers: "km";
  kilometre: "km";
  kilometres: "km";
  kiloparsec: "kpc";
  kiloparsecs: "kpc";
  kly: "kly";
  km: "km";
  kpc: "kpc";
  light-year: "ly";
  light-years: "ly";
  lightyear: "ly";
  lightyears: "ly";
  ly: "ly";
  m: "m";
  megalightyear: "Mly";
  megalightyears: "Mly";
  megaparsec: "Mpc";
  megaparsecs: "Mpc";
  meter: "m";
  meters: "m";
  metre: "m";
  metres: "m";
  Mly: "Mly";
  Mpc: "Mpc";
  parsec: "pc";
  parsecs: "pc";
  pc: "pc";
}>;
```

Defined in:
[helpers/normalize-distance-unit.ts:20](https://github.com/phun-ky/interstellar-tools/blob/c937a42cf99d9a589645c5e215479f165095d9c2/packages/equations/src/categories/helpers/normalize-distance-unit.ts#L20)

Lookup table that **normalizes distance unit aliases** (and the canonical
symbols themselves) to a single, canonical
[DistanceUnitType](../../types/type-aliases/DistanceUnitType.md).

- Canonical symbols map to themselves (`'au'` → `'au'`).
- Aliases map to their symbol (`'AU'` → `'au'`, `'light-years'` → `'ly'`,
  `'kiloparsecs'` → `'kpc'`).
- **Case-sensitive** and exact: `'AU'` and `'Au'` are accepted, `'aU'` is not.
- The table is frozen: it can be read, but not changed at runtime.

## See

- normalizeDistanceUnit
- https://www.iau.org/static/resolutions/IAU2012_English.pdf (IAU 2012 B2 -
  astronomical unit, symbol "au")
