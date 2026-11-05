[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
RotationInterface

# Interface: RotationInterface

Defined in:
[celestial-bodies/rotation.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L38)

How a planet or moon **spins**: its sidereal rotation period, one turn against
the stars.

::: info

- **Direction**: like an orbit's, `period` is always a positive duration. A
  backwards spin, against its parent's, has `retrograde: true`: Venus, Uranus
  and Pluto against the Sun's spin, and Triton, which keeps one face to Neptune
  on its backwards orbit.
- **Synchronous**: a moon that keeps one face to its planet, like the Moon, has
  `synchronous: true`. Its `period` is its orbital period, and its `retrograde`
  is its orbit's.
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
```

## Properties

### period

```ts
period: TemporalInterface;
```

Defined in:
[celestial-bodies/rotation.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L40)

Sidereal rotation period, always positive. See `retrograde` for the direction.

---

### retrograde?

```ts
retrograde?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L42)

`true` for a spin against the parent's. Omitted for the usual prograde spin.

---

### synchronous?

```ts
synchronous?: boolean;
```

Defined in:
[celestial-bodies/rotation.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L44)

`true` for a moon that keeps one face to its planet. Omitted otherwise.
