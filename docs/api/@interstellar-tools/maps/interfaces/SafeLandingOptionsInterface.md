[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
SafeLandingOptionsInterface

# Interface: SafeLandingOptionsInterface

Defined in:
[landing/safe-landing-grid.ts:17](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L17)

The lander, for [safeLandingGrid](../functions/safeLandingGrid.md).

## Properties

### dynamicTilt?

```ts
dynamicTilt?: Radians;
```

Defined in:
[landing/safe-landing-grid.ts:23](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L23)

Extra tilt from touchdown, the rock-up, in **radians** (finite, >= 0). Defaults
to 0.

---

### hCoM

```ts
hCoM: number;
```

Defined in:
[landing/safe-landing-grid.ts:21](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L21)

Height of the centre of mass above the ground in **m** (finite, > 0).

---

### maxRoughness

```ts
maxRoughness: number;
```

Defined in:
[landing/safe-landing-grid.ts:25](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L25)

Largest Terrain Roughness Index the lander can take, in **m** (finite, >= 0):
its clearance under the body, for example.

---

### rFootprint

```ts
rFootprint: number;
```

Defined in:
[landing/safe-landing-grid.ts:19](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/landing/safe-landing-grid.ts#L19)

Distance from the centre of mass to the tipping edge, horizontally, in **m**
(finite, > 0).
