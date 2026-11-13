[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SUN_GALACTOCENTRIC_DISTANCE

# Variable: SUN_GALACTOCENTRIC_DISTANCE

```ts
const SUN_GALACTOCENTRIC_DISTANCE: Readonly<DistanceInterface>;
```

Defined in:
[galactic.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/galactic.ts#L33)

The **Sun's distance from the Milky Way's centre**, $R_0$: 8275.9 ± 8.6 pc.

::: info Notes

- The GRAVITY Collaboration (2024) fitted it with the mass of Sagittarius A\*,
  from the orbits of the S-stars. It's the same as Sagittarius A\*'s `distance`
  in `GALAXIES`.
- The distances and directions in `GALAXIES` are measured from the Sun. To draw
  them around the Milky Way's centre, move them by $R_0$ and
  [SUN_HEIGHT_ABOVE_GALACTIC_PLANE](SUN_HEIGHT_ABOVE_GALACTIC_PLANE.md), as
  `galactocentricPosition` in `@interstellar-tools/equations` does.
- Astropy's `Galactocentric` frame calls it `galcen_distance`, and uses 8.122
  kpc (GRAVITY 2018) by default. It puts the centre at this distance towards
  galactic longitude and latitude 0°, the IAU's galactic centre, 4.3′ (10.5 pc)
  from Sagittarius A\*.

:::

## See

GRAVITY Collaboration 2024, A\&A 692, A242

## Example

```ts
console.log(SUN_GALACTOCENTRIC_DISTANCE); // { value: 8275.9, unit: 'pc' }
```
