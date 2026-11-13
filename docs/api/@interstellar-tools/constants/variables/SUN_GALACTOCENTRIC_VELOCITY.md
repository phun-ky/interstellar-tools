[Documentation](../../../index.md) /
[@interstellar-tools/constants](../index.md) / SUN_GALACTOCENTRIC_VELOCITY

# Variable: SUN_GALACTOCENTRIC_VELOCITY

```ts
const SUN_GALACTOCENTRIC_VELOCITY: Readonly<VelocityInterface>;
```

Defined in:
[galactic.ts:95](https://github.com/phun-ky/interstellar-tools/blob/main/packages/constants/src/galactic.ts#L95)

The **Sun's velocity around the Milky Way's centre**, in km/s, in the
`'galactocentric'` frame: $(12.9, 251.51, 8.56)$.

::: info Notes

- `x` points towards the centre, `y` the way the Milky Way turns, and `z` to its
  north pole. Most of the motion, `y`, is the Sun's orbit around the centre,
  about 200 million years a turn.
- Sagittarius A\* sits still at the centre, so its motion across the sky, $\mu_l
  = -6.411$ and $\mu_b = -0.219$ mas/yr (Reid & Brunthaler 2020), is the Sun's,
  reflected. `y` and `z` are solved so that it does, at
  [SUN_GALACTOCENTRIC_DISTANCE](SUN_GALACTOCENTRIC_DISTANCE.md): about the
  proper motion times the distance.
- `x`, 12.9 km/s, is Astropy's: the Sun's motion towards the centre relative to
  the stars around it, 11.1 km/s (Schönrich, Binney & Dehnen 2010\), plus 1.9
  km/s (Drimmel & Poggio 2018).
- Astropy's `Galactocentric` frame uses $(12.9, 245.6, 7.78)$ by default, from
  the same recipe with its 8.122 kpc and Reid & Brunthaler's 2004 proper motion.
  With 8275.9 pc, that would make Sagittarius A\* drift by about 6 km/s.

:::

## See

https://arxiv.org/abs/2001.04386 Reid & Brunthaler 2020, ApJ 892, 39

## Example

```ts
console.log(SUN_GALACTOCENTRIC_VELOCITY.y); // 251.51 km/s
```
