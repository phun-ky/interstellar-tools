[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitReferencePlaneType

# Type Alias: OrbitReferencePlaneType

```ts
type OrbitReferencePlaneType =
  'ecliptic' | 'equator' | 'laplace' | 'parent-equator' | 'sky' | 'galactic';
```

Defined in:
[orbits.ts:139](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L139)

The **reference plane** an orbit's `i`, `om` and `w` are measured from.

::: info

- `'ecliptic'`: the J2000 ecliptic, `om` from the J2000 equinox. Planets,
  asteroids, comets and Earth's Moon.
- `'equator'`: the ICRF equator, `om` from the J2000 equinox.
- `'laplace'`: a moon's local Laplace plane, the plane its orbit precesses
  around, with its pole in the frame's `pole`. As in JPL's satellite mean
  elements, `om` is measured from the ICRF equinox along the ICRF equator to the
  Laplace plane's ascending node, then along the Laplace plane.
- `'parent-equator'`: the equator of the body the orbit is around.
- `'sky'`: the plane of the sky, as binary stars and the S-stars are measured:
  `i` to the sky (above 90° is clockwise on the sky, not retrograde), `om` the
  position angle of the ascending node, from north through east, and the node
  the one where the body moves away from us.
- `'galactic'`: the galaxy's disk, for a galactic orbit.

:::
