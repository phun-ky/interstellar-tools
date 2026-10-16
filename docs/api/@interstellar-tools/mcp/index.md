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
`cloudflared tunnel --url http://localhost:3000` is enough for testing):

```shell
npx -y @interstellar-tools/mcp --http --port 3000
# → http://127.0.0.1:3000/mcp
```

The server is stateless and binds to `127.0.0.1` unless you pass
`--host 0.0.0.0`. Step-by-step setup for each assistant is in the
[MCP guide](https://phun-ky.net/interstellar-tools/guide/mcp/).

## Units

Every input and output field name ends with its unit: `r_m` (metres), `m0_kg`
(kilograms), `v_m_s` (m/s), `mu_m3_s2` (m³/s²), `T_s` / `T_d` (seconds / days).
Angles are passed as `{ "value": 28.5, "unit": "deg" }` (or `"rad"`) and
returned as `{ "rad": …, "deg": … }`.

## Tools

| Tool                         | What it computes                                     |
| ---------------------------- | ---------------------------------------------------- |
| `gravitational_parameter`    | μ = G·(M + m) from masses                            |
| `circular_speed`             | Circular orbit speed at radius r                     |
| `escape_speed`               | Escape speed at radius r                             |
| `vis_viva_speed`             | Speed at radius r on an orbit with semi-major axis a |
| `kepler_period`              | Orbital period from semi-major axis                  |
| `peri_apoapsis_radii`        | Periapsis and apoapsis radii from a and e            |
| `sphere_of_influence_radius` | Laplace sphere of influence                          |
| `hohmann_transfer`           | Both burns, total Δv and transfer time               |
| `rocket_delta_v`             | Tsiolkovsky rocket equation from Isp and masses      |
| `plane_change_delta_v`       | Δv for a pure inclination change                     |
| `solve_kepler`               | Eccentric anomaly from mean anomaly and eccentricity |
| `convert_anomaly`            | Mean ↔ eccentric ↔ true anomaly (elliptic orbits)    |
| `convert_time`               | Duration between units, attoseconds to gigayears     |
| `find_body`                  | Look up planets, moons, stars, comets, … by name     |

All tools are pure and offline: no network access, no side effects.

## Resources

Each dataset in `@interstellar-tools/constants` is available as a JSON resource
at `interstellar://datasets/{name}`, where `name` is one of `planets`, `moons`,
`stars`, `comets`, `asteroids`, `asteroid-belts`, `galaxies` or `systems`.

> \[!NOTE]
>
> The Alpha Centauri entries are left out of `stars` until their orbital model
> is corrected.

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
