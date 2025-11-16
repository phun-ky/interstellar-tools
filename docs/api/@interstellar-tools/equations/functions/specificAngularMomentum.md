[Documentation](../../../index.md) /
[@interstellar-tools/equations](../index.md) / specificAngularMomentum

# Function: specificAngularMomentum()

```ts
function specificAngularMomentum(
  r: Vector3DTupleType,
  v: Vector3DTupleType
): number;
```

Defined in:
[orbits/specific-angular-momentum.ts:57](https://github.com/phun-ky/interstellar-tools/blob/d29bdadfcfcf03c02ad5f61f28e4e281438ba3ee/packages/equations/src/categories/orbits/specific-angular-momentum.ts#L57)

**Specific angular momentum** ($h$) (scalar magnitude).

**Definitions**

$$
h = \lVert \mathbf r \times \mathbf v \rVert
$$

Useful identities:

$$
h = r\,v_{\perp},\qquad
\text{(circular)}\ \ v_\perp=\sqrt{\mu/r}\Rightarrow h=\sqrt{\mu r}
$$

(For orbital elements, one also has ($h=\sqrt{\mu\,a\,(1-e^2)}$), not used
here.)

**Units**

- Inputs: ($\mathbf r$) in **meters (m)**, ($\mathbf v$) in **m/s**.
- Output: ($h$) in **m²/s**.

::: info

- Returns the **magnitude** of ($\mathbf h = \mathbf r \times \mathbf v$) (not
  the vector).
- ($h = 0$) iff ($\mathbf r \parallel \mathbf v$) (purely radial motion) or
  ($\mathbf v=\mathbf 0$).
- In a two-body Keplerian model, ($h$) is constant along the orbit.

:::

**Invariants (floating-point tolerance aside)**

- ($h \ge 0$)
- ($\mathbf h \perp \mathbf r$) and ($\mathbf h \perp \mathbf v$) (directional
  property; this function returns only ($\lVert\mathbf h\rVert$)).

## Parameters

| Parameter | Type                                                                 | Description                                                 |
| --------- | -------------------------------------------------------------------- | ----------------------------------------------------------- |
| `r`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Inertial position vector ($\mathbf r=[x,y,z]$) (m).         |
| `v`       | [`Vector3DTupleType`](../../types/type-aliases/Vector3DTupleType.md) | Inertial velocity vector ($\mathbf v=[v_x,v_y,v_z]$) (m/s). |

## Returns

`number`

Specific angular momentum ($h$) (m²/s).

## Throws

[Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
If any component of `r`/`v` is non-finite; if `r` has zero length; or if `v` is
invalid (NaN).

## Example

```ts
// LEO-like state: r ⟂ v
const r: [number, number, number] = [6778e3, 0, 0]; // m
const v: [number, number, number] = [0, 7.67e3, 0]; // m/s
const h = specificAngularMomentum(r, v); // ≈ 5.20e10 m^2/s
```

## See

- <https://en.wikipedia.org/wiki/Specific_angular_momentum>
- [specificAngularMomentumFromElements](specificAngularMomentumFromElements.md)
  (if you compute from ($a,e,\mu$))
