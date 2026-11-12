[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitFrameInterface

# Interface: OrbitFrameInterface

Defined in:
[orbits.ts:185](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L185)

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
[orbits.ts:187](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L187)

The reference plane.

---

### pole?

```ts
pole?: CelestialDirectionInterface;
```

Defined in:
[orbits.ts:189](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L189)

The plane's pole in the ICRF, for a `'laplace'` or `'parent-equator'` plane.
