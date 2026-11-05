[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OmmRecordInterface

# Interface: OmmRecordInterface

Defined in:
[tracking.ts:230](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L230)

One **Orbit Mean-elements Message** (OMM) record in JSON, as CelesTrak publishes
it: a satellite's mean elements, with the keywords of the CCSDS standard.

Read by `parseOmm`, and carried by the `SATELLITES` dataset, in
`@interstellar-tools/tracking`.

::: info

- The angles are in degrees and the mean motion in revolutions per day, as in a
  TLE. `parseOmm` turns them into radians and rad/s.
- `MEAN_MOTION_DOT` and `MEAN_MOTION_DDOT` are half the first and a sixth of the
  second derivative of the mean motion, also as in a TLE.
- Space-Track sends the numbers as strings; `parseOmm` reads both.

:::

## Example

```ts
const omm: OmmRecordInterface = {
  OBJECT_NAME: 'ISS (ZARYA)',
  OBJECT_ID: '1998-067A',
  EPOCH: '2026-11-04T21:15:15.204960',
  MEAN_MOTION: 15.49180468,
  ECCENTRICITY: 0.00072122,
  INCLINATION: 51.6327,
  RA_OF_ASC_NODE: 323.8448,
  ARG_OF_PERICENTER: 348.649,
  MEAN_ANOMALY: 11.4335,
  EPHEMERIS_TYPE: 0,
  CLASSIFICATION_TYPE: 'U',
  NORAD_CAT_ID: 25544,
  ELEMENT_SET_NO: 999,
  REV_AT_EPOCH: 59356,
  BSTAR: 0.00010456704,
  MEAN_MOTION_DOT: 0.00005352,
  MEAN_MOTION_DDOT: 0
};
```

## See

https://public.ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages

## Properties

### ARG_OF_PERICENTER

```ts
ARG_OF_PERICENTER: number;
```

Defined in:
[tracking.ts:246](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L246)

Argument of perigee in degrees.

---

### BSTAR

```ts
BSTAR: number;
```

Defined in:
[tracking.ts:260](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L260)

Drag term B\* in inverse Earth radii.

---

### CLASSIFICATION_TYPE?

```ts
CLASSIFICATION_TYPE?: "U" | "C" | "S";
```

Defined in:
[tracking.ts:252](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L252)

Classification: `U` unclassified, `C` classified or `S` secret.

---

### ECCENTRICITY

```ts
ECCENTRICITY: number;
```

Defined in:
[tracking.ts:240](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L240)

Eccentricity.

---

### ELEMENT_SET_NO?

```ts
ELEMENT_SET_NO?: number;
```

Defined in:
[tracking.ts:256](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L256)

Element set number.

---

### EPHEMERIS_TYPE?

```ts
EPHEMERIS_TYPE?: number;
```

Defined in:
[tracking.ts:250](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L250)

Ephemeris type: 0 for SGP4 and SDP4.

---

### EPOCH

```ts
EPOCH: string;
```

Defined in:
[tracking.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L236)

Epoch of the elements, in UTC: `YYYY-MM-DDTHH:MM:SS.ffffff`.

---

### INCLINATION

```ts
INCLINATION: number;
```

Defined in:
[tracking.ts:242](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L242)

Inclination in degrees.

---

### MEAN_ANOMALY

```ts
MEAN_ANOMALY: number;
```

Defined in:
[tracking.ts:248](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L248)

Mean anomaly in degrees.

---

### MEAN_MOTION

```ts
MEAN_MOTION: number;
```

Defined in:
[tracking.ts:238](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L238)

Mean motion in revolutions per day.

---

### MEAN_MOTION_DDOT

```ts
MEAN_MOTION_DDOT: number;
```

Defined in:
[tracking.ts:264](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L264)

A sixth of the second derivative of the mean motion, in revolutions per day³.

---

### MEAN_MOTION_DOT

```ts
MEAN_MOTION_DOT: number;
```

Defined in:
[tracking.ts:262](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L262)

Half the first derivative of the mean motion, in revolutions per day².

---

### NORAD_CAT_ID

```ts
NORAD_CAT_ID: number;
```

Defined in:
[tracking.ts:254](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L254)

NORAD catalogue number.

---

### OBJECT_ID?

```ts
OBJECT_ID?: string;
```

Defined in:
[tracking.ts:234](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L234)

International designator: launch year, launch number and piece, like
`1998-067A`.

---

### OBJECT_NAME?

```ts
OBJECT_NAME?: string;
```

Defined in:
[tracking.ts:232](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L232)

The object's name, as the catalogue gives it.

---

### RA_OF_ASC_NODE

```ts
RA_OF_ASC_NODE: number;
```

Defined in:
[tracking.ts:244](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L244)

Right ascension of the ascending node in degrees.

---

### REV_AT_EPOCH?

```ts
REV_AT_EPOCH?: number;
```

Defined in:
[tracking.ts:258](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/tracking.ts#L258)

Revolution number at the epoch.
