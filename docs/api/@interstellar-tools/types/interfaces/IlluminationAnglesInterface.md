[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
IlluminationAnglesInterface

# Interface: IlluminationAnglesInterface

Defined in:
[cartography.ts:104](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L104)

The **illumination angles** at a point on a surface: where the light comes from
and where it's seen from, relative to the surface and each other.

Returned by `illuminationAngles` in `@interstellar-tools/maps`.

::: info

- `incidence` is 0 with the Sun straight overhead and π/2 at sunrise or sunset;
  past π/2 the point is in its own shadow.
- `emission` is 0 looking straight down, π/2 at the observer's horizon.
- `phase` is 0 with the Sun directly behind the observer, where the surface
  looks brightest and shadows vanish.

:::

## Example

```ts
// Sun 30° from overhead, seen from straight above
const angles: IlluminationAnglesInterface = {
  incidence: (Math.PI / 6) as Radians,
  emission: 0 as Radians,
  phase: (Math.PI / 6) as Radians
};
```

## Properties

### emission

```ts
emission: Radians;
```

Defined in:
[cartography.ts:108](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L108)

Emission angle $e$, between the surface normal and the direction to the
observer, in radians.

---

### incidence

```ts
incidence: Radians;
```

Defined in:
[cartography.ts:106](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L106)

Incidence angle $i$, between the surface normal and the direction to the Sun, in
radians.

---

### phase

```ts
phase: Radians;
```

Defined in:
[cartography.ts:110](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/cartography.ts#L110)

Phase angle $g$, between the directions to the Sun and to the observer, in
radians.
