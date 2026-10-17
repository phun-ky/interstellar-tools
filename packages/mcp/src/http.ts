import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

import {
  createServer as createHttpServer,
  type IncomingMessage,
  type Server,
  type ServerResponse
} from 'node:http';

import { createServer } from './server.js';

export interface HttpServerOptionsInterface {
  /** Port to listen on. Use 0 for a random free port. */
  port: number;
  /** Interface to bind to. Defaults to loopback only. */
  host?: string;
  /** Path that serves MCP requests. */
  path?: string;
  /**
   * Host names a request's `Host` header may name. Defaults to the loopback
   * names when bound to loopback, which blocks DNS rebinding: a web page that
   * points its own domain at 127.0.0.1 still sends that domain as `Host`.
   * Required to restrict hosts when binding to another interface.
   */
  allowedHosts?: string[];
}

const LOOPBACK = ['127.0.0.1', 'localhost', '::1'];
const LOOPBACK_HOSTS = ['127.0.0.1', 'localhost', '[::1]'];
/** Answer a rejected request with a JSON-RPC error, without reading its body. */
const reject = (res: ServerResponse, message: string) => {
  res.writeHead(403, { 'content-type': 'application/json' }).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message },
      id: null
    })
  );
};
/** The request's `Host` name if allowed, or the reason it isn't. */
const checkHost = (
  req: IncomingMessage,
  allowed: string[]
): { ok: true } | { ok: false; reason: string } => {
  const header = req.headers.host;

  if (!header) return { ok: false, reason: 'Missing Host header' };

  try {
    const { hostname } = new URL(`http://${header}`);

    return allowed.includes(hostname)
      ? { ok: true }
      : { ok: false, reason: `Invalid Host: ${hostname}` };
  } catch {
    return { ok: false, reason: `Invalid Host header: ${header}` };
  }
};

/**
 * Serve the MCP server over Streamable HTTP, for clients that only accept
 * remote servers. Runs stateless: every request gets a fresh server, which is
 * cheap because every tool is a pure calculation.
 *
 * Requests whose `Host` header isn't allowed are rejected with 403 before they
 * reach the server. Bound to loopback (the default), only `localhost`,
 * `127.0.0.1` and `[::1]` are allowed, which protects against DNS rebinding.
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
  path = '/mcp',
  allowedHosts = LOOPBACK.includes(host) ? LOOPBACK_HOSTS : undefined
}: HttpServerOptionsInterface): Promise<Server> => {
  const http = createHttpServer(async (req, res) => {
    if (allowedHosts) {
      const check = checkHost(req, allowedHosts);

      if (!check.ok) {
        reject(res, check.reason);

        return;
      }
    }

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
