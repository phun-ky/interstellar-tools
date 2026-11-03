[Documentation](../../../index.md) / [@interstellar-tools/maps](../index.md) /
TerrainCurvatureInterface

# Interface: TerrainCurvatureInterface

Defined in:
[terrain/curvature.ts:9](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L9)

How the terrain bends at a cell, along the slope and across it.

## Properties

### planform

```ts
planform: number;
```

Defined in:
[terrain/curvature.ts:13](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L13)

Curvature across the slope (1/m): positive on a ridge, where flow spreads out,
negative in a hollow, where it converges.

---

### profile

```ts
profile: number;
```

Defined in:
[terrain/curvature.ts:11](https://github.com/phun-ky/interstellar-tools/blob/main/packages/maps/src/terrain/curvature.ts#L11)

Curvature along the steepest slope (1/m): positive where the ground is convex,
getting steeper downhill.
