[Documentation](../../../index.md) / [@interstellar-tools/temporal](../index.md)
/ julianDate

# Function: julianDate()

```ts
function julianDate(date: Date, scale?: TimeScaleType): number;
```

Defined in:
[time-scales.ts:130](https://github.com/phun-ky/interstellar-tools/blob/main/packages/temporal/src/time-scales.ts#L130)

The **Julian date** of a moment, in a time scale: the number of days since noon
on 1 January 4713 BC, counted on that scale's clock.

$$
\mathrm{JD} = \frac{t_{\mathrm{Unix}} + \Delta}{86\,400\,000} + 2\,440\,587.5
$$

Where:

- $t_{\mathrm{Unix}}$ is the `Date`'s milliseconds since 1970-01-01T00:00:00Z
  (ms)
- $\Delta$ is the scale's lead over UTC: 0 for UTC and UT1, TAI − UTC for TAI,
  and TAI − UTC + 32.184 s for TT (ms)

::: info Notes

- **UT1 is taken as UTC.** They differ by up to 0.9 s; the exact difference is
  measured and published by the IERS, and the library fetches nothing.
- A Julian date as a double is precise to about 40 µs today.
- UTC Julian dates step over leap seconds, like the `Date` itself: the
  difference between two of them in days can be 1 s short. Take differences in
  TAI or TT.

:::

## Parameters

| Parameter | Type                                                                                      | Default value | Description                                                          |
| --------- | ----------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------- |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | `undefined`   | The moment, as a UTC `Date` (on or after 1972-01-01 for TAI and TT). |
| `scale?`  | [`TimeScaleType`](../../types/type-aliases/TimeScaleType.md)                              | `'UTC'`       | The time scale to count in. Defaults to `UTC`.                       |

## Returns

`number`

The Julian date in **days**.

## Throws

If `date` is not a valid `Date`.

## Throws

If `scale` is not a [TimeScaleType](../../types/type-aliases/TimeScaleType.md),
or `date` is before 1972-01-01 for TAI and TT.

## Example

```ts
import { J2000_UTC } from '@interstellar-tools/constants';

julianDate(J2000_UTC, 'TT'); // 2451545: J2000 is JD 2451545.0 TT
julianDate(J2000_UTC); // 2451544.999257: 64.184 s earlier on the UTC clock
```
