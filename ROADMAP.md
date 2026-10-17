# Roadmap

What Interstellar Tools intends to do, and not do, from October 2026 to
October 2027. It's a plan, not a promise: priorities can change, and changes to
this file are made in pull requests like any other. The detailed list of
equations still to add is in [TODO.md](TODO.md).

## Planned

### Correct, complete datasets

- **Comet angles:** store the true anomaly at J2000 in `orbit.angle`, as every
  other dataset does, instead of the mean anomaly.
- **Moon positions:** replace the placeholder angles (26 of the 27 moons are 0)
  with real J2000 values from published elements, checked by tests as the
  planets are.
- **Star systems:** add the orientation of each orbit in a pair (argument of
  periapsis and its reference frame), and model Spica as the binary it is.

### Propagation

- **A position after any span of time:** add a function for where a body is at a
  given time, without the 10-period cap that `advanceMeanAnomaly` uses for
  animation frames.

### New equations

Grow `@interstellar-tools/equations` along the lines in [TODO.md](TODO.md):
geodesy and distances on spheres and ellipsoids, map projections, perturbations
for low Earth orbit, and three-body tools such as the Jacobi integral and the
Tisserand parameter. Every new function comes with tests and documentation.

### Time

- Grow `@interstellar-tools/temporal` towards the time systems that orbit work
  needs, such as Julian dates and conversions between time scales.

### Documentation and learning

- **"In practice" boxes** for every equation category, with each number checked
  by a test, as the orbit equations already have.
- **A guide page per category**, like the existing manoeuvres guide.
- **More Learn tutorials**, such as planning a trip to Mars, why Proxima
  Centauri takes 547 000 years to orbit, a slingshot around Jupiter, and why
  satellites drift.

### Project health

- Reach the OpenSSF Best Practices **silver** level.
- Settle the dataset model and the equation APIs, working towards a stable 1.0.

## Not planned

- **Flight-certified or safety-critical software.** The equations are for
  learning, prototyping, visualisation and tooling, not for operating real
  spacecraft.
- **High-fidelity ephemerides or N-body integration.** For precise positions,
  use dedicated tools such as JPL Horizons or SPICE.
- **A graphical application.** The project provides libraries, data and an MCP
  server, not a user interface.
- **Collecting data.** The packages, the MCP server and the website don't
  collect personal data or telemetry, and won't.
