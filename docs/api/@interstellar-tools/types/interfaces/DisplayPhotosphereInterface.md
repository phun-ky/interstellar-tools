[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayPhotosphereInterface

# Interface: DisplayPhotosphereInterface

Defined in:
[celestial-bodies/display.ts:313](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L313)

How to draw a **star's disc**.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:315](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L315)

The blackbody colour at its effective temperature.

---

### corona?

```ts
corona?: DisplayCoronaInterface;
```

Defined in:
[celestial-bodies/display.ts:325](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L325)

Its corona.

---

### granulation?

```ts
granulation?: number;
```

Defined in:
[celestial-bodies/display.ts:319](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L319)

How many convection cells span the disc: a handful for a supergiant, hundreds
for a dwarf.

---

### limbDarkening

```ts
limbDarkening: number;
```

Defined in:
[celestial-bodies/display.ts:317](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L317)

The linear limb-darkening coefficient, u, 0–1.

---

### spotCoverage?

```ts
spotCoverage?: number;
```

Defined in:
[celestial-bodies/display.ts:321](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L321)

The share of the surface covered by spots, 0–1.

---

### spotLatitude?

```ts
spotLatitude?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:323](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L323)

The latitude band spots keep to; ±40° if left out.
