[Documentation](../../index.md) /
[**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

# [**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

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

## Angles

| Function                                  | Description                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [computeAngle](functions/computeAngle.md) | Computes the orbital angle (true anomaly, $ν$) of a celestial body for a given date and time step.                                                      |
| [wrapAngle](functions/wrapAngle.md)       | Wrap an angle (in **radians**) to a **single-turn range** and snap values extremely close to **±τ** (±`2π`) back to **0** to curb floating-point drift. |

## Anomalies

| Function                                                      | Description                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [eccentricToTrueAnomaly](functions/eccentricToTrueAnomaly.md) | Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.         |
| [meanToEccentricAnomaly](functions/meanToEccentricAnomaly.md) | Computes the **mean anomaly** ($M$) of a celestial body for a given time step.       |
| [trueToMeanAnomaly](functions/trueToMeanAnomaly.md)           | Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation. |

## Gravity

| Function                                                      | Description                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [accelerationOn1By2](functions/accelerationOn1By2.md)         | Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²). |
| [forceOn1By2](functions/forceOn1By2.md)                       | Gravitational **force vector** on body 1 due to body 2 (newtons, N).   |
| [gravitationalForce](functions/gravitationalForce.md)         | Compute the Newtonian **gravitational force** on body 1 due to body 2. |
| [gravitationalParameter](functions/gravitationalParameter.md) | Two-body **gravitational parameter** ($\mu$).                          |

## Kepler Solvers

| Function                                                                | Description                                                                                                                                              |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [solveKepler](functions/solveKepler.md)                                 | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach:                                                             |
| [solveKeplerBisection](functions/solveKeplerBisection.md)               | Solve **Kepler's equation** for the **eccentric anomaly** ($E$) via **bisection** (elliptic case: ($0 \le e < 1$)).                                      |
| [solveKeplerHighEccentricity](functions/solveKeplerHighEccentricity.md) | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly eccentric orbits ($e > 0.9$) using an iterative numerical approach.           |
| [solveKeplerNewtonRaphson](functions/solveKeplerNewtonRaphson.md)       | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method** with Householder acceleration for fast convergence. |

## Manoeuvres

| Function                                                  | Description                                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [hohmannSemiMajorAxis](functions/hohmannSemiMajorAxis.md) | Convenience: compute only the **semi-major axis** ($a_t$) (m) of the Hohmann transfer. |
| [hohmannTransfer](functions/hohmannTransfer.md)           | **Hohmann transfer** (coplanar, circular ($r_1 \to r_2$)).                             |
| [hohmannTransferTime](functions/hohmannTransferTime.md)   | Convenience: compute only the **transfer time** ($t_t$) (s).                           |
| [planeChangeDeltaV](functions/planeChangeDeltaV.md)       | **Inclination (plane) change** Δv at speed ($v$).                                      |

## Orbits

| Function                                                                                | Description                                                                                                                             |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [circularSpeed](functions/circularSpeed.md)                                             | **Circular speed** ($v_c$) for a body in a circular orbit at radius ($r$).                                                              |
| [escapeSpeed](functions/escapeSpeed.md)                                                 | **Escape speed** ($v_{\text{esc}}$) - minimum speed to escape a central body's gravity from radius ($r$) (ignoring drag/perturbations). |
| [flightPathAngleFromTrueAnomaly](functions/flightPathAngleFromTrueAnomaly.md)           | **Flight-path angle** ($\gamma$) from **true anomaly** ($\nu$) and eccentricity ($e$).                                                  |
| [keplerPeriod](functions/keplerPeriod.md)                                               | **Kepler's 3rd law** - orbital period ($T$) from semi-major axis ($a$) and gravitational parameter ($\mu$).                             |
| [specificAngularMomentum](functions/specificAngularMomentum.md)                         | **Specific angular momentum** ($h$) (scalar magnitude).                                                                                 |
| [specificAngularMomentumFromElements](functions/specificAngularMomentumFromElements.md) | **Specific angular momentum** ($h$) from **orbital elements**.                                                                          |
| [specificMechanicalEnergy](functions/specificMechanicalEnergy.md)                       | **Specific mechanical energy** ($\varepsilon$) of a point mass in a central gravity field.                                              |
| [visVivaSpeed](functions/visVivaSpeed.md)                                               | **Vis-viva (orbital speed)** - compute speed magnitude ($v$) from ($r$), ($a$), and ($\mu$).                                            |
