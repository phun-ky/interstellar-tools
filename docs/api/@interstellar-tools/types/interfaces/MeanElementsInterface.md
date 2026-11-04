[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MeanElementsInterface

# Interface: MeanElementsInterface

Defined in:
[tracking.ts:48](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L48)

A satellite's **mean elements**, as published in a two-line element set (TLE) or
an Orbit Mean-elements Message (OMM): the orbit SGP4 was fitted to at an epoch,
with the drag terms it needs.

Returned by `parseTle` and `parseOmm` in `@interstellar-tools/tracking`.

::: info

- **These aren't osculating elements.** They're averaged the way SGP4 averages
  them, and only give correct positions through SGP4: Kepler's equations on them
  are off by kilometres.
- The angles are in radians and the mean motion in rad/s, like the rest of the
  library. TLEs and OMMs carry degrees and revolutions per day.
- TLEs and OMMs carry half the first derivative of the mean motion and a sixth
  of the second; `meanMotionDot` and `meanMotionDdot` are the derivatives
  themselves. SGP4 doesn't use them.

:::

## Example

```ts
// The ISS on 2026-11-04
const iss: MeanElementsInterface = {
  name: 'ISS (ZARYA)',
  objectId: '1998-067A',
  catalogNumber: 25544,
  classification: 'U',
  epoch: new Date('2026-11-04T08:52:07.404Z'),
  epochJulianDate: 2461348.86953014,
  meanMotion: 0.0011266,
  meanMotionDot: 8.8e-14,
  meanMotionDdot: 0,
  e: 0.0007186,
  i: 0.9012 as Radians,
  raan: 5.6967 as Radians,
  argp: 6.0519 as Radians,
  meanAnomaly: 0.2327 as Radians,
  bstar: 0.00010236,
  elementSetNumber: 999,
  revolutionNumber: 59348
};
```

## Properties

### argp

```ts
argp: Radians;
```

Defined in:
[tracking.ts:74](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L74)

Argument of perigee (ω) in radians, in \[0, 2π].

---

### bstar

```ts
bstar: number;
```

Defined in:
[tracking.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L78)

SGP4's drag term $B^*$, in inverse Earth radii (1/R⊕).

---

### catalogNumber

```ts
catalogNumber: number;
```

Defined in:
[tracking.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L54)

The NORAD catalogue number.

---

### classification

```ts
classification: 'U' | 'C' | 'S';
```

Defined in:
[tracking.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L56)

The security classification: `U` unclassified, `C` classified or `S` secret.
Public element sets are `U`.

---

### e

```ts
e: number;
```

Defined in:
[tracking.ts:68](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L68)

Eccentricity, in \[0, 1).

---

### elementSetNumber

```ts
elementSetNumber: number;
```

Defined in:
[tracking.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L80)

The element set number, counted up by the publisher for each new set.

---

### epoch

```ts
epoch: Date;
```

Defined in:
[tracking.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L58)

The epoch the elements hold at, in UTC, to the millisecond.

---

### epochJulianDate

```ts
epochJulianDate: number;
```

Defined in:
[tracking.ts:60](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L60)

The epoch as a Julian date in UTC (d), to about 40 µs: finer than `epoch`.

---

### i

```ts
i: Radians;
```

Defined in:
[tracking.ts:70](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L70)

Inclination in radians, in \[0, π].

---

### meanAnomaly

```ts
meanAnomaly: Radians;
```

Defined in:
[tracking.ts:76](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L76)

Mean anomaly (M) in radians, in \[0, 2π].

---

### meanMotion

```ts
meanMotion: number;
```

Defined in:
[tracking.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L62)

Mean motion $n$ in rad/s.

---

### meanMotionDdot

```ts
meanMotionDdot: number;
```

Defined in:
[tracking.ts:66](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L66)

Second time derivative of the mean motion $\ddot{n}$ in rad/s³.

---

### meanMotionDot

```ts
meanMotionDot: number;
```

Defined in:
[tracking.ts:64](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L64)

First time derivative of the mean motion $\dot{n}$ in rad/s².

---

### name?

```ts
name?: string;
```

Defined in:
[tracking.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L50)

The satellite's name, such as `ISS (ZARYA)`. Omitted when not given.

---

### objectId?

```ts
objectId?: string;
```

Defined in:
[tracking.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L52)

The international designator (COSPAR ID), such as `1998-067A`: launch year,
launch number and piece. Omitted when blank.

---

### raan

```ts
raan: Radians;
```

Defined in:
[tracking.ts:72](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L72)

Right ascension of the ascending node (Ω) in radians, in \[0, 2π].

---

### revolutionNumber

```ts
revolutionNumber: number;
```

Defined in:
[tracking.ts:82](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L82)

The number of revolutions at the epoch. TLEs only hold five digits: it wraps at
100 000.
