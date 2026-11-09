[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitFrameInterface

# Interface: OrbitFrameInterface

Defined in:
[orbits.ts:163](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L163)

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
[orbits.ts:165](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L165)

The reference plane.

---

### pole?

```ts
pole?: CelestialDirectionInterface;
```

Defined in:
[orbits.ts:167](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L167)

The plane's pole in the ICRF, for a `'laplace'` or `'parent-equator'` plane.
