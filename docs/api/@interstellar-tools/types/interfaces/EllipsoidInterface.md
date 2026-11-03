[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EllipsoidInterface

# Interface: EllipsoidInterface

Defined in:
[cartography.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L68)

A body's **reference ellipsoid**: the smooth surface that latitudes, longitudes
and heights are measured on.

Most planets and large moons are close to an oblate spheroid, flattened at the
poles: `equatorialRadius` and `polarRadius` describe it. A few moons are
stretched towards their planet too, a triaxial ellipsoid: `equatorialRadius` is
then the radius towards the planet, and `alongOrbitRadius` the equatorial radius
along the orbit.

::: info

- For the giant planets, the radii are at the 1-bar pressure level.
- Get the flattening and eccentricity from the radii with
  `flatteningOblateSpheroid` and `eccentricitySquaredOblateSpheroid` in
  `@interstellar-tools/equations`.

:::

## Example

```ts
const mars: EllipsoidInterface = {
  equatorialRadius: { value: 3396.19, unit: 'km' },
  polarRadius: { value: 3376.2, unit: 'km' }
};
```

## Properties

### alongOrbitRadius?

```ts
alongOrbitRadius?: DistanceInterface;
```

Defined in:
[cartography.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L74)

Equatorial radius $b$ along the orbit, for a triaxial moon. Omitted when equal
to `equatorialRadius`.

---

### equatorialRadius

```ts
equatorialRadius: DistanceInterface;
```

Defined in:
[cartography.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L70)

Equatorial radius $a$; towards the planet, for a triaxial moon.

---

### polarRadius

```ts
polarRadius: DistanceInterface;
```

Defined in:
[cartography.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L72)

Polar radius $c$, along the rotation axis.
