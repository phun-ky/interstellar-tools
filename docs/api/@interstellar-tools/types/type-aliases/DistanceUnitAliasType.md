[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DistanceUnitAliasType

# Type Alias: DistanceUnitAliasType

```ts
type DistanceUnitAliasType =
  | 'meter'
  | 'meters'
  | 'metre'
  | 'metres'
  | 'kilometer'
  | 'kilometers'
  | 'kilometre'
  | 'kilometres'
  | 'AU'
  | 'Au'
  | 'astronomical-unit'
  | 'astronomical-units'
  | 'astronomical unit'
  | 'astronomical units'
  | 'lightyear'
  | 'lightyears'
  | 'light-year'
  | 'light-years'
  | 'kilolightyear'
  | 'kilolightyears'
  | 'kly'
  | 'megalightyear'
  | 'megalightyears'
  | 'Mly'
  | 'gigalightyear'
  | 'gigalightyears'
  | 'Gly'
  | 'parsec'
  | 'parsecs'
  | 'kiloparsec'
  | 'kiloparsecs'
  | 'kpc'
  | 'megaparsec'
  | 'megaparsecs'
  | 'Mpc'
  | 'gigaparsec'
  | 'gigaparsecs'
  | 'Gpc';
```

Defined in:
[distance.ts:94](https://github.com/phun-ky/interstellar-tools/blob/0c627f25b1bde133d3b97931c6363645d097a039/packages/types/src/distance.ts#L94)

Human-friendly **distance unit aliases** accepted at input time.

These strings should be parsed and **normalized** to canonical
[DistanceUnitType](DistanceUnitType.md) (e.g., `"AU"` → `"au"`, `"lightyears"` →
`"ly"`, `"kiloparsecs"` → `"kpc"`).

## Scope & conventions

- **Canonical vs. aliases**: This type is for _inputs_. Convert to canonical
  symbols (`m`, `km`, `au`, `ly/kly/Mly/Gly`, `pc/kpc/Mpc/Gpc`) before math or
  serialization.
- **Case-sensitive** and **exact** matches: tokens are matched exactly as listed
  here. For example, `"AU"` is valid (alias) while `"au"` is the canonical
  symbol (not part of this alias type).
- **IAU symbol**: canonical astronomical unit is lowercase **`au`**; we accept
  `"AU"`, `"Au"`, and textual forms as aliases.
- **Light-year and parsec families**: long names (with/without hyphens)
  normalize to their canonical symbols (`ly/kly/Mly/Gly`, `pc/kpc/Mpc/Gpc`). By
  convention, `ly` uses the **Julian year** (consistent with your temporal
  units).

### Typical flow

1. Accept `DistanceUnitAliasType | DistanceUnitType` at your API boundary.
2. Normalize to `DistanceUnitType` (e.g., via `normalizeDistanceUnit`).
3. Perform calculations using canonical units only.

## Example

```ts
// Assuming `normalizeDistanceUnit` and `NORMALIZE_DISTANCE_UNIT` are defined:
normalizeDistanceUnit('AU'); // 'au'
normalizeDistanceUnit('lightyears'); // 'ly'
normalizeDistanceUnit('kilolightyears'); // 'kly'
normalizeDistanceUnit('parsecs'); // 'pc'
normalizeDistanceUnit('Mpc'); // 'Mpc' (already canonical)
```

## See

- DistanceUnitType for the canonical symbol set.
- https://www.iau.org/static/resolutions/IAU2012\_English.pdf (IAU 2012 B2 -
  astronomical unit, symbol "au")
- https://en.wikipedia.org/wiki/Light-year (Light-year; Julian-year convention)
- https://en.wikipedia.org/wiki/Parsec (Parsec definition)
