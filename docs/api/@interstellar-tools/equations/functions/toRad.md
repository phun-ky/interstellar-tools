[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / toRad

# Function: toRad()

```ts
function toRad(deg: number): Radians;
```

Defined in:
[helpers/radians.ts:21](https://github.com/phun-ky/interstellar-tools/blob/ca19b3ee4d96f8365482f3870f73960191b1923c/packages/equations/src/categories/helpers/radians.ts#L21)

Convert **degrees → radians**.

Uses the standard relation:

$$
\pi\ \text{rad} = 180^\circ
$$

## Parameters

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `deg`     | `number` | Angle in **degrees**. |

## Returns

[`Radians`](../../types/type-aliases/Radians.md)

Angle in **radians** (branded as
[Radians](../../types/type-aliases/Radians.md)).

## Example

```ts
const halfTurn = toRad(180); // π (Radians)
const rightAngle = toRad(90); // π/2 (Radians)
```
