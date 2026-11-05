[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ parseOmm

# Function: parseOmm()

```ts
function parseOmm(omm: string | object): MeanElementsInterface;
```

Defined in:
[satellites/omm.ts:96](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/omm.ts#L96)

Parse an **Orbit Mean-elements Message** (OMM) in JSON: the CCSDS format
CelesTrak and Space-Track publish SGP4 elements in, next to TLEs. Unlike a TLE,
it has room for catalogue numbers above 339 999.

```json
{
  "OBJECT_NAME": "ISS (ZARYA)",
  "OBJECT_ID": "1998-067A",
  "EPOCH": "2026-11-04T08:52:07.404096",
  "MEAN_MOTION": 15.49173979,
  "ECCENTRICITY": 0.0007186,
  "INCLINATION": 51.6329,
  "RA_OF_ASC_NODE": 326.3987,
  "ARG_OF_PERICENTER": 346.7494,
  "MEAN_ANOMALY": 13.3304,
  "EPHEMERIS_TYPE": 0,
  "CLASSIFICATION_TYPE": "U",
  "NORAD_CAT_ID": 25544,
  "ELEMENT_SET_NO": 999,
  "REV_AT_EPOCH": 59348,
  "BSTAR": 0.00010236,
  "MEAN_MOTION_DOT": 5.228e-5,
  "MEAN_MOTION_DDOT": 0
}
```

::: info Notes

- **One record at a time.** CelesTrak and Space-Track return an array of
  records: parse it, then pass each one, as in the example.
- Numbers can be JSON numbers, as CelesTrak gives them, or strings, as
  Space-Track does.
- `EPOCH` is in UTC, with or without a trailing `Z`. `epochJulianDate` keeps all
  its decimals; `epoch`, a `Date`, rounds to the millisecond.
- `ELEMENT_SET_NO` and `REV_AT_EPOCH` are 0 when missing, and
  `CLASSIFICATION_TYPE` is `U`. Everything else SGP4 needs is required.
- The XML and key-value forms of OMM aren't read.

:::

## Parameters

| Parameter | Type     | Description |
| --------- | -------- | ----------- |
| `omm`     | `string` | `object`    | One OMM record: an object, or its JSON text. |

## Returns

[`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md)

The mean elements, in radians and rad/s: see
[MeanElementsInterface](../../types/interfaces/MeanElementsInterface.md).

## Throws

If `omm` is text that isn't valid JSON.

## Throws

If `omm` isn't one record, or a required value is missing or not a number.

## Throws

If `EPOCH` isn't a valid date and time, `CLASSIFICATION_TYPE` isn't U, C or S,
or a value is out of range; the message names the keyword.

## Example

```ts
const response = await fetch(
  'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=JSON'
);
const [iss] = (await response.json()).map(parseOmm);

iss.objectId; // '1998-067A'
```

## See

- [parseTle](parseTle.md)
- https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak, "A
  new way to obtain GP data"
- https://ccsds.org/Pubs/502x0b3e1.pdf CCSDS 502.0-B-3, Orbit Data Messages
