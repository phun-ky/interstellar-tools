[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SatellitePassInterface

# Interface: SatellitePassInterface

Defined in:
[tracking.ts:153](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L153)

One **pass** of a satellite over an observer: when it rises above the horizon,
when it's highest, and when it sets.

Returned by `predictPasses` in `@interstellar-tools/tracking`.

::: info

- Rise and set are where the elevation crosses the minimum asked for, 0 by
  default: the horizon.
- Azimuths run clockwise from north, as in `LookAnglesInterface`.

:::

## Example

```ts
// A pass of the ISS, low in the south
const pass: SatellitePassInterface = {
  rise: new Date('2026-11-04T16:41:12Z'),
  riseAzimuth: 4.36 as Radians,
  culmination: new Date('2026-11-04T16:45:30Z'),
  culminationAzimuth: 3.31 as Radians,
  maxElevation: 0.29 as Radians,
  set: new Date('2026-11-04T16:49:51Z'),
  setAzimuth: 2.21 as Radians
};
```

## Properties

### culmination

```ts
culmination: Date;
```

Defined in:
[tracking.ts:159](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L159)

When the satellite is highest.

---

### culminationAzimuth

```ts
culminationAzimuth: Radians;
```

Defined in:
[tracking.ts:161](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L161)

Azimuth at culmination in radians, clockwise from north.

---

### maxElevation

```ts
maxElevation: Radians;
```

Defined in:
[tracking.ts:163](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L163)

The highest elevation in radians, at culmination.

---

### rise

```ts
rise: Date;
```

Defined in:
[tracking.ts:155](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L155)

When the satellite rises above the minimum elevation.

---

### riseAzimuth

```ts
riseAzimuth: Radians;
```

Defined in:
[tracking.ts:157](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L157)

Azimuth at rise in radians, clockwise from north.

---

### set

```ts
set: Date;
```

Defined in:
[tracking.ts:165](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L165)

When the satellite sets below the minimum elevation.

---

### setAzimuth

```ts
setAzimuth: Radians;
```

Defined in:
[tracking.ts:167](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L167)

Azimuth at set in radians, clockwise from north.
