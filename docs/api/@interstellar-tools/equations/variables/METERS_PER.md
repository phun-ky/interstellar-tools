[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / METERS_PER

# Variable: METERS_PER

```ts
const METERS_PER: Readonly<Record<DistanceUnitType, number>>;
```

Defined in:
[helpers/convert-distance-unit.ts:32](https://github.com/phun-ky/interstellar-tools/blob/5977d495016acdc349922082cca77744d0f1d6a5/packages/equations/src/categories/helpers/convert-distance-unit.ts#L32)

Meters-per-unit lookup for all canonical
[DistanceUnitType](../../types/type-aliases/DistanceUnitType.md) symbols.

- **Base**: conversions are performed via **meters**.
- **Astronomical unit**: `au = 149 597 870 700 m`, exact (from
  [AU_METERS](../../constants/variables/AU_METERS.md)).
- **Light-year**: `c × Julian year` (from
  [METERS_PER_LY](../../constants/variables/METERS_PER_LY.md)); `kly/Mly/Gly`
  are powers of 10 thereof.
- **Parsec**: `(648 000 / π) au` (from
  [METERS_PER_PC](../../constants/variables/METERS_PER_PC.md)); `kpc/Mpc/Gpc`
  are powers of 10 thereof.
- The table is frozen: it can be read, but not changed at runtime.

## Example

```ts
METERS_PER.km; // 1000
METERS_PER.au; // 149_597_870_700
```
