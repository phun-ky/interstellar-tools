[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
GeodeticCoordinatesInterface

# Interface: GeodeticCoordinatesInterface

Defined in:
[cartography.ts:31](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L31)

A point's **geodetic coordinates** on an oblate body: latitude, longitude and
height above the reference ellipsoid, in SI units and radians.

Returned by `bodyFixedToGeodetic` and taken (as separate arguments) by
`geodeticToBodyFixed` in `@interstellar-tools/equations`.

::: info

- `phi` is the **geodetic** latitude: the angle between the equator and the
  normal to the ellipsoid, the latitude on maps and GPS receivers. It isn't the
  geocentric latitude, the angle seen from the body's centre.
- `h` is measured along that normal, and is negative below the ellipsoid.

:::

## Example

```ts
// Launch Complex 39A, Kennedy Space Center
const pad: GeodeticCoordinatesInterface = {
  phi: 0.49931 as Radians,
  lambda: -1.40681 as Radians,
  h: 0
};
```

## Properties

### h

```ts
h: number;
```

Defined in:
[cartography.ts:37](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L37)

Height above the ellipsoid in metres, along its normal.

---

### lambda

```ts
lambda: Radians;
```

Defined in:
[cartography.ts:35](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L35)

Longitude in radians, east positive, in (-π, π].

---

### phi

```ts
phi: Radians;
```

Defined in:
[cartography.ts:33](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L33)

Geodetic latitude in radians, in \[-π/2, π/2].
