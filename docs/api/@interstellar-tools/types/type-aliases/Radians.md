[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
Radians

# Type Alias: Radians

```ts
type Radians = number & {
  __unit: 'radians';
};
```

Defined in:
[numeric.ts:59](https://github.com/phun-ky/interstellar-tools/blob/5913e0f9278db38f2861e82332044588e9643757/packages/types/src/numeric.ts#L59)

**Angle in radians** (branded nominal type).

**Relations**

$$
\pi\ \mathrm{rad}=180^\circ,\qquad
1\ \mathrm{rad}=\frac{\text{arc length}}{\text{radius}}
$$

**Why branded?** This type brands a `number` to prevent accidentally mixing
**degrees** and **radians** at compile time. You must construct it explicitly
(e.g., via a small factory or cast).

**Units**

- Stored as a JavaScript `number` whose unit is **radians** (dimensionless).

## Type Declaration

| Name     | Type        | Defined in                                                                                                                                     |
| -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `__unit` | `"radians"` | [numeric.ts:59](https://github.com/phun-ky/interstellar-tools/blob/5913e0f9278db38f2861e82332044588e9643757/packages/types/src/numeric.ts#L59) |

## Examples

```ts
// Construct with an explicit cast or small factory
const halfTurn: Radians = Math.PI as Radians;

// Function expecting radians
function usesRadians(nu: Radians) { …}
usesRadians(halfTurn);
// usesRadians(180 as number);   // avoid passing degrees as a plain number
```

```ts
// Optional helper factory (recommended pattern)
const rad = (x: number): Radians => x as Radians;
const quarter: Radians = rad(Math.PI / 2);
```

## See

flightPathAngleFromTrueAnomaly - accepts `nu: Radians`
