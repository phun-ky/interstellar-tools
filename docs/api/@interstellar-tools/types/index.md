[Documentation](../../index.md) /
[**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

# [**@interstellar-tools/types**](https://github.com/interstellar-tools/types)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

```shell [npm]
npm i --save @interstellar-tools/types
```

## Celestial Bodies

| Name                                                                         | Description                                                                                       |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [AsteroidBeltInterface](interfaces/AsteroidBeltInterface.md)                 | Represents an asteroid belt within the solar system simulation.                                   |
| [AsteroidInterface](interfaces/AsteroidInterface.md)                         | Canonical shape for an **asteroid record**: identity, dynamics, and optional visualization aides. |
| [BlackHoleInterface](interfaces/BlackHoleInterface.md)                       | Represents a **black hole** at the center of a galaxy.                                            |
| [CartesianCoordinatesInterface](interfaces/CartesianCoordinatesInterface.md) | Represents **2D coordinates** for planetary positioning.                                          |
| [CometInterface](interfaces/CometInterface.md)                               | Represents a **comet** in the solar system simulation.                                            |
| [GalaxyInterface](interfaces/GalaxyInterface.md)                             | Represents a **galaxy** in the universe simulation.                                               |
| [MoonInterface](interfaces/MoonInterface.md)                                 | Represents a **moon** (natural satellite) orbiting a planet.                                      |
| [PlanetInterface](interfaces/PlanetInterface.md)                             | Represents a **planet** in the solar system simulation.                                           |
| [StarInterface](interfaces/StarInterface.md)                                 | Represents a **star** in a planetary or stellar system.                                           |
| [StarSystemInterface](interfaces/StarSystemInterface.md)                     | Represents a **star system**, which can be a planetary system or a stellar system.                |
| [SystemInterface](interfaces/SystemInterface.md)                             | Represents a star system within the space visualization.                                          |
| [AsteroidBeltsType](type-aliases/AsteroidBeltsType.md)                       | Type alias for a collection of asteroid belts.                                                    |
| [AsteroidCategory](type-aliases/AsteroidCategory.md)                         | More specific **group/category** for dynamical families or special bodies.                        |
| [AsteroidSpectralType](type-aliases/AsteroidSpectralType.md)                 | **Spectral (taxonomic) class** based on reflectance spectra & albedo.                             |
| [AsteroidsType](type-aliases/AsteroidsType.md)                               | Convenience alias for a list of asteroids.                                                        |
| [AsteroidType](type-aliases/AsteroidType.md)                                 | High-level **orbital class** of an asteroid (by dynamical region).                                |
| [BlackHolesType](type-aliases/BlackHolesType.md)                             | Type alias for a collection of **black holes**.                                                   |
| [CelestialBodiesType](type-aliases/CelestialBodiesType.md)                   | Type alias representing a collection of celestial bodies.                                         |
| [CelestialBodyType](type-aliases/CelestialBodyType.md)                       | Type alias representing a single celestial body.                                                  |
| [CometsType](type-aliases/CometsType.md)                                     | Type alias for an array of **comets**.                                                            |
| [GalaxiesType](type-aliases/GalaxiesType.md)                                 | Type alias for a collection of **galaxies**.                                                      |
| [MoonsType](type-aliases/MoonsType.md)                                       | Type alias for a collection of **moons**.                                                         |
| [PlanetsType](type-aliases/PlanetsType.md)                                   | Type alias for a collection of **planets**.                                                       |
| [StarsType](type-aliases/StarsType.md)                                       | Type alias for a collection of **stars**.                                                         |
| [SystemsType](type-aliases/SystemsType.md)                                   | Type alias for a collection of star systems.                                                      |

## Distance

| Name                                                           | Description                                                            |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [DistanceInterface](interfaces/DistanceInterface.md)           | Represents a distance measurement with an associated unit.             |
| [MeasureInterface](interfaces/MeasureInterface.md)             | Represents a measurement with an associated unit.                      |
| [DistanceUnitAliasType](type-aliases/DistanceUnitAliasType.md) | Human-friendly **distance unit aliases** accepted at input time.       |
| [DistanceUnitType](type-aliases/DistanceUnitType.md)           | Canonical **distance unit symbols** for astronomy/space visualization. |

## Numeric

| Name                                           | Description                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| [ValueInterface](interfaces/ValueInterface.md) | Represents a numerical value.                    |
| [Radians](type-aliases/Radians.md)             | Type alias representing an angle in **radians**. |

## Temporal

| Name                                                           | Description                                                                                                                                                                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TemporalInterface](interfaces/TemporalInterface.md)           | Typed container for a scalar **duration**, combining a numeric `value` (from [ValueInterface](interfaces/ValueInterface.md)) with a canonical [TemporalUnitType](type-aliases/TemporalUnitType.md) `unit`. |
| [TimeStepInterface](interfaces/TimeStepInterface.md)           | Represents a **time step measurement** in simulation, restricted to days.                                                                                                                                  |
| [TemporalUnitAliasType](type-aliases/TemporalUnitAliasType.md) | Human-friendly **temporal unit aliases** accepted at input time.                                                                                                                                           |
| [TemporalUnitType](type-aliases/TemporalUnitType.md)           | Canonical **temporal unit symbols** for spacetime/physics **durations**.                                                                                                                                   |
