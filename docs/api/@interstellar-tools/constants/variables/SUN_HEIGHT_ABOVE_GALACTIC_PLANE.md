[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SUN_HEIGHT_ABOVE_GALACTIC_PLANE

# Variable: SUN_HEIGHT_ABOVE_GALACTIC_PLANE

```ts
const SUN_HEIGHT_ABOVE_GALACTIC_PLANE: Readonly<DistanceInterface>;
```

Defined in:
[galactic.ts:60](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/galactic.ts#L60)

The **Sun's height above the Milky Way's plane**, $z_\odot$: 20.8 ± 0.3 pc, to
the galactic north.

::: info Notes

- Bennett & Bovy (2019) measured it from the stars around the Sun in Gaia DR2.
- The galactic equator runs through the Sun and the centre, so with the Sun
  above the plane, the equator is tilted from the plane by $\arcsin(z_\odot /
  R_0)$, about 0.144°.
- Astropy's `Galactocentric` frame calls it `z_sun`, and uses this value by
  default.

:::

## See

https://arxiv.org/abs/1809.03507 Bennett & Bovy 2019, MNRAS 482, 1417

## Example

```ts
console.log(SUN_HEIGHT_ABOVE_GALACTIC_PLANE); // { value: 20.8, unit: 'pc' }
```
