# Learn

Tutorials that explain _why_ the equations work, by following one question from
start to finish with real numbers. Each one builds on the [reference](/api/),
where the main orbit equations also have a short "In practice" box with one real
situation.

| Tutorial                                                              | You'll learn                                                                        | Equations                                                                                           |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [Where is Earth today?](/learn/where-is-earth-today)                  | Mean, eccentric and true anomaly; Kepler's equation                                 | `trueToMeanAnomaly`, `solveKepler`, `eccentricToTrueAnomaly`                                        |
| [Apollo 11: there and back again](/learn/apollo-11/)                  | The whole Moon mission, chapter by chapter                                          | Most of `equations`; the prologue uses `initialMassForDeltaV`                                       |
| [Choose a landing site on Mars](/learn/choose-a-landing-site-on-mars) | Slope, roughness and shading from real terrain; when a lander tips over             | `slopeGrid`, `terrainRoughnessIndexGrid`, `hillshadeGrid`, `safeLandingGrid`, `greatCircleDistance` |
| [Where is the ISS, and when can I see it?](/learn/where-is-the-iss)   | Orbital elements and SGP4; ground tracks; visible passes; Lagrange points           | `propagate`, `subSatellitePoint`, `groundTrack`, `predictPasses`, `isVisiblePass`, `lagrangePoints` |
| [How long is a day on Mars?](/learn/days-on-other-worlds)             | Sidereal and solar days on every world; the Martian sol; Mars time and mission sols | `solarDayLength`, `marsSolDate`, `coordinatedMarsTime`, `marsLocalMeanSolarTime`, `missionSol`      |
