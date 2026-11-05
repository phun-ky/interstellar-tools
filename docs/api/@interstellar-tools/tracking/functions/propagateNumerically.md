[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ propagateNumerically

# Function: propagateNumerically()

```ts
function propagateNumerically(
  state: StateVectorInterface,
  from: Date,
  to: Date,
  options?: PropagateNumericallyOptionsInterface
): EphemerisInterface;
```

Defined in:
[satellites/propagate-numerically.ts:172](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/propagate-numerically.ts#L172)

**Propagate a satellite numerically** with a force model: Cowell's method,
stepping the equations of motion with the forces you choose, for the "what if"
questions SGP4 can't answer: a different mass or drag area, higher solar
activity, or a manoeuvre.

$$
\ddot{\mathbf r} = -\frac{\mu}{r^3}\mathbf r
+ \mathbf a_{J_2 \ldots J_6}
+ \mathbf a_{\odot} + \mathbf a_{☾}
- \frac{\rho\,v_{\text{rel}}}{2\beta}\,\mathbf v_{\text{rel}}
+ \mathbf a_{\text{SRP}}
$$

Where:

- $\mu$ is Earth's gravitational parameter and $J_2 \ldots J_6$ its zonal
  harmonics, from EGM2008
- $\mathbf a_\odot, \mathbf a_☾$ are the Sun's and the Moon's tidal pulls, from
  [sunPosition](../../equations/functions/sunPosition.md) and
  [moonPosition](../../equations/functions/moonPosition.md) in
  `@interstellar-tools/equations`
- $\rho$ is the air density, $\beta$ the ballistic coefficient, and $\mathbf
  v_{\text{rel}} = \mathbf v - \boldsymbol\omega_\oplus \times \mathbf r$ the
  velocity through the air, which turns with Earth
- $\mathbf a_{\text{SRP}}$ is sunlight's push, off in Earth's shadow and halved
  in its penumbra

**Units**

- Inputs: `r` in **m** and `v` in **m/s**, on Earth-centred inertial axes with z
  along Earth's axis, such as TEME.
- Output: an ephemeris of samples in **m** and **m/s**, on the same axes.

::: info Notes

- **It isn't a high-fidelity tool** such as GMAT or Orekit: no full gravity
  field, no Earth orientation data, and low-precision Sun and Moon. It answers
  how forces change an orbit over days to months, to within the uncertainty of
  the air density, which is usually the largest.
- **The axes are treated as inertial**: TEME, the frame SGP4 works in, or
  another Earth-centred frame of the date. Over months, the slow turning of
  Earth's axis, precession, adds up to arcminutes.
- **It ends at re-entry**, 100 km up, where the satellite is minutes from coming
  down: the last sample is there.
- The samples come every `step` seconds, from `from` to `to`; interpolate
  between them with [stateAt](stateAt.md), or fit SGP4 elements to them with
  [fitElements](fitElements.md).
- A manoeuvre at the moment of a sample shows in that sample.
- **The air density** is the exponential model's average by default. For solar
  activity, pass `nrlmsise00` from `@interstellar-tools/equations` with forecast
  space weather, as in the example: it gets the point under the satellite, on
  the WGS 84 ellipsoid, and the moment.

:::

## Parameters

| Parameter  | Type                                                                                            | Description                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `state`    | [`StateVectorInterface`](../../types/interfaces/StateVectorInterface.md)                        | The position `r` in **m** and velocity `v` in **m/s** at `from`, Earth-centred and inertial. |
| `from`     | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)       | The moment of the state, as a `Date`.                                                        |
| `to`       | [`Date`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Date)       | The moment to propagate to, as a `Date` after `from`.                                        |
| `options?` | [`PropagateNumericallyOptionsInterface`](../interfaces/PropagateNumericallyOptionsInterface.md) | `step`, the time between samples in **s**; `forces`; `integrator`; and `manoeuvres`.         |

## Returns

[`EphemerisInterface`](../../types/interfaces/EphemerisInterface.md)

An ephemeris centred on `'EARTH'`, in the frame `'TEME'` and the time scale
`'UTC'`, with a sample every `step` seconds.

## Throws

If `r` or `v` is not three finite numbers, a date is not a valid `Date`, or an
option is not a finite number or a function where it should be.

## Throws

If `to` isn't after `from`, a step, coefficient or tolerance is not > 0, or a
manoeuvre is outside the span.

## Examples

```ts
// A 1U CubeSat 400 km up, a week with drag, and a boost on day 3
const from = new Date('2026-11-05T00:00:00Z');
const ephemeris = propagateNumerically(
  propagate(cubesat, from),
  from,
  new Date('2026-11-12T00:00:00Z'),
  {
    step: 600,
    forces: { drag: { ballisticCoefficient: 60 } },
    manoeuvres: [
      {
        epoch: new Date('2026-11-08T00:00:00Z'),
        deltaV: [0, 1, 0],
        frame: 'rtn'
      }
    ]
  }
);

stateAt(ephemeris, new Date('2026-11-10T12:00:00Z')); // { r, v }
```

```ts
// The air at solar minimum, from NRLMSISE-00, instead of the average
const quiet = { f107: 70, f107a: 70, ap: 4 };
const density = ({ phi, lambda, h }, date) =>
  nrlmsise00(date, h, phi, lambda, quiet).effectiveDensity;

propagateNumerically(state, from, to, {
  forces: { drag: { ballisticCoefficient: 60, density } }
});
```

## See

- [propagate](propagate.md)
- [fitElements](fitElements.md)
- [stateAt](stateAt.md)
