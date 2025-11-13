[Documentation](../../index.md) /
[**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

# [**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

```shell [npm]
npm i --save @interstellar-tools/equations
```

Here you will find a set of function that can assist you when calculating
orbits, angles, solve for kelper or find true anomalies.

## Angle

| Function                                  | Description                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [computeAngle](functions/computeAngle.md) | Computes the orbital angle (true anomaly, $ν$) of a celestial body for a given date and time step.                                                      |
| [wrapAngle](functions/wrapAngle.md)       | Wrap an angle (in **radians**) to a **single-turn range** and snap values extremely close to **±τ** (±`2π`) back to **0** to curb floating-point drift. |

## Anomaly

| Function                                                          | Description                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [computeMeanAnomaly](functions/computeMeanAnomaly.md)             | Computes the **mean anomaly** ($M$) of a celestial body for a given time step.       |
| [eccentricToTrueAnomaly](functions/eccentricToTrueAnomaly.md)     | Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.         |
| [trueAnomalyToMeanAnomaly](functions/trueAnomalyToMeanAnomaly.md) | Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation. |

## Dynamics

| Function                                                                        | Description                                                                                                 |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [gravitationalAccelerationOn1By2](functions/gravitationalAccelerationOn1By2.md) | Gravitational **acceleration** of body 1 due to body 2 (vector, m/s²).                                      |
| [gravitationalForce](functions/gravitationalForce.md)                           | Compute the Newtonian **gravitational force** on body 1 due to body 2.                                      |
| [gravitationalForceOn1By2](functions/gravitationalForceOn1By2.md)               | Gravitational **force vector** on body 1 due to body 2 (newtons, N).                                        |
| [gravitationalParameter](functions/gravitationalParameter.md)                   | Two-body **gravitational parameter** ($\mu$).                                                               |
| [keplerPeriod](functions/keplerPeriod.md)                                       | **Kepler's 3rd law** - orbital period ($T$) from semi-major axis ($a$) and gravitational parameter ($\mu$). |
| [specificMechanicalEnergy](functions/specificMechanicalEnergy.md)               | **Specific mechanical energy** ($\varepsilon$) of a point mass in a central gravity field.                  |
| [visVivaSpeed](functions/visVivaSpeed.md)                                       | **Vis-viva (orbital speed)** - compute speed magnitude ($v$) from ($r$), ($a$), and ($\mu$).                |

## Solve for Kepler

| Function                                                                | Description                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [solveKepler](functions/solveKepler.md)                                 | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach: - **Newton-Raphson method** for fast convergence. - **Bisection fallback** if Newton’s method fails. - **High-eccentricity solver** for extreme orbits ($e > 0.9$). |
| [solveKeplerBisection](functions/solveKeplerBisection.md)               | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **bisection method** when Newton-Raphson or other iterative solvers fail to converge.                                                                                                 |
| [solveKeplerHighEccentricity](functions/solveKeplerHighEccentricity.md) | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly eccentric orbits ($e > 0.9$) using an iterative numerical approach.                                                                                                                   |
| [solveKeplerNewtonRaphson](functions/solveKeplerNewtonRaphson.md)       | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method** with Householder acceleration for fast convergence.                                                                                                         |
