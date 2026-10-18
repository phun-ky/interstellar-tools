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

| Function                                                      | Description                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [advanceMeanAnomaly](functions/advanceMeanAnomaly.md)         | Advances an orbit by a time step and returns its new **mean anomaly** ($M$).         |
| [eccentricToTrueAnomaly](functions/eccentricToTrueAnomaly.md) | Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.         |
| [meanAnomalyAt](functions/meanAnomalyAt.md)                   | The **mean anomaly** ($M$) of an orbit at a given date.                              |
| [trueAnomalyAt](functions/trueAnomalyAt.md)                   | The **true anomaly** ($\nu$) of an orbit at a given date: where the body is.         |
| [trueToMeanAnomaly](functions/trueToMeanAnomaly.md)           | Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation. |

## Cartography

| Function                                                                            | Description                                                                                   |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [bodyFixedFromInertialDcmIAU](functions/bodyFixedFromInertialDcmIAU.md)             | Build the **IAU-style inertial → body-fixed** direction cosine matrix (DCM).                  |
| [eccentricitySquaredOblateSpheroid](functions/eccentricitySquaredOblateSpheroid.md) | Compute **first eccentricity squared** ($e^2$) for an oblate spheroid.                        |
| [flatteningOblateSpheroid](functions/flatteningOblateSpheroid.md)                   | Compute **flattening** ($f$) of an oblate spheroid.                                           |
| [isOnTriaxialEllipsoidSurface](functions/isOnTriaxialEllipsoidSurface.md)           | Test whether a 3D point lies on the surface of a **triaxial ellipsoid** (within a tolerance). |
| [planetocentricLatitude](functions/planetocentricLatitude.md)                       | Compute **planetocentric latitude** ($\varphi_c$) from body-fixed Cartesian coordinates.      |

## Gravity

| Function                                                      | Description                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [accelerationOn1By2](functions/accelerationOn1By2.md)         | Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²). |
| [forceOn1By2](functions/forceOn1By2.md)                       | Gravitational **force vector** on body 1 due to body 2 (newtons, N).   |
| [gravitationalForce](functions/gravitationalForce.md)         | Compute the Newtonian **gravitational force** on body 1 due to body 2. |
| [gravitationalParameter](functions/gravitationalParameter.md) | Two-body **gravitational parameter** ($\mu$).                          |

## Helpers

| Function                                  | Description                                                                           |
| ----------------------------------------- | ------------------------------------------------------------------------------------- |
| [applyMatrix3](functions/applyMatrix3.md) | Apply a **3×3 matrix** to a **3D vector** (matrix–vector multiplication).             |
| [det3](functions/det3.md)                 | Compute the **determinant** of a **3×3** matrix (row-major).                          |
| [dot](functions/dot.md)                   | Compute the **dot product** of two 3D vectors.                                        |
| [matMul3](functions/matMul3.md)           | Multiply two **3×3 matrices** (row-major).                                            |
| [norm](functions/norm.md)                 | Compute the **Euclidean norm** (length / magnitude) of a 3D vector.                   |
| [norm2pi](functions/norm2pi.md)           | Normalize an angle to the range **\[0, 2π)**.                                         |
| [rad](functions/rad.md)                   | Brand a numeric value as [Radians](../types/type-aliases/Radians.md).                 |
| [rot1](functions/rot1.md)                 | Construct a **right-handed rotation matrix about the x-axis** (often written **R₁**). |
| [rot3](functions/rot3.md)                 | Construct a **right-handed rotation matrix about the z-axis** (often written **R₃**). |
| [scale](functions/scale.md)               | Scale a 3D vector by a scalar.                                                        |
| [sub](functions/sub.md)                   | Subtract two 3D vectors (`a - b`).                                                    |
| [toRad](functions/toRad.md)               | Convert **degrees → radians**.                                                        |
| [transpose3](functions/transpose3.md)     | Transpose a **3×3 matrix** (row-major).                                               |

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
| [solveKeplerNewtonRaphson](functions/solveKeplerNewtonRaphson.md)       | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method** with Householder acceleration for fast convergence. |

## Manoeuvres

| Function                                                            | Description                                                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [combineBurnsDeltaV](functions/combineBurnsDeltaV.md)               | **Combine non-collinear burns** (vector law / law of cosines for velocities).                        |
| [gravityAssistTurningAngle](functions/gravityAssistTurningAngle.md) | Compute **gravity-assist turning angle** (flyby deflection) for a hyperbolic encounter.              |
| [hohmannSemiMajorAxis](functions/hohmannSemiMajorAxis.md)           | Convenience: compute only the **semi-major axis** ($a_t$) (m) of the Hohmann transfer.               |
| [hohmannTransfer](functions/hohmannTransfer.md)                     | **Hohmann transfer** (coplanar, circular ($r_1 \to r_2$)).                                           |
| [hohmannTransferTime](functions/hohmannTransferTime.md)             | Convenience: compute only the **transfer time** ($t_t$) (s).                                         |
| [oberthEnergyGain](functions/oberthEnergyGain.md)                   | **Oberth effect (specific energy gain near periapsis)**.                                             |
| [planeChangeDeltaV](functions/planeChangeDeltaV.md)                 | **Inclination (plane) change** Δv at speed ($v$).                                                    |
| [rocketDeltaVFromIsp](functions/rocketDeltaVFromIsp.md)             | Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using specific impulse.           |
| [rocketDeltaVFromVe](functions/rocketDeltaVFromVe.md)               | Compute ideal **delta-v** from the **Tsiolkovsky rocket equation** using effective exhaust velocity. |

## Orbits

| Function                                                                                | Description                                                                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [atmosphericDragAcceleration](functions/atmosphericDragAcceleration.md)                 | Compute **atmospheric drag acceleration magnitude**.                                                                                    |
| [characteristicEnergyC3](functions/characteristicEnergyC3.md)                           | Compute **characteristic energy** (C3) from hyperbolic excess speed.                                                                    |
| [circularSpeed](functions/circularSpeed.md)                                             | **Circular speed** ($v_c$) for a body in a circular orbit at radius ($r$).                                                              |
| [cwHillDerivatives](functions/cwHillDerivatives.md)                                     | Compute the **time-derivative** of a Clohessy–Wiltshire / Hill relative-motion state (right-hand side for ODE integration).             |
| [escapeSpeed](functions/escapeSpeed.md)                                                 | **Escape speed** ($v_{\text{esc}}$) - minimum speed to escape a central body's gravity from radius ($r$) (ignoring drag/perturbations). |
| [flightPathAngleFromTrueAnomaly](functions/flightPathAngleFromTrueAnomaly.md)           | **Flight-path angle** ($\gamma$) from **true anomaly** ($\nu$) and eccentricity ($e$).                                                  |
| [hyperbolicPeriapsisSpeed](functions/hyperbolicPeriapsisSpeed.md)                       | Compute **hyperbolic periapsis speed** for a flyby/escape hyperbola.                                                                    |
| [j2ArgumentOfPerigeeRate](functions/j2ArgumentOfPerigeeRate.md)                         | Compute **argument of perigee rotation** (J2 secular drift of ω) for an orbit about an oblate body.                                     |
| [j2NodalPrecessionRate](functions/j2NodalPrecessionRate.md)                             | Compute **J2 nodal precession** (RAAN drift) for an orbit about an oblate body.                                                         |
| [keplerPeriod](functions/keplerPeriod.md)                                               | **Kepler's 3rd law** - orbital period ($T$) from semi-major axis ($a$) and gravitational parameter ($\mu$).                             |
| [meanMotion](functions/meanMotion.md)                                                   | Compute **mean motion** for a (near-)circular reference orbit.                                                                          |
| [periApoapsisRadii](functions/periApoapsisRadii.md)                                     | **Peri/apoapsis radii** from semi-major axis ($a$) and eccentricity ($e$).                                                              |
| [specificAngularMomentum](functions/specificAngularMomentum.md)                         | **Specific angular momentum** ($h$) (scalar magnitude).                                                                                 |
| [specificAngularMomentumFromElements](functions/specificAngularMomentumFromElements.md) | **Specific angular momentum** ($h$) from **orbital elements**.                                                                          |
| [specificMechanicalEnergy](functions/specificMechanicalEnergy.md)                       | **Specific mechanical energy** ($\varepsilon$) of a point mass in a central gravity field.                                              |
| [sphereOfInfluenceRadius](functions/sphereOfInfluenceRadius.md)                         | Compute **sphere of influence** radius (patched conics approximation).                                                                  |
| [visVivaSpeed](functions/visVivaSpeed.md)                                               | **Vis-viva (orbital speed)** - compute speed magnitude ($v$) from ($r$), ($a$), and ($\mu$).                                            |
