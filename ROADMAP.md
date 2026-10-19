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
bodies, Spica as a binary), and 1.0 was released on 18 October 2026.

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

### Satellite tracking

After maps, in the
[Satellite tracking milestone](https://github.com/phun-ky/interstellar-tools/milestone/3):
tracking satellites and deep-space probes, drawing them on flat maps and globes,
and the Lagrange points. Like maps, it ships as minor releases as it lands.

- **A new `@interstellar-tools/tracking` package**
  ([#207](https://github.com/phun-ky/interstellar-tools/issues/207)), starting
  at 0.x, with two categories:
  - `satellites`: TLE and OMM elements
    ([#210](https://github.com/phun-ky/interstellar-tools/issues/210)), SGP4 and
    SDP4 propagation
    ([#211](https://github.com/phun-ky/interstellar-tools/issues/211)), the
    point under a satellite
    ([#212](https://github.com/phun-ky/interstellar-tools/issues/212)), look
    angles and Doppler
    ([#213](https://github.com/phun-ky/interstellar-tools/issues/213)), pass
    predictions
    ([#214](https://github.com/phun-ky/interstellar-tools/issues/214)), and a
    small, dated CelesTrak snapshot of well-known satellites
    ([#216](https://github.com/phun-ky/interstellar-tools/issues/216))
  - `probes`: positions from JPL Horizons and CCSDS ephemeris files
    ([#217](https://github.com/phun-ky/interstellar-tools/issues/217)), and a
    dataset of notable probes
    ([#218](https://github.com/phun-ky/interstellar-tools/issues/218))
- **On maps and globes:** ground tracks split at the antimeridian, coverage
  footprints ([#219](https://github.com/phun-ky/interstellar-tools/issues/219)),
  and 3D paths and orthographic views
  ([#220](https://github.com/phun-ky/interstellar-tools/issues/220)), using the
  projections from the maps milestone.
- **Time and the sky:** Julian dates and time scales with a leap second table
  ([#208](https://github.com/phun-ky/interstellar-tools/issues/208)), Earth
  rotation and sidereal time
  ([#209](https://github.com/phun-ky/interstellar-tools/issues/209)), and the
  Sun's position with satellite eclipses
  ([#215](https://github.com/phun-ky/interstellar-tools/issues/215)).
- **Drag and perturbations**, requested by OrbitNTNU: atmospheric density models
  ([#226](https://github.com/phun-ky/interstellar-tools/issues/226)), orbit
  decay and lifetime
  ([#227](https://github.com/phun-ky/interstellar-tools/issues/227)), numerical
  propagation with a force model
  ([#228](https://github.com/phun-ky/interstellar-tools/issues/228)),
  sun-synchronous and frozen orbits
  ([#229](https://github.com/phun-ky/interstellar-tools/issues/229)), and
  fitting TLEs to propagated states
  ([#230](https://github.com/phun-ky/interstellar-tools/issues/230)).
- **Lagrange points**, the Hill sphere and the Jacobi integral in `equations`
  ([#221](https://github.com/phun-ky/interstellar-tools/issues/221)).
- **Docs and tools:** guide pages
  ([#222](https://github.com/phun-ky/interstellar-tools/issues/222)), a Learn
  tutorial on where the ISS is and when to see it
  ([#223](https://github.com/phun-ky/interstellar-tools/issues/223)), and MCP
  tools ([#224](https://github.com/phun-ky/interstellar-tools/issues/224)).

The libraries never fetch data: users bring the elements or ephemerides, and the
docs show where to get them.

### More equations

After that, grow `@interstellar-tools/equations` along the rest of the
[equation backlog](TODO.md): perturbations for low Earth orbit, entry, descent
and landing, attitude dynamics, and the Tisserand parameter. Every new function
comes with tests and documentation.

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
- **High-fidelity ephemerides or N-body integration of planets.** For precise
  positions, use dedicated tools such as JPL Horizons or SPICE, and for
  high-fidelity mission analysis GMAT or Orekit. The numerical propagator for a
  single satellite with a force model is planned, but not at that fidelity. The
  tracking package reads their output; it doesn't replace them.
- **Live data feeds.** The libraries don't fetch orbital elements or
  ephemerides; users pass them in.
- **A graphical application.** The project provides libraries, data and an MCP
  server, not a user interface.
- **Collecting data.** The packages, the MCP server and the website don't
  collect personal data or telemetry, and won't.
