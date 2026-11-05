[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ lookAnglesFromEarthFixed

# Function: lookAnglesFromEarthFixed()

```ts
function lookAnglesFromEarthFixed(
  state: StateVectorInterface,
  observer: GeodeticCoordinatesInterface
): LookAnglesInterface;
```

Defined in:
[satellites/look-angles.ts:78](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/look-angles.ts#L78)

The **look angles** to a satellite from an observer, given the satellite's
Earth-fixed position and velocity: azimuth, elevation, range and range rate.
[lookAngles](lookAngles.md) does the same from orbital elements.

The line of sight $\boldsymbol{\rho} = \mathbf{r} - \mathbf{r}_{\mathrm{obs}}$
is turned into the observer's east-north-up frame:

$$
\begin{aligned}
\rho_E &= -\sin\lambda\,\rho_x + \cos\lambda\,\rho_y \\
\rho_N &= -\sin\varphi\cos\lambda\,\rho_x - \sin\varphi\sin\lambda\,\rho_y + \cos\varphi\,\rho_z \\
\rho_U &= \cos\varphi\cos\lambda\,\rho_x + \cos\varphi\sin\lambda\,\rho_y + \sin\varphi\,\rho_z
\end{aligned}
$$

and then

$$
A = \operatorname{atan2}(\rho_E, \rho_N), \qquad
E = \operatorname{atan2}\!\left(\rho_U, \sqrt{\rho_E^2 + \rho_N^2}\right), \qquad
\dot\rho = \frac{\boldsymbol{\rho}\cdot\mathbf{v}}{\lVert\boldsymbol{\rho}\rVert}
$$

Where:

- $\varphi$, $\lambda$ are the observer's geodetic latitude and longitude (rad)
- $\mathbf{r}$, $\mathbf{v}$ are the satellite's Earth-fixed position (m) and
  velocity (m/s)
- $\mathbf{r}_{\mathrm{obs}}$ is the observer's Earth-fixed position on WGS 84
  (m)

**Units**

- Inputs: `r` in **m**, `v` in **m/s**, Earth-fixed as
  [temeToEarthFixed](temeToEarthFixed.md) returns them; the observer's `phi` and
  `lambda` in **radians** and `h` in **m**.
- Output: `azimuth` and `elevation` in **radians**, `range` in **m**,
  `rangeRate` in **m/s**.

::: info Notes

- The elevation is geometric: refraction lifts objects near the horizon by about
  half a degree, which this leaves out.
- The observer turns with Earth, so `v` must be the Earth-fixed velocity,
  relative to the ground, not the inertial one.

:::

## Parameters

| Parameter  | Type                                                                                     | Description                                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `state`    | [`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)                 | The satellite's Earth-fixed position `r` in **m** and velocity `v` in **m/s**.                                                    |
| `observer` | [`GeodeticCoordinatesInterface`](../../types/interfaces/GeodeticCoordinatesInterface.md) | The observer's geodetic latitude `phi` and longitude `lambda` in **radians**, and height `h` above the WGS 84 ellipsoid in **m**. |

## Returns

[`LookAnglesInterface`](../../types/interfaces/LookAnglesInterface.md)

The azimuth, elevation, range and range rate: see
[LookAnglesInterface](../../types/interfaces/LookAnglesInterface.md).

## Throws

If `r` or `v` is not three finite numbers, or the observer's coordinates aren't
finite.

## Throws

If the observer's `phi` is outside \[-π/2, π/2], or the satellite is at the
observer.

## Example

```ts
const oslo = { phi: toRad(59.91), lambda: toRad(10.75), h: 20 };
const date = new Date('2026-11-04T12:00:00Z');
const state = temeToEarthFixed(propagate(iss, date), date);

lookAnglesFromEarthFixed(state, oslo); // { azimuth, elevation, range, rangeRate }
```

## See

[lookAngles](lookAngles.md)
