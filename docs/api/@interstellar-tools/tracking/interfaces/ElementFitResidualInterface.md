[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ ElementFitResidualInterface

# Interface: ElementFitResidualInterface

Defined in:
[satellites/fit.ts:24](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L24)

How far a fitted element set is from one of the states it was fitted to.

## Properties

### epoch

```ts
epoch: Date;
```

Defined in:
[satellites/fit.ts:26](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L26)

The moment of the state.

---

### position

```ts
position: number;
```

Defined in:
[satellites/fit.ts:28](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L28)

The distance between SGP4's position and the state's, in **m**.

---

### velocity

```ts
velocity: number;
```

Defined in:
[satellites/fit.ts:30](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L30)

The difference between the velocities, in **m/s**.
