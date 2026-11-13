[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / convertQuantity

# Function: convertQuantity()

```ts
function convertQuantity<
  Q extends QuantityType & {
    uncertainty?: UncertaintyInterface;
  }
>(quantity: Q, unit: Q['unit']): Q;
```

Defined in:
[helpers/convert-quantity.ts:188](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/helpers/convert-quantity.ts#L188)

Convert a **quantity** to another unit of the same kind: a mass from kg to
Jupiter masses, a pressure from bar to Pa, a parallax from mas to arcsec.

$$
\text{value}_\text{target} = \text{value} \cdot \frac{f(u_\text{in})}{f(u_\text{out})}
$$

where $f(u)$ is the unit's size in its kind's SI unit.

::: info Notes

- **Nominal units** are the IAU's 2015 Resolution B3 values: `M_sun`, `M_jup`
  and `M_earth` are the nominal $(GM)^\mathrm{N}$ over
  [G_SI](../../constants/variables/G_SI.md), `L_sun` 3.828 × 10²⁶ W, and
  `S_earth` 1361 W/m².
- The rest of the quantity, such as an observation's `source`, is kept, and an
  `uncertainty` is converted with the value.
- Only a quantity's own kind of unit is accepted, by type and at runtime: a mass
  can't become a speed. Kinds with a single unit, such as `K` or `dex`, convert
  to themselves.
- Distances and times have their own converters: `convertDistanceUnit`, and
  `convertTemporalUnit` in `@interstellar-tools/temporal`.

:::

## Type Parameters

| Type Parameter                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="type-parameter-q"></a> `Q` _extends_ [`QuantityType`](../type-aliases/QuantityType.md) & { `uncertainty?`: [`UncertaintyInterface`](../../types/interfaces/UncertaintyInterface.md); } |

## Parameters

| Parameter  | Type           | Description                                                                                     |
| ---------- | -------------- | ----------------------------------------------------------------------------------------------- |
| `quantity` | `Q`            | A quantity `{ value, unit }`, from `@interstellar-tools/types`' quantities, or an observed one. |
| `unit`     | `Q`\[`"unit"`] | The unit to convert to, of the same kind.                                                       |

## Returns

`Q`

A copy of `quantity` in `unit`, with its `uncertainty` converted too.

## Throws

If either unit isn't known, or they're different kinds.

## Example

```ts
convertQuantity({ value: 1, unit: 'M_jup' }, 'M_earth');
// → { value: 317.8284, unit: 'M_earth' }
convertQuantity({ value: 92, unit: 'bar' }, 'Pa');
// → { value: 9_200_000, unit: 'Pa' }
// ʻOumuamua's non-gravitational A1 from JPL, in m/s²
convertQuantity({ value: 2.79e-7, unit: 'au/d2' }, 'm/s2');
// → { value: 5.591e-6, unit: 'm/s2' }
```

## See

convertDistanceUnit
