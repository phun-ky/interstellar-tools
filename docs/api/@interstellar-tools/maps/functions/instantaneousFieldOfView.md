[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
instantaneousFieldOfView

# Function: instantaneousFieldOfView()

```ts
function instantaneousFieldOfView(
  pixelPitch: number,
  focalLength: number
): Radians;
```

Defined in:
[imaging/instantaneous-field-of-view.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/imaging/instantaneous-field-of-view.ts#L44)

Compute the **instantaneous field of view** of one detector pixel: the angle it
sees.

$$
\text{IFOV} = 2\arctan\frac{p}{2f} \approx \frac{p}{f}
$$

Where:

- $p$ is the pixel pitch, the spacing of the detector's pixels (m)
- $f$ is the camera's effective focal length (m)

**Units**

- Inputs: `pixelPitch` and `focalLength` in **m**.
- Output: IFOV in **radians**.

::: info Notes

- For any real camera $p \ll f$, and the exact form equals $p/f$ to many digits;
  it's used so the result stays right for wide angles too.
- A camera's field of view across its detector is about the IFOV times the
  number of pixels.
- Multiply by the distance for what one pixel covers on the ground:
  [groundSampleDistance](groundSampleDistance.md).

:::

## Parameters

| Parameter     | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `pixelPitch`  | `number` | Pixel pitch $p$ in **m** (finite, > 0).            |
| `focalLength` | `number` | Effective focal length $f$ in **m** (finite, > 0). |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The instantaneous field of view in **radians**.

## Throws

If any input is not a finite number.

## Throws

If any input is `<= 0`.

## Example

```ts
// 7 µm pixels behind a 700 mm lens
instantaneousFieldOfView(7e-6, 0.7); // ≈ 1e-5 rad, 10 µrad
```

## See

- [groundSampleDistance](groundSampleDistance.md)
- [swathWidth](swathWidth.md)
