import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { createRequire } from 'node:module';

import { registerBodies } from './bodies.js';
import { registerAnomalyTools } from './tools/anomalies.js';
import { registerDistanceTools } from './tools/distance.js';
import { registerGeodesyTools } from './tools/geodesy.js';
import { registerManoeuvreTools } from './tools/manoeuvres.js';
import { registerMapTools } from './tools/maps.js';
import { registerOrbitTools } from './tools/orbits.js';
import { registerStateVectorTools } from './tools/state-vectors.js';
import { registerTimeTools } from './tools/time.js';
import { registerTrackingTools } from './tools/tracking.js';

export const SERVER_NAME = 'interstellar-tools';

/** The published package version, read from `package.json` so it never drifts. */
export const SERVER_VERSION: string = createRequire(import.meta.url)(
  '../package.json'
).version;

/**
 * Create an MCP server with every interstellar-tools tool and resource
 * registered. Connect it to a transport of your choice.
 *
 * @example
 * ```ts
 * import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
 * import { createServer } from '@interstellar-tools/mcp';
 *
 * await createServer().connect(new StdioServerTransport());
 * ```
 */
export const createServer = (): McpServer => {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        'Deterministic orbital mechanics calculations. Every field with a unit ends with it: r_m is metres, mu_m3_s2 is m³/s², v_m_s is m/s, T_d is days. Dimensionless fields such as e have no suffix. Angles are given as { value, unit: "deg" | "rad" } and returned as { rad, deg }. Vectors are [x, y, z] arrays in an inertial frame centred on the body. Dataset distances are in au or km: use convert_distance before passing them to tools that take metres. Satellite tools take orbital elements as a TLE, an OMM record or the id of a satellite in the bundled snapshot, and times as ISO 8601 UTC strings; elements go stale within days, so prefer fresh ones. Prefer these tools over mental arithmetic.'
    }
  );

  registerOrbitTools(server);
  registerStateVectorTools(server);
  registerManoeuvreTools(server);
  registerAnomalyTools(server);
  registerTimeTools(server);
  registerDistanceTools(server);
  registerGeodesyTools(server);
  registerMapTools(server);
  registerTrackingTools(server);
  registerBodies(server);

  return server;
};
