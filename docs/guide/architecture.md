# Architecture

Interstellar Tools is a TypeScript monorepo of five npm packages, managed with
npm workspaces. Each package is an ES module with its own version, changelog and
release.

## Packages and how they depend on each other

Dependencies only point one way, from the foundations up:

```text
@interstellar-tools/types        types only, no dependencies
        ↑
@interstellar-tools/constants    constants and datasets
        ↑
@interstellar-tools/temporal     time units and conversions
        ↑
@interstellar-tools/equations    orbital mechanics functions
        ↑
@interstellar-tools/mcp          MCP server (+ MCP SDK, Zod)
```

Each package depends on every package below it in this picture. Nothing depends
on a package above it, so there are no cycles.

| Package     | Contains                                                                                                         | Runtime dependencies                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `types`     | Interfaces and branded types: units (`Radians`, `TemporalInterface`), vectors, celestial bodies                  | None                                  |
| `constants` | Physical constants in SI units, and the celestial body datasets (`PLANETS`, `STARS`, …)                          | `types`                               |
| `temporal`  | Converting and normalising time units                                                                            | `types`, `constants`                  |
| `equations` | Pure functions, grouped by category: angles, anomalies, Kepler solvers, gravity, orbits, manoeuvres, cartography | `types`, `constants`, `temporal`      |
| `mcp`       | A Model Context Protocol server exposing the equations as tools and the datasets as resources                    | All of the above, the MCP SDK and Zod |

The libraries (`types`, `constants`, `temporal`, `equations`) have no runtime
dependencies outside the monorepo.

## Design

- **Pure functions.** Equations take numbers or typed values and return new
  values. They do no I/O, keep no state and have no side effects.
- **SI units throughout.** Inputs and outputs are in SI units unless a type says
  otherwise, such as `MeasureInterface` values that carry their own unit.
- **Fail loudly.** Functions validate their inputs and throw on invalid or
  out-of-domain values instead of returning a wrong number.
- **Typed units.** Branded types such as `Radians` stop degrees and radians from
  being mixed up at compile time.

### The orbit tree

The datasets in `constants` form a tree. Every body, system and galaxy has a
stable `id`. A body names what it is bound to in `parent` (a star, planet,
system barycenter or galaxy), and describes its motion around that parent in
`orbit` (an `OrbitInterface`: semi-major axis, eccentricity, period and true
anomaly at J2000). Systems are barycenter nodes, so multiple star systems nest:
Alpha Centauri A and B orbit the AB barycenter, which orbits the Alpha Centauri
system barycenter together with Proxima Centauri.

## The MCP server

`@interstellar-tools/mcp` wraps the equations as MCP tools, with every input
validated by a Zod schema, and serves the datasets as read-only resources. It
runs over stdio, or over Streamable HTTP for web assistants. Over HTTP it is
stateless (a fresh server per request) and, bound to loopback, only accepts
requests addressed to `localhost`, `127.0.0.1` or `[::1]`. See
[Using the MCP server](./mcp/).

## Build

- **TypeScript project references.** `npm run build` runs `tsc -b`, which builds
  each package once, in dependency order. Packages import each other by name and
  resolve to the built `dist` folder.
- **Two configs per package.** `tsconfig.build.json` compiles the published
  `dist` (JavaScript, declaration files and source maps, tests excluded).
  `tsconfig.json` covers sources and tests for editors and `npm run typecheck`,
  and emits nothing.
- **What's published.** Each package publishes only its `dist` folder.

## Documentation

- The [API reference](/api/) is generated from the TSDoc comments in the source
  with TypeDoc. CI fails on TypeDoc warnings, such as broken links.
- The dataset tables in the docs are generated from the built datasets by the
  scripts in `scripts/partials`.
- This site is built with VitePress.

## Quality and release

- **Tests** use Node's built-in test runner, with property-based tests
  (fast-check) for the equations. Every number shown in an "In practice" box is
  checked by a test.
- **CI** builds, lints, type-checks, checks the API docs and runs the tests on
  every pull request, and scans the code with CodeQL.
- **Releases** are made from conventional commits by `scripts/release.mjs`,
  which only releases packages with releasable changes and keeps the version
  ranges between packages in sync. Packages are published from GitHub Actions
  with npm trusted publishing and signed provenance. See
  [Development](./development) and [Upgrading](./upgrading).
