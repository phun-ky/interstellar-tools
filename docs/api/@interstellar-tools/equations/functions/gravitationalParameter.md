[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / gravitationalParameter

# Function: gravitationalParameter()

```ts
function gravitationalParameter(M: number, m: number, G?: number): number;
```

Defined in:
[gravity/gravitational-parameter.ts:50](https://github.com/phun-ky/interstellar-tools/blob/40019b531e6770232cbea0121ab22939e620782e/packages/equations/src/categories/gravity/gravitational-parameter.ts#L50)

Two-body **gravitational parameter** ($\mu$).

**Definition**

$$
\mu = G\,(M + m)
$$

**Common approximation, when** ($M \gg m$)

$$
\mu \approx G\,M
$$

**Units**

- Inputs: masses in **kg**, ( $G$ ) in **m³·kg⁻¹·s⁻²** (defaults to `G_SI`).
- Output: ($\mu$) in **m³/s²**.

::: tip

- Use `m = 0` (default) for the standard published ($\mu$) of a central body.
- When modelling a binary with comparable masses, pass both `M` and `m`.

:::

## Parameters

| Parameter | Type     | Default value | Description                                       |
| --------- | -------- | ------------- | ------------------------------------------------- |
| `M`       | `number` | `undefined`   | Mass of the primary body (kg).                    |
| `m`       | `number` | `0`           | Mass of the secondary body (kg). Defaults to `0`. |
| `G?`      | `number` | `G_SI`        | Gravitational constant. Defaults to `G_SI`.       |

## Returns

`number`

Gravitational parameter ($\mu$) in m³/s².

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `M` is non-finite or negative.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `m` is non-finite or negative.

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If `G` is non-finite or negative.

## Example

```ts
// Standard gravitational parameter for Earth (approximate: m ~ 0)
const muEarth = gravitationalParameter(5.97219e24); // ≈ 3.986004e14 m^3/s^2

// Earth + 1000 kg satellite: practically identical to GM
const muExact = gravitationalParameter(5.97219e24, 1000);

// Earth–Moon system (two-body μ)
const muEarthMoon = gravitationalParameter(5.97219e24, 7.342e22);
```
