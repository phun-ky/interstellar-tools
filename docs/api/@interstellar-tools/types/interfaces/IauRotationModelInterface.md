[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
IauRotationModelInterface

# Interface: IauRotationModelInterface

Defined in:
[celestial-bodies/rotation.ts:77](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L77)

A body's **IAU rotation model**: which way its spin axis points, and how far it
has turned, at any moment (Archinal et al. 2018).

::: info

- With $T$ in Julian centuries and $d$ in days from J2000.0 TDB, the pole is at
  right ascension $\alpha_0 + \dot\alpha T$ and declination $\delta_0 +
  \dot\delta T$, and the prime meridian at $W = W_0 + \dot W d + \ddot W d^2$,
  each plus its periodic terms.
- $W$ is measured east along the body's equator from where it crosses the ICRF
  equator northwards, at right ascension $\alpha + 90°$.
- `pole` says which pole the model gives. For planets and their moons it's the
  `'north'` one, on the north side of the solar system's invariable plane, so
  $\dot W$ is negative for a backwards spin, like Venus's and Uranus's. For
  dwarf planets, asteroids and comets it's the `'positive'` one, by the
  right-hand rule, so $\dot W$ is always positive, and Pluto's points south.
- The periodic terms can't be left out where they're large: they move Mars's
  pole by 1.6° and Triton's by 21°.

:::

## Example

```ts
// Saturn
const saturn: IauRotationModelInterface = {
  pole: 'north',
  rightAscension: 40.589 as DegreesType,
  rightAscensionRate: -0.036,
  declination: 83.537 as DegreesType,
  declinationRate: -0.004,
  primeMeridian: 38.9 as DegreesType,
  primeMeridianRate: 810.7939024
};
```

## Properties

### declination

```ts
declination: DegreesType;
```

Defined in:
[celestial-bodies/rotation.ts:85](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L85)

The pole's declination at J2000.0, $\delta_0$, in degrees.

---

### declinationRate

```ts
declinationRate: number;
```

Defined in:
[celestial-bodies/rotation.ts:87](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L87)

Its rate $\dot\delta$, in degrees per Julian century.

---

### declinationTerms?

```ts
declinationTerms?: readonly IauPeriodicTermInterface[];
```

Defined in:
[celestial-bodies/rotation.ts:97](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L97)

Periodic terms added to the declination, each $A \cos\theta$.

---

### pole

```ts
pole: 'north' | 'positive';
```

Defined in:
[celestial-bodies/rotation.ts:79](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L79)

Which pole the model gives: `'north'` for planets and moons, `'positive'` by the
right-hand rule for small bodies.

---

### primeMeridian

```ts
primeMeridian: DegreesType;
```

Defined in:
[celestial-bodies/rotation.ts:89](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L89)

The prime meridian's angle at J2000.0, $W_0$, in degrees.

---

### primeMeridianAcceleration?

```ts
primeMeridianAcceleration?: number;
```

Defined in:
[celestial-bodies/rotation.ts:93](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L93)

Its quadratic term $\ddot W$, in degrees per day². Omitted when 0.

---

### primeMeridianRate

```ts
primeMeridianRate: number;
```

Defined in:
[celestial-bodies/rotation.ts:91](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L91)

Its rate $\dot W$, in degrees per day: negative for a backwards spin about a
`'north'` pole.

---

### primeMeridianTerms?

```ts
primeMeridianTerms?: readonly IauPeriodicTermInterface[];
```

Defined in:
[celestial-bodies/rotation.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L99)

Periodic terms added to the prime meridian, each $A \sin\theta$.

---

### rightAscension

```ts
rightAscension: DegreesType;
```

Defined in:
[celestial-bodies/rotation.ts:81](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L81)

The pole's right ascension at J2000.0, $\alpha_0$, in degrees.

---

### rightAscensionRate

```ts
rightAscensionRate: number;
```

Defined in:
[celestial-bodies/rotation.ts:83](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L83)

Its rate $\dot\alpha$, in degrees per Julian century.

---

### rightAscensionTerms?

```ts
rightAscensionTerms?: readonly IauPeriodicTermInterface[];
```

Defined in:
[celestial-bodies/rotation.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L95)

Periodic terms added to the right ascension, each $A \sin\theta$.
