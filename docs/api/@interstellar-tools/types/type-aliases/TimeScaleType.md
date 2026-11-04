[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
TimeScaleType

# Type Alias: TimeScaleType

```ts
type TimeScaleType = 'UTC' | 'TAI' | 'TT' | 'UT1';
```

Defined in:
[temporal.ts:175](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/temporal.ts#L175)

A **time scale**: the clock a moment is read on.

- `UTC`: Coordinated Universal Time, the civil clock, and what a JavaScript
  `Date` holds. Leap seconds keep it within 0.9 s of Earth's rotation.
- `TAI`: International Atomic Time, a steady atomic clock. TAI − UTC is a whole
  number of seconds that grows by one at each leap second.
- `TT`: Terrestrial Time, the time scale of most astronomical formulas, such as
  the J2000 epoch: TT = TAI + 32.184 s.
- `UT1`: time by Earth's actual rotation angle. It drifts from UTC by up to 0.9
  s, and following it closely takes measurements published by the IERS.

## Example

```ts
const scale: TimeScaleType = 'TT';
```
