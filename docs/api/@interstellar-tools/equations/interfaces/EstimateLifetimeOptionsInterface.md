[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / EstimateLifetimeOptionsInterface

# Interface: EstimateLifetimeOptionsInterface

Defined in:
[orbits/estimate-lifetime.ts:4](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/estimate-lifetime.ts#L4)

Options for [estimateLifetime](../functions/estimateLifetime.md).

## Properties

### density?

```ts
density?: (h: number) => number;
```

Defined in:
[orbits/estimate-lifetime.ts:6](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/estimate-lifetime.ts#L6)

Air density in **kg/m³** at a height in **m**:
[exponentialAtmosphereDensity](../functions/exponentialAtmosphereDensity.md) by
default.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `h`       | `number` |

#### Returns

`number`

---

### reentryHeight?

```ts
reentryHeight?: number;
```

Defined in:
[orbits/estimate-lifetime.ts:8](https://github.com/phun-ky/interstellar-tools/blob/main/packages/equations/src/categories/orbits/estimate-lifetime.ts#L8)

The height in **m** that counts as re-entry: 120 000 by default, where the decay
takes minutes.
