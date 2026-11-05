[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ formatOmm

# Function: formatOmm()

```ts
function formatOmm(elements: MeanElementsInterface): OmmRecordInterface;
```

Defined in:
[satellites/omm.ts:236](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/omm.ts#L236)

Write mean elements as an **Orbit Mean-elements Message** (OMM) record, in the
JSON form CelesTrak publishes: the reverse of [parseOmm](parseOmm.md). Unlike a
TLE, it keeps every digit, and has room for any catalogue number.

::: info Notes

- `EPOCH` is in UTC, with six decimals of the second and no trailing `Z`, as
  CelesTrak writes it. It comes from `epochJulianDate`, which holds the epoch to
  about 40 µs, so the last digit or two can differ from a published OMM's.
- `JSON.stringify` the record for the text, or put several in an array for a
  file of them, as CelesTrak serves them.
- `OBJECT_NAME` and `OBJECT_ID` are left out when the elements have none.

:::

## Parameters

| Parameter  | Type                                                                       | Description                                                                                                |
| ---------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `elements` | [`MeanElementsInterface`](../../types/interfaces/MeanElementsInterface.md) | The mean elements, from [parseTle](parseTle.md), [parseOmm](parseOmm.md) or [fitElements](fitElements.md). |

## Returns

[`OmmRecordInterface`](../../types/interfaces/OmmRecordInterface.md)

One OMM record, with the keywords CelesTrak uses, in its order.

## Throws

If a value of `elements` is not a finite number.

## Example

```ts
const omm = formatOmm(iss);

omm.EPOCH; // '2026-11-04T08:52:07.404092'
JSON.stringify([omm]); // a file of one record
```

## See

- [parseOmm](parseOmm.md)
- [formatTle](formatTle.md)
- https://celestrak.org/NORAD/documentation/gp-data-formats.php CelesTrak, "A
  new way to obtain GP data"
