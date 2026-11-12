[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayTailInterface

# Interface: DisplayTailInterface

Defined in:
[celestial-bodies/display.ts:355](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L355)

One **comet tail** to draw.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:359](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L359)

Its colour.

---

### curvature?

```ts
curvature?: number;
```

Defined in:
[celestial-bodies/display.ts:363](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L363)

How far it curves from the line away from the Sun, 0 (straight, as an ion tail)
to 1.

---

### kind

```ts
kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
```

Defined in:
[celestial-bodies/display.ts:357](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L357)

What kind.

---

### length

```ts
length: number;
```

Defined in:
[celestial-bodies/display.ts:361](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L361)

How long it is, in multiples of the drawn nucleus's radius.

---

### opacity?

```ts
opacity?: number;
```

Defined in:
[celestial-bodies/display.ts:365](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L365)

How opaque it is, 0–1.
