[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
LagrangePointsInterface

# Interface: LagrangePointsInterface

Defined in:
[three-body.ts:99](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L99)

The five **Lagrange points** of two bodies circling each other: where a third,
small body can stay put relative to them.

Returned by `lagrangePoints` in `@interstellar-tools/equations`.

::: info

- Positions in m, in the frame turning with the two bodies, from their
  barycentre: x points from the larger body to the smaller, y ahead along the
  smaller body's orbit, z out of the orbital plane.
- L1 lies between the bodies, L2 beyond the smaller one, and L3 beyond the
  larger one, all on the x axis. L4 leads the smaller body by 60° and L5 trails
  it, each at the corner of an equilateral triangle with the two bodies.

:::

## Example

```ts
// Earth and the Moon, 384 400 km apart
const points: LagrangePointsInterface = {
  L1: [321_710_000, 0, 0],
  L2: [444_244_000, 0, 0],
  L3: [-386_346_000, 0, 0],
  L4: [187_529_000, 332_900_000, 0],
  L5: [187_529_000, -332_900_000, 0]
};
```

## Properties

### L1

```ts
L1: Vector3DTupleType;
```

Defined in:
[three-body.ts:101](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L101)

Between the two bodies, in m.

---

### L2

```ts
L2: Vector3DTupleType;
```

Defined in:
[three-body.ts:103](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L103)

Beyond the smaller body, in m.

---

### L3

```ts
L3: Vector3DTupleType;
```

Defined in:
[three-body.ts:105](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L105)

Beyond the larger body, opposite the smaller, in m.

---

### L4

```ts
L4: Vector3DTupleType;
```

Defined in:
[three-body.ts:107](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L107)

60° ahead of the smaller body, in m.

---

### L5

```ts
L5: Vector3DTupleType;
```

Defined in:
[three-body.ts:109](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/three-body.ts#L109)

60° behind the smaller body, in m.
