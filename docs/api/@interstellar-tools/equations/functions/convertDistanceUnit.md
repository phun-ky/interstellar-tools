[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / convertDistanceUnit

# Function: convertDistanceUnit()

```ts
function convertDistanceUnit(
  distance: DistanceInterface,
  targetUnit:
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
    | 'Gpc'
    | 'm'
    | 'km'
    | 'au'
    | 'ly'
    | 'pc'
): DistanceInterface;
```

Defined in:
[helpers/convert-distance-unit.ts:83](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/equations/src/categories/helpers/convert-distance-unit.ts#L83)

Convert a **distance** between any two
[DistanceUnitType](../../types/type-aliases/DistanceUnitType.md) units.

- Uses [METERS_PER](../variables/METERS_PER.md) with **meters** as the
  intermediate unit.
- The `distance.unit` is expected to be **canonical**, as in the datasets.
- The `targetUnit` may be a canonical unit or an alias such as `'AU'`; it is
  normalized to a canonical symbol.

$$
\text{value}_{\text{target}}
\;=\;
\frac{\text{value}_{\text{in}} \cdot \mathrm{METERS\_PER}[u_{\text{in}}]}
     {\mathrm{METERS\_PER}[u_{\text{out}}]}
$$

## Parameters

| Parameter    | Type                                                               | Description                                           |
| ------------ | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `distance`   | [`DistanceInterface`](../../types/interfaces/DistanceInterface.md) | Input distance `{ value, unit }` in a canonical unit. |
| `targetUnit` |                                                                    | `"meter"`                                             | `"meters"` | `"metre"` | `"metres"` | `"kilometer"` | `"kilometers"` | `"kilometre"` | `"kilometres"` | `"AU"` | `"Au"` | `"astronomical-unit"` | `"astronomical-units"` | `"astronomical unit"` | `"astronomical units"` | `"lightyear"` | `"lightyears"` | `"light-year"` | `"light-years"` | `"kilolightyear"` | `"kilolightyears"` | `"kly"` | `"megalightyear"` | `"megalightyears"` | `"Mly"` | `"gigalightyear"` | `"gigalightyears"` | `"Gly"` | `"parsec"` | `"parsecs"` | `"kiloparsec"` | `"kiloparsecs"` | `"kpc"` | `"megaparsec"` | `"megaparsecs"` | `"Mpc"` | `"gigaparsec"` | `"gigaparsecs"` | `"Gpc"` | `"m"` | `"km"` | `"au"` | `"ly"` | `"pc"` | Desired output unit, canonical or an alias (will be normalized). |

## Returns

[`DistanceInterface`](../../types/interfaces/DistanceInterface.md)

A new `{ value, unit }` where `unit` is the canonical target symbol.

## Throws

If `targetUnit` is not a known unit or alias.

## Example

```ts
convertDistanceUnit({ value: 1, unit: 'au' }, 'km');
// → { value: 149_597_870.7, unit: 'km' }

convertDistanceUnit({ value: 1, unit: 'pc' }, 'ly');
// → { value: 3.2615637771674333, unit: 'ly' }

// Put a dataset's semi-major axis in the unit a renderer draws in:
const jupiter = PLANETS.find((p) => p.id === 'jupiter');
convertDistanceUnit(jupiter.orbit.a, 'au').value;
```

## See

normalizeDistanceUnit
