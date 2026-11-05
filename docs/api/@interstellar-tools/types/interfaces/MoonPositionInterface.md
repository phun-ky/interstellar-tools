[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MoonPositionInterface

# Interface: MoonPositionInterface

Defined in:
[cartography.ts:183](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L183)

The **Moon's position** seen from Earth's centre at a moment: its direction on
the sky and its distance.

Returned by `moonPosition` in `@interstellar-tools/equations`.

::: info

- Geocentric and equatorial, referred to the mean equator and equinox of the
  date, like [SunPositionInterface](SunPositionInterface.md): close enough to
  TEME, the frame SGP4 works in, for the Moon's pull on a satellite.
- `declination` swings between about ±18° and ±29° over an 18.6-year cycle, as
  the Moon's orbit, tilted 5.1° to the ecliptic, turns.
- `distance` ranges from about 356 000 km at perigee to 407 000 km at apogee.

:::

## Example

```ts
// The Moon at its mean distance, 45° east of the equinox and 25° north
const moon: MoonPositionInterface = {
  rightAscension: 0.7854 as Radians,
  declination: 0.4363 as Radians,
  distance: 3.844e8,
  r: [2.4635e8, 2.4635e8, 1.6244e8]
};
```

## Properties

### declination

```ts
declination: Radians;
```

Defined in:
[cartography.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L187)

Declination $\delta$ in radians, north of the celestial equator, in \[-π/2,
π/2].

---

### distance

```ts
distance: number;
```

Defined in:
[cartography.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L189)

Distance from Earth's centre in m.

---

### r

```ts
r: Vector3DTupleType;
```

Defined in:
[cartography.ts:191](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L191)

Position in m, from Earth's centre: x toward the vernal equinox, z toward the
north celestial pole.

---

### rightAscension

```ts
rightAscension: Radians;
```

Defined in:
[cartography.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L185)

Right ascension $\alpha$ in radians, eastward from the vernal equinox, in \[0,
2π).
