[Documentation](../../index.md) /
[**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

# [**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

Curated, tested orbital mechanics and dynamics formulas: Newtonian gravity,
vis-viva, Kepler’s third law, Kepler’s equation solvers, anomaly conversions,
Hohmann transfers, rocket equation, J2 perturbations and more. SI units in, SI
units out, with clear errors for invalid input.

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Getting started](https://phun-ky.net/interstellar-tools/guide/introduction/):
  installation, unit conventions and recommended practices
- [API reference for `@interstellar-tools/equations`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/equations/):
  every export, with formulas, parameters and examples

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

```shell [npm]
npm i --save @interstellar-tools/equations
```

::: warning

These equations have not **_YET_** been battle-tested or tested to real world
mechanics, YMMV!

:::

Here you will find a set of function that can assist you when calculating
orbits, angles, solve for kelper or find true anomalies.

## Interfaces

| Interface                                                                    | Description |
| ---------------------------------------------------------------------------- | ----------- |
| [CwTwoImpulseTransferInterface](interfaces/CwTwoImpulseTransferInterface.md) | -           |
| [LambertSolutionInterface](interfaces/LambertSolutionInterface.md)           | -           |
| [LaunchAzimuthsInterface](interfaces/LaunchAzimuthsInterface.md)             | -           |
| [SolveLambertOptionsInterface](interfaces/SolveLambertOptionsInterface.md)   | -           |

## Type Aliases

| Type Alias                                                             | Description |
| ---------------------------------------------------------------------- | ----------- |
| [HohmannTransferReturnType](type-aliases/HohmannTransferReturnType.md) | -           |

## Functions

| Function                                                                  | Description                                                                              |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [planetographicLatitudeOblate](functions/planetographicLatitudeOblate.md) | Compute planetographic latitude (oblate spheroid) from body-fixed Cartesian coordinates. |

## Angles

| Function                                  | Description                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [computeAngle](functions/computeAngle.md) | Advances a body along its orbit by one time step and returns its new **true anomaly** ($\nu$).                                                          |
| [wrapAngle](functions/wrapAngle.md)       | Wrap an angle (in **radians**) to a **single-turn range** and snap values extremely close to **±τ** (±`2π`) back to **0** to curb floating-point drift. |

## Anomalies

| Function                                                        | Description                                                                                                             |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [advanceMeanAnomaly](functions/advanceMeanAnomaly.md)           | Advances an orbit by a time step and returns its new **mean anomaly** ($M$).                                            |
| [asymptoteTrueAnomaly](functions/asymptoteTrueAnomaly.md)       | Compute the **true anomaly of a hyperbola's asymptotes**: the limit a body on a hyperbola approaches but never reaches. |
| [eccentricToTrueAnomaly](functions/eccentricToTrueAnomaly.md)   | Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.                                            |
| [hyperbolicToTrueAnomaly](functions/hyperbolicToTrueAnomaly.md) | Convert a **hyperbolic anomaly** $F$ to the **true anomaly** on a hyperbola.                                            |
| [meanAnomalyAt](functions/meanAnomalyAt.md)                     | The **mean anomaly** ($M$) of an orbit at a given date.                                                                 |
| [trueAnomalyAt](functions/trueAnomalyAt.md)                     | The **true anomaly** ($\nu$) of an orbit at a given date: where the body is.                                            |
| [trueToHyperbolicAnomaly](functions/trueToHyperbolicAnomaly.md) | Convert a **true anomaly** on a hyperbola to the **hyperbolic anomaly** $F$.                                            |
| [trueToMeanAnomaly](functions/trueToMeanAnomaly.md)             | Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation.                                    |

## Cartography

| Function                                                                            | Description                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [bodyFixedFromInertialDcmIAU](functions/bodyFixedFromInertialDcmIAU.md)             | Build the **IAU-style inertial → body-fixed** direction cosine matrix (DCM).                                                                                                                                    |
| [bodyFixedToGeodetic](functions/bodyFixedToGeodetic.md)                             | Convert a **body-fixed Cartesian** position (ECEF for Earth) to **geodetic coordinates**: latitude, longitude and height.                                                                                       |
| [centralAngle](functions/centralAngle.md)                                           | Compute the **central angle** between two points on a sphere from their latitudes and longitudes, with the haversine formula.                                                                                   |
| [centralAngleFromVectors](functions/centralAngleFromVectors.md)                     | Compute the **central angle** between two position vectors, without trigonometry on latitude and longitude.                                                                                                     |
| [earthRotationAngle](functions/earthRotationAngle.md)                               | Compute the **Earth rotation angle** (ERA): how far Earth has turned about its axis at a moment, measured from the Celestial Intermediate Origin. It's the IAU 2000 measure of Earth's rotation, linear in UT1. |
| [eccentricitySquaredOblateSpheroid](functions/eccentricitySquaredOblateSpheroid.md) | Compute **first eccentricity squared** ($e^2$) for an oblate spheroid.                                                                                                                                          |
| [flatteningOblateSpheroid](functions/flatteningOblateSpheroid.md)                   | Compute **flattening** ($f$) of an oblate spheroid.                                                                                                                                                             |
| [geodeticToBodyFixed](functions/geodeticToBodyFixed.md)                             | Convert **geodetic coordinates** (latitude, longitude, height) to a **body-fixed Cartesian** position, ECEF for Earth.                                                                                          |
| [greatCircleDistance](functions/greatCircleDistance.md)                             | Compute the **great-circle distance** between two points on a sphere: the shortest path along its surface.                                                                                                      |
| [greenwichMeanSiderealTime](functions/greenwichMeanSiderealTime.md)                 | Compute **Greenwich mean sidereal time** (GMST) with the IAU 1982 model: the angle from the mean equinox of date to the Greenwich meridian, as the 1982 standard defines it.                                    |
| [heightAboveEllipsoid](functions/heightAboveEllipsoid.md)                           | Compute a point's **height above a body's reference ellipsoid**: the exact height along the ellipsoid's normal, the height maps and GPS receivers give.                                                         |
| [heightAboveSphere](functions/heightAboveSphere.md)                                 | Compute a point's **height above a spherical body**: its distance from the centre less the radius.                                                                                                              |
| [horizonDistance](functions/horizonDistance.md)                                     | Compute the straight-line **distance to the horizon** for an observer at a height above a sphere.                                                                                                               |
| [horizonSurfaceDistance](functions/horizonSurfaceDistance.md)                       | Compute the **distance along the surface to the horizon** for an observer at a height above a sphere.                                                                                                           |
| [isOnTriaxialEllipsoidSurface](functions/isOnTriaxialEllipsoidSurface.md)           | Test whether a 3D point lies on the surface of a **triaxial ellipsoid** (within a tolerance).                                                                                                                   |
| [localSiderealTime](functions/localSiderealTime.md)                                 | Compute **local mean sidereal time**: Greenwich mean sidereal time turned by a longitude, the angle from the mean equinox to the local meridian.                                                                |
| [meridionalRadiusOfCurvature](functions/meridionalRadiusOfCurvature.md)             | Compute the **meridional radius of curvature** $M$ of an oblate spheroid at a geodetic latitude.                                                                                                                |
| [planetocentricLatitude](functions/planetocentricLatitude.md)                       | Compute **planetocentric latitude** ($\varphi_c$) from body-fixed Cartesian coordinates.                                                                                                                        |
| [primeVerticalRadiusOfCurvature](functions/primeVerticalRadiusOfCurvature.md)       | Compute the **prime vertical radius of curvature** $N$ of an oblate spheroid at a geodetic latitude.                                                                                                            |
| [sphericalPolygonArea](functions/sphericalPolygonArea.md)                           | Compute the **area of a polygon on a sphere**, such as an instrument footprint or a region on a planet, from its corner points.                                                                                 |

## Entry

| Function                                                                            | Description                                                                                                        |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [ballisticCoefficient](functions/ballisticCoefficient.md)                           | Compute the **ballistic coefficient** of an entry vehicle: how much mass it has per unit of drag.                  |
| [ballisticEntrySpeed](functions/ballisticEntrySpeed.md)                             | Compute the **speed of a ballistic entry** at an altitude, with the Allen–Eggers solution.                         |
| [ballisticPeakDeceleration](functions/ballisticPeakDeceleration.md)                 | Compute the **peak deceleration of a ballistic entry**, with the Allen–Eggers solution.                            |
| [ballisticPeakDecelerationAltitude](functions/ballisticPeakDecelerationAltitude.md) | Compute the **altitude of peak deceleration** in a ballistic entry, with the Allen–Eggers solution.                |
| [stagnationHeatFlux](functions/stagnationHeatFlux.md)                               | Compute the **convective heat flux at the stagnation point** of an entry vehicle, with the Sutton–Graves relation. |
| [terminalVelocity](functions/terminalVelocity.md)                                   | Compute the **terminal speed** of a falling body: where drag balances its weight.                                  |

## Gravity

| Function                                                      | Description                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [accelerationOn1By2](functions/accelerationOn1By2.md)         | Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²). |
| [forceOn1By2](functions/forceOn1By2.md)                       | Gravitational **force vector** on body 1 due to body 2 (newtons, N).   |
| [gravitationalForce](functions/gravitationalForce.md)         | Compute the Newtonian **gravitational force** on body 1 due to body 2. |
| [gravitationalParameter](functions/gravitationalParameter.md) | Two-body **gravitational parameter** ($\mu$).                          |

## Helpers

| Name                                                            | Description                                                                                                                                                                         |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [METERS_PER](variables/METERS_PER.md)                           | Meters-per-unit lookup for all canonical [DistanceUnitType](../types/type-aliases/DistanceUnitType.md) symbols.                                                                     |
| [NORMALIZE_DISTANCE_UNIT](variables/NORMALIZE_DISTANCE_UNIT.md) | Lookup table that **normalizes distance unit aliases** (and the canonical symbols themselves) to a single, canonical [DistanceUnitType](../types/type-aliases/DistanceUnitType.md). |
| [applyMatrix3](functions/applyMatrix3.md)                       | Apply a **3×3 matrix** to a **3D vector** (matrix–vector multiplication).                                                                                                           |
| [convertDistanceUnit](functions/convertDistanceUnit.md)         | Convert a **distance** between any two [DistanceUnitType](../types/type-aliases/DistanceUnitType.md) units.                                                                         |
| [cross](functions/cross.md)                                     | Compute the **cross product** of two 3D vectors.                                                                                                                                    |
| [det3](functions/det3.md)                                       | Compute the **determinant** of a **3×3** matrix (row-major).                                                                                                                        |
| [dot](functions/dot.md)                                         | Compute the **dot product** of two 3D vectors.                                                                                                                                      |
| [matMul3](functions/matMul3.md)                                 | Multiply two **3×3 matrices** (row-major).                                                                                                                                          |
| [norm](functions/norm.md)                                       | Compute the **Euclidean norm** (length / magnitude) of a 3D vector.                                                                                                                 |
| [norm2pi](functions/norm2pi.md)                                 | Normalize an angle to the range **\[0, 2π)**.                                                                                                                                       |
| [normalizeDistanceUnit](functions/normalizeDistanceUnit.md)     | Normalize a **distance unit string** into a canonical [DistanceUnitType](../types/type-aliases/DistanceUnitType.md).                                                                |
| [rad](functions/rad.md)                                         | Brand a numeric value as [Radians](../types/type-aliases/Radians.md).                                                                                                               |
| [rk4Integrate](functions/rk4Integrate.md)                       | **Integrate** a system of ODEs from `t0` to `t1` in fixed fourth-order Runge–Kutta steps.                                                                                           |
| [rk4Step](functions/rk4Step.md)                                 | Take one **fourth-order Runge–Kutta** step of a system of ODEs, $\dot{\mathbf y} = f(t, \mathbf y)$.                                                                                |
| [rot1](functions/rot1.md)                                       | Construct a **right-handed rotation matrix about the x-axis** (often written **R₁**).                                                                                               |
| [rot3](functions/rot3.md)                                       | Construct a **right-handed rotation matrix about the z-axis** (often written **R₃**).                                                                                               |
| [scale](functions/scale.md)                                     | Scale a 3D vector by a scalar.                                                                                                                                                      |
| [stumpffC](functions/stumpffC.md)                               | Compute the **Stumpff function** $C(z)$, used by the universal-variable formulation of the two-body problem.                                                                        |
| [stumpffS](functions/stumpffS.md)                               | Compute the **Stumpff function** $S(z)$, used by the universal-variable formulation of the two-body problem.                                                                        |
| [sub](functions/sub.md)                                         | Subtract two 3D vectors (`a - b`).                                                                                                                                                  |
| [toRad](functions/toRad.md)                                     | Convert **degrees → radians**.                                                                                                                                                      |
| [transpose3](functions/transpose3.md)                           | Transpose a **3×3 matrix** (row-major).                                                                                                                                             |

## Kepler

| Function                          | Description                                                       |
| --------------------------------- | ----------------------------------------------------------------- |
| [residual](functions/residual.md) | Compute the **Kepler equation residual** for an elliptical orbit: |

## Kepler Solvers

| Function                                                                | Description                                                                                                                                              |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [solveKepler](functions/solveKepler.md)                                 | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach:                                                             |
| [solveKeplerBisection](functions/solveKeplerBisection.md)               | Solve **Kepler's equation** for the **eccentric anomaly** ($E$) via **bisection** (elliptic case: ($0 \le e < 1$)).                                      |
| [solveKeplerHighEccentricity](functions/solveKeplerHighEccentricity.md) | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly eccentric orbits ($e > 0.9$) using an iterative numerical approach.           |
| [solveKeplerHyperbolic](functions/solveKeplerHyperbolic.md)             | Solve **Kepler's equation for a hyperbola**: find the hyperbolic anomaly $F$ from the hyperbolic mean anomaly $M_h$.                                     |
| [solveKeplerNewtonRaphson](functions/solveKeplerNewtonRaphson.md)       | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method** with Householder acceleration for fast convergence. |

## Manoeuvres

| Function                                                            | Description                                                                                                                                        |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [burnTime](functions/burnTime.md)                                   | Compute the **burn time** needed for a given delta-v, at constant thrust and mass flow.                                                            |
| [combineBurnsDeltaV](functions/combineBurnsDeltaV.md)               | **Combine non-collinear burns** (vector law / law of cosines for velocities).                                                                      |
| [cwTwoImpulseTransfer](functions/cwTwoImpulseTransfer.md)           | Compute the **two burns of a Clohessy–Wiltshire rendezvous**: from a relative state to a target state in a given time.                             |
| [gravityAssistTurningAngle](functions/gravityAssistTurningAngle.md) | Compute **gravity-assist turning angle** (flyby deflection) for a hyperbolic encounter.                                                            |
| [gravityLoss](functions/gravityLoss.md)                             | Compute the **gravity loss** of a burn from samples of gravity and flight-path angle.                                                              |
| [hohmannSemiMajorAxis](functions/hohmannSemiMajorAxis.md)           | Convenience: compute only the **semi-major axis** ($a_t$) (m) of the Hohmann transfer.                                                             |
| [hohmannTransfer](functions/hohmannTransfer.md)                     | **Hohmann transfer** (coplanar, circular ($r_1 \to r_2$)).                                                                                         |
| [hohmannTransferTime](functions/hohmannTransferTime.md)             | Convenience: compute only the **transfer time** ($t_t$) (s).                                                                                       |
| [initialMassForDeltaV](functions/initialMassForDeltaV.md)           | Compute the **mass needed at ignition** to give a final mass a delta-v: the rocket equation solved for $m_0$.                                      |
| [massFlowRate](functions/massFlowRate.md)                           | Compute the **mass flow rate** of a rocket engine from its thrust and specific impulse.                                                            |
| [oberthEnergyGain](functions/oberthEnergyGain.md)                   | **Oberth effect (specific energy gain near periapsis)**.                                                                                           |
| [phasingWaitTime](functions/phasingWaitTime.md)                     | Compute how long to **wait for a phase angle**: when a target, leading a chaser on another circular orbit, will be at the angle a manoeuvre needs. |
| [planeChangeDeltaV](functions/planeChangeDeltaV.md)                 | **Inclination (plane) change** Δv at speed ($v$).                                                                                                  |
| [rocketDeltaVFromIsp](functions/rocketDeltaVFromIsp.md)             | Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using specific impulse.                                                         |
| [rocketDeltaVFromVe](functions/rocketDeltaVFromVe.md)               | Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using effective exhaust velocity.                                               |
| [rocketThrust](functions/rocketThrust.md)                           | Compute the **thrust** of a rocket engine from its exhaust, including the pressure term.                                                           |
| [solveLambert](functions/solveLambert.md)                           | Solve **Lambert's problem**: find the orbit that goes from one position to another in a given time.                                                |
| [thrustToWeight](functions/thrustToWeight.md)                       | Compute the **thrust-to-weight ratio** of a vehicle in a gravity field.                                                                            |

## Orbits

| Name                                                                                    | Description                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CwStateTransitionInterface](interfaces/CwStateTransitionInterface.md)                  | The Clohessy–Wiltshire state transition matrix $\Phi(t)$, split into its four 3×3 blocks: $\mathbf r(t) = \Phi_{rr}\mathbf r_0 + \Phi_{rv}\mathbf v_0$ and $\mathbf v(t) = \Phi_{vr}\mathbf r_0 + \Phi_{vv}\mathbf v_0$. |
| [atmosphericDragAcceleration](functions/atmosphericDragAcceleration.md)                 | Compute **atmospheric drag acceleration magnitude**.                                                                                                                                                                     |
| [characteristicEnergyC3](functions/characteristicEnergyC3.md)                           | Compute **characteristic energy** (C3) from hyperbolic excess speed.                                                                                                                                                     |
| [circularSpeed](functions/circularSpeed.md)                                             | **Circular speed** ($v_c$) for a body in a circular orbit at radius ($r$).                                                                                                                                               |
| [cwHillDerivatives](functions/cwHillDerivatives.md)                                     | Compute the **time-derivative** of a Clohessy–Wiltshire / Hill relative-motion state (right-hand side for ODE integration).                                                                                              |
| [cwPropagate](functions/cwPropagate.md)                                                 | **Propagate** a Clohessy–Wiltshire / Hill relative state in closed form.                                                                                                                                                 |
| [cwStateTransition](functions/cwStateTransition.md)                                     | Compute the **Clohessy–Wiltshire state transition matrix**: the closed-form solution of the CW / Hill equations.                                                                                                         |
| [elementsToState](functions/elementsToState.md)                                         | Convert the six **classical orbital elements** to a **state vector** (position and velocity).                                                                                                                            |
| [escapeSpeed](functions/escapeSpeed.md)                                                 | **Escape speed** ($v_{\text{esc}}$) - minimum speed to escape a central body's gravity from radius ($r$) (ignoring drag/perturbations).                                                                                  |
| [flightPathAngleFromTrueAnomaly](functions/flightPathAngleFromTrueAnomaly.md)           | **Flight-path angle** ($\gamma$) from **true anomaly** ($\nu$) and eccentricity ($e$).                                                                                                                                   |
| [hyperbolicEccentricity](functions/hyperbolicEccentricity.md)                           | Compute the **eccentricity of a hyperbola** from the excess speed and the periapsis distance.                                                                                                                            |
| [hyperbolicPeriapsisSpeed](functions/hyperbolicPeriapsisSpeed.md)                       | Compute **hyperbolic periapsis speed** for a flyby/escape hyperbola.                                                                                                                                                     |
| [hyperbolicSemiMajorAxis](functions/hyperbolicSemiMajorAxis.md)                         | Compute the **semi-major axis of a hyperbola** from the hyperbolic excess speed.                                                                                                                                         |
| [hyperbolicTimeOfFlight](functions/hyperbolicTimeOfFlight.md)                           | Compute the **time of flight between two points on a hyperbola**, given by their true anomalies.                                                                                                                         |
| [inclinationFromLaunchAzimuth](functions/inclinationFromLaunchAzimuth.md)               | Compute the **inclination** of the orbit reached by launching from a latitude on an azimuth.                                                                                                                             |
| [j2ArgumentOfPerigeeRate](functions/j2ArgumentOfPerigeeRate.md)                         | Compute **argument of perigee rotation** (J2 secular drift of ω) for an orbit about an oblate body.                                                                                                                      |
| [j2NodalPrecessionRate](functions/j2NodalPrecessionRate.md)                             | Compute **J2 nodal precession** (RAAN drift) for an orbit about an oblate body.                                                                                                                                          |
| [keplerPeriod](functions/keplerPeriod.md)                                               | **Kepler's 3rd law** - orbital period ($T$) from semi-major axis ($a$) and gravitational parameter ($\mu$).                                                                                                              |
| [launchAzimuthForInclination](functions/launchAzimuthForInclination.md)                 | Compute the **inertial launch azimuths** that reach an inclination from a latitude.                                                                                                                                      |
| [meanMotion](functions/meanMotion.md)                                                   | Compute **mean motion** for a (near-)circular reference orbit.                                                                                                                                                           |
| [periApoapsisRadii](functions/periApoapsisRadii.md)                                     | **Peri/apoapsis radii** from semi-major axis ($a$) and eccentricity ($e$).                                                                                                                                               |
| [rotatingLaunchAzimuth](functions/rotatingLaunchAzimuth.md)                             | Compute the **azimuth over the ground** for an inertial launch azimuth, on a rotating body.                                                                                                                              |
| [specificAngularMomentum](functions/specificAngularMomentum.md)                         | **Specific angular momentum** ($h$) (scalar magnitude).                                                                                                                                                                  |
| [specificAngularMomentumFromElements](functions/specificAngularMomentumFromElements.md) | **Specific angular momentum** ($h$) from **orbital elements**.                                                                                                                                                           |
| [specificMechanicalEnergy](functions/specificMechanicalEnergy.md)                       | **Specific mechanical energy** ($\varepsilon$) of a point mass in a central gravity field.                                                                                                                               |
| [sphereOfInfluenceRadius](functions/sphereOfInfluenceRadius.md)                         | Compute **sphere of influence** radius (patched conics approximation).                                                                                                                                                   |
| [stateToElements](functions/stateToElements.md)                                         | Convert a **state vector** (position and velocity) to the six **classical orbital elements**.                                                                                                                            |
| [surfaceRotationSpeed](functions/surfaceRotationSpeed.md)                               | Compute the **eastward speed** of a point on a rotating body's surface, at a latitude.                                                                                                                                   |
| [synodicPeriod](functions/synodicPeriod.md)                                             | Compute the **synodic period** of two bodies on circular orbits: the time between two alignments.                                                                                                                        |
| [visVivaSpeed](functions/visVivaSpeed.md)                                               | **Vis-viva (orbital speed)** - compute speed magnitude ($v$) from ($r$), ($a$), and ($\mu$).                                                                                                                             |

## Three-body

| Function                                          | Description                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [cr3bpDerivatives](functions/cr3bpDerivatives.md) | Compute the **time derivative** of a state in the circular restricted three-body problem (right-hand side for ODE integration). |
| [cr3bpMassRatio](functions/cr3bpMassRatio.md)     | Compute the **mass ratio** $\mu$ of the circular restricted three-body problem.                                                 |
| [cr3bpUnits](functions/cr3bpUnits.md)             | Compute the **units of the normalised CR3BP frame** for a pair of bodies.                                                       |
| [jacobiConstant](functions/jacobiConstant.md)     | Compute the **Jacobi constant** of a state in the circular restricted three-body problem.                                       |
