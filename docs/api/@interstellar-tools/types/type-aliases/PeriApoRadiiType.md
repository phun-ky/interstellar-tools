[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
PeriApoRadiiType

# Type Alias: PeriApoRadiiType

```ts
type PeriApoRadiiType = {
  ra: number | null;
  rp: number;
};
```

Defined in:
[physics.ts:95](https://github.com/phun-ky/interstellar-tools/blob/1d94921ca8ba590fe5cb7f1f00da780f689f64aa/packages/types/src/physics.ts#L95)

**Peri/apoapsis radii pair**.

**Definitions**

$$
r_p = a(1-e),\qquad r_a = a(1+e)
$$

**Conic validity**

- **Elliptic / circular** (($a>0,\;0\le e<1$)): both ($r_p>0$) and ($r_a>0$).
- **Hyperbolic** (($a<0,\;e>1$)): ($r_p = |a|(e-1) > 0$) and **no apoapsis**
  (unbounded), so set `ra = null`.
- **Parabolic** (($e=1$)) with finite ($a$) is not represented; use parabolic
  relations or state vectors.

**Units**

- Values are in **meters (m)**.

## Examples

```ts
// Elliptic example
const radii: PeriApoRadiiType = { rp: 6930e3, ra: 7070e3 };
```

```ts
// Hyperbolic example - no apoapsis
const flyby: PeriApoRadiiType = { rp: 10_000e3, ra: null };
```

## See

- periApoapsisRadii - function that computes `{ rp, ra }` from `(a, e)`.
- https://en.wikipedia.org/wiki/Apsis

## Properties

### ra

```ts
ra: number | null;
```

Defined in:
[physics.ts:95](https://github.com/phun-ky/interstellar-tools/blob/1d94921ca8ba590fe5cb7f1f00da780f689f64aa/packages/types/src/physics.ts#L95)

Apoapsis radius ($r_a$) (m) for closed orbits; `null` for hyperbolic
trajectories.

---

### rp

```ts
rp: number;
```

Defined in:
[physics.ts:95](https://github.com/phun-ky/interstellar-tools/blob/1d94921ca8ba590fe5cb7f1f00da780f689f64aa/packages/types/src/physics.ts#L95)

Periapsis radius ($r_p$) (m).
