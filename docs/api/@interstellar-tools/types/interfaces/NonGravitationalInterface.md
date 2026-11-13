[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
NonGravitationalInterface

# Interface: NonGravitationalInterface

Defined in:
[observations.ts:603](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L603)

The **non-gravitational** parameters of Marsden's model.

## Properties

### a1?

```ts
a1?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:605](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L605)

The radial component, A1.

---

### a2?

```ts
a2?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:607](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L607)

The transverse component, A2: for an asteroid, its Yarkovsky drift.

---

### a3?

```ts
a3?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:609](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L609)

The normal component, A3.

---

### dt?

```ts
dt?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:611](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L611)

How long after perihelion outgassing peaks, ΔT.
