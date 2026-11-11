[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
ProperMotionInterface

# Interface: ProperMotionInterface

Defined in:
[positions.ts:133](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L133)

A **proper motion**: how fast something moves across the sky, in milliarcseconds
per year, as catalogues give it.

::: info

- `rightAscension` is $\mu_{\alpha*} = \mu_\alpha \cos\delta$, eastwards, so
  it's an angle on the sky, not a change in right ascension.
- `declination` is $\mu_\delta$, northwards.

:::

## Example

```ts
// Andromeda (Salomon et al. 2021, Gaia EDR3)
const andromeda: ProperMotionInterface = {
  rightAscension: 0.0489,
  declination: -0.0369
};
```

## Properties

### declination

```ts
declination: number;
```

Defined in:
[positions.ts:137](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L137)

Northwards, $\mu_\delta$, in mas/yr.

---

### rightAscension

```ts
rightAscension: number;
```

Defined in:
[positions.ts:135](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/positions.ts#L135)

Eastwards, $\mu_\alpha \cos\delta$, in mas/yr.
