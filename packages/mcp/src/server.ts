import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerBodies } from './bodies.js';
import { registerAnomalyTools } from './tools/anomalies.js';
import { registerManoeuvreTools } from './tools/manoeuvres.js';
import { registerOrbitTools } from './tools/orbits.js';
import { registerTimeTools } from './tools/time.js';

export const SERVER_NAME = 'interstellar-tools';

export const SERVER_VERSION = '0.0.0';

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
        'Deterministic orbital mechanics calculations. All lengths are in metres, masses in kg, speeds in m/s and μ in m³/s² unless a field name says otherwise. Angles are given as { value, unit: "deg" | "rad" }. Prefer these tools over mental arithmetic.'
    }
  );

  registerOrbitTools(server);
  registerManoeuvreTools(server);
  registerAnomalyTools(server);
  registerTimeTools(server);
  registerBodies(server);

  return server;
};
