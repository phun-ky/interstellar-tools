[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ ElementFitInterface

# Interface: ElementFitInterface

Defined in:
[satellites/fit.ts:34](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L34)

The result of [fitElements](../functions/fitElements.md).

## Properties

### converged

```ts
converged: boolean;
```

Defined in:
[satellites/fit.ts:44](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L44)

Whether the last stage converged within 50 steps. If not, the elements are the
best found, and the residuals say how good they are.

---

### elements

```ts
elements: MeanElementsInterface;
```

Defined in:
[satellites/fit.ts:36](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L36)

The fitted mean elements, for [propagate](../functions/propagate.md),
[formatTle](../functions/formatTle.md) and
[formatOmm](../functions/formatOmm.md).

---

### iterations

```ts
iterations: number;
```

Defined in:
[satellites/fit.ts:42](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L42)

The number of least-squares steps taken, over all stages.

---

### residuals

```ts
residuals: ElementFitResidualInterface[];
```

Defined in:
[satellites/fit.ts:40](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L40)

The residual at each state, in time order.

---

### rms

```ts
rms: {
  position: number;
  velocity: number;
}
```

Defined in:
[satellites/fit.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L38)

The root mean square of the residuals: `position` in **m**, `velocity` in
**m/s**.

| Name       | Type     | Defined in                                                                                                                  |
| ---------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `position` | `number` | [satellites/fit.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L38) |
| `velocity` | `number` | [satellites/fit.ts:38](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L38) |
