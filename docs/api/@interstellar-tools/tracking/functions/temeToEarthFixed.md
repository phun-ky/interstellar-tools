[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ temeToEarthFixed

# Function: temeToEarthFixed()

```ts
function temeToEarthFixed(
  state: StateVectorInterface,
  date: Date
): StateVectorInterface;
```

Defined in:
[earth-fixed.ts:65](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/earth-fixed.ts#L65)

Turn a position and velocity in **TEME**, the frame SGP4 works in, into
**Earth-fixed** coordinates, by turning them with Earth through Greenwich mean
sidereal time.

$$
\mathbf{r}_{\mathrm{EF}} = R_z(\theta_{\mathrm{GMST}})\,\mathbf{r}_{\mathrm{TEME}},
\qquad
\mathbf{v}_{\mathrm{EF}} = R_z(\theta_{\mathrm{GMST}})\,\mathbf{v}_{\mathrm{TEME}} - \boldsymbol{\omega}_\oplus \times \mathbf{r}_{\mathrm{EF}}
$$

Where:

- $\theta_{\mathrm{GMST}}$ is Greenwich mean sidereal time (rad), from
  `greenwichMeanSiderealTime` in `@interstellar-tools/equations`
- $\boldsymbol{\omega}_\oplus$ is Earth's rotation, $7.292115 \times 10^{-5}$
  rad/s about the z axis

**Units**

- Inputs: `r` in **m**, `v` in **m/s**, and a `Date`.
- Output: `r` in **m**, `v` in **m/s**, Earth-fixed: x through the prime
  meridian, z along the rotation axis.

::: info Notes

- **Polar motion is ignored**: the result is the pseudo Earth-fixed frame (PEF),
  which differs from ITRF, the frame of GPS coordinates, by up to about 15 m at
  the surface as the pole wanders.
- **UT1 is taken as UTC**, as in `greenwichMeanSiderealTime`: up to 0.9 s of
  Earth's rotation, about 400 m on the equator.
- The velocity is relative to the rotating Earth, as a ground station sees it,
  not inertial.

:::

## Parameters

| Parameter | Type                                                                                      | Description                                                                                               |
| --------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `state`   | [`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)                  | The position `r` in **m** and velocity `v` in **m/s** in TEME, as [propagate](propagate.md) returns them. |
| `date`    | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date) | The moment of the position, as a `Date`.                                                                  |

## Returns

[`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)

The Earth-fixed position `r` in **m** and velocity `v` in **m/s**.

## Throws

If `r` or `v` is not three finite numbers, or `date` is not a valid `Date`.

## Example

```ts
const date = new Date('2026-11-04T12:00:00Z');
const { r } = temeToEarthFixed(propagate(iss, date), date);
```

## See

- [subSatellitePoint](subSatellitePoint.md)
- https://celestrak.org/publications/AIAA/2006-6753/ Vallado, Crawford, Hujsak &
  Kelso (2006), Revisiting Spacetrack Report
  [#3](https://github.com/phun-ky/interstellar-tools/issues/3), section on TEME
