[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CelestialDirectionInterface

# Interface: CelestialDirectionInterface

Defined in:
[orbits.ts:109](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L109)

A **direction on the sky**, in the ICRF (the J2000 equator and equinox), in
degrees as catalogues give it: the pole of a reference plane, for example.

## Example

```ts
// Saturn's north pole (Archinal et al. 2018)
const pole: CelestialDirectionInterface = {
  rightAscension: 40.589 as DegreesType,
  declination: 83.537 as DegreesType
};
```

## Properties

### declination

```ts
declination: DegreesType;
```

Defined in:
[orbits.ts:113](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L113)

Declination, north of the equator, in degrees.

---

### rightAscension

```ts
rightAscension: DegreesType;
```

Defined in:
[orbits.ts:111](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L111)

Right ascension, eastwards from the equinox along the equator, in degrees.
