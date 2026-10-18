# Roadmap

What Interstellar Tools intends to do, and not do, from October 2026 to
October 2027. It's a plan, not a promise: priorities can change, and changes to
this file are made in pull requests like any other. Individual pieces of work
are tracked as
[GitHub issues](https://github.com/phun-ky/interstellar-tools/issues), and the
formulas that could be added are listed in the [equation backlog](TODO.md).

## Planned

### Correct, complete datasets

- **Moon positions:** replace the placeholder angles (26 of the 27 moons are 0)
  with real J2000 values from published elements, checked by tests as the
  planets are
  ([#154](https://github.com/phun-ky/interstellar-tools/issues/154)).
- **Star systems:** add the orientation of each orbit in a pair
  ([#155](https://github.com/phun-ky/interstellar-tools/issues/155)), and model
  Spica as the binary it is
  ([#156](https://github.com/phun-ky/interstellar-tools/issues/156)).

### Propagation

- **A position after any span of time:** add a function for where a body is at a
  given time, without the 10-period cap that `advanceMeanAnomaly` uses for
  animation frames
  ([#152](https://github.com/phun-ky/interstellar-tools/issues/152)).

### New equations

Grow `@interstellar-tools/equations` along the lines in the
[equation backlog](TODO.md): geodesy and distances on spheres and ellipsoids,
map projections, perturbations for low Earth orbit, and three-body tools such as
the Jacobi integral and the Tisserand parameter. Every new function comes with
tests and documentation.

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

### A stable 1.0

Release every current package (`types`, `constants`, `temporal`, `equations` and
`mcp`) as 1.0, together: a promise that their API won't break without a major
version. Packages added later start below 1.0. The work is in the
[1.0 milestone](https://github.com/phun-ky/interstellar-tools/milestone/1), and
covers the decisions that would be breaking changes afterwards:

- release breaking changes as major versions after 1.0
  ([#148](https://github.com/phun-ky/interstellar-tools/issues/148))
- let the orbit tree from 0.61 settle in use first
  ([#149](https://github.com/phun-ky/interstellar-tools/issues/149))
- put `mu` last in every equation
  ([#151](https://github.com/phun-ky/interstellar-tools/issues/151))
- decide how `advanceMeanAnomaly` handles long spans
  ([#152](https://github.com/phun-ky/interstellar-tools/issues/152))
- decide whether display fields belong in the core types
  ([#153](https://github.com/phun-ky/interstellar-tools/issues/153))
- review the `temporal` API
  ([#162](https://github.com/phun-ky/interstellar-tools/issues/162))
- review the MCP server's tools, resources and options, which assistant setups
  depend on ([#163](https://github.com/phun-ky/interstellar-tools/issues/163))

Adding to a package after 1.0, such as new time scales in `temporal`, is a minor
release, so 1.0 doesn't stop the packages from growing.

### Project health

- Reach the OpenSSF Best Practices **silver** level.

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
