[Documentation](../../../index.md) / [@interstellar-tools/types](../index.md) /
MassPropertiesInterface

# Interface: MassPropertiesInterface

Defined in:
[observations.ts:316](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L316)

Measured **mass and gravity**. The body's own `mu` stays the value the equations
use.

## Properties

### bulkDensity?

```ts
bulkDensity?: ObservedType<DensityInterface>;
```

Defined in:
[observations.ts:322](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L322)

The bulk density.

---

### escapeVelocity?

```ts
escapeVelocity?: ObservedType<SpeedInterface>;
```

Defined in:
[observations.ts:326](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L326)

The escape speed from the surface.

---

### gm?

```ts
gm?: ObservedType<GravitationalParameterInterface>;
```

Defined in:
[observations.ts:320](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L320)

$GM$ with its uncertainty, usually better known than the mass.

---

### j2?

```ts
j2?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:330](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L330)

The second zonal gravity harmonic, $J_2$.

---

### mass?

```ts
mass?: ObservedType<MassInterface>;
```

Defined in:
[observations.ts:318](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L318)

The mass.

---

### momentOfInertiaFactor?

```ts
momentOfInertiaFactor?: ObservedType<DimensionlessInterface>;
```

Defined in:
[observations.ts:328](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L328)

The normalised moment of inertia, $C / MR^2$.

---

### surfaceGravity?

```ts
surfaceGravity?: ObservedType<AccelerationInterface>;
```

Defined in:
[observations.ts:324](https://github.com/phun-ky/interstellar-tools/blob/main/packages/types/src/observations.ts#L324)

The gravity at the surface, on the equator.
