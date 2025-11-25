[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DistanceUnitType

# Type Alias: DistanceUnitType

```ts
type DistanceUnitType =
  | 'm'
  | 'km'
  | 'au'
  | 'ly'
  | 'kly'
  | 'Mly'
  | 'Gly'
  | 'pc'
  | 'kpc'
  | 'Mpc'
  | 'Gpc';
```

Defined in:
[distance.ts:43](https://github.com/phun-ky/interstellar-tools/blob/e0d1c79e960d3afdb9582e7e5268537167cd33ae/packages/types/src/distance.ts#L43)

Canonical **distance unit symbols** for astronomy/space visualization.

## Design principles

- **Canonical symbols only** (no plurals / long names) for stable math &
  serialization.
- Uses **meters** as the
  [SI](https://en.wikipedia.org/wiki/International_System_of_Units) base; larger
  units have conventional scientific definitions.

## Conventions

- **`au`** - Astronomical Unit (IAU 2012 B2): **149 597 870 700 m** (lowercase
  `au` is the IAU symbol).
- **`ly` family** - Light-year based on the **Julian year**:
  `1 ly = c × 365.25 d = 9 460 730 472 580 800 m` (with `kly = 10³ ly`,
  `Mly = 10⁶ ly`, `Gly = 10⁹ ly`).
- **`pc` family** - Parsec defined from the arcsecond parallax:
  `1 pc = au × (648000 / π) ≈ 3.085677581×10¹⁶ m` (`kpc/Mpc/Gpc` are
  ×10³/×10⁶/×10⁹).

## Members

- [SI](https://en.wikipedia.org/wiki/International_System_of_Units) base &
  common multiple: `m`, `km`
- Astronomical: `au`
- Light-year family: `ly`, `kly`, `Mly`, `Gly`
- Parsec family: `pc`, `kpc`, `Mpc`, `Gpc`

## Example

```ts
// Example shape often used alongside this type:
type Distance = { value: number; unit: DistanceUnitType };

const d1: Distance = { value: 1, unit: 'au' };
const d2: Distance = { value: 3.26, unit: 'ly' };
const d3: Distance = { value: 8, unit: 'kpc' };
```

## See

- https://www.iau.org/static/resolutions/IAU2012\_English.pdf (IAU 2012 B2 -
  definition of the astronomical unit)
- https://en.wikipedia.org/wiki/Light-year (Light-year based on Julian year)
- https://en.wikipedia.org/wiki/Parsec (Parsec definition & meter equivalence)
