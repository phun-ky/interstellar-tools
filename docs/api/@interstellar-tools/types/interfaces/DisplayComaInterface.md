[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayComaInterface

# Interface: DisplayComaInterface

Defined in:
[celestial-bodies/display.ts:373](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L373)

How to draw a comet's **coma and tails**.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:375](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L375)

The coma's colour.

---

### intensity?

```ts
intensity?: number;
```

Defined in:
[celestial-bodies/display.ts:379](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L379)

How bright it is, 0–1.

---

### radius

```ts
radius: number;
```

Defined in:
[celestial-bodies/display.ts:377](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L377)

Its radius, in multiples of the drawn nucleus's radius.

---

### tails?

```ts
tails?: DisplayTailInterface[];
```

Defined in:
[celestial-bodies/display.ts:381](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L381)

Its tails.
