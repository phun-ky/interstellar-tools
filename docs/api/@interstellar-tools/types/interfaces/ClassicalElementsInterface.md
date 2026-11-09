[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ClassicalElementsInterface

# Interface: ClassicalElementsInterface

Defined in:
[orbits.ts:279](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L279)

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
[orbits.ts:281](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L281)

Semi-major axis in m; negative for hyperbolic orbits.

---

### argp

```ts
argp: Radians;
```

Defined in:
[orbits.ts:289](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L289)

Argument of periapsis (ω) in radians, in \[0, 2π).

---

### e

```ts
e: number;
```

Defined in:
[orbits.ts:283](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L283)

Eccentricity: 0 circular, below 1 elliptic, above 1 hyperbolic.

---

### i

```ts
i: Radians;
```

Defined in:
[orbits.ts:285](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L285)

Inclination in radians, in \[0, π].

---

### nu

```ts
nu: Radians;
```

Defined in:
[orbits.ts:291](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L291)

True anomaly (ν) in radians, in \[0, 2π).

---

### raan

```ts
raan: Radians;
```

Defined in:
[orbits.ts:287](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L287)

Right ascension of the ascending node (Ω) in radians, in \[0, 2π).
