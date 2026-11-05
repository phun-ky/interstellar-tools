[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LookAnglesInterface

# Interface: LookAnglesInterface

Defined in:
[tracking.ts:115](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L115)

Where a satellite is in an observer's sky: the direction to point an antenna or
a camera, how far away it is and how fast that distance changes.

Returned by `lookAngles` in `@interstellar-tools/tracking`.

::: info

- `azimuth` runs clockwise from north: 0 north, π/2 east, π south, 3π/2 west.
- `elevation` is above the plane tangent to the WGS 84 ellipsoid at the
  observer: 0 on that horizon, π/2 straight overhead, negative below it.
- `rangeRate` is negative while the satellite approaches, as during the first
  half of a pass, and positive as it leaves.

:::

## Example

```ts
// The ISS low in the south-west, approaching
const angles: LookAnglesInterface = {
  azimuth: 3.93 as Radians,
  elevation: 0.17 as Radians,
  range: 1_420_000,
  rangeRate: -5_900
};
```

## Properties

### azimuth

```ts
azimuth: Radians;
```

Defined in:
[tracking.ts:117](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L117)

Azimuth in radians, clockwise from north, in \[0, 2π).

---

### elevation

```ts
elevation: Radians;
```

Defined in:
[tracking.ts:119](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L119)

Elevation above the observer's horizon in radians, in \[-π/2, π/2].

---

### range

```ts
range: number;
```

Defined in:
[tracking.ts:121](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L121)

Distance from the observer in m.

---

### rangeRate

```ts
rangeRate: number;
```

Defined in:
[tracking.ts:123](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L123)

Rate of change of the distance in m/s: negative approaching, positive leaving.
