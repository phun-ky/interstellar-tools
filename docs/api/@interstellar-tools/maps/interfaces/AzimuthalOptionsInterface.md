[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
AzimuthalOptionsInterface

# Interface: AzimuthalOptionsInterface

Defined in:
[projections/coordinates.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/coordinates.ts#L42)

Where an azimuthal map is centred, for
[lambertAzimuthalEqualArea](../functions/lambertAzimuthalEqualArea.md),
[stereographic](../functions/stereographic.md) and
[orthographic](../functions/orthographic.md).

## Properties

### lambda0?

```ts
lambda0?: Radians;
```

Defined in:
[projections/coordinates.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/coordinates.ts#L44)

Longitude of the map's centre $\lambda_0$, in **radians** (finite). Defaults
to 0.

---

### phi0?

```ts
phi0?: Radians;
```

Defined in:
[projections/coordinates.ts:46](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/coordinates.ts#L46)

Latitude of the map's centre $\varphi_0$, in **radians** (in \[−π/2, π/2]).
Defaults to 0, the equator; ±π/2 gives a polar map.
