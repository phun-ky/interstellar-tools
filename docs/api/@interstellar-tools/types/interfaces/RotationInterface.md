[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RotationInterface

# Interface: RotationInterface

Defined in:
[celestial-bodies/rotation.ts:154](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L154)

How a star, planet, moon, asteroid or comet **spins**: its sidereal rotation
period, one turn against the stars.

::: info

- **Direction**: like an orbit's, `period` is always a positive duration. A
  backwards spin, against its parent's, has `retrograde: true`: Venus, Uranus
  and Pluto against the Sun's spin, and Triton, which keeps one face to Neptune
  on its backwards orbit. A star's direction is mostly unknown, so it's left
  out.
- **Synchronous**: a moon that keeps one face to its planet, like the Moon, has
  `synchronous: true`. Its `period` is its orbital period, and its `retrograde`
  is its orbit's.
- **Differential rotation**: a ball of gas, like the Sun, turns faster at its
  equator than at its poles. `period` is then its reference period, the one its
  coordinates turn with (the Carrington period for the Sun), and
  `equatorialPeriod` and `polarPeriod` give the range.
- **Tumbling**: a body with no fixed spin axis, like Halley's comet, has
  `tumbling: true`, and `period` is the main period of its motion.
- **Axial tilt**: `obliquity` is the angle between its spin axis and its orbit's
  pole: Earth's 23.44° gives it seasons, and Venus's 177.36° is why it spins
  backwards.
- **Orientation**: `iau` is its IAU rotation model, the direction of its pole
  and its prime meridian at any moment.
- **Not a day**: one turn against the stars is not sunrise to sunrise. The body
  moves along its orbit as it turns, so a solar day also depends on the orbital
  period: Earth turns in 23 h 56 m, and its day is 24 h.

:::

## Example

```ts
const mars: RotationInterface = {
  period: { value: 24.623, unit: 'h' }
};
const moon: RotationInterface = {
  period: { value: 27.321661, unit: 'd' },
  synchronous: true
};
const venus: RotationInterface = {
  period: { value: 243.0226, unit: 'd' },
  retrograde: true
};
const sun: RotationInterface = {
  period: { value: 25.38, unit: 'd' },
  equatorialPeriod: { value: 24.47, unit: 'd' },
  polarPeriod: { value: 34.16, unit: 'd' }
};
```

## Properties

### equatorialPeriod?

```ts
equatorialPeriod?: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:162](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L162)

Sidereal period at the equator, for a body that turns faster there than at its
poles.

---

### iau?

```ts
iau?: IauRotationModelInterface;
```

Defined in:
[celestial-bodies/rotation.ts:173](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L173)

Its IAU rotation model, where the IAU gives one.

---

### obliquity?

```ts
obliquity?: DegreesType;
```

Defined in:
[celestial-bodies/rotation.ts:171](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L171)

Axial tilt: the angle between its spin axis, by the right-hand rule, and its
orbit's pole, from 0° to 180°. Over 90° for a backwards spin.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:156](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L156)

Sidereal rotation period, always positive. See `retrograde` for the direction.

---

### polarPeriod?

```ts
polarPeriod?: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:164](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L164)

Sidereal period at the poles, for a body that turns slower there than at its
equator.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:158](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L158)

`true` for a spin against the parent's. Omitted for the usual prograde spin.

---

### synchronous?

```ts
synchronous?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:160](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L160)

`true` for a moon that keeps one face to its planet. Omitted otherwise.

---

### tumbling?

```ts
tumbling?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:166](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L166)

`true` for a body with no fixed spin axis. `period` is then the main period of
its motion.
