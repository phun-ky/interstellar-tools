[Documentation](../../index.md) /
[**@interstellar-tools/mcp**](https://github.com/interstellar-tools/mcp)

# [**@interstellar-tools/mcp**](https://github.com/interstellar-tools/mcp)

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that
gives AI assistants deterministic, unit-explicit orbital mechanics calculations
and celestial body datasets, backed by `@interstellar-tools/equations`,
`@interstellar-tools/constants` and `@interstellar-tools/temporal`.

## Documentation

The full documentation lives at
**[phun-ky.net/interstellar-tools](https://phun-ky.net/interstellar-tools/)**:

- [Using the MCP server](https://phun-ky.net/interstellar-tools/guide/mcp/):
  step-by-step setup for Claude, ChatGPT, Mistral Le Chat, Gemini, GitHub
  Copilot, Cursor, JetBrains and more
- [API reference for `@interstellar-tools/mcp`](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/mcp/)
- [API reference for the equations](https://phun-ky.net/interstellar-tools/api/@interstellar-tools/equations/)
  that every tool wraps

## Installation

- [Node.js](https://nodejs.org/) version 22.9.0 or higher

Add it to any MCP client that launches stdio servers, for example:

```json
{
  "mcpServers": {
    "interstellar-tools": {
      "command": "npx",
      "args": ["-y", "@interstellar-tools/mcp"]
    }
  }
}
```

Or with Claude Code:

```shell
claude mcp add interstellar-tools -- npx -y @interstellar-tools/mcp
```

### Remote (HTTP)

Web assistants such as claude.ai, ChatGPT and Mistral Le Chat connect to remote
servers only. Serve Streamable HTTP and put it behind HTTPS (a tunnel such as
`cloudflared tunnel --url http://localhost:3000 --http-host-header localhost:3000`
is enough for testing):

```shell
npx -y @interstellar-tools/mcp --http --port 3000
# → http://127.0.0.1:3000/mcp
```

The server is stateless and binds to `127.0.0.1` unless you pass
`--host 0.0.0.0`. On loopback it only answers requests addressed to `localhost`,
`127.0.0.1` or `[::1]`, which protects it from DNS rebinding; pass
`--allowed-hosts` with your public host name when you serve it elsewhere.
Step-by-step setup for each assistant is in the
[MCP guide](https://phun-ky.net/interstellar-tools/guide/mcp/).

## Units

Every input and output field name ends with its unit: `r_m` (metres), `m0_kg`
(kilograms), `v_m_s` (m/s), `mu_m3_s2` (m³/s²), `T_s` / `T_d` (seconds / days).
Angles are passed as `{ "value": 28.5, "unit": "deg" }` (or `"rad"`) and
returned as `{ "rad": …, "deg": … }`.

## Tools

| Tool                         | What it computes                                                    |
| ---------------------------- | ------------------------------------------------------------------- |
| `gravitational_parameter`    | μ = G·(M + m) from masses                                           |
| `circular_speed`             | Circular orbit speed at radius r                                    |
| `escape_speed`               | Escape speed at radius r                                            |
| `vis_viva_speed`             | Speed at radius r on an orbit with semi-major axis a                |
| `kepler_period`              | Orbital period from semi-major axis                                 |
| `peri_apoapsis_radii`        | Periapsis and apoapsis radii from a and e                           |
| `sphere_of_influence_radius` | Laplace sphere of influence                                         |
| `state_to_elements`          | Orbital elements from a position and velocity                       |
| `elements_to_state`          | Position and velocity from orbital elements                         |
| `hohmann_transfer`           | Both burns, total Δv and transfer time                              |
| `rocket_delta_v`             | Tsiolkovsky rocket equation from Isp and masses                     |
| `plane_change_delta_v`       | Δv for a pure inclination change                                    |
| `solve_lambert`              | Velocities for a transfer between two positions in a given time     |
| `hyperbolic_departure`       | Δv, C3 and eccentricity to leave or be captured with a given v∞     |
| `solve_kepler`               | Eccentric anomaly from mean anomaly and eccentricity                |
| `convert_anomaly`            | Mean ↔ eccentric ↔ true anomaly (elliptic orbits)                   |
| `convert_time`               | Duration between units, attoseconds to gigayears                    |
| `convert_distance`           | Distance between units, metres to gigaparsecs                       |
| `great_circle_distance`      | Distance and central angle between two points on a body             |
| `horizon_distance`           | How far an observer at a height can see                             |
| `geodetic_to_body_fixed`     | Body-fixed x, y, z from latitude, longitude and height              |
| `body_fixed_to_geodetic`     | Latitude, longitude and height from body-fixed x, y, z              |
| `project_point`              | Map x and y of a point in one of seven projections                  |
| `satellite_position`         | Point below a satellite, its height and TEME state, from TLE or OMM |
| `look_angles`                | Azimuth, elevation, range and Doppler shift from a ground observer  |
| `satellite_passes`           | Rise, highest point and set over an observer, and visibility        |
| `probe_position`             | Where a deep-space probe is, from the bundled ephemerides           |
| `lagrange_points`            | L1 to L5 of two bodies, Trojan stability and the Hill sphere        |
| `find_body`                  | Look up planets, moons, stars, comets, … by name or id              |

The geodesy and map tools take the shape of the body as a `body` id from
`find_body`, such as `"mars"`, or as radii in metres. For GPS coordinates on
Earth, the ellipsoid tools also take `"wgs84"`.

The satellite tools take orbital elements as a two-line element set (`tle`), an
OMM record from CelesTrak (`omm`) or the id of a satellite in the bundled
snapshot (`satellite`), and times as ISO 8601 UTC strings. The server fetches
nothing: the assistant passes fresh elements in. Each result says how old the
elements are, in `elements_age_d`; they go stale within days.

All tools are pure and offline: no network access, no side effects.

## Resources

Each dataset in `@interstellar-tools/constants` is available as a JSON resource
at `interstellar://datasets/{name}`, where `name` is one of `planets`, `moons`,
`stars`, `comets`, `asteroids`, `asteroid-belts`, `interstellar-objects`,
`galaxies` or `systems`.

The snapshots in `@interstellar-tools/tracking` are resources too:
`interstellar://tracking/satellites`, twelve satellites' OMM records dated 4
November 2026, and `interstellar://tracking/probes`, eleven space probes and the
span of their ephemerides.

## Programmatic use

```ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer, startHttpServer } from '@interstellar-tools/mcp';

// stdio
await createServer().connect(new StdioServerTransport());

// or Streamable HTTP on http://127.0.0.1:3000/mcp
await startHttpServer({ port: 3000 });
```

MCP server exposing interstellar-tools equations and datasets.

## Interfaces

| Interface                                                              | Description |
| ---------------------------------------------------------------------- | ----------- |
| [HttpServerOptionsInterface](interfaces/HttpServerOptionsInterface.md) | -           |

## Variables

| Variable                                      | Description                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| [SERVER_NAME](variables/SERVER_NAME.md)       | -                                                                           |
| [SERVER_VERSION](variables/SERVER_VERSION.md) | The published package version, read from `package.json` so it never drifts. |

## Functions

| Function                                        | Description                                                                                                                                                                                         |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [createServer](functions/createServer.md)       | Create an MCP server with every interstellar-tools tool and resource registered. Connect it to a transport of your choice.                                                                          |
| [startHttpServer](functions/startHttpServer.md) | Serve the MCP server over Streamable HTTP, for clients that only accept remote servers. Runs stateless: every request gets a fresh server, which is cheap because every tool is a pure calculation. |
