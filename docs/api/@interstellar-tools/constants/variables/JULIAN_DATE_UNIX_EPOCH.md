[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / JULIAN_DATE_UNIX_EPOCH

# Variable: JULIAN_DATE_UNIX_EPOCH

```ts
const JULIAN_DATE_UNIX_EPOCH: 2440587.5;
```

Defined in:
[date.ts:139](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/date.ts#L139)

The **Julian date of the Unix epoch**, 1970-01-01T00:00:00Z:
**[`2440587`](https://github.com/phun-ky/interstellar-tools/commit/2440587).5**.
A Julian date counts days from noon on 1 January 4713 BC, so whole days start at
noon.

## Example

```ts
// Julian date (UTC) of a JavaScript Date
const jd = date.getTime() / MILLISECONDS_PER_DAY + JULIAN_DATE_UNIX_EPOCH;
```
