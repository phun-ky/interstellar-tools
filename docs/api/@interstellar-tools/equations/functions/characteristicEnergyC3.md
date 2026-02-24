[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / characteristicEnergyC3

# Function: characteristicEnergyC3()

```ts
function characteristicEnergyC3(vInfinity: number): number;
```

Defined in:
[orbits/characteristic-energy-c3.ts:31](https://github.com/phun-ky/interstellar-tools/blob/e1895055f20123aef79902d13c565b030e6e65e7/packages/equations/src/categories/orbits/characteristic-energy-c3.ts#L31)

Compute **characteristic energy** (C3) from hyperbolic excess speed.

Characteristic energy is defined as the square of the hyperbolic excess
velocity:

$$
C_3 = v_{\infty}^2
$$

- If `vInfinity` is in **km/s**, `C3` is in **(km/s)²**.
- If `vInfinity` is in **m/s**, `C3` is in **(m/s)²**.

Common usage: preliminary interplanetary mission design and launch performance
comparisons (e.g., "available C3" from a launch vehicle).

## Parameters

| Parameter   | Type     | Description                                                     |
| ----------- | -------- | --------------------------------------------------------------- |
| `vInfinity` | `number` | Hyperbolic excess speed $v_{\infty}$ (must be a finite number). |

## Returns

`number`

Characteristic energy $C_3$ in squared speed units (e.g., (km/s)² or (m/s)²).

## Throws

If `vInfinity` is not a finite number.

## Example

```ts
// v∞ in km/s
const vInf = 3.2;
const c3 = characteristicEnergyC3(vInf);
// c3 === 10.24  // (km/s)²
```

## See

https://en.wikipedia.org/wiki/Characteristic\_energy
