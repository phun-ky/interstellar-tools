[Documentation](../index.md) /
[**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

# [**@interstellar-tools/equations**](https://github.com/interstellar-tools/equations)

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher
- npm version 11.5.1 or higher

::: code-group

```shell [npm]
npm i --save @interstellar-tools/equations
```

```shell [yarn]
yarn add @interstellar-tools/equations
```

:::

Here you will find a set of function that can assist you when calculating
orbits, angles, solve for kelper or find true anomalies.

## Angle

| Function                                  | Description                                                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [computeAngle](equations/computeAngle.md) | Computes the orbital angle (true anomaly, $ν$) of a celestial body for a given date and time step.                                                      |
| [wrapAngle](equations/wrapAngle.md)       | Wrap an angle (in **radians**) to a **single-turn range** and snap values extremely close to **±τ** (±`2π`) back to **0** to curb floating-point drift. |

## Anomaly

| Function                                                          | Description                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [computeMeanAnomaly](equations/computeMeanAnomaly.md)             | Computes the **mean anomaly** ($M$) of a celestial body for a given time step.       |
| [eccentricToTrueAnomaly](equations/eccentricToTrueAnomaly.md)     | Converts **Eccentric Anomaly** ($E$) to **True Anomaly** ($V$) for an orbit.         |
| [trueAnomalyToMeanAnomaly](equations/trueAnomalyToMeanAnomaly.md) | Converts **true anomaly** ($\nu$) to **mean anomaly** ($M$) using Kepler's equation. |

## Solve for Kepler

| Function                                                                | Description                                                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [solveKepler](equations/solveKepler.md)                                 | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using an adaptive approach: - **Newton-Raphson method** for fast convergence. - **Bisection fallback** if Newton’s method fails. - **High-eccentricity solver** for extreme orbits ($e > 0.9$). |
| [solveKeplerBisection](equations/solveKeplerBisection.md)               | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **bisection method** when Newton-Raphson or other iterative solvers fail to converge.                                                                                                 |
| [solveKeplerHighEccentricity](equations/solveKeplerHighEccentricity.md) | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) in highly eccentric orbits ($e > 0.9$) using an iterative numerical approach.                                                                                                                   |
| [solveKeplerNewtonRaphson](equations/solveKeplerNewtonRaphson.md)       | Solves **Kepler's Equation** for the **Eccentric Anomaly** ($E$) using the **Newton-Raphson method** with Householder acceleration for fast convergence.                                                                                                         |
