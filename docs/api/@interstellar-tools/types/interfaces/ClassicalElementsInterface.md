[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ClassicalElementsInterface

# Interface: ClassicalElementsInterface

Defined in:
[orbits.ts:276](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L276)

The six **classical orbital elements** of a two-body orbit, in SI units and
radians.

Together they fix the orbit's size and shape (`a`, `e`), its plane (`i`,
`raan`), its orientation in that plane (`argp`) and the body's place on it
(`nu`). Returned by `stateToElements` and taken by `elementsToState` in
`@interstellar-tools/equations`.

::: info

- `a` is negative for a hyperbolic orbit ($e > 1$).
- For orbits where an angle is undefined, the conventions are: a circular orbit
  has `argp = 0` and measures `nu` from the ascending node; an equatorial orbit
  has `raan = 0` and measures `argp` from the x axis; a circular equatorial
  orbit measures `nu` from the x axis.

:::

## Example

```ts
const iss: ClassicalElementsInterface = {
  a: 6_791_000,
  e: 0.0005,
  i: 0.9013 as Radians,
  raan: 1.2 as Radians,
  argp: 0.5 as Radians,
  nu: 0 as Radians
};
```

## Properties

### a

```ts
a: number;
```

Defined in:
[orbits.ts:278](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L278)

Semi-major axis in m; negative for hyperbolic orbits.

---

### argp

```ts
argp: Radians;
```

Defined in:
[orbits.ts:286](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L286)

Argument of periapsis (ω) in radians, in \[0, 2π).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:280](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L280)

Eccentricity: 0 circular, below 1 elliptic, above 1 hyperbolic.

---

### i

```ts
i: Radians;
```

Defined in:
[orbits.ts:282](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L282)

Inclination in radians, in \[0, π].

---

### nu

```ts
nu: Radians;
```

Defined in:
[orbits.ts:288](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L288)

True anomaly (ν) in radians, in \[0, 2π).

---

### raan

```ts
raan: Radians;
```

Defined in:
[orbits.ts:284](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L284)

Right ascension of the ascending node (Ω) in radians, in \[0, 2π).
