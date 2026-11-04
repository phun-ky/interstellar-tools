# Learn

Tutorials that explain _why_ the equations work, by following one question from
start to finish with real numbers. Each one builds on the [reference](/api/),
where the main orbit equations also have a short "In practice" box with one real
situation.

| Tutorial                                                              | You'll learn                                                            | Equations                                                                                           |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Where is Earth today?](/learn/where-is-earth-today)                  | Mean, eccentric and true anomaly; Kepler's equation                     | `trueToMeanAnomaly`, `solveKepler`, `eccentricToTrueAnomaly`                                        |
| [Apollo 11: there and back again](/learn/apollo-11/)                  | The whole Moon mission, chapter by chapter                              | Most of `equations`; the prologue uses `initialMassForDeltaV`                                       |
| [Choose a landing site on Mars](/learn/choose-a-landing-site-on-mars) | Slope, roughness and shading from real terrain; when a lander tips over | `slopeGrid`, `terrainRoughnessIndexGrid`, `hillshadeGrid`, `safeLandingGrid`, `greatCircleDistance` |
