# @interstellar-tools/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that
gives AI assistants deterministic, unit-explicit orbital mechanics calculations
and celestial body datasets, backed by `@interstellar-tools/equations`,
`@interstellar-tools/constants` and `@interstellar-tools/temporal`.

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

> [!NOTE]
>
> The Alpha Centauri entries are left out of `stars` until their orbital model
> is corrected.

## Programmatic use

```ts
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { createServer } from '@interstellar-tools/mcp';

await createServer().connect(new StdioServerTransport());
```
