[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AngleUnitType

# Type Alias: AngleUnitType

```ts
type AngleUnitType = 'rad' | 'deg' | 'arcmin' | 'arcsec' | 'mas' | 'μas';
```

Defined in:
[quantities.ts:171](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/quantities.ts#L171)

Canonical **angle unit symbols** for measured angles, including the small ones
on the sky: parallaxes, angular diameters, the sizes of galaxies.

For an angle in degrees without a unit attached, use
[DegreesType](DegreesType.md); for computing, [Radians](Radians.md).
