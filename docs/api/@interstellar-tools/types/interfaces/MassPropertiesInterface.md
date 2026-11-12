[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MassPropertiesInterface

# Interface: MassPropertiesInterface

Defined in:
[observations.ts:319](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L319)

Measured **mass and gravity**. The body's own `mu` stays the value the equations
use.

## Properties

### bulkDensity?

```ts
bulkDensity?: ObservedType<DensityInterface>;
```

Defined in:
[observations.ts:325](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L325)

The bulk density.

---

### escapeVelocity?

```ts
escapeVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[observations.ts:329](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L329)

The escape speed from the surface.

---

### gm?

```ts
gm?: ObservedType<GravitationalParameterInterface>;
```

Defined in:
[observations.ts:323](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L323)

$GM$ with its uncertainty, usually better known than the mass.

---

### j2?

```ts
j2?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:333](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L333)

The second zonal gravity harmonic, $J_2$.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[observations.ts:321](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L321)

The mass.

---

### momentOfInertiaFactor?

```ts
momentOfInertiaFactor?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:331](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L331)

The normalised moment of inertia, $C / MR^2$.

---

### surfaceGravity?

```ts
surfaceGravity?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:327](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L327)

The gravity at the surface, on the equator.
