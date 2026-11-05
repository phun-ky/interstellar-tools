[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SunPositionInterface

# Interface: SunPositionInterface

Defined in:
[cartography.ts:142](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L142)

The **Sun's position** seen from Earth's centre at a moment: its direction on
the sky and its distance.

Returned by `sunPosition` in `@interstellar-tools/equations`.

::: info

- Geocentric and equatorial, referred to the mean equator and equinox of the
  date. That is close enough to TEME, the frame SGP4 works in, to test a
  satellite for Earth's shadow.
- `declination` is about +23.44° at the June solstice, -23.44° at the December
  solstice and 0 at the equinoxes.

:::

## Example

```ts
// The June solstice: the Sun is at its farthest north
const sun: SunPositionInterface = {
  rightAscension: 1.5708 as Radians,
  declination: 0.4091 as Radians,
  distance: 1.5203e11,
  r: [0, 1.3947e11, 6.047e10]
};
```

## Properties

### declination

```ts
declination: Radians;
```

Defined in:
[cartography.ts:146](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L146)

Declination $\delta$ in radians, north of the celestial equator, in \[-π/2,
π/2].

---

### distance

```ts
distance: number;
```

Defined in:
[cartography.ts:148](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L148)

Distance from Earth's centre in m.

---

### r

```ts
r: Vector3DTupleType;
```

Defined in:
[cartography.ts:150](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L150)

Position in m, from Earth's centre: x toward the vernal equinox, z toward the
north celestial pole.

---

### rightAscension

```ts
rightAscension: Radians;
```

Defined in:
[cartography.ts:144](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L144)

Right ascension $\alpha$ in radians, eastward from the vernal equinox, in \[0,
2π).
