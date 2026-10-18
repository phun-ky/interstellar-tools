[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / normalizeDistanceUnit

# Function: normalizeDistanceUnit()

```ts
function normalizeDistanceUnit(u: string): DistanceUnitType;
```

Defined in:
[helpers/normalize-distance-unit.ts:94](https://github.com/phun-ky/interstellar-tools/blob/4583759b69f19864e1a8df0657adb68571f0903e/packages/equations/src/categories/helpers/normalize-distance-unit.ts#L94)

Normalize a **distance unit string** into a canonical
[DistanceUnitType](../../types/type-aliases/DistanceUnitType.md).

- Trims surrounding whitespace.
- Accepts canonical symbols (`'km'`, `'au'`, `'ly'`, `'kpc'`, ...) and aliases
  (`'AU'`, `'kilometres'`, `'light-years'`, `'parsecs'`, ...), using
  [NORMALIZE_DISTANCE_UNIT](../variables/NORMALIZE_DISTANCE_UNIT.md) as the
  single source of truth.
- **Case-sensitive**: `'Parsecs'` is rejected; use `'parsecs'` or `'pc'`.

## Parameters

| Parameter | Type     | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `u`       | `string` | The input unit string. Leading/trailing whitespace is ignored. |

## Returns

[`DistanceUnitType`](../../types/type-aliases/DistanceUnitType.md)

The canonical [DistanceUnitType](../../types/type-aliases/DistanceUnitType.md).

## Throws

If `u` is not a known unit or alias.

## Example

```ts
normalizeDistanceUnit('AU'); // 'au'
normalizeDistanceUnit(' light-years '); // 'ly'
normalizeDistanceUnit('kiloparsecs'); // 'kpc'
normalizeDistanceUnit('Mpc'); // 'Mpc' (already canonical)
```
