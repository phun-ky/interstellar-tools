[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RotationInterface

# Interface: RotationInterface

Defined in:
[celestial-bodies/rotation.ts:50](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L50)

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
[celestial-bodies/rotation.ts:58](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L58)

Sidereal period at the equator, for a body that turns faster there than at its
poles.

---

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:52](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L52)

Sidereal rotation period, always positive. See `retrograde` for the direction.

---

### polarPeriod?

```ts
polarPeriod?: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:60](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L60)

Sidereal period at the poles, for a body that turns slower there than at its
equator.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:54](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L54)

`true` for a spin against the parent's. Omitted for the usual prograde spin.

---

### synchronous?

```ts
synchronous?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:56](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L56)

`true` for a moon that keeps one face to its planet. Omitted otherwise.

---

### tumbling?

```ts
tumbling?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:62](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L62)

`true` for a body with no fixed spin axis. `period` is then the main period of
its motion.
