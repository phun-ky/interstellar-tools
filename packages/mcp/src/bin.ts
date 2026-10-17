#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import type { AddressInfo } from 'node:net';
import process from 'node:process';
import { parseArgs } from 'node:util';

import { startHttpServer } from './http.js';
import { createServer } from './server.js';

const { values } = parseArgs({
  options: {
    http: { type: 'boolean', default: false },
    port: { type: 'string', default: process.env.PORT ?? '3000' },
    host: { type: 'string', default: '127.0.0.1' },
    'allowed-hosts': { type: 'string' },
    help: { type: 'boolean', short: 'h', default: false }
  }
});

if (values.help) {
  process.stdout
    .write(`Usage: interstellar-tools-mcp [--http] [--port <n>] [--host <addr>] [--allowed-hosts <names>]

  (default)                Serve over stdio, for clients that launch the server themselves
  --http                   Serve Streamable HTTP at http://<host>:<port>/mcp
  --port <n>               HTTP port (default: $PORT or 3000)
  --host <addr>            HTTP bind address (default: 127.0.0.1)
  --allowed-hosts <names>  Comma-separated host names requests may use
                           (default: localhost, 127.0.0.1 and [::1] on loopback)
`);
} else if (values.http) {
  const http = await startHttpServer({
    port: Number(values.port),
    host: values.host,
    allowedHosts: values['allowed-hosts']
      ?.split(',')
      .map((name) => name.trim())
      .filter(Boolean)
  });
  const { address, port } = http.address() as AddressInfo;

  // stdout stays clean for stdio clients; logs go to stderr
  process.stderr.write(
    `interstellar-tools MCP server listening on http://${address}:${port}/mcp\n`
  );
} else {
  await createServer().connect(new StdioServerTransport());
}
