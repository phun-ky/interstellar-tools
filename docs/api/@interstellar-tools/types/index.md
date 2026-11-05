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
| [OdeSolutionInterface](interfaces/OdeSolutionInterface.md) | The output of a numerical integration: the times, and the state at each.        |

## Type Aliases

| Type Alias                                                   | Description                                                                               |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [Matrix3x3Type](type-aliases/Matrix3x3Type.md)               | Immutable 3×3 matrix of numbers.                                                          |
| [OdeRightHandSideType](type-aliases/OdeRightHandSideType.md) | The right-hand side of a system of first-order ODEs, $\dot{\mathbf y} = f(t, \mathbf y)$. |
| [Vector3DTupleType](type-aliases/Vector3DTupleType.md)       | A read-only 3D vector tuple `[x, y, z]`.                                                  |

## Cartography

| Interface                                                                  | Description                                                                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EllipsoidInterface](interfaces/EllipsoidInterface.md)                     | A body's **reference ellipsoid**: the smooth surface that latitudes, longitudes and heights are measured on.                                      |
| [GeodeticCoordinatesInterface](interfaces/GeodeticCoordinatesInterface.md) | A point's **geodetic coordinates** on an oblate body: latitude, longitude and height above the reference ellipsoid, in SI units and radians.      |
| [IlluminationAnglesInterface](interfaces/IlluminationAnglesInterface.md)   | The **illumination angles** at a point on a surface: where the light comes from and where it's seen from, relative to the surface and each other. |
| [SunPositionInterface](interfaces/SunPositionInterface.md)                 | The **Sun's position** seen from Earth's centre at a moment: its direction on the sky and its distance.                                           |

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
| [CelestialBodiesType](type-aliases/CelestialBodiesType.md)                   | A list of celestial bodies of any kind: stars, planets, moons, comets and asteroids, mixed.             |
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

| Name                                                                   | Description                                                                                                                                       |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ClassicalElementsInterface](interfaces/ClassicalElementsInterface.md) | The six **classical orbital elements** of a two-body orbit, in SI units and radians.                                                              |
| [FullOrbitInterface](interfaces/FullOrbitInterface.md)                 | An [OrbitInterface](interfaces/OrbitInterface.md) with every orientation element given: `i`, `w`, `om` and `q`. Comets and asteroids carry these. |
| [OrbitInterface](interfaces/OrbitInterface.md)                         | Kepler **orbital elements** of one body around its parent.                                                                                        |
| [StateVectorInterface](interfaces/StateVectorInterface.md)             | A body's **state vector**: its position and velocity in an inertial frame centred on the body it orbits.                                          |
| [CwState](type-aliases/CwState.md)                                     | Clohessy–Wiltshire / Hill relative-motion **state vector** in the LVLH frame.                                                                     |
| [CwStateDerivative](type-aliases/CwStateDerivative.md)                 | Time derivative of [CwState](type-aliases/CwState.md) for CW/Hill dynamics.                                                                       |
| [PeriApoRadiiType](type-aliases/PeriApoRadiiType.md)                   | **Peri/apoapsis radii pair**.                                                                                                                     |

## Temporal

| Name                                                           | Description                                                                                                                                                                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [LeapSecondInterface](interfaces/LeapSecondInterface.md)       | One step in the **leap second table**: the offset TAI − UTC from a given UTC day on.                                                                                                                       |
| [TemporalInterface](interfaces/TemporalInterface.md)           | Typed container for a scalar **duration**, combining a numeric `value` (from [ValueInterface](interfaces/ValueInterface.md)) with a canonical [TemporalUnitType](type-aliases/TemporalUnitType.md) `unit`. |
| [TimeStepInterface](interfaces/TimeStepInterface.md)           | Represents a **time step measurement** in simulation, restricted to days.                                                                                                                                  |
| [TemporalUnitAliasType](type-aliases/TemporalUnitAliasType.md) | Human-friendly **temporal unit aliases** accepted at input time.                                                                                                                                           |
| [TemporalUnitType](type-aliases/TemporalUnitType.md)           | Canonical **temporal unit symbols** for spacetime/physics **durations**.                                                                                                                                   |
| [TimeScaleType](type-aliases/TimeScaleType.md)                 | A **time scale**: the clock a moment is read on.                                                                                                                                                           |

## Three-body

| Name                                                             | Description                                                                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Cr3bpUnitsInterface](interfaces/Cr3bpUnitsInterface.md)         | The units of the normalised CR3BP frame for a pair of bodies, in SI.                                                     |
| [LagrangePointsInterface](interfaces/LagrangePointsInterface.md) | The five **Lagrange points** of two bodies circling each other: where a third, small body can stay put relative to them. |
| [Cr3bpState](type-aliases/Cr3bpState.md)                         | A state in the **circular restricted three-body problem** (CR3BP), in the rotating, normalised frame.                    |
| [Cr3bpStateDerivative](type-aliases/Cr3bpStateDerivative.md)     | The time derivative of a [Cr3bpState](type-aliases/Cr3bpState.md): velocities, then accelerations.                       |

## Tracking

| Name                                                               | Description                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EphemerisInterface](interfaces/EphemerisInterface.md)             | An **ephemeris**: a table of a spacecraft's position and velocity over time, as JPL Horizons and the CCSDS Orbit Ephemeris Message (OEM) publish them. It's how deep-space probes, which have no TLEs, are tracked.    |
| [EphemerisSampleInterface](interfaces/EphemerisSampleInterface.md) | One **sample of an ephemeris**: a spacecraft's position and velocity at a moment.                                                                                                                                      |
| [GlobePointInterface](interfaces/GlobePointInterface.md)           | A point on an **orthographic globe view**: where it falls on the disc, and whether it's on the side facing the viewer.                                                                                                 |
| [LookAnglesInterface](interfaces/LookAnglesInterface.md)           | Where a satellite is in an observer's sky: the direction to point an antenna or a camera, how far away it is and how fast that distance changes.                                                                       |
| [MeanElementsInterface](interfaces/MeanElementsInterface.md)       | A satellite's **mean elements**, as published in a two-line element set (TLE) or an Orbit Mean-elements Message (OMM): the orbit SGP4 was fitted to at an epoch, with the drag terms it needs.                         |
| [OmmRecordInterface](interfaces/OmmRecordInterface.md)             | One **Orbit Mean-elements Message** (OMM) record in JSON, as CelesTrak publishes it: a satellite's mean elements, with the keywords of the CCSDS standard.                                                             |
| [ProbeRecordInterface](interfaces/ProbeRecordInterface.md)         | A probe in the `PROBES` dataset of `@interstellar-tools/tracking`: a deep-space spacecraft, with what it is, where it's headed and a dated ephemeris.                                                                  |
| [SatellitePassInterface](interfaces/SatellitePassInterface.md)     | One **pass** of a satellite over an observer: when it rises above the horizon, when it's highest, and when it sets.                                                                                                    |
| [SatelliteRecordInterface](interfaces/SatelliteRecordInterface.md) | A satellite in the `SATELLITES` dataset of `@interstellar-tools/tracking`: a stable id, a common name, its orbit regime and a dated OMM record.                                                                        |
| [OrbitRegimeType](type-aliases/OrbitRegimeType.md)                 | The **orbit regime** a satellite flies in.                                                                                                                                                                             |
| [ProbeStatusType](type-aliases/ProbeStatusType.md)                 | Whether a space probe is still at work: `'active'` while its mission operates it, `'ended'` once contact is lost or the mission is over. An ended probe keeps flying: Pioneer 10 still coasts out of the Solar System. |
| [ShadowType](type-aliases/ShadowType.md)                           | Where a satellite is relative to **Earth's shadow**.                                                                                                                                                                   |
