[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ForceResultInterface

# Interface: ForceResultInterface

Defined in:
[physics.ts:50](https://github.com/phun-ky/interstellar-tools/blob/5462dfd597336dd4aa57edc1e894b564d387586b/packages/types/src/physics.ts#L50)

Result of a Newtonian gravitational force computation between two point masses.

**Units:** SI (newtons for force). `vector` and `direction` point **from body 1
toward body 2**.

**Relevant equations (invariants & definitions)**

$$
\mathbf F = \langle F_x, F_y, F_z \rangle,\qquad
\|\mathbf F\| = \sqrt{F_x^2 + F_y^2 + F_z^2}
$$

$$
\hat{\mathbf r}=\frac{\mathbf r_2-\mathbf r_1}{\|\mathbf r_2-\mathbf r_1\|},\qquad
\|\hat{\mathbf r}\|=1
$$

$$
\mathbf F = \|\mathbf F\|\,\hat{\mathbf r}
$$

And, for context (how the magnitude is obtained in Newtonian gravity):

$$
\|\mathbf F\| = G\,\frac{m_1 m_2}{\|\mathbf r_2-\mathbf r_1\|^2}
$$

**Mappings to fields**

- `vector` ↔ ($ \mathbf F $)
- `magnitude` ↔ ($ \|\mathbf F\| $)
- `direction` ↔ ($ \hat{\mathbf r} $)

## Example

```ts
const res: ForceResultInterface = gravitationalForce(m1, m2, r1, r2);
// Invariant checks:
const [Fx, Fy, Fz] = res.vector;
const magFromVec = Math.hypot(Fx, Fy, Fz);
console.assert(Math.abs(magFromVec - res.magnitude) / res.magnitude < 1e-9);
```

## See

https://en.wikipedia.org/wiki/Newton%27s\_law\_of\_universal\_gravitation

## Properties

### direction

```ts
readonly direction: Vector3DTupleType;
```

Defined in:
[physics.ts:56](https://github.com/phun-ky/interstellar-tools/blob/5462dfd597336dd4aa57edc1e894b564d387586b/packages/types/src/physics.ts#L56)

Unit direction from body 1 to body 2 (dimensionless).

---

### magnitude

```ts
readonly magnitude: number;
```

Defined in:
[physics.ts:54](https://github.com/phun-ky/interstellar-tools/blob/5462dfd597336dd4aa57edc1e894b564d387586b/packages/types/src/physics.ts#L54)

Scalar magnitude of the force (N).

---

### vector

```ts
readonly vector: Vector3DTupleType;
```

Defined in:
[physics.ts:52](https://github.com/phun-ky/interstellar-tools/blob/5462dfd597336dd4aa57edc1e894b564d387586b/packages/types/src/physics.ts#L52)

Force vector on body 1 due to body 2 (N).
