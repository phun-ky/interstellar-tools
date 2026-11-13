[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
IauPeriodicTermInterface

# Interface: IauPeriodicTermInterface

Defined in:
[celestial-bodies/rotation.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L28)

A **periodic term** in an IAU rotation model: an amplitude times the sine or
cosine of an angle that grows with time.

::: info

- The angle is $\theta = \theta_0 + \dot\theta T + \ddot\theta T^2$, with $T$ in
  Julian centuries of 36 525 days from J2000.0 TDB.
- Terms for the pole's right ascension and the prime meridian add $A
  \sin\theta$, and terms for its declination $A \cos\theta$.

:::

## Example

```ts
// Neptune's pole swings around 0.7° in right ascension, every 688 years
const term: IauPeriodicTermInterface = {
  amplitude: 0.7,
  phase: 357.85 as DegreesType,
  rate: 52.316
};
```

## Properties

### acceleration?

```ts
acceleration?: number;
```

Defined in:
[celestial-bodies/rotation.ts:36](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L36)

Its quadratic term $\ddot\theta$, in degrees per Julian century². Omitted
when 0.

---

### amplitude

```ts
amplitude: number;
```

Defined in:
[celestial-bodies/rotation.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L30)

Amplitude $A$, in degrees.

---

### phase

```ts
phase: DegreesType;
```

Defined in:
[celestial-bodies/rotation.ts:32](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L32)

The angle $\theta_0$ at J2000.0, in degrees.

---

### rate

```ts
rate: number;
```

Defined in:
[celestial-bodies/rotation.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/rotation.ts#L34)

Its rate $\dot\theta$, in degrees per Julian century.
