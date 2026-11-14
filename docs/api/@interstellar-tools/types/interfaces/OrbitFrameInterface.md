[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitFrameInterface

# Interface: OrbitFrameInterface

Defined in:
[orbits.ts:186](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L186)

The **frame** of an orbit's orientation elements: the plane `i`, `om` and `w`
are measured from, and that plane's pole where it isn't a standard one.

## Example

```ts
const earthFrame: OrbitFrameInterface = { plane: 'ecliptic' };
// A Laplace plane close to Saturn's equator
const moonFrame: OrbitFrameInterface = {
  plane: 'laplace',
  pole: {
    rightAscension: 40.6 as DegreesType,
    declination: 83.5 as DegreesType
  }
};
```

## Properties

### plane

```ts
plane: OrbitReferencePlaneType;
```

Defined in:
[orbits.ts:188](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L188)

The reference plane.

---

### pole?

```ts
pole?: CelestialDirectionInterface;
```

Defined in:
[orbits.ts:190](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L190)

The plane's pole in the ICRF, for a `'laplace'` or `'parent-equator'` plane.
