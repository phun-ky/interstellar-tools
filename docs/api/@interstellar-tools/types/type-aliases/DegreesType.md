[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DegreesType

# Type Alias: DegreesType

```ts
type DegreesType = number & {
  __unit: 'degrees';
};
```

Defined in:
[numeric.ts:99](https://github.com/phun-ky/interstellar-tools/blob/5913e0f9278db38f2861e82332044588e9643757/packages/types/src/numeric.ts#L99)

**Angle in degrees** (branded nominal type).

**Relations**

$$
180^\circ=\pi\ \mathrm{rad},\qquad
\text{deg}\to\text{rad}:~\theta_\mathrm{rad}=\theta_\mathrm{deg}\,\frac{\pi}{180},\qquad
\text{rad}\to\text{deg}:~\theta_\mathrm{deg}=\theta_\mathrm{rad}\,\frac{180}{\pi}
$$

**Why branded?** Brands a `number` to prevent accidentally mixing **degrees**
and **radians** at compile time. Construct explicitly (via a helper or cast).

**Units**

- Stored as a JavaScript `number` whose unit is **degrees** (dimensionless).

## Type Declaration

| Name     | Type        | Defined in                                                                                                                                     |
| -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `__unit` | `"degrees"` | [numeric.ts:99](https://github.com/phun-ky/interstellar-tools/blob/5913e0f9278db38f2861e82332044588e9643757/packages/types/src/numeric.ts#L99) |

## Examples

```ts
// Simple factory (recommended)
const deg = (x: number): DegreesType => x as DegreesType;
const rightAngle: DegreesType = deg(90);
```

```ts
// Converting to radians (using your own helper)
type Radians = number & { readonly __unit: 'radians' };
const toRadians = (d: DegreesType): Radians =>
  (((d as number) * Math.PI) / 180) as Radians;

const heading: DegreesType = 45 as DegreesType;
const headingRad: Radians = toRadians(heading);
```

## See

Radians - branded type for angles in radians
