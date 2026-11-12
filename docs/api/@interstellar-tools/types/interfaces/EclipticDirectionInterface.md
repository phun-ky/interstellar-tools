[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EclipticDirectionInterface

# Interface: EclipticDirectionInterface

Defined in:
[orbits.ts:131](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L131)

A **direction in ecliptic coordinates**, against the J2000 ecliptic and equinox,
in degrees: how a small body's spin pole or the interstellar wind's direction is
often given.

## Example

```ts
// Where the interstellar wind comes from (McComas et al. 2015)
const upwind: EclipticDirectionInterface = {
  eclipticLongitude: 255.7 as DegreesType,
  eclipticLatitude: 5.1 as DegreesType
};
```

## Properties

### eclipticLatitude

```ts
eclipticLatitude: DegreesType;
```

Defined in:
[orbits.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L135)

Ecliptic latitude, north of the ecliptic, in degrees.

---

### eclipticLongitude

```ts
eclipticLongitude: DegreesType;
```

Defined in:
[orbits.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L133)

Ecliptic longitude, eastwards from the equinox along the ecliptic, in degrees.
