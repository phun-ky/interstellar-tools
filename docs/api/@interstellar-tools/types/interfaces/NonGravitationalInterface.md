[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
NonGravitationalInterface

# Interface: NonGravitationalInterface

Defined in:
[observations.ts:602](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L602)

The **non-gravitational** parameters of Marsden's model.

## Properties

### a1?

```ts
a1?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:604](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L604)

The radial component, A1.

---

### a2?

```ts
a2?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:606](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L606)

The transverse component, A2: for an asteroid, its Yarkovsky drift.

---

### a3?

```ts
a3?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:608](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L608)

The normal component, A3.

---

### dt?

```ts
dt?: ObservedType<TemporalInterface>;
```

Defined in:
[observations.ts:610](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L610)

How long after perihelion outgassing peaks, ΔT.
