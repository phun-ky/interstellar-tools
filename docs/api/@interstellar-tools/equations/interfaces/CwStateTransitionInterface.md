[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / CwStateTransitionInterface

# Interface: CwStateTransitionInterface

Defined in:
[orbits/cw-state-transition.ts:9](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L9)

The Clohessy–Wiltshire state transition matrix $\Phi(t)$, split into its four
3×3 blocks: $\mathbf r(t) = \Phi_{rr}\mathbf r_0 + \Phi_{rv}\mathbf v_0$ and
$\mathbf v(t) = \Phi_{vr}\mathbf r_0 + \Phi_{vv}\mathbf v_0$.

## Properties

### rr

```ts
rr: Matrix3x3Type;
```

Defined in:
[orbits/cw-state-transition.ts:11](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L11)

Position from initial position.

---

### rv

```ts
rv: Matrix3x3Type;
```

Defined in:
[orbits/cw-state-transition.ts:13](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L13)

Position from initial velocity (s).

---

### vr

```ts
vr: Matrix3x3Type;
```

Defined in:
[orbits/cw-state-transition.ts:15](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L15)

Velocity from initial position (1/s).

---

### vv

```ts
vv: Matrix3x3Type;
```

Defined in:
[orbits/cw-state-transition.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/cw-state-transition.ts#L17)

Velocity from initial velocity.
