[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
EquirectangularOptionsInterface

# Interface: EquirectangularOptionsInterface

Defined in:
[projections/equirectangular.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L21)

Options for [equirectangular](../functions/equirectangular.md) and
[inverseEquirectangular](../functions/inverseEquirectangular.md).

## Properties

### lambda0?

```ts
lambda0?: Radians;
```

Defined in:
[projections/equirectangular.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L23)

The central meridian $\lambda_0$, the longitude at the map's centre line, in
**radians** (finite). Defaults to 0.

---

### phi0?

```ts
phi0?: Radians;
```

Defined in:
[projections/equirectangular.ts:25](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L25)

Latitude of the map's origin $\varphi_0$, in **radians** (in \[−π/2, π/2]).
Defaults to 0.

---

### phi1?

```ts
phi1?: Radians;
```

Defined in:
[projections/equirectangular.ts:27](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/projections/equirectangular.ts#L27)

Standard parallel $\varphi_1$, where the scale is true east–west, in **radians**
(in (−π/2, π/2)). Defaults to 0, the equator.
