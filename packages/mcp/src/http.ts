import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import { createServer as createHttpServer, type Server } from 'node:http';

import { createServer } from './server.js';

export interface HttpServerOptionsInterface {
  /** Port to listen on. Use 0 for a random free port. */
  port: number;
  /** Interface to bind to. Defaults to loopback only. */
  host?: string;
  /** Path that serves MCP requests. */
  path?: string;
}

/**
 * Serve the MCP server over Streamable HTTP, for clients that only accept
 * remote servers. Runs stateless: every request gets a fresh server, which is
 * cheap because every tool is a pure calculation.
 *
 * @example
 * ```ts
 * import { startHttpServer } from '@interstellar-tools/mcp';
 *
 * await startHttpServer({ port: 3000 }); // http://127.0.0.1:3000/mcp
 * ```
 */
export const startHttpServer = ({
  port,
  host = '127.0.0.1',
  path = '/mcp'
}: HttpServerOptionsInterface): Promise<Server> => {
  const http = createHttpServer(async (req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');

    if (pathname !== path) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');

      return;
    }

    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true
    });

    res.on('close', () => {
      void transport.close();
      void server.close();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (error) {
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' }).end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: { code: -32603, message: String(error) },
            id: null
          })
        );
      }
    }
  });

  return new Promise((resolve, reject) => {
    http.once('error', reject);
    http.listen(port, host, () => resolve(http));
  });
};
