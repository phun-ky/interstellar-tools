[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayTailInterface

# Interface: DisplayTailInterface

Defined in:
[celestial-bodies/display.ts:330](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L330)

One **comet tail** to draw.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:334](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L334)

Its colour.

---

### curvature?

```ts
curvature?: number;
```

Defined in:
[celestial-bodies/display.ts:338](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L338)

How far it curves from the line away from the Sun, 0 (straight, as an ion tail)
to 1.

---

### kind

```ts
kind: 'dust' | 'ion' | 'sodium' | 'anti-tail';
```

Defined in:
[celestial-bodies/display.ts:332](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L332)

What kind.

---

### length

```ts
length: number;
```

Defined in:
[celestial-bodies/display.ts:336](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L336)

How long it is, in multiples of the drawn nucleus's radius.

---

### opacity?

```ts
opacity?: number;
```

Defined in:
[celestial-bodies/display.ts:340](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L340)

How opaque it is, 0–1.
