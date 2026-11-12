[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayStormInterface

# Interface: DisplayStormInterface

Defined in:
[celestial-bodies/display.ts:206](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L206)

An oval **storm** on a giant planet.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:218](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L218)

Its colour.

---

### feature?

```ts
feature?: string;
```

Defined in:
[celestial-bodies/display.ts:208](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L208)

The name of the feature in `observations.atmosphere.features` it draws, such as
`'Great Red Spot'`.

---

### height

```ts
height: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:216](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L216)

How tall it is, north to south.

---

### historical?

```ts
historical?: boolean;
```

Defined in:
[celestial-bodies/display.ts:220](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L220)

`true` for a feature that has gone since, such as Neptune's Great Dark Spot.

---

### latitude

```ts
latitude: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:210](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L210)

The planetographic latitude of its centre.

---

### longitude?

```ts
longitude?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:212](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L212)

Its longitude in the rotating frame; 0 if left out.

---

### width

```ts
width: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:214](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L214)

How wide it is, east to west.
