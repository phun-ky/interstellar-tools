[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ dopplerShift

# Function: dopplerShift()

```ts
function dopplerShift(frequency: number, rangeRate: number): number;
```

Defined in:
[look-angles.ts:223](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/look-angles.ts#L223)

The **Doppler shift** of a radio signal from a satellite: how far the received
frequency is from the transmitted one, as the satellite approaches or leaves.

$$
\Delta f = -f\,\frac{\dot\rho}{c}
$$

Where:

- $f$ is the transmitted frequency (Hz)
- $\dot\rho$ is the range rate (m/s), from [lookAngles](lookAngles.md)
- $c$ is the speed of light, 299 792 458 m/s

**Units**

- Inputs: `frequency` in **Hz**, `rangeRate` in **m/s**.
- Output: $\Delta f$ in **Hz**: positive while the satellite approaches.

::: info Notes

- First order in $\dot\rho / c$: relativistic terms are below a millihertz for
  satellites in Earth orbit.
- A ground station tunes to $f + \Delta f$ to receive a downlink, and transmits
  on $f - \Delta f$ for the satellite to hear an uplink on $f$.

:::

::: practice ISS, amateur radio downlink

**+3.4 kHz**

_145.800 MHz, the ISS approaching at 7 km/s at the start of a low pass_

The shift sweeps through 0 at the closest approach to -3.4 kHz as it leaves:
radio operators retune through the pass.

```ts
dopplerShift(145_800_000, -7000); // ≈ 3 404 Hz
```

:::

## Parameters

| Parameter   | Type     | Description                                                   |
| ----------- | -------- | ------------------------------------------------------------- |
| `frequency` | `number` | Transmitted frequency $f$ in **Hz** (finite, > 0).            |
| `rangeRate` | `number` | Range rate $\dot\rho$ in **m/s** (finite, slower than light). |

## Returns

`number`

The Doppler shift $\Delta f$ in **Hz**.

## Throws

If an input is not a finite number.

## Throws

If `frequency <= 0`, or `rangeRate` is as fast as light or faster.

## Example

```ts
dopplerShift(437_000_000, 5000); // ≈ -7 288 Hz: a UHF signal from a leaving satellite
```

## See

[lookAngles](lookAngles.md)
