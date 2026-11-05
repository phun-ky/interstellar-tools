[Documentation](../../../index.md) / [@interstellar-tools/tracking](../index.md)
/ FitElementsOptionsInterface

# Interface: FitElementsOptionsInterface

Defined in:
[satellites/fit.ts:16](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L16)

Options for [fitElements](../functions/fitElements.md).

## Properties

### bstar?

```ts
bstar?: number;
```

Defined in:
[satellites/fit.ts:20](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L20)

Hold B\* at this value, in **1/R⊕**, instead of fitting it: for arcs shorter
than a day or so, which drag hasn't had time to shape.

---

### initial?

```ts
initial?: MeanElementsInterface;
```

Defined in:
[satellites/fit.ts:18](https://github.com/phun-ky/interstellar-tools/blob/main/packages/tracking/src/satellites/fit.ts#L18)

Elements to start from, such as the last published TLE: the fit converges
faster, and keeps their catalogue number, name, designator and bookkeeping.
