[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
SystemInterface

# Interface: SystemInterface

Defined in:
[celestial-bodies/systems.ts:46](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L46)

Represents a **system**: the barycenter (centre of mass) that its members orbit.

A system does not list its members. Each member names the system as its
`parent`, so the member list is derived and there is one source of truth.
Systems nest: the Alpha Centauri AB pair is a system whose parent is the Alpha
Centauri system.

- `parent` and `orbit` set: the system orbits its parent as one body.
- `parent` without `orbit`: bound to the parent, but not on a Kepler orbit.
- Neither: unbound.

## Example

```ts
const alphaCentauriAB: SystemInterface = {
  id: 'alpha-centauri-ab',
  name: 'Alpha Centauri AB',
  kind: 'binary',
  parent: 'alpha-centauri',
  orbit: {
    a: { value: 503, unit: 'au' },
    e: 0.5,
    period: { value: -547, unit: 'kyr' },
    angle: Math.PI as Radians
  }
};
```

## Properties

### distance?

```ts
optional distance?: DistanceInterface;
```

Defined in:
[celestial-bodies/systems.ts:58](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L58)

Distance from the Sun.

---

### id

```ts
id: string;
```

Defined in:
[celestial-bodies/systems.ts:48](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L48)

Stable identifier, used by `parent` references. Never translated.

---

### kind

```ts
kind: SystemKindType;
```

Defined in:
[celestial-bodies/systems.ts:52](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L52)

What kind of system the barycenter holds together.

---

### name

```ts
name: string;
```

Defined in:
[celestial-bodies/systems.ts:50](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L50)

Display name of the system.

---

### orbit?

```ts
optional orbit?: OrbitInterface;
```

Defined in:
[celestial-bodies/systems.ts:56](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L56)

Orbit of the system's barycenter around its parent.

---

### parent?

```ts
optional parent?: string;
```

Defined in:
[celestial-bodies/systems.ts:54](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L54)

Id of the galaxy or system this system is bound to.

---

### x?

```ts
optional x?: DistanceInterface;
```

Defined in:
[celestial-bodies/systems.ts:60](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L60)

X-coordinate of the barycenter in the parent's frame.

---

### y?

```ts
optional y?: DistanceInterface;
```

Defined in:
[celestial-bodies/systems.ts:62](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L62)

Y-coordinate of the barycenter in the parent's frame.

---

### z?

```ts
optional z?: DistanceInterface;
```

Defined in:
[celestial-bodies/systems.ts:64](https://github.com/phun-ky/interstellar-tools/blob/3e1c4cd4ff4585f3c32f5e7530e7df5d0b18f6f6/packages/types/src/celestial-bodies/systems.ts#L64)

Z-coordinate of the barycenter in the parent's frame.
