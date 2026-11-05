[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) /
solarRadiationPressureAcceleration

# Function: solarRadiationPressureAcceleration()

```ts
function solarRadiationPressureAcceleration(
  r: Vector3DTupleType,
  rSun: Vector3DTupleType,
  Cr: number,
  areaToMass: number,
  illumination?: number
): Vector3DTupleType;
```

Defined in:
[orbits/solar-radiation-pressure-acceleration.ts:80](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/solar-radiation-pressure-acceleration.ts#L80)

The push of **sunlight** on a spacecraft: solar radiation pressure. Light
carries momentum, and a spacecraft that absorbs or reflects it is pushed away
from the Sun, gently but without pause.

$$
\mathbf a = \nu\,P_\odot\,C_R\,\frac{A}{m}\left(\frac{1\ \text{au}}{d}\right)^2 \hat{\mathbf d},
\qquad \mathbf d = \mathbf r - \mathbf s, \qquad P_\odot = \frac{1361\ \text{W/m}^2}{c} \approx 4.54\ \mu\text{Pa}
$$

Where:

- $\mathbf r$ is the spacecraft's position and $\mathbf s$ the Sun's, from the
  same origin (m)
- $\hat{\mathbf d}$ is the direction from the Sun to the spacecraft, and $d$ the
  distance (m)
- $P_\odot$ is the pressure of sunlight at 1 au, from the IAU's nominal solar
  irradiance
- $C_R$ is the reflectivity coefficient: 1 for a black body that absorbs all the
  light, up to 2 for a mirror facing the Sun
- $A/m$ is the area facing the Sun per unit mass (m²/kg)
- $\nu$ is the fraction of the Sun's disc in view: 1 in sunlight, 0 in a
  planet's shadow

**Units**

- Inputs: positions in **m**, `areaToMass` in **m²/kg**.
- Output: the acceleration in **m/s²**.

::: info Notes

- **A cannonball model**: the force is along the line from the Sun, as for a
  sphere. A flat panel at an angle is also pushed sideways; a spacecraft's
  attitude matters for precise orbits.
- In low orbit it's small next to air drag, but the air thins faster than the
  light: above about 650 km, depending on solar activity, the light pushes
  harder.
- Light reflected and emitted by Earth pushes too, by a fraction as much in low
  orbit; it isn't included.
- Take $\nu$ from a shadow model, such as `earthShadow` in
  `@interstellar-tools/tracking`.

:::

::: practice A 1U CubeSat in sunlight

**3.4 × 10⁻⁸ m/s²**

_1.33 kg, 10 cm by 10 cm, black: $C_R$ = 1_

A fiftieth of the drag on it at 400 km, with the average atmosphere; above about
650 km, more than the drag.

```ts
const sun = sunPosition(new Date('2026-03-20T12:00:00Z')).r;
const a = solarRadiationPressureAcceleration(
  [6_778_137, 0, 0],
  sun,
  1,
  0.01 / 1.33
);

Math.hypot(...a); // ≈ 3.4e-8 m/s², away from the Sun
```

:::

## Parameters

| Parameter       | Type                                                                 | Default value | Description                                                                                           |
| --------------- | -------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `r`             | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | The spacecraft's position $\mathbf r$ in **m** (finite).                                              |
| `rSun`          | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | `undefined`   | The Sun's position $\mathbf s$ in **m**, from the same origin, on the same axes (finite, not at `r`). |
| `Cr`            | `number`                                                             | `undefined`   | Reflectivity coefficient $C_R$ (finite, >= 0).                                                        |
| `areaToMass`    | `number`                                                             | `undefined`   | Area facing the Sun per unit mass $A/m$ in **m²/kg** (finite, >= 0).                                  |
| `illumination?` | `number`                                                             | `1`           | Fraction of the Sun in view $\nu$, from 0 in shadow to 1 in sunlight (finite). Defaults to 1.         |

## Returns

[`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md)

The acceleration in **m/s²**, pointing away from the Sun.

## Throws

If a position is not three finite numbers, or a number is not finite.

## Throws

If `rSun` is at `r`, `Cr` or `areaToMass` is < 0, or `illumination` is outside
\[0, 1].

## Example

```ts
// A sail of 32 m² per kg, like IKAROS, square on to the Sun at 1 au
solarRadiationPressureAcceleration([AU_METERS, 0, 0], [0, 0, 0], 2, 32);
// ≈ [2.9e-4, 0, 0]: 25 m/s a day
```

## See

- [sunPosition](sunPosition.md)
- [atmosphericDragAcceleration](atmosphericDragAcceleration.md)
- https://arxiv.org/abs/1510.07674 Mamajek et al. (2015), IAU 2015 Resolution B3
  on the nominal solar values
