[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
tipOverAngle

# Function: tipOverAngle()

```ts
function tipOverAngle(rFootprint: number, hCoM: number): Radians;
```

Defined in:
[landing/tip-over-angle.ts:59](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/tip-over-angle.ts#L59)

Compute the **tip-over angle** of a lander: the tilt at which its centre of mass
passes over the edge of its footprint.

$$
\theta_\text{tip} = \arctan\frac{r_\text{footprint}}{h_\text{CoM}}
$$

Where:

- $r_\text{footprint}$ is the horizontal distance from the vertical through the
  centre of mass to the edge it would tip over (m)
- $h_\text{CoM}$ is the height of the centre of mass above the ground (m)

**Units**

- Inputs: `rFootprint` and `hCoM` in **m**.
- Output: $\theta_\text{tip}$ in **radians**, in (0, π/2).

::: info Notes

- Tilt the lander past this angle and gravity rolls it over instead of back: a
  wide stance and a low centre of mass make it larger.
- For legs on a circle, the weakest direction is between two legs: with $n$ legs
  at radius $R$, the edge is $R\cos(\pi/n)$ from the centre, so $R/\sqrt2$ for
  four legs and $R/2$ for three.
- A static check. Touchdown speed, leg stroke, friction and a sliding footpad
  all change the real limit; see [isStableLanding](isStableLanding.md).

:::

::: practice Apollo 11, Eagle on the Moon

**40.1°**

_Tipping between two of the lunar module's four legs, with the centre of mass
3.57 m up_

The footpads sat 4.256 m (167.57 in) from the lunar module's axis, so the edge
between two of them was 3.010 m out. At touchdown the centre of mass was 140.7
in above the footpad soles, with the struts unstroked (stations 213.5 and 72.84
in). Eagle came to rest tilted 4.5°, and the postflight simulation put the
rock-up at about 2°: 6.5° in all, against a limit of 40.1°. The gear was
designed for an effective slope of up to 12°. Tipping over a single footpad
would take 50.0°.

```ts
const R = 167.57 * 0.0254; // m, footpad centre from the axis
const h = (213.5 - 72.84) * 0.0254; // m, centre of mass above the soles
tipOverAngle(R * Math.cos(Math.PI / 4), h); // ≈ 40.1°
```

:::

## Parameters

| Parameter    | Type     | Description                                                                                                      |
| ------------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `rFootprint` | `number` | Distance $r_\text{footprint}$ from the centre of mass to the tipping edge, horizontally, in **m** (finite, > 0). |
| `hCoM`       | `number` | Height $h_\text{CoM}$ of the centre of mass above the ground in **m** (finite, > 0).                             |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The tip-over angle $\theta_\text{tip}$ in **radians**.

## Throws

If any input is not a finite number.

## Throws

If any input is `<= 0`.

## Example

```ts
// A stance as wide as the centre of mass is high tips at 45°
tipOverAngle(2, 2); // π/4
```

## See

[isStableLanding](isStableLanding.md)
