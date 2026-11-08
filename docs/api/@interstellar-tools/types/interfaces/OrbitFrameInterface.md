[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
OrbitFrameInterface

# Interface: OrbitFrameInterface

Defined in:
[orbits.ts:160](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L160)

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
[orbits.ts:162](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L162)

The reference plane.

---

### pole?

```ts
pole?: CelestialDirectionInterface;
```

Defined in:
[orbits.ts:164](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/orbits.ts#L164)

The plane's pole in the ICRF, for a `'laplace'` plane.
