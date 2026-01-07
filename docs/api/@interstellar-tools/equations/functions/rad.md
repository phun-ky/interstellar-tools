[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / rad

# Function: rad()

```ts
function rad(x: number): Radians;
```

Defined in:
[helpers/radians.ts:42](https://github.com/phun-ky/interstellar-tools/blob/ac735f13de4b34569cab4db70a97bd640eb40a70/packages/equations/src/categories/helpers/radians.ts#L42)

Brand a numeric value as [Radians](../../types/type-aliases/Radians.md).

This is a **type-level** helper only: it does not change the runtime value, but
it prevents accidentally mixing degree-values with radian-values at compile
time.

Use this when you already have a value in radians (e.g., from `Math.atan2`,
`Math.PI`, or your own radian-based computations) and want to pass it to APIs
that require `Radians`.

## Parameters

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `x`       | `number` | Angle value already expressed in **radians**. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

The same numeric value, branded as
[Radians](../../types/type-aliases/Radians.md).

## Example

```ts
const theta = rad(Math.PI / 3);
// theta has type Radians
```
