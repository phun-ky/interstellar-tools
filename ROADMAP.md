# Roadmap

What Interstellar Tools intends to do, and not do, from October 2026 to
October 2027. It's a plan, not a promise: priorities can change, and changes to
this file are made in pull requests like any other. Individual pieces of work
are tracked as
[GitHub issues](https://github.com/phun-ky/interstellar-tools/issues), and the
formulas that could be added are listed in the [equation backlog](TODO.md).

## Planned

### A stable 1.0

Every current package (`types`, `constants`, `temporal`, `equations` and `mcp`)
goes to 1.0 together: a promise that their API won't break without a major
version. The
[1.0 milestone](https://github.com/phun-ky/interstellar-tools/milestone/1) is
complete; it settled the decisions that would be breaking changes afterwards,
from the orbit tree and the `display` split to the temporal and MCP APIs, and
got the datasets ready (real J2000 angles for every moon, `mu` for the major
bodies, Spica as a binary). What's left is the release itself.

After 1.0, a deprecated API keeps working for one full major, and the current
major is supported as a whole; see the
[security policy](SECURITY.md#supported-versions). Packages added later start
below 1.0.

### Maps and topography

The focus after 1.0, in the
[Maps and topography milestone](https://github.com/phun-ky/interstellar-tools/milestone/2):
everything needed to map a planet, from distances on its surface to the terrain
around a landing site. It isn't a major release: the work ships as minor
releases as it lands, and 2.0 stays reserved for breaking changes.

- **Geodesy, in `@interstellar-tools/equations`** (cartography): reference
  ellipsoids ([#183](https://github.com/phun-ky/interstellar-tools/issues/183)),
  great-circle distance
  ([#184](https://github.com/phun-ky/interstellar-tools/issues/184)), radii of
  curvature ([#185](https://github.com/phun-ky/interstellar-tools/issues/185)),
  geodetic and body-fixed coordinates
  ([#186](https://github.com/phun-ky/interstellar-tools/issues/186)), height
  above the surface
  ([#187](https://github.com/phun-ky/interstellar-tools/issues/187)), the
  horizon ([#188](https://github.com/phun-ky/interstellar-tools/issues/188)) and
  areas on a sphere
  ([#189](https://github.com/phun-ky/interstellar-tools/issues/189)).
- **A new `@interstellar-tools/maps` package**
  ([#181](https://github.com/phun-ky/interstellar-tools/issues/181)), starting
  at 0.x so its API can settle before its own 1.0:
  - map projections: Mercator and equirectangular
    ([#190](https://github.com/phun-ky/interstellar-tools/issues/190)),
    sinusoidal and Mollweide
    ([#191](https://github.com/phun-ky/interstellar-tools/issues/191)), and
    azimuthal projections
    ([#192](https://github.com/phun-ky/interstellar-tools/issues/192))
  - web map tiles and quadkeys
    ([#193](https://github.com/phun-ky/interstellar-tools/issues/193))
  - terrain from elevation grids
    ([#182](https://github.com/phun-ky/interstellar-tools/issues/182)): slope
    and aspect
    ([#194](https://github.com/phun-ky/interstellar-tools/issues/194)),
    hillshading
    ([#195](https://github.com/phun-ky/interstellar-tools/issues/195)),
    curvature
    ([#196](https://github.com/phun-ky/interstellar-tools/issues/196)),
    roughness ([#197](https://github.com/phun-ky/interstellar-tools/issues/197))
    and wetness
    ([#198](https://github.com/phun-ky/interstellar-tools/issues/198))
  - imaging geometry
    ([#199](https://github.com/phun-ky/interstellar-tools/issues/199)) and a
    lander tip-over check
    ([#200](https://github.com/phun-ky/interstellar-tools/issues/200))
- **Docs and tools:** guide pages
  ([#201](https://github.com/phun-ky/interstellar-tools/issues/201)), a Learn
  tutorial on choosing a landing site on Mars
  ([#202](https://github.com/phun-ky/interstellar-tools/issues/202)), and MCP
  tools for geodesy and projections
  ([#203](https://github.com/phun-ky/interstellar-tools/issues/203)).

### More equations

After maps, grow `@interstellar-tools/equations` along the rest of the
[equation backlog](TODO.md): perturbations for low Earth orbit, entry, descent
and landing, attitude dynamics, and three-body tools such as the Jacobi integral
and the Tisserand parameter. Every new function comes with tests and
documentation.

### Time

- Grow `@interstellar-tools/temporal` towards the time systems that orbit work
  needs, such as Julian dates and conversions between time scales.

### Documentation and learning

- **"In practice" boxes** for every equation category, with each number checked
  by a test, as the orbit equations already have.
- **A guide page per category**, like the existing manoeuvres guide.
- **More Learn tutorials**, such as planning a trip to Mars, why Proxima
  Centauri takes 547 000 years to orbit, a slingshot around Jupiter, why
  satellites drift, and choosing a landing site on Mars
  ([#202](https://github.com/phun-ky/interstellar-tools/issues/202)).

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
