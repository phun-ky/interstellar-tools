[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayStormInterface

# Interface: DisplayStormInterface

Defined in:
[celestial-bodies/display.ts:203](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L203)

An oval **storm** on a giant planet.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:215](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L215)

Its colour.

---

### feature?

```ts
feature?: string;
```

Defined in:
[celestial-bodies/display.ts:205](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L205)

The name of the feature in `observations.atmosphere.features` it draws, such as
`'Great Red Spot'`.

---

### height

```ts
height: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:213](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L213)

How tall it is, north to south.

---

### historical?

```ts
historical?: boolean;
```

Defined in:
[celestial-bodies/display.ts:217](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L217)

`true` for a feature that has gone since, such as Neptune's Great Dark Spot.

---

### latitude

```ts
latitude: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:207](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L207)

The planetographic latitude of its centre.

---

### longitude?

```ts
longitude?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:209](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L209)

Its longitude in the rotating frame; 0 if left out.

---

### width

```ts
width: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:211](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L211)

How wide it is, east to west.
