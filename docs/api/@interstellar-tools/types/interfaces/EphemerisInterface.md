[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
EphemerisInterface

# Interface: EphemerisInterface

Defined in:
[tracking.ts:377](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L377)

An **ephemeris**: a table of a spacecraft's position and velocity over time, as
JPL Horizons and the CCSDS Orbit Ephemeris Message (OEM) publish them. It's how
deep-space probes, which have no TLEs, are tracked.

Returned by `parseOem` and `parseHorizonsVectors`, and interpolated by
`stateAt`, in `@interstellar-tools/tracking`.

::: info

- The epochs are UTC `Date`s, converted from the file's time scale, which
  `timeScale` keeps.
- Positions and velocities are in m and m/s, whatever the file's units.
- `center` and `frame` are as the file names them, such as `'SUN'` and `'ICRF'`:
  positions from different centres or frames don't mix.

:::

## Example

```ts
const ephemeris: EphemerisInterface = {
  objectName: 'Voyager 1',
  objectId: '1977-084A',
  center: 'SUN',
  frame: 'ICRF',
  timeScale: 'TDB',
  samples: [sample, nextSample]
};
```

## Properties

### center

```ts
center: string;
```

Defined in:
[tracking.ts:383](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L383)

The body the positions are measured from, as the file names it: `'EARTH'`,
`'SUN'`.

---

### frame

```ts
frame: string;
```

Defined in:
[tracking.ts:385](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L385)

The reference frame, as the file names it: `'ICRF'`, `'EME2000'`.

---

### objectId?

```ts
objectId?: string;
```

Defined in:
[tracking.ts:381](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L381)

The spacecraft's id, such as its international designator, if the file gives
one.

---

### objectName?

```ts
objectName?: string;
```

Defined in:
[tracking.ts:379](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L379)

The spacecraft's name, if the file gives one.

---

### samples

```ts
samples: readonly EphemerisSampleInterface[];
```

Defined in:
[tracking.ts:389](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L389)

The samples, in time order.

---

### timeScale

```ts
timeScale: TimeScaleType;
```

Defined in:
[tracking.ts:387](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L387)

The time scale of the file's epochs.
