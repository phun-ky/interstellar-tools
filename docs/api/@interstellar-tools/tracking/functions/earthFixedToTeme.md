[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ earthFixedToTeme

# Function: earthFixedToTeme()

```ts
function earthFixedToTeme(
  state: StateVectorInterface,
  date: Date
): StateVectorInterface;
```

Defined in:
[satellites/earth-fixed.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/earth-fixed.ts#L137)

Turn an **Earth-fixed** position and velocity, such as a GPS receiver's fix,
into **TEME**, the frame SGP4 works in: the reverse of
[temeToEarthFixed](temeToEarthFixed.md). It's the first step in fitting elements
to GPS fixes with [fitElements](fitElements.md).

$$
\mathbf{r}_{\mathrm{TEME}} = R_z(-\theta_{\mathrm{GMST}})\,\mathbf{r}_{\mathrm{EF}},
\qquad
\mathbf{v}_{\mathrm{TEME}} = R_z(-\theta_{\mathrm{GMST}})\,(\mathbf{v}_{\mathrm{EF}} + \boldsymbol{\omega}_\oplus \times \mathbf{r}_{\mathrm{EF}})
$$

**Units**

- Inputs: `r` in **m**, `v` in **m/s**, Earth-fixed, and a `Date`.
- Output: `r` in **m**, `v` in **m/s**, in TEME.

::: info Notes

- As in [temeToEarthFixed](temeToEarthFixed.md), polar motion is ignored and UT1
  is taken as UTC: GPS positions are in ITRF, which this treats as the pseudo
  Earth-fixed frame. The difference, tens to hundreds of metres, is well inside
  SGP4's own error.
- The velocity is the one relative to the rotating Earth, as GPS receivers give
  it.
- GPS receivers usually time-tag fixes in GPS time, 18 s ahead of UTC since
  2017: convert the time to UTC first, or the position lands 140 km along the
  orbit from where it was.

:::

## Parameters

| Parameter | Type                                                                                      | Description                                                        |
| --------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `state`   | [`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)                  | The Earth-fixed position `r` in **m** and velocity `v` in **m/s**. |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment of the position, as a UTC `Date`.                       |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The position `r` in **m** and velocity `v` in **m/s** in TEME.

## Throws

If `r` or `v` is not three finite numbers, or `date` is not a valid `Date`.

## Example

```ts
const date = new Date('2026-11-04T12:00:00Z');
const fix = { r: [4_190_000, -3_870_000, 3_960_000], v: [2_480, 5_560, 2_810] };

earthFixedToTeme(fix, date); // { r: [...], v: [...] }, in TEME
```

## See

- [temeToEarthFixed](temeToEarthFixed.md)
- [fitElements](fitElements.md)
