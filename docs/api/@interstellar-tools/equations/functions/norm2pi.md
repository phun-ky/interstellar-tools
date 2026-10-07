[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / norm2pi

# Function: norm2pi()

```ts
function norm2pi(x: number): number;
```

Defined in:
[helpers/misc.ts:104](https://github.com/phun-ky/interstellar-tools/blob/3607c42aab35c28efbf96b5b3085ee20e1d129c8/packages/equations/src/categories/helpers/misc.ts#L104)

Normalize an angle to the range **\[0, 2π)**.

This is commonly used to keep anomalies / angles within a canonical interval.

## Parameters

| Parameter | Type     | Description                                                            |
| --------- | -------- | ---------------------------------------------------------------------- |
| `x`       | `number` | Angle in radians (or any unit, as long as `TWO_PI` matches that unit). |

## Returns

`number`

Equivalent angle in the range `[0, 2π)`.

## Example

```ts
norm2pi(7); // ~0.7168 (if radians)
norm2pi(-Math.PI / 2); // 3π/2
```
