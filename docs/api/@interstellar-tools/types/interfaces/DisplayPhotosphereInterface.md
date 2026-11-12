[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
DisplayPhotosphereInterface

# Interface: DisplayPhotosphereInterface

Defined in:
[celestial-bodies/display.ts:310](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L310)

How to draw a **star's disc**.

## Properties

### color

```ts
color: string;
```

Defined in:
[celestial-bodies/display.ts:312](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L312)

The blackbody colour at its effective temperature.

---

### corona?

```ts
corona?: DisplayCoronaInterface;
```

Defined in:
[celestial-bodies/display.ts:322](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L322)

Its corona.

---

### granulation?

```ts
granulation?: number;
```

Defined in:
[celestial-bodies/display.ts:316](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L316)

How many convection cells span the disc: a handful for a supergiant, hundreds
for a dwarf.

---

### limbDarkening

```ts
limbDarkening: number;
```

Defined in:
[celestial-bodies/display.ts:314](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L314)

The linear limb-darkening coefficient, u, 0–1.

---

### spotCoverage?

```ts
spotCoverage?: number;
```

Defined in:
[celestial-bodies/display.ts:318](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L318)

The share of the surface covered by spots, 0–1.

---

### spotLatitude?

```ts
spotLatitude?: DegreesType;
```

Defined in:
[celestial-bodies/display.ts:320](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/celestial-bodies/display.ts#L320)

The latitude band spots keep to; ±40° if left out.
