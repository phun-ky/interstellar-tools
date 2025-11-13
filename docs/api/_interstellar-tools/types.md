[Documentation](../index.md) /
[**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

# [**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

::: code-group

```shell [npm]
npm i --save @interstellar-tools/types
```

```shell [yarn]
yarn add @interstellar-tools/types
```

:::

## Celestial Bodies

| Name                                                                    | Description                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [AsteroidBeltInterface](types/AsteroidBeltInterface.md)                 | Represents an asteroid belt within the solar system simulation.                                   |
| [AsteroidInterface](types/AsteroidInterface.md)                         | Canonical shape for an **asteroid record**: identity, dynamics, and optional visualization aides. |
| [BlackHoleInterface](types/BlackHoleInterface.md)                       | Represents a **black hole** at the center of a galaxy.                                            |
| [CartesianCoordinatesInterface](types/CartesianCoordinatesInterface.md) | Represents **2D coordinates** for planetary positioning.                                          |
| [CometInterface](types/CometInterface.md)                               | Represents a **comet** in the solar system simulation.                                            |
| [GalaxyInterface](types/GalaxyInterface.md)                             | Represents a **galaxy** in the universe simulation.                                               |
| [MoonInterface](types/MoonInterface.md)                                 | Represents a **moon** (natural satellite) orbiting a planet.                                      |
| [PlanetInterface](types/PlanetInterface.md)                             | Represents a **planet** in the solar system simulation.                                           |
| [StarInterface](types/StarInterface.md)                                 | Represents a **star** in a planetary or stellar system.                                           |
| [StarSystemInterface](types/StarSystemInterface.md)                     | Represents a **star system**, which can be a planetary system or a stellar system.                |
| [SystemInterface](types/SystemInterface.md)                             | Represents a star system within the space visualization.                                          |
| [AsteroidBeltsType](types/AsteroidBeltsType.md)                         | Type alias for a collection of asteroid belts.                                                    |
| [AsteroidCategory](types/AsteroidCategory.md)                           | More specific **group/category** for dynamical families or special bodies.                        |
| [AsteroidSpectralType](types/AsteroidSpectralType.md)                   | **Spectral (taxonomic) class** based on reflectance spectra & albedo.                             |
| [AsteroidsType](types/AsteroidsType.md)                                 | Convenience alias for a list of asteroids.                                                        |
| [AsteroidType](types/AsteroidType.md)                                   | High-level **orbital class** of an asteroid (by dynamical region).                                |
| [BlackHolesType](types/BlackHolesType.md)                               | Type alias for a collection of **black holes**.                                                   |
| [CelestialBodiesType](types/CelestialBodiesType.md)                     | Type alias representing a collection of celestial bodies.                                         |
| [CelestialBodyType](types/CelestialBodyType.md)                         | Type alias representing a single celestial body.                                                  |
| [CometsType](types/CometsType.md)                                       | Type alias for an array of **comets**.                                                            |
| [GalaxiesType](types/GalaxiesType.md)                                   | Type alias for a collection of **galaxies**.                                                      |
| [MoonsType](types/MoonsType.md)                                         | Type alias for a collection of **moons**.                                                         |
| [PlanetsType](types/PlanetsType.md)                                     | Type alias for a collection of **planets**.                                                       |
| [StarsType](types/StarsType.md)                                         | Type alias for a collection of **stars**.                                                         |
| [SystemsType](types/SystemsType.md)                                     | Type alias for a collection of star systems.                                                      |

## Distance

| Name                                                    | Description                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------- |
| [DistanceInterface](types/DistanceInterface.md)         | Represents a distance measurement with an associated unit.             |
| [MeasureInterface](types/MeasureInterface.md)           | Represents a measurement with an associated unit.                      |
| [DistanceUnitAliasType](types/DistanceUnitAliasType.md) | Human-friendly **distance unit aliases** accepted at input time.       |
| [DistanceUnitType](types/DistanceUnitType.md)           | Canonical **distance unit symbols** for astronomy/space visualization. |

## Numeric

| Name                                      | Description                                      |
| ----------------------------------------- | ------------------------------------------------ |
| [ValueInterface](types/ValueInterface.md) | Represents a numerical value.                    |
| [Radians](types/Radians.md)               | Type alias representing an angle in **radians**. |

## Temporal

| Name                                                    | Description                                                                                                                                                                                    |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TemporalInterface](types/TemporalInterface.md)         | Typed container for a scalar **duration**, combining a numeric `value` (from [ValueInterface](types/ValueInterface.md)) with a canonical [TemporalUnitType](types/TemporalUnitType.md) `unit`. |
| [TimeStepInterface](types/TimeStepInterface.md)         | Represents a **time step measurement** in simulation, restricted to days.                                                                                                                      |
| [TemporalUnitAliasType](types/TemporalUnitAliasType.md) | Human-friendly **temporal unit aliases** accepted at input time.                                                                                                                               |
| [TemporalUnitType](types/TemporalUnitType.md)           | Canonical **temporal unit symbols** for spacetime/physics **durations**.                                                                                                                       |
