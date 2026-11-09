[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitReferencePlaneType

# Type Alias: OrbitReferencePlaneType

```ts
type OrbitReferencePlaneType =
  'ecliptic' | 'equator' | 'laplace' | 'parent-equator' | 'sky' | 'galactic';
```

Defined in:
[orbits.ts:142](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L142)

The **reference plane** an orbit's `i`, `om` and `w` are measured from.

::: info

- `'ecliptic'`: the J2000 ecliptic, `om` from the J2000 equinox. Planets,
  asteroids, comets and Earth's Moon.
- `'equator'`: the ICRF equator, `om` from the J2000 equinox.
- `'laplace'`: a moon's local Laplace plane, the plane its orbit precesses
  around, with its pole in the frame's `pole`. As in JPL's satellite mean
  elements, `om` is measured along the plane from its ascending node on the ICRF
  equator, which lies at the pole's right ascension plus 90°.
- `'parent-equator'`: the equator of the body the orbit is around, with its pole
  in the frame's `pole`, and `om` measured as for a Laplace plane. The pole is
  the one the moons circle counterclockwise: for Uranus, which spins backwards,
  the opposite of the IAU's north pole.
- `'sky'`: the plane of the sky, as binary stars and the S-stars are measured:
  `i` to the sky (above 90° is clockwise on the sky, not retrograde), `om` the
  position angle of the ascending node, from north through east, and the node
  the one where the body moves away from us.
- `'galactic'`: the galaxy's disk, for a galactic orbit.

:::
