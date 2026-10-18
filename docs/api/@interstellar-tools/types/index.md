[Documentation](../../index.md) /
[**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

# [**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

Shared TypeScript types (3D tuples, branded radians, unit-carrying values,
celestial body interfaces) used across the monorepo to keep APIs predictable and
safe.

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/types`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/types/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

```shell [npm]
npm i --save @interstellar-tools/types
```

## Interfaces

| Interface                                                  | Description                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [ForceResultInterface](interfaces/ForceResultInterface.md) | Result of a Newtonian gravitational force computation between two point masses. |

## Type Aliases

| Type Alias                                             | Description                              |
| ------------------------------------------------------ | ---------------------------------------- |
| [Matrix3x3Type](type-aliases/Matrix3x3Type.md)         | Immutable 3×3 matrix of numbers.         |
| [Vector3DTupleType](type-aliases/Vector3DTupleType.md) | A read-only 3D vector tuple `[x, y, z]`. |

## Celestial Bodies

| Name                                                                         | Description                                                                                             |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [AsteroidBeltInterface](interfaces/AsteroidBeltInterface.md)                 | Represents an asteroid belt within the solar system simulation.                                         |
| [AsteroidInterface](interfaces/AsteroidInterface.md)                         | Canonical shape for an **asteroid record**: identity, dynamics, and optional visualization aides.       |
| [BlackHoleInterface](interfaces/BlackHoleInterface.md)                       | Represents a **black hole** at the center of a galaxy.                                                  |
| [CartesianCoordinatesInterface](interfaces/CartesianCoordinatesInterface.md) | Represents **2D coordinates**, for example a point on a drawn orbit.                                    |
| [CometInterface](interfaces/CometInterface.md)                               | Represents a **comet** in the solar system simulation.                                                  |
| [DisplayInterface](interfaces/DisplayInterface.md)                           | How a body is **drawn**: everything about rendering, kept apart from its physical data and its `orbit`. |
| [GalaxyInterface](interfaces/GalaxyInterface.md)                             | Represents a **galaxy** in the universe simulation.                                                     |
| [MoonInterface](interfaces/MoonInterface.md)                                 | Represents a **moon** (natural satellite) orbiting a planet.                                            |
| [PlanetInterface](interfaces/PlanetInterface.md)                             | Represents a **planet** or **planetoid**.                                                               |
| [StarInterface](interfaces/StarInterface.md)                                 | Represents a **star**.                                                                                  |
| [SystemInterface](interfaces/SystemInterface.md)                             | Represents a **system**: the barycenter (centre of mass) that its members orbit.                        |
| [AsteroidBeltsType](type-aliases/AsteroidBeltsType.md)                       | Type alias for a collection of asteroid belts.                                                          |
| [AsteroidCategory](type-aliases/AsteroidCategory.md)                         | More specific **group/category** for dynamical families or special bodies.                              |
| [AsteroidSpectralType](type-aliases/AsteroidSpectralType.md)                 | **Spectral (taxonomic) class** based on reflectance spectra & albedo.                                   |
| [AsteroidsType](type-aliases/AsteroidsType.md)                               | Convenience alias for a list of asteroids.                                                              |
| [AsteroidType](type-aliases/AsteroidType.md)                                 | High-level **orbital class** of an asteroid (by dynamical region).                                      |
| [BlackHolesType](type-aliases/BlackHolesType.md)                             | Type alias for a collection of **black holes**.                                                         |
| [CelestialBodiesType](type-aliases/CelestialBodiesType.md)                   | Type alias representing a collection of celestial bodies.                                               |
| [CelestialBodyType](type-aliases/CelestialBodyType.md)                       | Type alias representing a single celestial body.                                                        |
| [CometsType](type-aliases/CometsType.md)                                     | Type alias for an array of **comets**.                                                                  |
| [GalaxiesType](type-aliases/GalaxiesType.md)                                 | Type alias for a collection of **galaxies**.                                                            |
| [MoonsType](type-aliases/MoonsType.md)                                       | Type alias for a collection of **moons**.                                                               |
| [PlanetsType](type-aliases/PlanetsType.md)                                   | Type alias for a collection of **planets**.                                                             |
| [StarsType](type-aliases/StarsType.md)                                       | Type alias for a collection of **stars**.                                                               |
| [SystemKindType](type-aliases/SystemKindType.md)                             | Kind of system a barycenter holds together.                                                             |
| [SystemsType](type-aliases/SystemsType.md)                                   | Type alias for a collection of systems.                                                                 |

## Distance

| Name                                                           | Description                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [DistanceInterface](interfaces/DistanceInterface.md)           | Represents a distance measurement with an associated unit.             |
| [~~MeasureInterface~~](interfaces/MeasureInterface.md)         | Represents a measurement with an associated unit.                      |
| [DistanceUnitAliasType](type-aliases/DistanceUnitAliasType.md) | Human-friendly **distance unit aliases** accepted at input time.       |
| [DistanceUnitType](type-aliases/DistanceUnitType.md)           | Canonical **distance unit symbols** for astronomy/space visualization. |

## Numeric

| Name                                           | Description                                  |
| ---------------------------------------------- | -------------------------------------------- |
| [ValueInterface](interfaces/ValueInterface.md) | Represents a numerical value.                |
| [DegreesType](type-aliases/DegreesType.md)     | **Angle in degrees** (branded nominal type). |
| [Radians](type-aliases/Radians.md)             | **Angle in radians** (branded nominal type). |

## Orbits

| Name                                                   | Description                                                                                                                                       |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FullOrbitInterface](interfaces/FullOrbitInterface.md) | An [OrbitInterface](interfaces/OrbitInterface.md) with every orientation element given: `i`, `w`, `om` and `q`. Comets and asteroids carry these. |
| [OrbitInterface](interfaces/OrbitInterface.md)         | Kepler **orbital elements** of one body around its parent.                                                                                        |
| [CwState](type-aliases/CwState.md)                     | Clohessy–Wiltshire / Hill relative-motion **state vector** in the LVLH frame.                                                                     |
| [CwStateDerivative](type-aliases/CwStateDerivative.md) | Time derivative of [CwState](type-aliases/CwState.md) for CW/Hill dynamics.                                                                       |
| [PeriApoRadiiType](type-aliases/PeriApoRadiiType.md)   | **Peri/apoapsis radii pair**.                                                                                                                     |

## Temporal

| Name                                                           | Description                                                                                                                                                                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TemporalInterface](interfaces/TemporalInterface.md)           | Typed container for a scalar **duration**, combining a numeric `value` (from [ValueInterface](interfaces/ValueInterface.md)) with a canonical [TemporalUnitType](type-aliases/TemporalUnitType.md) `unit`. |
| [TimeStepInterface](interfaces/TimeStepInterface.md)           | Represents a **time step measurement** in simulation, restricted to days.                                                                                                                                  |
| [TemporalUnitAliasType](type-aliases/TemporalUnitAliasType.md) | Human-friendly **temporal unit aliases** accepted at input time.                                                                                                                                           |
| [TemporalUnitType](type-aliases/TemporalUnitType.md)           | Canonical **temporal unit symbols** for spacetime/physics **durations**.                                                                                                                                   |
