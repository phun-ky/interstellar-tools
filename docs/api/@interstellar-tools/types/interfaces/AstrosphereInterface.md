[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
AstrosphereInterface

# Interface: AstrosphereInterface

Defined in:
[celestial-bodies/body-observations.ts:604](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L604)

A star's **astrosphere**, the bubble its wind blows into the interstellar
medium: the Sun's is the heliosphere.

## Example

```ts
const heliosphere: AstrosphereInterface = {
  astropause: { nose: { value: 120, unit: 'au' } },
  crossings: [
    {
      probeId: 'voyager-1',
      boundary: 'astropause',
      date: new Date('2012-08-25'),
      distance: { value: 121.6, unit: 'au' }
    }
  ]
};
```

## Properties

### astropause?

```ts
astropause?: AstrosphereBoundaryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:608](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L608)

Where the stellar wind meets the interstellar medium: the heliopause.

---

### bowShock?

```ts
bowShock?: AstrosphereBoundaryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:610](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L610)

Where the interstellar medium is shocked ahead of it, if it is.

---

### crossings?

```ts
crossings?: AstrosphereCrossingInterface[];
```

Defined in:
[celestial-bodies/body-observations.ts:616](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L616)

Probes that have crossed its boundaries.

---

### inflowSpeed?

```ts
inflowSpeed?: ObservedType<SpeedInterface>;
```

Defined in:
[celestial-bodies/body-observations.ts:614](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L614)

The interstellar wind's speed, relative to the star.

---

### terminationShock?

```ts
terminationShock?: AstrosphereBoundaryInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:606](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L606)

Where the stellar wind slows below the speed of sound.

---

### upwind?

```ts
upwind?: EclipticDirectionInterface;
```

Defined in:
[celestial-bodies/body-observations.ts:612](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/body-observations.ts#L612)

The direction the interstellar wind blows from, which its nose faces.
