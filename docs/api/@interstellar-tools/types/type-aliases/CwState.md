[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
CwState

# Type Alias: CwState

```ts
type CwState = readonly [number, number, number, number, number, number];
```

Defined in:
[orbits.ts:37](https://github.com/phun-ky/interstellar-tools/blob/08c86c0d17e8945b4ff7b3559c6fe5852df4925c/packages/types/src/orbits.ts#L37)

Clohessy–Wiltshire / Hill relative-motion **state vector** in the LVLH frame.

Axes (LVLH / RSW-style):

- `x` — **radial** (outward from the central body / reference orbit radius)
- `y` — **along-track** / tangential (direction of motion of the reference
  orbit)
- `z` — **cross-track** (completes right-handed frame, roughly orbit-normal)

Components:

- `x`, `y`, `z` are relative position components.
- `xDot`, `yDot`, `zDot` are relative velocity components (time derivatives).

Units:

- Positions in meters or kilometers (choose one and stay consistent).
- Velocities in m/s or km/s accordingly.

This tuple is commonly used as the state for integrating the CW/Hill ODEs.

## Example

```ts
const s: CwState = [
  100, // x (m)
  0, // y (m)
  0, // z (m)
  0, // xDot (m/s)
  0.01, // yDot (m/s)
  0 // zDot (m/s)
];
```
